import { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import type { Booking } from '../types';
import { CalendarCheck, Clock, ShieldCheck } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Carregando permissões...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-green-600" size={32} />
          Minhas Permissões
        </h1>
        <p className="text-gray-500 mt-2">
          Aqui estão as salas que você tem acesso autorizado.
        </p>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Você não possui agendamentos ativos.</p>
          </div>
        ) : (
          appointments.map((booking) => {
            const daysLeft = differenceInDays(new Date(booking.endDate), new Date());
            
            return (
              <div key={booking.id} className="bg-white border-l-4 border-green-500 shadow rounded-r-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Informações da Sala */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
                      AUTORIZADO
                    </span>
                    <span className="text-gray-400 text-sm">{booking.space?.type}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{booking.space?.name}</h3>
                  <p className="text-gray-500 text-sm">ID da Reserva: {booking.id.slice(0, 8)}...</p>
                </div>

                {/* Informações de Data */}
                <div className="bg-gray-50 p-4 rounded-lg min-w-[250px]">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <CalendarCheck size={18} />
                    <span className="font-semibold">Válido até:</span>
                  </div>
                  <p className="text-xl font-mono text-slate-800">
                    {format(new Date(booking.endDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                  
                  {/* Aviso de expiração */}
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Clock size={16} className={daysLeft < 3 ? "text-red-500" : "text-blue-500"} />
                    <span className={daysLeft < 3 ? "text-red-600 font-bold" : "text-gray-600"}>
                      {daysLeft < 0 ? "Expirado" : `Expira em ${daysLeft} dias`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
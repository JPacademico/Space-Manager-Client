import { useEffect, useState } from 'react';
import { bookingService, spaceService } from '../services/api';
import type { Space } from '../types';
import { Calendar, Users } from 'lucide-react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export function Catalog() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  
  // Estados do Formulário de Reserva
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [weeks, setWeeks] = useState(1);

  useEffect(() => {
    spaceService.getAll()
      .then((res) => {
        // Garante que só salvamos se for array
        if (Array.isArray(res.data)) {
          setSpaces(res.data);
        } else {
          console.error("Recebemos algo que não é lista:", res.data);
          toast.error("Erro ao conectar com Ngrok");
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleBook = async () => {
    if (!selectedSpace) return;
    
    const loadingToast = toast.loading('Processando reserva...');

    try {
      await bookingService.create({
        spaceId: selectedSpace,
        startDate: startDate,
        durationWeeks: Number(weeks)
      });
      
      toast.dismiss(loadingToast);
      toast.success('Solicitação enviada! Aguarde aprovação.', { duration: 4000 });
      
      setSelectedSpace(null);
    } catch (error) {
      
      toast.dismiss(loadingToast);
      
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || 'Erro desconhecido.';

      toast.error(message, {
        style: { border: '1px solid #EF4444', color: '#B91C1C' }
      });
    }
  };

  return (
    // UPDATED: p-4 for mobile, p-8 for desktop
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Espaços Disponíveis</h1>
      
      {/* UPDATED: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(spaces) && spaces.map((space) => (
          <div key={space.id} className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white">
            <div className="h-48 w-full bg-gray-200">
              <img 
                src={space.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"} 
                alt={space.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-bold">{space.name}</h2>
              <p className="text-gray-500">{space.type}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Users size={16} /> <span>Capacidade: {space.capacity}</span>
              </div>

              {/* Botão de Reservar ou Formulário */}
              {selectedSpace === space.id ? (
                <div className="mt-4 bg-gray-50 p-3 rounded animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-medium mb-1">Data Início:</label>
                  <input 
                    type="date" 
                    className="border p-2 w-full mb-3 rounded"
                    onChange={e => setStartDate(e.target.value)} 
                  />
                  
                  <label className="block text-sm font-medium mb-1">Semanas:</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={weeks} 
                    className="border p-2 w-full mb-4 rounded"
                    onChange={e => setWeeks(Number(e.target.value))} 
                  />
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedSpace(null)}
                      className="bg-gray-200 text-gray-700 flex-1 py-2 rounded hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleBook}
                      className="bg-green-600 text-white flex-1 py-2 rounded hover:bg-green-700 transition font-medium"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedSpace(space.id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                >
                  <Calendar size={18} /> Solicitar Reserva
                </button>
              )}
            </div>
          </div>
        ))}
        {(!Array.isArray(spaces) || spaces.length === 0) && (
          <div className="col-span-3 text-center text-gray-500 py-10">
            <p>Nenhuma sala encontrada ou erro de conexão.</p>
          </div>
        )}
      </div>
    </div>
  );
}
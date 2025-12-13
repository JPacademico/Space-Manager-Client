import { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import { type Booking } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

export function Admin() {
  const [pending, setPending] = useState<Booking[]>([]);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = () => {
    bookingService.getPending().then(res => setPending(res.data));
  };

  const handleApprove = async (id: string) => {
    try {
      await bookingService.approve(id);
      alert('Aprovado com sucesso!');
      loadPending();
    } catch (error: any) {
      // Shows "Space is already booked..." if conflict occurs
      alert(`Não foi possível aprovar: ${error.response?.data?.message || 'Erro interno'}`);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Área Administrativa</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">Sala</th>
              <th className="p-4">Datas</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(booking => (
              <tr key={booking.id} className="border-b">
                <td className="p-4">{booking.userId}</td> 
                {/* Nota: Idealmente mostrariamos o email, mas o endpoint precisa incluir 'user' */}
                <td className="p-4 font-medium">{booking.space?.name}</td>
                <td className="p-4 text-sm">
                  {new Date(booking.startDate).toLocaleDateString()} até <br/>
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                    {booking.status}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleApprove(booking.id)}
                    className="text-green-600 hover:text-green-800 mr-4"
                    title="Aprovar"
                  >
                    <CheckCircle />
                  </button>
                  <button className="text-red-600 hover:text-red-800" title="Rejeitar">
                    <XCircle />
                  </button>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhuma solicitação pendente.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
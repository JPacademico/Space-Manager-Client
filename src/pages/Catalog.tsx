import { useEffect, useState } from 'react';
import { bookingService, spaceService } from '../services/api';
import type { Space } from '../types';
import { Calendar, Users } from 'lucide-react';
import { AxiosError } from 'axios';

export function Catalog() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  
  // Estados do Formulário de Reserva
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [weeks, setWeeks] = useState(1);

  useEffect(() => {
    spaceService.getAll().then((res) => setSpaces(res.data));
  }, []);

  const handleBook = async () => {
    if (!selectedSpace) return;
    try {
      await bookingService.create({
        spaceId: selectedSpace,
        startDate: startDate,
        durationWeeks: Number(weeks)
      });
      alert('Solicitação enviada! Aguarde a aprovação do Admin.');
      setSelectedSpace(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      if (err.response && err.response.data) {
        alert(`Erro: ${err.response.data.message}`);
      } else {
        alert('Erro desconhecido ao tentar reservar.');
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Espaços Disponíveis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <div key={space.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{space.name}</h2>
            <p className="text-gray-500">{space.type}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Users size={16} /> <span>Capacidade: {space.capacity}</span>
            </div>
            
            {/* Botão de Reservar ou Formulário */}
            {selectedSpace === space.id ? (
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <label className="block text-sm">Data Início:</label>
                <input 
                  type="date" 
                  className="border p-1 w-full mb-2"
                  onChange={e => setStartDate(e.target.value)} 
                />
                <label className="block text-sm">Semanas:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={weeks} 
                  className="border p-1 w-full mb-2"
                  onChange={e => setWeeks(Number(e.target.value))} 
                />
                <button 
                  onClick={handleBook}
                  className="bg-green-600 text-white w-full py-1 rounded"
                >
                  Confirmar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setSelectedSpace(space.id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
              >
                <Calendar size={18} /> Solicitar Reserva
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
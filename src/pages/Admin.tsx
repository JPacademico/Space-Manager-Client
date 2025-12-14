import { useEffect, useState } from 'react';
import { bookingService, spaceService } from '../services/api';
import type { Booking } from '../types';
import { CheckCircle, XCircle, Plus, Layout } from 'lucide-react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export function Admin() {
  const [pending, setPending] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [type, setType] = useState('Laboratory');
  const [capacity, setCapacity] = useState(10);
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');

  const loadPending = () => {
    bookingService.getPending().then(res => setPending(res.data));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await bookingService.approve(id);
      toast.success('Agendamento Aprovado! ✅');
      loadPending();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      toast.error("Erro ao aprovar.");
    }
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await spaceService.create({ name, type, capacity: Number(capacity), description: desc, imageUrl: image });
      alert('Espaço criado com sucesso!');
      setName(''); setDesc(''); setShowForm(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      alert(`Erro ao criar espaço: ${err.response?.data?.message || 'Erro interno'}`);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600">Painel Administrativo</h1>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-slate-700"
        >
          <Plus size={18} /> {showForm ? 'Fechar Formulário' : 'Novo Espaço'}
        </button>
      </div>

      {/* --- ADD SPACE FORM --- */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Layout size={20} /> Cadastrar Nova Sala
          </h2>
          <form onSubmit={handleCreateSpace} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Nome da Sala (ex: Lab Química)" 
              className="border p-2 rounded" 
              value={name} onChange={e => setName(e.target.value)} required
            />
            <select 
              className="border p-2 rounded" 
              value={type} onChange={e => setType(e.target.value)}
            >
              <option value="Laboratory">Laboratório</option>
              <option value="Room">Sala de Aula</option>
              <option value="Coworking">Coworking</option>
              <option value="Auditorium">Auditório</option>
            </select>
            <input 
              type="number" placeholder="Capacidade" 
              className="border p-2 rounded" 
              value={capacity} onChange={e => setCapacity(Number(e.target.value))} required
            />
            <input 
              placeholder="Descrição curta" 
              className="border p-2 rounded" 
              value={desc} onChange={e => setDesc(e.target.value)}
            />
            <input 
              placeholder="URL da Imagem (ex: https://images.unsplash.com/...)" 
              className="border p-2 rounded md:col-span-2" 
              value={image} 
              onChange={e => setImage(e.target.value)}
            />
            <button className="bg-green-600 text-white py-2 rounded md:col-span-2 hover:bg-green-700 font-bold">
              Salvar Espaço
            </button>
          </form>
        </div>
      )}

      {/* --- PENDING BOOKINGS TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">Solicitações Pendentes</div>
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">Sala</th>
              <th className="p-4">Datas</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(booking => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{booking.user?.email}</td>
                <td className="p-4 font-medium">{booking.space?.name}</td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(booking.startDate).toLocaleDateString()} <br/>
                   até {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleApprove(booking.id)}
                    className="text-green-600 hover:text-green-800 mr-4 bg-green-50 p-2 rounded-full"
                    title="Aprovar"
                  >
                    <CheckCircle />
                  </button>
                  <button className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-full" title="Rejeitar">
                    <XCircle />
                  </button>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nada pendente por aqui.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
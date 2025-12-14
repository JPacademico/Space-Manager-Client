import { useState } from 'react';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // The backend expects: name, email, password
      await api.post('/auth/register', { name, email, password });
      alert('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      alert(`Erro ao criar conta: ${err.response?.data?.message || 'Tente novamente.'}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Crie sua Conta</h1>
        
        <label className="block text-sm mb-1">Nome Completo</label>
        <input className="w-full border p-2 mb-4 rounded" value={name} onChange={e => setName(e.target.value)} required />

        <label className="block text-sm mb-1">Email</label>
        <input className="w-full border p-2 mb-4 rounded" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label className="block text-sm mb-1">Senha</label>
        <input className="w-full border p-2 mb-6 rounded" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Registrar-se
        </button>

        <div className="mt-4 text-center text-sm">
          Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Faça Login</Link>
        </div>
      </form>
    </div>
  );
}
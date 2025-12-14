import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('Login Failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input 
          className="w-full border p-2 mb-4 rounded" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          className="w-full border p-2 mb-4 rounded" 
          placeholder="Password" 
          type="password"
          value={password} 
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
        <div className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Crie agora
          </Link>
        </div>
      </form>
    </div>
  );
}
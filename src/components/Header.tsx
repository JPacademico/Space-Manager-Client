import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="font-bold text-2xl text-slate-800 flex items-center gap-2">
        CajuManager
      </Link>
      
      <div className="flex gap-6 font-medium text-slate-600 items-center">
        <Link to="/" className="hover:text-blue-600 transition">Início</Link>
        <Link to="/catalog" className="hover:text-blue-600 transition">Disponíveis</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/my-appointments" className="hover:text-blue-600 transition">Meus Agendamentos</Link>
            
            {user?.role === 'ADMIN' && (
               <Link to="/admin" className="text-red-600 hover:text-red-800 transition">Admin Panel</Link>
            )}

            <div className="flex items-center gap-4 border-l pl-4 ml-2">
              <span className="text-sm text-gray-500 hidden md:inline">Olá, {user?.name}</span>
              <button 
                onClick={logout} 
                className="text-sm border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50 transition"
              >
                Sair
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
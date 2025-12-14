import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl text-slate-800 flex items-center gap-2">
          🚀 SpaceManager
        </Link>
        
        {/* Mobile Menu Button (Hamburger) */}
        <button 
          className="md:hidden text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <div className="hidden md:flex gap-6 font-medium text-slate-600 items-center">
           <Link to="/" className="hover:text-blue-600 transition">Início</Link>
           <Link to="/catalog" className="hover:text-blue-600 transition">Disponíveis</Link>
           
           {isAuthenticated ? (
             <>
               <Link to="/my-appointments" className="hover:text-blue-600 transition">Meus Agendamentos</Link>
               
               {user?.role === 'ADMIN' && (
                 <Link to="/admin" className="text-red-600 hover:text-red-800 transition">Admin Panel</Link>
               )}

               <div className="flex items-center gap-4 border-l pl-4 ml-2">
                  <span className="text-sm text-gray-500">Olá, {user?.name}</span>
                  <button 
                    onClick={logout} 
                    className="border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Sair
                  </button>
               </div>
             </>
           ) : (
             <div className="flex gap-4">
                <Link to="/register" className="text-slate-600 hover:text-blue-600 py-2 transition">
                  Criar Conta
                </Link>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Entrar
                </Link>
             </div>
           )}
        </div>
      </div>

      {/* Mobile Navigation (Only shows when isMenuOpen is true) */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t p-4 flex flex-col gap-4 text-center shadow-inner">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Início</Link>
          <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>Disponíveis</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-appointments" onClick={() => setIsMenuOpen(false)}>Meus Agendamentos</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-red-600 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
              )}
              <div className="border-t pt-2 mt-2">
                <span className="block text-sm text-gray-500 mb-2">Logado como {user?.name}</span>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-600 w-full py-2 border border-red-200 rounded">
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>Criar Conta</Link>
              <Link to="/login" className="bg-blue-600 text-white py-2 rounded" onClick={() => setIsMenuOpen(false)}>
                Entrar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
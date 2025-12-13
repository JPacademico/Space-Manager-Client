import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { spaceService } from '../services/api';
import { type Space } from '../types';
import { ArrowRight, Star } from 'lucide-react';

export function Home() {
  const [featuredSpaces, setFeaturedSpaces] = useState<Space[]>([]);

  useEffect(() => {
    spaceService.getAll().then((res) => {
      setFeaturedSpaces(res.data.slice(0, 3));
    });
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Encontre seu espaço ideal.</h1>
        <p className="text-xl text-slate-300 mb-8">
          Laboratórios, salas de reunião e coworking prontos para uso.
        </p>
        <Link 
          to="/catalog" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition inline-flex items-center gap-2"
        >
          Ver todos os espaços <ArrowRight size={20} />
        </Link>
      </section>

      {/* Destaques */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" /> Destaques
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSpaces.map((space) => (
            <div key={space.id} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {space.type}
              </span>
              <h3 className="text-xl font-bold mt-2">{space.name}</h3>
              <p className="text-gray-500 mt-2 line-clamp-2">{space.description || "Espaço disponível para reserva."}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
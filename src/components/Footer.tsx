import { Rocket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Rocket className="text-blue-500" />
          <span className="font-bold text-white">SpaceManager</span>
        </div>
        <div className="text-sm">
          <p>© 2025 Sistema de Gestão de Espaços.</p>
          <p>Desenvolvido para fins educativos.</p>
        </div>
      </div>
    </footer>
  );
}
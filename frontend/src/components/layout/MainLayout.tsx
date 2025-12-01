import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-lighter bg-dark-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-sm">
                  🪙
                </div>
                <span className="font-semibold text-white">Dropio.club</span>
              </div>
              <p className="text-sm text-neutral-400">
                Tu plataforma de AloCoins y Drops exclusivos
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Plataforma</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link to="/explore" className="hover:text-gold transition-colors">
                    Ver Drops
                  </Link>
                </li>
                <li>
                  <Link to="/wallet" className="hover:text-gold transition-colors">
                    Mis AloCoins
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link to="/terms" className="hover:text-gold transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-gold transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Soporte</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link to="/help" className="hover:text-gold transition-colors">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gold transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-lighter mt-8 pt-6 text-center">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Dropio.club - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

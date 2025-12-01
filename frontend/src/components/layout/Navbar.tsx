import { Link, useNavigate } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

export function Navbar() {
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-xl border-b border-gold/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center transition-all group-hover:scale-105 text-lg">
              🪙
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Dropio<span className="text-gold">.club</span>
            </span>
          </Link>

          {/* Search bar (only for authenticated users) */}
          {user && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar Drops..."
                  className="w-full pl-10 pr-4 py-2 border border-dark-lighter rounded-xl bg-dark-card text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          )}

          {/* Navigation links and user menu */}
          <div className="flex items-center gap-4">
            {/* Main navigation for authenticated users */}
            {user && (
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  to="/explore"
                  className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-gold hover:bg-dark-card rounded-lg transition-colors"
                >
                  Explorar
                </Link>
                <Link
                  to="/my-tickets"
                  className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-gold hover:bg-dark-card rounded-lg transition-colors"
                >
                  Mis Drops
                </Link>
                <Link
                  to="/wallet"
                  className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-gold hover:bg-dark-card rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="text-gold">🪙</span> AloCoins
                </Link>

                {/* Admin link - only visible to super-admin users */}
                {isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Admin
                  </Link>
                )}
              </nav>
            )}

            {/* User menu */}
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Mobile navigation tabs (only for authenticated users) */}
      {user && (
        <div className="border-t border-dark-lighter lg:hidden">
          <nav className="container mx-auto px-4 flex items-center gap-1 overflow-x-auto">
            <Link
              to="/explore"
              className="px-4 py-3 text-sm font-medium text-neutral-300 hover:text-gold hover:bg-dark-card transition-colors whitespace-nowrap"
            >
              Explorar
            </Link>
            <Link
              to="/my-tickets"
              className="px-4 py-3 text-sm font-medium text-neutral-300 hover:text-gold hover:bg-dark-card transition-colors whitespace-nowrap"
            >
              Mis Drops
            </Link>
            <Link
              to="/wallet"
              className="px-4 py-3 text-sm font-medium text-gold transition-colors whitespace-nowrap flex items-center gap-1"
            >
              🪙 AloCoins
            </Link>

            {/* Admin link for mobile - only visible to super-admin users */}
            {isAdmin() && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-3 text-sm font-medium text-red-400 transition-colors whitespace-nowrap"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { useState, useRef, useEffect } from 'react';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="outline" size="sm" className="border-dark-lighter text-neutral-300 hover:text-gold hover:border-gold bg-transparent">
            Iniciar Sesión
          </Button>
        </Link>
        <Link to="/register">
          <Button size="sm" className="bg-gradient-to-br from-gold to-gold-dark text-dark font-semibold hover:shadow-[0_5px_20px_rgba(244,185,66,0.3)]">
            Registrarse
          </Button>
        </Link>
      </div>
    );
  }

  // Get user initials for avatar
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-dark-card rounded-lg px-3 py-2 transition-colors"
      >
        {/* User avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark text-dark rounded-full flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>

        {/* User name (hidden on mobile) */}
        <span className="hidden md:block text-sm font-medium text-white">
          {fullName || user.email.split('@')[0]}
        </span>

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-dark-card rounded-xl shadow-2xl border border-dark-lighter py-2 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-dark-lighter">
            <p className="text-sm font-medium text-white">
              {fullName || 'Usuario'}
            </p>
            <p className="text-xs text-neutral-500 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-dark-lighter hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi Perfil
            </Link>

            <Link
              to="/explore"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-dark-lighter hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explorar Drops
            </Link>

            <Link
              to="/my-tickets"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-dark-lighter hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Mis Drops
            </Link>

            <Link
              to="/wallet"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-dark-lighter hover:text-gold transition-colors"
            >
              <span className="w-4 h-4 flex items-center justify-center text-gold">🪙</span>
              Mis AloCoins
            </Link>

            {/* Organizer option - visible for all users who want to organize */}
            <Link
              to="/organizer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-dark-lighter hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Panel Organizador
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-dark-lighter py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-lighter transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

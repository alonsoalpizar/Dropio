import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/hooks/useAuth';
import { useMyTickets } from '@/hooks/useRaffles';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Ticket, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export const MyTicketsPage = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'finished' | 'won'>('active');
  const [page] = useState(1);

  const { data, isLoading, error } = useMyTickets(page, 20);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Cargando..." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Cargando tus Drops..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error al cargar tus Drops</p>
      </div>
    );
  }

  const tickets = data?.tickets || [];

  const filteredTickets = tickets.filter((ticket) => {
    const now = new Date();
    const drawDate = new Date(ticket.raffle.draw_date);

    if (activeTab === 'active') {
      return ticket.raffle.status === 'active' && drawDate > now;
    } else if (activeTab === 'finished') {
      return ticket.raffle.status === 'completed' || (ticket.raffle.status === 'active' && drawDate <= now);
    } else if (activeTab === 'won') {
      return ticket.raffle.winner_user_id === user.id;
    }
    return false;
  });

  const totalTickets = tickets.reduce((sum, t) => sum + t.numbers.length, 0);
  const totalSpent = tickets.reduce((sum, t) => sum + parseFloat(t.total_spent || '0'), 0);
  const totalWon = tickets.filter(t => t.raffle.winner_user_id === user.id).length;

  const tabs = [
    { id: 'active' as const, label: 'Activos', count: tickets.filter(t => t.raffle.status === 'active').length },
    { id: 'finished' as const, label: 'Finalizados', count: tickets.filter(t => t.raffle.status === 'completed').length },
    { id: 'won' as const, label: 'Ganados', count: totalWon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-white">Mis Drops</h1>
        <p className="text-lg text-neutral-400 mt-2">
          Gestiona tus participaciones en Drops
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Total Participaciones</p>
              <p className="text-3xl font-bold text-white">{totalTickets}</p>
            </div>
            <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-gold" />
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">AloCoins Invertidos</p>
              <p className="text-3xl font-bold text-white flex items-center gap-2">
                <span className="text-gold">🪙</span>
                {formatCurrency(totalSpent).replace('₡', '')}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent-green" />
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Drops Ganados</p>
              <p className="text-3xl font-bold text-white">{totalWon}</p>
            </div>
            <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent-purple" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-card rounded-xl border border-dark-lighter overflow-hidden">
        <div className="border-b border-dark-lighter">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-gold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-gold/20 text-gold' : 'bg-dark-lighter text-neutral-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={<Ticket className="w-12 h-12 text-gold" />}
              title={
                activeTab === 'active'
                  ? '¡Empieza a participar!'
                  : activeTab === 'finished'
                  ? 'No hay Drops finalizados'
                  : '¡Aún no has ganado!'
              }
              description={
                activeTab === 'active'
                  ? 'Explora los Drops activos y participa con tus AloCoins.'
                  : activeTab === 'finished'
                  ? 'Los Drops en los que has participado y ya finalizaron aparecerán aquí.'
                  : 'Sigue participando en Drops. ¡Tu momento llegará!'
              }
              action={{
                label: 'Explorar Drops',
                onClick: () => navigate('/explore'),
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.raffle.id}
                  className="border border-dark-lighter rounded-xl p-6 hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        to={`/raffles/${ticket.raffle.id}`}
                        className="text-lg font-semibold text-white hover:text-gold transition-colors"
                      >
                        {ticket.raffle.title}
                      </Link>
                      <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                        {ticket.raffle.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ticket.raffle.status === 'active'
                          ? 'bg-accent-green/20 text-accent-green'
                          : ticket.raffle.status === 'completed'
                          ? 'bg-accent-blue/20 text-accent-blue'
                          : 'bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      {ticket.raffle.status === 'active' ? 'Activo' : 'Finalizado'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(ticket.raffle.draw_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Ticket className="w-4 h-4" />
                      <span>{ticket.numbers.length} número(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gold">
                      <span>🪙</span>
                      <span>{formatCurrency(parseFloat(ticket.total_spent)).replace('₡', '')} AloCoins</span>
                    </div>
                  </div>

                  {/* Números comprados */}
                  <div className="border-t border-dark-lighter pt-4">
                    <p className="text-sm font-medium text-neutral-300 mb-2">
                      Tus números:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ticket.numbers.map((num) => (
                        <span
                          key={num.id}
                          className={`px-3 py-1 rounded-lg text-sm font-mono font-semibold ${
                            ticket.raffle.winner_number === num.number
                              ? 'bg-gold/20 text-gold ring-2 ring-gold/50'
                              : 'bg-dark-lighter text-neutral-300'
                          }`}
                        >
                          {num.number}
                          {ticket.raffle.winner_number === num.number && ' 🏆'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {ticket.raffle.winner_user_id === user.id && (
                    <div className="mt-4 bg-gold/10 border border-gold/30 rounded-xl p-4">
                      <p className="text-gold font-semibold flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        ¡Felicidades! Has ganado este Drop
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-dark-card rounded-xl border border-gold/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <span className="text-gold">🪙</span> ¿Cómo funcionan los Drops?
        </h3>
        <p className="text-neutral-400 mb-4">
          Todos nuestros Drops están basados en Lotería Nacional de Costa Rica, garantizando total transparencia y verificabilidad.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2 h-2 bg-accent-green rounded-full"></span>
            100% Verificable
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2 h-2 bg-accent-green rounded-full"></span>
            Transparente
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2 h-2 bg-accent-green rounded-full"></span>
            Seguro
          </div>
        </div>
      </div>
    </div>
  );
};

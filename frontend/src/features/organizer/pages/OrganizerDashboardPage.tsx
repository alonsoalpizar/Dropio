import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useAuth';
import { useRafflesList } from '@/hooks/useRaffles';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus, TrendingUp, Users, Package, Calendar, HelpCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export const OrganizerDashboardPage = () => {
  const user = useUser();
  const navigate = useNavigate();

  // Obtener Drops del usuario actual
  const { data: myRaffles, isLoading } = useRafflesList({
    user_id: user?.id,
    page_size: 100
  });

  if (!user) {
    return <LoadingSpinner text="Cargando panel..." />;
  }

  if (isLoading) {
    return <LoadingSpinner text="Cargando estadísticas..." />;
  }

  const raffles = myRaffles?.raffles || [];

  // Calcular estadísticas desde los Drops del usuario
  const activeRaffles = raffles.filter(r => r.status === 'active').length;
  const completedRaffles = raffles.filter(r => r.status === 'completed').length;
  const draftRaffles = raffles.filter(r => r.status === 'draft').length;

  // Calcular ventas totales (solo de Drops activos y completados)
  const totalSales = raffles
    .filter(r => r.status === 'active' || r.status === 'completed')
    .reduce((sum, r) => sum + (parseFloat(r.total_revenue || '0')), 0);

  const stats = {
    activeRaffles,
    totalSales,
    draftRaffles,
    completedRaffles,
  };

  const hasRaffles = raffles.length > 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-white">
          Panel de Organizador
        </h1>
        <p className="text-lg text-neutral-400 mt-2">
          Gestiona tus Drops y monitorea tus ventas
        </p>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Estadísticas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Drops Activos</p>
                <p className="text-3xl font-bold text-white">{stats.activeRaffles}</p>
                <p className="text-xs text-neutral-500 mt-1">En venta actualmente</p>
              </div>
              <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-gold" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Recaudado</p>
                <p className="text-3xl font-bold text-gold flex items-center gap-1">
                  <span className="text-xl">🪙</span>
                  {totalSales.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500 mt-1">AloCoins generados</p>
              </div>
              <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-green" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Borradores</p>
                <p className="text-3xl font-bold text-white">{stats.draftRaffles}</p>
                <p className="text-xs text-neutral-500 mt-1">Drops sin publicar</p>
              </div>
              <div className="w-12 h-12 bg-accent-blue/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-blue" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Completados</p>
                <p className="text-3xl font-bold text-white">{stats.completedRaffles}</p>
                <p className="text-xs text-neutral-500 mt-1">Drops finalizados</p>
              </div>
              <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-purple" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions or Empty State */}
      {hasRaffles ? (
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Mis Drops
            </h2>
            <Button
              onClick={() => navigate('/organizer/raffles/new')}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Drop
            </Button>
          </div>

          <div className="space-y-4">
            {raffles.slice(0, 5).map((raffle) => (
              <div
                key={raffle.id}
                onClick={() => navigate(`/raffles/${raffle.id}`)}
                className="flex items-center justify-between p-4 rounded-xl border border-dark-lighter hover:border-gold/30 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {raffle.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(raffle.draw_date)}
                    </span>
                    <span>
                      {raffle.sold_count}/{raffle.total_numbers} vendidos
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Recaudado</p>
                    <p className="font-semibold text-gold flex items-center gap-1">
                      🪙 {parseFloat(raffle.total_revenue || '0').toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      raffle.status === 'active'
                        ? 'bg-accent-green/20 text-accent-green'
                        : raffle.status === 'draft'
                        ? 'bg-dark-lighter text-neutral-300'
                        : raffle.status === 'completed'
                        ? 'bg-accent-blue/20 text-accent-blue'
                        : 'bg-gold/20 text-gold'
                    }`}
                  >
                    {raffle.status === 'active' ? 'Activo' :
                     raffle.status === 'draft' ? 'Borrador' :
                     raffle.status === 'completed' ? 'Completado' : 'Suspendido'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {raffles.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/organizer/raffles')}
                className="text-gold hover:text-gold-light font-medium"
              >
                Ver todos los Drops ({raffles.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <EmptyState
            icon={<Package className="w-12 h-12 text-gold" />}
            title="¡Comienza tu primer Drop!"
            description="Crea Drops verificables y transparentes basados en Lotería Nacional. Es fácil, rápido y seguro."
            action={{
              label: "Crear mi primer Drop",
              onClick: () => navigate('/organizer/raffles/new')
            }}
          />
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gold/10 rounded-xl border border-gold/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gold" />
          ¿Necesitas ayuda?
        </h3>
        <p className="text-neutral-400 mb-4">
          Aprende cómo crear Drops exitosos, configurar premios y gestionar participantes.
        </p>
        <Button
          onClick={() => navigate('/help')}
          variant="gold"
          size="sm"
        >
          Ver guía de inicio
        </Button>
      </div>
    </div>
  );
};

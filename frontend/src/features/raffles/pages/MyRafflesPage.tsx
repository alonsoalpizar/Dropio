import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRafflesList } from '@/hooks/useRaffles';
import { useUser } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Plus, Package } from 'lucide-react';
import type { RaffleStatus, Raffle } from '@/types/raffle';

const statusLabels: Record<RaffleStatus, string> = {
  draft: 'Borrador',
  active: 'Activo',
  suspended: 'Suspendido',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const statusColors: Record<RaffleStatus, string> = {
  draft: 'bg-dark-lighter text-neutral-300',
  active: 'bg-accent-green/20 text-accent-green',
  suspended: 'bg-gold/20 text-gold',
  completed: 'bg-accent-blue/20 text-accent-blue',
  cancelled: 'bg-red-500/20 text-red-400',
};

export function MyRafflesPage() {
  const navigate = useNavigate();
  const user = useUser();
  const [filterStatus, setFilterStatus] = useState<RaffleStatus | 'all'>('all');

  // Fetch Drops created by current user
  const { data: rafflesData, isLoading, error } = useRafflesList({
    user_id: user?.id,
    status: filterStatus === 'all' ? undefined : filterStatus,
  });

  if (isLoading) {
    return <LoadingSpinner text="Cargando tus Drops..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">
          Error al cargar tus Drops. Por favor, intenta nuevamente.
        </p>
      </div>
    );
  }

  const raffles = rafflesData?.raffles || [];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link to="/organizer" className="inline-flex items-center text-gold hover:text-gold-light">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver al panel
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Mis Drops
          </h1>
          <p className="text-neutral-400 mt-2">
            Gestiona los Drops que has creado
          </p>
        </div>
        <Button onClick={() => navigate('/organizer/raffles/new')}>
          <Plus className="w-5 h-5 mr-2" />
          Crear Drop
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-sm font-medium text-neutral-300 whitespace-nowrap">
            Filtrar por:
          </span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-gradient-to-br from-gold to-gold-dark text-dark'
                : 'bg-dark-lighter text-neutral-300 hover:text-white'
            }`}
          >
            Todos
          </button>
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as RaffleStatus)}
              className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-gradient-to-br from-gold to-gold-dark text-dark'
                  : 'bg-dark-lighter text-neutral-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Raffles List */}
      {raffles.length === 0 ? (
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-8">
          <EmptyState
            icon={<Package className="w-12 h-12 text-gold" />}
            title={filterStatus === 'all' ? 'No tienes Drops' : `No tienes Drops ${statusLabels[filterStatus]?.toLowerCase()}`}
            description={filterStatus === 'all' ? 'Crea tu primer Drop para comenzar' : 'Intenta cambiar el filtro para ver otros Drops'}
            action={
              filterStatus === 'all'
                ? {
                    label: 'Crear Drop',
                    onClick: () => navigate('/organizer/raffles/new'),
                  }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="bg-dark-card rounded-xl border border-dark-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-lighter border-b border-dark-lighter">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Drop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-lighter">
                {raffles.map((raffle: Raffle) => {
                  const soldPercentage = (raffle.sold_count / raffle.total_numbers) * 100;
                  const daysUntilDraw = Math.ceil(
                    (new Date(raffle.draw_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr
                      key={raffle.id}
                      className="hover:bg-dark-lighter/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/raffles/${raffle.uuid}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {raffle.title}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {raffle.total_numbers} números
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[raffle.status]
                          }`}
                        >
                          {statusLabels[raffle.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-400">
                              {raffle.sold_count} vendidos
                            </span>
                            <span className="font-medium text-white">
                              {soldPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-dark-lighter rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-gold to-gold-dark h-2 rounded-full transition-all"
                              style={{ width: `${soldPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gold flex items-center gap-1">
                            🪙 {parseFloat(raffle.total_revenue || '0').toLocaleString()}
                          </p>
                          <p className="text-xs text-neutral-500">
                            🪙 {parseFloat(raffle.price_per_number).toFixed(0)}/número
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white">
                            {new Date(raffle.draw_date).toLocaleDateString()}
                          </p>
                          {raffle.status === 'active' && daysUntilDraw > 0 && (
                            <p className="text-xs text-neutral-500">
                              En {daysUntilDraw} {daysUntilDraw === 1 ? 'día' : 'días'}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="gold"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/raffles/${raffle.uuid}`);
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {rafflesData && rafflesData.pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={rafflesData.pagination.page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-neutral-400">
            Página {rafflesData.pagination.page} de {rafflesData.pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={rafflesData.pagination.page === rafflesData.pagination.total_pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

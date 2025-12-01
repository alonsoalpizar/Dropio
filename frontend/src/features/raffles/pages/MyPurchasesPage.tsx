import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Ticket, TrendingUp, Calendar } from 'lucide-react';

// Placeholder interface - will be replaced with real data from backend
interface Purchase {
  id: number;
  raffle_title: string;
  raffle_uuid: string;
  numbers: string[];
  total_amount: string;
  purchase_date: string;
  raffle_status: 'active' | 'completed' | 'cancelled';
  draw_date: string;
}

export function MyPurchasesPage() {
  const navigate = useNavigate();

  // Mock data - will be replaced with real API call
  const purchases: Purchase[] = [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-dark-lighter border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Mis Compras
        </h1>
        <p className="text-neutral-400 mt-2">
          Historial de participaciones que has comprado
        </p>
      </div>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-8">
          <EmptyState
            icon={<ShoppingCart className="w-12 h-12 text-gold" />}
            title="No has comprado participaciones aún"
            description="Explora los Drops activos y participa con tus AloCoins"
            action={{
              label: 'Explorar Drops',
              onClick: () => navigate('/explore'),
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => {
            const isPending = purchase.raffle_status === 'active';
            const isCompleted = purchase.raffle_status === 'completed';

            return (
              <div
                key={purchase.id}
                className="bg-dark-card rounded-xl border border-dark-lighter p-6 hover:border-gold/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/raffles/${purchase.raffle_uuid}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {purchase.raffle_title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isPending
                            ? 'bg-accent-green/20 text-accent-green'
                            : isCompleted
                            ? 'bg-accent-blue/20 text-accent-blue'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {isPending ? 'Activo' : isCompleted ? 'Completado' : 'Cancelado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-neutral-400 mb-1 flex items-center gap-1">
                          <Ticket className="w-4 h-4" />
                          Números comprados
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {purchase.numbers.map((number) => (
                            <span
                              key={number}
                              className="inline-flex items-center justify-center w-10 h-10 bg-gold/20 text-gold font-semibold rounded-lg text-sm"
                            >
                              {number}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-neutral-400 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Monto total
                        </p>
                        <p className="text-xl font-bold text-gold flex items-center gap-1">
                          <span>🪙</span>
                          {parseFloat(purchase.total_amount).toLocaleString()} AloCoins
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Comprado el {new Date(purchase.purchase_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-neutral-400 mb-1 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fecha del Drop
                        </p>
                        <p className="font-medium text-white">
                          {new Date(purchase.draw_date).toLocaleDateString()}
                        </p>
                        {isPending && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {Math.ceil(
                              (new Date(purchase.draw_date).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{' '}
                            días restantes
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="gold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/raffles/${purchase.raffle_uuid}`);
                    }}
                  >
                    Ver Drop
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {purchases.length > 0 && (
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Resumen de Compras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-lighter rounded-xl p-4">
              <p className="text-sm text-neutral-400 mb-1">
                Total invertido
              </p>
              <p className="text-2xl font-bold text-gold flex items-center gap-2">
                <span>🪙</span>
                {purchases
                  .reduce((sum, p) => sum + parseFloat(p.total_amount), 0)
                  .toLocaleString()}
              </p>
            </div>

            <div className="bg-dark-lighter rounded-xl p-4">
              <p className="text-sm text-neutral-400 mb-1">
                Participaciones compradas
              </p>
              <p className="text-2xl font-bold text-white">
                {purchases.reduce((sum, p) => sum + p.numbers.length, 0)}
              </p>
            </div>

            <div className="bg-dark-lighter rounded-xl p-4">
              <p className="text-sm text-neutral-400 mb-1">
                Drops activos
              </p>
              <p className="text-2xl font-bold text-accent-green">
                {purchases.filter((p) => p.raffle_status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

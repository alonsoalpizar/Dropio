import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRaffleDetail, usePublishRaffle, useDeleteRaffle } from '../../../hooks/useRaffles';
import { useAuth } from '../../../hooks/useAuth';
import { useRaffleWebSocket } from '../../../hooks/useRaffleWebSocket';
import { NumberGrid } from '../components/NumberGrid';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { FloatingCheckoutButton } from '../../../components/ui/FloatingCheckoutButton';
import { RaffleImageGallery } from '../../../components/RaffleImageGallery';
import { reservationService, Reservation } from '../../../services/reservationService';
import { toast } from 'sonner';
import {
  formatCurrency,
  formatDateTime,
  getStatusLabel,
  getDrawMethodLabel,
} from '../../../lib/utils';
import { ArrowLeft, Check, Clock, Trash2, Pause, Play, Calendar, Edit } from 'lucide-react';

const statusColors = {
  draft: 'bg-neutral-700 text-neutral-300',
  active: 'bg-accent-green/20 text-accent-green border border-accent-green/30',
  suspended: 'bg-gold/20 text-gold border border-gold/30',
  completed: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

export function RaffleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useRaffleDetail(id!, {
    includeNumbers: true,
    includeImages: true,
  });

  const publishMutation = usePublishRaffle();
  const deleteMutation = useDeleteRaffle();

  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [isLoadingReservation, setIsLoadingReservation] = useState(false);
  const [sessionId] = useState(() => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const isOwner = user && data?.raffle && user.id === data.raffle.user_id;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const { isConnected, onNumberUpdate, onReservationExpired } = useRaffleWebSocket(data?.raffle?.uuid);

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeNumberUpdate = onNumberUpdate((update) => {
      const isMyUpdate = update.user_id === user?.id;
      if (!isMyUpdate) {
        refetch();
        if (update.status === 'sold') {
          toast.info(`Número ${update.number_id} vendido`);
        } else if (update.status === 'reserved') {
          toast.info(`Número ${update.number_id} reservado`);
        } else if (update.status === 'available') {
          toast.info(`Número ${update.number_id} disponible`);
        }
      }
    });

    const unsubscribeExpired = onReservationExpired(() => {
      refetch();
    });

    return () => {
      unsubscribeNumberUpdate();
      unsubscribeExpired();
    };
  }, [isConnected, onNumberUpdate, onReservationExpired, refetch, user?.id]);

  useEffect(() => {
    const loadOrCleanup = async () => {
      if (!data || !user || isOwner) return;
      try {
        const prevReservation = await reservationService.getActiveForRaffle(data.raffle.uuid);
        if (prevReservation) {
          setActiveReservation(prevReservation);
          setSelectedNumbers(prevReservation.number_ids);
        }
      } catch (error) {
        console.error('Error al cargar reserva activa:', error);
      }
    };
    loadOrCleanup();
  }, [data, user, isOwner]);

  useEffect(() => {
    if (!activeReservation) return;

    const checkExpiration = () => {
      const expiresAt = new Date(activeReservation.expires_at);
      const now = new Date();
      const timeLeft = expiresAt.getTime() - now.getTime();

      if (timeLeft <= 0) {
        toast.error('Tu reserva ha expirado', { description: 'Los números han sido liberados' });
        setActiveReservation(null);
        setSelectedNumbers([]);
        return;
      }

      if (timeLeft <= 60 * 1000 && timeLeft > 59 * 1000) {
        toast.warning('¡Queda 1 minuto!', { description: 'Tu reserva está por expirar.', duration: 10000 });
      }

      if (timeLeft <= 30 * 1000 && timeLeft > 29 * 1000) {
        toast.warning('¡30 segundos!', { description: 'Tu reserva expirará pronto', duration: 10000 });
      }
    };

    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [activeReservation]);

  const handleNumberSelect = async (numberStr: string) => {
    if (isOwner || !user) {
      if (!user) toast.info('Inicia sesión para reservar números');
      return;
    }
    if (isLoadingReservation) return;

    const isAlreadySelected = selectedNumbers.includes(numberStr);

    try {
      setIsLoadingReservation(true);

      if (isAlreadySelected) {
        if (activeReservation) {
          if (selectedNumbers.length === 1) {
            await reservationService.cancel(activeReservation.id);
            setActiveReservation(null);
            setSelectedNumbers([]);
            toast.info('Reserva cancelada');
            refetch();
          } else {
            const updatedReservation = await reservationService.removeNumber(activeReservation.id, numberStr);
            setActiveReservation(updatedReservation);
            setSelectedNumbers(prev => prev.filter(n => n !== numberStr));
            toast.success('Número liberado');
            refetch();
          }
        } else {
          setSelectedNumbers(prev => prev.filter(n => n !== numberStr));
        }
      } else {
        const isFirstNumber = selectedNumbers.length === 0;
        if (isFirstNumber) {
          const reservation = await reservationService.create({
            raffle_id: data!.raffle.uuid,
            number_ids: [numberStr],
            session_id: sessionId,
          });
          setActiveReservation(reservation);
          setSelectedNumbers([numberStr]);
          await refetch();
          toast.success('Número reservado', { description: 'Tienes 10 minutos para completar tu compra' });
        } else {
          if (!activeReservation) throw new Error('No hay reserva activa');
          const updatedReservation = await reservationService.addNumber(activeReservation.id, numberStr);
          setActiveReservation(updatedReservation);
          setSelectedNumbers(prev => [...prev, numberStr]);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Email no verificado', { description: 'Verifica tu email para poder reservar números' });
      } else if (error.response?.status === 409) {
        toast.error('Número no disponible', { description: 'Este número ya está reservado por otro usuario' });
      } else {
        toast.error('Error al procesar', { description: 'No se pudo procesar la acción' });
      }
    } finally {
      setIsLoadingReservation(false);
    }
  };

  const handlePublish = async () => {
    if (!data?.raffle?.id) return;
    const confirmed = confirm('¿Estás seguro de publicar este Drop? Una vez publicado será visible para todos.');
    if (!confirmed) return;

    try {
      await publishMutation.mutateAsync(data.raffle.id);
      toast.success('Drop publicado exitosamente');
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al publicar');
    }
  };

  const handleDelete = async () => {
    if (!data?.raffle?.id || !confirm('¿Estás seguro de eliminar este Drop?')) return;
    try {
      await deleteMutation.mutateAsync(data.raffle.id);
      toast.success('Drop eliminado');
      navigate('/explore');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar');
    }
  };

  const handleClearSelection = async () => {
    if (activeReservation) {
      try {
        await reservationService.cancel(activeReservation.id);
        setActiveReservation(null);
        setSelectedNumbers([]);
        toast.info('Reserva cancelada');
      } catch (error) {
        toast.error('Error al cancelar reserva');
      }
    } else {
      setSelectedNumbers([]);
    }
  };

  const handlePayNow = async () => {
    if (!activeReservation) {
      toast.error('No tienes números reservados');
      return;
    }
    if (!user) {
      toast.info('Inicia sesión para continuar');
      navigate(`/login?redirect=/raffles/${id}`);
      return;
    }

    try {
      await reservationService.confirm(activeReservation.id);
      setActiveReservation(null);
      setSelectedNumbers([]);
      toast.success('¡Gracias por tu compra!', {
        description: `Has comprado ${selectedNumbers.length} número(s)`,
        duration: 3000,
      });
      setTimeout(() => navigate('/my-tickets'), 2000);
    } catch (error) {
      toast.error('Error al procesar el pago');
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-medium mb-2">Error al cargar el Drop</p>
        <p className="text-sm text-neutral-400 mb-4">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
        <Link to="/explore">
          <Button variant="outline">Volver a explorar</Button>
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return <LoadingSpinner text="Cargando Drop..." />;
  }

  const { raffle, numbers = [], available_count, reserved_count, sold_count } = data;
  const soldPercentage = (sold_count / raffle.total_numbers) * 100;
  const daysUntilDraw = Math.ceil(
    (new Date(raffle.draw_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-neutral-400 hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver
      </button>

      {/* Hero Section */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gold/20 via-dark-card to-dark-card border border-gold/20">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[raffle.status]}`}>
                  {getStatusLabel(raffle.status)}
                </span>
                {raffle.status === 'active' && daysUntilDraw > 0 && (
                  <span className="px-3 py-1 bg-dark-lighter text-neutral-300 rounded-full text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {daysUntilDraw} {daysUntilDraw === 1 ? 'día' : 'días'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {raffle.title}
              </h1>

              <p className="text-lg text-neutral-400 mb-6 max-w-2xl">
                {raffle.description}
              </p>

              <div className="inline-flex flex-col bg-dark-lighter rounded-xl p-4 border border-dark-lighter">
                <span className="text-sm text-neutral-500 mb-1">Precio por número</span>
                <span className="text-3xl font-bold text-gold flex items-center gap-2">
                  🪙 {formatCurrency(Number(raffle.price_per_number)).replace('₡', '')} AloCoins
                </span>
              </div>
            </div>

            {/* CTA for participants */}
            {raffle.status === 'active' && available_count > 0 && !isOwner && (
              <div className="flex-shrink-0">
                {selectedNumbers.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-dark-lighter rounded-xl p-4 border border-gold/20">
                      <p className="text-sm text-neutral-400 mb-1">Números reservados</p>
                      <p className="text-3xl font-bold text-white">{selectedNumbers.length}</p>
                      <p className="text-sm text-gold mt-2 flex items-center gap-1">
                        🪙 {formatCurrency(selectedNumbers.length * Number(raffle.price_per_number)).replace('₡', '')} AloCoins
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={handlePayNow}
                      disabled={isLoadingReservation}
                      className="w-full"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Pagar Ahora
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleClearSelection}
                      disabled={isLoadingReservation}
                      className="w-full"
                    >
                      Limpiar selección
                    </Button>
                  </div>
                ) : (
                  <div className="text-center bg-dark-lighter rounded-xl p-6 border border-dark-lighter">
                    <p className="text-sm text-neutral-400 mb-3">
                      Selecciona números en la grilla
                    </p>
                    <p className="text-gold text-sm font-medium">
                      {available_count} números disponibles
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-col gap-2">
                {raffle.status === 'draft' && (
                  <>
                    <Link to={`/raffles/${id}/edit`}>
                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button onClick={handlePublish} disabled={publishMutation.isPending} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      {publishMutation.isPending ? 'Publicando...' : 'Publicar'}
                    </Button>
                    {raffle.sold_count === 0 && (
                      <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    )}
                  </>
                )}
                {raffle.status === 'active' && (
                  <Button variant="outline" className="w-full border-gold/30 text-gold hover:bg-gold/10">
                    <Pause className="w-4 h-4 mr-2" />
                    Suspender
                  </Button>
                )}
              </div>
            )}

            {isAdmin && !isOwner && (raffle.status === 'draft' || raffle.status === 'suspended') && raffle.sold_count === 0 && (
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar (Admin)
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-dark-lighter px-8 md:px-12 py-4 border-t border-dark-lighter">
          <div className="flex items-center justify-between text-sm text-neutral-400 mb-2">
            <span>Progreso de ventas</span>
            <span className="font-semibold text-white">{soldPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-dark rounded-full h-3">
            <div
              className="bg-gradient-to-r from-gold to-gold-dark rounded-full h-3 transition-all duration-500"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Disponibles</span>
            <div className="w-8 h-8 bg-accent-green/20 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-accent-green" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{available_count}</p>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Vendidos</span>
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-gold">🪙</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{sold_count}</p>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">Reservados</span>
            <div className="w-8 h-8 bg-accent-blue/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent-blue" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{reserved_count}</p>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">
              {raffle.my_total_spent ? 'Mi Inversión' : raffle.total_revenue ? 'Recaudación' : 'Total'}
            </span>
            <div className="w-8 h-8 bg-accent-purple/20 rounded-lg flex items-center justify-center">
              <span className="text-accent-purple">💰</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {raffle.my_total_spent
              ? formatCurrency(Number(raffle.my_total_spent))
              : raffle.total_revenue
              ? formatCurrency(Number(raffle.total_revenue))
              : '-'}
          </p>
        </div>
      </div>

      {/* Image Gallery */}
      {data.images && data.images.length > 0 && (
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Galería</h2>
          <RaffleImageGallery images={data.images} />
        </div>
      )}

      {/* Raffle Info */}
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Información del Drop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-500 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Fecha del sorteo
            </p>
            <p className="font-medium text-white">{formatDateTime(raffle.draw_date)}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Método de sorteo</p>
            <p className="font-medium text-white">{getDrawMethodLabel(raffle.draw_method)}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Total de números</p>
            <p className="font-medium text-white">{raffle.total_numbers}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">UUID</p>
            <p className="font-mono text-xs text-neutral-500">{raffle.uuid}</p>
          </div>
        </div>
      </div>

      {/* Numbers Grid */}
      {numbers.length > 0 && (
        <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Números del Drop</h2>
          <NumberGrid
            numbers={numbers}
            selectedNumbers={selectedNumbers}
            onNumberSelect={handleNumberSelect}
            readonly={isOwner || raffle.status !== 'active'}
          />
        </div>
      )}

      {/* Floating Checkout Button */}
      {!isOwner && raffle.status === 'active' && selectedNumbers.length > 0 && (
        <FloatingCheckoutButton
          selectedCount={selectedNumbers.length}
          selectedNumbers={selectedNumbers}
          totalAmount={selectedNumbers.length * Number(raffle.price_per_number)}
          onCheckout={handlePayNow}
          onCancel={handleClearSelection}
          disabled={!user || user?.kyc_level === 'none' || isLoadingReservation}
        />
      )}
    </div>
  );
}

import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useCartStore } from '../../../store/cartStore';
import { CheckCircle2, Sparkles } from 'lucide-react';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearNumbers, clearReservation } = useCartStore();

  const paymentId = searchParams.get('payment_id');
  const reservationId = searchParams.get('reservation_id');

  useEffect(() => {
    // Clear cart and reservation on successful payment
    clearNumbers();
    clearReservation();
  }, [clearNumbers, clearReservation]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-8 text-center">
        {/* Success Icon with animation */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 mx-auto bg-accent-green/20 rounded-full flex items-center justify-center animate-bounce relative">
            <CheckCircle2 className="w-12 h-12 text-accent-green" />
            <Sparkles className="w-5 h-5 text-gold absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          ¡Participación Exitosa!
        </h1>

        <p className="text-lg text-neutral-400 mb-6">
          Tu pago ha sido procesado correctamente. Tus participaciones han sido confirmadas.
        </p>

        {/* Payment Details */}
        {(paymentId || reservationId) && (
          <div className="bg-dark-lighter rounded-xl p-4 mb-6 space-y-2">
            {reservationId && (
              <div className="text-sm">
                <span className="text-neutral-400">ID de Reserva: </span>
                <span className="font-mono text-white">{reservationId}</span>
              </div>
            )}
            {paymentId && (
              <div className="text-sm">
                <span className="text-neutral-400">ID de Pago: </span>
                <span className="font-mono text-white">{paymentId}</span>
              </div>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-gold font-medium mb-2">
            ¿Qué sigue?
          </p>
          <ul className="text-sm text-neutral-300 text-left space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-accent-green">✓</span>
              Recibirás un correo de confirmación
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-green">✓</span>
              Puedes ver tus participaciones en "Mis Drops"
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-green">✓</span>
              Te notificaremos cuando se realice el Drop
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-tickets">
            <Button className="w-full sm:w-auto">
              Ver Mis Drops
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" className="w-full sm:w-auto">
              Explorar Más Drops
            </Button>
          </Link>
        </div>
      </div>

      {/* Celebration Effect */}
      <div className="mt-8 text-center">
        <p className="text-6xl animate-pulse">🎉</p>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useCartStore } from '../../../store/cartStore';
import { AlertTriangle, HelpCircle } from 'lucide-react';

export function PaymentCancelPage() {
  const { activeReservation } = useCartStore();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-8 text-center">
        {/* Cancel Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gold/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-gold" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Pago Cancelado
        </h1>

        <p className="text-lg text-neutral-400 mb-6">
          Has cancelado el proceso de pago.
          {activeReservation && ' Tu reserva sigue activa, puedes intentar pagar nuevamente.'}
        </p>

        {/* Reservation Status */}
        {activeReservation && (
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-gold font-medium mb-2">
              Tu reserva sigue activa
            </p>
            <p className="text-sm text-neutral-300">
              Puedes volver al Drop para completar tu pago antes de que expire la reserva.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {activeReservation ? (
            <>
              <Link to="/explore">
                <Button className="w-full sm:w-auto">
                  Volver a Explorar
                </Button>
              </Link>
              <Link to="/my-tickets">
                <Button variant="outline" className="w-full sm:w-auto">
                  Ver Mis Drops
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/explore">
                <Button className="w-full sm:w-auto">
                  Explorar Drops
                </Button>
              </Link>
              <Link to="/wallet">
                <Button variant="outline" className="w-full sm:w-auto">
                  Ver mis AloCoins
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-400 flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4" />
          ¿Necesitas ayuda?{' '}
          <Link to="/support" className="text-gold hover:underline">
            Contáctanos
          </Link>
        </p>
      </div>
    </div>
  );
}

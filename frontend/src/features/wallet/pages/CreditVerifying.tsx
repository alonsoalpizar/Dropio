import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const CreditVerifying = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const amount = searchParams.get("amount") || "0";
  const reference = searchParams.get("reference") || "";

  const formatAloCoins = (amount: string): string => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("es-CR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          {/* Verifying Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center">
              <div className="relative">
                <Clock className="w-12 h-12 text-gold" />
                <div className="absolute -top-1 -right-1">
                  <LoadingSpinner />
                </div>
              </div>
            </div>
          </div>

          {/* Verifying Message */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Pago en verificación
          </h1>
          <p className="text-neutral-400 mb-6">
            Tu pago está siendo verificado por el procesador
          </p>

          {/* Amount Display */}
          {amount !== "0" && (
            <div className="bg-dark-lighter rounded-xl p-6 mb-6 border border-dark-lighter">
              <p className="text-sm text-neutral-400 mb-2">Monto</p>
              <p className="text-3xl font-bold text-gold flex items-center justify-center gap-2">
                <span>🪙</span>
                {formatAloCoins(amount)} AloCoins
              </p>
            </div>
          )}

          {/* Reference */}
          {reference && (
            <div className="mb-6">
              <p className="text-xs text-neutral-500">
                Referencia: <span className="font-mono text-neutral-400">{reference}</span>
              </p>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold" />
              <div>
                <p className="text-sm font-medium mb-2 text-gold">
                  ¿Qué significa esto?
                </p>
                <p className="text-sm text-neutral-300">
                  El procesador de pagos está verificando tu transacción. Este
                  proceso puede tomar algunos minutos. Te notificaremos cuando
                  el pago sea confirmado y los AloCoins se agreguen a tu
                  billetera.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/wallet")}
              className="w-full"
              size="lg"
            >
              Ver mi billetera
            </Button>
            <Button
              onClick={() => navigate("/explore")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Continuar explorando
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-neutral-500 mt-6">
            Puedes cerrar esta página. Recibirás una notificación cuando el
            pago sea procesado.
          </p>
        </div>
      </Card>
    </div>
  );
};

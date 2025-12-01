import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const CreditSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const amount = searchParams.get("amount") || "0";
  const reference = searchParams.get("reference") || "";

  useEffect(() => {
    // Confetti animation would go here if library is available
  }, []);

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
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center relative">
              <CheckCircle2 className="w-12 h-12 text-accent-green" />
              <Sparkles className="w-5 h-5 text-gold absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-white mb-2">
            ¡Compra exitosa!
          </h1>
          <p className="text-neutral-400 mb-6">
            Tus AloCoins han sido agregados a tu billetera
          </p>

          {/* Amount Display */}
          <div className="bg-dark-lighter rounded-xl p-6 mb-6 border border-gold/30">
            <p className="text-sm text-neutral-400 mb-2">AloCoins agregados</p>
            <p className="text-4xl font-bold text-gold flex items-center justify-center gap-2">
              <span>🪙</span>
              {formatAloCoins(amount)}
            </p>
          </div>

          {/* Reference */}
          {reference && (
            <div className="mb-6">
              <p className="text-xs text-neutral-500">
                Referencia: <span className="font-mono text-neutral-400">{reference}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/wallet")}
              className="w-full"
              size="lg"
            >
              Ver mis AloCoins
            </Button>
            <Button
              onClick={() => navigate("/explore")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Explorar Drops
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

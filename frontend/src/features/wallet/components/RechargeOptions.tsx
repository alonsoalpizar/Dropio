import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Info, ArrowRight, Smartphone, Building2 } from "lucide-react";
import { useRechargeOptions, useAddFunds, usePurchaseCredits } from "../hooks/useWallet";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

// Helper para formatear CRC
function formatCRC(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Helper para formatear AloCoins
function formatALO(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Helper para generar idempotency key
function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export const RechargeOptions = () => {
  const navigate = useNavigate();
  const { data: optionsData, isLoading: optionsLoading } = useRechargeOptions();
  const addFundsMutation = useAddFunds();
  const purchaseCreditsMutation = usePurchaseCredits();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "sinpe" | "transfer">("card");

  const handleRecharge = () => {
    if (selectedOptionIndex === null || !optionsData) return;

    const selectedOption = optionsData.options[selectedOptionIndex];
    const desiredCredit = parseFloat(selectedOption.desired_credit);
    const chargeAmount = parseFloat(selectedOption.charge_amount);

    // Si el método de pago es tarjeta, usar Pagadito
    if (paymentMethod === "card") {
      purchaseCreditsMutation.mutate({
        desired_credit: selectedOption.desired_credit,
        currency: optionsData.currency || "CRC",
        idempotency_key: generateIdempotencyKey(),
      });
    } else {
      // Para SINPE o Transferencia, redirigir a la página de instrucciones
      const reference = `ALO-${Date.now().toString(36).toUpperCase()}`;
      navigate(`/credits/manual-payment?method=${paymentMethod}&amount=${chargeAmount}&alocoins=${desiredCredit}&reference=${reference}`);
    }
  };

  if (optionsLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (!optionsData) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-600 text-center">No se pudieron cargar las opciones de recarga</p>
      </Card>
    );
  }

  // Mostrar mensaje de éxito si la recarga fue creada
  if (addFundsMutation.isSuccess && addFundsMutation.data) {
    return (
      <Card className="p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div>
            <h3 className="font-semibold text-green-900 mb-2">¡Transacción creada exitosamente!</h3>
            <p className="text-sm text-green-800 mb-4">Tu recarga está siendo procesada</p>
            <div className="bg-white p-4 rounded-lg border border-green-200 text-sm space-y-2">
              <p>
                <span className="font-medium">ID de transacción:</span> {addFundsMutation.data.transaction_uuid}
              </p>
              <p>
                <span className="font-medium">Monto:</span> {formatCRC(addFundsMutation.data.amount)}
              </p>
              <p>
                <span className="font-medium">Estado:</span> {addFundsMutation.data.status}
              </p>
            </div>
            <p className="text-xs text-green-700 mt-4">
              * En esta fase de desarrollo, el pago real aún no está habilitado. La transacción quedará pendiente.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Realizar otra recarga
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info note */}
      <div className="rounded-xl p-4 flex items-start gap-3 border border-gold/30 bg-gold/10">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold" />
        <p className="text-sm text-neutral-300">
          Los montos mostrados incluyen todas las comisiones. El crédito deseado es lo que recibirás en tu billetera.
        </p>
      </div>

      {/* Error alert */}
      {(addFundsMutation.isError || purchaseCreditsMutation.isError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900">
            Error al crear la recarga:{" "}
            {addFundsMutation.error instanceof Error
              ? addFundsMutation.error.message
              : purchaseCreditsMutation.error instanceof Error
              ? purchaseCreditsMutation.error.message
              : "Error desconocido"}
          </p>
        </div>
      )}

      {/* Opciones de compra de AloCoins */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {optionsData.options.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          const desiredCredit = parseFloat(option.desired_credit);
          const chargeAmount = parseFloat(option.charge_amount);
          const totalFees = parseFloat(option.total_fees);

          return (
            <div
              key={index}
              className={cn(
                "relative p-5 rounded-xl cursor-pointer transition-all border-2",
                isSelected
                  ? "border-gold bg-gold/10 shadow-lg shadow-gold/20"
                  : "border-dark-lighter bg-dark-card hover:border-gold/50 hover:bg-dark-card/80"
              )}
              onClick={() => setSelectedOptionIndex(index)}
            >
              <div className="text-center">
                {/* Recibirás AloCoins */}
                <div className="mb-3">
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Recibirás</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <img
                      src="/assets/alocoin.png"
                      alt="ALO"
                      className="w-8 h-8"
                    />
                    <span className={cn(
                      "text-3xl font-bold",
                      isSelected ? "text-gold" : "text-white"
                    )}>
                      {formatALO(desiredCredit)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">AloCoins</p>
                </div>

                {/* Divider */}
                <div className="border-t border-dark-lighter my-3"></div>

                {/* Monto a pagar en colones */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Total a pagar:</span>
                    <span className="font-semibold text-white">{formatCRC(chargeAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Comisión:</span>
                    <span>{formatCRC(totalFees)}</span>
                  </div>
                </div>

                {/* Checkmark si está seleccionado */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-gold text-dark rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desglose simplificado de la opción seleccionada */}
      {selectedOptionIndex !== null && (
        <div className="p-5 rounded-xl bg-dark-card border border-dark-lighter">
          <h3 className="font-semibold text-white mb-4">Resumen de tu compra</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">AloCoins a recibir:</span>
              <div className="flex items-center gap-2">
                <img src="/assets/alocoin.png" alt="ALO" className="w-5 h-5" />
                <span className="font-semibold text-gold">{formatALO(optionsData.options[selectedOptionIndex].desired_credit)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Precio base:</span>
              <span className="text-white">{formatCRC(optionsData.options[selectedOptionIndex].desired_credit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Comisión por servicio:</span>
              <span className="text-white">{formatCRC(optionsData.options[selectedOptionIndex].total_fees)}</span>
            </div>
            <div className="border-t border-dark-lighter my-2"></div>
            <div className="flex justify-between font-semibold text-base">
              <span className="text-white">Total a pagar:</span>
              <span className="text-gold">
                {formatCRC(optionsData.options[selectedOptionIndex].charge_amount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Métodos de pago */}
      {selectedOptionIndex !== null && (
        <div className="p-5 rounded-xl bg-dark-card border border-dark-lighter">
          <h3 className="font-semibold text-white mb-4">Método de pago</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod("card")}
              className={cn(
                "p-4 border-2 rounded-xl transition-all",
                paymentMethod === "card"
                  ? "border-gold bg-gold/10"
                  : "border-dark-lighter hover:border-gold/50"
              )}
            >
              <CreditCard className={cn(
                "w-6 h-6 mx-auto mb-2",
                paymentMethod === "card" ? "text-gold" : "text-neutral-400"
              )} />
              <p className={cn(
                "text-sm font-medium",
                paymentMethod === "card" ? "text-gold" : "text-neutral-300"
              )}>Tarjeta</p>
            </button>
            <button
              onClick={() => setPaymentMethod("sinpe")}
              className={cn(
                "p-4 border-2 rounded-xl transition-all",
                paymentMethod === "sinpe"
                  ? "border-gold bg-gold/10"
                  : "border-dark-lighter hover:border-gold/50"
              )}
            >
              <Smartphone className={cn(
                "w-6 h-6 mx-auto mb-2",
                paymentMethod === "sinpe" ? "text-gold" : "text-neutral-400"
              )} />
              <p className={cn(
                "text-sm font-medium",
                paymentMethod === "sinpe" ? "text-gold" : "text-neutral-300"
              )}>SINPE Móvil</p>
            </button>
            <button
              onClick={() => setPaymentMethod("transfer")}
              className={cn(
                "p-4 border-2 rounded-xl transition-all",
                paymentMethod === "transfer"
                  ? "border-gold bg-gold/10"
                  : "border-dark-lighter hover:border-gold/50"
              )}
            >
              <Building2 className={cn(
                "w-6 h-6 mx-auto mb-2",
                paymentMethod === "transfer" ? "text-gold" : "text-neutral-400"
              )} />
              <p className={cn(
                "text-sm font-medium",
                paymentMethod === "transfer" ? "text-gold" : "text-neutral-300"
              )}>Transferencia</p>
            </button>
          </div>
        </div>
      )}

      {/* Botón de confirmar */}
      {selectedOptionIndex !== null && (
        <button
          onClick={handleRecharge}
          disabled={addFundsMutation.isPending || purchaseCreditsMutation.isPending}
          className="w-full py-4 px-6 bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
        >
          {(addFundsMutation.isPending || purchaseCreditsMutation.isPending) ? (
            <>
              <LoadingSpinner />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <img src="/assets/alocoin.png" alt="ALO" className="w-6 h-6" />
              <span>Comprar {formatALO(optionsData.options[selectedOptionIndex].desired_credit)} AloCoins</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

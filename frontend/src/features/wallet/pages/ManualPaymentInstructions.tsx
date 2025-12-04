import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, Check, Smartphone, Building2, ArrowLeft, Clock, Mail, MessageCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

// Tipo para la configuración de pago
interface PaymentConfig {
  sinpe: {
    phone: string;
    name: string;
  };
  transfer: {
    bankName: string;
    iban: string;
    holder: string;
  };
  contact: {
    email: string;
    whatsapp: string;
  };
}

// Valores por defecto mientras carga
const DEFAULT_CONFIG: PaymentConfig = {
  sinpe: {
    phone: "",
    name: "",
  },
  transfer: {
    bankName: "",
    iban: "",
    holder: "",
  },
  contact: {
    email: "",
    whatsapp: "",
  },
};

// Helper para formatear CRC
function formatCRC(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper para formatear AloCoins
function formatALO(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Componente para copiar texto
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between bg-dark p-4 rounded-lg border border-dark-lighter">
      <div>
        <p className="text-xs text-neutral-500 mb-1">{label}</p>
        <p className="text-lg font-mono font-bold text-white">{text}</p>
      </div>
      <button
        onClick={handleCopy}
        className={cn(
          "p-2 rounded-lg transition-all",
          copied ? "bg-green-500/20 text-green-400" : "bg-gold/20 text-gold hover:bg-gold/30"
        )}
      >
        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      </button>
    </div>
  );
}

export const ManualPaymentInstructions = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  const method = searchParams.get("method") as "sinpe" | "transfer" | null;
  const amount = parseFloat(searchParams.get("amount") || "0");
  const alocoins = parseFloat(searchParams.get("alocoins") || "0");
  const reference = searchParams.get("reference") || `ALO-${Date.now().toString(36).toUpperCase()}`;

  // Cargar configuración de pago desde el backend
  useEffect(() => {
    const loadPaymentConfig = async () => {
      try {
        const response = await api.get<{ success: boolean; data: PaymentConfig }>('/config/payment');
        if (response.data?.success && response.data?.data) {
          setPaymentConfig(response.data.data);
        }
      } catch (error) {
        console.error('Error loading payment config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentConfig();
  }, []);

  if (!method || !amount) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Información de pago no válida</p>
          <button
            onClick={() => navigate("/wallet")}
            className="text-gold hover:underline"
          >
            Volver a la billetera
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  const isSinpe = method === "sinpe";

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate("/wallet")}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a mi billetera</span>
        </button>

        {/* Card principal */}
        <div className="bg-dark-card border border-dark-lighter rounded-2xl overflow-hidden">
          {/* Header con icono */}
          <div className="bg-gold/10 border-b border-gold/20 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gold/20 rounded-full flex items-center justify-center">
              {isSinpe ? (
                <Smartphone className="w-8 h-8 text-gold" />
              ) : (
                <Building2 className="w-8 h-8 text-gold" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSinpe ? "Pago con SINPE Móvil" : "Pago con Transferencia"}
            </h1>
            <p className="text-neutral-400 text-sm">
              Sigue las instrucciones para completar tu compra
            </p>
          </div>

          {/* Resumen de compra */}
          <div className="p-6 border-b border-dark-lighter">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-400">Vas a recibir:</span>
              <div className="flex items-center gap-2">
                <img src="/assets/alocoin.png" alt="ALO" className="w-6 h-6" />
                <span className="text-xl font-bold text-gold">{formatALO(alocoins)} AloCoins</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Monto a pagar:</span>
              <span className="text-xl font-bold text-white">{formatCRC(amount)}</span>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="p-6 space-y-4">
            <h2 className="font-semibold text-white mb-4">
              {isSinpe ? "1. Envía el pago a:" : "1. Transfiere a la cuenta:"}
            </h2>

            {isSinpe ? (
              <>
                <CopyButton text={paymentConfig.sinpe.phone} label="Número SINPE" />
                <div className="bg-dark p-4 rounded-lg border border-dark-lighter">
                  <p className="text-xs text-neutral-500 mb-1">A nombre de</p>
                  <p className="text-white font-medium">{paymentConfig.sinpe.name}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-dark p-4 rounded-lg border border-dark-lighter">
                  <p className="text-xs text-neutral-500 mb-1">Banco</p>
                  <p className="text-white font-medium">{paymentConfig.transfer.bankName}</p>
                </div>
                <CopyButton text={paymentConfig.transfer.iban} label="Cuenta IBAN" />
                <div className="bg-dark p-4 rounded-lg border border-dark-lighter">
                  <p className="text-xs text-neutral-500 mb-1">Titular</p>
                  <p className="text-white font-medium">{paymentConfig.transfer.holder}</p>
                </div>
              </>
            )}

            {/* Referencia */}
            <div className="mt-6">
              <h2 className="font-semibold text-white mb-4">2. Usa esta referencia:</h2>
              <CopyButton text={reference} label="Referencia de pago" />
              <p className="text-xs text-neutral-500 mt-2">
                * Incluye esta referencia en la descripción del pago
              </p>
            </div>

            {/* Enviar comprobante */}
            <div className="mt-6">
              <h2 className="font-semibold text-white mb-4">3. Envía el comprobante a:</h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`mailto:${paymentConfig.contact.email}?subject=Comprobante%20${reference}`}
                  className="flex items-center justify-center gap-2 p-4 bg-dark rounded-xl border border-dark-lighter hover:border-gold/50 transition-colors"
                >
                  <Mail className="w-5 h-5 text-gold" />
                  <span className="text-sm text-neutral-300">Email</span>
                </a>
                <a
                  href={`https://wa.me/506${paymentConfig.contact.whatsapp.replace("-", "")}?text=Hola,%20adjunto%20comprobante%20de%20pago%20${reference}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 bg-dark rounded-xl border border-dark-lighter hover:border-green-500/50 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-neutral-300">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer con tiempo estimado */}
          <div className="p-6 bg-gold/5 border-t border-gold/20">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Tiempo de acreditación</p>
                <p className="text-sm text-neutral-400">
                  Una vez que recibamos y verifiquemos tu comprobante, tus AloCoins se acreditarán en un máximo de <span className="text-gold font-medium">24 horas</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>¿Tienes dudas? Escríbenos a <a href={`mailto:${paymentConfig.contact.email}`} className="text-gold hover:underline">{paymentConfig.contact.email}</a></p>
        </div>
      </div>
    </div>
  );
};

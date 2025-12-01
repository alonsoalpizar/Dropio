import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  User,
  Package,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react";
import {
  useAdminSettlementDetail,
  useApproveSettlement,
  useRejectSettlement,
  useMarkSettlementPaid,
} from "../../hooks/useAdminSettlements";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import type {
  ApproveSettlementRequest,
  RejectSettlementRequest,
  MarkSettlementPaidRequest,
} from "../../types";

export function SettlementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const settlementId = parseInt(id || "0");

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const { data, isLoading, error } = useAdminSettlementDetail(settlementId);
  const approveMutation = useApproveSettlement();
  const rejectMutation = useRejectSettlement();
  const payoutMutation = useMarkSettlementPaid();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-500" />}
          title="Error al cargar liquidación"
          description={(error as Error)?.message || "Liquidación no encontrada"}
        />
      </div>
    );
  }

  const { settlement, raffle, payments_summary, timeline, bank_account } = data;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-gold/20 text-gold",
      approved: "bg-accent-blue/20 text-accent-blue",
      paid: "bg-accent-green/20 text-accent-green",
      rejected: "bg-red-500/20 text-red-400",
    };
    const labels: Record<string, string> = {
      pending: "Pendiente",
      approved: "Aprobada",
      paid: "Pagada",
      rejected: "Rechazada",
    };
    return (
      <Badge className={styles[status] || "bg-dark-lighter text-neutral-300"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "calculated":
        return <Clock className="w-5 h-5 text-accent-blue" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-accent-green" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "paid":
        return <DollarSign className="w-5 h-5 text-accent-green" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-500" />;
    }
  };

  const canApprove = settlement.status === "pending";
  const canReject = settlement.status === "pending" || settlement.status === "approved";
  const canMarkPaid = settlement.status === "approved";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/settlements")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Liquidación #{settlement.id}</h1>
            <p className="text-neutral-400 mt-1">
              Detalles completos de la liquidación
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {canApprove && (
            <Button
              onClick={() => setShowApproveModal(true)}
              className="bg-accent-green hover:bg-accent-green/80"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprobar
            </Button>
          )}
          {canReject && (
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(true)}
              className="text-red-400 border-red-400 hover:bg-dark-lighter"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rechazar
            </Button>
          )}
          {canMarkPaid && (
            <Button
              onClick={() => setShowPayoutModal(true)}
              className="bg-accent-blue hover:bg-accent-blue/80"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Marcar Como Pagada
            </Button>
          )}
        </div>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settlement Info */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-accent-blue" />
            <h2 className="text-lg font-semibold text-white">Liquidación</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-400">Estado</p>
              <div className="mt-1">{getStatusBadge(settlement.status)}</div>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Ingresos Totales</p>
              <p className="text-lg font-bold text-white">
                🪙 {formatCurrency(settlement.total_revenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Comisión Plataforma</p>
              <p className="text-lg font-medium text-red-400">
                - 🪙 {formatCurrency(settlement.platform_fee)}
              </p>
            </div>
            <div className="pt-3 border-t border-dark-lighter">
              <p className="text-sm text-neutral-400">Monto Neto a Pagar</p>
              <p className="text-2xl font-bold text-accent-green">
                🪙 {formatCurrency(settlement.net_amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Fecha de Creación</p>
              <p className="text-sm font-medium text-white">
                {format(new Date(settlement.created_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </div>
        </Card>

        {/* Organizer Info */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-accent-green" />
            <h2 className="text-lg font-semibold text-white">Organizador</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-400">Nombre</p>
              <p className="text-sm font-medium text-white">
                {settlement.organizer_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Email</p>
              <p className="text-sm font-medium text-white">
                {settlement.organizer_email}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Nivel KYC</p>
              <Badge className={
                settlement.organizer_kyc_level === "verified" || settlement.organizer_kyc_level === "enhanced"
                  ? "bg-accent-green/20 text-accent-green"
                  : "bg-gold/20 text-gold"
              }>
                {settlement.organizer_kyc_level}
              </Badge>
            </div>
            {bank_account && (
              <>
                <div className="pt-3 border-t border-dark-lighter">
                  <p className="text-sm font-medium text-neutral-300 mb-2">Cuenta Bancaria</p>
                  <p className="text-xs text-neutral-400">Banco: {bank_account.bank_name}</p>
                  <p className="text-xs text-neutral-400">
                    Cuenta: {bank_account.account_number}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Titular: {bank_account.account_holder}
                  </p>
                  {bank_account.verified_at && (
                    <Badge className="bg-accent-green/20 text-accent-green mt-2">
                      Verificada
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Drop Info */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-accent-purple" />
            <h2 className="text-lg font-semibold text-white">Drop</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-400">Título</p>
              <p className="text-sm font-medium text-white">{settlement.raffle_title}</p>
            </div>
            {raffle && (
              <>
                <div>
                  <p className="text-sm text-neutral-400">Estado</p>
                  <Badge>{raffle.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Precio por Número</p>
                  <p className="text-sm font-medium text-white">
                    🪙 {formatCurrency(raffle.ticket_price || 0)}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Payments Summary */}
      {payments_summary && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-accent-blue" />
            <h2 className="text-lg font-semibold text-white">Resumen de Pagos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-400">Total Pagos</p>
              <p className="text-2xl font-bold text-white">
                {payments_summary.total_payments}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Exitosos</p>
              <p className="text-2xl font-bold text-accent-green">
                {payments_summary.succeeded_payments}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Ingresos Brutos</p>
              <p className="text-xl font-bold text-white">
                🪙 {formatCurrency(payments_summary.total_revenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">
                Comisión ({payments_summary.platform_fee_percent}%)
              </p>
              <p className="text-xl font-bold text-red-400">
                🪙 {formatCurrency(payments_summary.platform_fee_amount)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-accent-blue" />
          <h2 className="text-lg font-semibold text-white">Timeline de Eventos</h2>
        </div>
        <div className="space-y-4">
          {timeline && timeline.length > 0 ? (
            timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{event.details}</p>
                      {event.actor && (
                        <p className="text-xs text-neutral-500">Por: {event.actor}</p>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {format(new Date(event.timestamp), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-1 text-xs text-neutral-400">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <span className="font-medium">{key}:</span>{" "}
                          {typeof value === "number" && key.includes("amount")
                            ? `🪙 ${formatCurrency(value)}`
                            : String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No hay eventos en el timeline</p>
          )}
        </div>
      </Card>

      {/* Admin Notes */}
      {settlement.admin_notes && (
        <Card className="p-6 bg-gold/10 border-gold/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-gold" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gold">Notas Administrativas</h3>
              <p className="text-sm text-neutral-300 mt-1 whitespace-pre-wrap">
                {settlement.admin_notes}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Rejection Reason */}
      {settlement.rejection_reason && (
        <Card className="p-6 bg-red-500/10 border-red-400/30">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-red-400">Razón del Rechazo</h3>
              <p className="text-sm text-neutral-300 mt-1">{settlement.rejection_reason}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Modals */}
      {showApproveModal && (
        <ApproveModal
          settlementId={settlementId}
          onClose={() => setShowApproveModal(false)}
          onSubmit={(data) => {
            approveMutation.mutate(
              { settlementId, data },
              {
                onSuccess: () => setShowApproveModal(false),
              }
            );
          }}
        />
      )}

      {showRejectModal && (
        <RejectModal
          settlementId={settlementId}
          onClose={() => setShowRejectModal(false)}
          onSubmit={(data) => {
            rejectMutation.mutate(
              { settlementId, data },
              {
                onSuccess: () => setShowRejectModal(false),
              }
            );
          }}
        />
      )}

      {showPayoutModal && (
        <PayoutModal
          settlementId={settlementId}
          netAmount={settlement.net_amount}
          onClose={() => setShowPayoutModal(false)}
          onSubmit={(data) => {
            payoutMutation.mutate(
              { settlementId, data },
              {
                onSuccess: () => setShowPayoutModal(false),
              }
            );
          }}
        />
      )}
    </div>
  );
}

// Approve Modal Component
interface ApproveModalProps {
  settlementId: number;
  onClose: () => void;
  onSubmit: (data: ApproveSettlementRequest) => void;
}

function ApproveModal({ onClose, onSubmit }: ApproveModalProps) {
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ notes });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-bold text-white mb-4">Aprobar Liquidación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              rows={3}
              placeholder="Notas administrativas..."
            />
          </div>

          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-4">
            <p className="text-sm text-white">
              <strong>Nota:</strong> Esta acción aprobará la liquidación. El organizador deberá tener:
            </p>
            <ul className="text-sm text-neutral-300 mt-2 list-disc list-inside">
              <li>KYC nivel verificado o superior</li>
              <li>Cuenta bancaria verificada</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-accent-green hover:bg-accent-green/80">
              Aprobar Liquidación
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Reject Modal Component
interface RejectModalProps {
  settlementId: number;
  onClose: () => void;
  onSubmit: (data: RejectSettlementRequest) => void;
}

function RejectModal({ onClose, onSubmit }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }
    onSubmit({ reason, notes });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-bold text-white mb-4">Rechazar Liquidación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Razón del Rechazo *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              rows={3}
              required
              placeholder="Explica por qué se rechaza..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              rows={2}
              placeholder="Notas internas..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600"
              disabled={!reason.trim()}
            >
              Rechazar Liquidación
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Payout Modal Component
interface PayoutModalProps {
  settlementId: number;
  netAmount: number;
  onClose: () => void;
  onSubmit: (data: MarkSettlementPaidRequest) => void;
}

function PayoutModal({ netAmount, onClose, onSubmit }: PayoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      payment_method: paymentMethod,
      payment_reference: paymentReference || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-bold text-white mb-4">Marcar Como Pagada</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-4">
            <p className="text-sm text-white">
              Monto a pagar: <strong>🪙 {formatCurrency(netAmount)}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Método de Pago *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              required
            >
              <option value="bank_transfer">Transferencia Bancaria</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="cash">Efectivo</option>
              <option value="check">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Referencia de Pago
            </label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="Número de transferencia, Transaction ID..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              rows={2}
              placeholder="Notas sobre el pago..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-accent-blue hover:bg-accent-blue/80">
              Marcar Como Pagada
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

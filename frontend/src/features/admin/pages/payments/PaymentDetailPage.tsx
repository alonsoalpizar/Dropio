import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  User,
  Package,
  Clock,
  AlertCircle,
  DollarSign,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useAdminPaymentDetail, useProcessRefund, useManageDispute } from "../../hooks/useAdminPayments";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import type { ProcessRefundRequest, ManageDisputeRequest } from "../../types";

export function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const { data, isLoading, error } = useAdminPaymentDetail(id!);
  const refundMutation = useProcessRefund();
  const disputeMutation = useManageDispute();

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
          title="Error al cargar pago"
          description={(error as Error)?.message || "Pago no encontrado"}
        />
      </div>
    );
  }

  const { payment, user, raffle, organizer, numbers, timeline, refund_history, webhook_events } = data;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      succeeded: "bg-accent-green/20 text-accent-green",
      pending: "bg-gold/20 text-gold",
      failed: "bg-red-500/20 text-red-400",
      refunded: "bg-dark-lighter text-neutral-300",
      disputed: "bg-gold/20 text-gold",
    };
    const labels: Record<string, string> = {
      succeeded: "Exitoso",
      pending: "Pendiente",
      failed: "Fallido",
      refunded: "Reembolsado",
      disputed: "Disputado",
    };
    return (
      <Badge className={styles[status] || "bg-dark-lighter text-neutral-300"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "created":
        return <CreditCard className="w-5 h-5 text-accent-blue" />;
      case "webhook":
        return <RefreshCw className="w-5 h-5 text-accent-blue" />;
      case "status_change":
        return <AlertCircle className="w-5 h-5 text-gold" />;
      case "refund":
        return <DollarSign className="w-5 h-5 text-red-400" />;
      case "note":
        return <AlertTriangle className="w-5 h-5 text-gold" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/payments")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Detalles de Pago</h1>
            <p className="text-neutral-400 mt-1">ID: {payment.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {payment.status === "succeeded" && (
            <Button variant="outline" onClick={() => setShowRefundModal(true)}>
              <DollarSign className="w-4 h-4 mr-2" />
              Procesar Reembolso
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowDisputeModal(true)}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Gestionar Disputa
          </Button>
        </div>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Info */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-accent-blue" />
            <h2 className="text-lg font-semibold text-white">Información de Pago</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-400">Monto</p>
              <p className="text-2xl font-bold text-white">🪙 {formatCurrency(payment.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Estado</p>
              <div className="mt-1">{getStatusBadge(payment.status)}</div>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Proveedor</p>
              <p className="text-sm font-medium text-white capitalize">
                {payment.provider || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Método de Pago</p>
              <p className="text-sm font-medium text-white capitalize">
                {payment.payment_method || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Fecha de Creación</p>
              <p className="text-sm font-medium text-white">
                {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            {payment.paid_at && (
              <div>
                <p className="text-sm text-neutral-400">Fecha de Pago</p>
                <p className="text-sm font-medium text-white">
                  {format(new Date(payment.paid_at), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* User Info */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-accent-green" />
            <h2 className="text-lg font-semibold text-white">Usuario</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-400">Nombre</p>
              <p className="text-sm font-medium text-white">{user?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Email</p>
              <p className="text-sm font-medium text-white">{user?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Números Comprados</p>
              <p className="text-sm font-medium text-white">{numbers?.length || 0}</p>
            </div>
            {numbers && numbers.length > 0 && (
              <div>
                <p className="text-sm text-neutral-400 mb-2">Números</p>
                <div className="flex flex-wrap gap-1">
                  {numbers.slice(0, 10).map((num) => (
                    <span
                      key={num}
                      className="px-2 py-1 text-xs font-mono bg-accent-blue/20 text-accent-blue rounded"
                    >
                      {num}
                    </span>
                  ))}
                  {numbers.length > 10 && (
                    <span className="px-2 py-1 text-xs text-neutral-400">
                      +{numbers.length - 10} más
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Drop Info */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-gold" />
            <h2 className="text-lg font-semibold text-white">Drop</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-400">Título</p>
              <p className="text-sm font-medium text-white">{raffle?.title || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Organizador</p>
              <p className="text-sm font-medium text-white">{organizer?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Email Organizador</p>
              <p className="text-sm font-medium text-white">{organizer?.email || "—"}</p>
            </div>
          </div>
        </Card>
      </div>

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
                    <p className="text-sm font-medium text-white">{event.details}</p>
                    <p className="text-xs text-neutral-500">
                      {format(new Date(event.timestamp), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-1 text-xs text-neutral-400">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <span className="font-medium">{key}:</span> {String(value)}
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

      {/* Webhook Events */}
      {webhook_events && webhook_events.length > 0 && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6 text-accent-blue" />
            <h2 className="text-lg font-semibold text-white">Eventos de Webhook</h2>
          </div>
          <div className="space-y-3">
            {webhook_events.map((event, index) => (
              <div key={index} className="p-4 bg-dark-lighter rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-accent-blue/20 text-accent-blue">{event.provider}</Badge>
                    <span className="text-sm font-medium text-white">{event.event_type}</span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {format(new Date(event.received_at), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">Estado: {event.status}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Refund History */}
      {refund_history && refund_history.length > 0 && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-red-400" />
            <h2 className="text-lg font-semibold text-white">Historial de Reembolsos</h2>
          </div>
          <div className="space-y-3">
            {refund_history.map((refund, index) => (
              <div key={index} className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-500/20 text-red-400">{refund.type}</Badge>
                    <span className="text-lg font-medium text-white">
                      🪙 {formatCurrency(refund.amount)}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {format(new Date(refund.refunded_at), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mb-1">Razón: {refund.reason}</p>
                {refund.notes && <p className="text-sm text-neutral-400">Notas: {refund.notes}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Message */}
      {payment.error_message && (
        <Card className="p-6 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-red-400">Mensaje de Error</h3>
              <p className="text-sm text-red-300 mt-1">{payment.error_message}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Admin Notes */}
      {payment.admin_notes && (
        <Card className="p-6 bg-gold/10 border-gold/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-gold" />
            <div>
              <h3 className="text-sm font-semibold text-gold">Notas Administrativas</h3>
              <p className="text-sm text-neutral-300 mt-1">{payment.admin_notes}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Modals */}
      {showRefundModal && (
        <RefundModal
          payment={payment}
          onClose={() => setShowRefundModal(false)}
          onSubmit={(data) => {
            refundMutation.mutate(
              { paymentId: payment.id, data },
              {
                onSuccess: () => setShowRefundModal(false),
              }
            );
          }}
        />
      )}

      {showDisputeModal && (
        <DisputeModal
          payment={payment}
          onClose={() => setShowDisputeModal(false)}
          onSubmit={(data) => {
            disputeMutation.mutate(
              { paymentId: payment.id, data },
              {
                onSuccess: () => setShowDisputeModal(false),
              }
            );
          }}
        />
      )}
    </div>
  );
}

// Refund Modal Component
interface RefundModalProps {
  payment: any;
  onClose: () => void;
  onSubmit: (data: ProcessRefundRequest) => void;
}

function RefundModal({ payment, onClose, onSubmit }: RefundModalProps) {
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ProcessRefundRequest = {
      reason,
      notes,
    };
    if (refundType === "partial" && amount) {
      data.amount = parseFloat(amount);
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-bold text-white mb-4">Procesar Reembolso</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Tipo de Reembolso
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={refundType === "full"}
                  onChange={() => setRefundType("full")}
                  className="mr-2"
                />
                <span className="text-sm text-white">Completo (🪙 {formatCurrency(payment.amount)})</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={refundType === "partial"}
                  onChange={() => setRefundType("partial")}
                  className="mr-2"
                />
                <span className="text-sm text-white">Parcial</span>
              </label>
            </div>
          </div>

          {refundType === "partial" && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Monto a Reembolsar
              </label>
              <input
                type="number"
                step="0.01"
                max={payment.amount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Razón del Reembolso *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              rows={3}
              required
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
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Procesar Reembolso
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Dispute Modal Component
interface DisputeModalProps {
  payment: any;
  onClose: () => void;
  onSubmit: (data: ManageDisputeRequest) => void;
}

function DisputeModal({ onClose, onSubmit }: DisputeModalProps) {
  const [action, setAction] = useState<"open" | "update" | "close" | "escalate">("open");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeEvidence, setDisputeEvidence] = useState("");
  const [resolution, setResolution] = useState<"accepted" | "rejected" | "refunded">("accepted");
  const [adminNotes, setAdminNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ManageDisputeRequest = {
      action,
      admin_notes: adminNotes,
    };
    if (action === "open") {
      data.dispute_reason = disputeReason;
      data.dispute_evidence = disputeEvidence;
    }
    if (action === "update") {
      data.dispute_evidence = disputeEvidence;
    }
    if (action === "close") {
      data.resolution = resolution;
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-bold text-white mb-4">Gestionar Disputa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Acción</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              <option value="open">Abrir Disputa</option>
              <option value="update">Actualizar Disputa</option>
              <option value="close">Cerrar Disputa</option>
              <option value="escalate">Escalar Disputa</option>
            </select>
          </div>

          {action === "open" && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Razón de la Disputa *
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Evidencia</label>
                <textarea
                  value={disputeEvidence}
                  onChange={(e) => setDisputeEvidence(e.target.value)}
                  className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                  rows={3}
                />
              </div>
            </>
          )}

          {action === "update" && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Evidencia Adicional
              </label>
              <textarea
                value={disputeEvidence}
                onChange={(e) => setDisputeEvidence(e.target.value)}
                className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                rows={3}
              />
            </div>
          )}

          {action === "close" && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Resolución *
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as any)}
                className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              >
                <option value="accepted">Aceptada</option>
                <option value="rejected">Rechazada</option>
                <option value="refunded">Reembolsada</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Notas Administrativas
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gold hover:bg-gold-dark text-dark">
              {action === "open" && "Abrir Disputa"}
              {action === "update" && "Actualizar Disputa"}
              {action === "close" && "Cerrar Disputa"}
              {action === "escalate" && "Escalar Disputa"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Ban, PlayCircle, FileText, Trophy } from "lucide-react";
import {
  useAdminRaffleDetail,
  useForceStatusChange,
  useAddAdminNotes,
  useManualDraw,
  useCancelWithRefund,
} from "../../hooks/useAdminRaffles";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";

export function RaffleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const raffleId = parseInt(id || "0", 10);

  const { data: raffle, isLoading, error } = useAdminRaffleDetail(raffleId);
  const forceStatusChange = useForceStatusChange();
  const addNotes = useAddAdminNotes();
  const manualDraw = useManualDraw();
  const cancelWithRefund = useCancelWithRefund();

  const handleSuspend = () => {
    const reason = prompt("Motivo de la suspensión:");
    if (!reason) return;

    if (!confirm("¿Confirmas suspender este drop?")) return;

    forceStatusChange.mutate({
      raffleId,
      data: {
        new_status: "suspended",
        reason,
      },
    });
  };

  const handleActivate = () => {
    if (!confirm("¿Confirmas activar este drop?")) return;

    forceStatusChange.mutate({
      raffleId,
      data: {
        new_status: "active",
        reason: "Activada por admin",
      },
    });
  };

  const handleAddNotes = () => {
    const notes = prompt("Agregar notas administrativas:");
    if (!notes) return;

    addNotes.mutate({
      raffleId,
      data: { notes },
    });
  };

  const handleManualDraw = () => {
    const winnerNumber = prompt("Número ganador (dejar vacío para sorteo automático):");
    if (winnerNumber === null) return;

    if (!confirm(`¿Confirmas realizar el sorteo ${winnerNumber ? `con número ${winnerNumber}` : "automático"}?`)) return;

    manualDraw.mutate({
      raffleId,
      data: {
        winner_number: winnerNumber || undefined,
      },
    });
  };

  const handleCancelWithRefund = () => {
    const reason = prompt("Motivo de la cancelación:");
    if (!reason) return;

    if (!confirm("¿Confirmas cancelar este drop y reembolsar a los participantes?")) return;

    cancelWithRefund.mutate({
      raffleId,
      data: { reason },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !raffle) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-500" />}
          title="Error al cargar drop"
          description={error?.message || "Drop no encontrado"}
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate("/admin/raffles")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-dark-lighter text-neutral-300",
      active: "bg-accent-green/20 text-accent-green",
      suspended: "bg-red-500/20 text-red-400",
      completed: "bg-accent-blue/20 text-accent-blue",
      cancelled: "bg-dark-lighter text-neutral-300",
    };
    const labels = {
      draft: "Borrador",
      active: "Activa",
      suspended: "Suspendida",
      completed: "Completada",
      cancelled: "Cancelada",
    };
    return (
      <Badge className={styles[status as keyof typeof styles] || ""}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/raffles")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {raffle.raffle.Title}
            </h1>
            <p className="text-neutral-400 mt-1">
              ID: #{raffle.raffle.ID} · Organizado por {raffle.organizer_name}
            </p>
          </div>
        </div>
        {getStatusBadge(raffle.raffle.Status)}
      </div>

      {/* Raffle Info & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Información del Drop
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-neutral-400">UUID</dt>
              <dd className="text-sm text-white mt-1 font-mono">
                {raffle.raffle.UUID}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Organizador</dt>
              <dd className="text-sm text-white mt-1">
                {raffle.organizer_name} ({raffle.organizer_email})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Precio por Boleto</dt>
              <dd className="text-sm text-white mt-1">
                🪙 {formatCurrency(parseFloat(raffle.raffle.PricePerNumber))}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Total Boletos</dt>
              <dd className="text-sm text-white mt-1">
                {raffle.raffle.TotalNumbers}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Rango de Números</dt>
              <dd className="text-sm text-white mt-1">
                {raffle.raffle.MinNumber} - {raffle.raffle.MaxNumber}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Método de Sorteo</dt>
              <dd className="text-sm text-white mt-1 capitalize">
                {raffle.raffle.DrawMethod}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Fecha de Sorteo</dt>
              <dd className="text-sm text-white mt-1">
                {raffle.raffle.DrawDate ? format(new Date(raffle.raffle.DrawDate), "dd/MM/yyyy HH:mm") : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Comisión Plataforma</dt>
              <dd className="text-sm text-white mt-1">
                {raffle.raffle.PlatformFeePercentage}%
              </dd>
            </div>
            {raffle.raffle.WinnerNumber && (
              <div>
                <dt className="text-sm font-medium text-neutral-400">Número Ganador</dt>
                <dd className="text-sm text-white mt-1 font-bold text-accent-green">
                  {raffle.raffle.WinnerNumber}
                </dd>
              </div>
            )}
            {raffle.raffle.AdminNotes && (
              <div className="col-span-2">
                <dt className="text-sm font-medium text-neutral-400">Notas Administrativas</dt>
                <dd className="text-sm text-white mt-1 p-3 bg-gold/20 rounded border border-gold">
                  {raffle.raffle.AdminNotes}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Actions */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Acciones Administrativas
          </h2>
          <div className="space-y-3">
            {raffle.raffle.Status === "active" && (
              <Button
                variant="outline"
                className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-dark-lighter hover:border-red-400"
                onClick={handleSuspend}
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspender Drop
              </Button>
            )}

            {raffle.raffle.Status === "suspended" && (
              <Button
                variant="outline"
                className="w-full justify-start text-accent-green hover:text-accent-green hover:bg-dark-lighter hover:border-accent-green"
                onClick={handleActivate}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Activar Drop
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full justify-start text-accent-blue hover:text-accent-blue hover:bg-dark-lighter hover:border-accent-blue"
              onClick={handleAddNotes}
            >
              <FileText className="w-4 h-4 mr-2" />
              Agregar Notas
            </Button>

            {raffle.raffle.Status === "active" && (
              <Button
                variant="outline"
                className="w-full justify-start text-accent-blue hover:text-accent-blue hover:bg-dark-lighter hover:border-accent-blue"
                onClick={handleManualDraw}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Sorteo Manual
              </Button>
            )}

            {(raffle.raffle.Status === "active" || raffle.raffle.Status === "suspended") && (
              <Button
                variant="outline"
                className="w-full justify-start text-neutral-300 hover:text-neutral-300 hover:bg-dark-lighter hover:border-neutral-300"
                onClick={handleCancelWithRefund}
              >
                <Ban className="w-4 h-4 mr-2" />
                Cancelar con Reembolso
              </Button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-dark-lighter">
            <p className="text-xs text-neutral-500">
              Las acciones administrativas se registran en los logs de auditoría.
            </p>
          </div>
        </Card>
      </div>

      {/* Financial Breakdown */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-semibold text-white mb-4">
          Desglose Financiero
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-400">Ingresos Brutos</p>
            <p className="text-2xl font-bold text-white mt-1">
              🪙 {formatCurrency(raffle.total_revenue)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Comisión Plataforma</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              -🪙 {formatCurrency(raffle.platform_fee)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Ingresos Netos</p>
            <p className="text-2xl font-bold text-accent-green mt-1">
              🪙 {formatCurrency(raffle.net_revenue)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Tasa de Conversión</p>
            <p className="text-2xl font-bold text-accent-blue mt-1">
              {raffle.conversion_rate.toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Transaction Metrics */}
      {raffle.transaction_metrics && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Métricas de Transacciones
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-400">Total Reservas</p>
              <p className="text-2xl font-bold text-white mt-1">
                {raffle.transaction_metrics.total_reservations}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Total Pagos</p>
              <p className="text-2xl font-bold text-accent-green mt-1">
                {raffle.transaction_metrics.total_payments}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Reembolsos</p>
              <p className="text-2xl font-bold text-gold mt-1">
                {raffle.transaction_metrics.total_refunds}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Tasa de Reembolso</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {raffle.transaction_metrics.refund_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      {raffle.timeline && raffle.timeline.length > 0 && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Timeline de Transacciones
          </h2>
          <div className="space-y-4">
            {raffle.timeline.map((event, index) => (
              <div key={index} className="flex gap-4 border-l-2 border-dark-lighter pl-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        event.type === "payment"
                          ? "bg-accent-green/20 text-accent-green"
                          : event.type === "refund"
                          ? "bg-red-500/20 text-red-400"
                          : event.type === "reservation"
                          ? "bg-accent-blue/20 text-accent-blue"
                          : "bg-dark-lighter text-neutral-300"
                      }`}
                    >
                      {event.type}
                    </span>
                    <span className="text-sm text-neutral-400">
                      {event.timestamp ? format(new Date(event.timestamp), "dd/MM/yyyy HH:mm:ss") : "N/A"}
                    </span>
                  </div>
                  <p className="text-sm text-white mt-2">{event.details}</p>
                  {event.user_name && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Usuario: {event.user_name} (ID: {event.user_id})
                    </p>
                  )}
                  {event.amount && (
                    <p className="text-sm font-medium text-white mt-1">
                      Monto: 🪙 {formatCurrency(event.amount)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

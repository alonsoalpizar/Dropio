import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, XCircle, Percent } from "lucide-react";
import { useAdminOrganizerDetail, useVerifyOrganizer, useUpdateOrganizerCommission } from "../../hooks/useAdminOrganizers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/currency";

export function OrganizerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const organizerId = parseInt(id || "0", 10);

  const { data: organizer, isLoading, error } = useAdminOrganizerDetail(organizerId);
  const verifyOrganizer = useVerifyOrganizer();
  const updateCommission = useUpdateOrganizerCommission();

  const handleToggleVerification = () => {
    if (!organizer) return;

    const newStatus = !organizer.profile.verified;
    const action = newStatus ? "verificar" : "remover verificación de";

    if (!confirm(`¿Confirmas ${action} este organizador?`)) return;

    verifyOrganizer.mutate({
      organizerId,
      data: {
        verified: newStatus,
        notes: newStatus ? "Verificado por admin" : "Verificación removida por admin",
      },
    });
  };

  const handleUpdateCommission = () => {
    const newCommission = prompt("Ingrese la nueva comisión personalizada (0-100):");
    if (newCommission === null) return;

    const commissionValue = parseFloat(newCommission);
    if (isNaN(commissionValue) || commissionValue < 0 || commissionValue > 100) {
      alert("Comisión inválida. Debe estar entre 0 y 100.");
      return;
    }

    updateCommission.mutate({
      organizerId,
      data: { commission_override: commissionValue },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-500" />}
          title="Error al cargar organizador"
          description={error?.message || "Organizador no encontrado"}
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate("/admin/organizers")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/organizers")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {organizer.profile.business_name}
            </h1>
            <p className="text-neutral-400 mt-1">
              {organizer.user.first_name} {organizer.user.last_name} · {organizer.user.email}
            </p>
          </div>
        </div>

        {organizer.profile.verified ? (
          <Badge className="bg-accent-green/20 text-accent-green">
            <CheckCircle className="w-4 h-4 mr-2" />
            Verificado
          </Badge>
        ) : (
          <Badge className="bg-gold/20 text-gold">
            <XCircle className="w-4 h-4 mr-2" />
            No Verificado
          </Badge>
        )}
      </div>

      {/* Profile Info & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Información del Perfil
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-neutral-400">ID Usuario</dt>
              <dd className="text-sm text-white mt-1">{organizer.user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Tax ID</dt>
              <dd className="text-sm text-white mt-1 font-mono">
                {organizer.profile.tax_id || "No proporcionado"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Banco</dt>
              <dd className="text-sm text-white mt-1">
                {organizer.profile.bank_name || "No proporcionado"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Cuenta Bancaria</dt>
              <dd className="text-sm text-white mt-1 font-mono">
                {organizer.profile.bank_account_number || "No proporcionado"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Comisión Personalizada</dt>
              <dd className="text-sm text-white mt-1">
                {organizer.profile.commission_override
                  ? `${organizer.profile.commission_override}%`
                  : "Por defecto"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Frecuencia de Pago</dt>
              <dd className="text-sm text-white mt-1 capitalize">
                {organizer.profile.payout_schedule || "Mensual"}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Actions */}
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Acciones Administrativas
          </h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className={`w-full justify-start ${
                organizer.profile.verified
                  ? "text-gold hover:text-gold hover:bg-dark-lighter hover:border-gold"
                  : "text-accent-green hover:text-accent-green hover:bg-dark-lighter hover:border-accent-green"
              }`}
              onClick={handleToggleVerification}
            >
              {organizer.profile.verified ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Remover Verificación
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verificar Organizador
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-accent-blue hover:text-accent-blue hover:bg-dark-lighter hover:border-accent-blue"
              onClick={handleUpdateCommission}
            >
              <Percent className="w-4 h-4 mr-2" />
              Actualizar Comisión
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-lighter">
            <p className="text-xs text-neutral-500">
              Las acciones administrativas se registran en los logs de auditoría.
            </p>
          </div>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-semibold text-white mb-4">
          Desglose de Ingresos
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-400">Ingresos Brutos</p>
            <p className="text-2xl font-bold text-white mt-1">
              🪙 {formatCurrency(organizer.revenue_breakdown.gross_revenue)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Comisión Plataforma</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              -🪙 {formatCurrency(organizer.revenue_breakdown.platform_fees)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Ingresos Netos</p>
            <p className="text-2xl font-bold text-accent-green mt-1">
              🪙 {formatCurrency(organizer.revenue_breakdown.net_revenue)}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-semibold text-white mb-4">
          Métricas de Drops
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-400">Total Drops</p>
            <p className="text-2xl font-bold text-white mt-1">
              {organizer.metrics.total_raffles}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Pago Pendiente</p>
            <p className="text-2xl font-bold text-accent-blue mt-1">
              🪙 {formatCurrency(organizer.metrics.pending_payout)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Total Pagado</p>
            <p className="text-2xl font-bold text-accent-green mt-1">
              🪙 {formatCurrency(organizer.profile.total_payouts)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

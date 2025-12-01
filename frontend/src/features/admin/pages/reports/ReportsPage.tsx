import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
} from "lucide-react";
import { useAdminDashboard } from "../../hooks/useAdminReports";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/currency";

export function ReportsPage() {
  const navigate = useNavigate();
  const { data: kpis, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-500" />}
          title="Error al cargar dashboard"
          description={(error as Error)?.message || "No se pudieron cargar las métricas"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard de Reportes</h1>
          <p className="text-neutral-400 mt-2">
            Métricas globales y reportes del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/reports/revenue")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Reporte de Ingresos
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/reports/liquidations")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Reporte de Liquidaciones
          </Button>
        </div>
      </div>

      {/* Usuarios */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Total Usuarios</p>
            <p className="text-3xl font-bold text-white mt-2">
              {kpis.total_users.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-accent-green">
                +{kpis.new_users_today} hoy
              </span>
              <span className="text-xs text-neutral-500">
                +{kpis.new_users_month} este mes
              </span>
            </div>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Activos</p>
            <p className="text-3xl font-bold text-accent-green mt-2">
              {kpis.active_users.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Suspendidos</p>
            <p className="text-3xl font-bold text-gold mt-2">
              {kpis.suspended_users.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Baneados</p>
            <p className="text-3xl font-bold text-red-400 mt-2">
              {kpis.banned_users.toLocaleString()}
            </p>
          </Card>
        </div>
      </div>

      {/* Organizadores */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Organizadores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Total</p>
            <p className="text-3xl font-bold text-white mt-2">
              {kpis.total_organizers.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Verificados</p>
            <p className="text-3xl font-bold text-accent-green mt-2">
              {kpis.verified_organizers.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Pendientes</p>
            <p className="text-3xl font-bold text-gold mt-2">
              {kpis.pending_organizers.toLocaleString()}
            </p>
          </Card>
        </div>
      </div>

      {/* Drops */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Drops
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Total</p>
            <p className="text-3xl font-bold text-white mt-2">
              {kpis.total_raffles.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Activas</p>
            <p className="text-3xl font-bold text-accent-blue mt-2">
              {kpis.active_raffles.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Completadas</p>
            <p className="text-3xl font-bold text-accent-green mt-2">
              {kpis.completed_raffles.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Borradores</p>
            <p className="text-3xl font-bold text-neutral-500 mt-2">
              {kpis.draft_raffles.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Suspendidas</p>
            <p className="text-3xl font-bold text-red-400 mt-2">
              {kpis.suspended_raffles.toLocaleString()}
            </p>
          </Card>
        </div>
      </div>

      {/* Revenue */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Ingresos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Hoy</p>
            <p className="text-2xl font-bold text-accent-green mt-2">
              {formatCurrency(kpis.revenue_today)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Comisión: {formatCurrency(kpis.platform_fees_today)}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Esta Semana</p>
            <p className="text-2xl font-bold text-accent-green mt-2">
              {formatCurrency(kpis.revenue_week)}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Este Mes</p>
            <p className="text-2xl font-bold text-accent-green mt-2">
              {formatCurrency(kpis.revenue_month)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Comisión: {formatCurrency(kpis.platform_fees_month)}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Total Histórico</p>
            <p className="text-2xl font-bold text-accent-green mt-2">
              {formatCurrency(kpis.revenue_all_time)}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Comisión: {formatCurrency(kpis.platform_fees_all_time)}
            </p>
          </Card>
        </div>
      </div>

      {/* Liquidaciones */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Liquidaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-400">Pendientes</p>
              <Clock className="w-5 h-5 text-gold" />
            </div>
            <p className="text-2xl font-bold text-gold">
              {kpis.pending_settlements_count} liquidaciones
            </p>
            <p className="text-lg text-neutral-300 mt-1">
              {formatCurrency(kpis.pending_settlements_amount)}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-400">Aprobadas</p>
              <CheckCircle className="w-5 h-5 text-accent-blue" />
            </div>
            <p className="text-2xl font-bold text-accent-blue">
              {kpis.approved_settlements_count} liquidaciones
            </p>
            <p className="text-lg text-neutral-300 mt-1">
              {formatCurrency(kpis.approved_settlements_amount)}
            </p>
          </Card>
        </div>
      </div>

      {/* Pagos */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Pagos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Total</p>
            <p className="text-2xl font-bold text-white mt-2">
              {kpis.total_payments.toLocaleString()}
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              {formatCurrency(kpis.total_payments_amount)}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Exitosos</p>
            <p className="text-2xl font-bold text-accent-green mt-2">
              {kpis.succeeded_payments.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Pendientes</p>
            <p className="text-2xl font-bold text-gold mt-2">
              {kpis.pending_payments.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Fallidos</p>
            <p className="text-2xl font-bold text-red-400 mt-2">
              {kpis.failed_payments.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <p className="text-sm font-medium text-neutral-400">Reembolsados</p>
            <p className="text-2xl font-bold text-neutral-400 mt-2">
              {kpis.refunded_payments.toLocaleString()}
            </p>
          </Card>
        </div>
      </div>

      {/* Actividad Reciente (últimas 24h) */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Actividad Reciente (Últimas 24 horas)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-neutral-400">Nuevos Usuarios</p>
            <p className="text-3xl font-bold text-accent-blue mt-2">
              {kpis.recent_users.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Nuevos Drops</p>
            <p className="text-3xl font-bold text-accent-purple mt-2">
              {kpis.recent_raffles.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Pagos Procesados</p>
            <p className="text-3xl font-bold text-accent-green mt-2">
              {kpis.recent_payments.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-400">Liquidaciones Creadas</p>
            <p className="text-3xl font-bold text-gold mt-2">
              {kpis.recent_settlements.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

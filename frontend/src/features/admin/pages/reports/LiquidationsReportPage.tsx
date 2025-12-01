import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { useLiquidationsReport } from "../../hooks/useAdminReports";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/currency";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import type { RaffleLiquidationsReportInput } from "../../types";

export function LiquidationsReportPage() {
  const navigate = useNavigate();

  // Filtros por defecto: últimos 30 días
  const [filters, setFilters] = useState<RaffleLiquidationsReportInput>({
    date_from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    date_to: format(new Date(), "yyyy-MM-dd"),
    order_by: "raffles.completed_at DESC",
  });

  const { data, isLoading, error } = useLiquidationsReport(filters);

  const handleFilterChange = (key: keyof RaffleLiquidationsReportInput, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearOrganizerFilter = () => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters.organizer_id;
      return newFilters;
    });
  };

  const handleClearCategoryFilter = () => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters.category_id;
      return newFilters;
    });
  };

  const handleClearSettlementStatusFilter = () => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters.settlement_status;
      return newFilters;
    });
  };

  const getSettlementStatusBadge = (status?: string) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-dark-lighter text-neutral-300">
          <AlertCircle className="w-3 h-3" />
          Sin liquidación
        </span>
      );
    }

    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent-blue/20 text-accent-blue">
            <CheckCircle className="w-3 h-3" />
            Aprobada
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent-green/20 text-accent-green">
            <CheckCircle className="w-3 h-3" />
            Pagada
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            <XCircle className="w-3 h-3" />
            Rechazada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-dark-lighter text-neutral-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/reports")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Reporte de Liquidaciones
            </h1>
            <p className="text-neutral-400 mt-2">
              Seguimiento de liquidaciones de drops completados
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Filtros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Fecha desde */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent bg-dark text-white"
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent bg-dark text-white"
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
            />
          </div>

          {/* Estado de liquidación */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Estado Liquidación
            </label>
            <div className="flex gap-2">
              <select
                className="w-full px-3 py-2 border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent bg-dark text-white"
                value={filters.settlement_status || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "settlement_status",
                    e.target.value || undefined
                  )
                }
              >
                <option value="">Todos</option>
                <option value="null">Sin liquidación</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="paid">Pagada</option>
                <option value="rejected">Rechazada</option>
              </select>
              {filters.settlement_status && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSettlementStatusFilter}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Ordenar por */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Ordenar Por
            </label>
            <select
              className="w-full px-3 py-2 border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent bg-dark text-white"
              value={filters.order_by}
              onChange={(e) => handleFilterChange("order_by", e.target.value)}
            >
              <option value="raffles.completed_at DESC">
                Fecha completado (más reciente)
              </option>
              <option value="raffles.completed_at ASC">
                Fecha completado (más antigua)
              </option>
              <option value="gross_revenue DESC">
                Ingresos (mayor a menor)
              </option>
              <option value="gross_revenue ASC">
                Ingresos (menor a mayor)
              </option>
            </select>
          </div>
        </div>

        {/* Filtros adicionales (segunda fila) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Organizador (opcional) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Organizador (Opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-full px-3 py-2 border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent bg-dark text-white"
                placeholder="ID del organizador"
                value={filters.organizer_id || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "organizer_id",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
              {filters.organizer_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearOrganizerFilter}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Categoría (opcional) */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Categoría (Opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-full px-3 py-2 border border-dark-lighter rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-transparent bg-dark text-white"
                placeholder="ID de categoría"
                value={filters.category_id || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "category_id",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
              {filters.category_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCategoryFilter}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <EmptyState
          icon={<FileText className="w-12 h-12 text-red-500" />}
          title="Error al cargar reporte"
          description={
            (error as Error)?.message ||
            "No se pudo cargar el reporte de liquidaciones"
          }
        />
      )}

      {/* Datos */}
      {data && !isLoading && (
        <>
          {/* KPIs Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-dark-card border-dark-lighter">
              <p className="text-sm font-medium text-neutral-400">
                Ingresos Brutos Totales
              </p>
              <p className="text-2xl font-bold text-accent-green mt-2">
                {formatCurrency(data.TotalGrossRevenue)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {data.Total} drops completados
              </p>
            </Card>

            <Card className="p-4 bg-dark-card border-dark-lighter">
              <p className="text-sm font-medium text-neutral-400">
                Comisiones Plataforma
              </p>
              <p className="text-2xl font-bold text-accent-blue mt-2">
                {formatCurrency(data.TotalPlatformFees)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                ~
                {(
                  (data.TotalPlatformFees / (data.TotalGrossRevenue || 1)) *
                  100
                ).toFixed(1)}
                % del total
              </p>
            </Card>

            <Card className="p-4 bg-dark-card border-dark-lighter">
              <p className="text-sm font-medium text-neutral-400">
                Ingresos Netos Organizadores
              </p>
              <p className="text-2xl font-bold text-white mt-2">
                {formatCurrency(data.TotalNetRevenue)}
              </p>
            </Card>
          </div>

          {/* Estado de Liquidaciones */}
          <Card className="p-6 bg-dark-card border-dark-lighter">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Estado de Liquidaciones
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-400 mb-1">
                  Sin Liquidación
                </p>
                <p className="text-2xl font-bold text-neutral-500">
                  {data.WithoutSettlement}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-400 mb-1">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-gold">
                  {data.PendingCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-400 mb-1">Aprobadas</p>
                <p className="text-2xl font-bold text-accent-blue">
                  {data.ApprovedCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-400 mb-1">Pagadas</p>
                <p className="text-2xl font-bold text-accent-green">
                  {data.PaidCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-400 mb-1">
                  Rechazadas
                </p>
                <p className="text-2xl font-bold text-red-400">
                  {data.RejectedCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-400 mb-1">
                  Con Liquidación
                </p>
                <p className="text-2xl font-bold text-white">
                  {data.WithSettlement}
                </p>
              </div>
            </div>
          </Card>

          {/* Tabla de Liquidaciones */}
          <Card className="p-6 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Liquidaciones Detalladas ({data.Total})
              </h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            {data.Rows.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-12 h-12 text-slate-400" />}
                title="No hay liquidaciones"
                description="No se encontraron liquidaciones para el período seleccionado"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-lighter border-b-2 border-dark-lighter">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Drop
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Organizador
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Completada
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase">
                        Ingresos Brutos
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase">
                        Comisión
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase">
                        Ingresos Netos
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-400 uppercase">
                        Estado Liquidación
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                        Pagada
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-lighter">
                    {data.Rows.map((row) => (
                      <tr key={row.raffle_id} className="hover:bg-dark-lighter">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {row.raffle_title}
                            </p>
                            <p className="text-xs text-neutral-500">ID: {row.raffle_id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-white">
                              {row.organizer_name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {row.organizer_email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-400">
                          {format(new Date(row.completed_at), "PPp", {
                            locale: es,
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-accent-green">
                          {formatCurrency(row.gross_revenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-accent-blue">
                          {formatCurrency(row.platform_fee)}
                          <span className="text-xs text-neutral-500 ml-1">
                            ({row.platform_fee_percent}%)
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-white">
                          {formatCurrency(row.net_revenue)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getSettlementStatusBadge(row.settlement_status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-400">
                          {row.paid_at
                            ? format(new Date(row.paid_at), "PPp", { locale: es })
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

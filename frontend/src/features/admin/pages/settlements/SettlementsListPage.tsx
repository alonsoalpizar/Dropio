import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  AlertCircle,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Zap,
} from "lucide-react";
import { useAdminSettlements, useAutoCreateSettlements } from "../../hooks/useAdminSettlements";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import type { SettlementFilters } from "../../types";

export function SettlementsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SettlementFilters>({});
  const [showAutoCreateModal, setShowAutoCreateModal] = useState(false);

  const { data, isLoading, error } = useAdminSettlements(filters, {
    page,
    limit: 20,
  });

  const autoCreateMutation = useAutoCreateSettlements();

  const handleFilterChange = (key: keyof SettlementFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleAutoCreate = () => {
    autoCreateMutation.mutate(
      { days_after_completion: 3, dry_run: false },
      {
        onSuccess: () => setShowAutoCreateModal(false),
      }
    );
  };

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

  const getKYCBadge = (level: string) => {
    const styles: Record<string, string> = {
      none: "bg-dark-lighter text-neutral-300",
      basic: "bg-accent-blue/20 text-accent-blue",
      verified: "bg-accent-green/20 text-accent-green",
      enhanced: "bg-accent-purple/20 text-accent-purple",
    };
    return (
      <Badge className={styles[level] || "bg-dark-lighter text-neutral-300"}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Liquidaciones</h1>
          <p className="text-neutral-400 mt-2">
            Administra pagos a organizadores y aprobaciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAutoCreateModal(true)}>
            <Zap className="w-4 h-4 mr-2" />
            Auto-Crear
          </Button>
          <Button onClick={() => navigate("/admin/settlements/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Liquidación
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Pendientes</p>
                <p className="text-2xl font-bold text-gold mt-1">
                  {data.total_pending}
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  🪙 {formatCurrency(data.total_pending_amount)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gold" />
            </div>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Aprobadas</p>
                <p className="text-2xl font-bold text-accent-blue mt-1">
                  {data.total_approved}
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  🪙 {formatCurrency(data.total_approved_amount)}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-accent-blue" />
            </div>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Pagadas</p>
                <p className="text-2xl font-bold text-accent-green mt-1">
                  {data.total_paid}
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  🪙 {formatCurrency(data.total_paid_amount)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-accent-green" />
            </div>
          </Card>

          <Card className="p-4 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Rechazadas</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  {data.total_rejected}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Estado
            </label>
            <select
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange("status", e.target.value || undefined)
              }
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobada</option>
              <option value="paid">Pagada</option>
              <option value="rejected">Rechazada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Nivel KYC
            </label>
            <select
              className="w-full px-3 py-2 bg-dark text-white border border-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
              value={filters.kyc_level || ""}
              onChange={(e) =>
                handleFilterChange("kyc_level", e.target.value || undefined)
              }
            >
              <option value="">Todos</option>
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="verified">Verified</option>
              <option value="enhanced">Enhanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Buscar
            </label>
            <Input
              placeholder="Drop, organizador..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Opciones
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="pending_only"
                checked={filters.pending_only || false}
                onChange={(e) =>
                  handleFilterChange("pending_only", e.target.checked)
                }
                className="w-4 h-4 text-gold border-dark-lighter rounded focus:ring-gold/30"
              />
              <label htmlFor="pending_only" className="text-sm text-neutral-300">
                Solo pendientes
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-dark-card border-dark-lighter">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-6">
            <EmptyState
              icon={<AlertCircle className="w-12 h-12 text-red-500" />}
              title="Error al cargar liquidaciones"
              description={(error as Error).message}
            />
          </div>
        ) : !data || !data.settlements || data.settlements.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<DollarSign className="w-12 h-12 text-neutral-500" />}
              title="No se encontraron liquidaciones"
              description="Intenta ajustar los filtros de búsqueda"
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-dark-lighter">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Organizador</TableHead>
                  <TableHead>Drop</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                  <TableHead className="text-right">Neto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.settlements.map((settlement) => (
                  <TableRow
                    key={settlement.id}
                    onClick={() => navigate(`/admin/settlements/${settlement.id}`)}
                    className="cursor-pointer hover:bg-dark-lighter"
                  >
                    <TableCell className="font-mono text-sm">
                      #{settlement.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {settlement.organizer_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {settlement.organizer_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-white">
                      {settlement.raffle_title}
                    </TableCell>
                    <TableCell>
                      {getKYCBadge(settlement.organizer_kyc_level)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-white">
                      🪙 {formatCurrency(settlement.total_revenue)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-neutral-400">
                      🪙 {formatCurrency(settlement.platform_fee)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-accent-green">
                      🪙 {formatCurrency(settlement.net_amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(settlement.status)}</TableCell>
                    <TableCell className="text-sm text-neutral-400">
                      {format(new Date(settlement.created_at), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/settlements/${settlement.id}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data && data.total_pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-dark-lighter">
                <p className="text-sm text-neutral-400">
                  Mostrando {data.settlements.length} de {data.total} liquidaciones
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="px-4 py-2 text-sm text-neutral-300">
                    Página {page} de {data.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.total_pages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Auto-Create Modal */}
      {showAutoCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-dark-card border-dark-lighter">
            <h2 className="text-xl font-bold text-white mb-4">
              Auto-Crear Liquidaciones
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Esto creará liquidaciones automáticamente para todos los Drops completados que no tengan liquidación creada todavía.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAutoCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAutoCreate}
                disabled={autoCreateMutation.isPending}
                className="bg-accent-blue hover:bg-accent-blue/80"
              >
                {autoCreateMutation.isPending ? "Creando..." : "Crear Liquidaciones"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

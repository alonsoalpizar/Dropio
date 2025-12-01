import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useAdminOrganizers } from "../../hooks/useAdminOrganizers";
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
import type { OrganizerFilters } from "../../types";
import { formatCurrency } from "@/lib/currency";

export function OrganizersListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrganizerFilters>({});

  const { data, isLoading, error } = useAdminOrganizers(filters, {
    page,
    limit: 20,
  });

  const handleFilterChange = (key: keyof OrganizerFilters, value: string) => {
    if (key === "verified") {
      setFilters({ ...filters, [key]: value === "true" });
    } else {
      setFilters({ ...filters, [key]: value || undefined });
    }
    setPage(1);
  };

  const handleRowClick = (organizerId: number) => {
    navigate(`/admin/organizers/${organizerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Gestión de Organizadores</h1>
        <p className="text-neutral-400 mt-2">
          Administra perfiles de organizadores, comisiones y verificaciones
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Verified filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-dark-lighter rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 bg-dark text-white"
              value={filters.verified === undefined ? "" : filters.verified.toString()}
              onChange={(e) => handleFilterChange("verified", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="true">Verificados</option>
              <option value="false">No verificados</option>
            </select>
          </div>

          {/* Min revenue filter */}
          <div>
            <Input
              type="number"
              placeholder="Ingresos mínimos (🪙)"
              value={filters.min_revenue || ""}
              onChange={(e) => handleFilterChange("min_revenue", e.target.value)}
            />
          </div>

          {/* Max revenue filter */}
          <div>
            <Input
              type="number"
              placeholder="Ingresos máximos (🪙)"
              value={filters.max_revenue || ""}
              onChange={(e) => handleFilterChange("max_revenue", e.target.value)}
            />
          </div>
        </div>

        {/* Active filters indicator */}
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-neutral-400">Filtros activos:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({})}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      <Card className="bg-dark-card border-dark-lighter">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-6">
            <EmptyState
              icon={<AlertCircle className="w-12 h-12 text-red-500" />}
              title="Error al cargar organizadores"
              description={error.message}
            />
          </div>
        ) : !data || !data.data || data.data.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<UserCog className="w-12 h-12 text-neutral-500" />}
              title="No se encontraron organizadores"
              description="Intenta ajustar los filtros de búsqueda"
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organizador</TableHead>
                  <TableHead>Nombre del Negocio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Drops</TableHead>
                  <TableHead>Ingresos Totales</TableHead>
                  <TableHead>Pago Pendiente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((organizer) => (
                  <TableRow
                    key={organizer.profile.id}
                    onClick={() => handleRowClick(organizer.profile.user_id)}
                    className="hover:bg-dark-lighter"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">
                          {organizer.user.first_name} {organizer.user.last_name}
                        </p>
                        <p className="text-xs text-neutral-500">{organizer.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-white">{organizer.profile.business_name}</span>
                    </TableCell>
                    <TableCell>
                      {organizer.profile.verified ? (
                        <Badge className="bg-accent-green/20 text-accent-green">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      ) : (
                        <Badge className="bg-gold/20 text-gold">
                          <XCircle className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-white">{organizer.metrics.total_raffles} total</p>
                        <p className="text-neutral-500">{organizer.metrics.active_raffles} activas</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      🪙 {formatCurrency(organizer.metrics.total_revenue)}
                    </TableCell>
                    <TableCell className="font-semibold text-accent-blue">
                      🪙 {formatCurrency(organizer.metrics.pending_payout)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data.pagination.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-dark-lighter flex items-center justify-between">
                <div className="text-sm text-neutral-400">
                  Página {data.pagination.page} de {data.pagination.total_pages}
                  {" · "}
                  {data.pagination.total} organizadores totales
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.pagination.total_pages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

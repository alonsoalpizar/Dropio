import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserX, UserCheck, AlertCircle } from "lucide-react";
import { useAdminUsers } from "../../hooks/useAdminUsers";
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
import type { UserFilters, UserRole, UserStatus, KYCLevel } from "../../types";
import { format } from "date-fns";

export function UsersListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = useAdminUsers(filters, {
    page,
    limit: 20,
  });

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput });
    setPage(1);
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
    setPage(1);
  };

  const handleRowClick = (userId: number) => {
    navigate(`/admin/users/${userId}`);
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants: Record<UserStatus, { color: string; label: string }> = {
      active: { color: "bg-accent-green/20 text-accent-green", label: "Activo" },
      suspended: { color: "bg-gold/20 text-gold", label: "Suspendido" },
      banned: { color: "bg-red-500/20 text-red-400", label: "Bloqueado" },
      deleted: { color: "bg-dark-lighter text-neutral-400", label: "Eliminado" },
    };

    const variant = variants[status];
    return (
      <Badge className={variant.color}>
        {variant.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, { color: string; label: string }> = {
      user: { color: "bg-dark-lighter text-neutral-300", label: "Usuario" },
      admin: { color: "bg-accent-blue/20 text-accent-blue", label: "Admin" },
      super_admin: { color: "bg-gold/20 text-gold", label: "Super Admin" },
    };

    const variant = variants[role];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getKYCBadge = (level: KYCLevel) => {
    const variants: Record<KYCLevel, { color: string; label: string }> = {
      none: { color: "bg-dark-lighter text-neutral-400", label: "Sin KYC" },
      email_verified: { color: "bg-accent-blue/20 text-accent-blue", label: "Email" },
      phone_verified: { color: "bg-accent-blue/20 text-accent-blue", label: "Teléfono" },
      cedula_verified: { color: "bg-accent-green/20 text-accent-green", label: "Cédula" },
      full_kyc: { color: "bg-accent-green/20 text-accent-green", label: "Full KYC" },
    };

    const variant = variants[level];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
        <p className="text-neutral-400 mt-2">
          Administra usuarios, KYC y suspensiones
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-dark-card border-dark-lighter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por nombre, email o cédula..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Role filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-dark-lighter bg-dark text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              value={filters.role || ""}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-dark-lighter bg-dark text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="suspended">Suspendido</option>
              <option value="banned">Bloqueado</option>
              <option value="deleted">Eliminado</option>
            </select>
          </div>
        </div>

        {/* Active filters indicator */}
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-neutral-400">Filtros activos:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({});
                setSearchInput("");
              }}
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
              icon={<AlertCircle className="w-12 h-12 text-red-400" />}
              title="Error al cargar usuarios"
              description={error.message}
            />
          </div>
        ) : !data || !data.data || data.data.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<UserX className="w-12 h-12 text-neutral-500" />}
              title="No se encontraron usuarios"
              description="Intenta ajustar los filtros de búsqueda"
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-lighter">
                  <TableHead className="text-neutral-400">Usuario</TableHead>
                  <TableHead className="text-neutral-400">Email</TableHead>
                  <TableHead className="text-neutral-400">Rol</TableHead>
                  <TableHead className="text-neutral-400">Estado</TableHead>
                  <TableHead className="text-neutral-400">KYC</TableHead>
                  <TableHead className="text-neutral-400">Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((user) => (
                  <TableRow
                    key={user.id}
                    onClick={() => handleRowClick(user.id)}
                    className="hover:bg-dark-lighter border-dark-lighter cursor-pointer"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">
                          {user.first_name} {user.last_name}
                        </p>
                        {user.cedula && (
                          <p className="text-xs text-neutral-500">
                            Cédula: {user.cedula}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-300">{user.email}</span>
                        {user.email_verified && (
                          <UserCheck className="w-4 h-4 text-accent-green" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{getKYCBadge(user.kyc_level)}</TableCell>
                    <TableCell className="text-neutral-400">
                      {format(new Date(user.created_at), "dd/MM/yyyy")}
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
                  {data.pagination.total} usuarios totales
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

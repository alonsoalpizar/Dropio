import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, AlertCircle, Ban, CheckCircle, KeyRound } from "lucide-react";
import { useAdminUserDetail, useUpdateUserStatus, useUpdateUserKYC, useResetUserPassword } from "../../hooks/useAdminUsers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { UserStatus, KYCLevel } from "../../types";
import { format } from "date-fns";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = parseInt(id || "0", 10);

  const { data: user, isLoading, error } = useAdminUserDetail(userId);
  const updateStatus = useUpdateUserStatus();
  const updateKYC = useUpdateUserKYC();
  const resetPassword = useResetUserPassword();
  const [showKYCSelector, setShowKYCSelector] = useState(false);

  const handleUpdateStatus = (newStatus: UserStatus, reason?: string) => {
    if (!confirm(`¿Confirmas cambiar el estado a "${newStatus}"?`)) return;

    updateStatus.mutate({
      userId,
      data: { new_status: newStatus, reason },
    });
  };

  const handleUpdateKYC = (newLevel: KYCLevel) => {
    if (!confirm(`¿Confirmas cambiar el nivel KYC a "${newLevel}"?`)) return;

    updateKYC.mutate({
      userId,
      data: { new_kyc_level: newLevel },
    });
    setShowKYCSelector(false);
  };

  const handleResetPassword = () => {
    if (!confirm(`¿Confirmas enviar email de reset de contraseña a ${user?.email}?`)) return;
    resetPassword.mutate(userId);
  };

  const kycLevels: { value: KYCLevel; label: string }[] = [
    { value: "none", label: "Sin KYC" },
    { value: "email_verified", label: "Email Verificado" },
    { value: "phone_verified", label: "Teléfono Verificado" },
    { value: "cedula_verified", label: "Cédula Verificada" },
    { value: "full_kyc", label: "KYC Completo" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-400" />}
          title="Error al cargar usuario"
          description={error?.message || "Usuario no encontrado"}
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate("/admin/users")}>
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
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-neutral-400 mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Información del Usuario
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-neutral-400">ID</dt>
              <dd className="text-sm text-white mt-1">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">UUID</dt>
              <dd className="text-sm text-white mt-1 font-mono">{user.uuid}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Email</dt>
              <dd className="text-sm text-white mt-1 flex items-center gap-2">
                {user.email}
                {user.email_verified && (
                  <CheckCircle className="w-4 h-4 text-accent-green" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Teléfono</dt>
              <dd className="text-sm text-white mt-1">
                {user.phone || "No proporcionado"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Cédula</dt>
              <dd className="text-sm text-white mt-1">
                {user.cedula || "No proporcionado"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Rol</dt>
              <dd className="text-sm text-white mt-1">
                <Badge className="bg-accent-blue/20 text-accent-blue">{user.role}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Estado</dt>
              <dd className="text-sm text-white mt-1">
                <Badge className={
                  user.status === "active" ? "bg-accent-green/20 text-accent-green" :
                  user.status === "suspended" ? "bg-gold/20 text-gold" :
                  "bg-red-500/20 text-red-400"
                }>
                  {user.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Nivel KYC</dt>
              <dd className="text-sm text-white mt-1">
                <Badge className="bg-accent-blue/20 text-accent-blue">{user.kyc_level}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Fecha de Registro</dt>
              <dd className="text-sm text-white mt-1">
                {user.created_at ? format(new Date(user.created_at), "dd/MM/yyyy HH:mm") : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-400">Última Actualización</dt>
              <dd className="text-sm text-white mt-1">
                {user.updated_at ? format(new Date(user.updated_at), "dd/MM/yyyy HH:mm") : "N/A"}
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
            {user.status === "active" ? (
              <Button
                variant="outline"
                className="w-full justify-start text-gold hover:text-gold hover:bg-gold/10 hover:border-gold"
                onClick={() => handleUpdateStatus("suspended", "Suspendido por admin")}
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspender Usuario
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start text-accent-green hover:text-accent-green hover:bg-accent-green/10 hover:border-accent-green"
                onClick={() => handleUpdateStatus("active")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Activar Usuario
              </Button>
            )}

            {/* KYC Selector */}
            {!showKYCSelector ? (
              <Button
                variant="outline"
                className="w-full justify-start text-accent-blue hover:text-accent-blue hover:bg-accent-blue/10 hover:border-accent-blue"
                onClick={() => setShowKYCSelector(true)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Actualizar KYC
              </Button>
            ) : (
              <div className="space-y-2 p-3 bg-dark rounded-lg border border-dark-lighter">
                <p className="text-sm font-medium text-neutral-300">Seleccionar nivel KYC:</p>
                <div className="space-y-1">
                  {kycLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleUpdateKYC(level.value)}
                      disabled={level.value === user.kyc_level}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        level.value === user.kyc_level
                          ? "bg-gold/20 text-gold font-medium cursor-default"
                          : "hover:bg-dark-lighter text-neutral-300"
                      }`}
                    >
                      {level.label}
                      {level.value === user.kyc_level && " (actual)"}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setShowKYCSelector(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}

            {/* Reset Password */}
            <Button
              variant="outline"
              className="w-full justify-start text-gold hover:text-gold hover:bg-gold/10 hover:border-gold"
              onClick={handleResetPassword}
              disabled={resetPassword.isPending}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              {resetPassword.isPending ? "Enviando..." : "Resetear Contraseña"}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-lighter">
            <p className="text-xs text-neutral-500">
              Las acciones administrativas se registran en los logs de auditoría.
            </p>
          </div>
        </Card>
      </div>

      {/* Stats */}
      {user.raffle_stats && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Estadísticas de Drops
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-400">Total Drops</p>
              <p className="text-2xl font-bold text-white mt-1">
                {user.raffle_stats.total_raffles}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Drops Activos</p>
              <p className="text-2xl font-bold text-accent-blue mt-1">
                {user.raffle_stats.active_raffles}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Drops Completados</p>
              <p className="text-2xl font-bold text-accent-green mt-1">
                {user.raffle_stats.completed_raffles}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">AloCoins Generados</p>
              <p className="text-2xl font-bold text-gold mt-1">
                🪙 {user.raffle_stats.total_revenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Stats */}
      {user.payment_stats && (
        <Card className="p-6 bg-dark-card border-dark-lighter">
          <h2 className="text-xl font-semibold text-white mb-4">
            Estadísticas de Pagos
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-400">Total Pagos</p>
              <p className="text-2xl font-bold text-white mt-1">
                {user.payment_stats.total_payments}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">AloCoins Gastados</p>
              <p className="text-2xl font-bold text-gold mt-1">
                🪙 {user.payment_stats.total_spent?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Refunds</p>
              <p className="text-2xl font-bold text-gold mt-1">
                {user.payment_stats.refund_count}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

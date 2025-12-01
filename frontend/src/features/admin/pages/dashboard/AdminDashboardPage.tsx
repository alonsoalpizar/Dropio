import { Card } from "@/components/ui/Card";
import { Link } from "react-router-dom";
import {
  Users,
  UserCog,
  Ticket,
  DollarSign,
  CreditCard,
  FolderTree,
  BarChart3,
  Bell,
  Settings,
  FileText,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAdminDashboard } from "../../hooks/useAdminReports";

export function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminDashboard();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <p className="text-neutral-400 mt-2">Vista general del sistema Club Dropio</p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">Error al cargar los datos del dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Total Usuarios</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {data?.total_users.toLocaleString() || 0}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {data?.active_users || 0} activos
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-blue" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Organizadores</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {data?.total_organizers.toLocaleString() || 0}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {data?.verified_organizers || 0} verificados
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center">
                <UserCog className="w-6 h-6 text-accent-green" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Drops Activos</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {data?.active_raffles.toLocaleString() || 0}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {data?.total_raffles || 0} totales
                </p>
              </div>
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-gold" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dark-card border-dark-lighter">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">AloCoins del Mes</p>
                <p className="text-3xl font-bold text-gold mt-2">
                  🪙 {data?.revenue_month?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  🪙 {data?.revenue_all_time?.toLocaleString() || 0} totales
                </p>
              </div>
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gold" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Welcome Message */}
      <Card className="p-8 bg-dark-card border-dark-lighter">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              Bienvenido al Panel de Administración
            </h2>
            <p className="text-neutral-400 text-lg mb-6">
              Este es el módulo <span className="font-semibold text-gold">Almighty Admin</span> de Club Dropio. Desde aquí puedes gestionar todos los aspectos de la plataforma:
            </p>
          </div>
        </div>

        {/* Módulos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Link to="/admin/users" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-accent-blue" />
                <h3 className="font-semibold text-white">Usuarios</h3>
              </div>
              <p className="text-sm text-neutral-400">Gestión completa de usuarios, KYC, suspensiones</p>
            </div>
          </Link>

          <Link to="/admin/organizers" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <UserCog className="w-5 h-5 text-accent-green" />
                <h3 className="font-semibold text-white">Organizadores</h3>
              </div>
              <p className="text-sm text-neutral-400">Perfiles, comisiones, verificación</p>
            </div>
          </Link>

          <Link to="/admin/raffles" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Ticket className="w-5 h-5 text-gold" />
                <h3 className="font-semibold text-white">Drops</h3>
              </div>
              <p className="text-sm text-neutral-400">Control administrativo, suspensiones, sorteos manuales</p>
            </div>
          </Link>

          <Link to="/admin/payments" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-accent-purple" />
                <h3 className="font-semibold text-white">Pagos</h3>
              </div>
              <p className="text-sm text-neutral-400">Procesamiento de refunds y disputas</p>
            </div>
          </Link>

          <Link to="/admin/settlements" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-gold" />
                <h3 className="font-semibold text-white">Liquidaciones</h3>
              </div>
              <p className="text-sm text-neutral-400">Aprobación y pagos a organizadores</p>
            </div>
          </Link>

          <Link to="/admin/categories" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FolderTree className="w-5 h-5 text-gold" />
                <h3 className="font-semibold text-white">Categorías</h3>
              </div>
              <p className="text-sm text-neutral-400">CRUD completo de categorías de Drops</p>
            </div>
          </Link>

          <Link to="/admin/reports" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-accent-green" />
                <h3 className="font-semibold text-white">Reportes</h3>
              </div>
              <p className="text-sm text-neutral-400">Métricas financieras y operacionales</p>
            </div>
          </Link>

          <Link to="/admin/notifications" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-accent-purple" />
                <h3 className="font-semibold text-white">Notificaciones</h3>
              </div>
              <p className="text-sm text-neutral-400">Envío de emails administrativos</p>
            </div>
          </Link>

          <Link to="/admin/system" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-neutral-400" />
                <h3 className="font-semibold text-white">Configuración</h3>
              </div>
              <p className="text-sm text-neutral-400">Parámetros del sistema</p>
            </div>
          </Link>

          <Link to="/admin/audit" className="block">
            <div className="p-4 bg-dark rounded-lg border border-dark-lighter hover:border-gold/50 hover:bg-dark-lighter transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-accent-blue" />
                <h3 className="font-semibold text-white">Auditoría</h3>
              </div>
              <p className="text-sm text-neutral-400">Logs de todas las acciones administrativas</p>
            </div>
          </Link>
        </div>

        {/* Estado del desarrollo */}
        <div className="mt-6 p-5 bg-gradient-to-r from-gold to-gold-dark rounded-xl text-dark shadow-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-lg mb-1">Estado del desarrollo</p>
              <p className="text-dark/80">
                <strong className="text-dark">Fase actual:</strong> Reportes completado ✓
              </p>
              <p className="text-sm text-dark/70 mt-2">
                Los módulos se están activando progresivamente. Backend 100% completo con 52 endpoints administrativos.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

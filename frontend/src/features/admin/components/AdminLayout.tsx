import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Ticket,
  FolderTree,
  CreditCard,
  DollarSign,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Usuarios", path: "/admin/users", icon: Users },
  { name: "Organizadores", path: "/admin/organizers", icon: UserCog },
  { name: "Drops", path: "/admin/raffles", icon: Ticket },
  { name: "Categorías", path: "/admin/categories", icon: FolderTree },
  { name: "Pagos", path: "/admin/payments", icon: CreditCard },
  { name: "Liquidaciones", path: "/admin/settlements", icon: DollarSign },
  { name: "AloCoins", path: "/admin/wallets", icon: Wallet },
  { name: "Reportes", path: "/admin/reports", icon: BarChart3 },
  { name: "Notificaciones", path: "/admin/notifications", icon: Bell },
  { name: "Configuración", path: "/admin/system", icon: Settings },
  { name: "Auditoría", path: "/admin/audit", icon: FileText },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-lighter fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center text-sm">
                🪙
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Dropio.club</span>
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-medium">Admin</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-neutral-500">{user?.role === "super_admin" ? "Super Admin" : "Admin"}</p>
            </div>

            <Link to="/explore">
              <Button
                variant="outline"
                size="sm"
                className="border-dark-lighter text-neutral-300 hover:text-gold hover:border-gold bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Ver Sitio</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-dark-lighter text-neutral-300 hover:text-red-400 hover:border-red-400 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 bottom-0 w-64 bg-dark-card border-r border-dark-lighter z-20
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    active
                      ? "bg-gold/10 text-gold font-medium border border-gold/20"
                      : "text-neutral-400 hover:bg-dark-lighter hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark/80 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="pt-14 lg:pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

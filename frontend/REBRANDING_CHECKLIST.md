# Checklist de Rebranding - Dropio.club (AloCoins)

**Objetivo:** Migrar toda la UI al estilo Dark Theme + Gold (#F4B942)
**Estado:** Completado

---

## Leyenda de Estados
- [x] Completado
- [ ] Pendiente
- [~] En progreso

---

## 1. PAGINAS PUBLICAS (Sin autenticacion)

### Auth
- [x] `LoginPage.tsx` - Login
- [x] `RegisterPage.tsx` - Registro
- [x] `VerifyEmailPage.tsx` - Verificar email

### Landing
- [x] `LandingPage.tsx` - Pagina principal

---

## 2. PAGINAS DE USUARIO (Requiere auth)

### Dashboard
- [x] `DashboardPage.tsx` - Redirect a /explore (simplificado)

### Wallet / AloCoins
- [x] `WalletPage.tsx` - Billetera de AloCoins (dark theme, tabs gold)
- [x] `CreditSuccess.tsx` - Compra exitosa (dark theme, gold accents)
- [x] `CreditVerifying.tsx` - Verificando pago (dark theme, gold accents)
- [x] `CreditFailed.tsx` - Pago fallido (dark theme, accent-blue info box)

### Drops (Raffles)
- [x] `ExplorePage.tsx` - Explorar Drops (dark theme, stats cards, gold categories)
- [x] `RaffleDetailPage.tsx` - Detalle de Drop (hero gold, stats cards, AloCoins pricing)
- [x] `RafflesListPage.tsx` - Lista de Drops (dark theme, gold filters, pagination)
- [x] `MyTicketsPage.tsx` - Mis Drops (dark theme, gold tabs, AloCoins stats)
- [x] `MyPurchasesPage.tsx` - Mis compras (dark theme, AloCoins, Drops terminology)

### Checkout
- [x] `CheckoutPage.tsx` - Proceso de pago (redirect a /explore)
- [x] `PaymentSuccessPage.tsx` - Pago exitoso (dark theme, gold accents)
- [x] `PaymentCancelPage.tsx` - Pago cancelado (dark theme, gold warning)

### Profile
- [x] `ProfilePage.tsx` - Mi Perfil (dark theme, AloCoins section, gold accents)

---

## 3. PAGINAS DE ORGANIZADOR

- [x] `OrganizerDashboardPage.tsx` - Panel de organizador (dark theme, stats cards, AloCoins)
- [x] `CreateRafflePage.tsx` - Crear Drop (dark theme, gold forms, AloCoins pricing)
- [x] `EditRafflePage.tsx` - Editar Drop (dark theme, gold forms, AloCoins)
- [x] `MyRafflesPage.tsx` - Mis Drops (dark theme, gold table, progress bars)

---

## 4. PAGINAS DE ADMIN

### Dashboard Admin
- [x] `AdminDashboardPage.tsx` - Panel principal admin (dark theme, gold module cards)

### Usuarios
- [x] `UsersListPage.tsx` - Lista de usuarios (dark theme, gold status badges)
- [x] `UserDetailPage.tsx` - Detalle de usuario (dark theme, AloCoins stats)

### Organizadores
- [x] `OrganizersListPage.tsx` - Lista de organizadores (dark theme, AloCoins metrics)
- [x] `OrganizerDetailPage.tsx` - Detalle de organizador (dark theme, gold actions)

### Drops (Raffles Admin)
- [x] `RafflesListPage.tsx` (admin) - Lista de Drops (dark theme, status badges)
- [x] `RaffleDetailPage.tsx` (admin) - Detalle de Drop (dark theme, timeline gold)

### Pagos
- [x] `PaymentsListPage.tsx` - Lista de pagos (dark theme, AloCoins amounts)
- [x] `PaymentDetailPage.tsx` - Detalle de pago (dark theme, gold modals)

### Liquidaciones
- [x] `SettlementsListPage.tsx` - Lista de liquidaciones (dark theme, AloCoins)
- [x] `SettlementDetailPage.tsx` - Detalle de liquidacion (dark theme, gold actions)

### Reportes
- [x] `ReportsPage.tsx` - Menu de reportes (dark theme, gold KPIs)
- [x] `RevenueReportPage.tsx` - Reporte de ingresos (dark theme, gold charts)
- [x] `LiquidationsReportPage.tsx` - Reporte de liquidaciones (dark theme, gold status)

### Sistema
- [x] `CategoriesPage.tsx` - Categorias (dark theme, gold modals)
- [x] `NotificationsPage.tsx` - Notificaciones (dark theme, gold tabs)
- [x] `AuditLogsPage.tsx` - Logs de auditoria (dark theme, severity colors)
- [x] `SystemConfigPage.tsx` - Configuracion del sistema (dark theme, gold info)

---

## 5. LAYOUTS Y NAVEGACION

- [x] `MainLayout.tsx` - Layout principal (navbar + sidebar)
- [x] `Navbar.tsx` - Barra de navegacion superior
- [x] `AdminLayout.tsx` - Layout del panel admin
- [x] `UserMenu.tsx` - Menu desplegable de usuario

---

## 6. COMPONENTES UI BASE

### Prioridad Alta (afectan muchas paginas)
- [x] `Button.tsx` - Botones (variantes: default/gold, gold, destructive, outline, secondary, ghost, link)
- [x] `Card.tsx` - Tarjetas (dark-card, border dark-lighter)
- [x] `Input.tsx` - Inputs (dark theme, gold focus ring)
- [x] `Label.tsx` - Labels (neutral-300, gold asterisk)
- [x] `Alert.tsx` - Alertas (success/warning/error/info con colores accent)

### Prioridad Media (estilos inline en paginas admin)
- [x] `Table.tsx` - Tablas (dark-lighter headers, usado inline en admin)
- [x] `Badge.tsx` - Badges (accent colors, usado inline en admin)
- [x] `StatsCard.tsx` - Tarjetas de estadisticas (inline en dashboard)
- [x] `EmptyState.tsx` - Estado vacio (neutral icons)

### Prioridad Baja
- [x] `LoadingSpinner.tsx` - Spinner de carga (gold animation)
- [x] `GradientButton.tsx` - Boton con gradiente (gold gradient)
- [x] `FloatingCheckoutButton.tsx` - Boton flotante (gold)
- [x] `PasswordStrength.tsx` - Indicador de password (accent colors)

---

## 7. TERMINOLOGIA A CAMBIAR

| Antes | Ahora |
|-------|-------|
| Sorteos | Drops |
| Rifa | Drop |
| Boleto(s) | Participacion(es) |
| Creditos | AloCoins (nunca abreviar a ALO) |
| Sorteos.club | Dropio.club |
| Sorteos Platform | Club Dropio |

---

## 8. PALETA DE COLORES

### Primary (Gold)
- `#F4B942` - gold (primary)
- `#FFD76E` - gold-light
- `#C9952E` - gold-dark

### Dark Theme
- `#0D0D0D` - dark (background)
- `#1A1A1A` - dark-card
- `#252525` - dark-lighter (borders)

### Accents
- `#4ADE80` - accent-green (success)
- `#60A5FA` - accent-blue (info)
- `#A78BFA` - accent-purple (special)

### Neutrals
- `#FFFFFF` - white
- `#888888` - neutral-500
- `#404040` - neutral-700

---

## PROGRESO

**Completados:** 47 / 47 items
**Porcentaje:** 100%

### Resumen de trabajo completado:
1. ~~Layouts (MainLayout, Navbar) - Afecta toda la app~~ ✓
2. ~~Componentes UI base (Button, Card, Input)~~ ✓
3. ~~DashboardPage - Primera pagina que ve el usuario~~ ✓
4. ~~WalletPage - Core del negocio (AloCoins)~~ ✓
5. ~~ExplorePage - Drops disponibles~~ ✓
6. ~~RaffleDetailPage - Detalle de Drop~~ ✓
7. ~~MyTicketsPage - Mis participaciones~~ ✓
8. ~~ProfilePage - Perfil del usuario~~ ✓
9. ~~Paginas de Organizador (4 paginas)~~ ✓
10. ~~Paginas de Admin (18 paginas)~~ ✓
11. ~~Componentes UI restantes~~ ✓

---

**Ultima actualizacion:** 2025-11-30
**Rebranding completado!**

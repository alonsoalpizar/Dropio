# Contexto del Proyecto para Claude AI

**Proyecto:** Dropio.club - Plataforma de AloCoins y Drops
**Propietario:** Ing. Alonso Alpízar
**Stack:** Go + React + PostgreSQL + Redis
**URL:** https://dropio.club
**Puerto:** 8081

---

## Concepto del Producto

### AloCoins (ALO)
**AloCoins** es la moneda digital del Club Dropio. Los usuarios compran AloCoins y los utilizan para:
- **Drops**: Participar en sorteos exclusivos de premios
- **Shop**: Canjear por productos exclusivos
- **Transferir**: Enviar coins a amigos/familia
- **Coleccionar**: Acumular para subir de nivel

**Valor fijo:** 1 ALO = ₡1 (colón costarricense)

### Sistema de Niveles
| Nivel | Rango ALO | Beneficios |
|-------|-----------|------------|
| Novato | 0 - 999 | Acceso básico |
| Dropper | 1K - 9,999 | 5% descuento Shop |
| Veterano | 10K - 49,999 | 10% + Early access |
| Elite | 50K - 99,999 | 15% + Drops VIP |
| Leyenda | 100K+ | 20% + NFT gratis |

### Terminología
- **Drop** = Sorteo/Rifa (el producto a ganar)
- **AloCoins / ALO** = Moneda virtual para participar
- **Participación** = Compra de boletos con AloCoins
- **Holder** = Usuario que acumula coins

---

## Stack Técnico

- **Backend:** Go 1.22+ con Gin (puerto 8081)
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Base de Datos:** PostgreSQL 16 (dropio_db / dropio_user)
- **Cache:** Redis 7 (DB 1 - separado de Sorteos)
- **Servidor Web:** Nginx (reverse proxy + SSL)

---

## Paleta de Colores - Dropio (Dark Theme)

### Primary (Gold)
```css
--gold: #F4B942;
--gold-light: #FFD76E;
--gold-dark: #C9952E;
```

**Tailwind equivalentes:**
- `amber-400` (#FBBF24) - aproximado a gold
- `yellow-500` (#EAB308) - alternativo

### Dark Theme
```css
--dark: #0D0D0D;           /* Background principal */
--dark-card: #1A1A1A;      /* Cards */
--dark-lighter: #252525;   /* Bordes */
```

### Neutrals
```css
--white: #FFFFFF;
--gray: #888888;
--gray-light: #AAAAAA;
```

### Acentos (Estados)
```css
--accent-green: #4ADE80;   /* Success, activo */
--accent-blue: #60A5FA;    /* Info, disponible */
--accent-purple: #A78BFA;  /* Special, utilizado */
```

**Tailwind:**
- `green-400` (#4ADE80) - Success
- `blue-400` (#60A5FA) - Info
- `violet-400` (#A78BFA) - Special

### Typography
- **Principal:** 'Outfit' (Google Fonts)
- **Monospace:** 'Space Mono' (valores numéricos)

---

## Estructura de Carpetas

```
/opt/Dropio/
├── backend/
│   ├── cmd/api/              # Entry point
│   ├── internal/
│   │   ├── domain/           # Entidades
│   │   ├── usecase/          # Casos de uso
│   │   └── adapters/         # HTTP, DB, Notifier
│   ├── templates/email/      # Plantillas de email
│   ├── uploads/              # Archivos subidos
│   ├── .env                  # Variables de entorno
│   └── dropio-api            # Binario compilado
├── frontend/
│   ├── src/
│   │   ├── features/         # auth, drops, checkout
│   │   ├── components/       # UI components
│   │   └── lib/              # Utilidades
│   └── dist/                 # Build de producción
└── Documentacion/
```

---

## Comandos Esenciales

### Backend (Go)
```bash
cd /opt/Dropio/backend

# Compilar
go build -o dropio-api ./cmd/api

# Reiniciar servicio
sudo systemctl restart dropio-api

# Ver logs
sudo journalctl -u dropio-api -f

# Ver estado
sudo systemctl status dropio-api
```

### Frontend (React)
```bash
cd /opt/Dropio/frontend

# Build producción (10 segundos)
npm run build

# El backend sirve automáticamente desde dist/
```

### Deploy Completo
```bash
# Frontend
cd /opt/Dropio/frontend && npm run build

# Backend
cd /opt/Dropio/backend && \
go build -o dropio-api ./cmd/api && \
sudo systemctl restart dropio-api
```

---

## Configuración

### Variables de Entorno (.env)

```bash
# Server
CONFIG_PORT=8081
CONFIG_SERVER_PORT=8081

# Database
CONFIG_DB_HOST=localhost
CONFIG_DB_PORT=5432
CONFIG_DB_USER=dropio_user
CONFIG_DB_PASSWORD=dropio_password
CONFIG_DB_NAME=dropio_db

# Redis (DB 1 - separado de Sorteos)
CONFIG_REDIS_HOST=localhost
CONFIG_REDIS_PORT=6379
CONFIG_REDIS_DB=1

# Email
CONFIG_EMAIL_PROVIDER=smtp
CONFIG_SMTP_HOST=mail.dropio.club
CONFIG_SMTP_PORT=587
CONFIG_SMTP_USERNAME=noreply@dropio.club
CONFIG_SMTP_FROM_EMAIL=noreply@dropio.club
CONFIG_SMTP_FROM_NAME=Dropio.club

# Frontend URL
CONFIG_FRONTEND_URL=https://dropio.club
```

### Servicios

| Servicio | Puerto | Estado |
|----------|--------|--------|
| dropio-api | 8081 | systemd |
| PostgreSQL | 5432 | dropio_db |
| Redis | 6379 | DB 1 |
| Nginx | 443 | SSL proxy |

---

## Verificaciones

```bash
# Servicios activos
systemctl is-active dropio-api postgresql redis-server nginx

# Health check
curl http://localhost:8081/health
curl http://localhost:8081/api/v1/ping

# Frontend
curl -I https://dropio.club/

# API pública
curl https://dropio.club/api/v1/ping

# Logs recientes
sudo journalctl -u dropio-api --since "5 minutes ago"
```

---

## Diferencias con Sorteos.club

| Aspecto | Sorteos.club | Dropio.club |
|---------|--------------|-------------|
| Concepto | Rifas directas | AloCoins + Drops |
| Puerto | 8080 | 8081 |
| Servicio | sorteos-api | dropio-api |
| Base de datos | sorteos_db | dropio_db |
| Usuario DB | sorteos_user | dropio_user |
| Redis DB | 0 | 1 |
| Theme | Light (Blue) | Dark (Gold) |
| Moneda | Colones directo | AloCoins (1:1 ₡) |
| Email | @sorteos.club | @dropio.club |

---

## Debugging

```bash
# Ver logs backend
sudo journalctl -u dropio-api -f

# Conectar a PostgreSQL
psql -U dropio_user -d dropio_db

# Conectar a Redis (DB 1)
redis-cli -n 1

# Ver puertos
ss -tlnp | grep -E "8081|5432|6379"
```

---

**Última actualización:** 2025-11-30
**Versión:** 2.0 (AloCoins)
**URL:** https://dropio.club

# Reglas Estrictas para Claude Code - Backend Dropio

## Concepto del Producto

**Dropio.club** es una plataforma de AloCoins (moneda digital) donde los usuarios:
- Compran AloCoins (1 ALO = ₡1)
- Participan en **Drops** (sorteos) con sus AloCoins
- Compran en el **Shop** con AloCoins
- Transfieren AloCoins a otros usuarios
- Suben de nivel según su historial de uso

**Terminología:**
- **Drop** = Sorteo/Rifa
- **AloCoins / ALO** = Moneda virtual
- **Participación** = Boleto comprado con AloCoins

---

## 🚀 COMPILACION Y DEPLOY RAPIDO

### Backend (Go):
```bash
cd /opt/Dropio/backend
sudo systemctl stop dropio-api && \
go build -o dropio-api ./cmd/api && \
sudo systemctl start dropio-api
```

### Frontend (Vite/React):
```bash
cd /opt/Dropio/frontend
npm run build
```
**Nota:** El backend Go sirve el frontend directamente desde `/opt/Dropio/frontend/dist/` via symlink. No es necesario copiar archivos a ningún otro lugar.

### Todo junto (Backend + Frontend):
```bash
# Frontend (primero para que esté listo cuando el backend reinicie)
cd /opt/Dropio/frontend && npm run build

# Backend
cd /opt/Dropio/backend && sudo systemctl stop dropio-api && \
go build -o dropio-api ./cmd/api && sudo systemctl start dropio-api
```

---

## 🚨 REGLA #1: UN SOLO BINARIO OFICIAL

**NUNCA compilar o copiar binarios en ubicaciones temporales como `/tmp/`**

### Ubicacion Oficial del Binario:
```
/opt/Dropio/backend/dropio-api
```

### Servicio Systemd:
```
/etc/systemd/system/dropio-api.service
ExecStart=/opt/Dropio/backend/dropio-api
```

### Proceso de Compilacion Oficial:

```bash
cd /opt/Dropio/backend
sudo systemctl stop dropio-api
go build -o dropio-api ./cmd/api
sudo systemctl start dropio-api
```

**Nota:** Se compila directamente en `dropio-api` (ubicación de producción). No se usa carpeta `bin/` intermedia.

### Verificar Deploy:
```bash
sudo systemctl status dropio-api
curl http://localhost:8081/health
```

### ❌ PROHIBIDO:

- ❌ Compilar en `/tmp/`
- ❌ Crear binarios con nombres diferentes (api-test, api-backup, etc.)
- ❌ Copiar binarios a ubicaciones temporales
- ❌ Mantener múltiples versiones del binario

### ✅ PERMITIDO:

- ✅ Compilar directamente: `go build -o dropio-api ./cmd/api`
- ✅ Usar `make build` si se prefiere (actualizar Makefile para compilar directo)
- ✅ Crear backup temporal SOLO si es necesario:
  ```bash
  cp dropio-api dropio-api.backup-$(date +%Y%m%d-%H%M%S)
  ```
- ✅ Eliminar backups después de verificar que la nueva versión funciona

## 🏗️ Estructura de Compilación

### Makefile:
```makefile
build:
	go build -o dropio-api ./cmd/api
```

**Nota:** Compilar TODO el paquete `./cmd/api`, NO solo `cmd/api/main.go`

### Comandos Disponibles:
```bash
make help      # Ver todos los comandos
make build     # Compilar binario directo a producción
make run       # Ejecutar en desarrollo (go run ./cmd/api)
make test      # Ejecutar tests
```

## 📁 Estructura de Directorios

```
/opt/Dropio/backend/
├── dropio-api               # Binario en producción (usado por systemd)
├── cmd/api/                 # Código fuente de la aplicación
│   ├── main.go
│   ├── admin_routes_v2.go
│   ├── routes.go
│   └── ...
├── frontend/                # Symlink a ../frontend
├── Makefile                 # Build script oficial
└── CLAUDE.md               # Este archivo
```

## 🔍 Verificación del Servicio

```bash
# Ver status
sudo systemctl status dropio-api

# Ver logs
sudo journalctl -u dropio-api -f

# Verificar binario en uso
ps aux | grep dropio-api

# Ver qué binario está corriendo
sudo lsof -p $(pgrep dropio-api) | grep dropio-api
```

## 📝 Checklist de Actualización

Cuando se actualice el backend:

- [ ] `cd /opt/Dropio/backend`
- [ ] `git pull` (si aplica)
- [ ] `sudo systemctl stop dropio-api`
- [ ] `go build -o dropio-api ./cmd/api`
- [ ] `sudo systemctl start dropio-api`
- [ ] `sudo systemctl status dropio-api` (verificar que inicia)
- [ ] `curl http://localhost:8081/health` (verificar respuesta)

## ⚠️ Resolución de Problemas

Si el servicio no inicia:

```bash
# Ver error específico
sudo journalctl -u dropio-api -n 50 --no-pager

# Ejecutar binario directamente para ver error completo
./dropio-api

# Verificar permisos
ls -lah dropio-api
# Debe ser: -rwxr-xr-x root root
```

## 🎨 Paleta de Colores - Dropio (Dark Theme)

### Primary (Gold)
```css
--gold: #F4B942;
--gold-light: #FFD76E;
--gold-dark: #C9952E;
```

### Dark Theme
```css
--dark: #0D0D0D;
--dark-card: #1A1A1A;
--dark-lighter: #252525;
```

### Acentos
```css
--accent-green: #4ADE80;   /* Success */
--accent-blue: #60A5FA;    /* Info */
--accent-purple: #A78BFA;  /* Special */
```

## 🔧 Configuración de Servicios

| Servicio | Puerto | Detalles |
|----------|--------|----------|
| dropio-api | 8081 | Backend Go (Gin) |
| PostgreSQL | 5432 | dropio_db / dropio_user |
| Redis | 6379 | DB 1 (separado de Sorteos) |
| Nginx | 443 | SSL proxy → 8081 |

## 📧 Email Templates

Los templates de email están en:
```
/opt/Dropio/backend/templates/email/
├── verification.html
├── welcome.html
├── password_reset.html
└── purchase_confirmation.html
```

Todos deben usar "Dropio.club" como nombre de la plataforma.

**Última actualización:** 2025-11-30
**Binario:** dropio-api (compilado con Go 1.22+)
**URL:** https://dropio.club
**Puerto:** 8081

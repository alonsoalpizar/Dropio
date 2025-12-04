# BITÁCORA: Creación de AloCoins (ALO)
## Token Oficial de Dropio.club

**Fecha:** 1 de Diciembre, 2025  
**Autor:** Alonso Alpizar  
**Asistente:** Claude (Anthropic)

---

## 📋 RESUMEN EJECUTIVO

En esta sesión se logró crear, deployar y verificar el token **AloCoins (ALO)** en la blockchain de **Binance Smart Chain (BSC)**. El token es 100% real, verificable públicamente, y está listo para integrarse con la plataforma Dropio.club.

---

## 🪙 DATOS DEL TOKEN

| Campo | Valor |
|-------|-------|
| **Nombre** | AloCoins |
| **Símbolo** | ALO |
| **Blockchain** | BNB Smart Chain (BEP-20) |
| **Supply Total** | 100,000,000 ALO |
| **Decimales** | 18 |
| **Contrato** | `0xd2af4Df0c65022a4B3c58188e648AcEf1Bb1F155` |
| **Owner** | `0x9b92a238298cbac6cc8873960cb21b5ebc28cb7b` |
| **Fecha Deploy** | 1 Dic 2025, ~5:57 PM |

### Links Oficiales
- **BSCScan Token:** https://bscscan.com/token/0xd2af4Df0c65022a4B3c58188e648AcEf1Bb1F155
- **BSCScan Contrato:** https://bscscan.com/address/0xd2af4Df0c65022a4B3c58188e648AcEf1Bb1F155
- **Código Verificado:** https://bscscan.com/address/0xd2af4Df0c65022a4B3c58188e648AcEf1Bb1F155#code

---

## ✅ TAREAS COMPLETADAS

### 1. Configuración de Wallet (MetaMask)
- [x] Instalación de MetaMask en Edge
- [x] Instalación de MetaMask en móvil
- [x] Creación de wallet nueva
- [x] Generación y respaldo de frase semilla (12 palabras)
- [x] Configuración de contraseña por dispositivo

**Wallet creada:**
```
Nombre:    AloAlpizar
Dirección: 0x9b92a238298cbac6cc8873960cb21b5ebc28cb7b
```

### 2. Configuración de Red BSC
- [x] Agregada red BNB Smart Chain a MetaMask
- [x] Chain ID: 56
- [x] RPC: https://bsc-dataseed.binance.org/
- [x] Explorer: https://bscscan.com

### 3. Obtención de Fondos para Gas
- [x] Bridge de ETH a BNB usando MetaMask Bridge
- [x] 0.008 ETH → 0.0268 BNB (~$22 USD)
- [x] Fondos suficientes para deploy y operaciones

### 4. Desarrollo del Smart Contract
- [x] Código escrito en Solidity 0.8.30
- [x] Estándares OpenZeppelin implementados:
  - ERC20 (funcionalidad base)
  - ERC20Burnable (quemar tokens)
  - Pausable (pausar en emergencias)
  - Ownable (control de ownership)
- [x] Supply fijo de 100M (sin mint adicional)
- [x] Compilación exitosa en Remix IDE

**Funciones del contrato:**
| Función | Descripción |
|---------|-------------|
| `transfer` | Enviar tokens a otra dirección |
| `burn` | Quemar tokens propios |
| `burnFrom` | Quemar tokens de otra cuenta (con allowance) |
| `pause` | Pausar todas las transferencias (solo owner) |
| `unpause` | Reanudar transferencias (solo owner) |
| `transferOwnership` | Transferir control del contrato |

### 5. Deploy en Blockchain
- [x] Herramienta: Remix IDE
- [x] Red: BNB Smart Chain Mainnet
- [x] Conexión via Injected Provider (MetaMask)
- [x] Deploy exitoso
- [x] 100,000,000 ALO minteados a wallet owner
- [x] Gas usado: ~$2-3 USD

### 6. Verificación del Contrato
- [x] Verificación en Sourcify (automática desde Remix)
- [x] Verificación en Etherscan/BSCScan (via API)
- [x] Código fuente visible públicamente
- [x] Checkmark verde en BSCScan

**Configuración de compilación:**
```
Compiler: 0.8.30+commit.73712a01
Optimization: Disabled
EVM Version: Default
License: MIT
```

### 7. Importación en MetaMask
- [x] Token ALO agregado a MetaMask
- [x] Balance visible: 100,000,000 ALO
- [x] Visible en PC y móvil

### 8. Branding y Logo
- [x] Logo diseñado con Gemini AI
- [x] Estilo: Moneda dorada con "A" estilizada y "ALO"
- [x] Versión PNG (alta resolución)
- [x] Versión SVG 32x32 para BSCScan
- [x] Subido a GitHub: https://raw.githubusercontent.com/alonsoalpizar/Dropio/master/alocoins_32x32.svg
- [x] Subido a Imgur: https://i.imgur.com/BNtAbdF.png

### 9. Solicitud de Token Info en BSCScan
- [x] Verificación de ownership completada
- [x] Formulario de Token Update enviado
- [x] Logo, descripción, y website incluidos
- [x] Estado: Pendiente de aprobación (3-7 días)

**Información enviada:**
```
Project Name:     Dropio
Website:          https://dropio.club
Description:      AloCoins (ALO) is the official digital currency of Dropio.club. 
                  Users can collect, transfer, and redeem ALO for exclusive drops, 
                  rewards, and premium benefits. Fixed supply of 100M tokens.
Country:          Costa Rica
```

---

## 🔐 INFORMACIÓN DE SEGURIDAD

### Datos Críticos (NUNCA COMPARTIR)
```
⚠️ FRASE SEMILLA: [12 palabras guardadas en papel]
⚠️ PRIVATE KEY: [Guardada en MetaMask]
```

### Datos Públicos (Se pueden compartir)
```
✅ Dirección wallet: 0x9b92a238298cbac6cc8873960cb21b5ebc28cb7b
✅ Dirección contrato: 0xd2af4Df0c65022a4B3c58188e648AcEf1Bb1F155
```

### Cuentas Creadas
| Servicio | Usuario | Propósito |
|----------|---------|-----------|
| MetaMask | AloAlpizar | Wallet principal |
| BSCScan | ALOALPIZAR | API y gestión de token |

---

## 💰 COSTOS INCURRIDOS

| Concepto | Monto |
|----------|-------|
| Bridge ETH → BNB (fee) | ~$0.63 |
| Deploy contrato (gas) | ~$2-3 |
| Verificación (gas) | ~$0.50 |
| **Total aproximado** | **~$4 USD** |

**Balance restante en wallet:**
- BNB: ~0.02 BNB (~$18 USD)
- ETH: ~0.006 ETH (~$16 USD)
- ALO: 100,000,000 ALO

---

## 📁 ARCHIVOS GENERADOS

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| AloCoins.sol | Remix IDE | Código fuente del contrato |
| alocoins_32x32.svg | GitHub | Logo para BSCScan |
| Logo PNG | Imgur | Logo alta resolución |

---

## 🔗 LINKS DE REFERENCIA

### Herramientas Utilizadas
- **Remix IDE:** https://remix.ethereum.org
- **MetaMask:** https://metamask.io
- **BSCScan:** https://bscscan.com
- **ChainList:** https://chainlist.org

### Documentación
- **OpenZeppelin Contracts:** https://docs.openzeppelin.com/contracts
- **BNB Smart Chain:** https://docs.bnbchain.org

---

## ⏳ PENDIENTES

### Corto Plazo (1-7 días)
- [ ] Esperar aprobación de logo en BSCScan
- [ ] Verificar que el logo aparezca correctamente
- [ ] Recibir email de confirmación de BSCScan

### Mediano Plazo (1-4 semanas)
- [ ] Integrar AloCoins con dropio.club
- [ ] Definir bridge PostgreSQL ↔ Blockchain
- [ ] Configurar 2Checkout para venta de AloCoins
- [ ] Crear cuenta Payoneer
- [ ] Finalizar landing page de Dropio

### Largo Plazo (1-3 meses)
- [ ] Primer Drop de prueba
- [ ] Implementar sistema de niveles
- [ ] Implementar Shop Básico (coins bloqueados)
- [ ] Evaluar listado en CoinGecko/CoinMarketCap
- [ ] Considerar pool de liquidez en DEX

---

## 📊 MODELO DE INTEGRACIÓN DEFINIDO

### Fase 1: Híbrido (MVP)
```
┌─────────────────────────────────────────┐
│  DROPIO.CLUB                            │
│  ─────────────────                      │
│  - Balance en PostgreSQL (interno)      │
│  - Token existe en blockchain (respaldo)│
│  - Usuario no necesita saber de crypto  │
│  - Precio fijo 1 ALO = ₡1               │
└─────────────────────────────────────────┘
```

### Fase 2: Bridge (Futuro)
```
┌─────────────────────────────────────────┐
│  DROPIO.CLUB + BLOCKCHAIN               │
│  ─────────────────────────              │
│  - Usuario puede retirar ALO a wallet   │
│  - Bridge: PostgreSQL ↔ BSC             │
│  - Crypto-savvy usan MetaMask           │
│  - Usuarios normales usan web           │
└─────────────────────────────────────────┘
```

### Modelo de Coins
```
COMPRA → Usuario recibe ALO (disponibles)
USO    → ALO se bloquean (burn disfrazado)
         - Sirven para nivel
         - Sirven para Shop Básico
         - Posible reactivación en eventos
```

---

## 🎯 CONCEPTO CLAVE RECORDAR

```
┌─────────────────────────────────────────┐
│                                         │
│  LO QUE VENDEMOS:    AloCoins (activo)  │
│  LO QUE REGALAMOS:   Entradas a Drops   │
│                                         │
│  El Drop es PROMOCIÓN, no PRODUCTO.     │
│  El producto es el ALOCOIN.             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📝 NOTAS ADICIONALES

1. **Frase semilla:** Guardada en papel en lugar seguro. NUNCA digitalizarla ni compartirla.

2. **El token es REAL:** Existe en blockchain, cualquiera puede verificarlo en BSCScan.

3. **Supply fijo:** No se pueden crear más de 100M ALO. El contrato no tiene función mint.

4. **Función burn:** Cuando se usan ALO en Drops/Shop, se pueden quemar para crear deflación.

5. **Función pause:** En caso de emergencia (hack, bug), se pueden pausar todas las transferencias.

6. **Ownership:** Actualmente el owner es la wallet de Alo. Se puede transferir o renunciar si se desea.

---

## 🏆 LOGRO DEL DÍA

```
╔═══════════════════════════════════════════╗
║                                           ║
║   🪙 ALOCOINS CREADO EXITOSAMENTE 🪙      ║
║                                           ║
║   100,000,000 ALO                         ║
║   Token real en blockchain                ║
║   Verificado y público                    ║
║   Listo para Dropio.club                  ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

*Documento generado el 1 de Diciembre de 2025*  
*Dropio.club - Tu moneda. Tus reglas.*

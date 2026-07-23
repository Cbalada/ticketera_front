**Documentación de Rutas — Frontend (Next.js App Router)**

Este documento replica el formato de `API_DOCUMENTATION.md` pero lista las rutas públicas del frontend (Next.js app-router) y notas sobre parámetros y grupos.

**Rutas (resumen)**
- **Home:** `/`
- **Perfil:** `/profile` — página de usuario autenticado.
- **Login:** `/login` — página de inicio de sesión (dentro del grupo `(auth)`).
- **Register:** `/register` — registro de usuarios (dentro del grupo `(auth)`).
- **Eventos (lista/detalle):**
  
  - `/events/[id]/sectors` — listado de sectores para el evento `id`.
- **Checkout:**
  - `/checkout` — resumen/confirmación de compra.
  - `/checkout/payment` — flujo de pago. El boton `VOLVER` hacia `/events/[id]/sectors` cancela las reservas activas con `DELETE /reservations/:id` antes de navegar, liberando tickets inmediatamente.
  - `/checkout/timeout` — pantalla de tiempo expirado / timeout.
- **Admin:**
  - `/admin` — panel de administración.
  - `/admin/events` — administración/listado de eventos.

**Notas sobre convenciones**
- Los grupos de rutas entre paréntesis de Next.js (por ejemplo `(auth)`) NO aparecen en la URL pública; se usan para organizar layouts y segmentar la app.
- Rutas con corchetes `[...]` son parámetros dinámicos. En este proyecto:
  - `[id]` representa el `eventId` en las rutas de eventos.
- Para generar links desde el frontend, usar utilidades de Next/React: `Link` de `next/link` o funciones de navegación del router.

**Ejemplos de uso (snippets)**
- Link a un evento desde la lista:

```tsx
import Link from 'next/link'

// dentro de un componente
<Link href={`/events/${event.id}`}>{event.title}</Link>
```

- Navegar programáticamente al checkout:

```tsx
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/checkout')
```

**Mapa completo (árbol de archivos relevante)**
- `src/app/page.tsx` → `/`
- `src/app/profile/page.tsx` → `/profile`
- `src/app/(auth)/login/page.tsx` → `/login`
- `src/app/(auth)/register/page.tsx` → `/register`
- `src/app/events/[id]/page.tsx` → `/events/[id]`
- `src/app/events/[id]/sectors/page.tsx` → `/events/[id]/sectors`
- `src/app/checkout/page.tsx` → `/checkout`
- `src/app/checkout/payment/page.tsx` → `/checkout/payment`
- `src/app/checkout/timeout/page.tsx` → `/checkout/timeout`
- `src/app/admin/page.tsx` → `/admin`
- `src/app/admin/events/page.tsx` → `/admin/events`

---

Si quieres, puedo:
- exportar este listado como `routes.json` o `routes.csv`.
- añadir permisos/roles requeridos por ruta (ej: `ADMIN` para `/admin`).

Archivo creado: [API_DOCUMENTATION_FRONT.md](API_DOCUMENTATION_FRONT.md)

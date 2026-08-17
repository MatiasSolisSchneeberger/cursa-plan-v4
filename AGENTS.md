<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - Guía de Contexto para Agentes de IA

## 1. Visión General del Proyecto
- **Descripción:** El proyecto es una pagina web para ayudar a los alumnos a encontrar la información de las materias mas rápido y fácil. Lo mas importante son las correlativas y las fechas de exámenes.
- **Arquitectura:** MVC.

## 2. Tech Stack
- **Lenguaje:** TypeScript / Node.js 20+
- **Framework Principal:** Next.js (App Router)
- **Base de Datos:** PostgreSQL / Supabase
- **Testing:** -
- **Estilos / UI:** Tailwind CSS / Shadcn

## 3. Comandos Principales
> Ejecutá siempre estos comandos para verificar tus cambios antes de dar una tarea por terminada.

- **Desarrollo local:** `npm run dev`
- **Ejecutar tests:** -
- **Test unitario individual:** -
- **Linter & Formato:** `npm run lint` / `npm run format`
- **Build:** `npm run build`

## 4. Reglas de Código y Estándares (CRÍTICO)

### Naming & Estilo
- Usar `camelCase` para variables y funciones, archivos de logica no visuales.
- Usar `PascalCase` para clases, interfaces, componentes y archivos de ui.


### Principios de Arquitectura
- **Inyección de dependencias:** Siempre inyectar interfaces, no implementaciones concretas.
- **Manejo de errores:** Lanzar excepciones de dominio personalizadas (`DomainException`), nunca devolver respuestas HTTP directas desde la capa de servicio.
- **Inmutabilidad:** Preferir `const` y estructuras inmutables.

### Lo que NO debés hacer (Líneas Rojas)
- ❌ NO agregar librerías externas sin consulta previa.
- ❌ NO ignorar tipos en TypeScript (`any` está estrictamente prohibido).
- ❌ NO modificar esquemas de base de datos directamente; usar migraciones.
- ❌ NO dejar comentarios de código muerto o `console.log` en commit.
- ❌ NO subir nada a git, solamente dejar el texto del nombre y la descripcion del commit.

### Convenciones de JavaScript / TypeScript

- **Desestructuración obligatoria en callbacks de Arrays (`.map`, `.filter`, etc.):** 
  En lugar de recibir un objeto genérico o abstracto (ej. `item`, `user`, `data`), desestructurá siempre las propiedades que se van a utilizar directamente en los argumentos del callback.

    ❌ **MAL:**
    ```typescript
    const names = users.map((user) => user.name);
    const cards = products.map((product) => (
        <Card key="{product.id}" price="{product.price}" title="{product.title}"/>
    ));
    ```

    ✓ BIEN:

    ```typescript
    const names = users.map(({ name }) => name);
    const cards = products.map(({ id, title, price }) => (
        <Card key="{id}" price="{price}" title="{title}"/>
    ));
    ```

## 5. Estructura de Carpetas
root/
├── app/
│   ├── (main)/
│   ├── [carreraSlug]/
│   │   └── [plan]/
│   │       └── [materia]/
│   ├── admin/
│   ├── auth/
│   └── perfil/
├── components/
│   └── ui/
├── hooks/
├── lib/
├── public/
├── section/
│   ├── admin/
│   ├── carreras/
│   ├── materia/
│   ├── perfil/
│   └── plan/
├── types/
└── utils/
    └── supabase/
/**
 * Módulo de Definición de Permisos y Validación de Roles por Ruta (RBAC)
 */

export type AdminRole =
	| "super_admin"
	| "admin"
	| "gestor_carreras"
	| "moderador"
	| "auditor"
	| "soporte"
	| "user"
	| string

/**
 * Roles con privilegios administrativos en el sistema.
 */
export const AdminRoleGroup = [
	"super_admin",
	"admin",
	"gestor_carreras",
	"moderador",
	"auditor",
	"soporte",
]

/**
 * Verifica si un rol dado es un rol de administración.
 *
 * @param role - Nombre del rol a evaluar
 * @returns true si el rol posee acceso administrativo
 */
export function isAdminRole(role?: string | null): boolean {
	if (!role) return false
	const normalized = role.toLowerCase().trim()
	if (normalized === "user" || normalized === "estudiante") return false
	return (
		normalized.includes("admin") ||
		normalized.includes("gestor") ||
		normalized.includes("moderador") ||
		normalized.includes("auditor") ||
		normalized.includes("soporte")
	)
}

/**
 * Mapa de permisos requeridos por subpágina del módulo /admin
 */
const ROUTE_PERMISSIONS: Record<string, string[]> = {
	"/admin": ["super_admin", "admin", "gestor_carreras", "moderador", "auditor", "soporte"],
	"/admin/roles": ["super_admin", "admin", "auditor"],
	"/admin/permisos": ["super_admin", "admin", "gestor_carreras", "auditor"],
	"/admin/usuarios": ["super_admin", "admin", "moderador", "soporte"],
	"/admin/auditoria": ["super_admin", "admin", "auditor"],
	"/admin/configuracion": ["super_admin", "admin"],
}

/**
 * Determina si un rol específico tiene permisos para acceder a una ruta determinada.
 *
 * @param role - Rol del usuario (ej: "super_admin", "moderador", "user")
 * @param pathname - Ruta o página a consultar (ej: "/admin/roles")
 * @returns true si el rol tiene acceso a la página, false en caso contrario
 */
export function canRoleAccessRoute(role: string | null | undefined, pathname: string): boolean {
	if (!role || !isAdminRole(role)) {
		return false
	}

	const normalizedRole = role.toLowerCase().trim()

	// Super Admin y Admin genérico tienen acceso total a cualquier subpágina
	if (normalizedRole === "super_admin" || normalizedRole === "admin") {
		return true
	}

	// Buscar coincidencia directa de ruta o prefijo
	const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find(
		(r) => pathname === r || pathname.startsWith(`${r}/`)
	)

	if (!matchingRoute) {
		// Si la ruta está dentro de /admin pero no en el mapa explícito, permitir a cualquier rol admin por defecto
		return pathname.startsWith("/admin") ? isAdminRole(role) : true
	}

	const allowedRoles = ROUTE_PERMISSIONS[matchingRoute]
	return allowedRoles.some((allowed) => normalizedRole.includes(allowed))
}

/**
 * Verifica si un rol posee un permiso específico (ej: 'carreras:crear')
 */
export function hasPermission(role: string | null | undefined, permissionKey: string): boolean {
	if (!role || !isAdminRole(role)) return false
	const normalizedRole = role.toLowerCase().trim()
	if (normalizedRole === "super_admin" || normalizedRole === "admin") return true

	const PERMISSION_ROLE_MAP: Record<string, string[]> = {
		"carreras:crear": ["gestor_carreras"],
		"carreras:editar": ["gestor_carreras", "moderador"],
		"carreras:publicar": ["gestor_carreras"],
		"carreras:eliminar": [],
		"usuarios:listar": ["gestor_carreras", "moderador", "auditor", "soporte"],
		"usuarios:editar_rol": [],
		"usuarios:suspender": ["moderador", "soporte"],
		"audit:ver_logs": ["auditor"],
		"audit:exportar": ["auditor"],
		"politicas:modificar": [],
	}

	const allowedRoles = PERMISSION_ROLE_MAP[permissionKey] || []
	return allowedRoles.some((r) => normalizedRole.includes(r))
}

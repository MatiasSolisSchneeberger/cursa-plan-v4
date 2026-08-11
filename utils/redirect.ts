export const DEFAULT_REDIRECT = "/"

export const AUTH_ROUTES = [
	"/login",
	"/register",
	"/forgot-password",
	"/update-password",
] as const

/**
 * Sanitiza el parámetro `next` para evitar open redirects.
 * Devuelve una ruta interna segura o DEFAULT_REDIRECT.
 */
export function sanitizeNext(next?: string | null): string {
	// Si no hay valor, devolver default
	if (!next || typeof next !== "string") {
		return DEFAULT_REDIRECT
	}

	const trimmed = next.trim()

	// Rechazar cadenas vacías
	if (!trimmed) {
		return DEFAULT_REDIRECT
	}

	// Rechazar URLs absolutas (contienen :// )
	if (trimmed.includes("://")) {
		return DEFAULT_REDIRECT
	}

	// Rechazar open redirects protocol-relative (//)
	if (trimmed.startsWith("//")) {
		return DEFAULT_REDIRECT
	}

	// Rechazar rutas que no empiezan con /
	if (!trimmed.startsWith("/")) {
		return DEFAULT_REDIRECT
	}

	// Rechazar rutas de autenticación (evita loops como /login?next=/login)
	if (AUTH_ROUTES.some((route) => trimmed === route)) {
		return DEFAULT_REDIRECT
	}

	return trimmed
}

/**
 * Construye una URL de login con el parámetro `next` si es válido.
 * Valida y encodeá el destino.
 */
export function buildLoginUrl(path: string): string {
	const sanitized = sanitizeNext(path)

	// Si la ruta sanitizada es el default, no agregar ?next=
	if (sanitized === DEFAULT_REDIRECT) {
		return "/login"
	}

	return `/login?next=${encodeURIComponent(sanitized)}`
}

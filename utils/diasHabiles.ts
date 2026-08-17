/** Días hábiles de anticipación requeridos para inscribirse a una mesa. */
export const DIAS_HABILES_INSCRIPCION = 3

/** Umbral (en días hábiles) para mostrar el aviso de "inscripción próxima a cerrar". */
export const DIAS_HABILES_AVISO = 3

/** Zona horaria de referencia. Los alumnos y la facultad están en Corrientes/Chaco. */
export const ZONA_HORARIA = "America/Argentina/Buenos_Aires"

/**
 * Convierte un string "YYYY-MM-DD" a un objeto Date local (00:00hs)
 * para evitar problemas de zonas horarias (UTC vs Local).
 */
export function parseFechaLocal(dateStr: string): Date {
	const [y, m, d] = dateStr.split("-").map(Number)
	return new Date(y, m - 1, d)
}

/**
 * Convierte un Date a string "YYYY-MM-DD" en zona local.
 * No depende de ICU; usa getFullYear/getMonth/getDate directamente.
 */
export function claveFecha(fecha: Date): string {
	const y = fecha.getFullYear()
	const m = String(fecha.getMonth() + 1).padStart(2, "0")
	const d = String(fecha.getDate()).padStart(2, "0")
	return `${y}-${m}-${d}`
}

/**
 * Retorna "hoy" a las 00:00 en la zona horaria ZONA_HORARIA.
 * Resuelve el bug donde new Date() en el servidor (UTC) adelanta el cierre.
 */
export function getHoyLocal(): Date {
	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: ZONA_HORARIA,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	})
	const fechaStr = formatter.format(new Date())
	return parseFechaLocal(fechaStr)
}

/**
 * Verifica si un día es "hábil" (No es finde ni feriado).
 */
export function esDiaHabil(fecha: Date, feriados: ReadonlySet<string>): boolean {
	const diaSemana = fecha.getDay()

	if (diaSemana === 0 || diaSemana === 6) return false

	const clave = claveFecha(fecha)
	if (feriados.has(clave)) return false

	return true
}

/**
 * Retrocede día a día desde fechaInicial (sin contarla) hasta acumular
 * cantidad días hábiles; devuelve esa fecha.
 * Tope de seguridad a 60 días para evitar loops infinitos.
 */
export function restarDiasHabiles(
	fechaInicial: Date,
	cantidad: number,
	feriados: ReadonlySet<string>,
): Date {
	let cursor = new Date(fechaInicial)
	cursor.setDate(cursor.getDate() - 1)

	let diasEncontrados = 0
	let iteraciones = 0
	const MAX_ITERACIONES = 60

	while (diasEncontrados < cantidad && iteraciones < MAX_ITERACIONES) {
		if (esDiaHabil(cursor, feriados)) {
			diasEncontrados++
		}
		if (diasEncontrados < cantidad) {
			cursor.setDate(cursor.getDate() - 1)
		}
		iteraciones++
	}

	return cursor
}

/**
 * Cuenta días hábiles en el intervalo cerrado [desde, hasta].
 * Si hasta < desde devuelve 0.
 */
export function contarDiasHabiles(
	desde: Date,
	hasta: Date,
	feriados: ReadonlySet<string>,
): number {
	if (hasta < desde) return 0

	let count = 0
	const cursor = new Date(desde)
	const target = new Date(hasta)

	while (cursor <= target) {
		if (esDiaHabil(cursor, feriados)) {
			count++
		}
		cursor.setDate(cursor.getDate() + 1)
	}

	return count
}

/**
 * Calcula la diferencia en días corridos entre dos fechas.
 * Preserva el orden de argumentos del original (hasta, desde).
 */
export function calcularDiasCalendario(hasta: Date, desde: Date): number {
	const d1 = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate())
	const d2 = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate())
	const diffTime = d2.getTime() - d1.getTime()
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Estados de inscripción a una mesa de examen.
 */
export type EstadoInscripcion = "pasada" | "cerrada" | "por-cerrar" | "abierta"

/**
 * Resultado del cálculo de estado de inscripción.
 */
export interface ResultadoInscripcion {
	/** Estado de la inscripción. */
	estado: EstadoInscripcion
	/** Último día hábil en el que todavía se puede realizar la inscripción. */
	fechaLimite: Date
	/** Días hábiles que quedan, contando hoy, hasta la fecha límite inclusive. 0 si ya cerró. */
	diasHabilesRestantes: number
}

/**
 * Determina el estado de inscripción a una mesa en función de:
 * - La fecha del examen
 * - Hoy
 * - Los feriados vigentes
 *
 * Toda la lógica de negocio vive acá; la UI solo interpreta el resultado.
 */
export function getEstadoInscripcion(
	fechaExamen: Date,
	hoy: Date,
	feriados: ReadonlySet<string>,
): ResultadoInscripcion {
	const fechaLimite = restarDiasHabiles(fechaExamen, DIAS_HABILES_INSCRIPCION, feriados)

	if (fechaExamen < hoy) {
		return {
			estado: "pasada",
			fechaLimite,
			diasHabilesRestantes: 0,
		}
	}

	if (hoy > fechaLimite) {
		return {
			estado: "cerrada",
			fechaLimite,
			diasHabilesRestantes: 0,
		}
	}

	const diasHabilesRestantes = contarDiasHabiles(hoy, fechaLimite, feriados)

	const estado: EstadoInscripcion = diasHabilesRestantes <= DIAS_HABILES_AVISO ? "por-cerrar" : "abierta"

	return {
		estado,
		fechaLimite,
		diasHabilesRestantes,
	}
}

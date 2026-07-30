import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js"

export interface ProcessErrorDetail {
	lineNumber?: number
	subjectName?: string
	career?: string
	turno?: number
	message: string
}

export interface ResultadoProcesamiento {
	success: boolean
	csvOutput: string
	recordsCount: number
	errors: ProcessErrorDetail[]
}

interface MateriaPlanDbRow {
	materia_id: number
	materia: { id: number; nombre: string; slug: string } | null
	plan: {
		carreras: { id: number; nombre: string; slug: string } | null
	} | null
}

interface TurnoDbRow {
	id: number
	fecha_inicio: string
	fecha_fin: string
	tipo_mesa?: { id: number; nombre: string; slug: string } | null
}

/**
 * Normaliza cadenas quitando acentos, caracteres especiales y espacios adicionales.
 */
function normalizeString(str: string): string {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
}

/**
 * Parsea el contenido completo de un archivo CSV respetando comillas y delimitadores.
 */
export function parseCsvLines(csvContent: string): {
	headers: string[]
	rows: { lineNumber: number; values: string[] }[]
} {
	const lines = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")
	const nonEmptyLines: { lineNumber: number; text: string }[] = []

	lines.forEach((text, index) => {
		if (text.trim().length > 0) {
			nonEmptyLines.push({ lineNumber: index + 1, text })
		}
	})

	if (nonEmptyLines.length === 0) {
		return { headers: [], rows: [] }
	}

	const headerLine = nonEmptyLines[0].text
	const commaCount = (headerLine.match(/,/g) || []).length
	const semicolonCount = (headerLine.match(/;/g) || []).length
	const delimiter = semicolonCount > commaCount ? ";" : ","

	const splitLine = (line: string): string[] => {
		const result: string[] = []
		let current = ""
		let inQuotes = false

		for (let i = 0; i < line.length; i++) {
			const char = line[i]
			if (char === '"') {
				inQuotes = !inQuotes
			} else if (char === delimiter && !inQuotes) {
				result.push(current.trim().replace(/^"|"$/g, ""))
				current = ""
			} else {
				current += char
			}
		}
		result.push(current.trim().replace(/^"|"$/g, ""))
		return result
	}

	const headers = splitLine(headerLine)
	const rows = nonEmptyLines.slice(1).map(({ lineNumber, text }) => ({
		lineNumber,
		values: splitLine(text),
	}))

	return { headers, rows }
}

/**
 * Parsea y normaliza una fecha a formato ISO YYYY-MM-DD.
 */
export function parseAndNormalizeDate(val: string): string | null {
	const trimmed = val.trim()
	if (!trimmed || trimmed === "-" || trimmed.toLowerCase() === "n/a") return null

	// Formato DD/MM/YYYY o DD-MM-YYYY
	const ddmmyyyy = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/.exec(trimmed)
	if (ddmmyyyy) {
		const day = ddmmyyyy[1].padStart(2, "0")
		const month = ddmmyyyy[2].padStart(2, "0")
		const year = ddmmyyyy[3]
		const dateObj = new Date(`${year}-${month}-${day}T00:00:00Z`)
		if (isNaN(dateObj.getTime())) return null
		return `${year}-${month}-${day}`
	}

	// Formato YYYY-MM-DD o YYYY/MM/DD
	const yyyymmdd = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/.exec(trimmed)
	if (yyyymmdd) {
		const year = yyyymmdd[1]
		const month = yyyymmdd[2].padStart(2, "0")
		const day = yyyymmdd[3].padStart(2, "0")
		const dateObj = new Date(`${year}-${month}-${day}T00:00:00Z`)
		if (isNaN(dateObj.getTime())) return null
		return `${year}-${month}-${day}`
	}

	return null
}

/**
 * Instancia un cliente de Supabase para lectura únicamente.
 */
function getReadSupabaseClient(customClient?: SupabaseClient): SupabaseClient {
	if (customClient) return customClient

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

	if (!supabaseUrl || !supabaseKey) {
		throw new Error("No se configuraron las variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).")
	}

	return createSupabaseClient(supabaseUrl, supabaseKey)
}

/**
 * Función principal para procesar el CSV de fechas de exámenes.
 */
export async function procesarFechasExamenes(
	csvContent: string,
	customSupabase?: SupabaseClient,
	startId: number = 1461
): Promise<ResultadoProcesamiento> {
	let currentId = startId
	const errors: ProcessErrorDetail[] = []
	let supabase: SupabaseClient

	try {
		supabase = getReadSupabaseClient(customSupabase)
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err)
		return {
			success: false,
			csvOutput: "",
			recordsCount: 0,
			errors: [{ message: `Error de conexión a la base de datos: ${message}` }],
		}
	}

	// 1. Obtener rangos de turnos de exámenes (mesas 6 a 10) desde Supabase
	const { data: turnosData, error: turnosError } = await supabase
		.from("turnos_examenes")
		.select("id, fecha_inicio, fecha_fin, tipo_mesa:tipos_mesa (id, nombre, slug)")

	if (turnosError) {
		return {
			success: false,
			csvOutput: "",
			recordsCount: 0,
			errors: [{ message: `Error de conexión a la base de datos al consultar turnos_examenes: ${turnosError.message}` }],
		}
	}

	const turnosMap = new Map<number, { fecha_inicio: string; fecha_fin: string }>()
	const rawTurnos = (turnosData || []) as unknown as TurnoDbRow[]

	rawTurnos.forEach(({ id, fecha_inicio, fecha_fin, tipo_mesa }) => {
		const candidates = [id, tipo_mesa?.id].filter(Boolean) as number[]
		candidates.forEach((tId) => {
			if (tId >= 6 && tId <= 10) {
				turnosMap.set(tId, { fecha_inicio, fecha_fin })
			}
		})

		if (tipo_mesa) {
			const match = /(?:mesa|turno|n°|nro)?\s*([6-9]|10)/i.exec(tipo_mesa.slug || tipo_mesa.nombre || "")
			if (match) {
				const num = parseInt(match[1], 10)
				if (num >= 6 && num <= 10 && !turnosMap.has(num)) {
					turnosMap.set(num, { fecha_inicio, fecha_fin })
				}
			}
		}
	})

	// 2. Obtener materias y mapeos con carreras desde Supabase
	const [materiaPlanRes, materiasRes] = await Promise.all([
		supabase
			.from("materia_plan")
			.select(`
				materia_id,
				materia:materias!inner ( id, nombre, slug ),
				plan:plan_estudio!inner (
					carreras:carrera_id!inner ( id, nombre, slug )
				)
			`),
		supabase
			.from("materias")
			.select("id, nombre, slug"),
	])

	if (materiaPlanRes.error) {
		return {
			success: false,
			csvOutput: "",
			recordsCount: 0,
			errors: [{ message: `Error de conexión a la base de datos al consultar materia_plan: ${materiaPlanRes.error.message}` }],
		}
	}

	// Mapeo por materia y carrera especifica -> Set<materia_id>
	const materiaCarreraMap = new Map<string, Set<number>>()
	// Mapeo general por nombre de materia (cuando no se especifica carrera) -> Set<materia_id>
	const materiaNombreMap = new Map<string, Set<number>>()

	const rawMateriaPlans = (materiaPlanRes.data || []) as unknown as MateriaPlanDbRow[]

	rawMateriaPlans.forEach(({ materia_id, materia, plan }) => {
		if (!materia || !plan?.carreras) return

		const matNombreNorm = normalizeString(materia.nombre)
		const matSlugNorm = normalizeString(materia.slug)
		const carNombreNorm = normalizeString(plan.carreras.nombre)
		const carSlugNorm = normalizeString(plan.carreras.slug)

		const addToMap = (map: Map<string, Set<number>>, key: string, id: number) => {
			if (!map.has(key)) map.set(key, new Set())
			map.get(key)!.add(id)
		}

		// Combinaciones por carrera
		addToMap(materiaCarreraMap, `${matNombreNorm}::${carSlugNorm}`, materia_id)
		addToMap(materiaCarreraMap, `${matNombreNorm}::${carNombreNorm}`, materia_id)
		addToMap(materiaCarreraMap, `${matSlugNorm}::${carSlugNorm}`, materia_id)
		addToMap(materiaCarreraMap, `${matSlugNorm}::${carNombreNorm}`, materia_id)

		// Mapeo general por nombre
		addToMap(materiaNombreMap, matNombreNorm, materia_id)
		addToMap(materiaNombreMap, matSlugNorm, materia_id)
	})

	// Agregar materias directo de la tabla materias como respaldo general
	if (materiasRes.data) {
		const rawMaterias = materiasRes.data as unknown as { id: number; nombre: string; slug: string }[]
		rawMaterias.forEach(({ id, nombre, slug }) => {
			const matNombreNorm = normalizeString(nombre)
			const matSlugNorm = normalizeString(slug)

			if (!materiaNombreMap.has(matNombreNorm)) materiaNombreMap.set(matNombreNorm, new Set())
			materiaNombreMap.get(matNombreNorm)!.add(id)

			if (!materiaNombreMap.has(matSlugNorm)) materiaNombreMap.set(matSlugNorm, new Set())
			materiaNombreMap.get(matSlugNorm)!.add(id)
		})
	}

	// 3. Parsear y procesar las filas del CSV
	const { headers, rows } = parseCsvLines(csvContent)

	if (headers.length === 0 || rows.length === 0) {
		return {
			success: false,
			csvOutput: "",
			recordsCount: 0,
			errors: [{ message: "El archivo CSV ingresado está vacío o no tiene un formato válido." }],
		}
	}

	let asignaturaColIdx = headers.findIndex((h) => /asignatura|materia/i.test(h))
	if (asignaturaColIdx === -1) asignaturaColIdx = 0

	let carrerasColIdx = headers.findIndex((h) => /carrera/i.test(h))
	if (carrerasColIdx === -1) carrerasColIdx = 1

	const turnoColIndices = new Map<number, number>()
	;[6, 7, 8, 9, 10].forEach((num) => {
		const foundIdx = headers.findIndex((h) => {
			const normH = normalizeString(h)
			return normH === String(num) || normH.includes(`turno ${num}`) || normH.includes(`mesa ${num}`) || normH.includes(`${num}°`)
		})

		if (foundIdx !== -1) {
			turnoColIndices.set(num, foundIdx)
		} else {
			const fallbackIdx = num - 1
			if (fallbackIdx < headers.length) {
				turnoColIndices.set(num, fallbackIdx)
			}
		}
	})

	const outputRows: string[] = []

	// 4. Validar fila por fila
	rows.forEach(({ lineNumber, values }) => {
		const rawAsignatura = values[asignaturaColIdx] || ""
		const rawCarreras = values[carrerasColIdx] || ""

		if (!rawAsignatura.trim()) return

		const nombreMateriaNorm = normalizeString(rawAsignatura)
		const carrerasList = rawCarreras
			.split(/[,;\/]/)
			.map((c) => c.trim())
			.filter((c) => c.length > 0)

		const matchedMateriaIds: number[] = []

		// Si NO se especificó carrera en el CSV, aplica a la materia independientemente de la carrera (todos los materia_id de ese nombre)
		if (carrerasList.length === 0) {
			const idsSet = materiaNombreMap.get(nombreMateriaNorm)
			if (!idsSet || idsSet.size === 0) {
				errors.push({
					lineNumber,
					subjectName: rawAsignatura,
					message: `Línea ${lineNumber}: No se encontró la materia "${rawAsignatura}" en la base de datos.`,
				})
			} else {
				idsSet.forEach((id) => {
					if (!matchedMateriaIds.includes(id)) {
						matchedMateriaIds.push(id)
					}
				})
			}
		} else {
			// Si SE especificó carrera, se diferencia la materia específica según la carrera declarada
			carrerasList.forEach((carreraItem) => {
				const carreraNorm = normalizeString(carreraItem)
				const key = `${nombreMateriaNorm}::${carreraNorm}`
				const idsSet = materiaCarreraMap.get(key)

				if (!idsSet || idsSet.size === 0) {
					errors.push({
						lineNumber,
						subjectName: rawAsignatura,
						career: carreraItem,
						message: `Línea ${lineNumber}: No se encontró la materia "${rawAsignatura}" en la base de datos para la carrera "${carreraItem}".`,
					})
				} else {
					idsSet.forEach((id) => {
						if (!matchedMateriaIds.includes(id)) {
							matchedMateriaIds.push(id)
						}
					})
				}
			})
		}

		if (matchedMateriaIds.length === 0) return

		;[6, 7, 8, 9, 10].forEach((turnoNum) => {
			const colIdx = turnoColIndices.get(turnoNum)
			if (colIdx === undefined || colIdx >= values.length) return

			const rawDate = values[colIdx] || ""
			if (!rawDate.trim() || rawDate.trim() === "-" || rawDate.trim().toLowerCase() === "n/a") return

			const normalizedDate = parseAndNormalizeDate(rawDate)

			if (!normalizedDate) {
				errors.push({
					lineNumber,
					subjectName: rawAsignatura,
					turno: turnoNum,
					message: `Línea ${lineNumber}: La fecha "${rawDate}" para la materia "${rawAsignatura}" (Turno ${turnoNum}) tiene un formato inválido.`,
				})
				return
			}

			let fueraDeSemana = false
			const turnoRange = turnosMap.get(turnoNum)
			if (turnoRange) {
				const { fecha_inicio, fecha_fin } = turnoRange
				if (normalizedDate < fecha_inicio || normalizedDate > fecha_fin) {
					fueraDeSemana = true
				}
			}

			const flagFueraSemana = fueraDeSemana ? "_" : ""

			matchedMateriaIds.forEach((materiaId) => {
				// Formato: _fuera_semana,id,materia_id,fecha
				outputRows.push(`${flagFueraSemana},${currentId},${materiaId},${normalizedDate}`)
				currentId++
			})
		})
	})

	if (errors.length > 0) {
		return {
			success: false,
			csvOutput: "",
			recordsCount: 0,
			errors,
		}
	}

	const csvOutput = ["_fuera_semana,id,materia_id,fecha", ...outputRows].join("\n")

	return {
		success: true,
		csvOutput,
		recordsCount: outputRows.length,
		errors: [],
	}
}

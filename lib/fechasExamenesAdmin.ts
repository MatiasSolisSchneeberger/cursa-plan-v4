import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

export interface CarreraBadge {
	id: number
	nombre: string
	slug: string
}

export interface TurnoInfo {
	numero: number // 1 al 10
	id: number
	nombre: string
	fechaInicio: string
	fechaFin: string
}

export interface ResolucionItem {
	id: number
	nombre: string
	fecha: string
	url?: string | null
}

export interface FechaExamenItem {
	id?: number
	fecha: string
	resolucionId?: number | null
	resolucionNombre?: string | null
}

export interface MateriaPlanillaRow {
	materiaId: number
	materiaNombre: string
	materiaSlug: string
	carreras: CarreraBadge[]
	fechasByTurno: Record<number, FechaExamenItem | null>
}

export interface DatosPlanillaFechas {
	turnos: TurnoInfo[]
	rows: MateriaPlanillaRow[]
	resoluciones: ResolucionItem[]
}

interface PlanEstudioDbRow {
	carrera: CarreraBadge | CarreraBadge[] | null
}

interface MateriaPlanDbRow {
	materia_id: number
	plan: PlanEstudioDbRow | PlanEstudioDbRow[] | null
}

interface TipoMesaDbRow {
	id: number
	nombre: string
	slug: string
}

interface TurnoExamenDbRow {
	id: number
	fecha_inicio: string
	fecha_fin: string
	tipo_mesa_id: number | null
	tipo_mesa: TipoMesaDbRow | TipoMesaDbRow[] | null
}

interface FechaExamenDbRow {
	id: number
	materia_id: number
	fecha: string
	resolucion_id?: number | null
	resolucion?: ResolucionItem | ResolucionItem[] | null
}

interface MateriaDbRow {
	id: number
	nombre: string
	slug: string
}

/**
 * Obtiene todas las materias, sus carreras asociadas, fechas de exámenes y catálogo de resoluciones (con URL).
 */
export async function getFechasExamenesPlanilla(customSupabase?: SupabaseClient): Promise<DatosPlanillaFechas> {
	let supabase: SupabaseClient
	if (customSupabase) {
		supabase = customSupabase
	} else {
		const cookieStore = await cookies()
		supabase = createClient(cookieStore) as unknown as SupabaseClient
	}

	// 1. Obtener todas las materias ordenadas por nombre
	const { data: materiasData, error: materiasError } = await supabase
		.from("materias")
		.select("id, nombre, slug")
		.order("nombre", { ascending: true })

	if (materiasError) {
		console.error("Error al obtener materias:", materiasError)
		throw new Error(`Error al obtener materias: ${materiasError.message}`)
	}

	// 2. Obtener mapeo de materias con carreras vía materia_plan -> plan_estudio -> carreras
	const { data: materiaPlanData, error: mpError } = await supabase
		.from("materia_plan")
		.select(`
			materia_id,
			plan:plan_estudio (
				carrera:carreras ( id, nombre, slug )
			)
		`)
		.range(0, 5000)

	if (mpError) {
		console.error("Error al obtener relación materia-carrera:", mpError)
	}

	// Agrupar carreras por materia_id
	const carrerasByMateria = new Map<number, Map<number, CarreraBadge>>()
	if (materiaPlanData) {
		const rawMpRows = materiaPlanData as unknown as MateriaPlanDbRow[]
		rawMpRows.forEach((item) => {
			const mId = item.materia_id
			const planObj = Array.isArray(item.plan) ? item.plan[0] : item.plan
			const carrera = Array.isArray(planObj?.carrera) ? planObj.carrera[0] : planObj?.carrera
			if (mId && carrera && carrera.id) {
				if (!carrerasByMateria.has(mId)) {
					carrerasByMateria.set(mId, new Map())
				}
				carrerasByMateria.get(mId)!.set(carrera.id, {
					id: carrera.id,
					nombre: carrera.nombre,
					slug: carrera.slug,
				})
			}
		})
	}

	// 3. Obtener turnos de exámenes (1° a 10°)
	const { data: turnosData, error: turnosError } = await supabase
		.from("turnos_examenes")
		.select("id, fecha_inicio, fecha_fin, tipo_mesa_id, tipo_mesa:tipos_mesa(id, nombre, slug)")
		.order("id", { ascending: true })

	if (turnosError) {
		console.error("Error al obtener turnos_examenes:", turnosError)
	}

	// Normalizar 10 turnos
	const turnos: TurnoInfo[] = []
	const rawTurnos = (turnosData || []) as unknown as TurnoExamenDbRow[]

	for (let i = 1; i <= 10; i++) {
		const found = rawTurnos.find((t) => {
			const tm = Array.isArray(t.tipo_mesa) ? t.tipo_mesa[0] : t.tipo_mesa
			if (t.id === i || t.tipo_mesa_id === i || tm?.id === i) return true
			const nombreTurno = tm?.nombre || ""
			const slugTurno = tm?.slug || ""
			const match = /(?:mesa|turno|n°|nro)?\s*(\d+)/i.exec(slugTurno || nombreTurno)
			return match ? parseInt(match[1], 10) === i : false
		})

		const foundTm = found ? (Array.isArray(found.tipo_mesa) ? found.tipo_mesa[0] : found.tipo_mesa) : null

		turnos.push({
			numero: i,
			id: found?.id || i,
			nombre: foundTm?.nombre || `${i}° Turno`,
			fechaInicio: found?.fecha_inicio || "",
			fechaFin: found?.fecha_fin || "",
		})
	}

	// 4. Obtener catálogo de resoluciones incluyendo URL
	const { data: resolucionesData, error: resError } = await supabase
		.from("resoluciones")
		.select("id, nombre, fecha, url")
		.order("fecha", { ascending: false })

	if (resError) {
		console.error("Error al obtener resoluciones:", resError)
	}

	const resoluciones: ResolucionItem[] = (resolucionesData || []) as unknown as ResolucionItem[]

	// 5. Obtener TODAS las fechas de exámenes registradas paginando de a 1000 filas
	const rawFechas: FechaExamenDbRow[] = []
	let from = 0
	const pageSize = 1000
	let hasMore = true

	while (hasMore) {
		const { data: pageData, error: pageError } = await supabase
			.from("fechas_examenes")
			.select("id, materia_id, fecha, resolucion_id, resolucion:resoluciones(id, nombre, fecha, url)")
			.range(from, from + pageSize - 1)

		if (pageError) {
			console.error("Error al obtener lote de fechas_examenes:", pageError)
			break
		}

		if (pageData && pageData.length > 0) {
			rawFechas.push(...(pageData as unknown as FechaExamenDbRow[]))
			if (pageData.length < pageSize) {
				hasMore = false
			} else {
				from += pageSize
			}
		} else {
			hasMore = false
		}
	}

	const rawMaterias = (materiasData || []) as unknown as MateriaDbRow[]

	// 6. Mapear materias a filas de la planilla
	const rows: MateriaPlanillaRow[] = rawMaterias.map((m) => {
		const mId = Number(m.id)
		const carrerasMap = carrerasByMateria.get(mId)
		const carrerasList = carrerasMap ? Array.from(carrerasMap.values()) : []

		// Obtener todas las fechas registradas para esta materia ordenadas por fecha
		const materiaFechas = rawFechas
			.filter((f) => Number(f.materia_id) === mId)
			.sort((a, b) => a.fecha.localeCompare(b.fecha))

		const fechasByTurno: Record<number, FechaExamenItem | null> = {}
		for (let i = 1; i <= 10; i++) {
			fechasByTurno[i] = null
		}

		const assignedFechaIds = new Set<number>()

		// Función auxiliar para extraer datos de resolución
		const parseResolucion = (f: FechaExamenDbRow) => {
			const resObj = Array.isArray(f.resolucion) ? f.resolucion[0] : f.resolucion
			return {
				resolucionId: f.resolucion_id || resObj?.id || null,
				resolucionNombre: resObj?.nombre || null,
			}
		}

		// Paso 1: Coincidencia estricta por rango de fecha del turno
		materiaFechas.forEach((f) => {
			const matchingTurno = turnos.find(
				(t) => t.fechaInicio && t.fechaFin && f.fecha >= t.fechaInicio && f.fecha <= t.fechaFin
			)
			if (matchingTurno && !fechasByTurno[matchingTurno.numero]) {
				const { resolucionId, resolucionNombre } = parseResolucion(f)
				fechasByTurno[matchingTurno.numero] = {
					id: f.id,
					fecha: f.fecha,
					resolucionId,
					resolucionNombre,
				}
				assignedFechaIds.add(f.id)
			}
		})

		// Paso 2: Para fechas que no cayeron exactamente dentro del rango de ningún turno (ej. mesas 6-10 sin rango estricto)
		const unassignedFechas = materiaFechas.filter((f) => !assignedFechaIds.has(f.id))

		if (unassignedFechas.length > 0) {
			unassignedFechas.forEach((f) => {
				let closestTurnoNumero: number | null = null
				let minDiffMs = Infinity

				turnos.forEach((t) => {
					if (!fechasByTurno[t.numero]) {
						if (t.fechaInicio) {
							const diff = Math.abs(new Date(f.fecha).getTime() - new Date(t.fechaInicio).getTime())
							if (diff < minDiffMs) {
								minDiffMs = diff
								closestTurnoNumero = t.numero
							}
						}
					}
				})

				const { resolucionId, resolucionNombre } = parseResolucion(f)

				if (closestTurnoNumero !== null) {
					fechasByTurno[closestTurnoNumero] = {
						id: f.id,
						fecha: f.fecha,
						resolucionId,
						resolucionNombre,
					}
				} else {
					const firstAvailable = turnos.find((t) => !fechasByTurno[t.numero])
					if (firstAvailable) {
						fechasByTurno[firstAvailable.numero] = {
							id: f.id,
							fecha: f.fecha,
							resolucionId,
							resolucionNombre,
						}
					}
				}
			})
		}

		return {
			materiaId: mId,
			materiaNombre: m.nombre,
			materiaSlug: m.slug,
			carreras: carrerasList,
			fechasByTurno,
		}
	})

	return {
		turnos,
		rows,
		resoluciones,
	}
}

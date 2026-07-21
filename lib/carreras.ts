import {createClient} from "@/utils/supabase/server"
import {cookies} from "next/headers"
import {formatearCorrelativas} from "@/utils/transformData"
import type { AnioJSON, PeriodoJSON } from "@/types/carrera"
import type {
	Carrera,
	CarreraWithPlanes,
	PlanCurricularData,
	CalendarioCompletoData,
	DashboardUserData,
	SeguimientoPlanData,
	DBTurnoExamen,
	DBInscripcion,
	DBFeriado,
	DBCalendarioClase,
	AnioSeguimientoJSON
} from "@/types/queries"
import type {EstadoMateria} from "@/types/materiaTypes"

/**
 * Retorna la lista de carreras con sus planes básicos para la página /carreras.
 *
 * @returns Array de carreras con sus planes
 */
export async function getPageCarrerasData(): Promise<Carrera[]> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const {data, error} = await supabase
		.from("carreras")
		.select(`
			id,
			nombre,
			slug,
			icon,
			planes:plan_estudio(
				id,
				anio_inicio,
				anio_fin,
				materia_plan(
					id
				)
			)
		`)
		.order("nombre", {ascending: true})

	if (error) {
		console.error("Error fetching careers:", error)
		throw new Error(error.message)
	}

	return (data || []).map((c: any) => ({
		id: Number(c.id),
		nombre: c.nombre,
		slug: c.slug,
		icon: c.icon,
		planes: (c.planes || []).map((p: any) => ({
			id: Number(p.id),
			anio_inicio: Number(p.anio_inicio),
			anio_fin: p.anio_fin ? Number(p.anio_fin) : null,
			materia_plan: p.materia_plan || []
		}))
	})) as Carrera[]
}

/**
 * Retorna los datos de una carrera haciendo JOIN con sus planes de estudio.
 *
 * @param carreraSlug - Slug de la carrera a consultar
 * @returns Datos de la carrera y sus planes
 */
export async function getPageCarreraDetalleData(carreraSlug: string): Promise<CarreraWithPlanes> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const {data, error} = await supabase
		.from("carreras")
		.select(`
			id,
			nombre,
			slug,
			icon,
			planes:plan_estudio(
				id,
				anio_inicio,
				anio_fin
			)
		`)
		.eq("slug", carreraSlug)
		.single()

	if (error) {
		console.error(`Error fetching career detail for ${carreraSlug}:`, error)
		throw new Error(error.message)
	}

	return {
		id: Number(data.id),
		nombre: data.nombre,
		slug: data.slug,
		icon: data.icon,
		planes: (data.planes || []).map((p: any) => ({
			id: Number(p.id),
			anio_inicio: Number(p.anio_inicio),
			anio_fin: p.anio_fin ? Number(p.anio_fin) : null
		}))
	}
}

/**
 * Retorna un plan de estudio y su malla curricular (materias, periodos, orientaciones y correlativas).
 *
 * @param planId - ID del plan de estudio
 * @returns Malla curricular del plan
 */
export async function getPagePlanData(
	planIdOrYear: number | string,
	carreraSlug?: string
): Promise<PlanCurricularData> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	let query = supabase
		.from("plan_estudio")
		.select(`
			id,
			anio_inicio,
			anio_fin,
			carreras:carrera_id!inner (
				id,
				nombre,
				slug,
				icon
			),
			materias_plan:materia_plan (
				id,
				anio,
				nro_periodo,
				nro_optativa,
				periodo:tipos_periodo ( id, slug, nombre ),
				orientacion:tipos_orientaciones ( id, nombre, slug ),
				materia:materias ( id, nombre, slug ),
				correlativas:correlativas!materia_id (
					tipo_requisito,
					condicion,
					porcentaje,
					notas,
					requisito_plan:materia_plan!requisito (
						id,
						materia:materias ( nombre, slug )
					)
				)
			)
		`)

	const val = Number(planIdOrYear)
	if (!isNaN(val)) {
		if (val > 1900) {
			query = query.eq("anio_inicio", val)
		} else {
			query = query.eq("id", val)
		}
	} else {
		query = query.eq("id", planIdOrYear)
	}

	if (carreraSlug) {
		query = query.eq("carreras.slug", carreraSlug)
	}

	const {data, error} = await query.single()

	if (error) {
		console.error(`Error fetching plan ${planIdOrYear} (slug: ${carreraSlug}):`, error)
		throw new Error(error.message)
	}

	const aniosMap = new Map()
	const orientacionesSet = new Map()

	const materiasPlan = data.materias_plan || []

	materiasPlan.forEach((item: any) => {
		// A. Orientaciones
		if (item.orientacion) {
			if (!orientacionesSet.has(item.orientacion.id)) {
				orientacionesSet.set(item.orientacion.id, {
					nombre: item.orientacion.nombre,
					slug: item.orientacion.slug,
					id: Number(item.orientacion.id),
				})
			}
		}

		// B. Años
		const anioKey = Number(item.anio)
		if (!aniosMap.has(anioKey)) {
			aniosMap.set(anioKey, { anio: anioKey, periodosMap: new Map() })
		}
		const anioObj = aniosMap.get(anioKey)

		// C. Periodos
		const periodoId = item.periodo?.id || 0
		const periodoKey = `${item.nro_periodo}-${periodoId}`

		if (!anioObj.periodosMap.has(periodoKey)) {
			anioObj.periodosMap.set(periodoKey, {
				id: Number(item.nro_periodo),
				nroPeriodo: Number(item.nro_periodo),
				tipoPeriodo: item.periodo
					? {
							id: Number(item.periodo.id),
							slug: item.periodo.slug,
							nombre: item.periodo.nombre,
						}
					: {
							id: 0,
							slug: "no-definido",
							nombre: "No definido",
						},
				materias: [],
			})
		}

		const periodoActual = anioObj.periodosMap.get(periodoKey)

		// Evitar duplicados
		const materiaYaExiste = periodoActual.materias.some((m: any) => m.idMateriaPlan === item.id)

		if (!materiaYaExiste && item.materia) {
			periodoActual.materias.push({
				id: Number(item.materia.id),
				idMateriaPlan: Number(item.id),
				nombre: item.materia.nombre,
				slug: item.materia.slug,
				esOptativa: !!item.nro_optativa,
				nroOptativa: item.nro_optativa ? Number(item.nro_optativa) : null,
				orientacion: item.orientacion
					? {
							nombre: item.orientacion.nombre,
							slug: item.orientacion.slug,
						}
					: null,
				correlativas: formatearCorrelativas(item.correlativas || []),
			})
		}
	})

	const rawData = data as any

	const anios: AnioJSON[] = Array.from(aniosMap.values())
		.sort((a: any, b: any) => a.anio - b.anio)
		.map((a: any) => ({
			anio: a.anio,
			periodos: Array.from(a.periodosMap.values())
				.sort((p1: any, p2: any) => p1.nroPeriodo - p2.nroPeriodo) as PeriodoJSON[],
		}))

	return {
		id: Number(rawData.id),
		anioInicio: Number(rawData.anio_inicio),
		anioFin: rawData.anio_fin ? Number(rawData.anio_fin) : null,
		carrera: {
			id: Number(rawData.carreras?.id),
			nombre: rawData.carreras?.nombre,
			slug: rawData.carreras?.slug,
			icon: rawData.carreras?.icon,
		},
		listaOrientaciones: Array.from(orientacionesSet.values()),
		anios: anios,
	}
}

/**
 * Retorna datos del calendario académico agrupados por exámenes, inscripciones, feriados y clases.
 *
 * @param fechaInicio - Fecha de inicio del intervalo
 * @param fechaFin - Fecha de fin del intervalo
 * @returns Datos completos del calendario
 */
export async function getPageCalendarioData(
	fechaInicio: Date | string,
	fechaFin: Date | string
): Promise<CalendarioCompletoData> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const startStr = typeof fechaInicio === "string" ? fechaInicio : fechaInicio.toISOString().split("T")[0]
	const endStr = typeof fechaFin === "string" ? fechaFin : fechaFin.toISOString().split("T")[0]

	const [examenesRes, inscripcionesRes, feriadosRes, clasesRes] = await Promise.all([
		supabase
			.from("turnos_examenes")
			.select("id, fecha_inicio, fecha_fin, is_suspencion, nota, tipo_mesa_id:tipos_mesa (id, nombre, slug)")
			.gte("fecha_fin", startStr)
			.lte("fecha_inicio", endStr),
		supabase
			.from("inscripciones")
			.select("id, nro_periodo, fecha_inicio, fecha_fin, periodo:tipos_periodo (id, nombre, slug)")
			.gte("fecha_fin", startStr)
			.lte("fecha_inicio", endStr),
		supabase
			.from("feriados")
			.select("id, fecha, nombre, slug, nota, tipo:tipos_feriado (id, nombre, slug)")
			.gte("fecha", startStr)
			.lte("fecha", endStr),
		supabase
			.from("calendario_clases")
			.select("id, nro_periodo, fecha_inicio, fecha_fin, nota, periodo:tipos_periodo (id, nombre, slug)")
			.gte("fecha_fin", startStr)
			.lte("fecha_inicio", endStr)
	])

	if (examenesRes.error) throw examenesRes.error
	if (inscripcionesRes.error) throw inscripcionesRes.error
	if (feriadosRes.error) throw feriadosRes.error
	if (clasesRes.error) throw clasesRes.error

	return {
		turnosExamenes: (examenesRes.data || []) as unknown as DBTurnoExamen[],
		inscripciones: (inscripcionesRes.data || []) as unknown as DBInscripcion[],
		feriados: (feriadosRes.data || []) as unknown as DBFeriado[],
		calendarioClases: (clasesRes.data || []) as unknown as DBCalendarioClase[]
	}
}

/**
 * Retorna datos de un usuario y sus planes guardados como favoritos.
 *
 * @param userId - ID del usuario
 * @returns Perfil de usuario y favoritos
 */
export async function getPageDashboardData(userId: string): Promise<DashboardUserData> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const [userRes, favsRes] = await Promise.all([
		supabase
			.from("usuarios")
			.select("id, username, full_name, avatar_url, role, icon")
			.eq("id", userId)
			.maybeSingle(),
		supabase
			.from("carreras_fav")
			.select(`
				id,
				plan_id,
				plan:plan_estudio (
					id,
					anio_inicio,
					anio_fin,
					carrera:carreras (
						id,
						nombre,
						slug,
						icon
					)
				)
			`)
			.eq("user_id", userId)
	])

	if (userRes.error) throw userRes.error
	if (favsRes.error) throw favsRes.error

	const userRaw = userRes.data
	const user = userRaw
		? {
				id: userRaw.id,
				username: userRaw.username,
				fullName: userRaw.full_name,
				avatarUrl: userRaw.avatar_url,
				role: userRaw.role,
				icon: userRaw.icon,
			}
		: {
				id: userId,
				username: null,
				fullName: null,
				avatarUrl: null,
				role: "user",
				icon: null,
			}

	const carrerasFav = (favsRes.data || [])
		.filter((f: any) => f.plan && f.plan.carrera)
		.map((f: any) => ({
			id: Number(f.id),
			planId: Number(f.plan_id),
			anioInicio: Number(f.plan.anio_inicio),
			anioFin: f.plan.anio_fin ? Number(f.plan.anio_fin) : null,
			carrera: {
				id: Number(f.plan.carrera.id),
				nombre: f.plan.carrera.nombre,
				slug: f.plan.carrera.slug,
				icon: f.plan.carrera.icon,
			},
		}))

	return {
		user,
		carrerasFav,
	}
}

/**
 * Retorna la malla curricular de un plan de estudio inyectando los estados de avance del usuario.
 *
 * @param userId - ID del usuario
 * @param planId - ID del plan de estudio
 * @returns Malla curricular con avances del usuario
 */
export async function getPageMiCarreraData(
	userId: string,
	planId: number | string
): Promise<SeguimientoPlanData> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const [planData, advancesRes] = await Promise.all([
		getPagePlanData(planId),
		supabase
			.from("avances")
			.select("materia_plan_id, estado")
			.eq("user_id", userId)
	])

	if (advancesRes.error) {
		console.error("Error fetching user advances:", advancesRes.error)
		throw advancesRes.error
	}

	const advancesMap = new Map<number, EstadoMateria>()
	advancesRes.data?.forEach((adv) => {
		advancesMap.set(adv.materia_plan_id, adv.estado as EstadoMateria)
	})

	const anios: AnioSeguimientoJSON[] = planData.anios.map((anio) => ({
		anio: anio.anio,
		periodos: anio.periodos.map((periodo) => ({
			id: periodo.id,
			nroPeriodo: periodo.nroPeriodo,
			tipoPeriodo: periodo.tipoPeriodo,
			materias: periodo.materias.map((materia) => ({
				...materia,
				estadoMateria: advancesMap.get(materia.idMateriaPlan) || "Sin cursar",
			})),
		})),
	}))

	return {
		id: planData.id,
		anioInicio: planData.anioInicio,
		anioFin: planData.anioFin,
		carrera: planData.carrera,
		listaOrientaciones: planData.listaOrientaciones,
		anios: anios,
	}
}

// ==========================================
// Wrappers para compatibilidad
// ==========================================

export async function getCarreras(): Promise<Carrera[]> {
	return getPageCarrerasData()
}

export async function getCarrerasConPlanes(): Promise<Carrera[]> {
	return getPageCarrerasData()
}

export async function getCarreraBySlug(slug: string): Promise<CarreraWithPlanes> {
	return getPageCarreraDetalleData(slug)
}
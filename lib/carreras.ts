import {createClient} from "@/utils/supabase/server"
import {cookies} from "next/headers"
import {formatearCorrelativas} from "@/utils/transformData"
import type {GrupoCorrelativa, MateriaJSON} from "@/types/carrera"
import type {EstadoMateria} from "@/types/materiaTypes"
import {cacheLife} from "next/cache"
import {cache} from "react"
import {createClient as createSupabaseClient} from "@supabase/supabase-js"
import type {
	Carrera,
	CarreraConPlanes,
	DatosPlanCurricular,
	DatosCalendarioCompleto,
	DatosDashboardUsuario,
	DatosSeguimientoPlan,
	DatosMateriaDetalle,
	ResultadosBusquedaGeneral,
	PerfilUsuario,
	TurnoExamenBD,
	InscripcionBD,
	FeriadoBD,
	CalendarioClaseBD,
	AnioSeguimientoJSON,
	PlanCarreraFavorito,
	OrientacionBasica,
	ResultadoBusquedaCarrera,
	ResultadoBusquedaMateria,
	AnioJSON,
	PeriodoJSON,
	GrupoOrientacion,
	GrupoOrientacionSeguimiento,
	MateriaSeguimientoJSON,
	MateriaCursando,
	CarreraFavoritaConAvance,
	ResumenPerfilDashboard,
	CarreraPerfilDashboardData,
	MateriaPlanSearchItem,
	CarreraFilterOption,
	SearchDataResponse,
} from "@/types/consultas"

// Client estático de Supabase para consultas públicas cacheables.
// No accede a cookies() ni headers, evitando errores de dynamic data en "use cache".
const staticSupabase = createSupabaseClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// --- INTERFACES INTERNAS PARA CONSULTAS DE BASE DE DATOS ---

interface CorrelativaDBRow {
	tipo_requisito: string
	condicion: string
	porcentaje: number
	notas: string | null
	requisito_plan: {
		id: number
		materia: {nombre: string; slug: string} | null
	} | null
}

interface MateriaPlanQueryRow {
	id: number
	anio: number
	nro_periodo: number
	nro_optativa: number | null
	periodo: {id: number; slug: string; nombre: string} | null
	orientacion: {id: number; nombre: string; slug: string} | null
	materia: {id: number; nombre: string; slug: string} | null
	correlativas: CorrelativaDBRow[]
}

interface PlanEstudioQueryResponse {
	id: number
	anio_inicio: number
	anio_fin: number | null
	carreras: {
		id: number
		nombre: string
		slug: string
		icon: string
	} | null
	materias_plan: MateriaPlanQueryRow[]
}

interface UsuarioQueryRow {
	id: string
	username: string | null
	full_name: string | null
	avatar_url: string | null
	role: string
	icon: string | null
}

interface CarreraFavQueryRow {
	id: number
	plan_id: number
	plan: {
		id: number
		anio_inicio: number
		anio_fin: number | null
		carrera: {
			id: number
			nombre: string
			slug: string
			icon: string
		} | null
	} | null
}

interface AvanceQueryRow {
	materia_plan_id: number
	estado: string
}

interface MateriaDetalleQueryRow {
	id: number
	anio: number
	nro_periodo: number
	nro_optativa: number | null
	periodo: {id: number; slug: string; nombre: string} | null
	orientacion: {id: number; nombre: string; slug: string} | null
	materia: {id: number; nombre: string; slug: string} | null
	plan: {
		id: number
		anio_inicio: number
		carreras: {
			nombre: string
			slug: string
		} | null
	} | null
	correlativas: CorrelativaDBRow[]
}

interface CarreraSearchRow {
	id: number
	nombre: string
	slug: string
	icon: string
}

interface MateriaPlanSearchRow {
	id: number
	materia: {
		id: number
		nombre: string
		slug: string
	} | null
	plan: {
		anio_inicio: number
		carreras: {
			nombre: string
			slug: string
		} | null
	} | null
}

// --- HELPER PARA PROCESAR CORRELATIVAS ---

import type {CorrelativaRaw} from "@/utils/transformData"

function procesarCorrelativas(correlativasRaw: CorrelativaDBRow[]): GrupoCorrelativa[] {
	const formateadas: CorrelativaRaw[] = (correlativasRaw || []).map((corr) => ({
		tipo_requisito: corr.tipo_requisito,
		condicion: corr.condicion,
		porcentaje: corr.porcentaje || undefined,
		notas: corr.notas || undefined,
		requisito_plan:
			corr.requisito_plan ?
				{
					id: Number(corr.requisito_plan.id),
					materia:
						corr.requisito_plan.materia ?
							{
								nombre: corr.requisito_plan.materia.nombre,
								slug: corr.requisito_plan.materia.slug,
							}
						:	{nombre: "", slug: ""},
				}
			:	undefined,
	}))

	return formatearCorrelativas(formateadas) as unknown as GrupoCorrelativa[]
}

// --- HELPERS PARA AGRUPAR MATERIAS POR ORIENTACIÓN ---

function agruparMateriasPorOrientacion(materias: MateriaJSON[]): GrupoOrientacion[] {
	const gruposMap = new Map<string, GrupoOrientacion>()

	gruposMap.set("comun", {
		orientacion: null,
		materias: [],
	})

	materias.forEach((materia) => {
		if (materia.orientacion && materia.orientacion.id !== undefined) {
			const oId = materia.orientacion.id
			const key = `orientacion-${oId}`

			if (!gruposMap.has(key)) {
				gruposMap.set(key, {
					orientacion: {
						id: oId,
						nombre: materia.orientacion.nombre,
						slug: materia.orientacion.slug,
					},
					materias: [],
				})
			}

			gruposMap.get(key)!.materias.push(materia)
		} else {
			gruposMap.get("comun")!.materias.push(materia)
		}
	})

	return Array.from(gruposMap.values())
		.filter((g) => g.materias.length > 0)
		.sort((a, b) => {
			if (a.orientacion === null) return -1
			if (b.orientacion === null) return 1
			return a.orientacion.nombre.localeCompare(b.orientacion.nombre)
		})
}

function agruparMateriasSeguimientoPorOrientacion(materias: MateriaSeguimientoJSON[]): GrupoOrientacionSeguimiento[] {
	const gruposMap = new Map<string, GrupoOrientacionSeguimiento>()

	gruposMap.set("comun", {
		orientacion: null,
		materias: [],
	})

	materias.forEach((materia) => {
		if (materia.orientacion && materia.orientacion.id !== undefined) {
			const oId = materia.orientacion.id
			const key = `orientacion-${oId}`

			if (!gruposMap.has(key)) {
				gruposMap.set(key, {
					orientacion: {
						id: oId,
						nombre: materia.orientacion.nombre,
						slug: materia.orientacion.slug,
					},
					materias: [],
				})
			}

			gruposMap.get(key)!.materias.push(materia)
		} else {
			gruposMap.get("comun")!.materias.push(materia)
		}
	})

	return Array.from(gruposMap.values())
		.filter((g) => g.materias.length > 0)
		.sort((a, b) => {
			if (a.orientacion === null) return -1
			if (b.orientacion === null) return 1
			return a.orientacion.nombre.localeCompare(b.orientacion.nombre)
		})
}

// --- FUNCIONES DE CONSULTA PÚBLICAS (CON "USE CACHE") ---

/**
 * Obtiene la lista de carreras con sus planes básicos para la grilla de /carreras.
 *
 * @returns Array de carreras con sus planes correspondientes
 */
export async function getCarreras(): Promise<Carrera[]> {
	"use cache"
	cacheLife("hours")

	const {data, error} = await staticSupabase
		.from("carreras")
		.select(
			`
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
		`,
		)
		.order("nombre", {ascending: true})

	if (error) {
		console.error("Error al obtener carreras:", error)
		throw new Error(error.message)
	}

	return (data || []).map((c) => ({
		id: Number(c.id),
		nombre: c.nombre as string,
		slug: c.slug as string,
		icon: c.icon as string,
		planes: (
			(c.planes as unknown as {
				id: number | string
				anio_inicio: number | string
				anio_fin: number | string | null
				materia_plan: {id: number}[]
			}[]) || []
		).map((p) => ({
			id: Number(p.id),
			anio_inicio: Number(p.anio_inicio),
			anio_fin: p.anio_fin ? Number(p.anio_fin) : null,
			materia_plan: p.materia_plan || [],
		})),
	})) as Carrera[]
}

/**
 * Obtiene los detalles de una carrera haciendo JOIN con sus planes de estudio.
 *
 * @param carreraSlug - Slug de la carrera a consultar
 * @returns Datos de la carrera y sus planes
 */
export async function getCarreraDetalle(carreraSlug: string): Promise<CarreraConPlanes> {
	"use cache"
	cacheLife("hours")

	const {data, error} = await staticSupabase
		.from("carreras")
		.select(
			`
			id,
			nombre,
			slug,
			icon,
			planes:plan_estudio(
				id,
				anio_inicio,
				anio_fin
			)
		`,
		)
		.eq("slug", carreraSlug)
		.single()

	if (error) {
		console.error(`Error al obtener detalles de la carrera ${carreraSlug}:`, error)
		throw new Error(error.message)
	}

	return {
		id: Number(data.id),
		nombre: data.nombre as string,
		slug: data.slug as string,
		icon: data.icon as string,
		planes: (
			(data.planes as unknown as {
				id: number | string
				anio_inicio: number | string
				anio_fin: number | string | null
			}[]) || []
		).map((p) => ({
			id: Number(p.id),
			anio_inicio: Number(p.anio_inicio),
			anio_fin: p.anio_fin ? Number(p.anio_fin) : null,
		})),
	}
}

/**
 * Obtiene un plan de estudio y su malla curricular (materias, periodos, orientaciones y correlativas).
 *
 * @param planIdOrYear - ID o año de inicio del plan de estudio
 * @param carreraSlug - (Opcional) Slug de la carrera para filtrar de manera unívoca
 * @returns Estructura completa de la malla curricular
 */
export async function getPlanEstudio(
	planIdOrYear: number | string,
	carreraSlug?: string,
): Promise<DatosPlanCurricular> {
	"use cache"
	cacheLife("hours")

	let query = staticSupabase.from("plan_estudio").select(`
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
		console.error(`Error al obtener plan de estudio ${planIdOrYear} (carreraSlug: ${carreraSlug}):`, error)
		throw new Error(error.message)
	}

	const typedData = data as unknown as PlanEstudioQueryResponse

	const aniosMap = new Map<number, {anio: number; periodosMap: Map<string, PeriodoJSON>}>()
	const orientacionesSet = new Map<number, OrientacionBasica>()

	const materiasPlan = typedData.materias_plan || []

	materiasPlan.forEach((item) => {
		// A. Orientaciones
		if (item.orientacion) {
			const oId = Number(item.orientacion.id)
			if (!orientacionesSet.has(oId)) {
				orientacionesSet.set(oId, {
					nombre: item.orientacion.nombre || "",
					slug: item.orientacion.slug || "",
					id: oId,
				})
			}
		}

		// B. Años
		const anioKey = Number(item.anio)
		if (!aniosMap.has(anioKey)) {
			aniosMap.set(anioKey, {anio: anioKey, periodosMap: new Map<string, PeriodoJSON>()})
		}
		const anioObj = aniosMap.get(anioKey)!

		// C. Periodos
		const periodoId = item.periodo?.id || 0
		const periodoKey = `${item.nro_periodo}-${periodoId}`

		if (!anioObj.periodosMap.has(periodoKey)) {
			anioObj.periodosMap.set(periodoKey, {
				id: Number(item.nro_periodo),
				nroPeriodo: Number(item.nro_periodo),
				tipoPeriodo:
					item.periodo ?
						{
							id: Number(item.periodo.id),
							slug: item.periodo.slug || "",
							nombre: item.periodo.nombre || "",
						}
					:	{
							id: 0,
							slug: "no-definido",
							nombre: "No definido",
						},
				materias: [],
				materiasPorOrientacion: [],
			})
		}

		const periodoActual = anioObj.periodosMap.get(periodoKey)!

		// Evitar duplicados
		const materiaYaExiste = periodoActual.materias.some((m) => m.idMateriaPlan === item.id)

		if (!materiaYaExiste && item.materia) {
			periodoActual.materias.push({
				id: Number(item.materia.id),
				idMateriaPlan: Number(item.id),
				nombre: item.materia.nombre,
				slug: item.materia.slug,
				esOptativa: !!item.nro_optativa,
				nroOptativa: item.nro_optativa ? Number(item.nro_optativa) : null,
				orientacion:
					item.orientacion ?
						{
							id: Number(item.orientacion.id),
							nombre: item.orientacion.nombre || "",
							slug: item.orientacion.slug || "",
						}
					:	null,
				correlativas: procesarCorrelativas(item.correlativas || []),
			})
		}
	})

	const anios: AnioJSON[] = Array.from(aniosMap.values())
		.sort(({anio: aAnio}, {anio: bAnio}) => aAnio - bAnio)
		.map(({anio, periodosMap}) => ({
			anio,
			periodos: Array.from(periodosMap.values())
				.sort(({nroPeriodo: p1}, {nroPeriodo: p2}) => p1 - p2)
				.map((periodoObj) => ({
					...periodoObj,
					materiasPorOrientacion: agruparMateriasPorOrientacion(periodoObj.materias),
				})) as PeriodoJSON[],
		}))

	return {
		id: Number(typedData.id),
		anioInicio: Number(typedData.anio_inicio),
		anioFin: typedData.anio_fin ? Number(typedData.anio_fin) : null,
		carrera: {
			id: Number(typedData.carreras?.id || 0),
			nombre: typedData.carreras?.nombre || "",
			slug: typedData.carreras?.slug || "",
			icon: typedData.carreras?.icon || "",
		},
		listaOrientaciones: Array.from(orientacionesSet.values()),
		anios: anios,
	}
}

// --- TIPOS Y FUNCIONES DE AYUDA PARA AGRUPACIÓN DE PLANES CURRICULARES ---

export interface MateriaConPeriodo extends MateriaJSON {
	periodoId: number
	periodoNombre: string
	nroPeriodo: number
}

export interface GroupedPeriodo {
	periodoId: number
	nombre: string
	nroPeriodo: number
	materias: MateriaConPeriodo[]
}

export interface GroupedOptativa {
	nro: number
	materias: MateriaConPeriodo[]
}

export interface GroupedOrientation {
	id: string
	nombre: string
	periodos: GroupedPeriodo[]
	optativas: GroupedOptativa[]
}

/**
 * Formatea el nombre del periodo con su correspondiente número ordinal.
 * Ejemplo: nroPeriodo=1, tipoNombre="Cuatrimestre" -> "1er Cuatrimestre"
 * Ejemplo: nroPeriodo=2, tipoNombre="Cuatrimestre" -> "2do Cuatrimestre"
 * Ejemplo: tipoSlug="anual" -> "Anual"
 */
export function formatearNombrePeriodo(nroPeriodo: number, tipoNombre: string, tipoSlug?: string): string {
	if (tipoSlug === "anual" || tipoNombre.toLowerCase() === "anual") {
		return tipoNombre
	}

	const ordinales: Record<number, string> = {
		1: "1er",
		2: "2do",
		3: "3er",
		4: "4to",
		5: "5to",
		6: "6to",
	}

	const prefix = ordinales[nroPeriodo] || `${nroPeriodo}º`
	return `${prefix} ${tipoNombre}`
}

/**
 * Aplana todas las materias de un año incluyendo la información del periodo formateado.
 */
export function flattenYearMaterias(periodos: PeriodoJSON[]): MateriaConPeriodo[] {
	return periodos.flatMap(({id: pId, tipoPeriodo: {nombre: tNombre, slug: tSlug}, nroPeriodo: nroP, materias}) =>
		materias.map((materia) => ({
			...materia,
			periodoId: pId,
			periodoNombre: formatearNombrePeriodo(nroP, tNombre, tSlug),
			nroPeriodo: nroP,
		})),
	)
}

/**
 * Agrupa las materias obligatorias por periodo.
 */
export function groupRequiredByPeriod(materias: MateriaConPeriodo[]): GroupedPeriodo[] {
	const req = materias.filter(({esOptativa}) => !esOptativa)
	const periodMap = new Map<number, GroupedPeriodo>()

	req.forEach((materia) => {
		const {periodoId, periodoNombre, nroPeriodo} = materia
		if (!periodMap.has(periodoId)) {
			periodMap.set(periodoId, {
				periodoId,
				nombre: periodoNombre,
				nroPeriodo,
				materias: [],
			})
		}
		periodMap.get(periodoId)!.materias.push(materia)
	})

	return Array.from(periodMap.values()).sort(({nroPeriodo: aNro}, {nroPeriodo: bNro}) => aNro - bNro)
}

/**
 * Agrupa las materias optativas por número de slot (nroOptativa).
 */
export function groupElectivesBySlot(materias: MateriaConPeriodo[]): GroupedOptativa[] {
	const opts = materias.filter(({esOptativa}) => esOptativa)
	const optMap = new Map<number, GroupedOptativa>()

	opts.forEach((materia) => {
		const {nroOptativa} = materia
		const nro = nroOptativa || 1
		if (!optMap.has(nro)) {
			optMap.set(nro, {
				nro,
				materias: [],
			})
		}
		optMap.get(nro)!.materias.push(materia)
	})

	return Array.from(optMap.values()).sort(({nro: aNro}, {nro: bNro}) => aNro - bNro)
}

/**
 * Determina si un conjunto de materias optativas consiste únicamente en una materia
 * cuyo nombre ya es genérico (ej. "Optativa II", "Optativa 1") para evitar envolverla en una carpeta redundante.
 */
export function esOptativaGenericaUnica(materias: MateriaConPeriodo[]): boolean {
	if (materias.length !== 1) return false
	const [{nombre}] = materias
	return nombre.toLowerCase().trim().startsWith("optativa")
}

/**
 * Agrupa las materias de un año que contiene orientaciones en Tronco Común y Orientaciones específicas.
 */
export function processYearWithOrientations(yearMaterias: MateriaConPeriodo[]): GroupedOrientation[] {
	const groups: GroupedOrientation[] = []

	// 1. Tronco Común
	const commonMaterias = yearMaterias.filter(({orientacion}) => orientacion === null)
	if (commonMaterias.length > 0) {
		groups.push({
			id: "comun",
			nombre: "Tronco Común",
			periodos: groupRequiredByPeriod(commonMaterias),
			optativas: groupElectivesBySlot(commonMaterias),
		})
	}

	// 2. Orientaciones específicas
	const orientationsMap = new Map<number, OrientacionBasica>()
	yearMaterias.forEach(({orientacion}) => {
		if (orientacion && orientacion.id !== undefined) {
			orientationsMap.set(orientacion.id, {
				id: orientacion.id,
				nombre: orientacion.nombre,
				slug: orientacion.slug,
			})
		}
	})
	const uniqueOrientations = Array.from(orientationsMap.values()).sort(({nombre: aNombre}, {nombre: bNombre}) =>
		aNombre.localeCompare(bNombre),
	)

	uniqueOrientations.forEach(({id: orientId, nombre: orientNombre}) => {
		const orientMaterias = yearMaterias.filter(({orientacion}) => orientacion?.id === orientId)
		groups.push({
			id: `orientacion-${orientId}`,
			nombre: orientNombre,
			periodos: groupRequiredByPeriod(orientMaterias),
			optativas: groupElectivesBySlot(orientMaterias),
		})
	})

	return groups
}

/**
 * Obtiene el rango de años que tienen eventos en el calendario académico.
 * @returns Array de años ordenados de menor a mayor
 */
export async function getAniosCalendario(): Promise<number[]> {
	"use cache"
	cacheLife("days")

	const [examenesMin, examenesMax, inscripcionesMin, inscripcionesMax, feriadosMin, feriadosMax, clasesMin, clasesMax] = await Promise.all([
		staticSupabase
			.from("turnos_examenes")
			.select("fecha_inicio")
			.order("fecha_inicio", { ascending: true })
			.limit(1),
		staticSupabase
			.from("turnos_examenes")
			.select("fecha_inicio")
			.order("fecha_inicio", { ascending: false })
			.limit(1),
		staticSupabase
			.from("inscripciones")
			.select("fecha_inicio")
			.order("fecha_inicio", { ascending: true })
			.limit(1),
		staticSupabase
			.from("inscripciones")
			.select("fecha_inicio")
			.order("fecha_inicio", { ascending: false })
			.limit(1),
		staticSupabase
			.from("feriados")
			.select("fecha")
			.order("fecha", { ascending: true })
			.limit(1),
		staticSupabase
			.from("feriados")
			.select("fecha")
			.order("fecha", { ascending: false })
			.limit(1),
		staticSupabase
			.from("calendario_clases")
			.select("fecha_inicio")
			.order("fecha_inicio", { ascending: true })
			.limit(1),
		staticSupabase
			.from("calendario_clases")
			.select("fecha_inicio")
			.order("fecha_inicio", { ascending: false })
			.limit(1),
	])

	const fechas: string[] = []
	if (examenesMin.data?.[0]?.fecha_inicio) fechas.push(examenesMin.data[0].fecha_inicio)
	if (examenesMax.data?.[0]?.fecha_inicio) fechas.push(examenesMax.data[0].fecha_inicio)
	if (inscripcionesMin.data?.[0]?.fecha_inicio) fechas.push(inscripcionesMin.data[0].fecha_inicio)
	if (inscripcionesMax.data?.[0]?.fecha_inicio) fechas.push(inscripcionesMax.data[0].fecha_inicio)
	if (feriadosMin.data?.[0]?.fecha) fechas.push(feriadosMin.data[0].fecha)
	if (feriadosMax.data?.[0]?.fecha) fechas.push(feriadosMax.data[0].fecha)
	if (clasesMin.data?.[0]?.fecha_inicio) fechas.push(clasesMin.data[0].fecha_inicio)
	if (clasesMax.data?.[0]?.fecha_inicio) fechas.push(clasesMax.data[0].fecha_inicio)

	const anios = fechas
		.map((f) => parseInt(f.split("-")[0], 10))
		.filter((a) => !isNaN(a))

	if (anios.length === 0) return []

	const desde = Math.min(...anios)
	const hasta = Math.max(...anios)
	return Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i)
}

/**
 * Obtiene los datos del calendario académico (exámenes, inscripciones, feriados y clases).
 * Las consultas se realizan en paralelo utilizando Promise.all para optimizar el rendimiento.
 *
 * @param fechaInicio - Fecha de inicio del filtro
 * @param fechaFin - Fecha de fin del filtro
 * @returns Listados de eventos académicos
 */
export async function getCalendario(
	fechaInicio: Date | string,
	fechaFin: Date | string,
): Promise<DatosCalendarioCompleto> {
	"use cache"
	cacheLife("hours")

	const startStr = typeof fechaInicio === "string" ? fechaInicio : fechaInicio.toISOString().split("T")[0]
	const endStr = typeof fechaFin === "string" ? fechaFin : fechaFin.toISOString().split("T")[0]

	const [examenesRes, inscripcionesRes, feriadosRes, clasesRes] = await Promise.all([
		staticSupabase
			.from("turnos_examenes")
			.select("id, fecha_inicio, fecha_fin, is_suspencion, nota, tipo_mesa_id:tipos_mesa (id, nombre, slug)")
			.gte("fecha_fin", startStr)
			.lte("fecha_inicio", endStr),
		staticSupabase
			.from("inscripciones")
			.select("id, nro_periodo, fecha_inicio, fecha_fin, periodo:tipos_periodo (id, nombre, slug)")
			.gte("fecha_fin", startStr)
			.lte("fecha_inicio", endStr),
		staticSupabase
			.from("feriados")
			.select("id, fecha, nombre, slug, nota, tipo:tipos_feriado (id, nombre, slug)")
			.gte("fecha", startStr)
			.lte("fecha", endStr),
		staticSupabase
			.from("calendario_clases")
			.select("id, nro_periodo, fecha_inicio, fecha_fin, nota, periodo:tipos_periodo (id, nombre, slug)")
			.gte("fecha_fin", startStr)
			.lte("fecha_inicio", endStr),
	])

	if (examenesRes.error) throw examenesRes.error
	if (inscripcionesRes.error) throw inscripcionesRes.error
	if (feriadosRes.error) throw feriadosRes.error
	if (clasesRes.error) throw clasesRes.error

	return {
		turnosExamenes: (examenesRes.data || []) as unknown as TurnoExamenBD[],
		inscripciones: (inscripcionesRes.data || []) as unknown as InscripcionBD[],
		feriados: (feriadosRes.data || []) as unknown as FeriadoBD[],
		calendarioClases: (clasesRes.data || []) as unknown as CalendarioClaseBD[],
	}
}

/**
 * Obtiene todas las fechas de feriados y días no laborables.
 * Se usan para el cálculo de días hábiles (cierre de inscripción a mesas).
 * @returns Array de fechas en formato "YYYY-MM-DD"
 */
export async function getFeriados(): Promise<string[]> {
	"use cache"
	cacheLife("days")

	const { data, error } = await staticSupabase.from("feriados").select("fecha")

	if (error) {
		console.error("Error al obtener feriados:", error)
		return []
	}

	return (data || []).map(({ fecha }) => fecha as string)
}

/**
 * Obtiene el detalle de una materia dentro de un plan específico, incluyendo sus correlativas estructuradas.
 *
 * @param carreraSlug - Slug de la carrera
 * @param planIdOrYear - ID o año de inicio del plan de estudio
 * @param materiaSlug - Slug de la materia
 * @returns Datos detallados de la materia
 */
export async function getMateriaDetalle(
	carreraSlug: string,
	planIdOrYear: number | string,
	materiaSlug: string,
): Promise<DatosMateriaDetalle> {
	"use cache"
	cacheLife("hours")

	let query = staticSupabase
		.from("materia_plan")
		.select(
			`
			id,
			anio,
			nro_periodo,
			nro_optativa,
			periodo:tipos_periodo ( id, slug, nombre ),
			orientacion:tipos_orientaciones ( id, nombre, slug ),
			materia:materias!inner ( id, nombre, slug ),
			plan:plan_estudio!inner (
				id,
				anio_inicio,
				carreras:carrera_id!inner (
					nombre,
					slug
				)
			),
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
		`,
		)
		.eq("materia.slug", materiaSlug)
		.eq("plan.carreras.slug", carreraSlug)

	const val = Number(planIdOrYear)
	if (!isNaN(val)) {
		if (val > 1900) {
			query = query.eq("plan.anio_inicio", val)
		} else {
			query = query.eq("plan.id", val)
		}
	} else {
		query = query.eq("plan.id", planIdOrYear)
	}

	const {data, error} = await query.maybeSingle()

	if (error) {
		console.error(`Error al obtener detalle de materia ${materiaSlug}:`, error)
		throw new Error(error.message)
	}

	if (!data) {
		throw new Error(`Materia no encontrada en el plan especificado: ${materiaSlug}`)
	}

	const typedRow = data as unknown as MateriaDetalleQueryRow

	const {data: datesData, error: datesError} = await staticSupabase
		.from("fechas_examenes")
		.select("id, fecha, resolucion:resoluciones(id, nombre, url)")
		.eq("materia_id", Number(typedRow.materia?.id || 0))

	if (datesError) {
		console.error("Error al obtener fechas de exámenes:", datesError)
	}

	const fechasExamenes = (datesData || []).map(({id, fecha, resolucion}) => {
		const resObj = Array.isArray(resolucion) ? resolucion[0] : resolucion
		return {
			id: Number(id),
			fecha: fecha as string,
			resolucion:
				resObj && resObj.nombre ?
					{
						id: Number(resObj.id),
						nombre: resObj.nombre as string,
						url: (resObj.url as string | null) || null,
					}
				:	null,
		}
	})

	return {
		id: Number(typedRow.materia?.id || 0),
		idMateriaPlan: Number(typedRow.id),
		nombre: typedRow.materia?.nombre || "",
		slug: typedRow.materia?.slug || "",
		esOptativa: !!typedRow.nro_optativa,
		nroOptativa: typedRow.nro_optativa ? Number(typedRow.nro_optativa) : null,
		orientacion:
			typedRow.orientacion ?
				{
					nombre: typedRow.orientacion.nombre || "",
					slug: typedRow.orientacion.slug || "",
				}
			:	null,
		anio: Number(typedRow.anio),
		nroPeriodo: Number(typedRow.nro_periodo),
		periodo:
			typedRow.periodo ?
				{
					id: Number(typedRow.periodo.id),
					slug: typedRow.periodo.slug || "",
					nombre: typedRow.periodo.nombre || "",
				}
			:	null,
		fechasExamenes,
		plan: {
			id: Number(typedRow.plan?.id || 0),
			anioInicio: Number(typedRow.plan?.anio_inicio || 0),
			carrera: {
				nombre: typedRow.plan?.carreras?.nombre || "",
				slug: typedRow.plan?.carreras?.slug || "",
			},
		},
		correlativas: procesarCorrelativas(typedRow.correlativas || []),
	}
}

/**
 * Realiza una búsqueda general de carreras y materias.
 * Para las materias, provee su correspondiente carrera y año de inicio del plan de estudio.
 * Ejecuta ambas búsquedas en paralelo con Promise.all para optimizar la respuesta.
 *
 * @param termino - Término de búsqueda
 * @returns Resultados coincidentes de carreras y materias
 */
export async function getBusquedaGeneral(termino: string): Promise<ResultadosBusquedaGeneral> {
	"use cache"
	cacheLife("hours")

	const [carrerasRes, materiasRes] = await Promise.all([
		staticSupabase
			.from("carreras")
			.select("id, nombre, slug, icon")
			.or(`nombre.ilike.%${termino}%,slug.ilike.%${termino}%`)
			.limit(10),
		staticSupabase
			.from("materia_plan")
			.select(
				`
				id,
				materia:materias!inner (
					id,
					nombre,
					slug
				),
				plan:plan_estudio!inner (
					anio_inicio,
					carreras:carrera_id!inner (
						nombre,
						slug
					)
				)
			`,
			)
			.or(`materia.nombre.ilike.%${termino}%,materia.slug.ilike.%${termino}%`)
			.limit(20),
	])

	if (carrerasRes.error) throw carrerasRes.error
	if (materiasRes.error) throw materiasRes.error

	const rawCarreras = (carrerasRes.data || []) as unknown as CarreraSearchRow[]
	const rawMaterias = (materiasRes.data || []) as unknown as MateriaPlanSearchRow[]

	const carreras: ResultadoBusquedaCarrera[] = rawCarreras.map((c) => ({
		carreraId: Number(c.id),
		carreraNombre: c.nombre,
		carreraSlug: c.slug,
		carreraIcon: c.icon,
	}))

	const materias: ResultadoBusquedaMateria[] = rawMaterias
		.filter((m) => m.materia && m.plan && m.plan.carreras)
		.map((m) => ({
			materiaId: Number(m.materia!.id),
			materiaNombre: m.materia!.nombre,
			materiaSlug: m.materia!.slug,
			carreraNombre: m.plan!.carreras!.nombre,
			carreraSlug: m.plan!.carreras!.slug,
			planAnioInicio: Number(m.plan!.anio_inicio),
		}))

	return {
		carreras,
		materias,
	}
}

// --- FUNCIONES DE CONSULTA PRIVADAS/USUARIO (CON REACT CACHE) ---

/**
 * Obtiene el resumen del perfil del usuario y sus planes guardados como favoritos para el /dashboard.
 * Las consultas se realizan en paralelo utilizando Promise.all.
 *
 * @param userId - ID del usuario autenticado
 * @returns Perfil del usuario y listado de planes favoritos
 */
export const getDashboardUsuario = cache(async (userId: string): Promise<DatosDashboardUsuario> => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const [userRes, favsRes] = await Promise.all([
		supabase.from("usuarios").select("id, username, full_name, avatar_url, role, icon").eq("id", userId).maybeSingle(),
		supabase
			.from("carreras_fav")
			.select(
				`
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
			`,
			)
			.eq("user_id", userId),
	])

	if (userRes.error) throw userRes.error
	if (favsRes.error) throw favsRes.error

	const userRaw = userRes.data as unknown as UsuarioQueryRow | null
	const usuario: PerfilUsuario =
		userRaw ?
			{
				id: userRaw.id,
				username: userRaw.username,
				fullName: userRaw.full_name,
				avatarUrl: userRaw.avatar_url,
				role: userRaw.role,
				icon: userRaw.icon,
			}
		:	{
				id: userId,
				username: null,
				fullName: null,
				avatarUrl: null,
				role: "user",
				icon: null,
			}

	const rawFavs = (favsRes.data || []) as unknown as CarreraFavQueryRow[]
	const carrerasFavoritas: PlanCarreraFavorito[] = rawFavs
		.filter((f) => f.plan && f.plan.carrera)
		.map((f) => ({
			id: Number(f.id),
			planId: Number(f.plan_id),
			anioInicio: Number(f.plan!.anio_inicio),
			anioFin: f.plan!.anio_fin ? Number(f.plan!.anio_fin) : null,
			carrera: {
				id: Number(f.plan!.carrera!.id),
				nombre: f.plan!.carrera!.nombre,
				slug: f.plan!.carrera!.slug,
				icon: f.plan!.carrera!.icon,
			},
		}))

	return {
		usuario,
		carrerasFavoritas,
	}
})

/**
 * Consulta si un plan específico está en los favoritos del usuario.
 */
export const isPlanFavorito = cache(async (
	userId: string,
	planId: number | string
): Promise<boolean> => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const {data, error} = await supabase
		.from("carreras_fav")
		.select("id")
		.eq("user_id", userId)
		.eq("plan_id", planId)
		.maybeSingle()

	if (error || !data) return false
	return true
})

/**
 * Obtiene la malla curricular de un plan inyectándole el avance del usuario actual.
 * Realiza las consultas en paralelo utilizando Promise.all.
 *
 * @param userId - ID del usuario autenticado
 * @param planIdOrYear - ID o año del plan de estudio
 * @returns Malla curricular con el estado actual de cada materia ("Cursando", "Aprobado", etc.)
 */
export const getMiCarrera = cache(
	async (userId: string, planIdOrYear: number | string): Promise<DatosSeguimientoPlan> => {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)

		const [planData, advancesRes] = await Promise.all([
			getPlanEstudio(planIdOrYear),
			supabase.from("avances").select("materia_plan_id, estado").eq("user_id", userId),
		])

		if (advancesRes.error) {
			console.error("Error al obtener avances del usuario:", advancesRes.error)
			throw advancesRes.error
		}

		const typedAdvances = (advancesRes.data || []) as unknown as AvanceQueryRow[]

		const advancesMap = new Map<number, EstadoMateria>()
		typedAdvances.forEach((adv) => {
			advancesMap.set(Number(adv.materia_plan_id), adv.estado as EstadoMateria)
		})

		const anios: AnioSeguimientoJSON[] = planData.anios.map((anio) => ({
			anio: anio.anio,
			periodos: anio.periodos.map((periodo) => {
				const materiasConEstado = periodo.materias.map((materia) => ({
					...materia,
					estadoMateria: advancesMap.get(materia.idMateriaPlan) || "Sin cursar",
				}))
				return {
					id: periodo.id,
					nroPeriodo: periodo.nroPeriodo,
					tipoPeriodo: periodo.tipoPeriodo,
					materias: materiasConEstado,
					materiasPorOrientacion: agruparMateriasSeguimientoPorOrientacion(materiasConEstado),
				}
			}),
		}))

		return {
			id: planData.id,
			anioInicio: planData.anioInicio,
			anioFin: planData.anioFin,
			carrera: planData.carrera,
			listaOrientaciones: planData.listaOrientaciones,
			anios: anios,
		}
	},
)

/**
 * Obtiene los datos del perfil de un usuario para su modificación en configuración.
 *
 * @param userId - ID del usuario a consultar
 * @returns Perfil simplificado del usuario
 */
export const getUsuarioPerfil = cache(async (userId: string): Promise<PerfilUsuario> => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const {data, error} = await supabase
		.from("usuarios")
		.select("id, username, full_name, avatar_url, role, icon")
		.eq("id", userId)
		.maybeSingle()

	if (error) {
		console.error("Error al obtener perfil de usuario:", error)
		throw error
	}

	if (!data) {
		return {
			id: userId,
			username: null,
			fullName: null,
			avatarUrl: null,
			role: "user",
			icon: null,
		}
	}

	const typed = data as unknown as UsuarioQueryRow

	return {
		id: typed.id,
		username: typed.username,
		fullName: typed.full_name,
		avatarUrl: typed.avatar_url,
		role: typed.role,
		icon: typed.icon,
	}
})

/**
 * Obtiene todos los datos para la página principal del perfil:
 * Resumen de usuario, estadísticas generales, carreras favoritas con avance y materias actualmente en cursada.
 */
export const getDatosPerfilInicio = cache(async (userId: string): Promise<ResumenPerfilDashboard> => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const [usuario, dashboardData] = await Promise.all([
		getUsuarioPerfil(userId),
		getDashboardUsuario(userId),
	])

	// Consultar todos los avances del usuario
	const { data: avancesRaw, error: errorAvances } = await supabase
		.from("avances")
		.select("materia_plan_id, estado")
		.eq("user_id", userId)

	if (errorAvances) {
		console.error("Error al consultar avances en getDatosPerfilInicio:", errorAvances)
	}

	const avancesList = (avancesRaw || []) as AvanceQueryRow[]
	const advancesMap = new Map<number, EstadoMateria>()
	avancesList.forEach(({ materia_plan_id, estado }) => {
		advancesMap.set(Number(materia_plan_id), estado as EstadoMateria)
	})

	let totalAprobadas = 0
	let totalCursando = 0
	let totalRegulares = 0

	avancesList.forEach(({ estado }) => {
		if (estado === "Aprobado") totalAprobadas++
		if (estado === "Cursando") totalCursando++
		if (estado === "Regular") totalRegulares++
	})

	const materiasCursandoMap = new Map<number, MateriaCursando>()

	const carrerasFavoritas: CarreraFavoritaConAvance[] = await Promise.all(
		dashboardData.carrerasFavoritas.map(async ({ id: planFavId, planId, anioInicio, carrera }) => {
			let totalMaterias = 0
			let aprobadas = 0
			let cursando = 0
			let regulares = 0

			try {
				const planEstudioData = await getMiCarrera(userId, planId)
				planEstudioData.anios.forEach(({ anio, periodos }) => {
					periodos.forEach(({ tipoPeriodo, materias }) => {
						materias.forEach((materia) => {
							totalMaterias++
							const { idMateriaPlan, id: materiaId, estadoMateria } = materia

							if (estadoMateria === "Aprobado") aprobadas++
							if (estadoMateria === "Regular") regulares++
							if (estadoMateria === "Cursando") {
								cursando++
								if (!materiasCursandoMap.has(idMateriaPlan)) {
									materiasCursandoMap.set(idMateriaPlan, {
										...materia,
										idMateriaPlan,
										materiaId,
										carreraNombre: carrera.nombre,
										carreraSlug: carrera.slug,
										carreraIcon: carrera.icon || "book",
										planAnio: planEstudioData.anioInicio,
										anio,
										periodoNombre: tipoPeriodo?.nombre,
									})
								}
							}
						})
					})
				})
			} catch (e) {
				console.error(`Error al obtener plan estudio ${planId}:`, e)
			}

			const porcentajeAvance = totalMaterias > 0 ? Math.round((aprobadas / totalMaterias) * 100) : 0

			return {
				planFavId,
				planId,
				anioInicio,
				carrera,
				totalMaterias,
				aprobadas,
				cursando,
				regulares,
				porcentajeAvance,
			}
		})
	)

	const materiasCursando = Array.from(materiasCursandoMap.values())

	return {
		usuario,
		carrerasFavoritas,
		materiasCursando,
		stats: {
			totalCarrerasFav: carrerasFavoritas.length,
			totalMateriasAprobadas: totalAprobadas,
			totalMateriasCursando: totalCursando,
			totalMateriasRegulares: totalRegulares,
		},
	}
})

/**
 * Obtiene los datos del dashboard de una carrera específica para el usuario.
 */
export const getDatosPerfilCarrera = cache(async (userId: string, carreraSlug: string): Promise<CarreraPerfilDashboardData | null> => {
	const carreraData = await getCarreraDetalle(carreraSlug)
	if (!carreraData || !carreraData.planes || carreraData.planes.length === 0) {
		return null
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: favData, error: favError } = await supabase
		.from("carreras_fav")
		.select("plan_id, plan:plan_estudio!inner(id, carrera_id)")
		.eq("user_id", userId)
		.eq("plan.carrera_id", carreraData.id)
		.maybeSingle()

	if (favError) {
		console.error(`Error al obtener el plan favorito de la carrera ${carreraSlug}:`, favError)
		throw favError
	}

	const planIdFavorito = favData?.plan_id
	const planActivo = planIdFavorito
		? carreraData.planes.find((p) => p.id === Number(planIdFavorito))
		: undefined

	if (!planActivo) {
		return null
	}

	const planEstudioData = await getMiCarrera(userId, planActivo.id)

	let totalMaterias = 0
	let aprobadas = 0
	let cursando = 0
	let regulares = 0
	const materiasCursando: MateriaCursando[] = []

	planEstudioData.anios.forEach(({ anio, periodos }) => {
		periodos.forEach(({ tipoPeriodo, materias }) => {
			materias.forEach((materia) => {
				totalMaterias++
				const { idMateriaPlan, id: materiaId, estadoMateria } = materia

				if (estadoMateria === "Aprobado") aprobadas++
				if (estadoMateria === "Regular") regulares++
				if (estadoMateria === "Cursando") {
					cursando++
					materiasCursando.push({
						...materia,
						idMateriaPlan,
						materiaId,
						carreraNombre: carreraData.nombre,
						carreraSlug: carreraData.slug,
						carreraIcon: carreraData.icon || "book",
						planAnio: planEstudioData.anioInicio,
						anio,
						periodoNombre: tipoPeriodo?.nombre,
					})
				}
			})
		})
	})

	const restantes = Math.max(0, totalMaterias - aprobadas)
	const porcentajeCompletado = totalMaterias > 0 ? Math.round((aprobadas / totalMaterias) * 100) : 0
	const porcentajeFaltante = 100 - porcentajeCompletado

	return {
		carrera: {
			id: carreraData.id,
			nombre: carreraData.nombre,
			slug: carreraData.slug,
			icon: carreraData.icon || "book",
		},
		planAnio: planEstudioData.anioInicio,
		totalMaterias,
		aprobadas,
		cursando,
		regulares,
		restantes,
		porcentajeCompletado,
		porcentajeFaltante,
		materiasCursando,
	}
})

/**
 * Obtiene todas las materias_plan con sus respectivas carreras y planes para el modal de búsqueda rápida.
 * Utiliza "use cache" y cacheLife("hours") para máximo rendimiento.
 */
export async function getMateriasPlanSearchData(): Promise<SearchDataResponse> {
	"use cache"
	cacheLife("hours")

	const {data, error} = await staticSupabase
		.from("materia_plan")
		.select(
			`
			id,
			materia:materias!inner (
				id,
				nombre,
				slug
			),
			plan:plan_estudio!inner (
				id,
				anio_inicio,
				carreras:carrera_id!inner (
					id,
					nombre,
					slug,
					icon
				)
			)
		`,
		)
		.order("id", {ascending: true})

	if (error) {
		console.error("Error al obtener materias_plan para búsqueda:", error)
		throw new Error(error.message)
	}

	interface RawSearchRow {
		id: number
		materia: {
			id: number
			nombre: string
			slug: string
		} | null
		plan: {
			id: number
			anio_inicio: number
			carreras: {
				id: number
				nombre: string
				slug: string
				icon: string
			} | null
		} | null
	}

	const rows = (data || []) as unknown as RawSearchRow[]

	const materiasMap = new Map<string, MateriaPlanSearchItem>()
	const carrerasMap = new Map<string, CarreraFilterOption>()
	const planesSet = new Set<number>()

	rows.forEach(({id, materia, plan}) => {
		if (!materia || !plan || !plan.carreras) return

		const {nombre: materiaNombre, slug: materiaSlug} = materia
		const {anio_inicio: planAnio, carreras} = plan
		const {id: carreraId, nombre: carreraNombre, slug: carreraSlug, icon: carreraIcon} = carreras

		const item: MateriaPlanSearchItem = {
			idMateriaPlan: Number(id),
			materiaNombre,
			materiaSlug,
			carreraNombre,
			carreraSlug,
			carreraIcon: carreraIcon || "book",
			planAnio: Number(planAnio),
		}

		materiasMap.set(`${id}`, item)

		if (!carrerasMap.has(carreraSlug)) {
			carrerasMap.set(carreraSlug, {
				id: Number(carreraId),
				nombre: carreraNombre,
				slug: carreraSlug,
				icon: carreraIcon || "book",
			})
		}

		planesSet.add(Number(planAnio))
	})

	const materias = Array.from(materiasMap.values())
	const carreras = Array.from(carrerasMap.values()).sort(({nombre: a}, {nombre: b}) => a.localeCompare(b))
	const planes = Array.from(planesSet.values()).sort((a, b) => b - a)

	return {
		materias,
		carreras,
		planes,
	}
}




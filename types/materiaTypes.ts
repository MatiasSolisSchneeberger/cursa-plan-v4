import type {Requisito, Condicion, GrupoCorrelativa} from "@/types/carrera"
import type {CorrelativaRaw} from "@/utils/transformData"

export type {Requisito, Condicion, GrupoCorrelativa}

export type EstadoMateria = "Sin cursar" | "Cursando" | "Regular" | "Aprobado" | "Libre"

export interface Avance {
	materia_plan_id: number
	materia_id: number
	estado: EstadoMateria
	materia_nombre?: string
	carrera_nombre?: string
	materia_slug?: string
	carrera_slug?: string
	carrera_plan?: number | string
}

export interface FechaExamen {
	fecha: string
}

export interface MateriaData {
	nombre: string
	slug: string
	fechas_examenes: FechaExamen[] | FechaExamen
}

export interface Carrera {
	slug: string
	nombre: string
	icon: string
	id: number
}

export interface PlanEstudio {
	anio_inicio: number
	carreras: Carrera
}

export interface MateriaDetalle {
	id: number
	nro_optativa?: number | null
	orientacion?: {nombre: string; slug: string} | null
	materias: MateriaData
	plan_estudio: PlanEstudio
	correlativas?: CorrelativaRaw[]
}

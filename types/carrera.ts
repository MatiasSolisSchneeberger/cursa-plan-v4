// 1. Lo que viene de Supabase (Refleja tus tablas SQL)
export interface DBResponse {
	id: number
	nombre: string
	slug: string
	planes: {
		id: number
		anio_inicio: number
		anio_fin: number
		materias_plan: {
			id: number
			anio: number
			nro_periodo: number
			periodo: {slug: string; nombre: string}
			orientacion: {id: number; nombre: string} | null
			materia: {id: number; nombre: string; slug: string}
			correlativas: {
				tipo_requisito: string
				condicion: string
				porcentaje: number
				nota: string
				requisito_plan: {
					id: number
					materia: {nombre: string; slug: string}
				} | null
			}[]
		}[]
	}[]
}

// 2. Tu JSON Objetivo (El que subiste en ejemploDB.json)
export interface RequisitoMateria {
	id: number // Agregamos ID de la materia plan
	nombre: string
	slug: string
}

export interface RequisitoPorcentaje {
	porcentaje: number
}

export interface RequisitoNota {
	nota: string
}

export type Requisito = RequisitoMateria | RequisitoPorcentaje | RequisitoNota

export interface Condicion {
	// Puede faltar "id" si no lo generas, pero en el front se usa key={condicion.id} a veces.
	// Lo ideal es agregarlo en transformData o usar índice.
	id?: string | number
	tipo: "materia" | "porcentaje" | "nota"
	condicion?: string // "regular" | "aprobado"
	requisitos: Requisito[]
}

export interface GrupoCorrelativa {
	tipo: string // "cursar" | "rendir"
	condiciones: Condicion[]
}

export interface MateriaJSON {
	id: number
	idMateriaPlan: number
	nombre: string
	slug: string
	esOptativa: boolean
	nroOptativa?: number | null
	orientacion?: {id?: number; nombre: string; slug: string} | null
	estadoMateria?: string
	correlativas: GrupoCorrelativa[]
}

export interface PeriodoJSON {
	id: number
	nroPeriodo: number
	tipoPeriodo: {
		id: number
		nombre: string
		slug: string
	}
	materias: MateriaJSON[]
}

export interface AnioJSON {
	anio: number
	periodos: PeriodoJSON[]
}

export interface PlanJSON {
	id: number
	anioInicio: number
	anioFin: number | null
	listaOrientaciones: {nombre: string; slug: string; id: number}[]
	anios: AnioJSON[]
}

export interface CarreraJSON {
	carrera: string
	id: number
	icon?: string
	planes: PlanJSON[]
}

export interface CarreraType {
    id: number;
    nombre: string;
    slug: string;
    icon: string;
    planes?: { anio_inicio: number; materia_plan?: { id: number }[] }[];
}

export type carreras = CarreraType[];
export type CarreraConPlanes = CarreraType;
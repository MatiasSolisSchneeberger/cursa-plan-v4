import type { AnioJSON, MateriaJSON } from "./carrera";
import type { EstadoMateria } from "./materiaTypes";

export interface Carrera {
	id: number;
	nombre: string;
	slug: string;
	icon: string;
	planes?: {
		id: number;
		anio_inicio: number;
		anio_fin: number | null;
		materia_plan?: { id: number }[];
	}[];
}

// 2. Tipos para /carreras/[carrera_slug]
export interface PlanEstudioBasic {
	id: number;
	anio_inicio: number;
	anio_fin: number | null;
}

export interface CarreraWithPlanes {
	id: number;
	nombre: string;
	slug: string;
	icon: string;
	planes: PlanEstudioBasic[];
}

// 3. Tipos para /carreras/[carrera_slug]/[plan_id]
export interface PlanCurricularData {
	id: number;
	anioInicio: number;
	anioFin: number | null;
	carrera: {
		id: number;
		nombre: string;
		slug: string;
		icon: string;
	};
	listaOrientaciones: { nombre: string; slug: string; id: number }[];
	anios: AnioJSON[];
}

// 4. Tipos para /calendario
export interface DBTurnoExamen {
	id: number;
	fecha_inicio: string;
	fecha_fin: string;
	is_suspencion: boolean;
	nota: string | null;
	tipo_mesa_id: {
		id: number;
		nombre: string;
		slug: string;
	} | null;
}

export interface DBInscripcion {
	id: number;
	nro_periodo: number;
	fecha_inicio: string;
	fecha_fin: string;
	periodo: {
		id: number;
		nombre: string;
		slug: string;
	} | null;
}

export interface DBFeriado {
	id: number;
	fecha: string;
	nombre: string;
	slug: string;
	nota: string | null;
	tipo: {
		id: number;
		nombre: string;
		slug: string;
	} | null;
}

export interface DBCalendarioClase {
	id: number;
	nro_periodo: number;
	fecha_inicio: string;
	fecha_fin: string;
	nota: string;
	periodo: {
		id: number;
		nombre: string;
		slug: string;
	} | null;
}

export interface CalendarioCompletoData {
	turnosExamenes: DBTurnoExamen[];
	inscripciones: DBInscripcion[];
	feriados: DBFeriado[];
	calendarioClases: DBCalendarioClase[];
}

// 5. Tipos para /dashboard
export interface FavoriteCarreraPlan {
	id: number; // ID del registro carreras_fav
	planId: number; // ID del plan_estudio
	anioInicio: number;
	anioFin: number | null;
	carrera: {
		id: number;
		nombre: string;
		slug: string;
		icon: string;
	};
}

export interface DashboardUserData {
	user: {
		id: string;
		username: string | null;
		fullName: string | null;
		avatarUrl: string | null;
		role: string;
		icon: string | null;
	};
	carrerasFav: FavoriteCarreraPlan[];
}

// 6. Tipos para /dashboard/mis-carreras/[plan_id]
export interface MateriaSeguimientoJSON extends Omit<MateriaJSON, "estadoMateria"> {
	estadoMateria: EstadoMateria;
}

export interface PeriodoSeguimientoJSON {
	id: number;
	nroPeriodo: number;
	tipoPeriodo: {
		id: number;
		nombre: string;
		slug: string;
	};
	materias: MateriaSeguimientoJSON[];
}

export interface AnioSeguimientoJSON {
	anio: number;
	periodos: PeriodoSeguimientoJSON[];
}

export interface SeguimientoPlanData {
	id: number;
	anioInicio: number;
	anioFin: number | null;
	carrera: {
		id: number;
		nombre: string;
		slug: string;
		icon: string;
	};
	listaOrientaciones: { nombre: string; slug: string; id: number }[];
	anios: AnioSeguimientoJSON[];
}
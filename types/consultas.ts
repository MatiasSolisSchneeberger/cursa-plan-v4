import type { MateriaJSON, GrupoCorrelativa } from "./carrera";
import type { EstadoMateria } from "./materiaTypes";

// --- INTERFACES PARA LA AGRUPACIÓN POR ORIENTACIÓN ---

export interface GrupoOrientacion {
	orientacion: {
		id: number;
		nombre: string;
		slug: string;
	} | null; // null representa "Materias Troncales" o "Comunes"
	materias: MateriaJSON[];
}

export interface GrupoOrientacionSeguimiento {
	orientacion: {
		id: number;
		nombre: string;
		slug: string;
	} | null; // null representa "Materias Troncales" o "Comunes"
	materias: MateriaSeguimientoJSON[];
}

// --- REDEFINICIÓN LOCAL DE PERIODO Y AÑO CON GRUPOS ---

export interface PeriodoJSON {
	id: number;
	nroPeriodo: number;
	tipoPeriodo: {
		id: number;
		nombre: string;
		slug: string;
	};
	materias: MateriaJSON[];
	materiasPorOrientacion: GrupoOrientacion[];
}

export interface AnioJSON {
	anio: number;
	periodos: PeriodoJSON[];
}

// 1. Interfaces básicas de Planes y Carreras
export interface PlanEstudioBasico {
	id: number;
	anio_inicio: number;
	anio_fin: number | null;
	materia_plan?: { id: number }[];
}

export interface Carrera {
	id: number;
	nombre: string;
	slug: string;
	icon: string;
	planes?: PlanEstudioBasico[];
}

export interface CarreraConPlanes {
	id: number;
	nombre: string;
	slug: string;
	icon: string;
	planes: PlanEstudioBasico[];
}

// 2. Información detallada del Plan de Estudios
export interface OrientacionBasica {
	nombre: string;
	slug: string;
	id: number;
}

export interface CarreraInfo {
	id: number;
	nombre: string;
	slug: string;
	icon: string;
}

export interface DatosPlanCurricular {
	id: number;
	anioInicio: number;
	anioFin: number | null;
	carrera: CarreraInfo;
	listaOrientaciones: OrientacionBasica[];
	anios: AnioJSON[];
}

// 3. Calendario Académico
export interface TurnoExamenBD {
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

export interface InscripcionBD {
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

export interface FeriadoBD {
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

export interface CalendarioClaseBD {
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

export interface DatosCalendarioCompleto {
	turnosExamenes: TurnoExamenBD[];
	inscripciones: InscripcionBD[];
	feriados: FeriadoBD[];
	calendarioClases: CalendarioClaseBD[];
}

// 4. Perfil y Dashboard del Usuario
export interface PlanCarreraFavorito {
	id: number; // ID del registro en carreras_fav
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

export interface PerfilUsuario {
	id: string;
	username: string | null;
	fullName: string | null;
	avatarUrl: string | null;
	role: string;
	icon: string | null;
}

export interface DatosDashboardUsuario {
	usuario: PerfilUsuario;
	carrerasFavoritas: PlanCarreraFavorito[];
}

// 5. Seguimiento del Plan de Estudio
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
	materiasPorOrientacion: GrupoOrientacionSeguimiento[];
}

export interface AnioSeguimientoJSON {
	anio: number;
	periodos: PeriodoSeguimientoJSON[];
}

export interface DatosSeguimientoPlan {
	id: number;
	anioInicio: number;
	anioFin: number | null;
	carrera: CarreraInfo;
	listaOrientaciones: OrientacionBasica[];
	anios: AnioSeguimientoJSON[];
}

// 6. Detalle de Materia
export interface ResolucionDetalle {
	id: number;
	nombre: string;
	url: string | null;
}

export interface FechaExamenDetalle {
	id: number;
	fecha: string;
	resolucion: ResolucionDetalle | null;
}

export interface DatosMateriaDetalle {
	id: number;
	idMateriaPlan: number;
	nombre: string;
	slug: string;
	esOptativa: boolean;
	nroOptativa: number | null;
	orientacion: { id?: number; nombre: string; slug: string } | null;
	anio: number;
	nroPeriodo: number;
	periodo: { id: number; slug: string; nombre: string } | null;
	fechasExamenes: FechaExamenDetalle[];
	plan: {
		id: number;
		anioInicio: number;
		carrera: {
			nombre: string;
			slug: string;
		};
	};
	correlativas: GrupoCorrelativa[];
}

// 7. Resultados de Búsqueda General
export interface ResultadoBusquedaMateria {
	materiaId: number;
	materiaNombre: string;
	materiaSlug: string;
	carreraNombre: string;
	carreraSlug: string;
	planAnioInicio: number;
}

export interface ResultadoBusquedaCarrera {
	carreraId: number;
	carreraNombre: string;
	carreraSlug: string;
	carreraIcon: string;
}

export interface ResultadosBusquedaGeneral {
	carreras: ResultadoBusquedaCarrera[];
	materias: ResultadoBusquedaMateria[];
}

// 8. Interfaces para Perfil y Dashboard Extendido
export interface MateriaCursando extends MateriaSeguimientoJSON {
	idMateriaPlan: number;
	materiaId: number;
	carreraNombre: string;
	carreraSlug: string;
	carreraIcon: string;
	planAnio: number;
	anio: number;
	periodoNombre?: string;
}

export interface CarreraFavoritaConAvance {
	planFavId: number;
	planId: number;
	anioInicio: number;
	carrera: CarreraInfo;
	totalMaterias: number;
	aprobadas: number;
	cursando: number;
	regulares: number;
	porcentajeAvance: number;
}

export interface ResumenPerfilDashboard {
	usuario: PerfilUsuario;
	carrerasFavoritas: CarreraFavoritaConAvance[];
	materiasCursando: MateriaCursando[];
	stats: {
		totalCarrerasFav: number;
		totalMateriasAprobadas: number;
		totalMateriasCursando: number;
		totalMateriasRegulares: number;
	};
}

export interface CarreraPerfilDashboardData {
	carrera: CarreraInfo;
	planAnio: number;
	totalMaterias: number;
	aprobadas: number;
	cursando: number;
	regulares: number;
	restantes: number;
	porcentajeCompletado: number;
	porcentajeFaltante: number;
	materiasCursando: MateriaCursando[];
}

// 9. Interfaces para Búsqueda Modal de Materias Plan
export interface MateriaPlanSearchItem {
	idMateriaPlan: number;
	materiaNombre: string;
	materiaSlug: string;
	carreraNombre: string;
	carreraSlug: string;
	carreraIcon: string;
	planAnio: number;
}

export interface CarreraFilterOption {
	id: number;
	nombre: string;
	slug: string;
	icon: string;
}

export interface SearchDataResponse {
	materias: MateriaPlanSearchItem[];
	carreras: CarreraFilterOption[];
	planes: number[];
}



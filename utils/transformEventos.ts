export type CategoriaEvento = "feriados" | "clases" | "inscripciones" | "examenes"
export type EstiloFeriado = "inamovible" | "trasladable" | "no-laborable"

export interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    nota?: string | null
    categoria: CategoriaEvento
    eventType?: string
    period?: string
    periodSlug?: string
    nroPeriodo?: number
    estiloFeriado?: EstiloFeriado
    isSuspended?: boolean
}

// --- HELPERS ---

/**
 * Convierte un string "YYYY-MM-DD" a objeto Date asegurando la zona horaria local.
 * Evita el error común donde "2026-01-01" se convierte en "2025-12-31" por culpa de UTC.
 */
const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
}



export interface RawFeriado {
    id: number | string
    nombre: string
    fecha: string
    nota?: string | null
    tipo?: { nombre: string; slug: string } | null
}

export interface RawClase {
    id: number | string
    periodo?: { nombre: string; slug: string } | null
    nro_periodo?: number
    fecha_inicio: string
    fecha_fin: string
    nota?: string | null
}

export interface RawExamen {
    id: number | string
    tipo_mesa_id?: { nombre: string; slug: string } | null
    fecha_inicio: string
    fecha_fin: string
    is_suspencion?: boolean
    nota?: string | null
}

export interface RawInscripcion {
    id: number | string
    periodo?: { nombre: string; slug: string } | null
    nro_periodo?: number
    fecha_inicio: string
    fecha_fin: string
    nota?: string | null
}

// --- HELPERS (cont.) ---

const detectarEstiloFeriado = (tipo: { nombre: string; slug: string } | null | undefined): "inamovible" | "trasladable" | "no-laborable" => {
    if (!tipo) return "inamovible"
    const normalized = (tipo.slug || tipo.nombre).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    if (normalized.includes("inamovible")) return "inamovible"
    if (normalized.includes("traslad")) return "trasladable"
    if (normalized.match(/no.?laborable/)) return "no-laborable"
    return "inamovible"
}

// --- TRANSFORMADORES ---

export function transformarFeriados(data: RawFeriado[]): CalendarEvent[] {
    return data.map(({ id, nombre, fecha, nota, tipo }) => ({
        id: `feriado-${id}`,
        title: nombre,
        start: parseDate(fecha),
        end: parseDate(fecha),
        nota: nota || null,
        categoria: "feriados" as const,
        eventType: tipo?.nombre || "Feriado",
        estiloFeriado: tipo ? detectarEstiloFeriado(tipo) : undefined,
    }))
}

export function transformarClases(data: RawClase[]): CalendarEvent[] {
    return data.map(({ id, periodo, nro_periodo, fecha_inicio, fecha_fin, nota }) => {
        const periodoNombre = periodo?.nombre || "Periodo"
        const periodoStr = nro_periodo ? `${nro_periodo}° ${periodoNombre}` : periodoNombre

        return {
            id: `clase-${id}`,
            title: `Cursado ${periodoStr}`,
            start: parseDate(fecha_inicio),
            end: parseDate(fecha_fin),
            nota: nota || null,
            categoria: "clases" as const,
            eventType: "Clases",
            period: periodoNombre,
            periodSlug: periodo?.slug,
            nroPeriodo: nro_periodo,
        }
    })
}

export function transformarExamenes(data: RawExamen[]): CalendarEvent[] {
    return data.map(({ id, tipo_mesa_id, fecha_inicio, fecha_fin, is_suspencion, nota }) => {
        const nombreMesa = tipo_mesa_id?.nombre || "Examen"

        return {
            id: `examen-${id}`,
            title: `Mesa N° ${id} - ${nombreMesa}`,
            start: parseDate(fecha_inicio),
            end: parseDate(fecha_fin),
            nota: nota || (is_suspencion ? "Suspende clases" : null),
            categoria: "examenes" as const,
            eventType: "Exámenes",
            isSuspended: is_suspencion,
        }
    })
}

export function transformarInscripciones(data: RawInscripcion[]): CalendarEvent[] {
    return data.map(({ id, periodo, nro_periodo, fecha_inicio, fecha_fin, nota }) => {
        const periodoNombre = periodo?.nombre || "Periodo"
        const periodoStr = nro_periodo ? `${nro_periodo}° ${periodoNombre}` : periodoNombre

        return {
            id: `insc-${id}`,
            title: `Inscripción ${periodoStr}`,
            start: parseDate(fecha_inicio),
            end: parseDate(fecha_fin),
            nota: nota || null,
            categoria: "inscripciones" as const,
            eventType: "Inscripciones",
            period: periodoNombre,
            periodSlug: periodo?.slug,
            nroPeriodo: nro_periodo,
        }
    })
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end?: Date;
    note?: string;
    eventType?: string;
    period?: string;
    isSuspended?: boolean;
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
    id: number | string;
    nombre: string;
    fecha: string;
    nota?: string;
    tipo?: { nombre: string };
}

export interface RawClase {
    id: number | string;
    periodo?: { nombre: string };
    nro_periodo?: number;
    fecha_inicio: string;
    fecha_fin: string;
    nota?: string;
}

export interface RawExamen {
    id: number | string;
    tipo_mesa_id?: { nombre: string };
    fecha_inicio: string;
    fecha_fin: string;
    is_suspencion?: boolean;
}

export interface RawInscripcion {
    id: number | string;
    periodo?: { nombre: string };
    nro_periodo?: number;
    fecha_inicio: string;
    fecha_fin: string;
    nota?: string;
}

// --- TRANSFORMADORES ---

export function transformarFeriados(data: RawFeriado[]): CalendarEvent[] {
    return data.map(({ id, nombre, fecha, nota, tipo }) => ({
        id: `feriado-${id}`,
        title: nombre,
        start: parseDate(fecha),
        // Los feriados suelen ser de 1 día, start = end implícito, o lo explícitas:
        end: parseDate(fecha),

        note: nota,
        eventType: tipo?.nombre || "Feriado",
    }))
}

export function transformarClases(data: RawClase[]): CalendarEvent[] {
    return data.map(({ id, periodo, nro_periodo, fecha_inicio, fecha_fin, nota }) => {
        const periodoNombre = periodo?.nombre || "Periodo"
        // Ej: "1° Cuatrimestre"
        const periodoStr = nro_periodo ? `${nro_periodo}° ${periodoNombre}` : periodoNombre

        const titulo = `Cursado ${periodoStr}`

        return {
            id: `clase-${id}`,
            title: titulo,
            period: periodoNombre, // Change: Use general name for filtering
            start: parseDate(fecha_inicio),
            end: parseDate(fecha_fin),

            note: nota,
            eventType: "Clases",
        }
    })
}

export function transformarExamenes(data: RawExamen[]): CalendarEvent[] {
    return data.map(({ id, tipo_mesa_id, fecha_inicio, fecha_fin, is_suspencion }) => {
        // Ej: "Mesa Comprimida"
        const nombreMesa = tipo_mesa_id?.nombre || "Examen"
        const title = `Mesa N° ${id} - ${nombreMesa}`

        return {
            id: `examen-${id}`,
            title: title,
            start: parseDate(fecha_inicio),
            end: parseDate(fecha_fin),

            note: is_suspencion ? "Suspende clases" : undefined,
            eventType: "Exámenes",
            isSuspended: is_suspencion,
        }
    })
}

export function transformarInscripciones(data: RawInscripcion[]): CalendarEvent[] {
    return data.map(({ id, periodo, nro_periodo, fecha_inicio, fecha_fin, nota }) => {
        const periodoNombre = periodo?.nombre || "Periodo"
        // Ej: "1° Cuatrimestre"
        const periodoStr = nro_periodo ? `${nro_periodo}° ${periodoNombre}` : periodoNombre

        const titulo = `Inscripción ${periodoStr}`

        return {
            id: `insc-${id}`,
            title: titulo,
            period: periodoNombre, // Change: Use general name for filtering
            start: parseDate(fecha_inicio),
            end: parseDate(fecha_fin),

            note: nota,
            eventType: "Inscripciones",
        }
    })
}

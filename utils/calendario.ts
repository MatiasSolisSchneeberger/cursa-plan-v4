import { EstiloFeriado, CalendarEvent } from "./transformEventos"
import { claveFecha } from "./diasHabiles"

export interface TabCalendario {
  id: string
  label: string
}

export const TABS_CALENDARIO: TabCalendario[] = [
  { id: "feriados", label: "Feriados" },
  { id: "clases", label: "Clases" },
  { id: "inscripciones", label: "Inscripciones" },
  { id: "examenes", label: "Exámenes" },
]

export interface EstiloPeriodo {
  extremo: string
  medio: string
}

export const ESTILOS_PERIODO: Record<string, EstiloPeriodo> = {
  clases: {
    extremo: "bg-info text-info-foreground",
    medio: "bg-info-accent text-info-accent-foreground",
  },
  inscripciones: {
    extremo: "bg-success text-success-foreground",
    medio: "bg-success-accent text-success-accent-foreground",
  },
  examenes: {
    extremo: "bg-warning text-warning-foreground",
    medio: "bg-warning-accent text-warning-accent-foreground",
  },
}

export const ESTILOS_FERIADO: Record<EstiloFeriado, string> = {
  inamovible: "bg-destructive text-destructive-foreground",
  trasladable: "bg-destructive-accent text-destructive-accent-foreground",
  "no-laborable": "border border-destructive text-destructive",
}

export const PRIORIDAD_FERIADO: EstiloFeriado[] = ["inamovible", "trasladable", "no-laborable"]

// TODO: reemplazar por las URLs reales
export const LINKS_CALENDARIO = [
  { id: "pagina", label: "Ver página oficial", href: "https://exa.unne.edu.ar/" },
  { id: "resolucion", label: "Ver resolución oficial", href: "https://exa.unne.edu.ar/" },
]

export const LABELS_FERIADO: Record<EstiloFeriado, string> = {
  inamovible: "Inamovible",
  trasladable: "Trasladable",
  "no-laborable": "No laborable",
}

export interface PeriodoCalendario {
  id: string
  label: string
}

export const PERIODOS_CALENDARIO: PeriodoCalendario[] = [
  { id: "bimestre", label: "Bimestre" },
  { id: "trimestre", label: "Trimestre" },
  { id: "cuatrimestre", label: "Cuatrimestre" },
]

export interface MesCalendario {
  mes: number
  nombre: string
  dias: (Date | null)[]
}

export function construirMeses(anio: number): MesCalendario[] {
  const meses: MesCalendario[] = []
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  for (let mes = 0; mes < 12; mes++) {
    const primerDia = new Date(anio, mes, 1)
    const ultimoDia = new Date(anio, mes + 1, 0)
    const offset = primerDia.getDay()

    const dias: (Date | null)[] = []

    for (let i = 0; i < offset; i++) {
      dias.push(null)
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(anio, mes, dia))
    }

    const total = Math.ceil((offset + ultimoDia.getDate()) / 7) * 7
    while (dias.length < total) {
      dias.push(null)
    }

    meses.push({
      mes: mes + 1,
      nombre: nombresMeses[mes],
      dias,
    })
  }

  return meses
}

export const claveDia = claveFecha

export function eventosDelDia(eventos: CalendarEvent[], dia: Date): CalendarEvent[] {
  const clave = claveDia(dia)
  return eventos.filter(({ start, end }) => {
    const startClave = claveDia(start)
    const endClave = claveDia(end)
    return clave >= startClave && clave <= endClave
  })
}

export function eventosDelMes(eventos: CalendarEvent[], anio: number, mes: number): CalendarEvent[] {
  return eventos.filter(({ start, end }) => {
    const startMes = start.getFullYear() === anio && start.getMonth() === mes - 1
    const endMes = end.getFullYear() === anio && end.getMonth() === mes - 1
    const entreInicioYFin = start.getFullYear() < anio || (start.getFullYear() === anio && start.getMonth() < mes - 1)
    const entrefin = end.getFullYear() > anio || (end.getFullYear() === anio && end.getMonth() > mes - 1)

    return startMes || endMes || (entreInicioYFin && entrefin)
  })
}


export function formatearRango(start: Date, end: Date): string {
  const formatoDia = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, "0")
    const m = String(date.getMonth() + 1).padStart(2, "0")
    return `${d}/${m}`
  }

  const startClave = claveDia(start)
  const endClave = claveDia(end)

  if (startClave === endClave) {
    return formatoDia(start)
  }

  return `${formatoDia(start)} - ${formatoDia(end)}`
}

export function eventosTituloLargo(date: Date, locale: string = "es-AR"): string {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function eventosProximos(eventos: CalendarEvent[], hoy: Date, dias = 14): CalendarEvent[] {
  const hoyKey = claveDia(hoy)
  const finalKey = claveDia(new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000))

  return eventos
    .filter(({ start }) => {
      const startKey = claveDia(start)
      return startKey >= hoyKey && startKey <= finalKey
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

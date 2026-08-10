import {getCalendario, getAniosCalendario} from "@/lib/carreras"
import {
	transformarFeriados,
	transformarClases,
	transformarInscripciones,
	transformarExamenes,
} from "@/utils/transformEventos"
import {CalendarEvent} from "@/utils/transformEventos"

export async function obtenerDatosCalendario(anioActivo: number): Promise<{eventos: CalendarEvent[]; anios: number[]}> {
	const [anios, datos] = await Promise.all([
		getAniosCalendario(),
		getCalendario(`${anioActivo}-01-01`, `${anioActivo}-12-31`),
	])

	const eventos = [
		...transformarFeriados(datos.feriados),
		...transformarClases(datos.calendarioClases),
		...transformarInscripciones(datos.inscripciones),
		...transformarExamenes(datos.turnosExamenes),
	]

	return {eventos, anios}
}

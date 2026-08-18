import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

export const ogTema = {
	fondo: "#0f1a24",
	texto: "#f2f6fa",
	textoTenue: "#8fa6ba",
	acento: "#4a86bd",
	borde: "#2a3d4e",
	padding: 56,
	tamTitulo: 68,
	tamSubtitulo: 30,
	tamMeta: 24,
} as const

export const ogTextos = {
	marca: "CursaPlan",
	tagline: "Correlativas y fechas de examen, claras.",
} as const

export async function cargarFuentesOg() {
	try {
		const [bold, regular] = await Promise.all([
			readFile(join(process.cwd(), "assets/Montserrat-Bold.ttf")),
			readFile(join(process.cwd(), "assets/Montserrat-Regular.ttf")),
		])
		return [
			{ name: "Montserrat", data: regular, weight: 400 as const, style: "normal" as const },
			{ name: "Montserrat", data: bold, weight: 700 as const, style: "normal" as const },
		]
	} catch {
		return []
	}
}

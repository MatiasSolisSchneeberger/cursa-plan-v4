import type { Metadata } from "next"
import type { ContentFrontmatter } from "@/types/content"
import * as acercaDe from "@/content/acerca-de.mdx"
import * as avisosLegales from "@/content/avisos-legales.mdx"
import * as errores from "@/content/errores.mdx"
import * as politicaDePrivacidad from "@/content/politica-de-privacidad.mdx"
import * as preguntasFrecuentes from "@/content/preguntas-frecuentes.mdx"
import * as terminosYCondiciones from "@/content/terminos-y-condiciones.mdx"

export const contenido = {
	"acerca-de": acercaDe,
	"avisos-legales": avisosLegales,
	"errores": errores,
	"politica-de-privacidad": politicaDePrivacidad,
	"preguntas-frecuentes": preguntasFrecuentes,
	"terminos-y-condiciones": terminosYCondiciones,
}

export type ContenidoSlug = keyof typeof contenido

export function esContenidoSlug(slug: string): slug is ContenidoSlug {
	return slug in contenido
}

export function buildContentMetadata({ title, description }: ContentFrontmatter): Metadata {
	return {
		title: `${title} | CursaPlan`,
		description,
		openGraph: {
			title,
			description,
			type: "article",
		},
	}
}

export function formatearFechaActualizacion(iso: string): string {
	const fecha = new Date(iso + "T00:00:00Z")
	return fecha.toLocaleDateString("es-AR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

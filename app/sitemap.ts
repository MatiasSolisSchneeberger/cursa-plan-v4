import type { MetadataRoute } from "next"
import { getCarreras, getMateriasPlanSearchData, getAniosCalendario } from "@/lib/carreras"
import { contenido } from "@/lib/contenido"
import { rutaPlan, rutaMateria } from "@/lib/rutas"
import { siteUrl, urlAbsoluta } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const urls: MetadataRoute.Sitemap = []

	urls.push({
		url: siteUrl,
		changeFrequency: "yearly",
		priority: 1,
	})

	urls.push({
		url: urlAbsoluta("/carreras"),
		changeFrequency: "monthly",
		priority: 0.9,
	})

	urls.push({
		url: urlAbsoluta("/calendario"),
		changeFrequency: "monthly",
		priority: 0.7,
	})

	urls.push({
		url: urlAbsoluta("/novedades"),
		changeFrequency: "weekly",
		priority: 0.3,
	})

	urls.push({
		url: urlAbsoluta("/mesas-examenes"),
		changeFrequency: "weekly",
		priority: 0.3,
	})

	try {
		const carreras = await getCarreras()

		for (const carrera of carreras) {
			if (!carrera.planes) continue
			for (const plan of carrera.planes) {
				const planPath = rutaPlan(carrera.slug, plan.anio_inicio)
				urls.push({
					url: urlAbsoluta(planPath),
					changeFrequency: "monthly",
					priority: 0.8,
				})
			}
		}
	} catch (e) {
		console.error("Error al cargar planes para sitemap:", e)
	}

	try {
		const anios = await getAniosCalendario()
		for (const anio of anios) {
			urls.push({
				url: urlAbsoluta(`/calendario/${anio}`),
				changeFrequency: "monthly",
				priority: 0.3,
			})
		}
	} catch (e) {
		console.error("Error al cargar años de calendario para sitemap:", e)
	}

	try {
		const { materias } = await getMateriasPlanSearchData()

		const materiasUnicas = new Map<string, boolean>()
		for (const materia of materias) {
			const key = `${materia.carreraSlug}-${materia.planAnio}-${materia.materiaSlug}`
			if (!materiasUnicas.has(key)) {
				materiasUnicas.set(key, true)
				const materiaPath = rutaMateria(materia.carreraSlug, materia.planAnio, materia.materiaSlug)
				urls.push({
					url: urlAbsoluta(materiaPath),
					changeFrequency: "monthly",
					priority: 0.6,
				})
			}
		}
	} catch (e) {
		console.error("Error al cargar materias para sitemap:", e)
	}

	for (const slug of Object.keys(contenido)) {
		urls.push({
			url: urlAbsoluta(`/${slug}`),
			changeFrequency: "yearly",
			priority: 0.4,
		})
	}

	return urls
}

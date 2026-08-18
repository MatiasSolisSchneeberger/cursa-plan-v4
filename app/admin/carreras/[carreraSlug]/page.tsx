import { notFound } from "next/navigation"
import { getAdminCarreraBySlug, getResolucionesCatalog } from "@/lib/carrerasAdmin"
import CarreraFormView from "@/sections/admin/carreras/CarreraFormView"

interface CarreraPageProps {
	params: Promise<{
		carreraSlug: string
	}>
}

export async function generateMetadata({ params }: CarreraPageProps) {
	const { carreraSlug } = await params
	const carrera = await getAdminCarreraBySlug(carreraSlug)
	if (!carrera) return { title: "Carrera no encontrada" }

	return {
		title: `Editar ${carrera.nombre}`,
		description: `Administrar planes de estudio y datos de ${carrera.nombre}.`,
	}
}

export default async function CarreraAdminDetailPage({ params }: CarreraPageProps) {
	const { carreraSlug } = await params
	const [carrera, resoluciones] = await Promise.all([
		getAdminCarreraBySlug(carreraSlug),
		getResolucionesCatalog(),
	])

	if (!carrera) {
		notFound()
	}

	return (
		<CarreraFormView
			isNew={false}
			initialData={carrera}
			initialResoluciones={resoluciones}
		/>
	)
}

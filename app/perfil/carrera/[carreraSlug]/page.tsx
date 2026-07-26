import { getCurrentUser } from "@/lib/auth"
import { getDatosPerfilCarrera } from "@/lib/carreras"
import { redirect, notFound } from "next/navigation"
import CarreraHeaderSection from "@/components/perfil/sections/CarreraHeaderSection"
import CarreraProgressSection from "@/components/perfil/sections/CarreraProgressSection"
import CarreraKpiSection from "@/components/perfil/sections/CarreraKpiSection"
import CarreraMateriasSection from "@/components/perfil/sections/CarreraMateriasSection"

interface PageProps {
	params: Promise<{
		carreraSlug: string
	}>
}

export async function generateMetadata({ params }: PageProps) {
	const { carreraSlug } = await params
	return {
		title: `Dashboard de Carrera | CursaPlan`,
		description: `Progreso y materias en cursada para la carrera ${carreraSlug}.`,
	}
}

export default async function CarreraDashboardPage({ params }: PageProps) {
	const { carreraSlug } = await params
	const userRes = await getCurrentUser()

	if (!userRes.success || !userRes.data?.user) {
		redirect(`/login?next=/perfil/carrera/${carreraSlug}`)
	}

	const carreraData = await getDatosPerfilCarrera(userRes.data.user.id, carreraSlug)

	if (!carreraData) {
		notFound()
	}

	const {
		carrera,
		planAnio,
		totalMaterias,
		aprobadas,
		cursando,
		regulares,
		restantes,
		porcentajeCompletado,
		porcentajeFaltante,
		materiasCursando,
	} = carreraData

	return (
		<div className="flex flex-col gap-8 pb-12">
			{/* HEADER DE CARRERA */}
			<CarreraHeaderSection carrera={carrera} planAnio={planAnio} />

			{/* PROGRESO PRINCIPAL */}
			<CarreraProgressSection
				aprobadas={aprobadas}
				totalMaterias={totalMaterias}
				restantes={restantes}
				porcentajeCompletado={porcentajeCompletado}
				porcentajeFaltante={porcentajeFaltante}
			/>

			{/* KPIS DE LA CARRERA */}
			<CarreraKpiSection
				aprobadas={aprobadas}
				cursando={cursando}
				regulares={regulares}
				restantes={restantes}
				porcentajeCompletado={porcentajeCompletado}
			/>

			{/* MATERIAS EN CURSADA */}
			<CarreraMateriasSection
				carreraNombre={carrera.nombre}
				carreraSlug={carrera.slug}
				planAnio={planAnio}
				materiasCursando={materiasCursando}
			/>
		</div>
	)
}

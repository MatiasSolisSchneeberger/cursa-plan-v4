import { getCurrentUser } from "@/lib/auth"
import { getDatosPerfilCarrera } from "@/lib/carreras"
import { redirect, notFound } from "next/navigation"
import CarreraHeaderSection from "@/sections/perfil/CarreraHeaderSection"
import CarreraProgressSection from "@/sections/perfil/CarreraProgressSection"
import CarreraKpiSection from "@/sections/perfil/CarreraKpiSection"
import CarreraMateriasSection from "@/sections/perfil/CarreraMateriasSection"
import { buildLoginUrl } from "@/utils/redirect"

interface PageProps {
	params: Promise<{
		carreraSlug: string
	}>
}

export async function generateMetadata({ params }: PageProps) {
	const { carreraSlug } = await params
	return {
		title: `Dashboard de Carrera`,
		description: `Progreso y materias en cursada para la carrera ${carreraSlug}.`,
	}
}

export default async function CarreraDashboardPage({ params }: PageProps) {
	const { carreraSlug } = await params
	const userRes = await getCurrentUser()

	if (!userRes.success || !userRes.data?.user) {
		redirect(buildLoginUrl(`/perfil/carrera/${carreraSlug}`))
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

	const userObj = userRes.data.user

	return (
		<div className="flex flex-col gap-8 pb-12">
			{/* HEADER DE CARRERA */}
			<CarreraHeaderSection
				carrera={carrera}
				planAnio={planAnio}
				user={{
					fullName: userObj.full_name,
					username: userObj.username,
					avatarUrl: userObj.avatar_url,
				}}
			/>

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

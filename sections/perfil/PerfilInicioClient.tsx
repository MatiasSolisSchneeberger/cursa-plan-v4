"use client"

import PerfilHeroSection from "@/sections/perfil/PerfilHeroSection"
import PerfilKpiSection from "@/sections/perfil/PerfilKpiSection"
import PerfilCarrerasSection from "@/sections/perfil/PerfilCarrerasSection"
import PerfilMateriasSection from "@/sections/perfil/PerfilMateriasSection"
import PerfilEstadisticasSection from "@/sections/perfil/PerfilEstadisticasSection"
import type { ResumenPerfilDashboard } from "@/types/consultas"

interface PerfilInicioClientProps {
	data: ResumenPerfilDashboard
}

export default function PerfilInicioClient({ data }: PerfilInicioClientProps) {
	const { usuario, carrerasFavoritas, materiasCursando, stats } = data

	return (
		<div className="flex flex-col gap-8 pb-12">
			{/* HERO SECTION */}
			<PerfilHeroSection usuario={usuario} />

			{/* KPI STATS SECTION */}
			<PerfilKpiSection stats={stats} />

			{/* CARRERAS FAVORITAS SECTION */}
			<PerfilCarrerasSection carrerasFavoritas={carrerasFavoritas} />

			{/* MATERIAS EN CURSADA SECTION */}
			<PerfilMateriasSection materiasCursando={materiasCursando} />

			{/* RESUMEN DE AVANCE Y ESTADÍSTICAS GENERALES SECTION */}
			<PerfilEstadisticasSection stats={stats} />
		</div>
	)
}

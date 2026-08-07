"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

interface DynamicSidebarProps {
	carreraSidebar: React.ReactNode
	materiaSidebar: React.ReactNode
}

export default function DynamicSidebar({ carreraSidebar, materiaSidebar }: DynamicSidebarProps) {
	const pathname = usePathname()
	const segments = pathname.split("/").filter(Boolean)

	// En la jerarquía de rutas /carreras/[carreraSlug]/[plan]/...:
	// - 3 segmentos (ej: /carreras/sistemas/2023) -> Vista del plan de carrera -> CarreraSidebar
	// - 4 o más segmentos (ej: /carreras/sistemas/2023/algebra) -> Vista de materia -> MateriaSidebar
	const isMateriaPage = segments.length > 3

	if (isMateriaPage) {
		return <>{materiaSidebar}</>
	}

	return <>{carreraSidebar}</>
}

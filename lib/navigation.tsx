import React from "react"
import {
	IconBook,
	IconBug,
	IconCalendar,
	IconDevicesQuestion,
	IconFile,
	IconFilePencil,
	IconHelp,
	IconHome,
	IconInfoCircle,
	IconMenu2,
	IconNews,
	IconUsers,
} from "@tabler/icons-react"
import Icon from "@/components/Icon"
import {Carrera} from "@/types/consultas"
import {getCarreras} from "./carreras"

export interface BaseLink {
	label: string
	icon?: React.ReactNode
	variant?: "default" | "destructive"
}

export interface Subtab extends BaseLink {
	href: string
	slug?: string
}

export type Links = (Subtab & {subtabs?: never}) | (BaseLink & {subtabs: Subtab[]; href?: string})

export async function getNavbarLinks(): Promise<Links[]> {
	const carreras = await getCarreras()

	return [
		{
			label: "Inicio",
			href: "/",
			icon: <IconHome className="text-primary size-4 shrink-0" />,
		},
		{
			label: "Carreras",
			href: "/carreras",
			subtabs: carreras.map((carrera: Carrera) => {
				const sortedPlanes = carrera.planes
					? [...carrera.planes].sort((a, b) => a.anio_inicio - b.anio_inicio)
					: []
				const lastPlan = sortedPlanes.length > 0 ? sortedPlanes[sortedPlanes.length - 1] : null
				const planParam = lastPlan ? lastPlan.anio_inicio : ""
				return {
					label: carrera.nombre,
					href: `/${carrera.slug}/${planParam}`,
					icon: <Icon icon={carrera.icon} className="text-primary size-4 shrink-0" />,
					slug: carrera.slug,
				}
			}),
			icon: <IconBook className="text-primary size-4 shrink-0" />,
		},
		{
			label: "Calendario",
			href: "/calendario",
			icon: <IconCalendar className="text-primary size-4 shrink-0" />,
		},
		{
			label: "Mesas de examenes",
			href: "/mesas-examenes",
			icon: <IconDevicesQuestion className="text-primary size-4 shrink-0" />,
		},
		{
			label: "Mas",
			subtabs: [
				{
					label: "Novedades",
					href: "/novedades",
					icon: <IconNews className="text-primary size-4 shrink-0" />,
				},
				{
					label: "Sobre Nosotros",
					href: "/sobre-nosotros",
					icon: <IconInfoCircle className="text-primary size-4 shrink-0" />,
				},
				{
					label: "Preguntas Frecuentes",
					href: "/preguntas-frecuentes",
					icon: <IconHelp className="text-primary size-4 shrink-0" />,
				},
				{
					label: "Contacto",
					href: "/contacto",
					icon: <IconUsers className="text-primary size-4 shrink-0" />,
				},
				{
					label: "Términos y Condiciones",
					href: "/terminos-y-condiciones",
					icon: <IconFile className="text-primary size-4 shrink-0" />,
				},
				{
					label: "Política de Privacidad",
					href: "/politica-de-privacidad",
					icon: <IconFilePencil className="text-primary size-4 shrink-0" />,
				},
				{
					label: "Reportar error",
					href: "/errores",
					icon: <IconBug className="text-destructive size-4 shrink-0" />,
				},
			],
			icon: <IconMenu2 className="text-primary size-4 shrink-0" />,
		},
	]
}

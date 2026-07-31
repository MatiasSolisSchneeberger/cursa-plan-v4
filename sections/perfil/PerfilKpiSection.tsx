"use client"

import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {IconBooks, IconCircleCheck, IconClock, IconHeart} from "@tabler/icons-react"

interface PerfilKpiSectionProps {
	stats: {
		totalCarrerasFav: number
		totalMateriasAprobadas: number
		totalMateriasCursando: number
		totalMateriasRegulares: number
	}
}

export default function PerfilKpiSection({stats}: PerfilKpiSectionProps) {
	const {totalMateriasCursando, totalMateriasAprobadas, totalMateriasRegulares, totalCarrerasFav} = stats

	const Kpis = [
		{
			id: "1",
			title: "Cursando",
			icon: <IconBooks className="size-4" />,
			value: totalMateriasCursando,
			description: "Materias activas",
			color: "info",
		},
		{
			id: "2",
			title: "Regulares",
			icon: <IconClock className="size-4" />,
			value: totalMateriasRegulares,
			description: "Listas para examinar",
			color: "warning",
		},
		{
			id: "3",
			title: "Aprobadas",
			icon: <IconCircleCheck className="size-4" />,
			value: totalMateriasAprobadas,
			description: "Materias completadas",
			color: "success",
		},
		{
			id: "4",
			title: "Favoritas",
			icon: <IconHeart className="size-4" />,
			value: totalCarrerasFav,
			description: "Carreras guardadas",
			color: "destructive",
		},
	]

	return (
		<section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{Kpis.map(({color, description, icon, id, title, value}) => {
				return (
					<Card key={id} className={cn(`transition-colors`, {
						"hover:border-info-border": color === "info",
						"hover:border-warning-border": color === "warning",
						"hover:border-success-border": color === "success",
						"hover:border-destructive-border": color === "destructive",
					})}>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								{title}
							</CardTitle>
							<span
								className={cn("size-8 rounded-lg flex items-center justify-center", {
									"bg-info-accent text-info": color === "info",
									"bg-warning-accent text-warning": color === "warning",
									"bg-success-accent text-success": color === "success",
									"bg-destructive-accent text-destructive": color === "destructive",
								})}
							>
								{icon}
							</span>
						</CardHeader>
						<CardContent>
							<p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
							<p className="text-xs text-muted-foreground mt-1">{description}</p>
						</CardContent>
					</Card>
				)
			})}
		</section>
	)
}

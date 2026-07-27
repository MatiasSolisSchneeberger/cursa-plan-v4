"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { IconCircleCheck, IconBooks, IconClock, IconTarget } from "@tabler/icons-react"

interface CarreraKpiSectionProps {
	aprobadas: number
	cursando: number
	regulares: number
	restantes: number
	porcentajeCompletado: number
}

export default function CarreraKpiSection({
	aprobadas,
	cursando,
	regulares,
	restantes,
	porcentajeCompletado,
}: CarreraKpiSectionProps) {
	return (
		<section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Aprobadas
					</CardTitle>
					<IconCircleCheck className="size-4 text-emerald-500" />
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold text-foreground">{aprobadas}</p>
					<p className="text-xs text-muted-foreground mt-1">{porcentajeCompletado}% del total</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Cursando
					</CardTitle>
					<IconBooks className="size-4 text-amber-500" />
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold text-foreground">{cursando}</p>
					<p className="text-xs text-muted-foreground mt-1">Materias activas</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Regulares
					</CardTitle>
					<IconClock className="size-4 text-blue-500" />
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold text-foreground">{regulares}</p>
					<p className="text-xs text-muted-foreground mt-1">Habilitadas para final</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Restantes
					</CardTitle>
					<IconTarget className="size-4 text-purple-500" />
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold text-foreground">{restantes}</p>
					<p className="text-xs text-muted-foreground mt-1">Por cursar/aprobar</p>
				</CardContent>
			</Card>
		</section>
	)
}

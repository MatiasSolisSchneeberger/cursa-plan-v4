"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { IconTarget } from "@tabler/icons-react"

interface CarreraProgressSectionProps {
	aprobadas: number
	totalMaterias: number
	restantes: number
	porcentajeCompletado: number
	porcentajeFaltante: number
}

export default function CarreraProgressSection({
	aprobadas,
	totalMaterias,
	restantes,
	porcentajeCompletado,
	porcentajeFaltante,
}: CarreraProgressSectionProps) {
	return (
		<section>
			<Card className="p-6 border-primary/30 bg-gradient-to-r from-primary/5 via-card to-card">
				<div className="flex flex-col gap-4">
					<header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<IconTarget className="size-5 text-primary" />
							<h2 className="text-lg font-bold text-foreground">Progreso de la Carrera</h2>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-2xl font-extrabold text-emerald-500">{porcentajeCompletado}%</span>
							<span className="text-xs text-muted-foreground">completado</span>
							<span className="text-muted-foreground font-light">•</span>
							<span className="text-sm font-semibold text-amber-500">{porcentajeFaltante}%</span>
							<span className="text-xs text-muted-foreground">faltante</span>
						</div>
					</header>

					<div className="flex flex-col gap-2">
						<Progress value={porcentajeCompletado} className="h-3 bg-secondary/80" indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-400" />
						<footer className="flex justify-between text-xs text-muted-foreground font-medium">
							<span>{aprobadas} materias aprobadas de {totalMaterias} totales</span>
							<span>Faltan {restantes} materias para finalizar</span>
						</footer>
					</div>
				</div>
			</Card>
		</section>
	)
}

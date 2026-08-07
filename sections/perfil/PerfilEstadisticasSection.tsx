"use client"

import { Card } from "@/components/ui/card"
import { IconSchool, IconCircleCheck, IconClock, IconBooks } from "@tabler/icons-react"

interface PerfilEstadisticasSectionProps {
	stats: {
		totalMateriasAprobadas: number
		totalMateriasCursando: number
		totalMateriasRegulares: number
	}
}

export default function PerfilEstadisticasSection({ stats }: PerfilEstadisticasSectionProps) {
	const { totalMateriasAprobadas, totalMateriasRegulares, totalMateriasCursando } = stats

	return (
		<section className="flex flex-col gap-4">
			<header className="flex items-center gap-2">
				<IconSchool className="size-5 text-primary" />
				<h2 className="text-xl font-bold tracking-tight text-foreground">Resumen General de Avance</h2>
			</header>

			<Card className="p-6 bg-card border border-border">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
					<article className="flex flex-col items-center text-center p-4">
						<span className="size-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-3">
							<IconCircleCheck className="size-6" />
						</span>
						<p className="text-3xl font-extrabold text-foreground">{totalMateriasAprobadas}</p>
						<p className="text-sm font-medium text-foreground mt-1">Materias Aprobadas</p>
						<p className="text-xs text-muted-foreground mt-1 max-w-xs">
							Materias promocionadas o con examen final aprobado exitosamente.
						</p>
					</article>

					<article className="flex flex-col items-center text-center p-4 pt-6 md:pt-4">
						<span className="size-12 rounded-full bg-info/10 text-info flex items-center justify-center mb-3">
							<IconClock className="size-6" />
						</span>
						<p className="text-3xl font-extrabold text-foreground">{totalMateriasRegulares}</p>
						<p className="text-sm font-medium text-foreground mt-1">Materias Regulares</p>
						<p className="text-xs text-muted-foreground mt-1 max-w-xs">
							Cursada finalizada con regularidad aprobada, habilitadas para rendir final.
						</p>
					</article>

					<article className="flex flex-col items-center text-center p-4 pt-6 md:pt-4">
						<span className="size-12 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-3">
							<IconBooks className="size-6" />
						</span>
						<p className="text-3xl font-extrabold text-foreground">{totalMateriasCursando}</p>
						<p className="text-sm font-medium text-foreground mt-1">Actualmente Cursando</p>
						<p className="text-xs text-muted-foreground mt-1 max-w-xs">
							Materias en desarrollo durante el cuatrimestre o período activo.
						</p>
					</article>
				</div>
			</Card>
		</section>
	)
}

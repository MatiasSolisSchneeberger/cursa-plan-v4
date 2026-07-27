"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
	IconBooks,
	IconCircleCheck,
	IconClock,
	IconHeart,
} from "@tabler/icons-react"

interface PerfilKpiSectionProps {
	stats: {
		totalCarrerasFav: number
		totalMateriasAprobadas: number
		totalMateriasCursando: number
		totalMateriasRegulares: number
	}
}

export default function PerfilKpiSection({ stats }: PerfilKpiSectionProps) {
	const {
		totalMateriasCursando,
		totalMateriasAprobadas,
		totalMateriasRegulares,
		totalCarrerasFav,
	} = stats

	return (
		<section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<Card className="hover:border-amber-500/50 transition-colors">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Cursando
					</CardTitle>
					<span className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
						<IconBooks className="size-4" />
					</span>
				</CardHeader>
				<CardContent>
					<p className="text-2xl sm:text-3xl font-bold text-foreground">
						{totalMateriasCursando}
					</p>
					<p className="text-xs text-muted-foreground mt-1">Materias activas</p>
				</CardContent>
			</Card>

			<Card className="hover:border-emerald-500/50 transition-colors">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Aprobadas
					</CardTitle>
					<span className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
						<IconCircleCheck className="size-4" />
					</span>
				</CardHeader>
				<CardContent>
					<p className="text-2xl sm:text-3xl font-bold text-foreground">
						{totalMateriasAprobadas}
					</p>
					<p className="text-xs text-muted-foreground mt-1">Materias completadas</p>
				</CardContent>
			</Card>

			<Card className="hover:border-blue-500/50 transition-colors">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Regulares
					</CardTitle>
					<span className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
						<IconClock className="size-4" />
					</span>
				</CardHeader>
				<CardContent>
					<p className="text-2xl sm:text-3xl font-bold text-foreground">
						{totalMateriasRegulares}
					</p>
					<p className="text-xs text-muted-foreground mt-1">Listas para examinar</p>
				</CardContent>
			</Card>

			<Card className="hover:border-rose-500/50 transition-colors">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Favoritas
					</CardTitle>
					<span className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
						<IconHeart className="size-4" />
					</span>
				</CardHeader>
				<CardContent>
					<p className="text-2xl sm:text-3xl font-bold text-foreground">
						{totalCarrerasFav}
					</p>
					<p className="text-xs text-muted-foreground mt-1">Carreras guardadas</p>
				</CardContent>
			</Card>
		</section>
	)
}

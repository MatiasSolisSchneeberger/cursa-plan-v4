"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import IconCarrera from "@/components/Icon"
import {
	IconHeart,
	IconBooks,
	IconClock,
	IconArrowUpRight,
} from "@tabler/icons-react"
import type { CarreraFavoritaConAvance } from "@/types/consultas"
import { cn } from "@/lib/utils"

interface PerfilCarrerasSectionProps {
	carrerasFavoritas: CarreraFavoritaConAvance[]
}

export default function PerfilCarrerasSection({ carrerasFavoritas }: PerfilCarrerasSectionProps) {
	return (
		<section className="flex flex-col gap-4">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconHeart className="size-5 text-destructive" />
					<h2 className="text-xl font-bold tracking-tight text-foreground">Carreras Favoritas</h2>
				</div>
				<Badge variant="outline" className="text-xs font-normal">
					{carrerasFavoritas.length} guardadas
				</Badge>
			</header>

			{carrerasFavoritas.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{carrerasFavoritas.map(({
						planFavId,
						anioInicio,
						carrera: { nombre, slug, icon },
						totalMaterias,
						aprobadas,
						cursando,
						regulares,
						porcentajeAvance,
					}) => (
						<article key={planFavId} className={cn("theme-" + slug)}>
							<Card className="flex flex-col justify-between hover:shadow-md transition-all h-full">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-center gap-3">
											<span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
												<IconCarrera icon={icon || "device-imac"} className="size-5" />
											</span>
											<div className="flex flex-col">
												<CardTitle className="text-base font-bold text-foreground line-clamp-1">
													{nombre}
												</CardTitle>
												<CardDescription className="text-xs">
													Plan {anioInicio}
												</CardDescription>
											</div>
										</div>
										<Badge variant="secondary" className="font-semibold text-xs shrink-0">
											{porcentajeAvance}%
										</Badge>
									</div>
								</CardHeader>

								<CardContent className="py-2 flex flex-col gap-3">
									<div className="flex flex-col gap-1.5">
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>Progreso global</span>
											<span className="font-medium text-foreground">
												{aprobadas} / {totalMaterias} aprobadas
											</span>
										</div>
										<Progress value={porcentajeAvance} className="h-2" indicatorClassName="bg-primary" />
									</div>

									<footer className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
										<span className="flex items-center gap-1">
											<IconBooks className="size-3.5 text-warning" />
											{cursando} en cursada
										</span>
										<span className="flex items-center gap-1">
											<IconClock className="size-3.5 text-info" />
											{regulares} regulares
										</span>
									</footer>
								</CardContent>

								<CardFooter className="pt-3 border-t border-border">
									<Button variant="outline" size="sm" className="w-full justify-between" render={
										<Link href={`/perfil/carrera/${slug}`}>
											<span>Ver Dashboard de Carrera</span>
											<IconArrowUpRight data-icon="inline-end" />
										</Link>
									} />
								</CardFooter>
							</Card>
						</article>
					))}
				</div>
			) : (
				<Card className="p-8 text-center flex flex-col items-center justify-center gap-3 bg-muted/30">
					<IconHeart className="size-10 text-muted-foreground/50" />
					<div className="flex flex-col gap-1">
						<h3 className="font-semibold text-foreground">No tienes carreras favoritas guardadas</h3>
						<p className="text-xs text-muted-foreground max-w-sm">
							Explora el catálogo de carreras y marca tus favoritas con la estrella para hacerles seguimiento desde aquí.
						</p>
					</div>
					<Button variant="outline" size="sm" className="mt-2" render={
						<Link href="/carreras">Explorar Carreras</Link>
					} />
				</Card>
			)}
		</section>
	)
}

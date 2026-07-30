"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import IconCarrera from "@/components/Icon"
import { IconBooks, IconChevronRight } from "@tabler/icons-react"
import type { MateriaCursando } from "@/types/consultas"
import { cn } from "@/lib/utils"

interface PerfilMateriasSectionProps {
	materiasCursando: MateriaCursando[]
}

export default function PerfilMateriasSection({ materiasCursando }: PerfilMateriasSectionProps) {
	return (
		<section className="flex flex-col gap-4">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconBooks className="size-5 text-amber-500" />
					<h2 className="text-xl font-bold tracking-tight text-foreground">Materias en Cursada</h2>
				</div>
				<Badge variant="outline" className="text-xs font-normal">
					{materiasCursando.length} materias
				</Badge>
			</header>

			{materiasCursando.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{materiasCursando.map(({
						idMateriaPlan,
						nombre,
						slug,
						carreraNombre,
						carreraSlug,
						carreraIcon,
						planAnio,
						anio,
						periodoNombre,
					}) => (
						<article key={idMateriaPlan} className={cn("theme-" + carreraSlug)}>
							<Card className="flex flex-col justify-between hover:border-amber-500/40 transition-all h-full">
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between gap-2">
										<Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
											Cursando actualmente
										</Badge>
										<span className="text-[10px] text-muted-foreground font-semibold">
											Año {anio}
										</span>
									</div>
									<CardTitle className="text-base font-bold text-foreground mt-2 line-clamp-2">
										{nombre}
									</CardTitle>
									<CardDescription className="text-xs flex items-center gap-1.5">
										<IconCarrera icon={carreraIcon} className="size-3.5 text-muted-foreground" />
										<span className="truncate">{carreraNombre}</span>
									</CardDescription>
								</CardHeader>

								{periodoNombre && (
									<CardContent className="py-1">
										<span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-md inline-block">
											{periodoNombre}
										</span>
									</CardContent>
								)}

								<CardFooter className="pt-3 border-t border-border">
									<Button variant="ghost" size="sm" className="w-full justify-between text-xs" render={
										<Link href={`/${carreraSlug}/${planAnio}/${slug}`}>
											<span>Ir a la Materia</span>
											<IconChevronRight data-icon="inline-end" />
										</Link>
									} />
								</CardFooter>
							</Card>
						</article>
					))}
				</div>
			) : (
				<Card className="p-8 text-center flex flex-col items-center justify-center gap-3 bg-muted/30">
					<IconBooks className="size-10 text-muted-foreground/50" />
					<div className="flex flex-col gap-1">
						<h3 className="font-semibold text-foreground">No estás cursando ninguna materia</h3>
						<p className="text-xs text-muted-foreground max-w-sm">
							Ingresa a cualquier plan de carrera y cambia el estado de tus materias a &quot;Cursando&quot; para verlas organizadas aquí.
						</p>
					</div>
				</Card>
			)}
		</section>
	)
}

"use client"

import Link from "next/link"
import {Card, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {IconBooks, IconChevronRight, IconBook} from "@tabler/icons-react"
import type {MateriaCursando} from "@/types/consultas"
import {cn} from "@/lib/utils"
import {rutaPlan, rutaMateria} from "@/lib/rutas"

interface CarreraMateriasSectionProps {
	carreraNombre: string
	carreraSlug: string
	planAnio: number
	materiasCursando: MateriaCursando[]
}

export default function CarreraMateriasSection({
	carreraNombre,
	carreraSlug,
	planAnio,
	materiasCursando,
}: CarreraMateriasSectionProps) {
	return (
		<section className="flex flex-col gap-4">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconBooks className="size-5 text-warning" />
					<h2 className="text-xl font-bold tracking-tight text-foreground">Materias en Cursada ({carreraNombre})</h2>
				</div>
				<Badge variant="outline" className="text-xs font-normal">
					{materiasCursando.length} materias
				</Badge>
			</header>

			{materiasCursando.length > 0 ?
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{materiasCursando.map(({idMateriaPlan, nombre, slug, anio, periodoNombre}) => (
						<article key={idMateriaPlan} className={cn("theme-" + carreraSlug)}>
							<Card className="flex flex-col justify-between hover:border-warning transition-all h-full">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/20">
											En cursada
										</Badge>
										<span className="text-xs font-semibold text-muted-foreground">Año {anio}</span>
									</div>
									<CardTitle className="text-base font-bold text-foreground mt-2 line-clamp-2">{nombre}</CardTitle>
									{periodoNombre && (
										<CardDescription className="text-xs text-muted-foreground mt-1">{periodoNombre}</CardDescription>
									)}
								</CardHeader>

								<CardFooter className="pt-3 border-t border-border">
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-between"
										render={
											<Link href={rutaMateria(carreraSlug, planAnio, slug)}>
												<span>Ver Ficha de Materia</span>
												<IconChevronRight data-icon="inline-end" />
											</Link>
										}
									/>
								</CardFooter>
							</Card>
						</article>
					))}
				</div>
			:	<Card className="p-8 text-center flex flex-col items-center justify-center gap-3 bg-muted/30">
					<IconBook className="size-10 text-muted-foreground/50" />
					<div className="flex flex-col gap-1">
						<h3 className="font-semibold text-foreground">No estás cursando ninguna materia de esta carrera</h3>
						<p className="text-xs text-muted-foreground max-w-sm">
							Ingresa al plan de estudios y marca tus materias como &quot;Cursando&quot; para verlas organizadas en este
							panel.
						</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="mt-2"
						render={<Link href={rutaPlan(carreraSlug, planAnio)}>Ir al Plan de Estudios</Link>}
					/>
				</Card>
			}
		</section>
	)
}

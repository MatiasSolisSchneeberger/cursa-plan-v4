import * as React from "react"
import Link from "next/link"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MateriaCorrelativas } from "./materia-correlativas"

import type { MateriaJSON } from "@/types/carrera"

interface MateriaCardProps {
	materia: MateriaJSON
	carreraSlug: string
	planIdOrYear: string | number
}

export function MateriaCard({ materia, carreraSlug, planIdOrYear }: MateriaCardProps) {
	// TODO: Lógica para calcular la disponibilidad y el estado real
	const disponibilidad = "Disponible" // Placeholder
	const estado = "No cursada" // Placeholder

	const isOptativa = materia.esOptativa
	const hasOrientacion = materia.orientacion !== null

	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-2">
						<CardTitle className="text-lg leading-tight">
							{materia.nombre}
						</CardTitle>
						<div className="flex flex-wrap gap-2">
							{isOptativa && (
								<Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
									Optativa {materia.nroOptativa ? `(${materia.nroOptativa})` : ""}
								</Badge>
							)}
							{hasOrientacion && (
								<Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
									{materia.orientacion?.nombre}
								</Badge>
							)}
						</div>
					</div>
					<Badge variant="default" className="shrink-0 bg-blue-500 hover:bg-blue-600">
						{disponibilidad}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex-1 space-y-4">
				<MateriaCorrelativas correlativas={materia.correlativas} />
				<div className="flex justify-start">
					<Button variant="outline" size="sm" className="w-full sm:w-auto">
						Estado: {estado}
					</Button>
				</div>
			</CardContent>
			<CardFooter className="pt-0">
				<Button render={<Link href={`/${carreraSlug}/${planIdOrYear}/${materia.slug}`} />} variant="ghost" className="w-full" size="sm">
					Ver más
				</Button>
			</CardFooter>
		</Card>
	)
}

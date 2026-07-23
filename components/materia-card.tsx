import * as React from "react"
import Link from "next/link"

import {Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {MateriaCorrelativas} from "./materia-correlativas"

import type {MateriaJSON} from "@/types/carrera"
import {IconCheck} from "@tabler/icons-react"

interface MateriaCardProps {
	materia: MateriaJSON
	carreraSlug: string
	planIdOrYear: string | number
}

export function MateriaCard({materia, carreraSlug, planIdOrYear}: MateriaCardProps) {
	// TODO: Lógica para calcular la disponibilidad y el estado real
	const disponibilidad = "Disponible" // Placeholder
	const estado = "No cursada" // Placeholder

	const isOptativa = materia.esOptativa
	const hasOrientacion = materia.orientacion !== null

	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="pb-3">
				<CardTitle className="text-lg leading-tight">{materia.nombre}</CardTitle>
				<div className="flex flex-wrap gap-2">
					{isOptativa && (
						<Badge variant="secondary">Optativa {materia.nroOptativa ? `#${materia.nroOptativa}` : ""}</Badge>
					)}
					{hasOrientacion && (
						<Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
							{materia.orientacion?.nombre}
						</Badge>
					)}
				</div>
				<CardAction>
					<Badge variant="default">
						<IconCheck />
						{disponibilidad}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="flex-1 space-y-4">
				<Button variant="outline" size="sm" className="w-full sm:w-auto">
					Estado: {estado}
				</Button>

				<MateriaCorrelativas correlativas={materia.correlativas} />
			</CardContent>
			<CardFooter>
				<Button
					render={<Link href={`/${carreraSlug}/${planIdOrYear}/${materia.slug}`} />}
					variant="default"
					className="w-full"
					size="sm">
					Ver más
				</Button>
			</CardFooter>
		</Card>
	)
}

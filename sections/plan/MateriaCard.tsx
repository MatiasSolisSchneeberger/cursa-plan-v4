import * as React from "react"
import Link from "next/link"

import {Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {MateriaEstadoSelect} from "@/components/MateriaEstadoSelect"
import {MateriaCorrelativas} from "@/sections/plan/MateriaCorrelativas"
import {getMateriaAvailability} from "@/utils/materiaUtils"

import type {MateriaJSON} from "@/types/carrera"
import type {EstadoMateria} from "@/types/materiaTypes"
import {
	IconCheck,
	IconLock,
	IconBook,
} from "@tabler/icons-react"

interface MateriaCardProps {
	materia: MateriaJSON
	carreraSlug: string
	planIdOrYear: string | number
	estado?: EstadoMateria
	onEstadoChange?: (idMateriaPlan: number, nuevoEstado: EstadoMateria) => void
	getEstado?: (idMateriaPlan: number) => string | undefined
}

export function MateriaCard({
	materia,
	carreraSlug,
	planIdOrYear,
	estado = "Sin cursar",
	onEstadoChange,
	getEstado = () => "Sin cursar",
}: MateriaCardProps) {
	const availability = getMateriaAvailability(materia.correlativas, getEstado)
	const {cursarSatisfied, rendirSatisfied, isBloqueado, isSoloCursar, isDesbloqueado} = availability

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
					{isBloqueado && (
						<Badge variant="outline" className="bg-destructive-foreground border-destructive-border text-destructive">
							<IconLock className="size-3.5" />
							<span>No disponible</span>
						</Badge>
					)}
					{isSoloCursar && (
						<Badge variant="outline" className="bg-warning-foreground border-warning-border text-warning">
							<IconBook className="size-3.5" />
							<span>Solo Cursar</span>
						</Badge>
					)}
					{isDesbloqueado && (
						<Badge variant="default" className="bg-success-foreground border-success-border text-success">
							<IconCheck className="size-3.5" />
							<span>Disponible</span>
						</Badge>
					)}
				</CardAction>
			</CardHeader>
			<CardContent className="flex-1 space-y-4">
				<div className="space-y-1.5">
					<span className="text-xs font-medium text-muted-foreground">Estado</span>
					<MateriaEstadoSelect
						value={estado}
						onValueChange={(val) => {
							if (onEstadoChange) {
								onEstadoChange(materia.idMateriaPlan, val)
							}
						}}
						disabledOptions={{
							"Cursando": !cursarSatisfied,
							"Regular": !cursarSatisfied,
							"Aprobado": !cursarSatisfied || !rendirSatisfied,
							"Libre": !cursarSatisfied,
						}}
					/>
				</div>

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

import * as React from "react"
import Link from "next/link"

import {Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {MateriaCorrelativas} from "./materia-correlativas"
import {getMateriaAvailability} from "@/utils/materiaUtils"

import type {MateriaJSON} from "@/types/carrera"
import type {EstadoMateria} from "@/types/materiaTypes"
import {IconCheck, IconLock, IconBook} from "@tabler/icons-react"

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
						<Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/10 gap-1 sm:gap-1.5">
							<IconLock className="size-3.5" />
							<span>No disponible</span>
						</Badge>
					)}
					{isSoloCursar && (
						<Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1 sm:gap-1.5">
							<IconBook className="size-3.5" />
							<span>Solo Cursar</span>
						</Badge>
					)}
					{isDesbloqueado && (
						<Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600/90 dark:bg-emerald-500 text-white gap-1 sm:gap-1.5">
							<IconCheck className="size-3.5" />
							<span>Disponible</span>
						</Badge>
					)}
				</CardAction>
			</CardHeader>
			<CardContent className="flex-1 space-y-4">
				<div className="space-y-1.5">
					<span className="text-xs font-medium text-muted-foreground">Estado</span>
					<Select
						value={estado}
						onValueChange={(val) => {
							if (val && onEstadoChange) {
								onEstadoChange(materia.idMateriaPlan, val as EstadoMateria)
							}
						}}>
						<SelectTrigger className="w-full sm:w-auto min-w-[140px] justify-between">
							<SelectValue placeholder="Sin cursar" />
						</SelectTrigger>
						<SelectContent align="start">
							<SelectItem value="Sin cursar">
								<span className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-slate-400" />
									Sin cursar
								</span>
							</SelectItem>
							<SelectItem value="Cursando" disabled={!cursarSatisfied}>
								<span className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-blue-500" />
									Cursando
								</span>
							</SelectItem>
							<SelectItem value="Regular" disabled={!cursarSatisfied}>
								<span className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-amber-500" />
									Regular
								</span>
							</SelectItem>
							<SelectItem value="Aprobado" disabled={!cursarSatisfied || !rendirSatisfied}>
								<span className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-emerald-500" />
									Aprobado
								</span>
							</SelectItem>
							<SelectItem value="Libre" disabled={!cursarSatisfied}>
								<span className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-rose-500" />
									Libre
								</span>
							</SelectItem>
						</SelectContent>
					</Select>
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

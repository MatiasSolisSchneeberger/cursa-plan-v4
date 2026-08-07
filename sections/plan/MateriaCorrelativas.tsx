import * as React from "react"
import {
	IconChevronRight,
	IconInfoCircle,
	IconCircleLetterA,
	IconCircleLetterR,
	IconChevronDown,
	IconGitBranch,
} from "@tabler/icons-react"

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription, ItemActions} from "@/components/ui/item"
import {Button} from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipTrigger, TooltipProvider} from "@/components/ui/tooltip"

import type {GrupoCorrelativa, Condicion, Requisito, RequisitoMateria} from "@/types/carrera"

interface MateriaCorrelativasProps {
	correlativas: GrupoCorrelativa[]
}

export function MateriaCorrelativas({correlativas}: MateriaCorrelativasProps) {
	const [isOpen, setIsOpen] = React.useState(false)

	// Separar por tipo de requerimiento
	const cursar = correlativas.find((c) => c.tipo === "cursar")
	const rendir = correlativas.find((c) => c.tipo === "rendir")

	const hasCursar = cursar && cursar.condiciones.length > 0
	const hasRendir = rendir && rendir.condiciones.length > 0

	const defaultTab = hasCursar ? "cursar" : "rendir"

	const renderCondiciones = (condiciones: Condicion[]) => {
		// Agrupar materias y otros requisitos
		const materias: {req: RequisitoMateria; condicionStr: string}[] = []
		const otros: Requisito[] = []

		condiciones.forEach((cond) => {
			if (cond.tipo === "materia") {
				cond.requisitos.forEach((req) => {
					if ("slug" in req) {
						materias.push({req: req as RequisitoMateria, condicionStr: cond.condicion || ""})
					}
				})
			} else {
				otros.push(...cond.requisitos)
			}
		})

		return (
			<ItemGroup className="mt-2">
				{materias.map((m, idx) => (
					<Item key={`mat-${idx}`} variant="outline">
						<ItemMedia variant="icon">
							{m.condicionStr === "aprobado" ?
								<IconCircleLetterA className="text-success" />
							:	<IconCircleLetterR className="text-warning" />}
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{m.req.nombre}</ItemTitle>
							<ItemDescription className="capitalize">{m.condicionStr}</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button variant="ghost" size="icon" className="size-8">
								<IconChevronRight className="size-4" />
								<span className="sr-only">Ir a {m.req.nombre}</span>
							</Button>
						</ItemActions>
					</Item>
				))}

				{otros.length > 0 && (
					<div className="mt-4">
						<div className="mb-2 flex items-center gap-2">
							<span className="text-sm font-semibold">Otros requisitos</span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<IconInfoCircle className="size-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs text-xs">
											Estos requisitos no se consideran para el cálculo automático de disponibilidad de las materias.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						{otros.map((req, idx) => {
							let texto = ""
							if ("porcentaje" in req) {
								texto = `${req.porcentaje}% de materias aprobadas`
							} else if ("nota" in req) {
								texto = req.nota || "Requisito especial"
							}

							return (
								<Item key={`otro-${idx}`} variant="muted">
									<ItemMedia variant="icon">
										<IconInfoCircle />
									</ItemMedia>
									<ItemContent>
										<ItemTitle className="text-muted-foreground">{texto}</ItemTitle>
									</ItemContent>
								</Item>
							)
						})}
					</div>
				)}
			</ItemGroup>
		)
	}

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger
				disabled={!hasCursar && !hasRendir}
				render={
					<Item variant="outline">
						<ItemMedia variant="icon" className="z-auto">
							<IconGitBranch />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Ver Correlativas</ItemTitle>
							{!hasCursar && !hasRendir && <ItemDescription>No tiene correlativas</ItemDescription>}
						</ItemContent>
						{!hasCursar && !hasRendir ? null : (
							<ItemActions>
								<IconChevronDown className={isOpen ? "rotate-180 transition-all" : "rotate-0"} />
							</ItemActions>
						)}
					</Item>
				}></CollapsibleTrigger>

			<CollapsibleContent className="space-y-4 mt-2">
				<Tabs defaultValue={defaultTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="cursar" disabled={!hasCursar}>
							Para cursar
						</TabsTrigger>
						<TabsTrigger value="rendir" disabled={!hasRendir}>
							Para rendir
						</TabsTrigger>
					</TabsList>
					<TabsContent value="cursar" className="pt-2">
						{hasCursar && renderCondiciones(cursar.condiciones)}
					</TabsContent>
					<TabsContent value="rendir" className="pt-2">
						{hasRendir && renderCondiciones(rendir.condiciones)}
					</TabsContent>
				</Tabs>
			</CollapsibleContent>
		</Collapsible>
	)
}

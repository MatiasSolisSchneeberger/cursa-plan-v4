"use client"

import * as React from "react"
import { MateriaCard } from "./materia-card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import type { DatosPlanCurricular, AnioJSON } from "@/types/consultas"

interface PlanViewProps {
	planData: DatosPlanCurricular
	carreraSlug: string
	planIdOrYear: string | number
}

export function PlanView({ planData, carreraSlug, planIdOrYear }: PlanViewProps) {
	// Estado para la orientación seleccionada. "all" por defecto.
	const [selectedOrientation, setSelectedOrientation] = React.useState<string>("all")

	// Verificar si un año específico contiene orientaciones
	const anioHasOrientaciones = (anio: AnioJSON) => {
		return anio.periodos.some((periodo) =>
			periodo.materiasPorOrientacion.some((grupo) => grupo.orientacion !== null)
		)
	}

	return (
		<div className="space-y-12">
			{planData.anios.map((anio) => {
				const hasOrientations = anioHasOrientaciones(anio)

				return (
					<section key={`anio-${anio.anio}`} className="space-y-6">
						{/* Encabezado del Año */}
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<h2 className="text-2xl font-bold tracking-tight">
								{anio.anio}º Año
							</h2>
							
							{/* Select de Orientaciones, solo visible si el año tiene orientaciones */}
							{hasOrientations && planData.listaOrientaciones.length > 0 && (
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
										Orientación:
									</span>
									<Select
										value={selectedOrientation}
										onValueChange={setSelectedOrientation}
									>
										<SelectTrigger className="w-[250px]">
											<SelectValue placeholder="Todas las orientaciones" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">Todas las orientaciones</SelectItem>
											{planData.listaOrientaciones.map((orientacion) => (
												<SelectItem key={orientacion.id} value={orientacion.id.toString()}>
													{orientacion.nombre}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}
						</div>

						{/* Periodos del Año */}
						<div className="space-y-8 pl-0 sm:pl-4">
							{anio.periodos.map((periodo) => (
								<div key={`periodo-${periodo.id}`} className="space-y-4">
									<h3 className="text-xl font-semibold border-b pb-2">
										{periodo.tipoPeriodo.nombre} {periodo.nroPeriodo}
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
										{periodo.materiasPorOrientacion.map((grupo) => {
											// Si el grupo es una orientación específica y no coincide con el filtro, lo omitimos
											if (
												grupo.orientacion !== null &&
												selectedOrientation !== "all" &&
												grupo.orientacion.id.toString() !== selectedOrientation
											) {
												return null
											}

											return grupo.materias.map((materia) => (
												<MateriaCard
													key={`materia-${materia.id}`}
													materia={materia}
													carreraSlug={carreraSlug}
													planIdOrYear={planIdOrYear}
												/>
											))
										})}
									</div>
								</div>
							))}
						</div>
					</section>
				)
			})}
		</div>
	)
}

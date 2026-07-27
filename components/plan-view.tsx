"use client"

import * as React from "react"
import {MateriaCard} from "./materia-card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {setEstadoMateria} from "@/lib/actions"
import type {DatosPlanCurricular, AnioJSON} from "@/types/consultas"
import type {EstadoMateria} from "@/types/materiaTypes"

interface PlanViewProps {
	planData: DatosPlanCurricular
	carreraSlug: string
	planIdOrYear: string | number
	initialAvances?: Record<number, EstadoMateria>
	userId?: string
}

export function PlanView({
	planData,
	carreraSlug,
	planIdOrYear,
	initialAvances = {},
	userId = "",
}: PlanViewProps) {
	// Estado para la orientación seleccionada. "all" por defecto.
	const [selectedOrientation, setSelectedOrientation] = React.useState<string>("all")
	const storageKey = `cursa_plan_avance_${planData.id}`

	// Mapa de estados de materias por idMateriaPlan
	const [estados, setEstados] = React.useState<Record<number, EstadoMateria>>(() => {
		return initialAvances
	})

	// Cargar avances guardados en localStorage o sincronizar con initialAvances
	React.useEffect(() => {
		try {
			const saved = localStorage.getItem(storageKey)
			if (saved) {
				const parsed = JSON.parse(saved) as Record<number, EstadoMateria>
				setEstados((prev) => ({...parsed, ...initialAvances, ...prev}))
			} else if (Object.keys(initialAvances).length > 0) {
				setEstados(initialAvances)
			}
		} catch (e) {
			console.error("Error al cargar avances desde localStorage:", e)
		}
	}, [initialAvances, storageKey])

	// Función para obtener el estado de una materia dado su idMateriaPlan
	const getEstado = React.useCallback(
		(idMateriaPlan: number): EstadoMateria => {
			return estados[idMateriaPlan] || "Sin cursar"
		},
		[estados]
	)

	// Manejador del cambio de estado de una materia
	const handleEstadoChange = React.useCallback(
		(idMateriaPlan: number, nuevoEstado: EstadoMateria) => {
			setEstados((prev) => {
				const updated = {...prev, [idMateriaPlan]: nuevoEstado}
				try {
					localStorage.setItem(storageKey, JSON.stringify(updated))
				} catch (e) {
					console.error("Error al guardar avances en localStorage:", e)
				}
				return updated
			})

			// Sincronizar en base de datos si el usuario está autenticado
			setEstadoMateria(userId, idMateriaPlan, nuevoEstado).catch((err) => {
				console.error("Error al guardar avance en la base de datos:", err)
			})
		},
		[storageKey, userId]
	)

	// Verificar si un año específico contiene orientaciones
	const anioHasOrientaciones = (anio: AnioJSON) => {
		return anio.periodos.some((periodo) => periodo.materiasPorOrientacion.some((grupo) => grupo.orientacion !== null))
	}

	return (
		<section className="space-y-12">
			{planData.anios.map((anio) => {
				const hasOrientations = anioHasOrientaciones(anio)

				return (
					<section key={`anio-${anio.anio}`} className="space-y-6">
						{/* Encabezado del Año */}
						<article className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<h2 className="text-2xl font-bold tracking-tight">{anio.anio}º Año</h2>

							{/* Select de Orientaciones, solo visible si el año tiene orientaciones */}
							{hasOrientations && planData.listaOrientaciones.length > 0 && (
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Orientación:</span>
									<Select value={selectedOrientation} onValueChange={(val) => setSelectedOrientation(val ?? "all")}>
										<SelectTrigger className="w-62.5">
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
						</article>

						{/* Periodos del Año */}
						<article className="space-y-8 pl-0 sm:pl-4">
							{anio.periodos.map(({id, materiasPorOrientacion, nroPeriodo, tipoPeriodo}) => {
								return (
									<div key={`periodo-${nroPeriodo}-${tipoPeriodo.id}`} className="space-y-4">
										<h3 className="text-xl font-semibold border-b pb-2">
											{nroPeriodo >= 1 && `${nroPeriodo}° `}
											{tipoPeriodo.nombre}
										</h3>

										<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
											{materiasPorOrientacion.map(({materias, orientacion}) => {
												// Si el grupo es una orientación específica y no coincide con el filtro, lo omitimos
												if (
													orientacion !== null &&
													selectedOrientation !== "all" &&
													orientacion.id.toString() !== selectedOrientation
												) {
													return null
												}

												return materias.map((materia) => (
													<MateriaCard
														key={`materia-${materia.id}`}
														materia={materia}
														carreraSlug={carreraSlug}
														planIdOrYear={planIdOrYear}
														estado={getEstado(materia.idMateriaPlan)}
														onEstadoChange={handleEstadoChange}
														getEstado={getEstado}
													/>
												))
											})}
										</div>
									</div>
								)
							})}
						</article>
					</section>
				)
			})}
		</section>
	)
}

"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { IconBox } from "@/components/ui/icon-box"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconSearch, IconBook, IconCalendarEvent, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import FechaExamenModal from "@/sections/admin/fechas-examenes/FechaExamenModal"
import type { DatosPlanillaFechas, MateriaPlanillaRow, FechaExamenItem, TurnoInfo } from "@/lib/fechasExamenesAdmin"

interface FechasExamenesTableProps {
	data: DatosPlanillaFechas
}

function formatDateDisplay(fechaStr: string): string {
	if (!fechaStr) return ""
	const parts = fechaStr.split("-")
	if (parts.length === 3) {
		const [year, month, day] = parts
		return `${day}/${month}/${year}`
	}
	return fechaStr
}

const PAGE_SIZE = 10

export default function FechasExamenesTable({ data }: FechasExamenesTableProps) {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedCell, setSelectedCell] = useState<{
		materia: MateriaPlanillaRow
		turno: TurnoInfo
		fechaItem: FechaExamenItem | null
	} | null>(null)

	// Identificar nombres de materias duplicadas (que aparecen 2 o más veces)
	const duplicateNamesSet = useMemo(() => {
		const counts = new Map<string, number>()
		data.rows.forEach((row) => {
			const normName = row.materiaNombre.toLowerCase().trim()
			counts.set(normName, (counts.get(normName) || 0) + 1)
		})

		const duplicates = new Set<string>()
		counts.forEach((count, normName) => {
			if (count >= 2) {
				duplicates.add(normName)
			}
		})
		return duplicates
	}, [data.rows])

	// Filtrar materias por término de búsqueda
	const filteredRows = useMemo(() => {
		if (!searchQuery.trim()) return data.rows

		const query = searchQuery.toLowerCase().trim()
		return data.rows.filter((row) => {
			const nameMatch = row.materiaNombre.toLowerCase().includes(query)
			const careerMatch = row.carreras.some(
				(c) => c.nombre.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query)
			)
			return nameMatch || careerMatch
		})
	}, [data.rows, searchQuery])

	// Resetear a la página 1 cuando cambia la búsqueda
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
		setCurrentPage(1)
	}

	// Paginación
	const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE) || 1

	const paginatedRows = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE
		return filteredRows.slice(start, start + PAGE_SIZE)
	}, [filteredRows, currentPage])

	// Stats
	const totalMaterias = data.rows.length
	const materiasConFechas = useMemo(() => {
		return data.rows.filter((row) =>
			Object.values(row.fechasByTurno).some((item) => item !== null && !!item.fecha)
		).length
	}, [data.rows])

	return (
		<div className="space-y-6">
			{/* STATS & SEARCH BAR */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<IconBox>
						<IconCalendarEvent />
					</IconBox>
					<div>
						<h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
							Planilla de Fechas de Exámenes
						</h1>
						<p className="text-xs text-muted-foreground">
							{totalMaterias} materias registradas • {materiasConFechas} con fechas asignadas
						</p>
					</div>
				</div>

				<div className="relative w-full sm:w-72">
					<IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Buscar materia o carrera..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="pl-9 text-xs"
					/>
				</div>
			</div>

			{/* TABLE CARD */}
			<Card className="border border-border shadow-xs overflow-hidden">
				<CardContent className="p-0">
					<div className="relative w-full overflow-x-auto">
						<Table className="w-full text-xs border-collapse">
							<TableHeader className="sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border shadow-xs">
								<TableRow className="hover:bg-transparent border-b border-border">
									{/* ESQUINA SUPERIOR IZQUIERDA: MATERIA */}
									<TableHead className="min-w-[220px] font-semibold text-foreground py-3 pl-4 sticky left-0 top-0 z-30 bg-muted border-r border-b border-border shadow-[4px_0_10px_-2px_rgba(0,0,0,0.08)]">
										Materia
									</TableHead>
									<TableHead className="min-w-[160px] font-semibold text-foreground py-3 border-r border-border">
										Carrera(s)
									</TableHead>
									{data.turnos.map((turno) => (
										<TableHead
											key={turno.numero}
											className="min-w-[110px] text-center font-semibold text-foreground py-3 border-r border-border border-dashed last:border-r-0">
											<div className="flex flex-col items-center gap-0.5">
												<span className="font-bold text-xs">{turno.numero}° Turno</span>
												{turno.fechaInicio && turno.fechaFin && (
													<span className="text-[10px] font-normal text-muted-foreground">
														{formatDateDisplay(turno.fechaInicio).slice(0, 5)} - {formatDateDisplay(turno.fechaFin).slice(0, 5)}
													</span>
												)}
											</div>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedRows.length === 0 ? (
									<TableRow>
										<TableCell colSpan={2 + data.turnos.length} className="h-32 text-center text-muted-foreground">
											<div className="flex flex-col items-center justify-center gap-2">
												<IconBook className="size-8 text-muted-foreground/50" />
												<span>No se encontraron materias que coincidan con la búsqueda.</span>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedRows.map((row) => {
										const isDuplicateName = duplicateNamesSet.has(row.materiaNombre.toLowerCase().trim())

										return (
											<TableRow key={row.materiaId} className="hover:bg-muted/30 transition-colors">
												{/* COLUMNA MATERIA (STICKY A LA IZQUIERDA CON SOMBRA) */}
												<TableCell className="font-medium text-foreground py-2.5 pl-4 sticky left-0 z-10 bg-card border-r border-border shadow-[4px_0_10px_-2px_rgba(0,0,0,0.08)]">
													<div className="flex flex-col min-w-0">
														<span className="font-semibold truncate">{row.materiaNombre}</span>
														<span className="text-[10px] text-muted-foreground truncate">{row.materiaSlug}</span>
													</div>
												</TableCell>

												{/* COLUMNA CARRERAS (SOLO SI ES DUPLICADA / MISMO NOMBRE) */}
												<TableCell className="py-2.5 border-r border-border">
													{isDuplicateName && row.carreras.length > 0 ? (
														<div className="flex flex-col items-start gap-1">
															{row.carreras.map((c) => (
																<Badge
																	key={c.id}
																	variant="secondary"
																	className="text-[10px] py-0 px-1.5 font-normal leading-tight">
																	{c.nombre}
																</Badge>
															))}
														</div>
													) : null}
												</TableCell>

												{/* COLUMNAS TURNOS 1 AL 10 */}
												{data.turnos.map((turno) => {
													const fechaItem = row.fechasByTurno[turno.numero]
													const hasDate = !!fechaItem?.fecha

													return (
														<TableCell
															key={turno.numero}
															onClick={() => setSelectedCell({ materia: row, turno, fechaItem })}
															className="text-center py-2 border-r border-border border-dashed last:border-r-0 cursor-pointer hover:bg-primary/5 transition-colors group">
															{hasDate ? (
																<div className="inline-flex flex-col items-center justify-center px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/15 transition-all">
																	<span className="font-semibold text-xs tracking-tight">
																		{formatDateDisplay(fechaItem.fecha)}
																	</span>
																	{fechaItem.resolucionNombre && (
																		<span className="text-[9px] text-muted-foreground truncate max-w-[80px]">
																			{fechaItem.resolucionNombre}
																		</span>
																	)}
																</div>
															) : (
																<span className="text-muted-foreground/40 group-hover:text-primary group-hover:font-medium text-xs">
																	+
																</span>
															)}
														</TableCell>
													)
												})}
											</TableRow>
										)
									})
								)}
							</TableBody>
						</Table>
					</div>

					{/* CONTROLES DE PAGINACION DE A 20 MATERIAS */}
					{filteredRows.length > 0 && (
						<div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border bg-muted/20 text-xs">
							<span className="text-muted-foreground">
								Mostrando materias{" "}
								<strong className="text-foreground font-semibold">
									{(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredRows.length)}
								</strong>{" "}
								de <strong className="text-foreground font-semibold">{filteredRows.length}</strong>
							</span>

							<div className="flex items-center gap-1.5">
								<Button
									variant="outline"
									size="sm"
									disabled={currentPage === 1}
									onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
									className="h-8 text-xs gap-1">
									<IconChevronLeft className="size-4" />
									Anterior
								</Button>

								<span className="px-3 font-semibold text-xs text-foreground">
									Página {currentPage} de {totalPages}
								</span>

								<Button
									variant="outline"
									size="sm"
									disabled={currentPage >= totalPages}
									onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
									className="h-8 text-xs gap-1">
									Siguiente
									<IconChevronRight className="size-4" />
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* MODAL DE EDICION DE FECHA Y RESOLUCION */}
			<FechaExamenModal
				isOpen={!!selectedCell}
				onClose={() => setSelectedCell(null)}
				materia={selectedCell?.materia || null}
				turno={selectedCell?.turno || null}
				fechaItem={selectedCell?.fechaItem || null}
				resolucionesList={data.resoluciones || []}
				onSuccess={() => {
					router.refresh()
				}}
			/>
		</div>
	)
}

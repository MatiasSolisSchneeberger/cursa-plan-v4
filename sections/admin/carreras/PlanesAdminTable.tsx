"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconPlus, IconBooks, IconEdit, IconCalendar, IconAlertCircle } from "@tabler/icons-react"
import type { PlanAdminSummary } from "@/lib/carrerasAdmin"

interface PlanesAdminTableProps {
	planes: PlanAdminSummary[]
	carreraSlug?: string
	isNew: boolean
}

export default function PlanesAdminTable({
	planes,
	carreraSlug,
	isNew,
}: PlanesAdminTableProps) {
	const router = useRouter()

	const handleCreatePlanRedirect = () => {
		if (isNew) return
		router.push(`/admin/carreras/${carreraSlug}/nuevo-plan`)
	}

	return (
		<Card className="border border-border bg-card shadow-xs">
			<CardHeader className="pb-4">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
						<IconBooks className="size-5" />
					</div>
					<div>
						<CardTitle className="text-sm font-bold tracking-tight text-foreground">
							Planes de Estudio
						</CardTitle>
						<CardDescription className="text-[11px] text-muted-foreground">
							Planes de estudio y mallas curriculares asociadas a esta carrera
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0 overflow-x-auto">
				<Table className="w-full text-xs border-collapse">
					<TableHeader className="bg-muted/40 border-b border-border">
						<TableRow className="hover:bg-transparent border-b border-border">
							<TableHead className="w-40 font-semibold text-foreground py-3 pl-6">Año Inicio</TableHead>
							<TableHead className="w-40 font-semibold text-foreground py-3">Año Fin</TableHead>
							<TableHead className="min-w-40 font-semibold text-foreground py-3">Materias</TableHead>
							<TableHead className="w-28 text-right font-semibold text-foreground py-3 pr-6">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{planes.length > 0 &&
							planes.map(({ id, anio_inicio, anio_fin, materiasCount }) => (
								<TableRow
									key={id}
									className="hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/50"
									onClick={() => router.push(`/admin/carreras/${carreraSlug}/planes/${anio_inicio}`)}
								>
									<TableCell className="py-3.5 pl-6 font-medium text-foreground">
										<div className="flex items-center gap-2">
											<IconCalendar className="size-4 text-muted-foreground" />
											<span className="font-bold">{anio_inicio}</span>
										</div>
									</TableCell>
									<TableCell className="py-3.5 text-muted-foreground">
										{anio_fin ? (
											<span className="font-medium text-foreground">{anio_fin}</span>
										) : (
											<Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-none font-medium text-[10px]">
												Vigente
											</Badge>
										)}
									</TableCell>
									<TableCell className="py-3.5">
										<Badge variant="outline" className="text-muted-foreground text-[10px]">
											{materiasCount} {materiasCount === 1 ? "Materia" : "Materias"}
										</Badge>
									</TableCell>
									<TableCell className="py-3.5 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
										<div className="flex items-center justify-end gap-1.5">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => router.push(`/admin/carreras/${carreraSlug}/planes/${anio_inicio}`)}
												className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted"
											>
												<IconEdit className="size-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}

						{/* FILA INTERACTIVA PARA CREAR PLAN */}
						<TableRow
							className={`border-b-0 ${
								isNew
									? "opacity-60 cursor-not-allowed bg-muted/5"
									: "hover:bg-muted/20 cursor-pointer"
							}`}
							onClick={handleCreatePlanRedirect}
						>
							<TableCell colSpan={4} className="p-0">
								{isNew ? (
									<div className="flex items-center justify-center py-4 px-6 gap-2 text-xs text-muted-foreground border-2 border-dashed border-border m-3 rounded-lg bg-muted/10">
										<IconAlertCircle className="size-4 text-amber-500 shrink-0" />
										<span>Debes guardar la carrera antes de poder agregar planes de estudio.</span>
									</div>
								) : (
									<div className="flex items-center justify-center py-4 px-6 gap-1.5 text-xs font-bold text-primary border-2 border-dashed border-primary/20 hover:border-primary/40 m-3 rounded-lg transition-colors bg-primary/5">
										<IconPlus className="size-4" />
										<span>Crear nuevo Plan de Estudio</span>
									</div>
								)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

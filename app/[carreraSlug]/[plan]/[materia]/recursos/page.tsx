import * as React from "react"
import Link from "next/link"
import { getMateriaDetalle } from "@/lib/carreras"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	IconFolder,
	IconDownload,
	IconArrowLeft,
	IconFileSpreadsheet,
	IconNotebook,
	IconFileCode,
	IconAlertCircle,
} from "@tabler/icons-react"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
		materia: string
	}>
}

export default async function RecursosPage({ params }: PageProps) {
	const resolvedParams = await params
	const { carreraSlug, plan, materia: materiaSlug } = resolvedParams

	// Obtener detalles de la materia
	const materia = await getMateriaDetalle(carreraSlug, plan, materiaSlug)

	// Recursos estáticos/hardcodeados iniciales
	const recursos = [
		{
			id: 1,
			titulo: "Trabajo Práctico N°1 - Vectores y Planos",
			fecha: "12 de Abril, 2024",
			tipo: "Trabajo Práctico",
			icono: <IconFileSpreadsheet className="size-5 text-green-500" />,
			badgeColor: "bg-green-500/10 text-green-600 dark:text-green-400"
		},
		{
			id: 2,
			titulo: "Primer Parcial - Tema A (Resuelto)",
			fecha: "18 de Mayo, 2024",
			tipo: "Examen Parcial",
			icono: <IconNotebook className="size-5 text-blue-500" />,
			badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
		},
		{
			id: 3,
			titulo: "Trabajo Práctico N°2 - Sistemas de Ecuaciones",
			fecha: "05 de Junio, 2024",
			tipo: "Trabajo Práctico",
			icono: <IconFileSpreadsheet className="size-5 text-green-500" />,
			badgeColor: "bg-green-500/10 text-green-600 dark:text-green-400"
		},
		{
			id: 4,
			titulo: "Examen Final - Diciembre 2023",
			fecha: "15 de Diciembre, 2023",
			tipo: "Examen Final",
			icono: <IconNotebook className="size-5 text-amber-500" />,
			badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
		},
		{
			id: 5,
			titulo: "Apunte Teórico Completo - Autovalores y Autovectores",
			fecha: "02 de Julio, 2024",
			tipo: "Apunte",
			icono: <IconFileCode className="size-5 text-purple-500" />,
			badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
		}
	]

	return (
		<section className="flex flex-col gap-6 py-6 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto w-full animate-in fade-in duration-200">
			{/* Botón Volver */}
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" render={<Link href={`/${carreraSlug}/${plan}/${materiaSlug}`} />}>
					<IconArrowLeft className="size-4 mr-1" />
					Volver a Información General
				</Button>
			</div>

			<div className="typeset flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recursos - {materia.nombre}</h1>
					<p className="text-muted-foreground">Trabajos prácticos, parciales, finales y apuntes compartidos.</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Lista de Recursos */}
				<div className="lg:col-span-2 flex flex-col gap-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-lg">Archivos Disponibles</CardTitle>
							<CardDescription>Material académico de apoyo para la asignatura.</CardDescription>
						</CardHeader>
						<CardContent>
							<ItemGroup className="gap-3">
								{recursos.map((rec) => (
									<Item key={rec.id} variant="outline" className="hover:bg-accent/40 transition-colors p-3">
										<ItemMedia>
											<div className="p-2 rounded-md bg-muted">
												{rec.icono}
											</div>
										</ItemMedia>
										<ItemContent>
											<div className="flex items-center gap-2 flex-wrap">
												<ItemTitle className="text-sm font-semibold">{rec.titulo}</ItemTitle>
												<Badge variant="outline" className={`text-[10px] font-semibold py-0.5 px-2 rounded-full border-none ${rec.badgeColor}`}>
													{rec.tipo}
												</Badge>
											</div>
											<ItemDescription className="text-xs mt-1">Subido: {rec.fecha}</ItemDescription>
										</ItemContent>
										<ItemActions>
											<Button variant="ghost" size="icon" className="size-9" title="Descargar archivo">
												<IconDownload className="size-4 text-primary" />
											</Button>
										</ItemActions>
									</Item>
								))}
							</ItemGroup>
						</CardContent>
					</Card>
				</div>

				{/* Panel de Información / Avisos */}
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<IconFolder className="size-5 text-primary" />
								<CardTitle className="text-base">Acerca de Recursos</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="text-xs text-muted-foreground leading-relaxed flex flex-col gap-4">
							<p>
								Esta sección centraliza los exámenes anteriores, guías prácticas y notas teóricas provistas por otros estudiantes y docentes.
							</p>
							<div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex gap-2 items-start">
								<IconAlertCircle className="size-4 shrink-0 mt-0.5" />
								<span>
									<strong>Nota:</strong> Próximamente podrás subir tus propios apuntes y parciales resueltos directamente desde este panel.
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	)
}

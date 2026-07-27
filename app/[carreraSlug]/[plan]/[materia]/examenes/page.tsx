import * as React from "react"
import Link from "next/link"
import { getMateriaDetalle } from "@/lib/carreras"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import {
	IconCalendar,
	IconCalendarOff,
	IconCalendarPlus,
	IconAlertCircle,
	IconArrowLeft,
} from "@tabler/icons-react"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
		materia: string
	}>
}

function getGoogleCalendarLink(materiaNombre: string, fechaStr: string) {
	const baseDate = new Date(fechaStr + "T00:00:00")
	const start = fechaStr.replace(/-/g, "")

	const endDate = new Date(baseDate)
	endDate.setDate(endDate.getDate() + 1)
	const year = endDate.getFullYear()
	const month = String(endDate.getMonth() + 1).padStart(2, "0")
	const day = String(endDate.getDate()).padStart(2, "0")
	const end = `${year}${month}${day}`

	const eventTitle = encodeURIComponent(`Mesa de Examen - ${materiaNombre}`)
	return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${start}/${end}&sf=true&output=xml`
}

export default async function ExamenesPage({ params }: PageProps) {
	const resolvedParams = await params
	const { carreraSlug, plan, materia: materiaSlug } = resolvedParams

	// Obtener detalles de la materia
	const materia = await getMateriaDetalle(carreraSlug, plan, materiaSlug)

	return (
		<section className="flex flex-col gap-6 py-6 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto w-full animate-in fade-in duration-200">
			{/* Botón Volver */}
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" render={<Link href={`/${carreraSlug}/${plan}/${materiaSlug}`} />}>
					<IconArrowLeft className="size-4 mr-1" />
					Volver a Información General
				</Button>
			</div>

			<div className="typeset">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Fechas de Exámenes - {materia.nombre}</h1>
				<p className="text-muted-foreground">Próximos llamados y mesas de examen final programadas.</p>
			</div>

			<div className="max-w-3xl">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Próximas Mesas</CardTitle>
						<CardDescription>Fechas estimadas o confirmadas de los llamados a examen final.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						{materia.fechasExamenes.length === 0 ? (
							<ItemGroup>
								<Item variant="muted" size="sm">
									<ItemMedia>
										<IconCalendarOff className="size-5 text-muted-foreground" />
									</ItemMedia>
									<ItemContent>
										<ItemTitle className="text-muted-foreground font-normal">
											No hay fechas de exámenes programadas en este momento.
										</ItemTitle>
									</ItemContent>
								</Item>
							</ItemGroup>
						) : (
							<ItemGroup className="gap-3">
								{materia.fechasExamenes.map((fecha, idx) => (
									<Item key={idx} variant="outline" className="hover:bg-accent/40 transition-colors">
										<ItemMedia>
											<IconCalendar className="size-5 text-primary" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>Llamado Mesa N° {idx + 1}</ItemTitle>
											<ItemDescription className="font-semibold text-foreground mt-0.5">
												{new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", {
													year: "numeric",
													month: "long",
													day: "numeric",
													weekday: "long"
												})}
											</ItemDescription>
										</ItemContent>
										<ItemActions>
											<Button
												variant="ghost"
												size="icon"
												className="size-9"
												render={
													<Link
														href={getGoogleCalendarLink(materia.nombre, fecha)}
														target="_blank"
														title="Agregar a Google Calendar"
													/>
												}>
												<IconCalendarPlus className="size-5 text-primary" />
											</Button>
										</ItemActions>
									</Item>
								))}
							</ItemGroup>
						)}

						{/* Aviso importante */}
						<div className="p-3.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-xs flex gap-2.5 items-start">
							<IconAlertCircle className="size-5 shrink-0 mt-0.5" />
							<span>
								<strong>Aviso importante:</strong> Revisa siempre la información oficial provista por el sistema de alumnado de tu institución,
								ya que estas fechas pueden cambiar de último momento.
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	)
}

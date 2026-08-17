import * as React from "react"
import Link from "next/link"
import {Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert"
import {Item, ItemContent, ItemMedia, ItemTitle, ItemActions} from "@/components/ui/item"
import {Button} from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {IconFileText, IconExternalLink, IconAlertCircle, IconAlertTriangle} from "@tabler/icons-react"
import { parseFechaLocal, getEstadoInscripcion } from "@/utils/diasHabiles"
import {GoogleCalendar} from "@/assets/google-calendar"

export interface ResolucionInfo {
	id?: number
	nombre?: string | null
	url?: string | null
}

interface ExamenCardProps {
	fecha: string
	materiaNombre: string
	mesaNumero: number
	esProxima: boolean
	/** "Hoy" normalizado a las 00:00 en hora argentina, calculado una vez en la página. */
	hoy: Date
	/** Fechas "YYYY-MM-DD" de feriados. Set porque este es un Server Component. */
	feriados: ReadonlySet<string>
	resolucion?: ResolucionInfo | null
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

export function ExamenCard({
	fecha,
	materiaNombre,
	mesaNumero,
	esProxima,
	hoy,
	feriados,
	resolucion,
}: ExamenCardProps) {
	const fechaExamen = parseFechaLocal(fecha)
	const { estado, fechaLimite, diasHabilesRestantes } = getEstadoInscripcion(fechaExamen, hoy, feriados)

	let badgeText = ""
	let badgeVariant: "secondary" | "destructive" | "warning" | "default" = "default"

	if (estado === "pasada") {
		badgeText = "pasada"
		badgeVariant = "secondary"
	} else if (estado === "cerrada") {
		badgeText = "inscripciones cerradas"
		badgeVariant = "destructive"
	} else if (esProxima) {
		badgeText = "próxima mesa"
		badgeVariant = estado === "por-cerrar" ? "warning" : "default"
	}

	const fechaLimiteFormateada = fechaLimite.toLocaleDateString("es-AR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	})

	const fechaFormateada = fechaExamen.toLocaleDateString("es-AR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long",
	})

	const resNombre = resolucion?.nombre || "Sin resolución"
	const hasUrl = Boolean(resolucion?.url && resolucion.url.trim().length > 0)

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="capitalize">{fechaFormateada}</CardTitle>
				<CardDescription>Mesa N° {mesaNumero}</CardDescription>
				{badgeText && (
					<CardAction>
						<Badge variant={badgeVariant}>{badgeText}</Badge>
					</CardAction>
				)}
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<Item variant="outline" size="xs">
					<ItemMedia variant="icon">
						<IconFileText />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>{resNombre}</ItemTitle>
					</ItemContent>
					<ItemActions>
						{hasUrl ? (
							<Button
								variant="ghost"
								size="sm"
								render={
									<Link
										href={resolucion!.url!}
										target="_blank"
										rel="noopener noreferrer"
										title="Ver resolución de la materia">
										Ver
										<IconExternalLink />
									</Link>
								}
							/>
						) : (
							<Tooltip>
								<TooltipTrigger
									render={
										<span tabIndex={0} className="inline-flex cursor-not-allowed">
											<Button variant="ghost" size="sm" disabled className="pointer-events-none">
												Ver
												<IconExternalLink />
											</Button>
										</span>
									}
								/>
								<TooltipContent side="top">
									No disponible. Si estás interesado, consultá en la facultad.
								</TooltipContent>
							</Tooltip>
						)}
					</ItemActions>
				</Item>

				{estado === "por-cerrar" && (
					<Alert variant="warning" className="py-2.5">
						<IconAlertTriangle className="size-4" />
						<AlertTitle className="text-xs font-semibold">Inscripción próxima a cerrar</AlertTitle>
						<AlertDescription className="text-xs">
							Podés inscribirte hasta el {fechaLimiteFormateada} (
							{diasHabilesRestantes === 1 ? "queda 1 día hábil" : `quedan ${diasHabilesRestantes} días hábiles`}).
						</AlertDescription>
					</Alert>
				)}

				{estado === "cerrada" && (
					<Alert variant="destructive" className="py-2.5">
						<IconAlertCircle className="size-4" />
						<AlertTitle className="text-xs font-semibold">Inscripciones cerradas</AlertTitle>
						<AlertDescription className="text-xs">
							La inscripción cerró el {fechaLimiteFormateada}.
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
			<CardFooter>
				<Button
					variant="outline"
					size="sm"
					className="w-full sm:w-auto"
					render={
						<Link
							href={getGoogleCalendarLink(materiaNombre, fecha)}
							target="_blank"
							title="Agregar a Google Calendar"
						/>
					}>
					<GoogleCalendar className="size-4" />
					Agendar en Google Calendar
				</Button>
			</CardFooter>
		</Card>
	)
}

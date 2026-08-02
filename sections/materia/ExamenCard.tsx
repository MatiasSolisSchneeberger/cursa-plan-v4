import * as React from "react"
import Link from "next/link"
import {Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert"
import {Item, ItemContent, ItemMedia, ItemTitle, ItemActions} from "@/components/ui/item"
import {Button} from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {IconFileText, IconExternalLink, IconAlertCircle, IconAlertTriangle} from "@tabler/icons-react"
import {parseLocalExamen, calcularDiasHabiles, calcularDiasCalendario} from "@/utils/fechaProxima"
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
	resolucion,
}: ExamenCardProps) {
	const hoy = new Date()
	const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
	const fechaExamen = parseLocalExamen(fecha)

	const esPasada = fechaExamen < hoyLocal
	const diasHabiles = calcularDiasHabiles(fechaExamen, hoyLocal)
	const diasCalendario = calcularDiasCalendario(fechaExamen, hoyLocal)

	let badgeText = ""
	let badgeVariant: "secondary" | "destructive" | "warning" | "default" = "default"

	if (esPasada) {
		badgeText = "pasada"
		badgeVariant = "secondary"
	} else if (diasHabiles <= 3) {
		badgeText = "inscripciones cerradas"
		badgeVariant = "destructive"
	} else if (esProxima) {
		badgeText = "próxima mesa"
		if (diasCalendario < 7) {
			badgeVariant = "warning"
		} else {
			badgeVariant = "default"
		}
	}

	const showWarningAlert = !esPasada && diasHabiles > 3 && diasCalendario <= 7
	const showDestructiveAlert = !esPasada && diasHabiles <= 3

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

				{showWarningAlert && (
					<Alert variant="warning" className="py-2.5">
						<IconAlertTriangle className="size-4" />
						<AlertTitle className="text-xs font-semibold">Inscripción próxima a cerrar</AlertTitle>
						<AlertDescription className="text-xs">
							Quedan pocos días para que cierren las inscripciones (quedan {diasCalendario}{" "}
							{diasCalendario === 1 ? "día" : "días"}).
						</AlertDescription>
					</Alert>
				)}

				{showDestructiveAlert && (
					<Alert variant="destructive" className="py-2.5">
						<IconAlertCircle className="size-4" />
						<AlertTitle className="text-xs font-semibold">Inscripciones cerradas</AlertTitle>
						<AlertDescription className="text-xs">Ya cerró las inscripciones.</AlertDescription>
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

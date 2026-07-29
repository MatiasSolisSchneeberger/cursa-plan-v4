import * as React from "react"
import Link from "next/link"
import {getMateriaDetalle} from "@/lib/carreras"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {ExamenCard} from "@/sections/materia/ExamenCard"
import {IconCalendarOff, IconAlertCircle, IconArrowLeft} from "@tabler/icons-react"
import {Alert, AlertAction, AlertDescription} from "@/components/ui/alert"
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
		materia: string
	}>
}

export default async function ExamenesPage({params}: PageProps) {
	const resolvedParams = await params
	const {carreraSlug, plan, materia: materiaSlug} = resolvedParams

	// Obtener detalles de la materia
	const materia = await getMateriaDetalle(carreraSlug, plan, materiaSlug)

	// Encontrar la fecha de examen más cercana hoy o en el futuro
	const hoy = new Date()
	const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())

	const fechasFuturas = (materia.fechasExamenes || [])
		.map((fecha) => ({fecha, parsed: new Date(fecha + "T00:00:00")}))
		.filter(({parsed}) => parsed >= hoyLocal)
		.sort(({parsed: a}, {parsed: b}) => a.getTime() - b.getTime())

	const proximaFechaStr = fechasFuturas[0]?.fecha || null

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

			<div className="flex flex-col gap-6">
				{/* Aviso importante */}
				<Item variant="outline" className="border-warning-border bg-warning-accent/30 max-w-3xl mx-auto">
					<ItemMedia variant="icon">
						<IconAlertCircle className="size-5 text-warning" />
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="text-warning">Aviso importante:</ItemTitle>
						<ItemDescription className="text-warning-accent-foreground">
							Revisa siempre la información oficial provista por el sistema de alumnado de tu institución, ya que estas
							fechas pueden cambiar de último momento.
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button variant="warning">Ver Pagina oficial</Button>
					</ItemActions>
				</Item>

				{materia.fechasExamenes.length === 0 ?
					<Card>
						<CardContent className="flex items-center gap-3 py-6">
							<IconCalendarOff className="size-5 text-muted-foreground" />
							<span className="text-muted-foreground">No hay fechas de exámenes programadas en este momento.</span>
						</CardContent>
					</Card>
				:	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
						{materia.fechasExamenes.map((fecha, idx) => (
							<ExamenCard
								key={idx}
								fecha={fecha}
								materiaNombre={materia.nombre}
								mesaNumero={idx + 1}
								esProxima={fecha === proximaFechaStr}
							/>
						))}
					</div>
				}
			</div>
		</section>
	)
}

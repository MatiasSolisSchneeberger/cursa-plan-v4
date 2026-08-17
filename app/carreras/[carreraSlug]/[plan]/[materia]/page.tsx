import * as React from "react"
import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { getMateriaDetalle } from "@/lib/carreras"
import { getCurrentUser } from "@/lib/auth"
import { rutaPlan, rutaMateria } from "@/lib/rutas"
import { MateriaEstadoSelector } from "@/sections/materia/MateriaEstadoSelector"
import { ExamenCard } from "@/sections/materia/ExamenCard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import {
	IconInfoCircle,
	IconCalendar,
	IconSchool,
	IconArrowLeft,
	IconCircleLetterA,
	IconCircleLetterR,
	IconChevronRight,
	IconAlertCircle,
	IconCalendarOff,
} from "@tabler/icons-react"
import type { EstadoMateria } from "@/types/materiaTypes"
import type { Condicion, Requisito, RequisitoMateria } from "@/types/carrera"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
		materia: string
	}>
}

function groupRequisitos(condiciones: Condicion[]) {
	const regulares: RequisitoMateria[] = []
	const aprobados: RequisitoMateria[] = []
	const otros: Requisito[] = []

	condiciones.forEach(({ tipo, condicion, requisitos }) => {
		if (tipo === "materia") {
			requisitos.forEach((req) => {
				if ("slug" in req) {
					if (condicion === "aprobado") {
						aprobados.push(req as RequisitoMateria)
					} else {
						regulares.push(req as RequisitoMateria)
					}
				}
			})
		} else {
			otros.push(...requisitos)
		}
	})

	return { regulares, aprobados, otros }
}

export default async function MateriaDetailPage({ params }: PageProps) {
	const resolvedParams = await params
	const { carreraSlug, plan, materia: materiaSlug } = resolvedParams

	// Obtener detalles de la materia
	const materia = await getMateriaDetalle(carreraSlug, plan, materiaSlug)

	// Obtener usuario autenticado y su estado actual para la materia
	const userRes = await getCurrentUser()
	const user = userRes.data?.user
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	let estadoActual: EstadoMateria = "Sin cursar"
	if (user) {
		const { data: avance } = await supabase
			.from("avances")
			.select("estado")
			.eq("user_id", user.id)
			.eq("materia_plan_id", materia.idMateriaPlan)
			.maybeSingle()

		if (avance) {
			estadoActual = avance.estado as EstadoMateria
		}
	}

	// Correlativas
	const correlativasCursar = materia.correlativas.find(({ tipo }) => tipo === "cursar")
	const correlativasRendir = materia.correlativas.find(({ tipo }) => tipo === "rendir")
	const cursarGroup = groupRequisitos(correlativasCursar?.condiciones || [])
	const rendirGroup = groupRequisitos(correlativasRendir?.condiciones || [])

	const hasCursarReqs =
		cursarGroup.aprobados.length > 0 || cursarGroup.regulares.length > 0 || cursarGroup.otros.length > 0
	const hasRendirReqs =
		rendirGroup.aprobados.length > 0 || rendirGroup.regulares.length > 0 || rendirGroup.otros.length > 0

	// Fechas de exámenes
	const hoy = new Date()
	const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())

	const fechasOrdenadas = (materia.fechasExamenes || [])
		.map(({ id, fecha, resolucion }) => ({
			id,
			fecha,
			resolucion,
			parsed: new Date(fecha + "T00:00:00"),
		}))
		.sort(({ parsed: a }, { parsed: b }) => a.getTime() - b.getTime())
		.map(({ id, fecha, resolucion, parsed }, index) => ({
			id,
			fecha,
			resolucion,
			parsed,
			mesaNumero: index + 1,
		}))

	const fechasProximas = fechasOrdenadas.filter(({ parsed }) => parsed >= hoyLocal)
	const fechasPasadas = fechasOrdenadas.filter(({ parsed }) => parsed < hoyLocal)
	const proximaFechaStr = fechasProximas[0]?.fecha || null

	return (
		<section className="flex flex-col gap-8 py-6 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto w-full animate-in fade-in duration-200">
			{/* Botón Volver */}
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" render={<Link href={rutaPlan(carreraSlug, plan)} />}>
					<IconArrowLeft className="size-4 mr-1" />
					Volver al Plan
				</Button>
			</div>

			{/* HERO CARD (Información General) */}
			<div id="informacion" className="scroll-mt-20">
				<Card>
					<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
						<div className="typeset">
							<h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{materia.nombre}</h1>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Estado:</span>
							<MateriaEstadoSelector
								materiaPlanId={materia.idMateriaPlan}
								initialEstado={estadoActual}
								isAuthenticated={Boolean(user?.id)}
							/>
						</div>
					</CardHeader>
					<CardContent className="text-muted-foreground">
						<div className="flex flex-row flex-wrap gap-3 *:flex-1 *:min-w-xs *:max-w-lg">
							<Item variant="outline" size="sm">
								<ItemMedia>
									<IconSchool className="size-5 text-primary" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Año</ItemTitle>
									<ItemDescription className="font-semibold text-foreground">{materia.anio}º Año</ItemDescription>
								</ItemContent>
							</Item>

							<Item variant="outline" size="sm">
								<ItemMedia>
									<IconCalendar className="size-5 text-primary" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Periodo</ItemTitle>
									<ItemDescription className="font-semibold text-foreground">
										{materia.periodo?.nombre ? `${materia.periodo.nombre} - ${materia.nroPeriodo}º Periodo` : `${materia.nroPeriodo}º Periodo`}
									</ItemDescription>
								</ItemContent>
							</Item>

							<Item variant="outline" size="sm">
								<ItemMedia>
									<IconInfoCircle className="size-5 text-primary" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Tipo</ItemTitle>
									<ItemDescription className="font-semibold text-foreground">
										{materia.esOptativa ?
											`Optativa ${materia.nroOptativa ? `#${materia.nroOptativa}` : ""}`
										:	"Obligatoria"}
									</ItemDescription>
								</ItemContent>
							</Item>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* SECCIÓN CORRELATIVAS */}
			<div id="correlativas" className="scroll-mt-20 flex flex-col gap-4">
				<div className="typeset">
					<h2 className="text-xl font-bold tracking-tight">Correlativas</h2>
					<p className="text-sm text-muted-foreground">Requisitos necesarios para cursar y rendir la asignatura.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Cursar */}
					<Card className="h-full">
						<CardHeader>
							<CardTitle className="text-lg">Correlativas para Cursar</CardTitle>
							<CardDescription>Materias y requisitos necesarios para poder cursar esta materia.</CardDescription>
						</CardHeader>
						<CardContent>
							{!hasCursarReqs ? (
								<ItemGroup>
									<Item variant="muted" size="sm">
										<ItemMedia>
											<IconCircleLetterA className="size-5 text-success" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle className="text-muted-foreground font-normal">
												No requiere correlativas para cursar.
											</ItemTitle>
										</ItemContent>
									</Item>
								</ItemGroup>
							) : (
								<ItemGroup className="gap-3">
									{cursarGroup.aprobados.map(({ id, slug, nombre }) => (
										<Item key={id} variant="outline" render={<Link href={rutaMateria(carreraSlug, plan, slug)} />}>
											<ItemMedia>
												<IconCircleLetterA className="size-5 text-success" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{nombre}</ItemTitle>
												<ItemDescription>Requisito: Aprobada</ItemDescription>
											</ItemContent>
											<ItemActions>
												<IconChevronRight className="size-4 text-muted-foreground" />
											</ItemActions>
										</Item>
									))}

									{cursarGroup.regulares.map(({ id, slug, nombre }) => (
										<Item key={id} variant="outline" render={<Link href={rutaMateria(carreraSlug, plan, slug)} />}>
											<ItemMedia>
												<IconCircleLetterR className="size-5 text-warning" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{nombre}</ItemTitle>
												<ItemDescription>Requisito: Regularizada</ItemDescription>
											</ItemContent>
											<ItemActions>
												<IconChevronRight className="size-4 text-muted-foreground" />
											</ItemActions>
										</Item>
									))}

									{cursarGroup.otros.map((req, idx) => {
										let text = "Requisito especial"
										if ("porcentaje" in req) {
											text = `${req.porcentaje}% de materias aprobadas`
										} else if ("nota" in req && req.nota) {
											text = req.nota
										}
										return (
											<Item key={idx} variant="muted">
												<ItemMedia>
													<IconInfoCircle className="size-5 text-info" />
												</ItemMedia>
												<ItemContent>
													<ItemTitle>{text}</ItemTitle>
												</ItemContent>
											</Item>
										)
									})}
								</ItemGroup>
							)}
						</CardContent>
					</Card>

					{/* Rendir */}
					<Card className="h-full">
						<CardHeader>
							<CardTitle className="text-lg">Correlativas para Rendir</CardTitle>
							<CardDescription>Materias y requisitos necesarios para poder rendir el examen final.</CardDescription>
						</CardHeader>
						<CardContent>
							{!hasRendirReqs ? (
								<ItemGroup>
									<Item variant="muted" size="sm">
										<ItemMedia>
											<IconCircleLetterA className="size-5 text-success" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle className="text-muted-foreground font-normal">
												No requiere correlativas para rendir.
											</ItemTitle>
										</ItemContent>
									</Item>
								</ItemGroup>
							) : (
								<ItemGroup className="gap-3">
									{rendirGroup.aprobados.map(({ id, slug, nombre }) => (
										<Item key={id} variant="outline" render={<Link href={rutaMateria(carreraSlug, plan, slug)} />}>
											<ItemMedia>
												<IconCircleLetterA className="size-5 text-success" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{nombre}</ItemTitle>
												<ItemDescription>Requisito: Aprobada</ItemDescription>
											</ItemContent>
											<ItemActions>
												<IconChevronRight className="size-4 text-muted-foreground" />
											</ItemActions>
										</Item>
									))}

									{rendirGroup.regulares.map(({ id, slug, nombre }) => (
										<Item key={id} variant="outline" render={<Link href={rutaMateria(carreraSlug, plan, slug)} />}>
											<ItemMedia>
												<IconCircleLetterR className="size-5 text-warning" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{nombre}</ItemTitle>
												<ItemDescription>Requisito: Regularizada</ItemDescription>
											</ItemContent>
											<ItemActions>
												<IconChevronRight className="size-4 text-muted-foreground" />
											</ItemActions>
										</Item>
									))}

									{rendirGroup.otros.map((req, idx) => {
										let text = "Requisito especial"
										if ("porcentaje" in req) {
											text = `${req.porcentaje}% de materias aprobadas`
										} else if ("nota" in req && req.nota) {
											text = req.nota
										}
										return (
											<Item key={idx} variant="muted">
												<ItemMedia>
													<IconInfoCircle className="size-5 text-info" />
												</ItemMedia>
												<ItemContent>
													<ItemTitle>{text}</ItemTitle>
												</ItemContent>
											</Item>
										)
									})}
								</ItemGroup>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* SECCIÓN MESAS DE EXÁMENES */}
			<div id="examenes" className="scroll-mt-20 flex flex-col gap-4">
				<div className="typeset">
					<h2 className="text-xl font-bold tracking-tight">Mesas de Exámenes</h2>
					<p className="text-sm text-muted-foreground">Próximos llamados y fechas programadas para rendir final.</p>
				</div>

				<div className="flex flex-col gap-6">
					<Item variant="outline" className="border-warning-border bg-warning-accent/30 max-w-3xl">
						<ItemMedia variant="icon">
							<IconAlertCircle className="size-5 text-warning" />
						</ItemMedia>
						<ItemContent>
							<ItemTitle className="text-warning">Aviso importante:</ItemTitle>
							<ItemDescription className="text-warning-accent-foreground">
								Revisá siempre la información oficial en el sistema de tu facultad, ya que las fechas pueden actualizarse.
							</ItemDescription>
						</ItemContent>
					</Item>

					{fechasOrdenadas.length === 0 ? (
						<Card>
							<CardContent className="flex items-center gap-3 py-6">
								<IconCalendarOff className="size-5 text-muted-foreground" />
								<span className="text-muted-foreground">No hay fechas de exámenes programadas en este momento.</span>
							</CardContent>
						</Card>
					) : (
						<div className="flex flex-col gap-8">
							{/* Próximas */}
							<div className="flex flex-col gap-4">
								<h3 className="text-base font-semibold tracking-tight">Próximas Mesas</h3>
								{fechasProximas.length === 0 ? (
									<Card>
										<CardContent className="flex items-center gap-3 py-6">
											<IconCalendarOff className="size-5 text-muted-foreground" />
											<span className="text-muted-foreground">No hay próximas fechas de exámenes programadas.</span>
										</CardContent>
									</Card>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
										{fechasProximas.map(({ fecha, resolucion, mesaNumero }) => (
											<ExamenCard
												key={fecha}
												fecha={fecha}
												materiaNombre={materia.nombre}
												mesaNumero={mesaNumero}
												esProxima={fecha === proximaFechaStr}
												resolucion={resolucion}
											/>
										))}
									</div>
								)}
							</div>

							{/* Pasadas */}
							{fechasPasadas.length > 0 && (
								<div className="flex flex-col gap-4 pt-4 border-t border-border">
									<div>
										<h3 className="text-base font-semibold tracking-tight text-muted-foreground">Mesas Anteriores</h3>
										<p className="text-xs text-muted-foreground">Fechas de exámenes pasadas.</p>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start opacity-80 hover:opacity-100 transition-opacity">
										{fechasPasadas.map(({ fecha, resolucion, mesaNumero }) => (
											<ExamenCard
												key={fecha}
												fecha={fecha}
												materiaNombre={materia.nombre}
												mesaNumero={mesaNumero}
												esProxima={false}
												resolucion={resolucion}
											/>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

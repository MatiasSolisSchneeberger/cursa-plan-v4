import * as React from "react"
import Link from "next/link"
import {cookies} from "next/headers"
import {createClient} from "@/utils/supabase/server"
import {getMateriaDetalle} from "@/lib/carreras"
import {MateriaEstadoSelector} from "@/components/materia-estado-selector"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription, ItemActions} from "@/components/ui/item"
import {
	IconCircleCheck,
	IconCircle,
	IconInfoCircle,
	IconFileText,
	IconCalendar,
	IconAlertCircle,
	IconSchool,
	IconChevronRight,
	IconCalendarOff,
	IconArrowLeft,
	IconCalendarPlus,
} from "@tabler/icons-react"
import {Button} from "@/components/ui/button"
import type {EstadoMateria} from "@/types/materiaTypes"
import type {Condicion, Requisito, RequisitoMateria} from "@/types/carrera"

// Constantes configurables
const RESOLUCION_MOCK = "Res. CD 142/18"
const RESOLUCIONES_URL = "https://example.com/resoluciones-academicas"

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

	condiciones.forEach((cond) => {
		if (cond.tipo === "materia") {
			cond.requisitos.forEach((req) => {
				if ("slug" in req) {
					if (cond.condicion === "aprobado") {
						aprobados.push(req as RequisitoMateria)
					} else {
						regulares.push(req as RequisitoMateria)
					}
				}
			})
		} else {
			otros.push(...cond.requisitos)
		}
	})

	return {regulares, aprobados, otros}
}

export default async function MateriaDetailPage({params}: PageProps) {
	const resolvedParams = await params
	const {carreraSlug, plan, materia: materiaSlug} = resolvedParams

	// Obtener detalles de la materia
	const materia = await getMateriaDetalle(carreraSlug, plan, materiaSlug)

	// Obtener usuario autenticado y su estado actual para la materia
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const {
		data: {user},
	} = await supabase.auth.getUser()

	let estadoActual: EstadoMateria = "Sin cursar"
	if (user) {
		const {data: avance} = await supabase
			.from("avances")
			.select("estado")
			.eq("user_id", user.id)
			.eq("materia_plan_id", materia.idMateriaPlan)
			.maybeSingle()

		if (avance) {
			estadoActual = avance.estado as EstadoMateria
		}
	}

	// Separar correlativas para cursar y rendir
	const correlativasCursar = materia.correlativas.find((c) => c.tipo === "cursar")
	const correlativasRendir = materia.correlativas.find((c) => c.tipo === "rendir")

	const cursarGroup = groupRequisitos(correlativasCursar?.condiciones || [])
	const rendirGroup = groupRequisitos(correlativasRendir?.condiciones || [])

	const hasCursarReqs =
		cursarGroup.aprobados.length > 0 || cursarGroup.regulares.length > 0 || cursarGroup.otros.length > 0
	const hasRendirReqs =
		rendirGroup.aprobados.length > 0 || rendirGroup.regulares.length > 0 || rendirGroup.otros.length > 0

	return (
		<section className="flex flex-col gap-6 py-6 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto w-full">
			{/* Botón Volver */}
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" render={<Link href={`/${carreraSlug}/${plan}`} />}>
					<IconArrowLeft className="size-4 mr-1" />
					Volver al Plan
				</Button>
			</div>

			{/* HERO CARD */}
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
							userId={user?.id}
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
									{materia.periodo?.nombre || `${materia.nroPeriodo}º Periodo`}
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

						<Item variant="muted" size="sm" className="opacity-90 border-dashed border-border">
							<ItemMedia>
								<IconFileText className="size-5 text-muted-foreground" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="text-muted-foreground">Resolución</ItemTitle>
								<ItemDescription className="font-semibold text-muted-foreground">{RESOLUCION_MOCK}</ItemDescription>
							</ItemContent>
						</Item>
					</div>
				</CardContent>
			</Card>

			{/* CORRELATIVAS & EXAMENES GRID */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* 1. Tarjeta Correlativas para Cursar */}
				<Card className="h-full">
					<CardHeader>
						<CardTitle className="text-lg">Correlativas para Cursar</CardTitle>
						<CardDescription>Materias y requisitos necesarios para poder cursar esta materia.</CardDescription>
					</CardHeader>
					<CardContent>
						{!hasCursarReqs ?
							<ItemGroup>
								<Item variant="muted" size="sm">
									<ItemMedia>
										<IconCircleCheck className="size-5 text-green-500" />
									</ItemMedia>
									<ItemContent>
										<ItemTitle className="text-muted-foreground font-normal">
											No requiere correlativas para cursar.
										</ItemTitle>
									</ItemContent>
								</Item>
							</ItemGroup>
						:	<ItemGroup className="gap-3">
								{/* Aprobadas */}
								{cursarGroup.aprobados.map((req) => (
									<Item key={req.id} variant="outline" render={<Link href={`/${carreraSlug}/${plan}/${req.slug}`} />}>
										<ItemMedia>
											<IconCircleCheck className="size-5 text-green-500" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>{req.nombre}</ItemTitle>
											<ItemDescription>Requisito: Aprobada</ItemDescription>
										</ItemContent>
										<ItemActions>
											<IconChevronRight className="size-4 text-muted-foreground" />
										</ItemActions>
									</Item>
								))}

								{/* Regulares */}
								{cursarGroup.regulares.map((req) => (
									<Item key={req.id} variant="outline" render={<Link href={`/${carreraSlug}/${plan}/${req.slug}`} />}>
										<ItemMedia>
											<IconCircle className="size-5 text-yellow-500" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>{req.nombre}</ItemTitle>
											<ItemDescription>Requisito: Regularizada</ItemDescription>
										</ItemContent>
										<ItemActions>
											<IconChevronRight className="size-4 text-muted-foreground" />
										</ItemActions>
									</Item>
								))}

								{/* Otros */}
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
												<IconInfoCircle className="size-5 text-blue-500" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{text}</ItemTitle>
											</ItemContent>
										</Item>
									)
								})}
							</ItemGroup>
						}
					</CardContent>
				</Card>

				{/* 2. Tarjeta Correlativas para Rendir */}
				<Card className="h-full">
					<CardHeader>
						<CardTitle className="text-lg">Correlativas para Rendir</CardTitle>
						<CardDescription>Materias y requisitos necesarios para poder rendir el examen final.</CardDescription>
					</CardHeader>
					<CardContent>
						{!hasRendirReqs ?
							<ItemGroup>
								<Item variant="muted" size="sm">
									<ItemMedia>
										<IconCircleCheck className="size-5 text-green-500" />
									</ItemMedia>
									<ItemContent>
										<ItemTitle className="text-muted-foreground font-normal">
											No requiere correlativas para rendir.
										</ItemTitle>
									</ItemContent>
								</Item>
							</ItemGroup>
						:	<ItemGroup className="gap-3">
								{/* Aprobadas */}
								{rendirGroup.aprobados.map((req) => (
									<Item key={req.id} variant="outline" render={<Link href={`/${carreraSlug}/${plan}/${req.slug}`} />}>
										<ItemMedia>
											<IconCircleCheck className="size-5 text-green-500" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>{req.nombre}</ItemTitle>
											<ItemDescription>Requisito: Aprobada</ItemDescription>
										</ItemContent>
										<ItemActions>
											<IconChevronRight className="size-4 text-muted-foreground" />
										</ItemActions>
									</Item>
								))}

								{/* Regulares */}
								{rendirGroup.regulares.map((req) => (
									<Item key={req.id} variant="outline" render={<Link href={`/${carreraSlug}/${plan}/${req.slug}`} />}>
										<ItemMedia>
											<IconCircle className="size-5 text-yellow-500" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>{req.nombre}</ItemTitle>
											<ItemDescription>Requisito: Regularizada</ItemDescription>
										</ItemContent>
										<ItemActions>
											<IconChevronRight className="size-4 text-muted-foreground" />
										</ItemActions>
									</Item>
								))}

								{/* Otros */}
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
												<IconInfoCircle className="size-5 text-blue-500" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>{text}</ItemTitle>
											</ItemContent>
										</Item>
									)
								})}
							</ItemGroup>
						}
					</CardContent>
				</Card>

				{/* 3. Tarjeta de Exámenes y Enlaces */}
				<Card className="h-full flex flex-col">
					<CardHeader>
						<CardTitle className="text-lg">Fechas de Exámenes</CardTitle>
						<CardDescription>Próximos llamados y mesas programadas para rendir final.</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col justify-between gap-6">
						<div>
							{materia.fechasExamenes.length === 0 ?
								<ItemGroup>
									<Item variant="muted" size="sm">
										<ItemMedia>
											<IconCalendarOff className="size-5 text-muted-foreground" />
										</ItemMedia>
										<ItemContent>
											<ItemTitle className="text-muted-foreground font-normal">
												No hay fechas de exámenes programadas.
											</ItemTitle>
										</ItemContent>
									</Item>
								</ItemGroup>
							:	<ItemGroup className="gap-3">
									{materia.fechasExamenes.map((fecha, idx) => (
										<Item key={idx} variant="outline">
											<ItemMedia>
												<IconCalendar className="size-5 text-primary" />
											</ItemMedia>
											<ItemContent>
												<ItemTitle>Mesa N° {idx + 1}</ItemTitle>
												<ItemDescription className="font-semibold text-foreground">
													{new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", {
														year: "numeric",
														month: "2-digit",
														day: "numeric",
													})}
												</ItemDescription>
											</ItemContent>
											<ItemActions>
												<Button
													variant="ghost"
													size="icon"
													className="size-8"
													render={
														<Link
															href={getGoogleCalendarLink(materia.nombre, fecha)}
															target="_blank"
															title="Agregar a Google Calendar"
														/>
													}>
													<IconCalendarPlus className="size-4 text-primary" />
												</Button>
											</ItemActions>
										</Item>
									))}
								</ItemGroup>
							}

							{/* Aviso importante */}
							<div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-xs flex gap-2.5 items-start">
								<IconAlertCircle className="size-5 shrink-0 mt-0.5" />
								<span>
									<strong>Aviso importante:</strong> Revisa siempre la información oficial provista por la institución,
									ya que estas fechas pueden cambiar de último momento.
								</span>
							</div>
						</div>

						{/* Botón de Enlace a Resoluciones */}
						<div className="pt-4 border-t border-border">
							<Button
								variant="outline"
								className="w-full justify-between"
								render={<Link href={RESOLUCIONES_URL} target="_blank" />}>
								<span className="flex items-center gap-2">
									<IconFileText className="size-4" />
									Ver Resoluciones Oficiales
								</span>
								<IconChevronRight className="size-4" />
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	)
}

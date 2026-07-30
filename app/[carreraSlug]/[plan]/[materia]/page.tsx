import * as React from "react"
import Link from "next/link"
import {cookies} from "next/headers"
import {createClient} from "@/utils/supabase/server"
import {getMateriaDetalle} from "@/lib/carreras"
import {getCurrentUser} from "@/lib/auth"
import {MateriaEstadoSelector} from "@/sections/materia/MateriaEstadoSelector"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Item, ItemContent, ItemMedia, ItemTitle, ItemDescription} from "@/components/ui/item"
import {
	IconInfoCircle,
	IconFileText,
	IconCalendar,
	IconSchool,
	IconArrowLeft,
} from "@tabler/icons-react"
import {Button} from "@/components/ui/button"
import type {EstadoMateria} from "@/types/materiaTypes"
import MateriaDocumentos from "@/sections/materia/MateriaDocumentos"
import MateriaProfesores from "@/sections/materia/MateriaProfesores"

// Constantes configurables
const RESOLUCION_MOCK = "Res. CD 142/18"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
		materia: string
	}>
}

export default async function MateriaDetailPage({params}: PageProps) {
	const resolvedParams = await params
	const {carreraSlug, plan, materia: materiaSlug} = resolvedParams

	// Obtener detalles de la materia
	const materia = await getMateriaDetalle(carreraSlug, plan, materiaSlug)

	// Obtener usuario autenticado y su estado actual para la materia
	const userRes = await getCurrentUser()
	const user = userRes.data?.user
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

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

	return (
		<section className="flex flex-col gap-6 py-6 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto w-full animate-in fade-in duration-200">
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

			{/* DOCUMENTOS */}
			<div className="flex flex-col gap-3">
				<h2 className="text-xl font-bold tracking-tight px-1">Documentación de la Materia</h2>
				<MateriaDocumentos />
			</div>

			{/* EQUIPO DOCENTE */}
			<div className="flex flex-col gap-3">
				<h2 className="text-xl font-bold tracking-tight px-1">Cátedra</h2>
				<MateriaProfesores />
			</div>
		</section>
	)
}

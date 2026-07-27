import * as React from "react"
import Link from "next/link"
import { getMateriaDetalle } from "@/lib/carreras"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import {
	IconCircleCheck,
	IconCircle,
	IconInfoCircle,
	IconChevronRight,
	IconArrowLeft,
} from "@tabler/icons-react"
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

	return { regulares, aprobados, otros }
}

export default async function CorrelativasPage({ params }: PageProps) {
	const resolvedParams = await params
	const { carreraSlug, plan, materia: materiaSlug } = resolvedParams

	// Obtener detalles de la materia
	const materia = await getMateriaDetalle(carreraSlug, plan, materiaSlug)

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
		<section className="flex flex-col gap-6 py-6 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto w-full animate-in fade-in duration-200">
			{/* Botón Volver */}
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" render={<Link href={`/${carreraSlug}/${plan}/${materiaSlug}`} />}>
					<IconArrowLeft className="size-4 mr-1" />
					Volver a Información General
				</Button>
			</div>

			<div className="typeset">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Correlativas de {materia.nombre}</h1>
				<p className="text-muted-foreground">Requisitos necesarios para cursar y rendir la asignatura.</p>
			</div>

			{/* Grid de dos columnas para Cursar y Rendir */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* 1. Tarjeta Correlativas para Cursar */}
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
										<IconCircleCheck className="size-5 text-green-500" />
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
						)}
					</CardContent>
				</Card>

				{/* 2. Tarjeta Correlativas para Rendir */}
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
										<IconCircleCheck className="size-5 text-green-500" />
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
						)}
					</CardContent>
				</Card>
			</div>
		</section>
	)
}

"use client"

import * as React from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {IconHome, IconChevronDown, IconChevronRight} from "@tabler/icons-react"
import type {Carrera} from "@/types/consultas"
import type {AnioJSON} from "@/types/consultas"
import type {MateriaJSON} from "@/types/carrera"
import { acortarNombreCarrera } from "@/lib/utils"

interface HeaderBreadcrumbProps {
	allCarreras: Carrera[]
	currentCarrera: {
		nombre: string
		slug: string
	}
	currentPlanYear: number
	anios: AnioJSON[]
}

export default function HeaderBreadcrumb({allCarreras, currentCarrera, currentPlanYear, anios}: HeaderBreadcrumbProps) {
	const pathname = usePathname()

	// Parse current path segments
	const segments = pathname.split("/").filter(Boolean)
	const currentMateriaSlug = segments[2] || null

	// Flatten all materias from years/periods
	const allMaterias = React.useMemo(() => {
		const list: MateriaJSON[] = []
		anios.forEach((anioObj) => {
			anioObj.periodos.forEach((periodoObj) => {
				periodoObj.materias.forEach((materia) => {
					// Avoid duplicates just in case
					if (!list.some((m) => m.idMateriaPlan === materia.idMateriaPlan)) {
						list.push(materia)
					}
				})
			})
		})
		return list
	}, [anios])

	// Find current materia object if selected
	const currentMateria = React.useMemo(() => {
		if (!currentMateriaSlug) return null
		return allMaterias.find((m) => m.slug === currentMateriaSlug) || null
	}, [allMaterias, currentMateriaSlug])

    const currentCarreraNombre = acortarNombreCarrera(currentCarrera.nombre)

	return (
		<Breadcrumb>
			<BreadcrumbList className="flex items-center gap-1 sm:gap-1.5 flex-nowrap overflow-x-auto select-none py-1 scrollbar-none">
				{/* Home Icon */}
				<BreadcrumbItem>
					<Button variant="ghost" size="icon-sm" render={<Link href="/carreras" />} aria-label="Inicio">
						<IconHome className="size-4" />
					</Button>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				{/* Carrera Selector */}
				<BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="xs"
									className="font-semibold text-foreground flex items-center gap-1 max-w-30 sm:max-w-50 truncate">
									<span className="truncate">{currentCarreraNombre}</span>
									<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
								</Button>
							}
						/>
						<DropdownMenuContent align="start" className="w-56 max-h-87.5 scroll-fade scrollbar-none overflow-y-auto">
							<DropdownMenuGroup>
								<DropdownMenuLabel>Carreras</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{allCarreras.map((c) => {
									const planes = c.planes || []
									const hasMultiplePlanes = planes.length > 1
									const primaryPlan = planes.length > 0 ? planes[0] : null
                                    const nombre = acortarNombreCarrera(c.nombre);
									if (!primaryPlan) return null

									if (hasMultiplePlanes) {
										return (
											<DropdownMenuSub key={c.id}>
												<DropdownMenuSubTrigger className="w-full justify-between">
													<span className="truncate">{nombre}</span>
												</DropdownMenuSubTrigger>
												<DropdownMenuSubContent className="w-48">
													<DropdownMenuGroup>
														<DropdownMenuLabel>Seleccionar Plan</DropdownMenuLabel>
														<DropdownMenuSeparator />
														{planes.map((p) => (
															<DropdownMenuItem key={p.id} render={<Link href={`/${c.slug}/${p.anio_inicio}`} />}>
																Plan {p.anio_inicio}
															</DropdownMenuItem>
														))}
													</DropdownMenuGroup>
												</DropdownMenuSubContent>
											</DropdownMenuSub>
										)
									}

									return (
										<DropdownMenuItem key={c.id} render={<Link href={`/${c.slug}/${primaryPlan.anio_inicio}`} />}>
											<span className="truncate">{nombre}</span>
										</DropdownMenuItem>
									)
								})}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				{/* Plan Selector */}
				<BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button variant="ghost" size="xs" className="font-medium flex items-center gap-1 shrink-0">
									<span>Plan {currentPlanYear}</span>
									<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
								</Button>
							}
						/>
						<DropdownMenuContent align="start" className="w-40">
							<DropdownMenuGroup>
								<DropdownMenuLabel>Planes de Estudio</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{(allCarreras.find((c) => c.slug === currentCarrera.slug)?.planes || []).map((p) => (
									<DropdownMenuItem
										key={p.id}
										className={
											p.anio_inicio === currentPlanYear ? "font-semibold bg-accent text-accent-foreground" : ""
										}
										render={<Link href={`/${currentCarrera.slug}/${p.anio_inicio}`} />}>
										Plan {p.anio_inicio}
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>

				{currentMateriaSlug && (
					<>
						<BreadcrumbSeparator />

						{/* Materia Selector */}
						<BreadcrumbItem className="min-w-0">
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button
											variant="ghost"
											size="xs"
											className={`font-medium flex items-center gap-1 max-w-37.5 sm:max-w-62.5 truncate ${
												currentMateria ? "text-foreground" : "text-muted-foreground italic"
											}`}>
											<span className="truncate">
												{currentMateria ? currentMateria.nombre : "Seleccionar materia..."}
											</span>
											<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
										</Button>
									}
								/>
								<DropdownMenuContent align="start" className="w-72 max-h-87.5 overflow-y-auto">
									<DropdownMenuGroup>
										<DropdownMenuLabel>Materias del Plan</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{anios.map((anioObj) => (
											<DropdownMenuGroup key={anioObj.anio}>
												<DropdownMenuLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-muted/30 py-1 px-2 rounded-sm mt-1 first:mt-0">
													{anioObj.anio}º Año
												</DropdownMenuLabel>
												{anioObj.periodos.map((periodoObj) =>
													periodoObj.materias.map((m) => (
														<DropdownMenuItem
															key={m.idMateriaPlan}
															className={`pl-4 ${m.slug === currentMateriaSlug ? "font-semibold bg-accent text-accent-foreground" : ""}`}
															render={<Link href={`/${currentCarrera.slug}/${currentPlanYear}/${m.slug}`} />}>
															<span className="truncate">{m.nombre}</span>
														</DropdownMenuItem>
													)),
												)}
											</DropdownMenuGroup>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

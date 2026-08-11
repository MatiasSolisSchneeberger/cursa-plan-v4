"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { rutaMateria } from "@/lib/rutas"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarSeparator,
} from "./ui/sidebar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuGroup,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import UserDropdown from "@/components/UserDropdown"
import LoginButton from "@/components/LoginButton"
import SidebarLink from "./SidebarLink"
import {
	IconArrowLeft,
	IconSelector,
	IconCheck,
	IconInfoCircle,
	IconGitFork,
	IconCalendar,
	IconFolder,
	IconBook,
} from "@tabler/icons-react"
import type { AnioJSON } from "@/types/consultas"
import type { Usuario } from "@/types/auth"

interface MateriaSidebarProps {
	carreraSlug: string
	plan: string
	carreraNombre: string
	carreraIcon?: string
	anios: AnioJSON[]
	user?: Usuario | null
}

export default function MateriaSidebar({
	carreraSlug,
	plan,
	carreraNombre,
	anios,
	user,
}: MateriaSidebarProps) {
	const pathname = usePathname()
	const router = useRouter()

	// Obtener el slug de la materia actual desde la URL
	const segments = pathname.split("/").filter(Boolean)
	const currentMateriaSlug = segments[2] || ""

	// Aplanar la lista de materias de todos los años para el selector
	const allMateriasByAnio = React.useMemo(() => {
		const result: { anio: number; materias: { idMateriaPlan: number; nombre: string; slug: string }[] }[] = []

		anios.forEach((anioObj) => {
			const materiasAnio: { idMateriaPlan: number; nombre: string; slug: string }[] = []
			anioObj.periodos.forEach((periodoObj) => {
				periodoObj.materias.forEach((m) => {
					if (!materiasAnio.some((existing) => existing.idMateriaPlan === m.idMateriaPlan)) {
						materiasAnio.push({
							idMateriaPlan: m.idMateriaPlan,
							nombre: m.nombre,
							slug: m.slug,
						})
					}
				})
			})

			if (materiasAnio.length > 0) {
				result.push({
					anio: anioObj.anio,
					materias: materiasAnio,
				})
			}
		})

		return result
	}, [anios])

	// Materia actual seleccionada
	const currentMateria = React.useMemo(() => {
		for (const group of allMateriasByAnio) {
			const found = group.materias.find((m) => m.slug === currentMateriaSlug)
			if (found) return found
		}
		return null
	}, [allMateriasByAnio, currentMateriaSlug])

	const materiaNombreDisplay = currentMateria ? currentMateria.nombre : currentMateriaSlug

	// URLs de secciones de la materia
	const baseUrl = rutaMateria(carreraSlug, plan, currentMateriaSlug)
	const urlInformacion = `${baseUrl}#informacion`
	const urlCorrelativas = `${baseUrl}#correlativas`
	const urlExamenes = `${baseUrl}#examenes`

	return (
		<Sidebar>
			{/* HEADER: Selector de Materia */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<SidebarMenuButton size="lg">
										<div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
											<IconBook className="size-5" />
										</div>
										<div className="flex flex-col gap-0.5 leading-none flex-1 min-w-0 text-left">
											<h2 className="text-sm font-semibold text-sidebar-foreground truncate" title={materiaNombreDisplay}>
												{materiaNombreDisplay}
											</h2>
											<span className="text-xs text-muted-foreground truncate">{carreraNombre} • Plan {plan}</span>
										</div>
										<IconSelector className="size-4 text-muted-foreground shrink-0 ml-auto" />
									</SidebarMenuButton>
								}
							/>

							<DropdownMenuContent className="w-64 max-h-80 overflow-y-auto scrollbar-none" align="start">
								<DropdownMenuGroup>
									<DropdownMenuLabel>Materias del Plan</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{allMateriasByAnio.map(({ anio, materias }) => (
										<React.Fragment key={anio}>
											<DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 py-1 px-2 rounded-sm my-1">
												{anio}º Año
											</DropdownMenuLabel>
											{materias.map(({ idMateriaPlan, nombre, slug }) => {
												const isSelected = slug === currentMateriaSlug
												return (
													<DropdownMenuItem
														key={idMateriaPlan}
														className={isSelected ? "font-semibold bg-accent text-accent-foreground" : ""}
														render={
															<Link
																href={rutaMateria(carreraSlug, plan, slug)}
																className="flex flex-row items-center justify-between w-full">
																<span className="truncate">{nombre}</span>
																{isSelected && <IconCheck className="size-4 text-primary shrink-0 ml-2" />}
															</Link>
														}
													/>
												)
											})}
										</React.Fragment>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* CONTENIDO: Botón Atrás + Navegación Interna de Materia */}
			<SidebarContent>
				{/* Botón Volver (Navegación hacia atrás del historial) */}
				<SidebarGroup className="pt-2 pb-1">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={() => router.back()}
								className="text-muted-foreground hover:text-foreground">
								<IconArrowLeft className="size-4" />
								<span>Volver</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarSeparator />

				{/* Grupo Navegación de Materia */}
				<SidebarGroup>
					<SidebarGroupLabel>Navegación de Materia</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className="gap-1">
							<SidebarMenuItem>
								<SidebarLink href={urlInformacion} icon={<IconInfoCircle className="size-4" />}>
									Información General
								</SidebarLink>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarLink href={urlCorrelativas} icon={<IconGitFork className="size-4" />}>
									Correlativas
								</SidebarLink>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarLink href={urlExamenes} icon={<IconCalendar className="size-4" />}>
									Mesas de Exámenes
								</SidebarLink>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* FOOTER: Perfil de Usuario */}
			<SidebarFooter className="p-2 border-t border-sidebar-border/50">
				{user ? (
					<UserDropdown user={user} isSidebar />
				) : (
					<LoginButton variant="outline" size="sm" className="w-full justify-between"><span>Iniciar Sesión</span><IconArrowLeft className="rotate-180 size-4" /></LoginButton>
				)}
			</SidebarFooter>
		</Sidebar>
	)
}

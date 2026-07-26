"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import IconCarrera from "@/components/Icon"
import {
	IconArrowLeft,
	IconLayoutDashboard,
	IconHeart,
	IconBook,
	IconSettings,
	IconChevronRight,
	IconUser,
	IconBooks,
} from "@tabler/icons-react"
import type { PerfilUsuario, PlanCarreraFavorito, CarreraFavoritaConAvance, MateriaCursando } from "@/types/consultas"
import { cn } from "@/lib/utils"

interface PerfilSidebarProps {
	user: PerfilUsuario
	carrerasFavoritas?: (PlanCarreraFavorito | CarreraFavoritaConAvance)[]
	materiasCursando?: MateriaCursando[]
}

export default function PerfilSidebar({
	user,
	carrerasFavoritas = [],
	materiasCursando = [],
}: PerfilSidebarProps) {
	const pathname = usePathname()

	const initials = user.fullName
		? user.fullName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.substring(0, 2)
				.toUpperCase()
		: user.username
		? user.username.substring(0, 2).toUpperCase()
		: "U"

	return (
		<Sidebar collapsible="icon" className="border-r border-border">
			{/* HEADER: Botón de Volver a Página Principal */}
			<SidebarHeader className="p-3">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton render={
							<Link href="/" className="flex items-center gap-2.5 font-medium text-muted-foreground hover:text-foreground">
								<div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shrink-0">
									<IconArrowLeft className="size-4" />
								</div>
								<span className="truncate">Volver al Inicio</span>
							</Link>
						} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* CONTENIDO PRINCIPAL */}
			<SidebarContent className="px-2 py-1">
				{/* Grupo de Navegación Principal */}
				<SidebarGroup>
					<SidebarGroupLabel>Navegación</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Link Inicio / Dashboard */}
							<SidebarMenuItem>
								<SidebarMenuButton
									isActive={pathname === "/perfil"}
									render={
										<Link href="/perfil" className="flex items-center gap-2.5">
											<IconLayoutDashboard className="size-4 text-primary" />
											<span className="font-medium">Resumen General</span>
										</Link>
									}
								/>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Grupo Colapsable: Carreras Favoritas */}
				<SidebarGroup>
					<SidebarMenu>
						<Collapsible defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<CollapsibleTrigger render={
									<SidebarMenuButton className="w-full flex items-center justify-between">
										<div className="flex items-center gap-2">
											<IconHeart className="size-4 text-rose-500" />
											<span className="font-medium">Carreras Favoritas</span>
										</div>
										<div className="flex items-center gap-1">
											<span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
												{carrerasFavoritas.length}
											</span>
											<IconChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</div>
									</SidebarMenuButton>
								} />
								<CollapsibleContent>
									<SidebarMenuSub className="my-1 flex flex-col gap-0.5 pl-3 border-l border-border/60">
										{carrerasFavoritas.length > 0 ? (
											carrerasFavoritas.map((fav) => {
												const { carrera: { nombre, slug, icon } } = fav
												const favKey = "planFavId" in fav ? fav.planFavId : fav.id
												const href = `/perfil/carrera/${slug}`
												const isActive = pathname === href
												return (
													<SidebarMenuSubItem key={favKey} className={cn("theme-" + slug)}>
														<SidebarMenuSubButton
															isActive={isActive}
															render={
																<Link href={href} className="flex items-center gap-2 py-1.5 px-2 rounded-md truncate">
																	<IconCarrera icon={icon || "device-imac"} className="size-4 shrink-0 text-muted-foreground" />
																	<span className="truncate text-sm">{nombre}</span>
																</Link>
															}
														/>
													</SidebarMenuSubItem>
												)
											})
										) : (
											<SidebarMenuSubItem>
												<span className="text-xs text-muted-foreground italic px-2 py-1 block">
													Sin carreras en favoritos
												</span>
											</SidebarMenuSubItem>
										)}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>

				{/* Grupo Colapsable: Materias Cursando */}
				<SidebarGroup>
					<SidebarMenu>
						<Collapsible defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<CollapsibleTrigger render={
									<SidebarMenuButton className="w-full flex items-center justify-between">
										<div className="flex items-center gap-2">
											<IconBooks className="size-4 text-amber-500" />
											<span className="font-medium">Materias Cursando</span>
										</div>
										<div className="flex items-center gap-1">
											<span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
												{materiasCursando.length}
											</span>
											<IconChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</div>
									</SidebarMenuButton>
								} />
								<CollapsibleContent>
									<SidebarMenuSub className="my-1 flex flex-col gap-0.5 pl-3 border-l border-border/60">
										{materiasCursando.length > 0 ? (
											materiasCursando.map(({ idMateriaPlan, nombre, slug, carreraNombre, carreraSlug, planAnio }) => {
												const href = `/${carreraSlug}/${planAnio}/${slug}`
												return (
													<SidebarMenuSubItem key={idMateriaPlan} className={cn("theme-" + carreraSlug)}>
														<SidebarMenuSubButton render={
															<Link href={href} className="flex items-center gap-2 py-1.5 px-2 rounded-md truncate">
																<IconBook className="size-3.5 shrink-0 text-amber-500" />
																<div className="flex flex-col min-w-0">
																	<span className="truncate text-xs font-medium leading-tight">{nombre}</span>
																	<span className="truncate text-[10px] text-muted-foreground">{carreraNombre}</span>
																</div>
															</Link>
														} />
													</SidebarMenuSubItem>
												)
											})
										) : (
											<SidebarMenuSubItem>
												<span className="text-xs text-muted-foreground italic px-2 py-1 block">
													Sin materias en cursada
												</span>
											</SidebarMenuSubItem>
										)}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			{/* FOOTER: Configuración y Usuario */}
			<SidebarFooter className="p-2 border-t border-border">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							isActive={pathname === "/perfil/configuracion"}
							render={
								<Link href="/perfil/configuracion" className="flex items-center gap-2.5 font-medium">
									<IconSettings className="size-4 text-muted-foreground" />
									<span>Configuración</span>
								</Link>
							}
						/>
					</SidebarMenuItem>

					<SidebarMenuItem className="mt-1">
						<div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-card border border-border/60">
							<Avatar className="size-8 shrink-0">
								<AvatarImage src={user.avatarUrl || undefined} alt={user.fullName || "Usuario"} />
								<AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col min-w-0 leading-tight">
								<span className="text-xs font-semibold text-foreground truncate">
									{user.fullName || user.username || "Usuario"}
								</span>
								{user.username && (
									<span className="text-[10px] text-muted-foreground truncate">
										@{user.username}
									</span>
								)}
							</div>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
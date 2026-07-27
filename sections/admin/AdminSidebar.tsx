"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
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
} from "@/components/ui/sidebar"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {
	IconArrowLeft,
	IconLayoutDashboard,
	IconShieldLock,
	IconKey,
	IconUsers,
	IconHistory,
	IconAdjustmentsHorizontal,
	IconShieldCheck,
	IconLock,
} from "@tabler/icons-react"
import {cn} from "@/lib/utils"
import {canRoleAccessRoute} from "@/lib/permissions"
import UserDropdown from "@/components/UserDropdown"

interface AdminSidebarProps {
	userRole?: string
	user?: any
}

export default function AdminSidebar({userRole = "super_admin", user}: AdminSidebarProps) {
	const pathname = usePathname()

	const mainNavigation = [
		{
			title: "Resumen General",
			href: "/admin",
			icon: IconLayoutDashboard,
			exact: true,
		},
	]

	const permissionsNavigation = [
		{
			title: "Roles del Sistema",
			href: "/admin/roles",
			icon: IconShieldLock,
			badge: "5 Roles",
		},
		{
			title: "Catálogo de Permisos",
			href: "/admin/permisos",
			icon: IconKey,
			badge: "32 Permisos",
		},
	]

	const accessNavigation = [
		{
			title: "Usuarios Admin",
			href: "/admin/usuarios",
			icon: IconUsers,
			badge: "12 Activos",
		},
		{
			title: "Auditoría de Accesos",
			href: "/admin/auditoria",
			icon: IconHistory,
		},
	]

	const systemNavigation = [
		{
			title: "Políticas de Seguridad",
			href: "/admin/configuracion",
			icon: IconAdjustmentsHorizontal,
		},
	]

	const isItemActive = (href: string, exact: boolean = false) => {
		if (exact) {
			return pathname === href
		}
		return pathname.startsWith(href)
	}

	return (
		<Sidebar className="border-r border-border bg-card">
			{/* HEADER: Volver al sitio principal */}
			<SidebarHeader className="p-3">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={
								<Link
									href="/"
									className="flex items-center gap-2.5 font-medium text-muted-foreground hover:text-foreground transition-colors">
									<div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-500/20">
										<IconArrowLeft className="size-4" />
									</div>
									<div className="flex flex-col min-w-0">
										<span className="truncate text-xs font-semibold text-foreground">CursaPlan Admin</span>
										<span className="truncate text-[10px] text-muted-foreground">Volver a la Web</span>
									</div>
								</Link>
							}
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* CONTENIDO DE NAVEGACIÓN */}
			<SidebarContent className="px-2 py-1">
				{/* DASHBOARD PRINCIPAL */}
				<SidebarGroup>
					<SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
						General
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavigation.map((item) => {
								const Icon = item.icon
								const active = isItemActive(item.href, item.exact)
								const hasAccess = canRoleAccessRoute(userRole, item.href)
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											isActive={active}
											disabled={!hasAccess}
											render={
												<Link
													href={hasAccess ? item.href : "#"}
													className={cn(
														"flex items-center justify-between gap-2.5",
														!hasAccess && "opacity-50 cursor-not-allowed",
													)}>
													<div className="flex items-center gap-2.5">
														<Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
														<span className="font-medium text-sm">{item.title}</span>
													</div>
												</Link>
											}
										/>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* SECCIÓN PERMISOS Y ROLES */}
				<SidebarGroup>
					<SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
						Control de Accesos
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{permissionsNavigation.map((item) => {
								const Icon = item.icon
								const active = isItemActive(item.href)
								const hasAccess = canRoleAccessRoute(userRole, item.href)
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											isActive={active}
											disabled={!hasAccess}
											render={
												<Link
													href={hasAccess ? item.href : "#"}
													className={cn(
														"flex items-center justify-between gap-2.5",
														!hasAccess && "opacity-50 cursor-not-allowed",
													)}>
													<div className="flex items-center gap-2.5">
														<Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
														<span className="font-medium text-sm">{item.title}</span>
													</div>
													{hasAccess ?
														item.badge && (
															<span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
																{item.badge}
															</span>
														)
													:	<IconLock className="size-3.5 text-muted-foreground" />}
												</Link>
											}
										/>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* SECCIÓN USUARIOS Y AUDITORÍA */}
				<SidebarGroup>
					<SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
						Gestión & Logs
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{accessNavigation.map((item) => {
								const Icon = item.icon
								const active = isItemActive(item.href)
								const hasAccess = canRoleAccessRoute(userRole, item.href)
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											isActive={active}
											disabled={!hasAccess}
											render={
												<Link
													href={hasAccess ? item.href : "#"}
													className={cn(
														"flex items-center justify-between gap-2.5",
														!hasAccess && "opacity-50 cursor-not-allowed",
													)}>
													<div className="flex items-center gap-2.5">
														<Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
														<span className="font-medium text-sm">{item.title}</span>
													</div>
													{hasAccess ?
														item.badge && (
															<span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
																{item.badge}
															</span>
														)
													:	<IconLock className="size-3.5 text-muted-foreground" />}
												</Link>
											}
										/>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* SECCIÓN SEGURIDAD */}
				<SidebarGroup>
					<SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
						Seguridad
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{systemNavigation.map((item) => {
								const Icon = item.icon
								const active = isItemActive(item.href)
								const hasAccess = canRoleAccessRoute(userRole, item.href)
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											isActive={active}
											disabled={!hasAccess}
											render={
												<Link
													href={hasAccess ? item.href : "#"}
													className={cn(
														"flex items-center justify-between gap-2.5",
														!hasAccess && "opacity-50 cursor-not-allowed",
													)}>
													<div className="flex items-center gap-2.5">
														<Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
														<span className="font-medium text-sm">{item.title}</span>
													</div>
													{!hasAccess && <IconLock className="size-3.5 text-muted-foreground" />}
												</Link>
											}
										/>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* FOOTER CON PERFIL ADMINISTRADOR */}
			<SidebarFooter className="p-2 border-t border-border">
				<SidebarMenu>
					<SidebarMenuItem>
						<UserDropdown user={user} isSidebar />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

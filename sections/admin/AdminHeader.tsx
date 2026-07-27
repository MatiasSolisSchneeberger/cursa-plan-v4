"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	IconSearch,
	IconBell,
	IconShieldCheck,
	IconLockCheck,
} from "@tabler/icons-react"

export default function AdminHeader() {
	return (
		<header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 md:px-6 gap-4">
			{/* IZQUIERDA: Sidebar Trigger + Título de sección */}
			<div className="flex items-center gap-3">
				<SidebarTrigger className="h-9 w-9 text-muted-foreground hover:text-foreground" />
				<div className="h-4 w-px bg-border hidden sm:block" />
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/20 text-xs font-semibold">
						<IconShieldCheck className="size-3.5" />
						<span>Modo Administrador</span>
					</div>
				</div>
			</div>

			{/* DERECHA: Buscador de Permisos + Notificaciones de Seguridad */}
			<div className="flex items-center gap-3 ml-auto">
				<div className="relative hidden md:block w-64 lg:w-80">
					<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Buscar rol, permiso o usuario..."
						className="pl-9 h-9 text-xs bg-muted/40 focus:bg-background border-border/80"
					/>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" className="relative h-9 w-9 border-border/80">
						<IconBell className="size-4 text-muted-foreground" />
						<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500 ring-2 ring-background" />
					</Button>

					<Badge variant="outline" className="hidden sm:flex items-center gap-1 text-xs py-1 px-2.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-medium">
						<IconLockCheck className="size-3.5" />
						<span>MFA Verificado</span>
					</Badge>
				</div>
			</div>
		</header>
	)
}

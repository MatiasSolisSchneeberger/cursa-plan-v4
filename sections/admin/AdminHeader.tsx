"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconShieldCheck } from "@tabler/icons-react"

export default function AdminHeader() {
	return (
		<header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur py-2 px-4 md:px-6 gap-4">
			{/* IZQUIERDA: Sidebar Trigger + Título de sección */}
			<div className="flex items-center gap-3">
				<SidebarTrigger className="h-9 w-9 text-muted-foreground hover:text-foreground" />
				<div className="h-4 w-px bg-border hidden sm:block" />
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20 text-xs font-semibold">
						<IconShieldCheck className="size-3.5" />
						<span>Modo Administrador</span>
					</div>
				</div>
			</div>
		</header>
	)
}

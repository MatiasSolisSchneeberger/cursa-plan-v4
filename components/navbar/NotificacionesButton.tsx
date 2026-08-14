"use client"

import { IconBell } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NotificacionesButton() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon-lg" aria-label="Notificaciones">
						<IconBell className="size-4" />
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-64">
				<div className="px-2 py-1.5">
					<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Notificaciones
					</p>
				</div>
				<div className="px-3 py-6 text-center text-sm text-muted-foreground">
					No tenés notificaciones
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

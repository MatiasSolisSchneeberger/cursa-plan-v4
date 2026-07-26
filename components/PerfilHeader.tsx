"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { ThemeButton } from "@/components/toggle-theme"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import KbdMacShortcut from "@/components/KbdMacShortcut"
import { IconUser, IconSettings, IconBook } from "@tabler/icons-react"

interface PerfilHeaderProps {
	carreraNombre?: string
}

export default function PerfilHeader({ carreraNombre }: PerfilHeaderProps) {
	const pathname = usePathname()

	const isConfiguracion = pathname.startsWith("/perfil/configuracion")
	const isCarrera = pathname.startsWith("/perfil/carrera/")

	return (
		<header className="bg-card sticky top-0 left-0 flex h-16 shrink-0 items-center gap-3 border-b border-border px-4 z-40 backdrop-blur-md bg-card/80">
			<Tooltip delay={2000}>
				<TooltipTrigger render={<SidebarTrigger className="-ml-1" />} />
				<TooltipContent>
					<p className="text-sm">Panel de Navegación</p>
					<KbdMacShortcut />
				</TooltipContent>
			</Tooltip>

			<Separator orientation="vertical" className="h-5 my-auto" />

			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={
							<Link href="/perfil" className="flex items-center gap-1.5 font-medium">
								<IconUser className="size-4 text-primary" />
								<span>Mi Perfil</span>
							</Link>
						} />
					</BreadcrumbItem>

					{isConfiguracion && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="flex items-center gap-1.5 font-semibold">
									<IconSettings className="size-4 text-muted-foreground" />
									<span>Configuración</span>
								</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}

					{isCarrera && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="flex items-center gap-1.5 font-semibold">
									<IconBook className="size-4 text-primary" />
									<span>{carreraNombre || "Carrera"}</span>
								</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="ml-auto flex items-center gap-2">
				<ThemeButton />
			</div>
		</header>
	)
}

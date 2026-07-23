import AppSidebar, {AppSidebarSkeleton} from "@/components/AppSidebar"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import KbdMacShortcut from "@/components/KbdMacShortcut"
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Suspense} from "react"
import {ThemeButton} from "@/components/toggle-theme"
import {getCarreraDetalle, getPlanEstudio} from "@/lib/carreras"

interface LayoutProps {
	children: React.ReactNode
	params: Promise<{
		carreraSlug: string
		plan: string
	}>
}

export default async function CarreraPlanLayout({children, params}: LayoutProps) {
	const resolvedParams = await params
	const {carreraSlug, plan} = resolvedParams

	const {carrera, anioInicio} = await getPlanEstudio(plan, carreraSlug)

	return (
		<SidebarProvider className={`theme-${carreraSlug}`}>
			<Suspense fallback={<AppSidebarSkeleton />}>
				<AppSidebar carreraSlug={carreraSlug} plan={plan} />
			</Suspense>
			<main className="relative w-full">
				<header className="bg-card sticky top-0 left-0 flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 z-50">
					<Tooltip delay={2000}>
						<TooltipTrigger render={<SidebarTrigger className="-ml-1" />} />
						<TooltipContent>
							<p className="text-sm">Panel de Navegación</p>

							<KbdMacShortcut />
						</TooltipContent>
					</Tooltip>
					<Breadcrumb>
						<BreadcrumbList>
							{carrera.nombre}, {anioInicio}
						</BreadcrumbList>
					</Breadcrumb>
					<div className="ml-auto">
						<ThemeButton />
					</div>
				</header>
				{children}
			</main>
		</SidebarProvider>
	)
}

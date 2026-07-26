import AppSidebar, {AppSidebarSkeleton} from "@/components/CarreraSidebar"
import KbdMacShortcut from "@/components/KbdMacShortcut"
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Suspense} from "react"
import {ThemeButton} from "@/components/toggle-theme"
import {getCarreras, getPlanEstudio} from "@/lib/carreras"
import HeaderBreadcrumb from "@/components/HeaderBreadcrumb"
import { Separator } from "@/components/ui/separator"

interface LayoutProps {
	children: React.ReactNode
	params: Promise<{
		carreraSlug: string
		plan: string
	}>
}

async function CarreraPlanContent({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{
		carreraSlug: string
		plan: string
	}>
}) {
	const resolvedParams = await params
	const {carreraSlug, plan} = resolvedParams

	const [allCarreras, planEstudio] = await Promise.all([
		getCarreras(),
		getPlanEstudio(plan, carreraSlug),
	])

	const {carrera, anioInicio, anios} = planEstudio

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
                    <Separator orientation="vertical" className="h-6 my-auto" />
					<HeaderBreadcrumb
						allCarreras={allCarreras}
						currentCarrera={{
							nombre: carrera.nombre,
							slug: carrera.slug,
						}}
						currentPlanYear={anioInicio}
						anios={anios}
					/>
					<div className="ml-auto">
						<ThemeButton />
					</div>
				</header>
				{children}
			</main>
		</SidebarProvider>
	)
}

export default function CarreraPlanLayout({children, params}: LayoutProps) {
	return (
		<Suspense>
			<CarreraPlanContent params={params}>{children}</CarreraPlanContent>
		</Suspense>
	)
}

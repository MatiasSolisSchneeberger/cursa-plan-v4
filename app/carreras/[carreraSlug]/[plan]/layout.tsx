import AppSidebar, {AppSidebarSkeleton} from "@/components/CarreraSidebar"
import MateriaSidebar from "@/components/MateriaSidebar"
import DynamicSidebar from "@/components/DynamicSidebar"
import KbdMacShortcut from "@/components/KbdMacShortcut"
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Suspense} from "react"
import {ThemeButton} from "@/components/ToggleTheme"
import {getCarreras, getPlanEstudio} from "@/lib/carreras"
import {getCurrentUser} from "@/lib/auth"
import HeaderBreadcrumb from "@/components/HeaderBreadcrumb"
import { Separator } from "@/components/ui/separator"
import MateriaSearchDialog from "@/components/MateriaSearchDialog"
import { getMateriasPlanSearchData } from "@/lib/carreras"

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

	const [allCarreras, planEstudio, userRes, searchData] = await Promise.all([
		getCarreras(),
		getPlanEstudio(plan, carreraSlug),
		getCurrentUser(),
		getMateriasPlanSearchData(),
	])

	const {carrera, anioInicio, anios} = planEstudio
	const user = userRes.data?.user

	return (
		<SidebarProvider className={`theme-${carreraSlug}`}>
			<Suspense fallback={<AppSidebarSkeleton />}>
				<DynamicSidebar
					carreraSidebar={<AppSidebar carreraSlug={carreraSlug} plan={plan} />}
					materiaSidebar={
						<MateriaSidebar
							carreraSlug={carreraSlug}
							plan={plan}
							carreraNombre={carrera.nombre}
							carreraIcon={carrera.icon}
							anios={anios}
							user={user}
						/>
					}
				/>
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
					<div className="ml-auto flex items-center gap-2">
						<MateriaSearchDialog
							initialCarreraSlug={carreraSlug}
							initialPlanYear={anioInicio}
							initialSearchData={searchData}
						/>
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


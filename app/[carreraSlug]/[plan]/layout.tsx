import AppSidebar from "@/components/AppSidebar"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Kbd} from "@/components/ui/kbd"
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

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

	return (
		<SidebarProvider>
			<AppSidebar carreraSlug={carreraSlug} plan={plan} />
			<main className="relative w-full">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<Tooltip delay={2000}>
						<TooltipTrigger render={<SidebarTrigger className="-ml-1" />} />
						<TooltipContent>
							<p className="text-sm">Panel de Navegación</p>

							<Kbd>{navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl"} + B</Kbd>
						</TooltipContent>
					</Tooltip>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Data Fetching</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				{children}
			</main>
		</SidebarProvider>
	)
}

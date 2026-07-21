import Link from "next/link"
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
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuButton,
} from "./ui/sidebar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuGroup,
} from "./ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar"
import {Collapsible, CollapsibleTrigger, CollapsibleContent} from "./ui/collapsible"
import {getCarreraBySlug, getPagePlanData} from "@/lib/carreras"
import IconCarrera from "@/components/Icon"
import SidebarLink from "./SidebarLink"
import SidebarSubLink from "./SidebarSubLink"
import {IconSelector, IconCheck, IconHome, IconFileText, IconBook, IconChevronRight} from "@tabler/icons-react"
import {acortarNombreCarrera, cn} from "@/lib/utils"

interface AppSidebarProps {
	carreraSlug: string
	plan: string
}

export default async function AppSidebar({carreraSlug, plan}: AppSidebarProps) {
	// Obtenemos los datos en paralelo para mejorar el performance
	const [carreraData, planData] = await Promise.all([getCarreraBySlug(carreraSlug), getPagePlanData(plan, carreraSlug)])

	const {nombre, planes, icon} = carreraData
	const hasMultiplePlans = planes.length > 1
	const nombreCarrera = acortarNombreCarrera(nombre)

	return (
		<Sidebar>
			{/* HEADER: Selector de Plan */}
			<SidebarHeader className="border-b border-sidebar-border/50 p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<SidebarMenuButton
										size="lg"
										className="data-[state=open]:bg-sidebar-accent justify-start data-[state=open]:text-sidebar-accent-foreground">
										<div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
											<IconCarrera icon={icon || "device-imac"} className="size-5" />
										</div>
										<div className="flex flex-col gap-0.5 leading-none flex-1 min-w-0 text-left">
											<h2 className="text-sm font-semibold text-sidebar-foreground truncate">{nombreCarrera}</h2>
											<span className="text-xs text-muted-foreground">Plan {plan}</span>
										</div>
										{hasMultiplePlans && <IconSelector className="size-4 text-muted-foreground shrink-0 ml-auto" />}
									</SidebarMenuButton>
								}
							/>

							{hasMultiplePlans && (
								<DropdownMenuContent className="w-56" align="start">
									<DropdownMenuGroup>
										<DropdownMenuLabel>Planes Disponibles</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{planes.map(({id, anio_inicio}) => {
											const isSelected = String(anio_inicio) === String(plan)
											return (
												<DropdownMenuItem
													key={id}
													className={cn("p-0", isSelected && "bg-accent text-accent-foreground font-medium")}>
													<Link
														href={`/${carreraSlug}/${anio_inicio}`}
														className="flex items-center justify-between w-full px-2.5 py-2">
														<span>Plan {anio_inicio}</span>
														{isSelected && <IconCheck className="size-4 text-primary" />}
													</Link>
												</DropdownMenuItem>
											)
										})}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							)}
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* CONTENT: Navegación, Información y Materias */}
			<SidebarContent className="p-2 gap-4">
				{/* 1. Item Inicio */}
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarLink href={`/${carreraSlug}/${plan}`} icon={<IconHome className="size-4" />}>
								Inicio de la Carrera
							</SidebarLink>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				{/* 2. Grupo Información (Resoluciones) */}
				<SidebarGroup>
					<SidebarGroupLabel>Información</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarLink href="#" icon={<IconFileText className="size-4" />}>
									Resoluciones
								</SidebarLink>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* 3. Grupo Materias de la Carrera (Organizado colapsable por Año) */}
				<SidebarGroup>
					<SidebarGroupLabel>Plan de Estudios</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className="gap-1">
							{planData.anios.map(({anio, periodos}) => (
								<Collapsible key={anio} className="group/collapsible w-full">
									<SidebarMenuItem>
										<CollapsibleTrigger
											render={
												<SidebarMenuButton className="w-full justify-between cursor-pointer">
													<div className="flex items-center gap-2">
														<IconBook className="size-4 shrink-0 text-muted-foreground" />
														<span>{anio}º Año</span>
													</div>
													<IconChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground" />
												</SidebarMenuButton>
											}
										/>
										<CollapsibleContent className="transition-all data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-2">
											<SidebarMenuSub className="ml-4 pl-2 border-l border-sidebar-border/50 flex flex-col gap-2 mt-1">
												{periodos.map(({id: periodoId, tipoPeriodo: {nombre: periodoNombre}, materias}) => (
													<div key={periodoId} className="flex flex-col gap-1">
														<div className="px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
															{periodoNombre}
														</div>
														{materias.map(({idMateriaPlan, nombre: materiaNombre, slug: materiaSlug}) => (
															<SidebarMenuSubItem key={idMateriaPlan}>
																<SidebarSubLink href={`/${carreraSlug}/${plan}/${materiaSlug}`}>
																	<span className="truncate text-xs" title={materiaNombre}>
																		{materiaNombre}
																	</span>
																</SidebarSubLink>
															</SidebarMenuSubItem>
														))}
													</div>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* FOOTER: Perfil de Usuario */}
			<SidebarFooter className="border-t border-sidebar-border/50 p-4">
				<div className="flex items-center gap-3 w-full p-1 rounded-lg">
					<Avatar size="default" className="shadow-xs">
						<AvatarImage
							src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
							alt="Usuario Matias"
						/>
						<AvatarFallback className="bg-primary/10 text-primary font-semibold">MS</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold truncate text-sidebar-foreground">Matias Solis</p>
						<p className="text-xs text-muted-foreground truncate">@matias.solis</p>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}

/* 
<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Documentation</span>
                <span className="">v{selectedVersion}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
*/

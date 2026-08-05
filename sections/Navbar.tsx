import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {IconMenu2} from "@tabler/icons-react"
import Link from "next/link"
import LogoPage from "@/components/LogoPage"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {Button, buttonVariants} from "@/components/ui/button"
import {ThemeButton} from "@/components/ToggleTheme"
import {cn, acortarNombreCarrera} from "@/lib/utils"
import {getNavbarLinks} from "@/lib/navigation"
import NavUser from "@/components/NavUser"
import NavUserSkeleton from "@/components/NavUserSkeleton"
import {Suspense} from "react"
import {Separator} from "@/components/ui/separator"
import MateriaSearchDialog from "@/components/MateriaSearchDialog"
import {getMateriasPlanSearchData} from "@/lib/carreras"

export default async function Navbar() {
	const [links, searchData] = await Promise.all([
		getNavbarLinks(),
		getMateriasPlanSearchData(),
	])

	return (
		<header className="sticky top-0 z-40 pt-2 w-full">
			<section className="bg-card border-border flex flex-row gap-4 rounded-3xl border p-3 shadow-md backdrop-blur-md transition-colors duration-300">
				<article className="flex flex-1 gap-6">
					<LogoPage />
					<NavigationMenu className="lg:flex hidden">
						<NavigationMenuList className="gap-1">
							{links.map(({label, href, icon, subtabs}) => {
								if (subtabs) {
									return (
										<NavigationMenuItem key={label}>
											<NavigationMenuTrigger className={buttonVariants({variant: "outline"})}>
												{icon}
												{label}
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
													<Suspense fallback={<div>Loading...</div>}>
														{subtabs.map(({href, label, icon, slug}) => (
															<NavigationMenuLink
																key={label}
																render={
																	<Link href={href} className={slug && `theme-${slug}`}>
																		{icon}
																		{label}
																	</Link>
																}
															/>
														))}
													</Suspense>
												</ul>
											</NavigationMenuContent>
										</NavigationMenuItem>
									)
								} else {
									return (
										<NavigationMenuItem key={label}>
											<NavigationMenuLink
												className={buttonVariants({variant: "outline"})}
												render={
													<Link href={href}>
														{icon}
														{label}
													</Link>
												}
											/>
										</NavigationMenuItem>
									)
								}
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</article>
				{/* DERECHA: Acciones */}
				<article className="flex items-center gap-2">
					<MateriaSearchDialog initialSearchData={searchData} />
					<div>
						<ThemeButton />
					</div>
					<Separator orientation="vertical" className="h-10 my-auto rounded-2xl" />
					{/* Componente del usuario encapsulado con Suspense individual y Skeleton fallback */}
					<Suspense fallback={<NavUserSkeleton />}>
						<NavUser />
					</Suspense>

					<Separator orientation="vertical" className="h-10 my-auto rounded-2xl lg:hidden" />

					{/* --- DROPDOWN MÓVIL (HAMBURGUESA) --- */}
					<div className="lg:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button variant="secondary" size="icon-lg">
										<IconMenu2 />
									</Button>
								}
							/>
							<DropdownMenuContent className="w-48 max-h-[80vh] overflow-y-auto" align="end">
								<DropdownMenuGroup>
									{links.map((link) => {
										if (link.subtabs) {
											return (
												<DropdownMenuSub key={link.label}>
													<DropdownMenuSubTrigger className="flex flex-row items-center gap-2">
														{link.icon}
														{link.label}
													</DropdownMenuSubTrigger>
													<DropdownMenuSubContent className="scrollbar-none max-h-[70vh] overflow-y-auto w-48">
														<Suspense fallback={<div>Loading...</div>}>
															{link.subtabs.map(({href, label, icon, variant, slug}) => {
																const labelShort = acortarNombreCarrera(label)

																return (
																	<DropdownMenuItem
																		key={label}
																		variant={variant}
																		render={
																			<Link
																				href={href}
																				className={cn(
																					"flex flex-row items-center gap-2 w-full",
																					slug && `theme-${slug}`,
																				)}>
																				<span className="size-4">{icon}</span>
																				{labelShort}
																			</Link>
																		}
																	/>
																)
															})}
														</Suspense>
													</DropdownMenuSubContent>
												</DropdownMenuSub>
											)
										} else {
											return (
												<DropdownMenuItem
													key={link.label}
													variant={link.variant}
													render={
														<Link href={link.href} className="flex flex-row items-center gap-2 w-full">
															{link.icon}
															{link.label}
														</Link>
													}
												/>
											)
										}
									})}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</article>
			</section>
		</header>
	)
}

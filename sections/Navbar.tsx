import { Suspense } from "react"
import Link from "next/link"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeButton } from "@/components/ToggleTheme"
import { cn } from "@/lib/utils"
import { getPrimaryNavbarLinks, getSecondaryNavbarLinks } from "@/lib/navigation"
import NavUser from "@/components/NavUser"
import NavUserSkeleton from "@/components/NavUserSkeleton"
import MateriaSearchDialog from "@/components/MateriaSearchDialog"
import { getMateriasPlanSearchData } from "@/lib/carreras"
import LogoPage from "@/components/LogoPage"
import { Separator } from "@/components/ui/separator"
import NavbarShell from "@/components/navbar/NavbarShell"
import CarrerasMegaMenu from "@/components/navbar/CarrerasMegaMenu"
import MobileNavSheet from "@/components/navbar/MobileNavSheet"

export default async function Navbar() {
	const [primaryLinks, secondaryLinks, searchData] = await Promise.all([
		getPrimaryNavbarLinks(),
		getSecondaryNavbarLinks(),
		getMateriasPlanSearchData(),
	])

	return (
		<NavbarShell>
			<article className="flex flex-1 gap-6">
				<LogoPage />
				<NavigationMenu className="lg:flex hidden">
					<NavigationMenuList className="gap-1">
						{primaryLinks.map(({ label, href, icon, subtabs }) => {
							if (label === "Carreras" && subtabs) {
								return (
									<NavigationMenuItem key={label}>
										<NavigationMenuTrigger className={buttonVariants({ variant: "ghost" })}>
											{icon}
											{label}
										</NavigationMenuTrigger>
										<NavigationMenuContent>
											<div className="w-[400px] p-4">
												<CarrerasMegaMenu carreras={subtabs} />
											</div>
										</NavigationMenuContent>
									</NavigationMenuItem>
								)
							} else if (subtabs) {
								return (
									<NavigationMenuItem key={label}>
										<NavigationMenuTrigger className={buttonVariants({ variant: "ghost" })}>
											{icon}
											{label}
										</NavigationMenuTrigger>
										<NavigationMenuContent>
											<ul className="grid w-[300px] gap-1">
												{subtabs.map(({ href: subhref, label: sublabel, icon: subicon }) => (
													<NavigationMenuLink
														key={sublabel}
														render={
															<Link href={subhref} className="flex flex-row items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm">
																{subicon}
																{sublabel}
															</Link>
														}
													/>
												))}
											</ul>
										</NavigationMenuContent>
									</NavigationMenuItem>
								)
							} else {
								return (
									<NavigationMenuItem key={label}>
										<NavigationMenuLink
											className={buttonVariants({ variant: "ghost" })}
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

				{/* Componente del usuario con extras encapsulado con Suspense */}
				<Suspense fallback={<NavUserSkeleton />}>
					<NavUserWithExtras />
				</Suspense>

				<Separator orientation="vertical" className="h-10 my-auto rounded-2xl lg:hidden" />

				{/* --- SHEET MÓVIL (HAMBURGUESA) --- */}
				<div className="lg:hidden">
					<MobileNavSheet primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} />
				</div>
			</article>
		</NavbarShell>
	)
}

async function NavUserWithExtras() {
	return <NavUser />
}

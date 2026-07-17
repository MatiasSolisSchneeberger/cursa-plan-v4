import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
	IconBook,
	IconBug,
	IconCalendar,
	IconDevicesQuestion,
	IconFile,
	IconFilePencil,
	IconHelp,
	IconHome,
	IconInfoCircle,
	IconLogin,
	IconMenu2,
	IconNews,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"
import {getCarreras} from "@/lib/carreras"
import Icon from "./Icon"
import LogoPage from "./LogoPage"
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "./ui/dropdown-menu"
import {Button} from "./ui/button"
import { ModeToggle } from "./toggle-theme"

interface BaseLink {
	label: string
	icon?: React.ReactNode
	variant?: "default" | "destructive"
}

interface Subtab extends BaseLink {
	href: string
}

type Links = (Subtab & {subtabs?: never}) | (BaseLink & {subtabs: Subtab[]; href?: never})

export default async function Navbar() {
	const carreras = await getCarreras()

	const links: Links[] = [
		{
			label: "Inicio",
			href: "/",
			icon: <IconHome />,
		},

		{
			label: "Carreras",
			subtabs: carreras.map((carrera: any) => {
				return {
					label: carrera.nombre,
					href: `/carreras/${carrera.slug}`,
					icon: <Icon icon={carrera.icon} />,
				}
			}),
			icon: <IconBook />,
		},
		{
			label: "Calendario",
			href: "/calendario",
			icon: <IconCalendar />,
		},
		{
			label: "Mesas de examenes",
			href: "/mesas-examenes",
			icon: <IconDevicesQuestion />,
		},
		{
			label: "Mas",
			subtabs: [
				{
					label: "Novedades",
					href: "/novedades",
					icon: <IconNews />,
				},
				{
					label: "Sobre Nosotros",
					href: "/sobre-nosotros",
					icon: <IconInfoCircle />,
				},
				{
					label: "Preguntas Frecuentes",
					href: "/preguntas-frecuentes",
					icon: <IconHelp />,
				},
				{
					label: "Contacto",
					href: "/contacto",
					icon: <IconUsers />,
				},
				{
					label: "Términos y Condiciones",
					href: "/terminos-y-condiciones",
					icon: <IconFile />,
				},
				{
					label: "Política de Privacidad",
					href: "/politica-de-privacidad",
					icon: <IconFilePencil />,
				},
				{
					label: "Reportar error",
					href: "/errores",
					icon: <IconBug />,
					variant: "destructive",
				},
			],
			icon: <IconMenu2 />,
		},
	]

	return (
		<header className="sticky top-0 z-40 mt-2 w-full py-2">
			<section className="bg-card border-border flex flex-row gap-4 rounded-3xl border p-3 shadow-md backdrop-blur-md transition-colors duration-300">
				<article className="flex flex-1 gap-6">
					<LogoPage />
					<NavigationMenu className="md:flex hidden">
						<NavigationMenuList>
							{links.map((link) => {
								if (link.subtabs) {
									return (
										<NavigationMenuItem key={link.label}>
											<NavigationMenuTrigger>
												{link.icon}
												{link.label}
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
													{link.subtabs.map((subtab) => (
														<NavigationMenuLink
															key={subtab.label}
															render={
																<Link
																	href={subtab.href}
																	className={subtab.variant === "destructive" ? "text-destructive" : ""}>
																	{subtab.icon}
																	{subtab.label}
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
										<NavigationMenuItem key={link.label}>
											<NavigationMenuLink
												render={
													<Link href={link.href}>
														{link.icon}
														{link.label}
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
				<article className="*:border-border flex items-center gap-2 *:border-l-2 *:pl-2 *:first:border-0 *:first:pl-0">
					<div>
						<ModeToggle />
					</div>

					<div className="hidden flex-row gap-2 lg:flex">
						<Button
							variant="secondary"
							render={
								<Link href="/login">
									<IconLogin />
									Iniciar Sesión
								</Link>
							}
						/>
						<Button
							variant="default"
							render={
								<Link href="/register">
									<IconUserPlus />
									Registrarte
								</Link>
							}
						/>
					</div>
					<div className="flex flex-row gap-2 lg:hidden">
						<Button
							size={"icon-lg"}
							variant="secondary"
							render={
								<Link href="/login">
									<IconLogin />
								</Link>
							}
						/>
						<Button
							size={"icon-lg"}
							variant="default"
							render={
								<Link href="/register">
									<IconUserPlus />
								</Link>
							}
						/>
					</div>

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
							<DropdownMenuContent className="w-40" align="end">
								<DropdownMenuGroup>
									<DropdownMenuItem
										render={
											<Link href="/" className="flex flex-row items-center gap-2">
												<IconHome />
												Inicio
											</Link>
										}
									/>
									<DropdownMenuItem
										render={
											<Link href="/carreras" className="flex flex-row items-center gap-2">
												<IconBook />
												Carreras
											</Link>
										}
									/>
									<DropdownMenuItem
										render={
											<Link href="/calendario" className="flex flex-row items-center gap-2">
												<IconCalendar />
												Calendario
											</Link>
										}
									/>
								</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem
												render={
													<Link href="/login" className="flex flex-row items-center gap-2">
														<IconLogin />
														Iniciar Sesión
													</Link>
												}
											/>
											<DropdownMenuItem
												render={
													<Link href="/register" className="flex flex-row items-center gap-2">
														<IconUserPlus />
														Registrarte
													</Link>
												}
											/>
										</DropdownMenuGroup>
									
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuLabel>Información</DropdownMenuLabel>
									
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem
										render={
											<Link href="/contacto?etiqueta=error" className="flex flex-row items-center gap-2">
												<IconBug />
												Reportar error
											</Link>
										}
									/>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</article>
			</section>
		</header>
	)
}

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
	IconFile,
	IconFile3d,
	IconFilePencil,
	IconHelp,
	IconHome,
	IconInfoCircle,
	IconMenu2,
	IconNews,
	IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"
import { getCarreras } from "@/lib/carreras"

interface BaseLink {
	label: string
	icon?: React.ReactNode
	variant?: "default" | "destructive"
}

interface Subtab extends BaseLink {
	href: string
}

type Links =
	| (Subtab & { subtabs?: never })
	| (BaseLink & { subtabs: Subtab[]; href?: never })

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
		<section className="p-2">
			<nav className="bg-card border border-border">
				<NavigationMenu>
					<NavigationMenuList>
						{links.map((link) => {
							if (link.subtabs) {
								return (
									<NavigationMenuItem key={link.label}>
										<NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
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
			</nav>
		</section>
	)
}

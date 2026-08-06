import Link from "next/link"
import LogoPage from "@/components/LogoPage"
import { IconBrandGithub, IconHeart, IconShieldCheck, IconFileText, IconHelpCircle, IconInfoCircle } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
	return (
		<footer className="mt-16 w-full border-t border-border bg-card/50 backdrop-blur-md rounded-t-3xl pt-12 pb-8 px-6 sm:px-8">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* COLUMNA 1: Marca y descripción */}
				<div className="md:col-span-1 space-y-4">
					<LogoPage />
					<p className="text-sm text-muted-foreground leading-relaxed">
						Plataforma independiente para la consulta de planes de estudio, correlatividades y seguimiento académico universitario.
					</p>
				</div>

				{/* COLUMNA 2: Navegación Principal */}
				<div className="space-y-3">
					<h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Plataforma</h4>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/carreras" className="hover:text-primary transition-colors">
								Oferta de Carreras
							</Link>
						</li>
						<li>
							<Link href="/calendario" className="hover:text-primary transition-colors">
								Calendario Académico
							</Link>
						</li>
						<li>
							<Link href="/contacto" className="hover:text-primary transition-colors">
								Contacto
							</Link>
						</li>
						<li>
							<Link href="/errores" className="hover:text-primary transition-colors">
								Reportar un error
							</Link>
						</li>
					</ul>
				</div>

				{/* COLUMNA 3: Información e Institucional (Páginas MDX) */}
				<div className="space-y-3">
					<h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Información</h4>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/acerca-de" className="flex items-center gap-1.5 hover:text-primary transition-colors">
								<IconInfoCircle className="size-4 shrink-0" />
								Acerca de Cursa-Plan
							</Link>
						</li>
						<li>
							<Link href="/preguntas-frecuentes" className="flex items-center gap-1.5 hover:text-primary transition-colors">
								<IconHelpCircle className="size-4 shrink-0" />
								Preguntas Frecuentes
							</Link>
						</li>
					</ul>
				</div>

				{/* COLUMNA 4: Legales (Páginas MDX) */}
				<div className="space-y-3">
					<h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legales</h4>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/avisos-legales" className="flex items-center gap-1.5 hover:text-primary transition-colors">
								<IconShieldCheck className="size-4 shrink-0" />
								Aviso Legal
							</Link>
						</li>
						<li>
							<Link href="/terminos-y-condiciones" className="flex items-center gap-1.5 hover:text-primary transition-colors">
								<IconFileText className="size-4 shrink-0" />
								Términos y Condiciones
							</Link>
						</li>
						<li>
							<Link href="/politica-de-privacidad" className="flex items-center gap-1.5 hover:text-primary transition-colors">
								<IconShieldCheck className="size-4 shrink-0" />
								Política de Privacidad
							</Link>
						</li>
					</ul>
				</div>
			</div>

			<Separator className="my-8" />

			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
				<p>© {CURRENT_YEAR} Cursa-Plan. Sitio no oficial.</p>
				<p className="flex items-center gap-1">
					Desarrollado con <IconHeart className="size-3.5 text-destructive fill-destructive" /> para la comunidad estudiantil.
				</p>
			</div>
		</footer>
	)
}

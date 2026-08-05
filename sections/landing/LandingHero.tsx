import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {IconArrowRight, IconSparkles, IconSchool, IconCheck} from "@tabler/icons-react"

export default function LandingHero() {
	return (
		<section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
			{/* FONDO CON GRADIENTES SUAVES */}
			<div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
				<div className="size-96 rounded-full bg-primary/10 blur-3xl" />
				<div className="size-64 rounded-full bg-amber-500/10 blur-2xl -translate-x-1/2" />
			</div>

			<div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-6 max-w-4xl">
				{/* BADGE DESTACADO */}
				<Badge
					variant="outline"
					className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20 gap-1.5 shadow-2xs">
					<IconSparkles className="size-3.5 text-primary" />
					Plataforma Académica N°1 para Estudiantes
				</Badge>

				{/* TÍTULO PRINCIPAL */}
				<h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
					Tu carrera universitaria,{" "}
					<span className="bg-linear-to-r from-primary via-blue-600 to-amber-500 bg-clip-text text-transparent">
						más clara y organizada
					</span>{" "}
					que nunca.
				</h1>

				{/* DESCRIPCIÓN */}
				<p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
					Visualizá mapas de correlatividades, fechas de exámenes finales, planes de estudio y resoluciones académicas
					oficiales en un solo lugar. Planificá tu avance sin sorpresas.
				</p>

				{/* BOTONES DE ACCIÓN */}
				<div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
					<Button render={<Link href="/carreras" />} size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md">
						<IconSchool className="size-5" />
						Explorar Carreras
						<IconArrowRight className="size-4" />
					</Button>
					<Button
						render={<Link href="/register" />}
						variant="outline"
						size="lg"
						className="w-full sm:w-auto font-medium border-border">
						Crear Cuenta Gratis
					</Button>
				</div>

				{/* PUNTOS DE VALOR RÁPIDOS */}
				<div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<IconCheck className="size-4 text-emerald-500" />
						<span>100% Gratuito y Libre</span>
					</div>
					<div className="flex items-center gap-1.5">
						<IconCheck className="size-4 text-emerald-500" />
						<span>Datos Oficiales Verificados</span>
					</div>
					<div className="flex items-center gap-1.5">
						<IconCheck className="size-4 text-emerald-500" />
						<span>Sin publicidad intrusiva</span>
					</div>
				</div>

				{/* CAPTURA DE PANTALLA RECOMENDADA DE LA INTERFAZ PRINCIPAL */}
				{/* 
				<div className="pt-10 w-full">
					  ========================================================================
					  CAPTURA DE PANTALLA RECOMENDADA #1:
					  Captura panorámica en modo claro/oscuro del mapa de materias de una carrera
					  (ej. Ingeniería en Sistemas), mostrando las correlativas unidas con líneas o
					  el panel principal de materias aprobadas vs cursando.
					  ========================================================================
					<div className="relative rounded-2xl border border-border bg-card/80 p-2 md:p-4 shadow-2xl backdrop-blur-sm overflow-hidden group">
						<div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/60 bg-muted/40 rounded-t-xl text-xs text-muted-foreground font-mono">
							<div className="size-3 rounded-full bg-destructive/80" />
							<div className="size-3 rounded-full bg-amber-500/80" />
							<div className="size-3 rounded-full bg-emerald-500/80" />
							<span className="ml-2 truncate text-[11px]">cursa-plan.app/carreras/sistemas</span>
						</div>

						MOCK / PLACEHOLDER DE LA CAPTURA DE PANTALLA
						<div className="relative aspect-video w-full bg-muted/20 rounded-b-xl flex flex-col items-center justify-center p-6 text-center border-t border-border/40">
							 Reemplazar src por la ruta de tu captura de pantalla
							<img
								src="/assets/preview-hero.png"
								alt="Vista previa de CursaPlan"
								className="w-full h-full object-cover rounded-lg shadow-xs hidden group-has-[img]:block"
							/>
							<div className="flex flex-col items-center gap-3 text-muted-foreground p-8 border-2 border-dashed border-border/80 rounded-xl bg-background/50 max-w-md">
								<IconSchool className="size-10 text-primary opacity-80" />
								<div>
									<p className="text-xs font-bold text-foreground">Instrucción para captura de pantalla:</p>
									<p className="text-[11px] text-muted-foreground mt-1">
										Toma una captura de pantalla del mapa curricular o plan de estudios de una carrera y guardala en{" "}
										<code className="font-mono text-primary">/public/assets/preview-hero.png</code>.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
					*/}
			</div>
		</section>
	)
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconRocket, IconSchool } from "@tabler/icons-react"

export default function LandingCta() {
	return (
		<section className="py-16 md:py-20 container px-4 md:px-6 mx-auto">
			<div className="relative rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-indigo-600 p-8 sm:p-12 md:p-16 text-white text-center shadow-2xl overflow-hidden">
				{/* DECORACIÓN DE FONDO */}
				<div className="absolute inset-0 -z-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

				<div className="relative z-10 max-w-2xl mx-auto space-y-6">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
						<IconRocket className="size-4" />
						<span>Formá parte de CursaPlan</span>
					</div>

					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
						¿Listo para organizar tu cursada universitaria?
					</h2>

					<p className="text-sm sm:text-base text-white/80 leading-relaxed">
						Unite a la plataforma creada para simplificar tu vida estudiantil. Registrate gratis o explorá directamente los planes de tu carrera.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
						<Button render={<Link href="/register" />} size="lg" variant="secondary" className="w-full sm:w-auto font-bold shadow-md">
							Comenzar Gratis
							<IconArrowRight className="size-4 ml-1" />
						</Button>
						<Button render={<Link href="/carreras" />} size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium backdrop-blur-xs">
							<IconSchool className="size-4 mr-1.5" />
							Explorar Carreras
						</Button>
					</div>
				</div>
			</div>
		</section>
	)
}

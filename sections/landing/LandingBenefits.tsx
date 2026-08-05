import { IconClock, IconShieldCheck, IconDevices, IconTarget, IconCheck } from "@tabler/icons-react"

export default function LandingBenefits() {
	const benefits = [
		{
			icon: IconClock,
			title: "Ahorrá horas de consulta",
			description: "Olvidate de descargar PDFs pesados, buscar en grupos de WhatsApp o preguntar en bedelía. Toda la información consolidada a un clic.",
		},
		{
			icon: IconTarget,
			title: "Cero sorpresas al inscribirte",
			description: "Verificá previamente las correlatividades requeridas para cursar o rendir y armá tu cuatrimestre sobre seguro sin rebotar en SIU Guarani.",
		},
		{
			icon: IconShieldCheck,
			title: "Resoluciones Verificadas",
			description: "Información respalda con resoluciones oficiales de la facultad y el ministerio. Enlaces directos a los documentos PDF oficiales.",
		},
		{
			icon: IconDevices,
			title: "Multiplataforma Rápida",
			description: "Accedé desde tu celular, tablet o computadora. Interfaz moderna, veloz y optimizada para no gastar tus datos móviles.",
		},
	]

	return (
		<section className="py-16 md:py-24">
			<div className="container px-4 md:px-6 mx-auto space-y-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* IZQUIERDA: TITULO Y BENEFICIOS LISTADOS */}
					<div className="space-y-6">
						<div className="space-y-3">
							<span className="text-xs font-bold uppercase tracking-wider text-primary">Ventajas para el Alumno</span>
							<h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
								¿Por qué los estudiantes eligen CursaPlan?
							</h2>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Planificar la carrera universitaria no debería ser una tarea estresante ni confusa. CursaPlan simplifica la burocracia académica para que te enfoques en estudiar.
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
							{benefits.map(({ icon: Icon, title, description }) => (
								<div key={title} className="p-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card transition-colors space-y-2">
									<div className="flex items-center gap-2 text-primary font-bold text-sm">
										<div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
											<Icon className="size-4" />
										</div>
										<span>{title}</span>
									</div>
									<p className="text-xs text-muted-foreground leading-relaxed">
										{description}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* DERECHA: CAPTURA DE PANTALLA RECOMENDADA DEL PERFIL / SEGUIMIENTO */}
					<div>
						{/* 
						  ========================================================================
						  CAPTURA DE PANTALLA RECOMENDADA #3:
						  Captura de la vista de perfil de usuario o seguimiento de carrera
						  mostrando la barra de avance porcentual y lista de materias completadas.
						  ========================================================================
						*/}
						<div className="relative rounded-2xl border border-border bg-card p-4 shadow-xl overflow-hidden">
							<div className="aspect-4/3 w-full bg-muted/20 rounded-xl border border-border/80 flex items-center justify-center p-6 text-center">
								<img 
									src="/assets/preview-perfil.png" 
									alt="Vista de Perfil y Avance" 
									className="w-full h-full object-cover rounded shadow-xs hidden parent-has-[img]:block"
								/>
								<div className="flex flex-col items-center justify-center p-6 text-xs text-muted-foreground border-2 border-dashed border-border/80 rounded-lg bg-background/60 max-w-xs space-y-2">
									<IconShieldCheck className="size-8 text-primary" />
									<p className="font-bold text-foreground">Instrucción para captura de pantalla:</p>
									<p className="text-[11px]">
										Captura la vista de perfil o progreso académico y guardala en <code className="font-mono text-primary">/public/assets/preview-perfil.png</code>.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

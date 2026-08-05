import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconGitFork, IconCalendarEvent, IconBooks, IconChartLine } from "@tabler/icons-react"

export default function LandingFeatures() {
	const features = [
		{
			icon: IconGitFork,
			title: "Mapa de Correlatividades",
			description: "Entendé en segundos qué materias podés cursar o rendir. Evaluá los requisitos de cursada y final aprobados sin dudas.",
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
			borderColor: "border-blue-500/20",
		},
		{
			icon: IconCalendarEvent,
			title: "Fechas de Exámenes Finales",
			description: "Consultá la planilla oficial de mesas de exámenes organizada por turno, materias y resoluciones de cátedra.",
			color: "text-amber-500",
			bgColor: "bg-amber-500/10",
			borderColor: "border-amber-500/20",
		},
		{
			icon: IconBooks,
			title: "Planes de Estudio Oficiales",
			description: "Accedé a los distintos años de planes de estudio vigentes y sus resoluciones ministeriales y de la facultad.",
			color: "text-emerald-500",
			bgColor: "bg-emerald-500/10",
			borderColor: "border-emerald-500/20",
		},
		{
			icon: IconChartLine,
			title: "Seguimiento de Tu Progreso",
			description: "Llevá el control exacto de tus materias regularizadas, aprobadas y pendientes con estadísticas de avance.",
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
			borderColor: "border-purple-500/20",
		},
	]

	return (
		<section className="py-16 bg-muted/30 border-y border-border/60">
			<div className="container px-4 md:px-6 mx-auto space-y-12">
				{/* HEADER DE LA SECCIÓN */}
				<div className="text-center max-w-2xl mx-auto space-y-3">
					<h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
						Todo lo que necesitás para dominar tu cursada
					</h2>
					<p className="text-sm sm:text-base text-muted-foreground">
						Diseñado específicamente para resolver los problemas reales que enfrentan los alumnos en su día a día universitario.
					</p>
				</div>

				{/* GRID DE CARACTERÍSTICAS */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map(({ icon: Icon, title, description, color, bgColor, borderColor }) => (
						<Card key={title} className="border border-border bg-card shadow-xs hover:shadow-md transition-all">
							<CardHeader className="space-y-3 pb-3">
								<div className={`flex size-12 items-center justify-center rounded-xl ${bgColor} ${color} border ${borderColor} shrink-0`}>
									<Icon className="size-6" />
								</div>
								<CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-xs text-muted-foreground leading-relaxed">
									{description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>

				{/* CAPTURA DE PANTALLA RECOMENDADA DE LA PLANILLA DE FECHAS DE EXAMEN */}
				<div className="pt-6">
					{/* 
					  ========================================================================
					  CAPTURA DE PANTALLA RECOMENDADA #2:
					  Captura de la planilla de fechas de exámenes o tabla de materias 
					  mostrando turnos 1° al 10° con las fechas y resoluciones cargadas.
					  ========================================================================
					*/}
					<div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col md:flex-row items-center gap-6">
						<div className="md:w-1/2 space-y-3">
							<span className="text-xs font-bold uppercase tracking-wider text-primary">Vista de Fechas de Examen</span>
							<h3 className="text-xl font-bold text-foreground">Organizá tu calendario de estudio sin superposiciones</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Visualizá todas las materias con las fechas estipuladas para cada turno de examen final. Evitá anotarte a dos finales el mismo día y planificá tu tiempo de repaso de forma eficiente.
							</p>
						</div>

						<div className="md:w-1/2 w-full aspect-video bg-muted/30 rounded-lg border border-border flex items-center justify-center p-4 text-center overflow-hidden">
							<img 
								src="/assets/preview-fechas.png" 
								alt="Vista de Fechas de Exámenes" 
								className="w-full h-full object-cover rounded shadow-xs hidden parent-has-[img]:block"
							/>
							<div className="flex flex-col items-center justify-center p-4 text-xs text-muted-foreground border border-dashed border-border/80 rounded bg-background/60">
								<IconCalendarEvent className="size-8 text-amber-500 mb-1" />
								<p className="font-semibold text-foreground">Instrucción para captura de pantalla:</p>
								<p className="text-[11px] mt-0.5">Captura la tabla de fechas de exámenes y guardala en <code className="font-mono text-primary">/public/assets/preview-fechas.png</code>.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

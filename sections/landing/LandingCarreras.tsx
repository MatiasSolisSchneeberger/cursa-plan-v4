import CardCarrera from "@/components/CardCarrera"
import { Badge } from "@/components/ui/badge"
import type { Carrera } from "@/types/consultas"

interface LandingCarrerasProps {
	carreras: Carrera[]
}

export default function LandingCarreras({ carreras }: LandingCarrerasProps) {
	return (
		<section className="py-16 md:py-24 bg-muted/20 border-t border-border/60">
			<div className="container px-4 md:px-6 mx-auto space-y-12">
				{/* HEADER DE LA SECCIÓN */}
				<div className="text-center max-w-2xl mx-auto space-y-3">
					<Badge variant="outline" className="px-3 py-1 text-xs bg-primary/10 text-primary border-primary/20">
						Catálogo de Carreras
					</Badge>
					<h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
						Explorá los Planes de Estudio por Carrera
					</h2>
					<p className="text-sm sm:text-base text-muted-foreground">
						Seleccioná tu carrera para ver materias, correlativas, resoluciones y mesas de examen.
					</p>
				</div>

				{/* GRID DE CARRERAS */}
				{carreras.length === 0 ? (
					<div className="text-center p-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
						No se encontraron carreras registradas en el sistema.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{carreras.map(({ id, nombre, slug, icon, planes }: Carrera) => {
							const formattedPlanes =
								planes
									?.map(({ anio_inicio, materia_plan }) => ({
										anio: anio_inicio,
										hasMaterias: Boolean(materia_plan && materia_plan.length > 0),
									}))
									.sort((a, b) => b.anio - a.anio) || []

							return (
								<CardCarrera
									key={id}
									icon={icon}
									slug={slug}
									carrera={nombre}
									planes={formattedPlanes}
								/>
							)
						})}
					</div>
				)}
			</div>
		</section>
	)
}

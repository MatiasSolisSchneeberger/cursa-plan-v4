import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {getCarrerasConPlanes} from "@/lib/carreras"
import CardCarrera from "@/components/CardCarrera"

export default async function CarreraPage() {
	const carreras = await getCarrerasConPlanes()

	const filtros = [
		{
			filtro: "todos",
			label: "Ver todos",
		},
		{
			filtro: "ingenieria",
			label: "Ingenierías",
		},
		{
			filtro: "licenciatura",
			label: "Licenciaturas",
		},
		{
			filtro: "profesorado",
			label: "Profesorados",
		},
	]

	return (
		<section className="typeset relative flex w-full shrink-0 flex-col flex-wrap content-start items-center justify-center gap-6 self-stretch">
			<header>
				<h2>Carreras</h2>
			</header>

			<Tabs defaultValue="todos" className="w-full">
				<TabsList className="mx-auto">
					{filtros.map(({filtro, label}) => {
						return (
							<TabsTrigger key={label} value={filtro}>
								{label}
							</TabsTrigger>
						)
					})}
				</TabsList>
				{filtros.map(({filtro}) => {
					return (
						<TabsContent
							key={filtro}
							value={filtro}
							className="relative grid w-full shrink-0 grid-cols-1 flex-wrap content-start items-start justify-start gap-6 self-stretch md:grid-cols-2 lg:grid-cols-3">
							{carreras
								.filter((carrera) => {
									if (filtro === "todos") return true
									return carrera.slug.includes(filtro)
								})
								.map(({icon, id, nombre, planes, slug}) => {
									const formattedPlanes =
										planes
											?.map((p) => ({
												anio: p.anio_inicio,
												hasMaterias: p.materia_plan && p.materia_plan.length > 0,
											}))
											.sort((a, b) => b.anio - a.anio) || []
									return <CardCarrera key={id} icon={icon} slug={slug} carrera={nombre} planes={formattedPlanes} />
								})}
						</TabsContent>
					)
				})}
			</Tabs>
		</section>
	)
}

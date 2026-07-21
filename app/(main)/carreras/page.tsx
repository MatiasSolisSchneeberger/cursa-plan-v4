import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {getCarrerasConPlanes} from "@/lib/carreras"
import CardCarrera, {CardCarreraSkeleton} from "@/components/CardCarrera"
import {Skeleton} from "@/components/ui/skeleton"
import {Suspense} from "react"

export default function CarreraPage() {
	return (
		<section className="typeset relative flex w-full shrink-0 flex-col flex-wrap content-start items-center justify-center gap-6 self-stretch">
			<header>
				<h2>Carreras</h2>
			</header>

			<Suspense fallback={<CarrerasSkeleton />}>
				<CarrerasContent />
			</Suspense>
		</section>
	)
}

async function CarrerasContent() {
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
								return (
									<CardCarrera key={id} icon={icon} slug={slug} carrera={nombre} planes={formattedPlanes} />
								)
							})}
					</TabsContent>
				)
			})}
		</Tabs>
	)
}

function CarrerasSkeleton() {
	const filtros = ["Ver todos", "Ingenierías", "Licenciaturas", "Profesorados"]
	return (
		<div className="w-full space-y-6">
			<div className="flex justify-center">
				<div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground gap-1">
					{filtros.map((label) => (
						<Skeleton key={label} className="h-7 w-28 bg-muted-foreground/10 rounded-md" />
					))}
				</div>
			</div>
			<div className="relative grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<CardCarreraSkeleton key={i} />
				))}
			</div>
		</div>
	)
}

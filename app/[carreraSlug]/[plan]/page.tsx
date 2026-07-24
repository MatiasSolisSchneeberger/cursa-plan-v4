import {getPlanEstudio} from "@/lib/carreras"
import {PlanView} from "@/components/plan-view"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Item, ItemActions, ItemContent, ItemGroup, ItemHeader, ItemMedia, ItemTitle} from "@/components/ui/item"
import {IconInfoCircle} from "@tabler/icons-react"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
	}>
}

export default async function PlanPage({params}: PageProps) {
	const resolvedParams = await params
	const {carreraSlug, plan} = resolvedParams

	const planData = await getPlanEstudio(plan, carreraSlug)

	return (
		<section className="flex flex-col gap-6 py-4 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto">
			<Card>
				<CardHeader className="typeset">
					<h1>{planData.carrera.nombre}</h1>
				</CardHeader>
				<CardContent className="text-muted-foreground text-lg">
					<div className="flex flex-row flex-wrap gap-3">
						<Item variant="outline" size="sm" className="flex-1 min-w-[200px] max-w-sm">
							<ItemMedia>
								<IconInfoCircle className="size-5" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Plan de estudio: {planData.anioInicio}{planData.anioFin && (<> - {planData.anioFin}</>)}</ItemTitle>
							</ItemContent>
						</Item>
					</div>
				</CardContent>
			</Card>

			<PlanView planData={planData} carreraSlug={carreraSlug} planIdOrYear={plan} />
		</section>
	)
}

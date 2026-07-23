import { getPlanEstudio } from "@/lib/carreras"
import { PlanView } from "@/components/plan-view"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
	}>
}

export default async function PlanPage({ params }: PageProps) {
	const resolvedParams = await params
	const { carreraSlug, plan } = resolvedParams

	const planData = await getPlanEstudio(plan, carreraSlug)

	return (
		<div className="container py-8 max-w-7xl mx-auto">
			<div className="mb-8">
				<h1 className="text-4xl font-bold tracking-tight mb-2">
					Plan de Estudios
				</h1>
				<p className="text-muted-foreground text-lg">
					{planData.carrera.nombre} ({planData.anioInicio})
				</p>
			</div>
			
			<PlanView 
				planData={planData} 
				carreraSlug={carreraSlug} 
				planIdOrYear={plan} 
			/>
		</div>
	)
}
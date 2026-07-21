import { getPagePlanData } from "@/lib/carreras"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
	}>
}

export default async function PlanPage({ params }: PageProps) {
	const resolvedParams = await params
	const { carreraSlug, plan } = resolvedParams

	const planData = await getPagePlanData(plan, carreraSlug)

	return (
		<pre style={{ padding: "20px", overflow: "auto", fontFamily: "monospace" }}>
			{JSON.stringify(planData, null, 2)}
		</pre>
	)
}
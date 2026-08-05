import { redirect } from "next/navigation"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
		materia: string
	}>
}

export default async function CorrelativasPage({ params }: PageProps) {
	const { carreraSlug, plan, materia } = await params
	redirect(`/${carreraSlug}/${plan}/${materia}#correlativas`)
}

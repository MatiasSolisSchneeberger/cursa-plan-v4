import { redirect } from "next/navigation"
import { rutaMateria } from "@/lib/rutas"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
		materia: string
	}>
}

export default async function RecursosPage({ params }: PageProps) {
	const { carreraSlug, plan, materia } = await params
	redirect(rutaMateria(carreraSlug, plan, materia))
}

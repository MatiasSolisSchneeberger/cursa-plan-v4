import { getAdminCarreras } from "@/lib/carrerasAdmin"
import CarrerasAdminView from "@/sections/admin/carreras/CarrerasAdminView"

export const metadata = {
	title: "Gestión de Carreras | CursaPlan Admin",
	description: "Administración de carreras del sistema CursaPlan.",
}

export default async function AdminCarrerasPage() {
	const data = await getAdminCarreras()

	return <CarrerasAdminView data={data} />
}

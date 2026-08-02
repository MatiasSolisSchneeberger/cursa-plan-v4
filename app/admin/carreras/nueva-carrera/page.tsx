import { getResolucionesCatalog } from "@/lib/carrerasAdmin"
import CarreraFormView from "@/sections/admin/carreras/CarreraFormView"

export const metadata = {
	title: "Nueva Carrera | CursaPlan Admin",
	description: "Crear una nueva carrera en el sistema CursaPlan.",
}

export default async function NuevaCarreraPage() {
	const resoluciones = await getResolucionesCatalog()

	return (
		<CarreraFormView
			isNew={true}
			initialData={null}
			initialResoluciones={resoluciones}
		/>
	)
}

import {getFechasExamenesPlanilla} from "@/lib/fechasExamenesAdmin"
import FechasExamenesTable from "@/sections/admin/fechas-examenes/FechasExamenesTable"

export const metadata = {
	title: "Gestión de Fechas de Exámenes | CursaPlan Admin",
	description: "Administración de fechas de exámenes por materia y turnos.",
}

export default async function FechasExamenesPage() {
	const data = await getFechasExamenesPlanilla()

	return <FechasExamenesTable data={data} />
}

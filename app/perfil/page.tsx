import { getCurrentUser } from "@/lib/auth"
import { getDatosPerfilInicio } from "@/lib/carreras"
import PerfilInicioClient from "@/components/perfil/PerfilInicioClient"
import { redirect } from "next/navigation"

export const metadata = {
	title: "Inicio | Mi Perfil - CursaPlan",
	description: "Resumen principal del perfil de usuario, materias en cursada, carreras favoritas y estadísticas.",
}

export default async function PerfilInicioPage() {
	const userRes = await getCurrentUser()

	if (!userRes.success || !userRes.data?.user) {
		redirect("/login?next=/perfil")
	}

	const perfilData = await getDatosPerfilInicio(userRes.data.user.id)

	return <PerfilInicioClient data={perfilData} />
}

import { getCurrentUser } from "@/lib/auth"
import ConfiguracionClient from "@/sections/perfil/ConfiguracionClient"
import { redirect } from "next/navigation"
import type { PerfilUsuario } from "@/types/consultas"

export const metadata = {
	title: "Configuración de Perfil | CursaPlan",
	description: "Gestión de perfil de usuario, cambio de nombre, apodo, contraseña y ajustes de cuenta.",
}

export default async function ConfiguracionPage() {
	const userRes = await getCurrentUser()

	if (!userRes.success || !userRes.data?.user) {
		redirect("/login?next=/perfil/configuracion")
	}

	const user = userRes.data.user
	const perfilUser: PerfilUsuario = {
		id: user.id,
		username: user.username,
		fullName: user.full_name,
		avatarUrl: user.avatar_url,
		role: user.role,
		icon: user.icon,
	}

	return <ConfiguracionClient user={perfilUser} email={user.email || ""} />
}

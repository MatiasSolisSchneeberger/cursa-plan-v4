"use client"

import ConfiguracionPersonalSection from "./sections/ConfiguracionPersonalSection"
import ConfiguracionSeguridadSection from "./sections/ConfiguracionSeguridadSection"
import ConfiguracionPeligroSection from "./sections/ConfiguracionPeligroSection"
import type { PerfilUsuario } from "@/types/consultas"

interface ConfiguracionClientProps {
	user: PerfilUsuario
	email?: string
}

export default function ConfiguracionClient({ user, email = "" }: ConfiguracionClientProps) {
	return (
		<div className="flex flex-col gap-8 max-w-4xl pb-12">
			{/* HEADER DE SECCIÓN */}
			<header className="flex flex-col gap-1">
				<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
					Configuración de la Cuenta
				</h1>
				<p className="text-sm text-muted-foreground">
					Gestiona tus datos personales, apodo, seguridad de contraseña y preferencias de perfil.
				</p>
			</header>

			{/* SECCIÓN 1: DATOS PERSONALES */}
			<ConfiguracionPersonalSection user={user} email={email} />

			{/* SECCIÓN 2: SEGURIDAD Y CONTRASEÑA */}
			<ConfiguracionSeguridadSection />

			{/* SECCIÓN 3: ZONA DE PELIGRO (UI ONLY) */}
			<ConfiguracionPeligroSection />
		</div>
	)
}

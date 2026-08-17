"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldDescription,
} from "@/components/ui/field"
import { IconUser, IconMail, IconInfoCircle, IconCheck, IconAlertTriangle, IconLoader } from "@tabler/icons-react"
import { setPerfilUsuario } from "@/lib/actions"
import type { PerfilUsuario } from "@/types/consultas"

interface ConfiguracionPersonalSectionProps {
	user: PerfilUsuario
	email?: string
}

export default function ConfiguracionPersonalSection({ user, email = "" }: ConfiguracionPersonalSectionProps) {
	const router = useRouter()
	const { fullName: initialFullName, username: initialUsername } = user

	const [fullName, setFullName] = useState(initialFullName || "")
	const [username, setUsername] = useState(initialUsername || "")
	const [isSavingProfile, setIsSavingProfile] = useState(false)
	const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault()
		setProfileMessage(null)
		setIsSavingProfile(true)

		try {
			const success = await setPerfilUsuario({
				fullName: fullName.trim(),
				username: username.trim(),
			})

			if (success) {
				setProfileMessage({ type: "success", text: "Tu información de perfil se actualizó correctamente." })
				router.refresh()
			} else {
				setProfileMessage({ type: "error", text: "No se pudo actualizar el perfil. Inténtalo de nuevo." })
			}
		} catch {
			setProfileMessage({ type: "error", text: "Ocurrió un error inesperado al guardar los cambios." })
		} finally {
			setIsSavingProfile(false)
		}
	}

	return (
		<section>
			<Card className="border border-border shadow-xs">
				<form onSubmit={handleSaveProfile}>
					<CardHeader className="border-b border-border/60 pb-4">
						<header className="flex items-center gap-2">
							<IconUser className="size-5 text-primary" />
							<CardTitle className="text-lg font-bold">Información Personal</CardTitle>
						</header>
						<CardDescription className="text-xs">
							Actualiza tu nombre completo y nombre de usuario visible en la plataforma.
						</CardDescription>
					</CardHeader>

					<CardContent className="pt-6">
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="fullName">Nombre Completo</FieldLabel>
								<Input
									id="fullName"
									type="text"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									placeholder="Ej: Matías Solís"
									required
								/>
								<FieldDescription>
									Tu nombre completo tal como aparecerá en reportes e interfaz.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="username">Apodo / Nombre de Usuario</FieldLabel>
								<Input
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Ej: matiassolis"
									required
								/>
								<FieldDescription>
									Tu identificador único de usuario en CursaPlan.
								</FieldDescription>
							</Field>

							<Field>
								<div className="flex items-center justify-between">
									<FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
									<Badge variant="outline" className="text-[10px] text-muted-foreground gap-1">
										<IconMail className="size-3" />
										No editable
									</Badge>
								</div>
								<Input
									id="email"
									type="email"
									value={email || "usuario@ejemplo.com"}
									disabled
									className="bg-muted/50 cursor-not-allowed opacity-75"
								/>
								<FieldDescription className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 mt-1">
									<IconInfoCircle className="size-3.5 shrink-0" />
									<span>El correo electrónico no se puede modificar desde aquí.</span>
								</FieldDescription>
							</Field>
						</FieldGroup>

						{profileMessage && (
							<Alert variant={profileMessage.type === "success" ? "default" : "destructive"} className="mt-4">
								{profileMessage.type === "success" ? (
									<IconCheck className="size-4 text-emerald-500" />
								) : (
									<IconAlertTriangle className="size-4" />
								)}
								<AlertTitle>
									{profileMessage.type === "success" ? "Cambios guardados" : "Error"}
								</AlertTitle>
								<AlertDescription>{profileMessage.text}</AlertDescription>
							</Alert>
						)}
					</CardContent>

					<CardFooter className="border-t border-border/60 justify-end pt-4">
						<Button type="submit" disabled={isSavingProfile}>
							{isSavingProfile && <IconLoader className="size-4 animate-spin" data-icon="inline-start" />}
							<span>Guardar Cambios</span>
						</Button>
					</CardFooter>
				</form>
			</Card>
		</section>
	)
}

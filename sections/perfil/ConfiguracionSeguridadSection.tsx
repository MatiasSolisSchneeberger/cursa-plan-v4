"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldDescription,
} from "@/components/ui/field"
import { IconLock, IconShieldCheck, IconAlertTriangle, IconLoader } from "@tabler/icons-react"
import { updatePassword } from "@/lib/auth"

export default function ConfiguracionSeguridadSection() {
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [isSavingPassword, setIsSavingPassword] = useState(false)
	const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

	const handleSavePassword = async (e: React.FormEvent) => {
		e.preventDefault()
		setPasswordMessage(null)

		if (newPassword.length < 6) {
			setPasswordMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." })
			return
		}

		if (newPassword !== confirmPassword) {
			setPasswordMessage({ type: "error", text: "Las contraseñas ingresadas no coinciden." })
			return
		}

		setIsSavingPassword(true)

		try {
			const res = await updatePassword(newPassword)
			if (res.success) {
				setPasswordMessage({ type: "success", text: "Tu contraseña ha sido actualizada con éxito." })
				setNewPassword("")
				setConfirmPassword("")
			} else {
				setPasswordMessage({ type: "error", text: res.error || "Error al actualizar la contraseña." })
			}
		} catch {
			setPasswordMessage({ type: "error", text: "Ocurrió un error inesperado al actualizar la contraseña." })
		} finally {
			setIsSavingPassword(false)
		}
	}

	return (
		<section>
			<Card className="border border-border shadow-xs">
				<form onSubmit={handleSavePassword}>
					<CardHeader className="border-b border-border/60 pb-4">
						<header className="flex items-center gap-2">
							<IconLock className="size-5 text-primary" />
							<CardTitle className="text-lg font-bold">Seguridad y Contraseña</CardTitle>
						</header>
						<CardDescription className="text-xs">
							Actualiza la contraseña de acceso a tu cuenta.
						</CardDescription>
					</CardHeader>

					<CardContent className="pt-6">
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="newPassword">Nueva Contraseña</FieldLabel>
								<Input
									id="newPassword"
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="••••••••"
									minLength={6}
									required
								/>
								<FieldDescription>
									Mínimo 6 caracteres. Te recomendamos combinar letras y números.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="confirmPassword">Confirmar Nueva Contraseña</FieldLabel>
								<Input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="••••••••"
									minLength={6}
									required
								/>
							</Field>
						</FieldGroup>

						{passwordMessage && (
							<Alert variant={passwordMessage.type === "success" ? "default" : "destructive"} className="mt-4">
								{passwordMessage.type === "success" ? (
									<IconShieldCheck className="size-4 text-emerald-500" />
								) : (
									<IconAlertTriangle className="size-4" />
								)}
								<AlertTitle>
									{passwordMessage.type === "success" ? "Contraseña actualizada" : "Error de contraseña"}
								</AlertTitle>
								<AlertDescription>{passwordMessage.text}</AlertDescription>
							</Alert>
						)}
					</CardContent>

					<CardFooter className="border-t border-border/60 justify-end pt-4">
						<Button type="submit" disabled={isSavingPassword}>
							{isSavingPassword && <IconLoader className="size-4 animate-spin" data-icon="inline-start" />}
							<span>Actualizar Contraseña</span>
						</Button>
					</CardFooter>
				</form>
			</Card>
		</section>
	)
}

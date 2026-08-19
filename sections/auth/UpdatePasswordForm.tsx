"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updatePassword } from "@/lib/auth"

export function UpdatePasswordForm() {
	const router = useRouter()
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)

		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden.")
			return
		}

		if (password.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres.")
			return
		}

		setLoading(true)

		try {
			const res = await updatePassword(password)

			if (!res.success) {
				setError(res.error || "Ocurrió un error al actualizar la contraseña.")
			} else {
				setSuccess("¡Contraseña actualizada exitosamente! Redirigiendo...")
				setTimeout(() => {
					router.push("/login")
				}, 1500)
			}
		} catch (err) {
			console.error(err)
			setError("Ocurrió un error inesperado. Inténtalo de nuevo.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="w-full h-full flex items-center justify-center py-6">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-title">Nueva Contraseña</CardTitle>
					<CardDescription>Ingresa tu nueva contraseña para actualizar tu acceso</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 p-3 rounded bg-destructive/15 text-destructive text-sm font-medium">
							{error}
						</div>
					)}
					{success && (
						<div className="mb-4 p-3 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
							{success}
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="password">Nueva Contraseña</FieldLabel>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm-password">Confirmar Contraseña</FieldLabel>
								<Input
									id="confirm-password"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</Field>
							<Field className="pt-2">
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Actualizando..." : "Actualizar Contraseña"}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</section>
	)
}

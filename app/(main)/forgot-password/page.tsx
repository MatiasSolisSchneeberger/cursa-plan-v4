"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPassword } from "@/lib/auth"
import Link from "next/link"

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)
		setLoading(true)

		try {
			const res = await resetPassword(email)

			if (!res.success) {
				setError(res.error || "Ocurrió un error al solicitar recuperación de contraseña.")
			} else {
				setSuccess(res.message || "Se ha enviado un correo con instrucciones para restablecer tu contraseña.")
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
					<CardTitle className="text-2xl font-title">Recuperar Contraseña</CardTitle>
					<CardDescription>Ingresa tu correo para recibir un enlace de recuperación</CardDescription>
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
								<FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@ejemplo.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Field>
							<Field className="pt-2">
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Enviando enlace..." : "Enviar enlace de recuperación"}
								</Button>
								<FieldDescription className="text-center mt-2">
									¿Recordaste tu contraseña?{" "}
									<Link href="/login" className="font-semibold text-foreground hover:text-primary hover:underline underline-offset-4">
										Volver a Iniciar sesión
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</section>
	)
}

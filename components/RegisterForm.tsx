"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/auth"
import Link from "next/link"
import { buildLoginUrl } from "@/utils/redirect"

interface RegisterFormProps {
	next: string
}

export default function RegisterForm({ next }: RegisterFormProps) {
	const router = useRouter()
	const [fullName, setFullName] = useState("")
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
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
			const res = await signUp({
				fullName,
				username,
				email,
				password,
			})

			if (!res.success) {
				setError(res.error || "Ocurrió un error al registrar la cuenta.")
			} else {
				setSuccess("¡Cuenta creada exitosamente! Redirigiendo...")
				setTimeout(() => {
					router.replace(buildLoginUrl(next))
					router.refresh()
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
					<CardTitle className="text-2xl font-title">Registrarse</CardTitle>
					<CardDescription>Crea una cuenta para organizar tu plan de estudios</CardDescription>
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
								<FieldLabel htmlFor="fullName">Nombre completo</FieldLabel>
								<Input
									id="fullName"
									type="text"
									placeholder="Tu nombre y apellido"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
								<Input
									id="username"
									type="text"
									placeholder="usuario123"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
								/>
							</Field>
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
							<Field>
								<FieldLabel htmlFor="password">Contraseña</FieldLabel>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm-password">Confirmar contraseña</FieldLabel>
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
									{loading ? "Creando cuenta..." : "Registrarse"}
								</Button>
								<FieldDescription className="text-center mt-2">
									¿Ya tienes una cuenta?{" "}
									<Link
										href={buildLoginUrl(next)}
										className="font-semibold text-foreground hover:text-primary hover:underline underline-offset-4">
										Iniciar sesión
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

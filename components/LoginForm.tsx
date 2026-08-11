"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signInWithEmail } from "@/lib/auth"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconCheck, IconX } from "@tabler/icons-react"
import { Checkbox } from "@/components/ui/checkbox"
import { buildLoginUrl } from "@/utils/redirect"

interface LoginFormProps {
	next: string
}

export default function LoginForm({ next }: LoginFormProps) {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)
		setLoading(true)

		try {
			const res = await signInWithEmail({
				email,
				password,
			})

			if (!res.success) {
				setError(res.error || "Ocurrió un error al iniciar sesión.")
			} else {
				setSuccess("¡Inicio de sesión exitoso! Redirigiendo...")
				setTimeout(() => {
					router.replace(next)
					router.refresh()
				}, 500)
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
					<CardTitle className="text-2xl font-title">Iniciar Sesión</CardTitle>
					<CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive">
							<IconX />
							<AlertTitle>Hubo un error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					{success && (
						<Alert variant="success">
							<IconCheck />
							<AlertTitle>{success}</AlertTitle>
						</Alert>
					)}
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="usuario@ejemplo.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="email"
									required
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Contraseña</FieldLabel>
									<Link
										href="/forgot-password"
										className="ml-auto text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4">
										¿Olvidaste tu contraseña?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="current-password"
									required
								/>
							</Field>
							<Field orientation="horizontal" className="items-center gap-2 py-1">
								<Checkbox id="keep-session" name="keep-session" />
								<FieldLabel
									htmlFor="keep-session"
									className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
									Guardar sesión abierta
								</FieldLabel>
							</Field>
							<Field className="pt-2">
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Iniciando sesión..." : "Iniciar Sesión"}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						variant="outline"
						className="w-full"
						render={<Link href={buildLoginUrl(next).replace("/login", "/register")}>¿No tenes cuenta?</Link>}
					/>
				</CardFooter>
			</Card>
		</section>
	)
}

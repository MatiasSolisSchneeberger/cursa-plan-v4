"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
	return (
		<section className="w-full h-full flex items-center justify-center py-6">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-title">Iniciar Sesión</CardTitle>
					<CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={(e) => e.preventDefault()}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
								<Input id="email" type="email" placeholder="m@ejemplo.com" required />
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
								<Input id="password" type="password" required />
							</Field>
							<Field orientation="horizontal" className="items-center gap-2 py-1">
								<input
									id="keep-session"
									type="checkbox"
									className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-ring cursor-pointer"
								/>
								<FieldLabel
									htmlFor="keep-session"
									className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
									Guardar sesión abierta
								</FieldLabel>
							</Field>
							<Field className="pt-2">
								<Button type="submit" className="w-full">
									Iniciar Sesión
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Button variant="outline" className="w-full" render={<Link href="/register">¿No tenes cuenta?</Link>} />
				</CardFooter>
			</Card>
		</section>
	)
}

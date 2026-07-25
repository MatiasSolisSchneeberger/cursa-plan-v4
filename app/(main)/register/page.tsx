"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import Link from "next/link"

export default function RegisterPage() {
	return (
		<section className="w-full h-full flex items-center justify-center py-6">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-title">Registrarse</CardTitle>
					<CardDescription>Crea una cuenta para organizar tu plan de estudios</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={(e) => e.preventDefault()}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">Nombre completo</FieldLabel>
								<Input id="name" type="text" placeholder="Tu nombre y apellido" required />
							</Field>
							<Field>
								<FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
								<Input id="email" type="email" placeholder="m@ejemplo.com" required />
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Contraseña</FieldLabel>
								<Input id="password" type="password" required />
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm-password">Confirmar contraseña</FieldLabel>
								<Input id="confirm-password" type="password" required />
							</Field>
							<Field orientation="horizontal" className="items-center gap-2 py-1">
								<input
									id="keep-session"
									type="checkbox"
									className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-ring cursor-pointer"
								/>
								<FieldLabel htmlFor="keep-session" className="text-sm font-normal text-muted-foreground cursor-pointer select-none">
									Guardar sesión abierta
								</FieldLabel>
							</Field>
							<Field className="pt-2">
								<Button type="submit" className="w-full">Registrarse</Button>
								<FieldDescription className="text-center mt-2">
									¿Ya tienes una cuenta?{" "}
									<Link href="/login" className="font-semibold text-foreground hover:text-primary hover:underline underline-offset-4">
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

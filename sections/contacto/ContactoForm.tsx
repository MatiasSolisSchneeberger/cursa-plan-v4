"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldDescription,
} from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconMail, IconAlertTriangle, IconCheck, IconLoader } from "@tabler/icons-react"
import { setContacto } from "@/lib/actions"

const MOTIVO_OPTS = [
	{ value: "general", label: "Consulta general" },
	{ value: "error-datos", label: "Error en los datos" },
	{ value: "bug", label: "Reportar un bug" },
	{ value: "sugerencia", label: "Sugerencia de mejora" },
] as const

export default function ContactoForm() {
	const [nombre, setNombre] = useState("")
	const [email, setEmail] = useState("")
	const [motivo, setMotivo] = useState<"general" | "error-datos" | "bug" | "sugerencia">("general")
	const [mensaje, setMensaje] = useState("")
	const [isSending, setIsSending] = useState(false)
	const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setFormMessage(null)
		setIsSending(true)

		try {
			const result = await setContacto({
				nombre: nombre.trim(),
				email: email.trim(),
				mensaje: mensaje.trim(),
				etiqueta: motivo,
			})

			if (result.success) {
				setFormMessage({ type: "success", text: "Tu mensaje fue enviado correctamente. Nos pondremos en contacto pronto." })
				setNombre("")
				setEmail("")
				setMensaje("")
				setMotivo("general")
			} else {
				setFormMessage({ type: "error", text: result.error || "No se pudo enviar el mensaje. Intenta más tarde." })
			}
		} catch {
			setFormMessage({ type: "error", text: "Ocurrió un error inesperado. Intenta más tarde." })
		} finally {
			setIsSending(false)
		}
	}

	return (
		<section className="my-8">
			<Card className="border border-border shadow-xs">
				<form onSubmit={handleSubmit}>
					<CardHeader className="border-b border-border/60 pb-4">
						<header className="flex items-center gap-2">
							<IconMail className="size-5 text-primary" />
							<CardTitle className="text-lg font-bold">Formulario de Contacto</CardTitle>
						</header>
						<CardDescription className="text-xs">
							Dejá tu mensaje y te responderemos a la brevedad.
						</CardDescription>
					</CardHeader>

					<CardContent className="pt-6">
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="nombre">Nombre Completo</FieldLabel>
								<Input
									id="nombre"
									type="text"
									value={nombre}
									onChange={(e) => setNombre(e.target.value)}
									placeholder="Ej: Juan García"
									required
									minLength={2}
									maxLength={100}
									disabled={isSending}
								/>
								<FieldDescription>
									Tu nombre para que podamos dirigirnos a vos.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Ej: juan@ejemplo.com"
									required
									maxLength={254}
									disabled={isSending}
								/>
								<FieldDescription>
									A esta dirección te responderemos.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="motivo">Tipo de Consulta</FieldLabel>
								<Select value={motivo} onValueChange={(val) => setMotivo(val as typeof motivo)} disabled={isSending}>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{MOTIVO_OPTS.map(({ value, label }) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldDescription>
									Ayúdanos a clasificar tu consulta.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="mensaje">Mensaje</FieldLabel>
								<Textarea
									id="mensaje"
									value={mensaje}
									onChange={(e) => setMensaje(e.target.value)}
									placeholder="Contanos en detalle qué necesitás..."
									required
									minLength={10}
									maxLength={2000}
									disabled={isSending}
								/>
								<FieldDescription>
									Mínimo 10 caracteres, máximo 2000.
								</FieldDescription>
							</Field>

							{formMessage && (
								<Alert variant={formMessage.type === "success" ? "default" : "destructive"}>
									{formMessage.type === "success" ? (
										<IconCheck className="size-4 text-emerald-500" />
									) : (
										<IconAlertTriangle className="size-4" />
									)}
									<AlertTitle>
										{formMessage.type === "success" ? "Éxito" : "Error"}
									</AlertTitle>
									<AlertDescription>{formMessage.text}</AlertDescription>
								</Alert>
							)}
						</FieldGroup>
					</CardContent>

					<CardFooter className="border-t border-border/60 justify-end pt-4">
						<Button type="submit" disabled={isSending}>
							{isSending && <IconLoader className="size-4 animate-spin" data-icon="inline-start" />}
							<span>{isSending ? "Enviando..." : "Enviar Mensaje"}</span>
						</Button>
					</CardFooter>
				</form>
			</Card>
		</section>
	)
}

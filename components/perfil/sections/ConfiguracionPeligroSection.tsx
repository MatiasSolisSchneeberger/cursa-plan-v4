"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
	Field,
	FieldLabel,
} from "@/components/ui/field"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import { IconTrash, IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react"

export default function ConfiguracionPeligroSection() {
	const [confirmText, setConfirmText] = useState("")
	const [dangerNotice, setDangerNotice] = useState<string | null>(null)

	const handleMockDeleteAccount = () => {
		setDangerNotice("Esta es una vista previa de la UI. La eliminación definitiva de la cuenta estará disponible próximamente.")
	}

	return (
		<section>
			<Card className="border border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
				<CardHeader className="border-b border-destructive/20 pb-4">
					<header className="flex items-center gap-2 text-destructive">
						<IconTrash className="size-5" />
						<CardTitle className="text-lg font-bold text-destructive">Zona de Peligro</CardTitle>
					</header>
					<CardDescription className="text-xs text-destructive/80">
						Acciones irreversibles sobre tu cuenta de usuario.
					</CardDescription>
				</CardHeader>

				<CardContent className="pt-6 flex flex-col gap-4">
					<article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex flex-col gap-1">
							<h3 className="text-sm font-semibold text-foreground">Eliminar Cuenta de Usuario</h3>
							<p className="text-xs text-muted-foreground max-w-md">
								Al eliminar tu cuenta se borrarán permanentemente todos tus avances de materias, planes favoritos y configuraciones guardadas.
							</p>
						</div>

						<Dialog>
							<DialogTrigger render={
								<Button variant="destructive" size="sm" className="shrink-0 gap-2">
									<IconTrash data-icon="inline-start" />
									<span>Eliminar Cuenta</span>
								</Button>
							} />

							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle className="text-destructive flex items-center gap-2">
										<IconAlertTriangle className="size-5" />
										<span>¿Eliminar tu cuenta?</span>
									</DialogTitle>
									<DialogDescription className="text-xs pt-1">
										Esta acción es irreversible y eliminará todos tus datos académicos registrados en CursaPlan.
									</DialogDescription>
								</DialogHeader>

								<div className="flex flex-col gap-3 py-2">
									<Field>
										<FieldLabel className="text-xs font-medium">
											Escribe <strong className="text-destructive font-mono">ELIMINAR</strong> para confirmar:
										</FieldLabel>
										<Input
											type="text"
											value={confirmText}
											onChange={(e) => setConfirmText(e.target.value)}
											placeholder="ELIMINAR"
											className="font-mono text-sm"
										/>
									</Field>

									{dangerNotice && (
										<Alert className="bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400">
											<IconInfoCircle className="size-4" />
											<AlertDescription className="text-xs">
												{dangerNotice}
											</AlertDescription>
										</Alert>
									)}
								</div>

								<DialogFooter className="gap-2 sm:gap-0">
									<DialogClose render={
										<Button variant="outline" size="sm">Cancelar</Button>
									} />
									<Button
										variant="destructive"
										size="sm"
										disabled={confirmText !== "ELIMINAR"}
										onClick={handleMockDeleteAccount}
									>
										Confirmar Eliminación
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</article>
				</CardContent>
			</Card>
		</section>
	)
}

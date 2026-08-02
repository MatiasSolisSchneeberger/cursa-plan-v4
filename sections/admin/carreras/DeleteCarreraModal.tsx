"use client"

import * as React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconTrash, IconLoader2, IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react"
import Icon from "@/components/Icon"
import { deleteCarrera, type CarreraAdminItem } from "@/lib/carrerasAdmin"

interface DeleteCarreraModalProps {
	isOpen: boolean
	onClose: () => void
	carrera: CarreraAdminItem | null
	onSuccess: () => void
}

export default function DeleteCarreraModal({ isOpen, onClose, carrera, onSuccess }: DeleteCarreraModalProps) {
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	if (!carrera) return null

	const handleDelete = async () => {
		setLoading(true)
		setErrorMessage(null)

		const result = await deleteCarrera(carrera.id)

		setLoading(false)

		if (!result.success) {
			setErrorMessage(result.error || "Ocurrió un error al intentar eliminar la carrera.")
			return
		}

		onSuccess()
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
			<DialogContent className="sm:max-w-[440px] border-border bg-card">
				<DialogHeader>
					<div className="flex items-center gap-2 text-destructive">
						<IconAlertTriangle className="size-5" />
						<DialogTitle>Eliminar Carrera</DialogTitle>
					</div>
					<DialogDescription className="text-xs text-muted-foreground">
						Esta acción no se puede deshacer. Se eliminará la carrera del sistema.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					{errorMessage && (
						<Alert variant="destructive" className="py-2 text-xs flex items-center gap-2">
							<IconAlertCircle className="size-4 shrink-0" />
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					)}

					<div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
						<div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
							<Icon icon={carrera.icon || "device-imac"} className="size-5" />
						</div>
						<div className="flex flex-col min-w-0">
							<span className="font-semibold text-sm text-foreground truncate">{carrera.nombre}</span>
							<span className="text-xs font-mono text-muted-foreground truncate">/{carrera.slug}</span>
						</div>
					</div>

					{carrera.planesCount > 0 && (
						<p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-md border border-amber-500/20">
							⚠️ Esta carrera posee <strong>{carrera.planesCount}</strong> plan(es) de estudio asociado(s). Deberás eliminar o desvincular los planes antes de borrar la carrera.
						</p>
					)}
				</div>

				<DialogFooter className="pt-2 gap-2 sm:gap-0">
					<Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading} className="text-xs">
						Cancelar
					</Button>
					<Button
						type="button"
						variant="destructive"
						size="sm"
						onClick={handleDelete}
						disabled={loading}
						className="text-xs gap-1.5">
						{loading ? (
							<>
								<IconLoader2 className="size-3.5 animate-spin" />
								Eliminando...
							</>
						) : (
							<>
								<IconTrash className="size-3.5" />
								Confirmar Eliminación
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

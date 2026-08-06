"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { IconCalendar, IconFileText, IconTrash, IconLoader2, IconAlertCircle, IconLink, IconAlertTriangle } from "@tabler/icons-react"
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { upsertFechaExamen, deleteFechaExamen } from "@/lib/fechasExamenesActions"
import type { MateriaPlanillaRow, TurnoInfo, FechaExamenItem, ResolucionItem } from "@/lib/fechasExamenesAdmin"

interface FechaExamenModalProps {
	isOpen: boolean
	onClose: () => void
	materia: MateriaPlanillaRow | null
	turno: TurnoInfo | null
	fechaItem: FechaExamenItem | null
	resolucionesList: ResolucionItem[]
	onSuccess?: () => void
}

type ResolucionMode = "none" | "existing" | "new"

export default function FechaExamenModal({
	isOpen,
	onClose,
	materia,
	turno,
	fechaItem,
	resolucionesList,
	onSuccess,
}: FechaExamenModalProps) {
	const [fecha, setFecha] = useState("")
	const [resolucionMode, setResolucionMode] = useState<ResolucionMode>("none")
	const [selectedResolucionId, setSelectedResolucionId] = useState<string>("")
	const [nuevaResolucionNombre, setNuevaResolucionNombre] = useState("")
	const [nuevaResolucionFecha, setNuevaResolucionFecha] = useState("")
	const [nuevaResolucionUrl, setNuevaResolucionUrl] = useState("")

	const [showNoUrlConfirm, setShowNoUrlConfirm] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (isOpen) {
			setError(null)
			setShowNoUrlConfirm(false)
			setNuevaResolucionNombre("")
			setNuevaResolucionFecha("")
			setNuevaResolucionUrl("")

			if (fechaItem?.fecha) {
				setFecha(fechaItem.fecha)
				if (fechaItem.resolucionId) {
					setResolucionMode("existing")
					setSelectedResolucionId(fechaItem.resolucionId.toString())
				} else {
					setResolucionMode("none")
					setSelectedResolucionId("")
				}
			} else {
				setFecha(turno?.fechaInicio || "")
				setResolucionMode("none")
				setSelectedResolucionId("")
			}
		}
	}, [isOpen, fechaItem, turno])

	if (!materia || !turno) return null

	const hasExistingDate = !!fechaItem?.id

	const executeSave = async (overrideUrlCheck = false) => {
		if (!fecha.trim()) {
			setError("La fecha del examen es obligatoria.")
			return
		}

		let resolucionId: number | null = null
		let nuevaResolucionPayload: { nombre: string; fecha?: string; url?: string | null } | null = null

		if (resolucionMode === "existing") {
			if (!selectedResolucionId) {
				setError("Por favor selecciona una resolución existente o marca 'Sin resolución'.")
				return
			}
			resolucionId = Number(selectedResolucionId)
		} else if (resolucionMode === "new") {
			if (!nuevaResolucionNombre.trim()) {
				setError("Debes ingresar el nombre de la nueva resolución.")
				return
			}

			// Si no ingresó URL y aún no ha confirmado el aviso
			if (!nuevaResolucionUrl.trim() && !overrideUrlCheck) {
				setShowNoUrlConfirm(true)
				return
			}

			nuevaResolucionPayload = {
				nombre: nuevaResolucionNombre.trim(),
				fecha: nuevaResolucionFecha.trim() || fecha.trim(),
				url: nuevaResolucionUrl.trim() || null,
			}
		}

		setIsSaving(true)
		setError(null)
		setShowNoUrlConfirm(false)

		try {
			const res = await upsertFechaExamen({
				fechaId: fechaItem?.id || null,
				materiaId: materia.materiaId,
				fecha: fecha.trim(),
				resolucionId: resolucionId,
				nuevaResolucion: nuevaResolucionPayload,
			})

			if (!res.success) {
				setError(res.error || "Ocurrió un error al guardar la fecha.")
			} else {
				onSuccess?.()
				onClose()
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Error inesperado al guardar."
			setError(msg)
		} finally {
			setIsSaving(false)
		}
	}

	const handleSubmitForm = (e: React.FormEvent) => {
		e.preventDefault()
		executeSave(false)
	}

	const handleDelete = async () => {
		if (!fechaItem?.id) return
		if (!confirm("¿Estás seguro de eliminar esta fecha de examen?")) return

		setIsDeleting(true)
		setError(null)

		try {
			const res = await deleteFechaExamen(fechaItem.id)
			if (!res.success) {
				setError(res.error || "Ocurrió un error al eliminar la fecha.")
			} else {
				onSuccess?.()
				onClose()
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Error inesperado al eliminar."
			setError(msg)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<>
			{/* MODAL PRINCIPAL */}
			<Dialog open={isOpen && !showNoUrlConfirm} onOpenChange={(open) => !open && onClose()}>
				<DialogContent className="sm:max-w-lg w-full p-6">
					<DialogHeader className="space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="outline" className="text-xs font-semibold">
								{turno.numero}° Turno
							</Badge>
							{materia.carreras.map((c) => (
								<Badge key={c.id} variant="secondary" className="text-[10px]">
									{c.nombre}
								</Badge>
							))}
						</div>
						<DialogTitle className="text-lg font-bold">
							{hasExistingDate ? "Editar Fecha de Examen" : "Agregar Fecha de Examen"}
						</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground">
							Materia: <strong className="text-foreground">{materia.materiaNombre}</strong> ({materia.materiaSlug})
						</DialogDescription>
					</DialogHeader>

					{error && (
						<Alert variant="destructive" className="py-2 text-xs">
							<IconAlertCircle className="size-4 shrink-0" />
							<AlertTitle className="text-xs font-semibold">Error</AlertTitle>
							<AlertDescription className="text-xs">{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleSubmitForm} className="py-2">
						<FieldGroup className="gap-4">
							{/* FECHA DEL EXAMEN */}
							<Field>
								<FieldLabel htmlFor="fecha" className="text-xs font-semibold flex items-center gap-1.5">
									<IconCalendar className="size-4 text-primary" />
									Fecha del Examen
								</FieldLabel>
								<Input
									id="fecha"
									type="date"
									value={fecha}
									onChange={(e) => setFecha(e.target.value)}
									required
									className="text-xs"
								/>
								{turno.fechaInicio && turno.fechaFin && (
									<FieldDescription className="text-[11px]">
										Rango del turno: {turno.fechaInicio} al {turno.fechaFin}
									</FieldDescription>
								)}
							</Field>

							{/* GESTION DE RESOLUCION */}
							<Field className="pt-2 border-t border-border">
								<FieldLabel className="text-xs font-semibold flex items-center gap-1.5 mb-2">
									<IconFileText className="size-4 text-primary" />
									Resolución de la Materia
								</FieldLabel>

								{/* MODO DE SELECCION */}
								<div className="grid grid-cols-3 gap-2 mb-2">
									<button
										type="button"
										onClick={() => setResolucionMode("none")}
										className={`px-2.5 py-1.5 rounded-md text-xs border font-medium transition-all text-center ${
											resolucionMode === "none"
												? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
												: "border-input bg-background hover:bg-muted text-muted-foreground"
										}`}>
										Sin resolución
									</button>
									<button
										type="button"
										onClick={() => setResolucionMode("existing")}
										className={`px-2.5 py-1.5 rounded-md text-xs border font-medium transition-all text-center ${
											resolucionMode === "existing"
												? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
												: "border-input bg-background hover:bg-muted text-muted-foreground"
										}`}>
										Existente
									</button>
									<button
										type="button"
										onClick={() => setResolucionMode("new")}
										className={`px-2.5 py-1.5 rounded-md text-xs border font-medium transition-all text-center ${
											resolucionMode === "new"
												? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
												: "border-input bg-background hover:bg-muted text-muted-foreground"
										}`}>
										+ Crear nueva
									</button>
								</div>

								{/* MODO: SELECCIONAR EXISTENTE */}
								{resolucionMode === "existing" && (
									<Field className="pt-1">
										<FieldLabel htmlFor="select-resolucion" className="text-[11px] text-muted-foreground">
											Seleccionar resolución de la lista:
										</FieldLabel>
										<select
											id="select-resolucion"
											value={selectedResolucionId}
											onChange={(e) => setSelectedResolucionId(e.target.value)}
											className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
											<option value="">-- Seleccionar resolución --</option>
											{resolucionesList.map((res) => (
												<option key={res.id} value={res.id}>
													{res.nombre} ({res.fecha}) {res.url ? "• [con URL]" : ""}
												</option>
											))}
										</select>
									</Field>
								)}

								{/* MODO: CREAR NUEVA */}
								{resolucionMode === "new" && (
									<FieldGroup className="p-3 rounded-lg bg-muted/40 border border-border gap-3">
										<Field>
											<FieldLabel htmlFor="nueva-nombre" className="text-[11px] font-semibold">
												Nombre / Código de la Resolución *
											</FieldLabel>
											<Input
												id="nueva-nombre"
												type="text"
												placeholder="Ej: RES - 2026 - 1120 - D-EXA # UNNE"
												value={nuevaResolucionNombre}
												onChange={(e) => setNuevaResolucionNombre(e.target.value)}
												required={resolucionMode === "new"}
												className="text-xs"
											/>
										</Field>

										<Field>
											<FieldLabel htmlFor="nueva-url" className="text-[11px] font-semibold flex items-center gap-1">
												<IconLink className="size-3.5 text-muted-foreground" />
												URL de la Resolución (PDF / Web)
											</FieldLabel>
											<Input
												id="nueva-url"
												type="url"
												placeholder="https://exa.unne.edu.ar/.../RES.pdf"
												value={nuevaResolucionUrl}
												onChange={(e) => setNuevaResolucionUrl(e.target.value)}
												className="text-xs"
											/>
											<FieldDescription className="text-[10px]">
												Si la dejas en blanco, la resolución se guardará sin enlace.
											</FieldDescription>
										</Field>

										<Field>
											<FieldLabel htmlFor="nueva-fecha" className="text-[11px] font-semibold">
												Fecha de la Resolución (Opcional)
											</FieldLabel>
											<Input
												id="nueva-fecha"
												type="date"
												value={nuevaResolucionFecha}
												onChange={(e) => setNuevaResolucionFecha(e.target.value)}
												className="text-xs"
											/>
										</Field>
									</FieldGroup>
								)}
							</Field>
						</FieldGroup>

						{/* FOOTER */}
						<DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-2 border-t">
							{hasExistingDate ? (
								<Button
									type="button"
									variant="destructive"
									size="sm"
									disabled={isSaving || isDeleting}
									onClick={handleDelete}
									className="text-xs gap-1.5">
									{isDeleting ? (
										<>
											<IconLoader2 className="size-3.5 animate-spin" />
											Eliminando...
										</>
									) : (
										<>
											<IconTrash className="size-3.5" />
											Eliminar Fecha
										</>
									)}
								</Button>
							) : (
								<div />
							)}

							<div className="flex gap-2 justify-end">
								<Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving || isDeleting} className="text-xs">
									Cancelar
								</Button>
								<Button type="submit" size="sm" disabled={isSaving || isDeleting} className="text-xs gap-1.5">
									{isSaving ? (
										<>
											<IconLoader2 className="size-3.5 animate-spin" />
											Guardando...
										</>
									) : (
										"Guardar Cambios"
									)}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* ALERT DIALOG: AVISO SI SE GUARDA NUEVA RESOLUCION SIN URL */}
			<Dialog open={showNoUrlConfirm} onOpenChange={(open) => !open && setShowNoUrlConfirm(false)}>
				<DialogContent className="sm:max-w-md w-full p-5">
					<DialogHeader className="space-y-2">
						<div className="flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
							<IconAlertTriangle className="size-5" />
						</div>
						<DialogTitle className="text-base font-bold">Resolución sin URL</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground leading-normal">
							Estás a punto de crear la resolución <strong>"{nuevaResolucionNombre}"</strong> sin haber especificado una URL oficial.
							<br /><br />
							¿Deseas continuar y guardarla sin URL (en nulo)?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="pt-3 flex gap-2 justify-end">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setShowNoUrlConfirm(false)}
							className="text-xs">
							Volver y añadir URL
						</Button>
						<Button
							type="button"
							variant="warning"
							size="sm"
							onClick={() => executeSave(true)}
							disabled={isSaving}
							className="text-xs font-semibold">
							Guardar sin URL
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

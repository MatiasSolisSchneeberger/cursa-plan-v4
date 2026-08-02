"use client"

import * as React from "react"
import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {IconLoader2, IconAlertCircle, IconCheck, IconSchool} from "@tabler/icons-react"
import Icon from "@/components/Icon"
import {generarSlug} from "@/lib/utils"
import {createCarrera, updateCarrera, type CarreraAdminItem} from "@/lib/carrerasAdmin"

interface CarreraModalProps {
	isOpen: boolean
	onClose: () => void
	carrera: CarreraAdminItem | null
	onSuccess: () => void
}

const PRESET_ICONS = [
	{id: "device-imac", label: "Computadora / Sistemas"},
	{id: "code", label: "Código / Programación"},
	{id: "robot", label: "Robótica / IA"},
	{id: "cpu", label: "Procesador / Electrónica"},
	{id: "atom", label: "Física / Ciencias"},
	{id: "math", label: "Matemática"},
	{id: "geometry", label: "Geometría / Dibujo Técnico"},
	{id: "microscope", label: "Microscopio / Bioquímica"},
	{id: "flask", label: "Química / Laboratorio"},
	{id: "flask-2-filled", label: "Química II"},
	{id: "test-pipe", label: "Tubo de Ensayo"},
	{id: "seedling", label: "Agronomía / Biología"},
	{id: "butterfly", label: "Biodiversidad / Botánica"},
	{id: "telescope", label: "Telescopio / Óptica"},
	{id: "bolt", label: "Electricidad / Energía"},
	{id: "ruler", label: "Regla / Diseño"},
	{id: "briefcase", label: "Administración / Negocios"},
	{id: "calculator", label: "Contabilidad / Finanzas"},
	{id: "dna", label: "Genética / Biotecnología"},
	{id: "book", label: "Educación / Lectura"},
	{id: "bulb", label: "Ideas / Innovación"},
	{id: "rocket", label: "Aeroespacial / Tecnología"},
	{id: "trophy", label: "Logros / Excelencia"},
	{id: "headphones", label: "Audio / Sonido"},
	{id: "coffee", label: "General"},
	{id: "flame", label: "Termodinámica"},
	{id: "planet", label: "Astronomía"},
	{id: "mood-nerd", label: "Avatar Nerd"},
	{id: "mood-smile", label: "Avatar Sonrisa"},
	{id: "mood-happy", label: "Avatar Feliz"},
	{id: "mood-crazy-happy", label: "Avatar Súper Feliz"},
	{id: "ghost", label: "Avatar Fantasma"},
	{id: "alien", label: "Avatar Alien"},
]

export default function CarreraModal({isOpen, onClose, carrera, onSuccess}: CarreraModalProps) {
	const isEditing = !!carrera
	const [nombre, setNombre] = useState(carrera?.nombre || "")
	const [slug, setSlug] = useState(carrera?.slug || "")
	const [icon, setIcon] = useState(carrera?.icon || "device-imac")
	const [isSlugCustomized, setIsSlugCustomized] = useState(!!carrera)
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		setNombre(val)
		if (!isSlugCustomized) {
			setSlug(generarSlug(val))
		}
	}

	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSlug(e.target.value)
		setIsSlugCustomized(true)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!nombre.trim()) {
			setErrorMessage("El nombre de la carrera es obligatorio.")
			return
		}

		const finalSlug = slug.trim() ? generarSlug(slug) : generarSlug(nombre)

		if (!finalSlug) {
			setErrorMessage("El slug de la carrera es obligatorio.")
			return
		}

		setLoading(true)
		setErrorMessage(null)

		const payload = {
			nombre: nombre.trim(),
			slug: finalSlug,
			icon: icon.trim() || "device-imac",
		}

		const result = isEditing ? await updateCarrera(carrera.id, payload) : await createCarrera(payload)

		setLoading(false)

		if (!result.success) {
			setErrorMessage(result.error || "Ocurrió un error al guardar la carrera.")
			return
		}

		onSuccess()
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
			<DialogContent className="sm:max-w-[500px] border-border bg-card">
				<DialogHeader>
					<div className="flex items-center gap-2 text-primary">
						<IconSchool className="size-5" />
						<DialogTitle>{isEditing ? "Editar Carrera" : "Crear Nueva Carrera"}</DialogTitle>
					</div>
					<DialogDescription className="text-xs text-muted-foreground">
						{isEditing ?
							"Modifica los datos de la carrera. El slug se utiliza en la URL."
						:	"Ingresa el nombre de la carrera. El slug se generará automáticamente."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{errorMessage && (
						<Alert variant="destructive" className="py-2 text-xs flex items-center gap-2">
							<IconAlertCircle className="size-4 shrink-0" />
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					)}

					{/* CAMPO NOMBRE */}
					<div className="space-y-1.5">
						<Label htmlFor="nombre-carrera" className="text-xs font-semibold">
							Nombre de la Carrera <span className="text-destructive">*</span>
						</Label>
						<Input
							id="nombre-carrera"
							type="text"
							placeholder="Ej: Ingeniería en Sistemas de Información"
							value={nombre}
							onChange={handleNombreChange}
							disabled={loading}
							className="text-xs"
							autoFocus
						/>
					</div>

					{/* CAMPO SLUG (GENERADO AUTOMÁTICAMENTE / EDITABLE) */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<Label htmlFor="slug-carrera" className="text-xs font-semibold">
								Slug URL <span className="text-destructive">*</span>
							</Label>
							<span className="text-[10px] text-muted-foreground">Generado automáticamente</span>
						</div>
						<Input
							id="slug-carrera"
							type="text"
							placeholder="ej: ingenieria-en-sistemas-de-informacion"
							value={slug}
							onChange={handleSlugChange}
							disabled={loading}
							className="text-xs font-mono text-muted-foreground"
						/>
						<p className="text-[10px] text-muted-foreground">
							Ruta final: <span className="font-mono text-foreground">/{slug || "slug-carrera"}</span>
						</p>
					</div>

					{/* SELECCIÓN DE ÍCONO CON PREVIEW */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold">Ícono de la Carrera</Label>
						<div className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-muted/30">
							<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
								<Icon icon={icon} className="size-6" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-xs font-medium text-foreground capitalize truncate">{icon}</p>
								<p className="text-[10px] text-muted-foreground">Vista previa del ícono seleccionado</p>
							</div>
						</div>
						<div className="p-2 border border-border rounded-md bg-muted/10">
							<div className=" max-h-36 overflow-y-auto scrollbar-none scroll-fade scroll-fade-10">
								<div className="grid grid-cols-7 gap-1.5">
									{PRESET_ICONS.map(({id, label}) => {
										const isSelected = icon === id
										return (
											<button
												key={id}
												type="button"
												title={label}
												onClick={() => setIcon(id)}
												disabled={loading}
												className={`flex items-center justify-center p-2 rounded-md transition-all border ${
													isSelected ?
														"border-primary bg-primary/15 text-primary shadow-xs"
													:	"border-border hover:bg-muted text-muted-foreground hover:text-foreground"
												}`}>
												<Icon icon={id} className="size-5" />
											</button>
										)
									})}
								</div>
							</div>
						</div>
					</div>

					<DialogFooter className="pt-3 gap-2 sm:gap-0">
						<Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading} className="text-xs">
							Cancelar
						</Button>
						<Button type="submit" size="sm" disabled={loading} className="text-xs gap-1.5">
							{loading ?
								<>
									<IconLoader2 className="size-3.5 animate-spin" />
									Guardando...
								</>
							:	<>
									<IconCheck className="size-3.5" />
									{isEditing ? "Guardar Cambios" : "Crear Carrera"}
								</>
							}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

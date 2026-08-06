"use client"

import * as React from "react"
import {useState} from "react"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription} from "@/components/ui/alert"
import Icon from "@/components/Icon"
import {
	IconSchool,
	IconCheck,
	IconChevronLeft,
	IconLoader2,
	IconAlertCircle,
	IconFileText,
	IconFileAlert,
} from "@tabler/icons-react"
import {generarSlug} from "@/lib/utils"
import {createCarrera, updateCarrera, type CarreraAdminDetail, type ResolucionItem} from "@/lib/carrerasAdmin"
import PlanesAdminTable from "./PlanesAdminTable"
import ResolucionSelectorModal from "./ResolucionSelectorModal"

import {FieldGroup, Field, FieldLabel, FieldDescription} from "@/components/ui/field"

interface CarreraFormViewProps {
	isNew: boolean
	initialData: CarreraAdminDetail | null
	initialResoluciones: ResolucionItem[]
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

export default function CarreraFormView({isNew, initialData, initialResoluciones}: CarreraFormViewProps) {
	const router = useRouter()
	const [nombre, setNombre] = useState(initialData?.nombre || "")
	const [slug, setSlug] = useState(initialData?.slug || "")
	const [icon, setIcon] = useState(initialData?.icon || "device-imac")
	const [active, setActive] = useState(initialData?.active ?? true)
	const [resolucionId, setResolucionId] = useState<number | null>(initialData?.resolucion_id || null)

	// Catálogo local de resoluciones para poder actualizarlo si el usuario crea una nueva
	const [resolucionesCatalog, setResolucionesCatalog] = useState<ResolucionItem[]>(initialResoluciones)

	const [isResolucionModalOpen, setIsResolucionModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	// Resolver la resolución seleccionada
	const selectedResolucion = React.useMemo(() => {
		if (resolucionId === null) return null
		return resolucionesCatalog.find(({id}) => id === resolucionId) || null
	}, [resolucionId, resolucionesCatalog])

	const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		setNombre(val)
		if (isNew) {
			setSlug(generarSlug(val))
		}
	}

	const handleResolucionCreated = (nuevaRes: ResolucionItem) => {
		setResolucionesCatalog((prev) => [nuevaRes, ...prev])
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
		setSuccessMessage(null)

		const payload = {
			nombre: nombre.trim(),
			slug: finalSlug,
			icon: icon.trim() || "device-imac",
			active,
			resolucion_id: resolucionId,
		}

		const result = isNew ? await createCarrera(payload) : await updateCarrera(initialData!.id, payload)

		setLoading(false)

		if (!result.success) {
			setErrorMessage(result.error || "Ocurrió un error al guardar la carrera.")
			return
		}

		setSuccessMessage(result.message || "Carrera guardada con éxito.")

		// Redirigir después de guardar
		setTimeout(() => {
			router.push("/admin/carreras")
			router.refresh()
		}, 1500)
	}

	return (
		<div className="flex flex-col gap-6 w-full mx-auto">
			{/* CABECERA & VOLVER */}
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.push("/admin/carreras")}
						className="size-9 rounded-md border border-border text-muted-foreground hover:text-foreground">
						<IconChevronLeft className="size-5" />
					</Button>
					<div>
						<h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
							<IconSchool className="size-6 text-primary" />
							{isNew ? "Nueva Carrera" : `Editar: ${initialData?.nombre}`}
						</h1>
						<p className="text-xs text-muted-foreground">
							{isNew ?
								"Crea una nueva carrera en el sistema con sus datos de resolución."
							:	"Modifica los datos principales y gestiona los planes de la carrera."}
						</p>
					</div>
				</div>
			</header>

			<Card className="border border-border bg-card shadow-xs">
				{/* MENSAJES DE ESTADO */}
				{errorMessage && (
					<Alert variant="destructive" className="py-3 text-xs flex items-center gap-2">
						<IconAlertCircle className="size-4 shrink-0" />
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				)}

				{successMessage && (
					<Alert className="py-3 text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none">
						<IconCheck className="size-4 shrink-0" />
						<AlertDescription>{successMessage}</AlertDescription>
					</Alert>
				)}

				{/* CARD DE DATOS GENERALES */}
				<CardHeader className="border-b border-border/50 pb-4">
					<CardTitle className="text-sm font-bold">Datos Generales</CardTitle>
					<CardDescription className="text-[11px] text-muted-foreground">
						Información básica de la carrera y su ícono identificador
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="p-6 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* COLUMNA FORMULARIO */}
							<FieldGroup className="gap-4">
								{/* NOMBRE */}
								<Field>
									<FieldLabel htmlFor="carrera-nombre" className="text-xs font-semibold">
										Nombre de la Carrera <span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										id="carrera-nombre"
										type="text"
										placeholder="Ej: Ingeniería en Sistemas de Información"
										value={nombre}
										onChange={handleNombreChange}
										disabled={loading}
										className="text-xs"
										autoFocus
									/>
								</Field>

								{/* SLUG (SOLO LECTURA) */}
								<Field>
									<div className="flex items-center justify-between">
										<FieldLabel className="text-xs font-semibold text-muted-foreground">Slug URL (Solo Lectura)</FieldLabel>
										<span className="text-[10px] text-muted-foreground">Autogenerado</span>
									</div>
									<Input
										type="text"
										value={slug}
										disabled
										className="text-xs font-mono text-muted-foreground bg-muted/30 border-muted"
									/>
									<FieldDescription className="text-[10px] font-mono truncate">
										Ruta: /carreras/<span className="text-foreground font-bold">{slug || "..."}</span>
									</FieldDescription>
								</Field>

								{/* RESOLUCIÓN (CON MODAL SELECTOR) */}
								<Field>
									<FieldLabel className="text-xs font-semibold">Resolución Asociada</FieldLabel>
									<div className="flex items-start gap-2">
										<div className="flex-1 min-w-0">
											{selectedResolucion ?
												<div className="p-2.5 rounded-md border border-border bg-muted/20 flex items-center justify-between gap-3">
													<div className="flex items-center gap-2 min-w-0">
														<IconFileText className="size-4 text-primary shrink-0" />
														<div className="min-w-0">
															<p className="text-xs font-bold text-foreground truncate">{selectedResolucion.nombre}</p>
															<p className="text-[10px] text-muted-foreground">Emisión: {selectedResolucion.fecha}</p>
														</div>
													</div>
													{selectedResolucion.url && (
														<a
															href={selectedResolucion.url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-[10px] font-bold text-primary hover:underline">
															Ver PDF
														</a>
													)}
												</div>
											:	<div className="p-2.5 rounded-md border border-dashed border-border bg-muted/5 flex items-center gap-2 text-muted-foreground">
													<IconFileAlert className="size-4 text-muted-foreground/60" />
													<span className="text-xs">Sin resolución asignada</span>
												</div>
											}
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => setIsResolucionModalOpen(true)}
											disabled={loading}
											className="text-xs shrink-0">
											Seleccionar
										</Button>
									</div>
								</Field>

								{/* ESTADO ACTIVO */}
								<Field className="pt-2">
									<FieldLabel className="text-xs font-semibold block mb-2">Estado de Carrera</FieldLabel>
									<label className="relative inline-flex items-center cursor-pointer select-none">
										<input
											type="checkbox"
											checked={active}
											onChange={(e) => setActive(e.target.checked)}
											disabled={loading}
											className="sr-only peer"
										/>
										<div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
										<span className="ml-2.5 text-xs font-medium text-foreground">
											{active ? "Activa (Pública en el sitio)" : "Inactiva (Oculta para alumnos)"}
										</span>
									</label>
								</Field>
							</FieldGroup>

							{/* COLUMNA SELECCIÓN DE ICONO */}
							<FieldGroup className="gap-3">
								<Field>
									<FieldLabel className="text-xs font-semibold">Ícono Representativo</FieldLabel>
									<div className="flex items-center gap-3 p-3 rounded-md border border-border bg-muted/20">
										<div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
											<Icon icon={icon} className="size-6" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-bold text-foreground capitalize truncate">{icon}</p>
											<p className="text-[10px] text-muted-foreground">Vista previa del ícono seleccionado</p>
										</div>
									</div>

									<div className="p-2 border border-border rounded-md bg-muted/10 mt-3">
										<div className="max-h-48 overflow-y-auto scrollbar-none">
											<div className="grid grid-cols-6 gap-1.5">
												{PRESET_ICONS.map(({id, label}) => {
													const isSelected = icon === id
													return (
														<button
															key={id}
															type="button"
															title={label}
															onClick={() => setIcon(id)}
															disabled={loading}
															className={`flex items-center justify-center p-2.5 rounded-md transition-all border ${
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
								</Field>
							</FieldGroup>
						</div>
					</CardContent>

					{/* FOOTER CON BOTONES CANCELAR Y GUARDAR */}
					<CardFooter className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/50 bg-muted/20">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => router.push("/admin/carreras")}
							disabled={loading}
							className="text-xs">
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
									{isNew ? "Crear Carrera" : "Guardar Cambios"}
								</>
							}
						</Button>
					</CardFooter>
				</form>
			</Card>

			{/* SECCIÓN INFERIOR: PLANES DE ESTUDIO */}
			<div className="mt-2">
				<PlanesAdminTable planes={initialData?.planes || []} carreraSlug={slug} isNew={isNew} />
			</div>

			{/* MODAL SECTOR DE RESOLUCIÓN */}
			{isResolucionModalOpen && (
				<ResolucionSelectorModal
					isOpen={isResolucionModalOpen}
					onClose={() => setIsResolucionModalOpen(false)}
					resoluciones={resolucionesCatalog}
					onSelect={(res) => setResolucionId(res.id)}
					onResolucionCreated={handleResolucionCreated}
				/>
			)}
		</div>
	)
}

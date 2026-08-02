"use client"

import * as React from "react"
import { useState, useMemo } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
	IconSearch,
	IconLoader2,
	IconAlertCircle,
	IconCheck,
	IconFileText,
	IconFilePlus,
	IconExternalLink,
} from "@tabler/icons-react"
import { createResolucion, type ResolucionItem } from "@/lib/carrerasAdmin"

interface ResolucionSelectorModalProps {
	isOpen: boolean
	onClose: () => void
	onSelect: (resolucion: ResolucionItem) => void
	resoluciones: ResolucionItem[]
	onResolucionCreated: (resolucion: ResolucionItem) => void
}

export default function ResolucionSelectorModal({
	isOpen,
	onClose,
	onSelect,
	resoluciones,
	onResolucionCreated,
}: ResolucionSelectorModalProps) {
	const [activeTab, setActiveTab] = useState<string>("select")
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [selectedItem, setSelectedItem] = useState<ResolucionItem | null>(null)

	// Campos para nueva resolución
	const [nombre, setNombre] = useState<string>("")
	const [fecha, setFecha] = useState<string>("")
	const [url, setUrl] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	// Filtrar resoluciones
	const filteredResoluciones = useMemo(() => {
		if (!searchQuery.trim()) return resoluciones
		const q = searchQuery.toLowerCase().trim()
		return resoluciones.filter(({ nombre }) =>
			nombre.toLowerCase().includes(q)
		)
	}, [resoluciones, searchQuery])

	const handleConfirmSelect = () => {
		if (selectedItem) {
			onSelect(selectedItem)
			onClose()
		}
	}

	const handleCreateResolucion = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!nombre.trim()) {
			setErrorMessage("El nombre de la resolución es obligatorio.")
			return
		}
		if (!fecha.trim()) {
			setErrorMessage("La fecha de la resolución es obligatoria.")
			return
		}

		setLoading(true)
		setErrorMessage(null)

		const result = await createResolucion({
			nombre: nombre.trim(),
			fecha: fecha.trim(),
			url: url.trim() || null,
		})

		setLoading(false)

		if (!result.success || !result.data) {
			setErrorMessage(result.error || "Ocurrió un error al crear la resolución.")
			return
		}

		// Notificar al padre y seleccionar automáticamente
		onResolucionCreated(result.data)
		onSelect(result.data)
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
			<DialogContent className="sm:max-w-[550px] border-border bg-card">
				<DialogHeader>
					<div className="flex items-center gap-2 text-primary">
						<IconFileText className="size-5" />
						<DialogTitle>Resolución de Carrera</DialogTitle>
					</div>
					<DialogDescription className="text-xs text-muted-foreground">
						Selecciona una resolución existente o crea una nueva para asociarla a la carrera.
					</DialogDescription>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="select" className="text-xs gap-1.5">
							<IconSearch className="size-3.5" />
							Buscar Existente
						</TabsTrigger>
						<TabsTrigger value="create" className="text-xs gap-1.5">
							<IconFilePlus className="size-3.5" />
							Crear Nueva
						</TabsTrigger>
					</TabsList>

					{/* TAB: SELECCIONAR EXISTENTE */}
					<TabsContent value="select" className="space-y-4 outline-none">
						<div className="relative">
							<IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Buscar resolución por nombre..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 text-xs"
							/>
						</div>

						<div className="border border-border rounded-md bg-muted/10 overflow-hidden">
							<div className="max-h-60 overflow-y-auto divide-y divide-border scrollbar-none">
								{filteredResoluciones.length === 0 ? (
									<div className="p-8 text-center text-xs text-muted-foreground">
										No se encontraron resoluciones.
									</div>
								) : (
									filteredResoluciones.map((item) => {
										const isSelected = selectedItem?.id === item.id
										return (
											<button
												key={item.id}
												type="button"
												onClick={() => setSelectedItem(item)}
												onDoubleClick={() => {
													onSelect(item)
													onClose()
												}}
												className={`w-full text-left p-3 text-xs transition-colors flex items-center justify-between ${
													isSelected
														? "bg-primary/10 hover:bg-primary/15 text-foreground"
														: "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
												}`}
											>
												<div className="flex flex-col gap-1 min-w-0 pr-4">
													<span className={`font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
														{item.nombre}
													</span>
													<span className="text-[10px] text-muted-foreground">
														Fecha: {item.fecha}
													</span>
												</div>
												<div className="flex items-center gap-2 shrink-0">
													{item.url && (
														<a
															href={item.url}
															target="_blank"
															rel="noopener noreferrer"
															onClick={(e) => e.stopPropagation()}
															title="Ver documento"
															className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
														>
															<IconExternalLink className="size-3.5" />
														</a>
													)}
													{isSelected && <IconCheck className="size-4 text-primary shrink-0" />}
												</div>
											</button>
										)
									})
								)}
							</div>
						</div>

						<DialogFooter className="pt-2">
							<Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
								Cancelar
							</Button>
							<Button
								type="button"
								size="sm"
								disabled={!selectedItem}
								onClick={handleConfirmSelect}
								className="text-xs gap-1.5"
							>
								<IconCheck className="size-3.5" />
								Confirmar Selección
							</Button>
						</DialogFooter>
					</TabsContent>

					{/* TAB: CREAR NUEVA */}
					<TabsContent value="create" className="outline-none">
						<form onSubmit={handleCreateResolucion} className="space-y-4">
							{errorMessage && (
								<Alert variant="destructive" className="py-2 text-xs flex items-center gap-2">
									<IconAlertCircle className="size-4 shrink-0" />
									<AlertDescription>{errorMessage}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-1.5">
								<Label htmlFor="res-nombre" className="text-xs font-semibold">
									Nombre de la Resolución <span className="text-destructive">*</span>
								</Label>
								<Input
									id="res-nombre"
									type="text"
									placeholder="Ej: Res. Min. N° 1245/2021"
									value={nombre}
									onChange={(e) => setNombre(e.target.value)}
									disabled={loading}
									className="text-xs"
									autoFocus
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="res-fecha" className="text-xs font-semibold">
									Fecha de Emisión <span className="text-destructive">*</span>
								</Label>
								<Input
									id="res-fecha"
									type="date"
									value={fecha}
									onChange={(e) => setFecha(e.target.value)}
									disabled={loading}
									className="text-xs"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="res-url" className="text-xs font-semibold">
									URL del Documento (Opcional)
								</Label>
								<Input
									id="res-url"
									type="url"
									placeholder="Ej: https://example.com/resolucion.pdf"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									disabled={loading}
									className="text-xs"
								/>
							</div>

							<DialogFooter className="pt-2">
								<Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading} className="text-xs">
									Cancelar
								</Button>
								<Button type="submit" size="sm" disabled={loading} className="text-xs gap-1.5">
									{loading ? (
										<>
											<IconLoader2 className="size-3.5 animate-spin" />
											Creando...
										</>
									) : (
										<>
											<IconCheck className="size-3.5" />
											Crear y Seleccionar
										</>
									)}
								</Button>
							</DialogFooter>
						</form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

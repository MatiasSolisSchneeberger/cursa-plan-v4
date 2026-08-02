"use client"

import * as React from "react"
import {useState, useMemo} from "react"
import {useRouter} from "next/navigation"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardTitle, CardDescription, CardFooter} from "@/components/ui/card"
import {IconBox} from "@/components/ui/icon-box"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {
	IconSearch,
	IconPlus,
	IconEdit,
	IconTrash,
	IconSchool,
	IconChevronLeft,
	IconChevronRight,
	IconBooks,
} from "@tabler/icons-react"
import Icon from "@/components/Icon"
import CarreraModal from "@/sections/admin/carreras/CarreraModal"
import DeleteCarreraModal from "@/sections/admin/carreras/DeleteCarreraModal"
import type {CarreraAdminItem} from "@/lib/carrerasAdmin"

interface CarrerasAdminViewProps {
	data: CarreraAdminItem[]
}

const PAGE_SIZE = 10

export default function CarrerasAdminView({data}: CarrerasAdminViewProps) {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState("")
	const [currentPage, setCurrentPage] = useState(1)

	// Estado para modales
	const [carreraToEdit, setCarreraToEdit] = useState<CarreraAdminItem | null>(null)
	const [carreraToDelete, setCarreraToDelete] = useState<CarreraAdminItem | null>(null)

	// Filtrar carreras por término de búsqueda
	const filteredRows = useMemo(() => {
		if (!searchQuery.trim()) return data

		const query = searchQuery.toLowerCase().trim()
		return data.filter(({nombre, slug}) => {
			const nameMatch = nombre.toLowerCase().includes(query)
			const slugMatch = slug.toLowerCase().includes(query)
			return nameMatch || slugMatch
		})
	}, [data, searchQuery])

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
		setCurrentPage(1)
	}

	const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE) || 1

	const paginatedRows = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE
		return filteredRows.slice(start, start + PAGE_SIZE)
	}, [filteredRows, currentPage])

	const handleActionSuccess = () => {
		router.refresh()
	}

	return (
		<section className="flex flex-col gap-6">
			{/* CONTENEDOR PRINCIPAL / CARD */}
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
				<div className="flex items-center gap-3">
					<IconBox>
						<IconSchool />
					</IconBox>
					<div>
						<CardTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
							Gestión de Carreras
						</CardTitle>
						<CardDescription className="text-xs text-muted-foreground">
							{data.length} {data.length === 1 ? "carrera registrada" : "carreras registradas"} en el sistema
						</CardDescription>
					</div>
				</div>

				<div className="flex items-center gap-3 w-full sm:w-auto">
					<div className="relative flex-1 sm:w-64">
						<IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Buscar carrera o slug..."
							value={searchQuery}
							onChange={handleSearchChange}
							className="pl-9 text-xs"
						/>
					</div>

					<Button onClick={() => router.push("/admin/carreras/nueva-carrera")} size="sm" className="text-xs gap-1.5 shrink-0">
						<IconPlus className="size-4" />
						Nueva Carrera
					</Button>
				</div>
			</header>
			<Card className="py-0 border border-border shadow-xs gap-0 overflow-hidden">
				{/* TABLA DE CARRERAS */}
				<CardContent className="p-0 relative w-full overflow-x-auto scroll-fade scrollbar-none">
					<Table className="w-full text-xs border-collapse">
						<TableHeader className="bg-muted/95 backdrop-blur-xs border-b border-border">
							<TableRow className="hover:bg-transparent border-b border-border">
								<TableHead className="w-16 text-center font-semibold text-foreground py-3 pl-4">Ícono</TableHead>
								<TableHead className="min-w-60 font-semibold text-foreground py-3">Carrera / Slug</TableHead>
								<TableHead className="min-w-35 font-semibold text-foreground py-3 text-center">
									Planes de Estudio
								</TableHead>
								<TableHead className="w-28 text-right font-semibold text-foreground py-3 pr-4">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="">
							{paginatedRows.length === 0 ?
								<TableRow>
									<TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
										<div className="flex flex-col items-center justify-center gap-2">
											<IconSchool className="size-8 text-muted-foreground/50" />
											<span>No se encontraron carreras que coincidan con la búsqueda.</span>
										</div>
									</TableCell>
								</TableRow>
							:	paginatedRows.map(({id, nombre, slug, icon, active, resolucion_id, planesCount}) => {
									const currentItem: CarreraAdminItem = {id, nombre, slug, icon, active, resolucion_id, planesCount}
									return (
										<TableRow key={id} className={`hover:bg-muted/30 transition-colors theme-${slug}`}>
											{/* COLUMNA ICONO */}
											<TableCell className="py-3 pl-4 text-center">
												<IconBox size="sm">
													<Icon icon={icon || "device-imac"} />
												</IconBox>
											</TableCell>

											{/* COLUMNA NOMBRE & SLUG DEBAJO */}
											<TableCell className="py-3 font-medium text-foreground">
												<div className="flex flex-col min-w-0">
													<span className="font-bold text-sm text-foreground truncate">{nombre}</span>
													<span className="text-xs font-mono text-muted-foreground truncate">/{slug}</span>
												</div>
											</TableCell>

											{/* COLUMNA PLANES DE ESTUDIO */}
											<TableCell className="py-3 text-center">
												<Badge variant="secondary">
													<IconBooks className="size-3" />
													{planesCount} {planesCount === 1 ? "Plan" : "Planes"}
												</Badge>
											</TableCell>

											{/* COLUMNA ACCIONES */}
											<TableCell className="py-3 pr-4 text-right">
												<div className="flex items-center justify-end gap-1">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => setCarreraToEdit(currentItem)}
														title="Editar carrera"
														className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted">
														<IconEdit className="size-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => setCarreraToDelete(currentItem)}
														title="Eliminar carrera"
														className="size-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10">
														<IconTrash className="size-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									)
								})
							}
						</TableBody>
					</Table>
				</CardContent>

				{/* PAGINACIÓN */}
				{filteredRows.length > 0 && (
					<CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-border bg-muted/20 text-xs">
						<span className="text-muted-foreground">
							Mostrando{" "}
							<strong className="text-foreground font-semibold">
								{(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredRows.length)}
							</strong>{" "}
							de <strong className="text-foreground font-semibold">{filteredRows.length}</strong> carreras
						</span>

						<div className="flex items-center gap-1.5">
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage === 1}
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								className="h-8 text-xs gap-1">
								<IconChevronLeft className="size-4" />
								Anterior
							</Button>

							<span className="px-3 font-semibold text-xs text-foreground">
								Página {currentPage} de {totalPages}
							</span>

							<Button
								variant="outline"
								size="sm"
								disabled={currentPage >= totalPages}
								onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
								className="h-8 text-xs gap-1">
								Siguiente
								<IconChevronRight className="size-4" />
							</Button>
						</div>
					</CardFooter>
				)}
			</Card>



			{/* MODAL DE EDICIÓN */}
			{carreraToEdit && (
				<CarreraModal
					key={`edit-carrera-modal-${carreraToEdit.id}`}
					isOpen={!!carreraToEdit}
					onClose={() => setCarreraToEdit(null)}
					carrera={carreraToEdit}
					onSuccess={handleActionSuccess}
				/>
			)}

			{/* MODAL DE ELIMINACIÓN */}
			<DeleteCarreraModal
				isOpen={!!carreraToDelete}
				onClose={() => setCarreraToDelete(null)}
				carrera={carreraToDelete}
				onSuccess={handleActionSuccess}
			/>
		</section>
	)
}

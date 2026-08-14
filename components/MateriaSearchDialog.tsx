"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconSearch, IconX, IconCornerDownLeft, IconBook, IconFilter, IconSparkles } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import Icon from "@/components/Icon"
import { fetchMateriasPlanSearchAction } from "@/lib/searchActions"
import type { MateriaPlanSearchItem, SearchDataResponse } from "@/types/consultas"
import { cn, normalizeText } from "@/lib/utils"

interface MateriaSearchDialogProps {
	initialCarreraSlug?: string
	initialPlanYear?: number
	initialSearchData?: SearchDataResponse
}

export default function MateriaSearchDialog({
	initialCarreraSlug,
	initialPlanYear,
	initialSearchData,
}: MateriaSearchDialogProps) {
	const router = useRouter()
	const [isOpen, setIsOpen] = React.useState(false)
	const [searchQuery, setSearchQuery] = React.useState("")
	const [selectedCarreraSlug, setSelectedCarreraSlug] = React.useState<string | null>(initialCarreraSlug || null)
	const [selectedPlanYear, setSelectedPlanYear] = React.useState<number | null>(initialPlanYear || null)
	const [selectedIndex, setSelectedIndex] = React.useState(0)
	const [searchData, setSearchData] = React.useState<SearchDataResponse | null>(initialSearchData || null)
	const isFetchingData = isOpen && !searchData

	const inputRef = React.useRef<HTMLInputElement>(null)
	const resultsRef = React.useRef<HTMLDivElement>(null)

	// Sync initial props when they change during render
	const [prevCarrera, setPrevCarrera] = React.useState(initialCarreraSlug)
	if (initialCarreraSlug !== prevCarrera) {
		setPrevCarrera(initialCarreraSlug)
		setSelectedCarreraSlug(initialCarreraSlug || null)
	}

	const [prevPlan, setPrevPlan] = React.useState(initialPlanYear)
	if (initialPlanYear !== prevPlan) {
		setPrevPlan(initialPlanYear)
		setSelectedPlanYear(initialPlanYear || null)
	}

	// Detect Mac platform
	const isMac = React.useSyncExternalStore(
		() => () => {},
		() => typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0,
		() => false,
	)

	// Fetch search data lazily when dialog opens if not provided
	React.useEffect(() => {
		if (!isOpen || searchData) return
		let isMounted = true

		fetchMateriasPlanSearchAction()
			.then((data) => {
				if (isMounted) {
					setSearchData(data)
				}
			})
			.catch((err) => {
				console.error("Error al cargar datos de búsqueda:", err)
			})

		return () => {
			isMounted = false
		}
	}, [isOpen, searchData])

	// Global shortcut listener (⌘K / Ctrl+K)
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault()
				setIsOpen((prev) => !prev)
			}
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [])

	// Reset index when query or filters change
	const [prevQuery, setPrevQuery] = React.useState(searchQuery)
	const [prevFilterCarrera, setPrevFilterCarrera] = React.useState(selectedCarreraSlug)
	const [prevFilterPlan, setPrevFilterPlan] = React.useState(selectedPlanYear)

	if (
		searchQuery !== prevQuery ||
		selectedCarreraSlug !== prevFilterCarrera ||
		selectedPlanYear !== prevFilterPlan
	) {
		setPrevQuery(searchQuery)
		setPrevFilterCarrera(selectedCarreraSlug)
		setPrevFilterPlan(selectedPlanYear)
		setSelectedIndex(0)
	}

	// Focus input when modal opens
	const handleOpenChange = (open: boolean) => {
		setIsOpen(open)
		if (!open) {
			setSearchQuery("")
		} else {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 50)
		}
	}

	// Check if user is typing a tag (#...)
	const isTagQuery = searchQuery.startsWith("#")
	const tagTerm = isTagQuery ? normalizeText(searchQuery.slice(1)) : ""

	// Filter carreras for #tag suggestions (always available when typing #)
	const matchingCarrerasForTag = React.useMemo(() => {
		if (!isTagQuery || !searchData) return []
		return searchData.carreras.filter(({ nombre, slug }) => {
			if (selectedCarreraSlug === slug) return false
			if (!tagTerm) return true
			return normalizeText(nombre).includes(tagTerm) || normalizeText(slug).includes(tagTerm)
		})
	}, [isTagQuery, searchData, tagTerm, selectedCarreraSlug])

	// Filter planes for #tag suggestions ONLY if a carrera is already selected!
	const matchingPlanesForTag = React.useMemo(() => {
		if (!isTagQuery || !searchData || !selectedCarreraSlug) return []

		// Available planes for the selected carrera
		const planesForCarreraSet = new Set<number>()
		searchData.materias.forEach(({ carreraSlug, planAnio }) => {
			if (carreraSlug === selectedCarreraSlug) {
				planesForCarreraSet.add(planAnio)
			}
		})

		const availablePlanes = Array.from(planesForCarreraSet.values()).sort((a, b) => b - a)

		return availablePlanes.filter((planAnio) => {
			if (selectedPlanYear === planAnio) return false
			if (!tagTerm) return true
			return planAnio.toString().includes(tagTerm)
		})
	}, [isTagQuery, searchData, tagTerm, selectedCarreraSlug, selectedPlanYear])

	// Determine if user has activated any search or filter
	const hasActiveSearch = searchQuery.trim().length > 0 || selectedCarreraSlug !== null || selectedPlanYear !== null

	// Filter materias list (ONLY when user has typed something or selected a filter!)
	const filteredMaterias = React.useMemo(() => {
		if (!searchData || isTagQuery || !hasActiveSearch) return []

		const term = normalizeText(searchQuery.trim())

		return searchData.materias.filter(({ materiaNombre, materiaSlug, carreraSlug, planAnio }) => {
			// Carrera filter
			if (selectedCarreraSlug && carreraSlug !== selectedCarreraSlug) {
				return false
			}
			// Plan filter
			if (selectedPlanYear && planAnio !== selectedPlanYear) {
				return false
			}
			// Text filter
			if (!term) return true

			const normNombre = normalizeText(materiaNombre)
			const normSlug = normalizeText(materiaSlug)
			return normNombre.includes(term) || normSlug.includes(term)
		})
	}, [searchData, searchQuery, selectedCarreraSlug, selectedPlanYear, isTagQuery, hasActiveSearch])

	const selectedCarreraObj = React.useMemo(() => {
		if (!selectedCarreraSlug || !searchData) return null
		return searchData.carreras.find(({ slug }) => slug === selectedCarreraSlug) || null
	}, [selectedCarreraSlug, searchData])

	// Handle removal of carrera badge (also resets plan filter since plan depends on carrera)
	const handleRemoveCarreraFilter = () => {
		setSelectedCarreraSlug(null)
		setSelectedPlanYear(null)
	}

	// Handle selection of a materia item
	const handleSelectMateria = React.useCallback(
		({ carreraSlug, planAnio, materiaSlug }: MateriaPlanSearchItem) => {
			setIsOpen(false)
			router.push(`/carreras/${carreraSlug}/${planAnio}/${materiaSlug}`)
		},
		[router],
	)

	// Keyboard navigation in modal
	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === "Escape") {
			setIsOpen(false)
			return
		}

		if (isTagQuery) {
			const totalTagSuggestions = matchingCarrerasForTag.length + matchingPlanesForTag.length
			if (totalTagSuggestions === 0) return

			if (e.key === "ArrowDown") {
				e.preventDefault()
				setSelectedIndex((prev) => (prev + 1) % totalTagSuggestions)
			} else if (e.key === "ArrowUp") {
				e.preventDefault()
				setSelectedIndex((prev) => (prev - 1 + totalTagSuggestions) % totalTagSuggestions)
			} else if (e.key === "Enter") {
				e.preventDefault()
				if (selectedIndex < matchingCarrerasForTag.length) {
					const target = matchingCarrerasForTag[selectedIndex]
					if (target) {
						setSelectedCarreraSlug(target.slug)
						setSearchQuery("")
					}
				} else {
					const planIndex = selectedIndex - matchingCarrerasForTag.length
					const targetPlan = matchingPlanesForTag[planIndex]
					if (targetPlan !== undefined) {
						setSelectedPlanYear(targetPlan)
						setSearchQuery("")
					}
				}
			}
			return
		}

		// Backspace on empty input removes last filter badge
		if (e.key === "Backspace" && searchQuery === "") {
			if (selectedPlanYear !== null) {
				setSelectedPlanYear(null)
			} else if (selectedCarreraSlug !== null) {
				handleRemoveCarreraFilter()
			}
			return
		}

		const totalResults = filteredMaterias.length
		if (totalResults === 0) return

		if (e.key === "ArrowDown") {
			e.preventDefault()
			setSelectedIndex((prev) => {
				const next = (prev + 1) % totalResults
				scrollItemIntoView(next)
				return next
			})
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setSelectedIndex((prev) => {
				const next = (prev - 1 + totalResults) % totalResults
				scrollItemIntoView(next)
				return next
			})
		} else if (e.key === "Enter") {
			e.preventDefault()
			const item = filteredMaterias[selectedIndex]
			if (item) {
				handleSelectMateria(item)
			}
		}
	}

	const scrollItemIntoView = (index: number) => {
		if (!resultsRef.current) return
		const items = resultsRef.current.querySelectorAll<HTMLButtonElement>("[data-search-item]")
		const targetItem = items[index]
		if (targetItem) {
			targetItem.scrollIntoView({ block: "nearest", behavior: "smooth" })
		}
	}

	return (
		<>
			{/* Trigger button */}
			<Button
				variant="outline"
				onClick={() => setIsOpen(true)}
				className="relative h-10 sm:w-64 md:w-80 sm:justify-start justify-center text-xs sm:text-sm text-muted-foreground rounded-full bg-card hover:bg-accent border-border shadow-xs font-normal sm:px-4 px-0"
				size="icon-lg"
				aria-label="Buscar materias">
				<IconSearch className="sm:mr-2.5 size-4 shrink-0 text-muted-foreground" />
				<span className="truncate hidden sm:inline">Buscar materias o carreras...</span>
				<kbd className="pointer-events-none absolute right-3 top-2.5 hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
					{isMac ? "⌘" : "Ctrl+"}K
				</kbd>
			</Button>

			{/* Dialog Modal - Large Command Card */}
			<Dialog open={isOpen} onOpenChange={handleOpenChange}>
				<DialogPortal>
					<DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-200" />
					<DialogContent
						showCloseButton={false}
						className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl sm:max-w-3xl -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-3xl border border-border/80 bg-card p-0 text-card-foreground shadow-2xl transition-all duration-200"
						onKeyDown={handleKeyDown}>
						{/* Header: Large Input & Filter Badges */}
						<div className="flex flex-col border-b border-border/80 p-5 gap-3.5 bg-muted/30">
							<div className="relative flex items-center gap-3">
								<IconSearch className="size-6 shrink-0 text-muted-foreground" />
								<input
									ref={inputRef}
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder={
										selectedCarreraSlug
											? "Escribí el nombre de la materia o #año..."
											: "Buscar materia por nombre... (escribí # para elegir carrera)"
									}
									className="w-full bg-transparent text-base sm:text-xl text-foreground placeholder:text-muted-foreground font-medium outline-none border-none p-0 focus:ring-0"
								/>
								{searchQuery && (
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => setSearchQuery("")}
										className="shrink-0 text-muted-foreground hover:text-foreground rounded-full">
										<IconX className="size-5" />
									</Button>
								)}
							</div>

							{/* Active Filter Badges Bar */}
							{(selectedCarreraSlug || selectedPlanYear !== null) && (
								<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
									<span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
										<IconFilter className="size-3.5 text-primary" /> Filtros activos:
									</span>
									{selectedCarreraSlug && (
										<div className={cn("theme-" + selectedCarreraSlug, "inline-flex")}>
											<Badge
												variant="secondary"
												className="pl-3 pr-1.5 py-1 text-xs sm:text-sm font-semibold flex items-center gap-1.5 rounded-full bg-primary/15 text-primary border border-primary/30 shadow-xs">
												{selectedCarreraObj?.icon && (
													<Icon icon={selectedCarreraObj.icon} className="size-3.5 shrink-0" />
												)}
												<span>#{selectedCarreraObj?.nombre || selectedCarreraSlug}</span>
												<button
													type="button"
													onClick={handleRemoveCarreraFilter}
													className="ml-1 rounded-full p-1 hover:bg-primary/25 transition-colors">
													<IconX className="size-3.5" />
												</button>
											</Badge>
										</div>
									)}
									{selectedPlanYear !== null && selectedCarreraSlug && (
										<div className={cn("theme-" + selectedCarreraSlug, "inline-flex")}>
											<Badge
												variant="secondary"
												className="pl-3 pr-1.5 py-1 text-xs sm:text-sm font-semibold flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground border border-border shadow-xs">
												<span>#Plan {selectedPlanYear}</span>
												<button
													type="button"
													onClick={() => setSelectedPlanYear(null)}
													className="ml-1 rounded-full p-1 hover:bg-muted transition-colors">
													<IconX className="size-3.5" />
												</button>
											</Badge>
										</div>
									)}
								</div>
							)}
						</div>

						{/* Body / Content */}
						<div ref={resultsRef} className="max-h-[460px] overflow-y-auto p-3 scrollbar-thin">
							{isFetchingData ? (
								<div className="py-16 text-center text-base text-muted-foreground flex flex-col items-center gap-3">
									<div className="size-7 animate-spin rounded-full border-3 border-primary border-t-transparent" />
									<span className="font-medium">Cargando materias y carreras...</span>
								</div>
							) : isTagQuery ? (
								/* Tag Suggestions list (#carrera or #plan) */
								<div className="flex flex-col gap-4 p-2">
									<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
										Etiquetas disponibles ({selectedCarreraSlug ? "Carrera o Plan" : "Carrera"})
									</div>
									{matchingCarrerasForTag.length > 0 && (
										<div className="flex flex-col gap-1.5">
											<span className="text-xs font-bold text-muted-foreground/80 px-2">
												Seleccionar Carrera
											</span>
											{matchingCarrerasForTag.map(({ id, nombre, slug, icon }, idx) => {
												const isSelected = selectedIndex === idx
												return (
													<div key={id} className={cn("theme-" + slug)}>
														<button
															type="button"
															onClick={() => {
																setSelectedCarreraSlug(slug)
																setSearchQuery("")
															}}
															className={cn(
																"flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all border",
																isSelected
																	? "bg-primary/15 border-primary/40 text-primary font-bold shadow-xs"
																	: "hover:bg-primary/10 border-transparent text-foreground",
															)}>
															<div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
																<Icon icon={icon} className="size-4" />
															</div>
															<span className="text-sm sm:text-base truncate">#{nombre}</span>
														</button>
													</div>
												)
											})}
										</div>
									)}

									{/* ONLY render plan options if carrera is selected */}
									{selectedCarreraSlug && matchingPlanesForTag.length > 0 && (
										<div className="flex flex-col gap-1.5">
											<span className="text-xs font-bold text-muted-foreground/80 px-2">
												Planes de Estudio para la carrera seleccionada
											</span>
											{matchingPlanesForTag.map((planAnio, idx) => {
												const globalIdx = matchingCarrerasForTag.length + idx
												const isSelected = selectedIndex === globalIdx
												return (
													<div key={planAnio} className={cn("theme-" + selectedCarreraSlug)}>
														<button
															type="button"
															onClick={() => {
																setSelectedPlanYear(planAnio)
																setSearchQuery("")
															}}
															className={cn(
																"flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all border",
																isSelected
																	? "bg-accent border-border text-foreground font-bold shadow-xs"
																	: "hover:bg-muted/60 border-transparent text-foreground",
															)}>
															<IconFilter className="size-4 text-muted-foreground shrink-0" />
															<span className="text-sm sm:text-base truncate">#Plan {planAnio}</span>
														</button>
													</div>
												)
											})}
										</div>
									)}

									{!selectedCarreraSlug && (
										<div className="px-3 py-2 text-xs text-muted-foreground italic bg-muted/30 rounded-lg">
											Tip: Seleccioná primero una carrera para poder filtrar por plan (#año).
										</div>
									)}

									{matchingCarrerasForTag.length === 0 && matchingPlanesForTag.length === 0 && (
										<div className="py-8 text-center text-sm text-muted-foreground">
											No se encontraron opciones para &quot;#{tagTerm}&quot;
										</div>
									)}
								</div>
							) : hasActiveSearch ? (
								/* Results List */
								filteredMaterias.length > 0 ? (
									<div className="flex flex-col gap-2">
										{filteredMaterias.map((item, idx) => {
											const { idMateriaPlan, materiaNombre, carreraNombre, carreraSlug, carreraIcon, planAnio } = item
											const isSelected = selectedIndex === idx

											return (
												<div key={idMateriaPlan} className={cn("theme-" + carreraSlug)}>
													<button
														data-search-item
														type="button"
														onClick={() => handleSelectMateria(item)}
														onMouseEnter={() => setSelectedIndex(idx)}
														className={cn(
															"flex items-center justify-between gap-4 w-full px-4 py-3.5 text-left rounded-2xl border transition-all duration-150 group",
															isSelected
																? "bg-primary/15 border-primary/50 shadow-sm font-medium text-foreground ring-1 ring-primary/40"
																: "bg-card/60 hover:bg-primary/10 border-border/80 text-foreground",
														)}>
														<div className="flex items-center gap-3.5 min-w-0 flex-1">
															<div className="size-11 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0 shadow-xs">
																<Icon icon={carreraIcon || "book"} className="size-5" />
															</div>
															<div className="flex flex-col min-w-0">
																{/* Title: materia */}
																<span className="text-base sm:text-lg font-bold truncate leading-snug">
																	{materiaNombre}
																</span>
																{/* Description: carrera (plan) with carrera theme badge */}
																<div className="flex items-center gap-2 mt-1 min-w-0">
																	<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 truncate">
																		{carreraNombre}
																	</span>
																	<span className="text-xs text-muted-foreground font-medium shrink-0">
																		(Plan {planAnio})
																	</span>
																</div>
															</div>
														</div>
														<IconCornerDownLeft
															className={cn(
																"size-5 shrink-0 transition-opacity",
																isSelected ? "opacity-100 text-primary" : "opacity-0",
															)}
														/>
													</button>
												</div>
											)
										})}
									</div>
								) : (
									/* Empty Search Results */
									<div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
										<IconBook className="size-10 stroke-1 text-muted-foreground/40" />
										<span className="text-base font-medium">
											No se encontraron materias que coincidan con la búsqueda.
										</span>
										{(selectedCarreraSlug || selectedPlanYear !== null) && (
											<Button
												variant="link"
												size="sm"
												onClick={() => {
													setSelectedCarreraSlug(null)
													setSelectedPlanYear(null)
												}}
												className="text-primary mt-1 font-semibold">
												Quitar filtros y buscar en todas las carreras
											</Button>
										)}
									</div>
								)
							) : (
								/* Initial Empty State (Prompt user to type or select a career) */
								<div className="py-8 px-4 flex flex-col gap-6">
									<div className="flex items-center gap-3 text-muted-foreground">
										<IconSparkles className="size-6 text-primary shrink-0" />
										<div>
											<h4 className="text-base font-bold text-foreground">
												Buscador de Materias y Carreras
											</h4>
											<p className="text-sm text-muted-foreground">
												Escribí el nombre de la materia arriba o seleccioná una carrera para empezar:
											</p>
										</div>
									</div>

									{/* Carrera quick chips */}
									{searchData && searchData.carreras.length > 0 && (
										<div className="flex flex-col gap-2.5">
											<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
												Carreras Disponibles:
											</span>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
												{searchData.carreras.map(({ id, nombre, slug, icon }) => (
													<div key={id} className={cn("theme-" + slug)}>
														<button
															type="button"
															onClick={() => {
																setSelectedCarreraSlug(slug)
															}}
															className="flex items-center gap-3 w-full p-3 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/40 text-left transition-all group">
															<div className="size-9 rounded-lg bg-primary/15 text-primary border border-primary/25 flex items-center justify-center shrink-0">
																<Icon icon={icon} className="size-4" />
															</div>
															<span className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
																{nombre}
															</span>
														</button>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							)}
						</div>

						{/* Footer Actions Bar */}
						<div className="flex flex-wrap items-center justify-between border-t border-border/80 bg-muted/30 px-6 py-3.5 text-xs sm:text-sm text-muted-foreground gap-3">
							<div className="flex items-center gap-4 flex-wrap font-medium">
								<span className="flex items-center gap-1.5">
									<Kbd className="h-5 px-1.5 text-xs font-bold">Esc</Kbd> salir
								</span>
								<span className="flex items-center gap-1.5">
									<Kbd className="h-5 px-1.5 text-xs font-bold">↵</Kbd> ir a materia
								</span>
								<span className="flex items-center gap-1.5">
									<Kbd className="h-5 px-1.5 text-xs font-bold">↑↓</Kbd> navegar
								</span>
								<span className="flex items-center gap-1.5">
									<Kbd className="h-5 px-1.5 text-xs font-bold">#</Kbd> filtrar carrera/plan
								</span>
							</div>

							{hasActiveSearch && !isTagQuery && searchData && (
								<span className="text-xs font-bold text-muted-foreground">
									{filteredMaterias.length}{" "}
									{filteredMaterias.length === 1 ? "materia" : "materias"}
								</span>
							)}
						</div>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	)
}

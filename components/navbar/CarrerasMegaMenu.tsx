"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import Icon from "@/components/Icon"
import { normalizeText } from "@/lib/utils"
import type { Subtab } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface CarrerasMegaMenuProps {
	carreras: Subtab[]
}

export default function CarrerasMegaMenu({ carreras }: CarrerasMegaMenuProps) {
	const [searchTerm, setSearchTerm] = useState("")

	const filteredCarreras = useMemo(() => {
		if (!searchTerm.trim()) return carreras
		const term = normalizeText(searchTerm)
		return carreras.filter(({ label }) => normalizeText(label).includes(term))
	}, [carreras, searchTerm])

	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="relative">
				<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
				<Input
					placeholder="Filtrar carreras..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-9 h-9 text-sm rounded-lg"
				/>
			</div>

			<div className="max-h-[70vh] overflow-y-auto scrollbar-thin flex flex-col gap-1">
				{filteredCarreras.length > 0 ? (
					filteredCarreras.map(({ label, href, icon, slug }) => (
						<Link
							key={label}
							href={href}
							className={cn(
								"flex flex-row items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors",
								slug && `theme-${slug}`
							)}>
							<span className="size-4 shrink-0">{icon}</span>
							<span className="truncate">{label}</span>
						</Link>
					))
				) : (
					<div className="text-center py-6 text-sm text-muted-foreground">
						Sin resultados
					</div>
				)}
			</div>

			<div className="border-t border-border/80 pt-3">
				<Link
					href="/carreras"
					className="block w-full px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-muted transition-colors text-center">
					Ver todas las carreras
				</Link>
			</div>
		</div>
	)
}

"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import IconCarrera from "@/components/Icon"
import { IconArrowLeft, IconSchool } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface CarreraHeaderSectionProps {
	carrera: {
		id: number
		nombre: string
		slug: string
		icon: string
	}
	planAnio: number
}

export default function CarreraHeaderSection({ carrera, planAnio }: CarreraHeaderSectionProps) {
	const { nombre, slug, icon } = carrera

	return (
		<section className={cn("flex flex-col gap-4 theme-" + slug)}>
			<nav aria-label="Volver">
				<Button variant="ghost" size="sm" className="w-fit gap-1 text-muted-foreground hover:text-foreground" render={
					<Link href="/perfil">
						<IconArrowLeft className="size-4" />
						<span>Volver al inicio del Perfil</span>
					</Link>
				} />
			</nav>

			<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-card via-card to-primary/10 border border-primary/20">
				<div className="flex items-center gap-4">
					<span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
						<IconCarrera icon={icon || "device-imac"} className="size-8" />
					</span>
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2 flex-wrap">
							<h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
								{nombre}
							</h1>
							<Badge variant="outline" className="font-semibold text-xs">
								Plan {planAnio}
							</Badge>
						</div>
						<p className="text-xs text-muted-foreground">
							Dashboard de seguimiento académico y materias activas
						</p>
					</div>
				</div>

				<Button variant="default" size="sm" render={
					<Link href={`/${slug}/${planAnio}`} className="flex items-center gap-2">
						<IconSchool data-icon="inline-start" />
						<span>Ver Plan de Estudios Completo</span>
					</Link>
				} />
			</header>
		</section>
	)
}

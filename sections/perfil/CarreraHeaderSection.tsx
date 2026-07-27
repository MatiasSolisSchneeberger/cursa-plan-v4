"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
	user?: {
		fullName?: string | null
		username?: string | null
		avatarUrl?: string | null
	} | null
}

export default function CarreraHeaderSection({ carrera, planAnio, user }: CarreraHeaderSectionProps) {
	const { nombre, slug, icon } = carrera

	const initials = user?.fullName
		? user.fullName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.substring(0, 2)
				.toUpperCase()
		: user?.username
		? user.username.substring(0, 2).toUpperCase()
		: "U"

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

			<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-card via-card to-primary/10 border border-primary/20 shadow-xs">
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

				<div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
					{user && (
						<article className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border shadow-2xs">
							<Avatar className="size-8 border border-primary/30 shrink-0">
								<AvatarImage src={user.avatarUrl || undefined} alt={user.fullName || "Usuario"} />
								<AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col text-left leading-none">
								<span className="text-xs font-bold text-foreground">
									{user.fullName || user.username || "Estudiante"}
								</span>
								{user.username && (
									<span className="text-[10px] text-muted-foreground mt-0.5">
										@{user.username}
									</span>
								)}
							</div>
						</article>
					)}

					<Button variant="default" size="sm" render={
						<Link href={`/${slug}/${planAnio}`} className="flex items-center gap-2">
							<IconSchool data-icon="inline-start" />
							<span>Ver Plan de Estudios Completo</span>
						</Link>
					} />
				</div>
			</header>
		</section>
	)
}

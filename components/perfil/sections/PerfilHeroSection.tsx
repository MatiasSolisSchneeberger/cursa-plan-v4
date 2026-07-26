"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconSparkles, IconChevronRight } from "@tabler/icons-react"
import type { PerfilUsuario } from "@/types/consultas"

interface PerfilHeroSectionProps {
	usuario: PerfilUsuario
}

export default function PerfilHeroSection({ usuario }: PerfilHeroSectionProps) {
	const { fullName, username, avatarUrl, role } = usuario

	const initials = fullName
		? fullName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.substring(0, 2)
				.toUpperCase()
		: username
		? username.substring(0, 2).toUpperCase()
		: "U"

	return (
		<section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
			<header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
				<div className="flex items-center gap-4">
					<figure className="relative m-0">
						<Avatar className="size-16 sm:size-20 border-2 border-primary/30 shadow-md">
							<AvatarImage src={avatarUrl || undefined} alt={fullName || "Usuario"} />
							<AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
								{initials}
							</AvatarFallback>
						</Avatar>
					</figure>
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2 flex-wrap">
							<h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
								{fullName || username || "Estudiante"}
							</h1>
							<Badge variant="secondary" className="capitalize text-xs font-semibold">
								{role === "admin" ? "Administrador" : "Estudiante"}
							</Badge>
						</div>
						{username && (
							<p className="text-sm text-muted-foreground font-medium">@{username}</p>
						)}
						<p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
							<IconSparkles className="size-3.5 text-amber-500" />
							<span>Bienvenido a tu panel académico</span>
						</p>
					</div>
				</div>

				<Button variant="outline" size="sm" render={
					<Link href="/perfil/configuracion" className="flex items-center gap-2">
						<span>Editar Perfil</span>
						<IconChevronRight data-icon="inline-end" />
					</Link>
				} />
			</header>
		</section>
	)
}

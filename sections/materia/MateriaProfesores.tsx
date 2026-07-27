"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription } from "@/components/ui/item"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconMail } from "@tabler/icons-react"

export default function MateriaProfesores() {
	const profesores = [
		{
			id: 1,
			nombre: "Profesor 1",
			rol: "Profesor Titular",
			email: "profesor1@universidad.edu.ar",
			iniciales: "P1"
		},
		{
			id: 2,
			nombre: "Profesor 2",
			rol: "Profesor Adjunto",
			email: "profesor2@universidad.edu.ar",
			iniciales: "P2"
		},
		{
			id: 3,
			nombre: "Profesor 3",
			rol: "Jefe de Trabajos Prácticos (JTP)",
			email: "profesor3@universidad.edu.ar",
			iniciales: "P3"
		}
	]

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg">Equipo Docente</CardTitle>
				<CardDescription>Profesores y auxiliares a cargo de la cátedra</CardDescription>
			</CardHeader>
			<CardContent>
				<ItemGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{profesores.map((prof) => (
						<Item key={prof.id} variant="outline" className="p-3 hover:bg-accent/40 transition-colors flex items-center gap-3">
							<ItemMedia>
								<Avatar className="size-10">
									<AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
										{prof.iniciales}
									</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="text-sm font-semibold">{prof.nombre}</ItemTitle>
								<ItemDescription className="text-xs font-medium text-primary mt-0.5">{prof.rol}</ItemDescription>
								<div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground select-all">
									<IconMail className="size-3 shrink-0" />
									<span className="truncate">{prof.email}</span>
								</div>
							</ItemContent>
						</Item>
					))}
				</ItemGroup>
			</CardContent>
		</Card>
	)
}

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { IconFolder, IconFileText, IconDownload, IconExternalLink } from "@tabler/icons-react"

export default function MateriaDocumentos() {
	// Mock documents data
	const planDeEstudioDocs = [
		{
			id: 1,
			titulo: "Programa Analítico - Álgebra",
			fecha: "2024",
			tamano: "1.2 MB",
			tipo: "pdf",
		},
		{
			id: 2,
			titulo: "Planificación de Cátedra",
			fecha: "2024",
			tamano: "850 KB",
			tipo: "pdf",
		}
	]

	const resolucionesDocs = [
		{
			id: 3,
			titulo: "Resolución CD N° 142/18 (Validez Nacional)",
			fecha: "2018",
			tamano: "2.4 MB",
			tipo: "pdf",
		},
		{
			id: 4,
			titulo: "Régimen de Cursada y Aprobación",
			fecha: "2022",
			tamano: "512 KB",
			tipo: "pdf",
		}
	]

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Plan de Estudio Folder Card */}
			<Card className="h-full">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
							<IconFolder className="size-5" />
						</div>
						<div>
							<CardTitle className="text-lg">Plan de Estudio</CardTitle>
							<CardDescription>Documentación del plan curricular actual</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ItemGroup className="gap-3">
						{planDeEstudioDocs.map((doc) => (
							<Item key={doc.id} variant="outline" size="sm" className="hover:bg-accent/40 transition-colors">
								<ItemMedia>
									<IconFileText className="size-5 text-muted-foreground" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle className="text-sm font-semibold">{doc.titulo}</ItemTitle>
									<ItemDescription className="text-xs">Año: {doc.fecha} • {doc.tamano}</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Button variant="ghost" size="icon" className="size-8" title="Descargar">
										<IconDownload className="size-4 text-primary" />
									</Button>
								</ItemActions>
							</Item>
						))}
					</ItemGroup>
				</CardContent>
			</Card>

			{/* Resoluciones Folder Card */}
			<Card className="h-full">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
							<IconFolder className="size-5" />
						</div>
						<div>
							<CardTitle className="text-lg">Resoluciones</CardTitle>
							<CardDescription>Disposiciones y resoluciones oficiales de la materia</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ItemGroup className="gap-3">
						{resolucionesDocs.map((doc) => (
							<Item key={doc.id} variant="outline" size="sm" className="hover:bg-accent/40 transition-colors">
								<ItemMedia>
									<IconFileText className="size-5 text-muted-foreground" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle className="text-sm font-semibold">{doc.titulo}</ItemTitle>
									<ItemDescription className="text-xs">Año: {doc.fecha} • {doc.tamano}</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Button variant="ghost" size="icon" className="size-8" title="Descargar">
										<IconDownload className="size-4 text-primary" />
									</Button>
								</ItemActions>
							</Item>
						))}
					</ItemGroup>
				</CardContent>
			</Card>
		</div>
	)
}

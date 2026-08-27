"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconAlertCircle } from "@tabler/icons-react"
import { rutaPlan } from "@/lib/rutas"

export default function MateriaNotFound() {
	const pathname = usePathname()
	const segments = pathname.split("/").filter(Boolean)
	const carreraSlug = segments[1] || ""
	const plan = segments[2] || ""

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center gap-3">
						<IconAlertCircle className="size-5 text-destructive shrink-0" />
						<CardTitle>Materia no encontrada</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">
						No pudimos encontrar la materia que estás buscando. Verifica la URL e intenta de nuevo.
					</p>
					<Link href={rutaPlan(carreraSlug, plan)}>
						<Button variant="default" className="w-full">
							Volver al Plan
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}

"use client"

import * as React from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {setEstadoMateria} from "@/lib/actions"
import type {EstadoMateria} from "@/types/materiaTypes"
import {IconLoader2} from "@tabler/icons-react"

interface MateriaEstadoSelectorProps {
	materiaPlanId: number
	initialEstado: EstadoMateria
	userId?: string
}

export function MateriaEstadoSelector({
	materiaPlanId,
	initialEstado,
	userId,
}: MateriaEstadoSelectorProps) {
	const [estado, setEstado] = React.useState<EstadoMateria>(initialEstado)
	const [isPending, startTransition] = React.useTransition()

	const handleValueChange = (newValue: EstadoMateria | null) => {
		if (!newValue) return
		const nextEstado = newValue
		setEstado(nextEstado)

		if (!userId) {
			// Si no hay usuario logueado, podemos guardarlo en localStorage o simplemente simularlo para testing local
			localStorage.setItem(`materia-estado-${materiaPlanId}`, nextEstado)
			return
		}

		startTransition(async () => {
			const success = await setEstadoMateria(userId, materiaPlanId, nextEstado)
			if (!success) {
				// Revertir en caso de error
				setEstado(estado)
				alert("Error al actualizar el estado de la materia. Intenta de nuevo.")
			}
		})
	}

	// Al montar, si no hay usuario, recuperamos el estado guardado localmente si existe
	React.useEffect(() => {
		if (!userId) {
			const localSaved = localStorage.getItem(`materia-estado-${materiaPlanId}`)
			if (localSaved) {
				setEstado(localSaved as EstadoMateria)
			}
		}
	}, [userId, materiaPlanId])

	return (
		<div className="flex items-center gap-2">
			{isPending && <IconLoader2 className="size-4 animate-spin text-muted-foreground" />}
			<Select value={estado} onValueChange={handleValueChange}>
				<SelectTrigger className="w-40" size="sm">
					<SelectValue placeholder="Estado" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="Sin cursar">Sin cursar</SelectItem>
					<SelectItem value="Cursando">Cursando</SelectItem>
					<SelectItem value="Regular">Regular</SelectItem>
					<SelectItem value="Aprobado">Aprobado</SelectItem>
					<SelectItem value="Libre">Libre</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}

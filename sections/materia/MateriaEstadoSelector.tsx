"use client"

import * as React from "react"
import {setEstadoMateria} from "@/lib/actions"
import type {EstadoMateria} from "@/types/materiaTypes"
import {IconLoader2} from "@tabler/icons-react"
import {MateriaEstadoSelect} from "@/components/MateriaEstadoSelect"

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
	const [estado, setEstado] = React.useState<EstadoMateria>(() => {
		if (initialEstado && initialEstado !== "Sin cursar") return initialEstado
		if (typeof window !== "undefined" && !userId) {
			const localSaved = localStorage.getItem(`materia-estado-${materiaPlanId}`)
			if (localSaved) return localSaved as EstadoMateria
		}
		return initialEstado || "Sin cursar"
	})
	const [isPending, startTransition] = React.useTransition()

	const handleValueChange = (newValue: EstadoMateria | null) => {
		if (!newValue) return
		const nextEstado = newValue
		setEstado(nextEstado)

		if (!userId) {
			localStorage.setItem(`materia-estado-${materiaPlanId}`, nextEstado)
			return
		}

		startTransition(async () => {
			const success = await setEstadoMateria(userId, materiaPlanId, nextEstado)
			if (!success) {
				setEstado(estado)
				alert("Error al actualizar el estado de la materia. Intenta de nuevo.")
			}
		})
	}

	return (
		<div className="flex items-center gap-2">
			{isPending && <IconLoader2 className="size-4 animate-spin text-muted-foreground" />}
			<MateriaEstadoSelect
				value={estado}
				onValueChange={handleValueChange}
				className="w-40"
			/>
		</div>
	)
}


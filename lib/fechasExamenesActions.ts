"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { getCurrentUser } from "@/lib/auth"
import { isAdminRole } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

export interface NuevaResolucionInput {
	nombre: string
	fecha?: string
	url?: string | null
}

export interface UpsertFechaExamenInput {
	fechaId?: number | null
	materiaId: number
	fecha: string
	resolucionId?: number | null
	nuevaResolucion?: NuevaResolucionInput | null
}

export interface ActionResponse<T = undefined> {
	success: boolean
	message?: string
	error?: string
	data?: T
}

/**
 * Inserta o actualiza una fecha de examen en la base de datos (restringido a usuarios con rol admin en el backend).
 * Soporta selección de resolución existente, creación de nueva resolución con URL opcional/nula o nulo.
 */
export async function upsertFechaExamen(input: UpsertFechaExamenInput): Promise<ActionResponse> {
	// 1. Verificación estricta de seguridad en el backend
	const userRes = await getCurrentUser()
	if (!userRes.success || !userRes.data?.user) {
		return {
			success: false,
			error: "No autenticado. Debes iniciar sesión para modificar fechas de exámenes.",
		}
	}

	const user = userRes.data.user
	if (!isAdminRole(user.role)) {
		return {
			success: false,
			error: "Acceso denegado. Se requieren privilegios de administrador para modificar fechas.",
		}
	}

	if (!input.materiaId || !input.fecha) {
		return {
			success: false,
			error: "La materia y la fecha de examen son obligatorias.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	let targetResolucionId: number | null = input.resolucionId ?? null

	// 2. Si el usuario solicitó crear una nueva resolución en caliente
	if (input.nuevaResolucion && input.nuevaResolucion.nombre.trim()) {
		const nombreRes = input.nuevaResolucion.nombre.trim()
		const fechaRes = input.nuevaResolucion.fecha?.trim() || input.fecha
		const urlRes = input.nuevaResolucion.url?.trim() || null

		const { data: newResData, error: newResErr } = await supabase
			.from("resoluciones")
			.insert({
				nombre: nombreRes,
				fecha: fechaRes,
				url: urlRes,
			})
			.select("id")
			.single()

		if (newResErr || !newResData) {
			console.error("Error al crear la nueva resolución:", newResErr)
			return {
				success: false,
				error: `Error al crear la resolución: ${newResErr?.message || "No se pudo obtener el ID registrado."}`,
			}
		}

		targetResolucionId = Number(newResData.id)
	}

	// 3. Preparar datos a guardar en fechas_examenes
	const payload: Record<string, string | number | null> = {
		materia_id: input.materiaId,
		fecha: input.fecha,
		resolucion_id: targetResolucionId,
	}

	let dbError: { message: string } | null = null

	if (input.fechaId) {
		// Actualizar fecha existente
		const { error: updateErr } = await supabase
			.from("fechas_examenes")
			.update(payload)
			.eq("id", input.fechaId)
		dbError = updateErr
	} else {
		// Insertar nueva fecha
		const { error: insertErr } = await supabase
			.from("fechas_examenes")
			.insert(payload)
		dbError = insertErr
	}

	if (dbError) {
		console.error("Error al guardar fecha de examen:", dbError)
		return {
			success: false,
			error: `Error en la base de datos: ${dbError.message}`,
		}
	}

	revalidatePath("/admin/fechas-examenes")
	return {
		success: true,
		message: "Fecha de examen y resolución guardadas correctamente.",
	}
}

/**
 * Elimina una fecha de examen de la base de datos (restringido a usuarios con rol admin en el backend).
 */
export async function deleteFechaExamen(fechaId: number): Promise<ActionResponse> {
	// 1. Verificación estricta de seguridad en el backend
	const userRes = await getCurrentUser()
	if (!userRes.success || !userRes.data?.user) {
		return {
			success: false,
			error: "No autenticado. Debes iniciar sesión para eliminar fechas.",
		}
	}

	const user = userRes.data.user
	if (!isAdminRole(user.role)) {
		return {
			success: false,
			error: "Acceso denegado. Se requieren privilegios de administrador para eliminar fechas.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase
		.from("fechas_examenes")
		.delete()
		.eq("id", fechaId)

	if (error) {
		console.error("Error al eliminar fecha de examen:", error)
		return {
			success: false,
			error: `Error al eliminar fecha: ${error.message}`,
		}
	}

	revalidatePath("/admin/fechas-examenes")
	return {
		success: true,
		message: "Fecha de examen eliminada con éxito.",
	}
}

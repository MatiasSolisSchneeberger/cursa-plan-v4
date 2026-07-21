"use server"

import {createClient} from "@/utils/supabase/server"
import {cookies} from "next/headers"
import type {EstadoMateria} from "@/types/materiaTypes"

/**
 * Registra un mensaje de contacto enviado por el usuario.
 *
 * @param nombre - Nombre del contacto
 * @param email - Correo del contacto
 * @param mensaje - Contenido del mensaje
 * @returns true si se guardó con éxito, false en caso contrario
 */
export async function submitContacto(
	nombre: string,
	email: string,
	mensaje: string
): Promise<boolean> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const {error} = await supabase
		.from("mensajes")
		.insert({
			nombre,
			email,
			mensaje,
			leido: false,
			etiqueta: "general",
		})

	if (error) {
		console.error("Error submitting contact message:", error)
		return false
	}

	return true
}

/**
 * Agrega o elimina una carrera/plan de la lista de favoritos de un usuario.
 *
 * @param userId - ID del usuario
 * @param planId - ID del plan de estudio
 * @returns true si la operación tuvo éxito, false en caso contrario
 */
export async function toggleCarreraFavorita(
	userId: string,
	planId: number | string
): Promise<boolean> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Verificar si ya existe en favoritos
	const {data, error: checkError} = await supabase
		.from("carreras_fav")
		.select("id")
		.eq("user_id", userId)
		.eq("plan_id", planId)
		.maybeSingle()

	if (checkError) {
		console.error("Error checking favorite:", checkError)
		return false
	}

	if (data) {
		// Eliminar de favoritos
		const {error: deleteError} = await supabase
			.from("carreras_fav")
			.delete()
			.eq("id", data.id)

		if (deleteError) {
			console.error("Error removing from favorites:", deleteError)
			return false
		}
	} else {
		// Insertar en favoritos
		const {error: insertError} = await supabase
			.from("carreras_fav")
			.insert({
				user_id: userId,
				plan_id: planId,
			})

		if (insertError) {
			console.error("Error adding to favorites:", insertError)
			return false
		}
	}

	return true
}

/**
 * Actualiza el estado de avance de una materia para un usuario específico.
 *
 * @param userId - ID del usuario
 * @param materiaPlanId - ID de la materia en el plan
 * @param estado - Nuevo estado ("Sin cursar", "Cursando", "Regular", "Aprobado", "Libre")
 * @returns true si se actualizó con éxito, false en caso contrario
 */
export async function updateEstadoMateria(
	userId: string,
	materiaPlanId: number,
	estado: EstadoMateria
): Promise<boolean> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Buscar si existe un avance previo para esa materia y usuario
	const {data, error: selectError} = await supabase
		.from("avances")
		.select("id")
		.eq("user_id", userId)
		.eq("materia_plan_id", materiaPlanId)
		.maybeSingle()

	if (selectError) {
		console.error("Error selecting user advance:", selectError)
		return false
	}

	const now = new Date().toISOString()

	if (data) {
		// Actualizar avance existente
		const {error: updateError} = await supabase
			.from("avances")
			.update({
				estado: estado,
				updated_at: now,
			})
			.eq("id", data.id)

		if (updateError) {
			console.error("Error updating user advance:", updateError)
			return false
		}
	} else {
		// Crear nuevo avance
		const {error: insertError} = await supabase
			.from("avances")
			.insert({
				user_id: userId,
				materia_plan_id: materiaPlanId,
				estado: estado,
				updated_at: now,
			})

		if (insertError) {
			console.error("Error inserting user advance:", insertError)
			return false
		}
	}

	return true
}

"use server"

import {createClient} from "@/utils/supabase/server"
import {cookies} from "next/headers"
import type {EstadoMateria} from "@/types/materiaTypes"

interface DatosActualizacionPerfil {
	username?: string;
	fullName?: string;
	avatarUrl?: string;
	icon?: string;
}

interface AvanceQueryResponse {
	id: number;
}

interface CarreraFavQueryResponse {
	id: number;
}

/**
 * Registra un mensaje de contacto enviado por el usuario.
 *
 * @param nombre - Nombre del contacto
 * @param email - Correo del contacto
 * @param mensaje - Contenido del mensaje
 * @returns true si se guardó con éxito, false en caso contrario
 */
export async function setContacto(
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
		console.error("Error al registrar mensaje de contacto:", error)
		return false
	}

	return true
}

/**
 * Agrega o elimina un plan de la lista de favoritos de un usuario.
 *
 * @param userId - ID del usuario
 * @param planId - ID del plan de estudio
 * @returns true si la operación tuvo éxito, false en caso contrario
 */
export async function setToggleFavoritoPlan(
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
		console.error("Error al comprobar favoritos:", checkError)
		return false
	}

	const existingFav = data as unknown as CarreraFavQueryResponse | null

	if (existingFav) {
		// Eliminar de favoritos
		const {error: deleteError} = await supabase
			.from("carreras_fav")
			.delete()
			.eq("id", existingFav.id)

		if (deleteError) {
			console.error("Error al eliminar de favoritos:", deleteError)
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
			console.error("Error al agregar a favoritos:", insertError)
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
export async function setEstadoMateria(
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
		console.error("Error al consultar avances existentes:", selectError)
		return false
	}

	const existingAdvance = data as unknown as AvanceQueryResponse | null
	const now = new Date().toISOString()

	if (existingAdvance) {
		// Actualizar avance existente
		const {error: updateError} = await supabase
			.from("avances")
			.update({
				estado: estado,
				updated_at: now,
			})
			.eq("id", existingAdvance.id)

		if (updateError) {
			console.error("Error al actualizar avance de materia:", updateError)
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
			console.error("Error al insertar avance de materia:", insertError)
			return false
		}
	}

	return true
}

/**
 * Actualiza el perfil de un usuario en la tabla public.usuarios.
 *
 * @param userId - ID del usuario a actualizar
 * @param datos - Campos del perfil a modificar
 * @returns true si la actualización tuvo éxito, false en caso contrario
 */
export async function setPerfilUsuario(
	userId: string,
	datos: DatosActualizacionPerfil
): Promise<boolean> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const updatePayload: Record<string, string> = {
		updated_at: new Date().toISOString()
	}

	if (datos.username !== undefined) updatePayload.username = datos.username
	if (datos.fullName !== undefined) updatePayload.full_name = datos.fullName
	if (datos.avatarUrl !== undefined) updatePayload.avatar_url = datos.avatarUrl
	if (datos.icon !== undefined) updatePayload.icon = datos.icon

	const {error} = await supabase
		.from("usuarios")
		.update(updatePayload)
		.eq("id", userId)

	if (error) {
		console.error("Error al actualizar perfil de usuario:", error)
		return false
	}

	return true
}

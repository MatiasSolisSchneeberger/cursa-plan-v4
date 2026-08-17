"use server"

import {createClient} from "@/utils/supabase/server"
import {cookies, headers} from "next/headers"
import {getCurrentUser} from "@/lib/auth"
import {cache} from "react"
import {z} from "zod"
import type {EstadoMateria} from "@/types/materiaTypes"

interface DatosActualizacionPerfil {
	username?: string;
	fullName?: string;
	avatarUrl?: string;
	icon?: string;
}

async function getUserIdAutenticado(): Promise<string | null> {
	const userRes = await getCurrentUser()
	return userRes.data?.user?.id ?? null
}

async function getClientIp(): Promise<string> {
	const headersList = await headers()
	const forwarded = headersList.get("x-forwarded-for")
	return forwarded ? forwarded.split(",")[0].trim() : "unknown"
}

const contactoSchema = z.object({
	nombre: z.string().trim().min(2).max(100),
	email: z.string().trim().email().max(254),
	mensaje: z.string().trim().min(10).max(2000),
})

const estadoMateriaSchema = z.enum(["Sin cursar", "Cursando", "Regular", "Aprobado", "Libre"])

const perfilSchema = z.object({
	username: z.string().trim().min(3).max(30).regex(/^[a-z0-9_.]+$/i).optional(),
	fullName: z.string().trim().min(2).max(80).optional(),
	avatarUrl: z.string().max(500).optional(),
	icon: z.string().max(50).optional(),
})

interface AvanceQueryResponse {
	id: number;
}

interface CarreraFavQueryResponse {
	id: number;
}

/**
 * Registra un mensaje de contacto con validación y rate limit por IP.
 *
 * @param nombre - Nombre del contacto (2-100 caracteres)
 * @param email - Correo válido (≤254 caracteres)
 * @param mensaje - Contenido (10-2000 caracteres)
 * @returns {success, error?} - Distingue límite alcanzado de error
 */
export async function setContacto(
	nombre: string,
	email: string,
	mensaje: string
): Promise<{success: boolean; error?: string}> {
	// Validar entrada
	const validation = contactoSchema.safeParse({nombre, email, mensaje})
	if (!validation.success) {
		return {success: false, error: "Datos inválidos"}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const clientIp = await getClientIp()

	// Chequear rate limit (RPC; fail-closed)
	const {data: rateLimitOk, error: rateLimitError} = await supabase.rpc(
		"check_rate_limit",
		{
			p_clave: clientIp,
			p_accion: "contacto",
			p_max: 5,
			p_ventana_minutos: 60,
		}
	)

	if (rateLimitError || !rateLimitOk) {
		return {success: false, error: "Límite de intentos alcanzado. Intenta más tarde."}
	}

	// Insertar mensaje
	const {error} = await supabase
		.from("mensajes")
		.insert({
			nombre: validation.data.nombre,
			email: validation.data.email,
			mensaje: validation.data.mensaje,
			leido: false,
			etiqueta: "general",
		})

	if (error) {
		console.error("Error al registrar mensaje de contacto:", error)
		return {success: false, error: "No se pudo guardar el mensaje"}
	}

	return {success: true}
}

/**
 * Agrega o elimina un plan de la lista de favoritos del usuario autenticado.
 *
 * @param planId - ID del plan de estudio
 * @returns true si la operación tuvo éxito, false en caso contrario
 */
export async function setToggleFavoritoPlan(
	planId: number | string
): Promise<boolean> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const userId = await getUserIdAutenticado()
	if (!userId) return false

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
		// Eliminar de favoritos (acotado por usuario)
		const {error: deleteError} = await supabase
			.from("carreras_fav")
			.delete()
			.eq("id", existingFav.id)
			.eq("user_id", userId)

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
 * Actualiza el estado de avance de una materia para el usuario autenticado.
 *
 * @param materiaPlanId - ID de la materia en el plan
 * @param estado - Nuevo estado ("Sin cursar", "Cursando", "Regular", "Aprobado", "Libre")
 * @returns true si se actualizó con éxito, false en caso contrario
 */
export async function setEstadoMateria(
	materiaPlanId: number,
	estado: EstadoMateria
): Promise<boolean> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const userId = await getUserIdAutenticado()
	if (!userId) return false

	// Validar estado
	const estadoValidation = estadoMateriaSchema.safeParse(estado)
	if (!estadoValidation.success) return false

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
		// Actualizar avance existente (acotado por usuario)
		const {error: updateError} = await supabase
			.from("avances")
			.update({
				estado: estadoValidation.data,
				updated_at: now,
			})
			.eq("id", existingAdvance.id)
			.eq("user_id", userId)

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
				estado: estadoValidation.data,
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
 * Actualiza el perfil del usuario autenticado.
 *
 * @param datos - Campos del perfil a modificar (username, fullName, avatarUrl, icon)
 * @returns true si la actualización tuvo éxito, false en caso contrario
 */
export async function setPerfilUsuario(
	datos: DatosActualizacionPerfil
): Promise<boolean> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const userId = await getUserIdAutenticado()
	if (!userId) return false

	// Validar datos
	const validation = perfilSchema.safeParse(datos)
	if (!validation.success) return false

	// Si va a cambiar username, verificar que no esté en uso
	if (validation.data.username) {
		const {data: existingUser} = await supabase
			.from("usuarios")
			.select("id")
			.eq("username", validation.data.username)
			.maybeSingle()

		if (existingUser && existingUser.id !== userId) {
			return false
		}
	}

	const updatePayload: Record<string, string> = {
		updated_at: new Date().toISOString()
	}

	if (validation.data.username !== undefined) updatePayload.username = validation.data.username
	if (validation.data.fullName !== undefined) updatePayload.full_name = validation.data.fullName
	if (validation.data.avatarUrl !== undefined) updatePayload.avatar_url = validation.data.avatarUrl
	if (validation.data.icon !== undefined) updatePayload.icon = validation.data.icon

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

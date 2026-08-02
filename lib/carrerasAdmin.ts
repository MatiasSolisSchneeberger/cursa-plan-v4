"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { getCurrentUser } from "@/lib/auth"
import { isAdminRole } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

export interface CarreraAdminItem {
	id: number
	nombre: string
	slug: string
	icon: string
	planesCount: number
}

export interface CarreraInput {
	nombre: string
	slug: string
	icon: string
}

export interface ActionResponse<T = undefined> {
	success: boolean
	message?: string
	error?: string
	data?: T
}

interface DBCarreraRow {
	id: number
	nombre: string
	slug: string
	icon: string | null
	planes: { id: number }[] | null
}

/**
 * Obtiene todas las carreras registradas junto con el recuento de planes de estudio.
 */
export async function getAdminCarreras(): Promise<CarreraAdminItem[]> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from("carreras")
		.select(
			`
			id,
			nombre,
			slug,
			icon,
			planes:plan_estudio(id)
		`
		)
		.order("nombre", { ascending: true })

	if (error) {
		console.error("Error al obtener carreras para admin:", error)
		throw new Error(error.message)
	}

	const rawCarreras = (data || []) as unknown as DBCarreraRow[]

	return rawCarreras.map(({ id, nombre, slug, icon, planes }: DBCarreraRow) => {
		const rawPlanes = Array.isArray(planes) ? planes : []
		return {
			id: Number(id),
			nombre: nombre || "",
			slug: slug || "",
			icon: icon || "device-imac",
			planesCount: rawPlanes.length,
		}
	})
}

/**
 * Crea una nueva carrera en la base de datos (restringido a administradores).
 */
export async function createCarrera(input: CarreraInput): Promise<ActionResponse<CarreraAdminItem>> {
	const userRes = await getCurrentUser()
	if (!userRes.success || !userRes.data?.user) {
		return {
			success: false,
			error: "No autenticado. Debes iniciar sesión para realizar esta acción.",
		}
	}

	if (!isAdminRole(userRes.data.user.role)) {
		return {
			success: false,
			error: "Acceso denegado. Se requieren privilegios de administrador para crear carreras.",
		}
	}

	const nombreTrimmed = input.nombre.trim()
	const slugTrimmed = input.slug.trim()
	const iconTrimmed = input.icon.trim() || "device-imac"

	if (!nombreTrimmed || !slugTrimmed) {
		return {
			success: false,
			error: "El nombre y el slug de la carrera son obligatorios.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase
		.from("carreras")
		.insert({
			nombre: nombreTrimmed,
			slug: slugTrimmed,
			icon: iconTrimmed,
		})

	if (error) {
		console.error("Error al crear carrera:", error)
		if (error.code === "23505") {
			if (error.message.includes("carreras_pkey")) {
				return {
					success: false,
					error: "La secuencia de ID en la base de datos está desincronizada (carreras_pkey). Ejecuta el script de ajuste de secuencia setval().",
				}
			}
			return {
				success: false,
				error: "Ya existe una carrera con ese nombre o slug.",
			}
		}
		return {
			success: false,
			error: `Error al crear carrera: ${error.message}`,
		}
	}

	revalidatePath("/admin/carreras")
	revalidatePath("/carreras")

	return {
		success: true,
		message: "Carrera creada exitosamente.",
	}
}

/**
 * Actualiza los datos de una carrera existente (restringido a administradores).
 */
export async function updateCarrera(id: number, input: CarreraInput): Promise<ActionResponse> {
	const userRes = await getCurrentUser()
	if (!userRes.success || !userRes.data?.user) {
		return {
			success: false,
			error: "No autenticado. Debes iniciar sesión para realizar esta acción.",
		}
	}

	if (!isAdminRole(userRes.data.user.role)) {
		return {
			success: false,
			error: "Acceso denegado. Se requieren privilegios de administrador para modificar carreras.",
		}
	}

	const nombreTrimmed = input.nombre.trim()
	const slugTrimmed = input.slug.trim()
	const iconTrimmed = input.icon.trim() || "device-imac"

	if (!id || !nombreTrimmed || !slugTrimmed) {
		return {
			success: false,
			error: "El ID, el nombre y el slug de la carrera son obligatorios.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase
		.from("carreras")
		.update({
			nombre: nombreTrimmed,
			slug: slugTrimmed,
			icon: iconTrimmed,
		})
		.eq("id", id)

	if (error) {
		console.error("Error al actualizar carrera:", error)
		if (error.code === "23505") {
			return {
				success: false,
				error: "Ya existe otra carrera con ese nombre o slug.",
			}
		}
		return {
			success: false,
			error: `Error al actualizar carrera: ${error.message}`,
		}
	}

	revalidatePath("/admin/carreras")
	revalidatePath("/carreras")

	return {
		success: true,
		message: "Carrera actualizada exitosamente.",
	}
}

/**
 * Elimina una carrera existente por su ID (restringido a administradores).
 */
export async function deleteCarrera(id: number): Promise<ActionResponse> {
	const userRes = await getCurrentUser()
	if (!userRes.success || !userRes.data?.user) {
		return {
			success: false,
			error: "No autenticado. Debes iniciar sesión para eliminar carreras.",
		}
	}

	if (!isAdminRole(userRes.data.user.role)) {
		return {
			success: false,
			error: "Acceso denegado. Se requieren privilegios de administrador para eliminar carreras.",
		}
	}

	if (!id) {
		return {
			success: false,
			error: "ID de carrera inválido.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from("carreras").delete().eq("id", id)

	if (error) {
		console.error("Error al eliminar carrera:", error)
		if (error.code === "23503") {
			return {
				success: false,
				error: "No se puede eliminar la carrera porque tiene planes de estudio asociados. Desvincula o elimina los planes primero.",
			}
		}
		return {
			success: false,
			error: `Error al eliminar carrera: ${error.message}`,
		}
	}

	revalidatePath("/admin/carreras")
	revalidatePath("/carreras")

	return {
		success: true,
		message: "Carrera eliminada exitosamente.",
	}
}

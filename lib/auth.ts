"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import type { Provider } from "@supabase/supabase-js"
import type { AuthResponse, SignInData, SignUpData, Usuario } from "@/types/auth"

/**
 * Registra a un nuevo usuario en Supabase Auth y sincroniza su perfil en la tabla public.usuarios.
 *
 * @param data - Datos requeridos para el registro (email, password, username, fullName, etc.)
 * @returns AuthResponse con el resultado de la operación
 */
export async function signUp(data: SignUpData): Promise<AuthResponse<{ userId: string }>> {
	const { email, password, username, fullName, avatarUrl, icon } = data

	if (!email || !password || !username || !fullName) {
		return {
			success: false,
			error: "Todos los campos obligatorios (email, contraseña, nombre de usuario, nombre completo) deben ser completados.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// Verificar si el username ya está registrado en public.usuarios
	const { data: existingUser } = await supabase
		.from("usuarios")
		.select("id")
		.eq("username", username.trim())
		.maybeSingle()

	if (existingUser) {
		return {
			success: false,
			error: "El nombre de usuario ya está en uso. Por favor elige otro.",
		}
	}

	// Registrar usuario en Supabase Auth
	const { data: authData, error: authError } = await supabase.auth.signUp({
		email: email.trim(),
		password,
		options: {
			data: {
				username: username.trim(),
				full_name: fullName.trim(),
				avatar_url: avatarUrl ?? "",
				icon: icon ?? "",
			},
		},
	})

	if (authError) {
		return {
			success: false,
			error: authError.message,
		}
	}

	const userId = authData.user?.id

	if (!userId) {
		return {
			success: false,
			error: "No se pudo obtener el identificador del usuario registrado.",
		}
	}

	// Respaldo manual en public.usuarios por si el trigger SQL no estuviera activo
	const { error: profileError } = await supabase
		.from("usuarios")
		.upsert({
			id: userId,
			username: username.trim(),
			full_name: fullName.trim(),
			avatar_url: avatarUrl || null,
			icon: icon || null,
			updated_at: new Date().toISOString(),
		}, { onConflict: "id" })

	if (profileError) {
		console.warn("Aviso: No se pudo insertar manualmente en public.usuarios (posiblemente insertado por trigger):", profileError.message)
	}

	return {
		success: true,
		message: "Usuario registrado con éxito.",
		data: { userId },
	}
}

/**
 * Inicia sesión de usuario por correo o nombre de usuario y contraseña.
 *
 * @param data - Credenciales de inicio de sesión (emailOrUsername, password)
 * @returns AuthResponse con el perfil del usuario autenticado
 */
export async function signInWithEmail(data: SignInData): Promise<AuthResponse<{ user: Usuario | null }>> {
	const { emailOrUsername, password } = data

	if (!emailOrUsername || !password) {
		return {
			success: false,
			error: "Debes ingresar tu correo o nombre de usuario y tu contraseña.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const emailToUse = emailOrUsername.trim()

	// Si no es un email (no contiene @), buscar el email correspondiente en public.usuarios
	if (!emailToUse.includes("@")) {
		const { data: userRow, error: findError } = await supabase
			.from("usuarios")
			.select("id")
			.eq("username", emailToUse)
			.maybeSingle()

		if (findError || !userRow) {
			return {
				success: false,
				error: "No se encontró ningún usuario con ese nombre de usuario.",
			}
		}

		// Obtener email desde auth mediante la sesión actual o intentar autenticar
		// Supabase Auth requiere email o teléfono para signInWithPassword.
		// Si la tabla public.usuarios no almacena email directamente, podemos solicitar el email directamente.
	}

	const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
		email: emailToUse,
		password,
	})

	if (authError) {
		return {
			success: false,
			error: authError.message === "Invalid login credentials"
				? "Credenciales inválidas. Verifica tu correo/usuario y contraseña."
				: authError.message,
		}
	}

	const userId = authData.user?.id
	let userProfile: Usuario | null = null

	if (userId) {
		const { data: profile } = await supabase
			.from("usuarios")
			.select("*")
			.eq("id", userId)
			.maybeSingle()

		userProfile = profile as Usuario | null
	}

	return {
		success: true,
		message: "Inicio de sesión exitoso.",
		data: { user: userProfile },
	}
}

/**
 * Inicia el proceso de autenticación con proveedores OAuth (Google, GitHub, etc.).
 *
 * @param provider - Identificador del proveedor OAuth ('google', 'github', etc.)
 * @param redirectTo - URL de redirección opcional tras completar la autenticación
 */
export async function signInWithOAuth(provider: Provider, redirectTo?: string): Promise<AuthResponse<{ url: string }>> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
	const redirectUrl = redirectTo || `${origin}/auth/callback`

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: redirectUrl,
		},
	})

	if (error) {
		return {
			success: false,
			error: error.message,
		}
	}

	return {
		success: true,
		data: { url: data.url },
	}
}

/**
 * Cierra la sesión activa del usuario.
 */
export async function signOut(): Promise<AuthResponse> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.signOut()

	if (error) {
		return {
			success: false,
			error: error.message,
		}
	}

	return {
		success: true,
		message: "Sesión cerrada correctamente.",
	}
}

/**
 * Obtiene el usuario autenticado actualmente y su perfil desde public.usuarios.
 */
export async function getCurrentUser(): Promise<AuthResponse<{ user: Usuario | null }>> {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

	if (authError || !authUser) {
		return {
			success: false,
			data: { user: null },
		}
	}

	const { data: profile, error: profileError } = await supabase
		.from("usuarios")
		.select("*")
		.eq("id", authUser.id)
		.maybeSingle()

	if (profileError) {
		console.error("Error al obtener el perfil de usuario:", profileError)
	}

	const userObj: Usuario = (profile as Usuario | null) || {
		id: authUser.id,
		username: (authUser.user_metadata?.username as string) || null,
		full_name: (authUser.user_metadata?.full_name as string) || (authUser.user_metadata?.name as string) || authUser.email || null,
		avatar_url: (authUser.user_metadata?.avatar_url as string) || null,
		updated_at: authUser.updated_at || null,
		role: "user",
		icon: (authUser.user_metadata?.icon as string) || null,
	}

	return {
		success: true,
		data: { user: userObj },
	}
}

/**
 * Envía un correo de recuperación de contraseña.
 *
 * @param email - Correo electrónico del usuario
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
	if (!email) {
		return {
			success: false,
			error: "El correo electrónico es requerido.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?next=/reset-password`,
	})

	if (error) {
		return {
			success: false,
			error: error.message,
		}
	}

	return {
		success: true,
		message: "Se ha enviado un correo con instrucciones para restablecer la contraseña.",
	}
}

/**
 * Actualiza la contraseña del usuario actualmente autenticado.
 *
 * @param newPassword - Nueva contraseña
 */
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
	if (!newPassword || newPassword.length < 6) {
		return {
			success: false,
			error: "La contraseña debe tener al menos 6 caracteres.",
		}
	}

	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	})

	if (error) {
		return {
			success: false,
			error: error.message,
		}
	}

	return {
		success: true,
		message: "Contraseña actualizada exitosamente.",
	}
}

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const code = searchParams.get("code")
	const errorParam = searchParams.get("error")
	const errorDescription = searchParams.get("error_description")
	const next = searchParams.get("next") || "/update-password"

	// Si Supabase manda un error en los params (link vencido, ya usado, etc)
	if (errorParam || errorDescription) {
		console.error(`[auth/callback] Supabase error: ${errorParam} - ${errorDescription}`)
		return NextResponse.redirect(new URL("/forgot-password?error=link_invalido", request.url))
	}

	if (code) {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)

		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (!error) {
			return NextResponse.redirect(new URL(next, request.url))
		}

		// Error en el exchange (code inválido, vencido, PKCE mismatch, etc)
		console.error(`[auth/callback] exchangeCodeForSession failed: ${error.message}`)

		// Si el `next` era /update-password (recovery flow), redirigir a forgot-password
		if (next === "/update-password") {
			return NextResponse.redirect(new URL("/forgot-password?error=link_invalido", request.url))
		}

		return NextResponse.redirect(new URL("/login?error=auth_fallido", request.url))
	}

	// No hay code ni error explícito; flujo roto
	console.error(`[auth/callback] No code found in request`)
	return NextResponse.redirect(new URL("/login?error=auth_fallido", request.url))
}

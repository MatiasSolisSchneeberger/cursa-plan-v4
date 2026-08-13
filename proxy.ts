import {type NextRequest} from "next/server"
import {updateSession} from "@/utils/supabase/proxy"

export async function proxy(request: NextRequest) {
	return await updateSession(request)
}

export const config = {
	matcher: [
		/*
		 * Todas las rutas excepto:
		 * - _next/static, _next/image (assets del build)
		 * - favicon.ico y archivos estáticos por extensión
		 * - auth/callback (setea sus propias cookies con exchangeCodeForSession)
		 */
		"/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
	],
}

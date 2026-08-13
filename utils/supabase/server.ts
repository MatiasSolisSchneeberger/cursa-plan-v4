import {createServerClient} from "@supabase/ssr"
import {cookies} from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
	return createServerClient(supabaseUrl!, supabaseKey!, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options))
				} catch {
					// La llamada `setAll` se origina en un Server Component que no puede escribir cookies.
					// Esto es seguro si hay un proxy en la raíz refrescando sesiones en cada navegación.
				}
			},
		},
	})
}

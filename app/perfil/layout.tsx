import { Suspense } from "react"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import PerfilSidebar from "@/components/PerfilSidebar"
import PerfilHeader from "@/components/PerfilHeader"
import { getCurrentUser } from "@/lib/auth"
import { getDatosPerfilInicio } from "@/lib/carreras"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
	title: "Mi Perfil | CursaPlan",
	description: "Dashboard personal del estudiante con materias en cursada, carreras favoritas y métricas de avance.",
}

async function PerfilLayoutContent({ children }: { children: React.ReactNode }) {
	const userRes = await getCurrentUser()

	if (!userRes.success || !userRes.data?.user) {
		redirect("/login?next=/perfil")
	}

	const user = userRes.data.user
	const perfilData = await getDatosPerfilInicio(user.id)

	return (
		<SidebarProvider>
			<PerfilSidebar
				user={perfilData.usuario}
				carrerasFavoritas={perfilData.carrerasFavoritas}
				materiasCursando={perfilData.materiasCursando}
			/>
			<main className="relative flex-1 min-w-0 min-h-screen bg-background">
				<PerfilHeader />
				<div className="p-4 md:p-8 max-w-7xl mx-auto">
					{children}
				</div>
			</main>
		</SidebarProvider>
	)
}

function PerfilFallback() {
	return (
		<div className="flex h-screen w-full items-center justify-center p-6 bg-background">
			<div className="flex flex-col items-center gap-4 w-full max-w-md">
				<Skeleton className="h-16 w-16 rounded-full" />
				<Skeleton className="h-6 w-48 rounded-md" />
				<Skeleton className="h-4 w-64 rounded-md" />
				<div className="w-full grid grid-cols-2 gap-4 mt-4">
					<Skeleton className="h-24 rounded-xl" />
					<Skeleton className="h-24 rounded-xl" />
				</div>
			</div>
		</div>
	)
}

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<PerfilFallback />}>
			<PerfilLayoutContent>{children}</PerfilLayoutContent>
		</Suspense>
	)
}

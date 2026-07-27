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
		<div className="flex min-h-screen w-full bg-background animate-pulse">
			{/* Sidebar Skeleton (Visible only on desktop) */}
			<aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4 gap-6 shrink-0">
				<div className="flex items-center gap-2 pb-4 border-b border-border">
					<Skeleton className="size-4 bg-muted-foreground/10" />
					<Skeleton className="h-4 w-28 bg-muted-foreground/10" />
				</div>
				<div className="flex flex-col gap-4 flex-1">
					<div className="space-y-2">
						<Skeleton className="h-3 w-16 bg-muted-foreground/10" />
						<Skeleton className="h-8 w-full bg-muted-foreground/10 rounded-md" />
					</div>
					<div className="space-y-3">
						<Skeleton className="h-3 w-28 bg-muted-foreground/10" />
						<div className="pl-3 border-l border-border/60 space-y-2">
							<Skeleton className="h-7 w-5/6 bg-muted-foreground/10 rounded-md" />
							<Skeleton className="h-7 w-4/6 bg-muted-foreground/10 rounded-md" />
						</div>
					</div>
					<div className="space-y-3">
						<Skeleton className="h-3 w-28 bg-muted-foreground/10" />
						<div className="pl-3 border-l border-border/60 space-y-2">
							<Skeleton className="h-9 w-full bg-muted-foreground/10 rounded-md" />
							<Skeleton className="h-9 w-full bg-muted-foreground/10 rounded-md" />
						</div>
					</div>
				</div>
				<div className="pt-4 border-t border-border space-y-2">
					<Skeleton className="h-8 w-full bg-muted-foreground/10 rounded-md" />
					<div className="flex items-center gap-3 pt-1">
						<Skeleton className="size-8 rounded-full bg-muted-foreground/10" />
						<div className="space-y-1.5 flex-1">
							<Skeleton className="h-3 w-20 bg-muted-foreground/10" />
							<Skeleton className="h-2 w-28 bg-muted-foreground/10" />
						</div>
					</div>
				</div>
			</aside>

			{/* Main area skeleton */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Header Skeleton */}
				<header className="flex h-16 items-center gap-3 border-b border-border px-4 md:px-8 bg-card/80">
					<Skeleton className="size-8 rounded bg-muted-foreground/10 md:hidden" />
					<Skeleton className="h-5 w-5 bg-muted-foreground/10 hidden md:block" />
					<Skeleton className="h-5 w-24 bg-muted-foreground/10" />
					<div className="ml-auto">
						<Skeleton className="size-9 rounded-full bg-muted-foreground/10" />
					</div>
				</header>

				{/* Page Content Skeleton */}
				<div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8">
					{/* HERO Skeleton */}
					<div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
						<div className="flex items-center gap-4">
							<Skeleton className="size-16 sm:size-20 rounded-full bg-muted-foreground/10" />
							<div className="space-y-2">
								<div className="flex items-center gap-2 flex-wrap">
									<Skeleton className="h-7 w-40 bg-muted-foreground/10" />
									<Skeleton className="h-5 w-20 bg-muted-foreground/10 rounded-full" />
								</div>
								<Skeleton className="h-4 w-24 bg-muted-foreground/10" />
								<Skeleton className="h-3 w-48 bg-muted-foreground/10" />
							</div>
						</div>
						<Skeleton className="h-9 w-28 bg-muted-foreground/10 rounded-md" />
					</div>

					{/* KPI GRID Skeleton */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="border border-border rounded-xl bg-card p-4 space-y-4">
								<div className="flex items-center justify-between">
									<Skeleton className="h-3 w-16 bg-muted-foreground/10" />
									<Skeleton className="size-8 rounded-lg bg-muted-foreground/10" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-8 w-12 bg-muted-foreground/10" />
									<Skeleton className="h-3 w-24 bg-muted-foreground/10" />
								</div>
							</div>
						))}
					</div>

					{/* CARRERAS FAVORITAS Skeleton */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Skeleton className="size-5 rounded-full bg-muted-foreground/10" />
								<Skeleton className="h-5 w-40 bg-muted-foreground/10" />
							</div>
							<Skeleton className="h-5 w-20 bg-muted-foreground/10 rounded-full" />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[1, 2].map((i) => (
								<div key={i} className="border border-border rounded-xl bg-card p-5 space-y-4">
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-center gap-3">
											<Skeleton className="size-10 rounded-xl bg-muted-foreground/10" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-44 bg-muted-foreground/10" />
												<Skeleton className="h-3 w-16 bg-muted-foreground/10" />
											</div>
										</div>
										<Skeleton className="h-5 w-12 bg-muted-foreground/10 rounded" />
									</div>
									<div className="space-y-2">
										<div className="flex justify-between">
											<Skeleton className="h-3 w-20 bg-muted-foreground/10" />
											<Skeleton className="h-3 w-32 bg-muted-foreground/10" />
										</div>
										<Skeleton className="h-2 w-full bg-muted-foreground/10 rounded-full" />
									</div>
									<div className="pt-2 border-t border-border flex items-center justify-between">
										<Skeleton className="h-3 w-24 bg-muted-foreground/10" />
										<Skeleton className="h-3 w-24 bg-muted-foreground/10" />
									</div>
								</div>
							))}
						</div>
					</div>
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

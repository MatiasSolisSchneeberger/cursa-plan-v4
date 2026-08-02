import {Suspense} from "react"
import {redirect} from "next/navigation"
import Link from "next/link"
import {SidebarProvider} from "@/components/ui/sidebar"
import AdminSidebar from "@/sections/admin/AdminSidebar"
import AdminHeader from "@/sections/admin/AdminHeader"
import {getCurrentUser} from "@/lib/auth"
import {isAdminRole} from "@/lib/permissions"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Skeleton} from "@/components/ui/skeleton"
import {IconShieldOff, IconArrowLeft, IconLock} from "@tabler/icons-react"
import {Alert, AlertTitle} from "@/components/ui/alert"

export const metadata = {
	title: "Panel de Administración | CursaPlan",
	description: "Gestión de permisos, roles y políticas de seguridad del sistema.",
}

function AccessDeniedView({email, role}: {email?: string | null; role?: string}) {
	return (
		<section className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
			<Card className="max-w-md w-full border border-destructive-border shadow-xl bg-card">
				<CardHeader className="text-center pb-2">
					<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive-foreground text-destructive border border-destructive/20">
						<IconShieldOff className="size-8" />
					</div>
					<Badge variant="destructive" className="mx-auto">
						Error 403 • No Autorizado
					</Badge>
					<CardTitle className="text-xl font-bold tracking-tight">Acceso Denegado</CardTitle>
					<CardDescription className="text-xs text-muted-foreground mt-1">
						Tu cuenta no posee el rol de administrador requerido para ingresar a esta sección.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 pt-2 text-xs">
					<section className="p-3 rounded-lg bg-secondary/60 border border-border/80 space-y-1">
						<div className="flex justify-between text-muted-foreground">
							<span>Usuario Conectado:</span>
							<strong className="text-foreground font-medium">{email || "Usuario Activo"}</strong>
						</div>
						<div className="flex justify-between text-muted-foreground">
							<span>Rol Actual:</span>
							<Badge variant="secondary" className="text-[10px] font-bold">
								{role || "user"}
							</Badge>
						</div>
					</section>

					<Alert variant="warning">
						<IconLock className="size-4 shrink-0" />
						<AlertTitle>
							Si crees que esto es un error, solicita la elevación de tu rol al Super Administrador.
						</AlertTitle>
					</Alert>
				</CardContent>
				<CardFooter className="flex flex-row gap-2">
					<Button render={<Link href="/perfil" />} variant="outline" className="w-full flex-1 text-xs gap-1.5">
						<IconArrowLeft className="size-4" /> Ir a Mi Perfil
					</Button>
					<Button render={<Link href="/" />} className="w-full flex-1 text-xs">
						Página Principal
					</Button>
				</CardFooter>
			</Card>
		</section>
	)
}

function AdminFallback() {
	return (
		<div className="flex h-screen w-full items-center justify-center p-6 bg-background">
			<div className="flex flex-col items-center gap-4 w-full max-w-md">
				<Skeleton className="h-16 w-16 rounded-2xl" />
				<Skeleton className="h-6 w-48 rounded-md" />
				<Skeleton className="h-4 w-64 rounded-md" />
			</div>
		</div>
	)
}

async function AdminLayoutContent({children}: {children: React.ReactNode}) {
	const userRes = await getCurrentUser()

	// 1. Redireccionar si no hay sesión activa
	if (!userRes.success || !userRes.data?.user) {
		redirect("/login?next=/admin")
	}

	const user = userRes.data.user

	// 2. Validar si el usuario posee rol administrativo
	if (!isAdminRole(user.role)) {
		return <AccessDeniedView email={user.email || user.username} role={user.role} />
	}

	return (
		<SidebarProvider>
			<AdminSidebar userRole={user.role} user={user} />
			<main className="relative flex-1 min-w-0 min-h-screen bg-background flex flex-col *:not-first:py-4 *:not-first:px-6">
				<AdminHeader />
				{children}
			</main>
		</SidebarProvider>
	)
}

export default function AdminLayout({children}: {children: React.ReactNode}) {
	return (
		<Suspense fallback={<AdminFallback />}>
			<AdminLayoutContent>{children}</AdminLayoutContent>
		</Suspense>
	)
}

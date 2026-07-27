import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
	IconShieldLock,
	IconKey,
	IconUsers,
	IconHistory,
	IconPlus,
	IconShieldCheck,
	IconAlertTriangle,
	IconChevronRight,
	IconLockAccess,
	IconChecklist,
	IconUserCheck,
} from "@tabler/icons-react"

export default function AdminDashboardPage() {
	const stats = [
		{
			title: "Administradores Activos",
			value: "12",
			subtitle: "10 con MFA activado",
			icon: IconUsers,
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Roles Definidos",
			value: "5",
			subtitle: "1 Super Admin, 4 Personalizados",
			icon: IconShieldLock,
			color: "text-amber-500",
			bgColor: "bg-amber-500/10",
		},
		{
			title: "Permisos Granulares",
			value: "32",
			subtitle: "Distribuidos en 4 módulos",
			icon: IconKey,
			color: "text-emerald-500",
			bgColor: "bg-emerald-500/10",
		},
		{
			title: "Eventos de Auditoría (24h)",
			value: "148",
			subtitle: "0 accesos sospechosos",
			icon: IconHistory,
			color: "text-indigo-500",
			bgColor: "bg-indigo-500/10",
		},
	]

	const recentActivity = [
		{
			id: "1",
			action: "Rol asignado",
			detail: "Se otorgó el rol 'Gestor de Planes' a Maria Fernandez",
			user: "Matias Admin",
			time: "Hace 15 min",
			severity: "info",
		},
		{
			id: "2",
			action: "Permiso revocado",
			detail: "Se eliminó 'carreras:eliminar' del rol 'Moderador'",
			user: "Matias Admin",
			time: "Hace 2 horas",
			severity: "warning",
		},
		{
			id: "3",
			action: "Permiso temporal activado",
			detail: "Elevación de privilegios JIT solicitada por Carlos Gomez",
			user: "Sistema JIT",
			time: "Hace 5 horas",
			severity: "critical",
		},
		{
			id: "4",
			action: "Política actualizada",
			detail: "Tiempo máximo de inactividad admin fijado en 30 min",
			user: "Matias Admin",
			time: "Ayer a las 18:30",
			severity: "info",
		},
	]

	const rolesOverview = [
		{ name: "Super Administrador", usersCount: 2, risk: "Crítico", permissionsCount: 32, badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" },
		{ name: "Gestor de Planes & Carreras", usersCount: 4, risk: "Alto", permissionsCount: 18, badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" },
		{ name: "Moderador de Contenido", usersCount: 3, risk: "Medio", permissionsCount: 10, badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
		{ name: "Auditor de Seguridad", usersCount: 2, risk: "Bajo", permissionsCount: 6, badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
		{ name: "Soporte Técnico Admin", usersCount: 1, risk: "Medio", permissionsCount: 8, badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" },
	]

	return (
		<div className="space-y-8">
			{/* HEADER DE BIENVENIDA & ACCIONES RÁPIDAS */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Panel de Administración</h1>
						<Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
							RBAC v2.4
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Control centralizado de roles, permisos granulares y auditoría de seguridad del sistema.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button render={<Link href="/admin/roles" className="flex items-center gap-1.5" />} size="sm" className="gap-1.5 shadow-sm">
						<IconPlus className="size-4" />
						<span>Nuevo Rol</span>
					</Button>
					<Button render={<Link href="/admin/permisos" className="flex items-center gap-1.5" />} variant="outline" size="sm" className="gap-1.5">
						<IconKey className="size-4 text-muted-foreground" />
						<span>Catálogo Permisos</span>
					</Button>
				</div>
			</div>

			{/* METRICAS Y CARDS DE ESTADO */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, idx) => {
					const Icon = stat.icon
					return (
						<Card key={idx} className="border border-border/80 shadow-xs hover:border-border transition-colors">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									{stat.title}
								</CardTitle>
								<div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
									<Icon className="size-4" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* ALERTA DE SEGURIDAD & PUNTUACION DE SALUD RBAC */}
			<Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
				<CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-start gap-3.5">
						<div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0 border border-amber-500/30 mt-0.5 sm:mt-0">
							<IconShieldCheck className="size-6" />
						</div>
						<div>
							<h3 className="text-base font-semibold text-foreground flex items-center gap-2">
								Estado de Cumplimiento RBAC: <span className="text-amber-600 dark:text-amber-400 font-bold">98% Excelente</span>
							</h3>
							<p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
								Todos los administradores activos cuentan con autenticación de dos factores (MFA) requerida y ningún rol posee permisos no auditados.
							</p>
						</div>
					</div>
					<Button render={<Link href="/admin/configuracion" />} variant="outline" size="sm" className="shrink-0 border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
						Revisar Políticas
					</Button>
				</CardContent>
			</Card>

			{/* SECCIÓN PRINCIPAL DE 2 COLUMNAS: ROLES Y AUDITORÍA RECIENTE */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* COLUMNA 1 & 2: RESUMEN DE ROLES */}
				<Card className="lg:col-span-2 border-border/80">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-base font-bold flex items-center gap-2">
								<IconShieldLock className="size-5 text-amber-500" />
								<span>Distribución de Roles y Permisos</span>
							</CardTitle>
							<CardDescription className="text-xs mt-0.5">
								Roles configurados y cantidad de permisos otorgados en el sistema
							</CardDescription>
						</div>
						<Button render={<Link href="/admin/roles" />} variant="ghost" size="sm" className="text-xs text-primary gap-1">
							Ver Matriz <IconChevronRight className="size-3.5" />
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="divide-y divide-border/60">
							{rolesOverview.map((role, idx) => (
								<div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
									<div className="flex items-center gap-3">
										<div className="size-9 rounded-lg bg-secondary flex items-center justify-center font-bold text-xs text-muted-foreground shrink-0 border border-border/60">
											{role.name.substring(0, 2).toUpperCase()}
										</div>
										<div>
											<div className="flex items-center gap-2">
												<span className="font-semibold text-sm text-foreground">{role.name}</span>
												<Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${role.badgeColor}`}>
													{role.risk} Riesgo
												</Badge>
											</div>
											<p className="text-xs text-muted-foreground mt-0.5">
												{role.usersCount} usuario{role.usersCount !== 1 ? "s" : ""} asignado{role.usersCount !== 1 ? "s" : ""}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4 sm:justify-end">
										<div className="w-32">
											<div className="flex justify-between text-[11px] text-muted-foreground mb-1">
												<span>Permisos</span>
												<span className="font-semibold text-foreground">{role.permissionsCount}/32</span>
											</div>
											<Progress value={(role.permissionsCount / 32) * 100} className="h-1.5" />
										</div>
										<Button render={<Link href="/admin/roles" />} variant="outline" size="sm" className="h-8 text-xs">
											Editar
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* COLUMNA 3: AUDITORÍA DE ACTIVIDAD RECIENTE */}
				<Card className="border-border/80">
					<CardHeader className="flex flex-row items-center justify-between pb-3">
						<div>
							<CardTitle className="text-base font-bold flex items-center gap-2">
								<IconHistory className="size-5 text-indigo-500" />
								<span>Actividad de Permisos</span>
							</CardTitle>
							<CardDescription className="text-xs mt-0.5">
								Últimas modificaciones de roles
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="relative pl-4 border-l-2 border-border/80 space-y-4">
							{recentActivity.map((act) => (
								<div key={act.id} className="relative group">
									<div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-primary border-2 border-background" />
									<div>
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs font-semibold text-foreground">{act.action}</span>
											<span className="text-[10px] text-muted-foreground">{act.time}</span>
										</div>
										<p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
											{act.detail}
										</p>
										<span className="text-[10px] text-muted-foreground/80 block mt-1">
											Por: <strong className="text-foreground/90 font-medium">{act.user}</strong>
										</span>
									</div>
								</div>
							))}
						</div>
						<div className="pt-2">
							<Button render={<Link href="/admin/auditoria" />} variant="outline" size="sm" className="w-full text-xs gap-1">
								Ver Historial Completo <IconChevronRight className="size-3.5" />
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* WIDGETS DE CONTROL DE ACCESO RÁPIDO */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="border-border/80 bg-card hover:bg-accent/20 transition-colors">
					<CardContent className="p-5 flex items-center gap-4">
						<div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
							<IconLockAccess className="size-6" />
						</div>
						<div>
							<h4 className="font-semibold text-sm">Matriz de Competencias</h4>
							<p className="text-xs text-muted-foreground mt-0.5">Configurar permisos por módulo y rol</p>
							<Link href="/admin/roles" className="text-xs font-semibold text-primary hover:underline mt-2 inline-flex items-center gap-1">
								Ir a la Matriz <IconChevronRight className="size-3" />
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/80 bg-card hover:bg-accent/20 transition-colors">
					<CardContent className="p-5 flex items-center gap-4">
						<div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
							<IconUserCheck className="size-6" />
						</div>
						<div>
							<h4 className="font-semibold text-sm">Asignar Roles a Usuarios</h4>
							<p className="text-xs text-muted-foreground mt-0.5">Otorgar o revocar accesos de admin</p>
							<Link href="/admin/usuarios" className="text-xs font-semibold text-primary hover:underline mt-2 inline-flex items-center gap-1">
								Gestionar Usuarios <IconChevronRight className="size-3" />
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/80 bg-card hover:bg-accent/20 transition-colors">
					<CardContent className="p-5 flex items-center gap-4">
						<div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
							<IconChecklist className="size-6" />
						</div>
						<div>
							<h4 className="font-semibold text-sm">Catálogo de Permisos</h4>
							<p className="text-xs text-muted-foreground mt-0.5">32 permisos agrupados por ámbito</p>
							<Link href="/admin/permisos" className="text-xs font-semibold text-primary hover:underline mt-2 inline-flex items-center gap-1">
								Explorar Permisos <IconChevronRight className="size-3" />
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

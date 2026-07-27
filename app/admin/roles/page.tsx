import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
	IconShieldLock,
	IconPlus,
	IconSearch,
	IconCheck,
	IconX,
	IconEdit,
	IconCopy,
	IconTrash,
	IconLock,
	IconUsers,
	IconKey,
} from "@tabler/icons-react"

export const metadata = {
	title: "Gestión de Roles | CursaPlan Admin",
	description: "Matriz de roles y asignación de competencias del sistema.",
}

export default function RolesAdminPage() {
	const rolesList = [
		{
			id: "super_admin",
			name: "Super Administrador",
			code: "SUPER_ADMIN",
			description: "Acceso total y sin restricciones a todos los módulos, configuraciones y auditorías de seguridad.",
			usersCount: 2,
			level: "Nivel 1 (Total)",
			isSystemRole: true,
			badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
		},
		{
			id: "gestor_carreras",
			name: "Gestor de Planes & Carreras",
			code: "ACADEMIC_MANAGER",
			description: "Permisos completos para crear, editar, asociar materias y publicar planes de estudio de carreras.",
			usersCount: 4,
			level: "Nivel 2 (Académico)",
			isSystemRole: false,
			badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
		},
		{
			id: "moderador",
			name: "Moderador de Contenido",
			code: "CONTENT_MODERATOR",
			description: "Capacidad de revisar correlativas, comentarios, sugerencias de alumnos y estado de materias.",
			usersCount: 3,
			level: "Nivel 3 (Moderación)",
			isSystemRole: false,
			badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
		},
		{
			id: "auditor",
			name: "Auditor de Seguridad",
			code: "SECURITY_AUDITOR",
			description: "Acceso de solo lectura a logs de auditoría, registros de accesos y estado de políticas de permisos.",
			usersCount: 2,
			level: "Nivel 3 (Auditoría)",
			isSystemRole: false,
			badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
		},
		{
			id: "soporte",
			name: "Soporte Técnico Admin",
			code: "TECH_SUPPORT",
			description: "Asistencia a usuarios, restablecimiento de accesos y verificación de estado de servicios.",
			usersCount: 1,
			level: "Nivel 4 (Soporte)",
			isSystemRole: false,
			badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
		},
	]

	// Matrix data: Module -> Operations per Role
	const matrixModules = [
		{
			module: "Carreras y Planes",
			permissions: [
				{ key: "carreras:crear", name: "Crear Carreras", superAdmin: true, academic: true, moderator: false, auditor: false, support: false },
				{ key: "carreras:editar", name: "Editar Planes y Materias", superAdmin: true, academic: true, moderator: true, auditor: false, support: false },
				{ key: "carreras:publicar", name: "Publicar / Archivar Plan", superAdmin: true, academic: true, moderator: false, auditor: false, support: false },
				{ key: "carreras:eliminar", name: "Eliminar Registros Académicos", superAdmin: true, academic: false, moderator: false, auditor: false, support: false },
			],
		},
		{
			module: "Usuarios y Accesos",
			permissions: [
				{ key: "usuarios:listar", name: "Ver Lista de Usuarios", superAdmin: true, academic: true, moderator: true, auditor: true, support: true },
				{ key: "usuarios:editar_rol", name: "Asignar / Modificar Rol", superAdmin: true, academic: false, moderator: false, auditor: false, support: false },
				{ key: "usuarios:suspender", name: "Suspender / Bloquear Usuario", superAdmin: true, academic: false, moderator: true, auditor: false, support: true },
				{ key: "usuarios:reset_mfa", name: "Restablecer MFA / Contraseña", superAdmin: true, academic: false, moderator: false, auditor: false, support: true },
			],
		},
		{
			module: "Seguridad y Auditoría",
			permissions: [
				{ key: "audit:ver_logs", name: "Ver Logs de Auditoría", superAdmin: true, academic: false, moderator: false, auditor: true, support: false },
				{ key: "audit:exportar", name: "Exportar Histórico de Eventos", superAdmin: true, academic: false, moderator: false, auditor: true, support: false },
				{ key: "politicas:modificar", name: "Cambiar Políticas de Permisos", superAdmin: true, academic: false, moderator: false, auditor: false, support: false },
			],
		},
	]

	return (
		<div className="space-y-8">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestión de Roles del Sistema</h1>
						<Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
							5 Roles Configurados
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Definición de roles de administrador, niveles de responsabilidad y matriz de capacidades por módulo.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-1.5 shadow-sm">
						<IconPlus className="size-4" />
						<span>Crear Rol Personalizado</span>
					</Button>
				</div>
			</div>

			{/* LISTA DE TARJETAS DE ROLES */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{rolesList.map((role) => (
					<Card key={role.id} className="border-border/80 flex flex-col justify-between hover:border-border transition-colors">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<Badge variant="outline" className={`text-[10px] ${role.badgeColor}`}>
									{role.level}
								</Badge>
								{role.isSystemRole && (
									<Badge variant="secondary" className="text-[10px] gap-1 bg-secondary text-muted-foreground border border-border">
										<IconLock className="size-3" /> Sistema
									</Badge>
								)}
							</div>
							<CardTitle className="text-base font-bold text-foreground mt-2">{role.name}</CardTitle>
							<span className="text-[11px] font-mono text-muted-foreground">{role.code}</span>
							<CardDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
								{role.description}
							</CardDescription>
						</CardHeader>

						<CardContent className="pt-0 space-y-4">
							<div className="flex items-center justify-between text-xs py-2 border-t border-b border-border/60 text-muted-foreground">
								<div className="flex items-center gap-1.5">
									<IconUsers className="size-4 text-primary" />
									<span><strong className="text-foreground font-semibold">{role.usersCount}</strong> usuarios</span>
								</div>
								<div className="flex items-center gap-1">
									<IconKey className="size-3.5 text-amber-500" />
									<span className="text-[11px]">Permisos activos</span>
								</div>
							</div>

							<div className="flex items-center justify-end gap-1.5 pt-1">
								<Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
									<IconCopy className="size-3.5 text-muted-foreground" /> Duplicar
								</Button>
								<Button variant="outline" size="sm" className="h-8 text-xs gap-1">
									<IconEdit className="size-3.5" /> Editar Rol
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* MATRIZ DE COMPETENCIAS Y PERMISOS POR MODULO */}
			<Card className="border-border/80">
				<CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<CardTitle className="text-lg font-bold flex items-center gap-2">
							<IconShieldLock className="size-5 text-amber-500" />
							<span>Matriz Interactiva de Permisos por Rol</span>
						</CardTitle>
						<CardDescription className="text-xs mt-0.5">
							Comparativa de capacidades concedidas por cada rol sobre los distintos módulos del sistema
						</CardDescription>
					</div>
					<div className="relative w-full sm:w-64">
						<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Filtrar permiso en la matriz..."
							className="pl-9 h-8 text-xs bg-muted/40"
						/>
					</div>
				</CardHeader>

				<CardContent className="p-0 overflow-x-auto">
					<table className="w-full text-left text-xs border-collapse min-w-[700px]">
						<thead>
							<tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
								<th className="p-3 pl-6 w-1/3">Operación / Permiso Granular</th>
								<th className="p-3 text-center">Super Admin</th>
								<th className="p-3 text-center">Gestor Académico</th>
								<th className="p-3 text-center">Moderador</th>
								<th className="p-3 text-center">Auditor</th>
								<th className="p-3 text-center">Soporte</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							{matrixModules.map((sec, secIdx) => (
								<>
									<tr key={`sec-${secIdx}`} className="bg-muted/20">
										<td colSpan={6} className="p-2.5 pl-6 font-bold text-foreground text-xs uppercase tracking-wider bg-secondary/40">
											{sec.module}
										</td>
									</tr>
									{sec.permissions.map((perm) => (
										<tr key={perm.key} className="hover:bg-accent/30 transition-colors">
											<td className="p-3 pl-6">
												<div className="font-medium text-foreground">{perm.name}</div>
												<span className="font-mono text-[10px] text-muted-foreground">{perm.key}</span>
											</td>
											<td className="p-3 text-center">
												{perm.superAdmin ? (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
														<IconCheck className="size-4" />
													</span>
												) : (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mx-auto">
														<IconX className="size-3.5" />
													</span>
												)}
											</td>
											<td className="p-3 text-center">
												{perm.academic ? (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
														<IconCheck className="size-4" />
													</span>
												) : (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mx-auto">
														<IconX className="size-3.5" />
													</span>
												)}
											</td>
											<td className="p-3 text-center">
												{perm.moderator ? (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
														<IconCheck className="size-4" />
													</span>
												) : (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mx-auto">
														<IconX className="size-3.5" />
													</span>
												)}
											</td>
											<td className="p-3 text-center">
												{perm.auditor ? (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
														<IconCheck className="size-4" />
													</span>
												) : (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mx-auto">
														<IconX className="size-3.5" />
													</span>
												)}
											</td>
											<td className="p-3 text-center">
												{perm.support ? (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
														<IconCheck className="size-4" />
													</span>
												) : (
													<span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mx-auto">
														<IconX className="size-3.5" />
													</span>
												)}
											</td>
										</tr>
									))}
								</>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>
		</div>
	)
}

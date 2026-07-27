import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	IconUsers,
	IconUserPlus,
	IconSearch,
	IconShieldCheck,
	IconLockCheck,
	IconAlertTriangle,
	IconDotsVertical,
	IconKey,
	IconShieldLock,
	IconClock,
} from "@tabler/icons-react"

export const metadata = {
	title: "Usuarios Administradores | CursaPlan Admin",
	description: "Asignación de roles y control de privilegios administrativos por usuario.",
}

export default function UsuariosAdminPage() {
	const adminUsers = [
		{
			id: "usr_1",
			name: "Matias Solis",
			username: "matias_admin",
			email: "matias@cursaplan.edu.ar",
			role: "Super Administrador",
			roleBadge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
			mfaStatus: "Verificado (Llave FIDO2)",
			directPermissions: ["politicas:modificar"],
			lastAccess: "Hace 5 minutos",
			status: "Activo",
			avatarInitials: "MS",
		},
		{
			id: "usr_2",
			name: "Maria Fernandez",
			username: "mfernandez",
			email: "mfernandez@cursaplan.edu.ar",
			role: "Gestor de Planes & Carreras",
			roleBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
			mfaStatus: "Verificado (TOTP App)",
			directPermissions: ["carreras:crear"],
			lastAccess: "Hace 1 hora",
			status: "Activo",
			avatarInitials: "MF",
		},
		{
			id: "usr_3",
			name: "Carlos Gomez",
			username: "cgomez",
			email: "cgomez@cursaplan.edu.ar",
			role: "Moderador de Contenido",
			roleBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
			mfaStatus: "Verificado (TOTP App)",
			directPermissions: [],
			lastAccess: "Hace 3 horas",
			status: "Activo",
			avatarInitials: "CG",
		},
		{
			id: "usr_4",
			name: "Laura Rossi",
			username: "lrossi",
			email: "lrossi@cursaplan.edu.ar",
			role: "Auditor de Seguridad",
			roleBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
			mfaStatus: "Verificado (SMS Backup)",
			directPermissions: ["audit:exportar"],
			lastAccess: "Ayer a las 16:40",
			status: "Activo",
			avatarInitials: "LR",
		},
		{
			id: "usr_5",
			name: "Gonzalo Martinez",
			username: "gmartinez",
			email: "gmartinez@cursaplan.edu.ar",
			role: "Soporte Técnico Admin",
			roleBadge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
			mfaStatus: "Pendiente Configuración",
			directPermissions: [],
			lastAccess: "Hace 2 días",
			status: "Revisión 2FA Requerida",
			avatarInitials: "GM",
		},
	]

	return (
		<div className="space-y-8">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Usuarios Administradores</h1>
						<Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
							12 Cuentas Admin
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Asignación individual de roles, revocación de accesos e inspección de privilegios directos.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-1.5 shadow-sm">
						<IconUserPlus className="size-4" />
						<span>Otorgar Rol Administrador</span>
					</Button>
				</div>
			</div>

			{/* CONTROLES DE BUSQUEDA Y REGISTROS */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="relative w-full sm:w-80">
					<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Buscar por usuario, email o rol..."
						className="pl-9 h-9 text-xs bg-muted/30"
					/>
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-emerald-500" /> 11 Cuentas Activas
					</span>
					<span>•</span>
					<span className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-amber-500" /> 1 Revisa 2FA
					</span>
				</div>
			</div>

			{/* TABLA DE USUARIOS ADMIN */}
			<Card className="border-border/80">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-bold flex items-center gap-2">
						<IconUsers className="size-5 text-amber-500" />
						<span>Directorio de Administradores</span>
					</CardTitle>
					<CardDescription className="text-xs">
						Mostrando 5 de 12 usuarios administradores
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0 overflow-x-auto">
					<table className="w-full text-left text-xs border-collapse min-w-[800px]">
						<thead>
							<tr className="border-b border-t border-border bg-muted/50 text-muted-foreground font-semibold">
								<th className="p-3 pl-6">Usuario Admin</th>
								<th className="p-3">Rol Principal</th>
								<th className="p-3">Estado MFA / 2FA</th>
								<th className="p-3">Excepciones Directas</th>
								<th className="p-3">Última Incursión</th>
								<th className="p-3 text-right pr-6">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							{adminUsers.map((usr) => (
								<tr key={usr.id} className="hover:bg-accent/20 transition-colors">
									<td className="p-3 pl-6">
										<div className="flex items-center gap-3">
											<Avatar className="size-8 shrink-0">
												<AvatarFallback className="bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs">
													{usr.avatarInitials}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="font-semibold text-foreground text-xs">{usr.name}</span>
												<span className="text-[11px] text-muted-foreground">@{usr.username} ({usr.email})</span>
											</div>
										</div>
									</td>
									<td className="p-3">
										<Badge variant="outline" className={`text-[10px] ${usr.roleBadge}`}>
											{usr.role}
										</Badge>
									</td>
									<td className="p-3">
										{usr.mfaStatus.includes("Verificado") ? (
											<span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
												<IconLockCheck className="size-3.5" />
												{usr.mfaStatus}
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
												<IconAlertTriangle className="size-3.5" />
												{usr.mfaStatus}
											</span>
										)}
									</td>
									<td className="p-3">
										{usr.directPermissions.length > 0 ? (
											<div className="flex items-center gap-1">
												{usr.directPermissions.map((p, pIdx) => (
													<Badge key={pIdx} variant="secondary" className="text-[10px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
														+{p}
													</Badge>
												))}
											</div>
										) : (
											<span className="text-muted-foreground/60 text-[11px] italic">Ninguna</span>
										)}
									</td>
									<td className="p-3 text-muted-foreground text-[11px]">
										<span className="inline-flex items-center gap-1">
											<IconClock className="size-3 text-muted-foreground" />
											{usr.lastAccess}
										</span>
									</td>
									<td className="p-3 text-right pr-6">
										<div className="flex items-center justify-end gap-1">
											<Button variant="outline" size="sm" className="h-7 text-[11px]">
												Cambiar Rol
											</Button>
											<Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
												<IconDotsVertical className="size-4" />
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>
		</div>
	)
}

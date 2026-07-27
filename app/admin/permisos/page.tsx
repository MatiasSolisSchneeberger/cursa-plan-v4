import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
	IconKey,
	IconPlus,
	IconSearch,
	IconFilter,
	IconShieldCheck,
	IconAlertCircle,
	IconCheck,
	IconLockCheck,
	IconAlertTriangle,
} from "@tabler/icons-react"

export const metadata = {
	title: "Catálogo de Permisos | CursaPlan Admin",
	description: "Listado completo de permisos granulares del sistema y sus niveles de riesgo.",
}

export default function PermisosAdminPage() {
	const permissionsList = [
		// MODULO CARRERAS Y PLANES
		{
			id: "1",
			key: "carreras:crear",
			name: "Crear Nuevas Carreras",
			module: "Carreras & Planes",
			description: "Permite dar de alta nuevas facultades, carreras y orientaciones en el sistema.",
			risk: "Alto",
			riskColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
			roles: ["Super Admin", "Gestor Académico"],
			status: "Activo",
			mfaRequired: true,
		},
		{
			id: "2",
			key: "carreras:editar",
			name: "Modificar Plan de Estudio",
			module: "Carreras & Planes",
			description: "Permite cambiar años, materias, correlatividades y cantidad de horas lectivas.",
			risk: "Alto",
			riskColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
			roles: ["Super Admin", "Gestor Académico", "Moderador"],
			status: "Activo",
			mfaRequired: false,
		},
		{
			id: "3",
			key: "carreras:publicar",
			name: "Publicar / Archivar Carrera",
			module: "Carreras & Planes",
			description: "Visibilidad pública de planes de estudio para alumnos.",
			risk: "Crítico",
			riskColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
			roles: ["Super Admin", "Gestor Académico"],
			status: "Activo",
			mfaRequired: true,
		},
		{
			id: "4",
			key: "carreras:eliminar",
			name: "Eliminar Registro de Plan",
			module: "Carreras & Planes",
			description: "Borrado permanente de planes de estudio y su historia.",
			risk: "Crítico",
			riskColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
			roles: ["Super Admin"],
			status: "Activo",
			mfaRequired: true,
		},

		// MODULO USUARIOS Y ACCESOS
		{
			id: "5",
			key: "usuarios:listar",
			name: "Listar Usuarios del Sistema",
			module: "Usuarios & Perfiles",
			description: "Consulta de base de datos de usuarios registrados y perfiles.",
			risk: "Bajo",
			riskColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
			roles: ["Super Admin", "Gestor Académico", "Moderador", "Auditor", "Soporte"],
			status: "Activo",
			mfaRequired: false,
		},
		{
			id: "6",
			key: "usuarios:editar_rol",
			name: "Asignar / Cambiar Rol Administrador",
			module: "Usuarios & Perfiles",
			description: "Elevación de privilegios de usuario estándar a rol de administración.",
			risk: "Crítico",
			riskColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
			roles: ["Super Admin"],
			status: "Activo",
			mfaRequired: true,
		},
		{
			id: "7",
			key: "usuarios:suspender",
			name: "Suspender / Desactivar Cuenta",
			module: "Usuarios & Perfiles",
			description: "Bloqueo preventivo de accesos a la plataforma.",
			risk: "Medio",
			riskColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
			roles: ["Super Admin", "Moderador", "Soporte"],
			status: "Activo",
			mfaRequired: false,
		},

		// SEGURIDAD Y AUDITORIA
		{
			id: "8",
			key: "audit:ver_logs",
			name: "Consultar Logs de Auditoría",
			module: "Seguridad & Auditoría",
			description: "Acceso al historial de cambios de permisos, logins y eventos del sistema.",
			risk: "Medio",
			riskColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
			roles: ["Super Admin", "Auditor"],
			status: "Activo",
			mfaRequired: false,
		},
		{
			id: "9",
			key: "audit:exportar",
			name: "Exportar Reportes de Seguridad",
			module: "Seguridad & Auditoría",
			description: "Descarga de archivos CSV/JSON con eventos de auditoría y accesos.",
			risk: "Alto",
			riskColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
			roles: ["Super Admin", "Auditor"],
			status: "Activo",
			mfaRequired: true,
		},
		{
			id: "10",
			key: "politicas:modificar",
			name: "Modificar Reglas Globales de Seguridad",
			module: "Seguridad & Auditoría",
			description: "Ajuste de tiempos de sesión, 2FA obligatorio y restricción de IPs.",
			risk: "Crítico",
			riskColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
			roles: ["Super Admin"],
			status: "Activo",
			mfaRequired: true,
		},
	]

	return (
		<div className="space-y-8">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Catálogo Granular de Permisos</h1>
						<Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
							32 Permisos del Sistema
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Listado exhaustivo de permisos de API/UI, clasificación por nivel de riesgo y requisitos de MFA.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-1.5 shadow-sm">
						<IconPlus className="size-4" />
						<span>Registrar Nuevo Permiso</span>
					</Button>
				</div>
			</div>

			{/* CONTROLES DE BUSQUEDA Y FILTROS */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="relative w-full sm:w-80">
					<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Buscar por nombre o clave (ej. carreras:crear)..."
						className="pl-9 h-9 text-xs bg-muted/30"
					/>
				</div>
				<div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
					<Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
						<IconFilter className="size-3.5 text-muted-foreground" />
						<span>Todos los Módulos</span>
					</Button>
					<Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 shrink-0 border-rose-500/30 text-rose-600 dark:text-rose-400">
						<IconAlertTriangle className="size-3.5" />
						<span>Solo Críticos</span>
					</Button>
					<Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 shrink-0 border-amber-500/30 text-amber-600 dark:text-amber-400">
						<IconLockCheck className="size-3.5" />
						<span>Requiere 2FA</span>
					</Button>
				</div>
			</div>

			{/* TABLA DE PERMISOS */}
			<Card className="border-border/80">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-bold flex items-center gap-2">
						<IconKey className="size-5 text-amber-500" />
						<span>Permisos Registrados</span>
					</CardTitle>
					<CardDescription className="text-xs">
						Mostrando 10 de 32 permisos totales
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0 overflow-x-auto">
					<table className="w-full text-left text-xs border-collapse min-w-[750px]">
						<thead>
							<tr className="border-b border-t border-border bg-muted/50 text-muted-foreground font-semibold">
								<th className="p-3 pl-6">Clave Permiso</th>
								<th className="p-3">Descripción</th>
								<th className="p-3">Módulo</th>
								<th className="p-3">Nivel de Riesgo</th>
								<th className="p-3">Roles Posibles</th>
								<th className="p-3 text-right pr-6">Requisitos de Seguridad</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							{permissionsList.map((item) => (
								<tr key={item.id} className="hover:bg-accent/20 transition-colors">
									<td className="p-3 pl-6">
										<div className="font-mono font-bold text-foreground text-xs">{item.key}</div>
										<span className="text-[11px] text-muted-foreground">{item.name}</span>
									</td>
									<td className="p-3 max-w-xs text-muted-foreground leading-relaxed">
										{item.description}
									</td>
									<td className="p-3">
										<Badge variant="secondary" className="text-[10px]">
											{item.module}
										</Badge>
									</td>
									<td className="p-3">
										<Badge variant="outline" className={`text-[10px] ${item.riskColor}`}>
											{item.risk}
										</Badge>
									</td>
									<td className="p-3">
										<div className="flex flex-wrap gap-1">
											{item.roles.map((r, idx) => (
												<span key={idx} className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-medium">
													{r}
												</span>
											))}
										</div>
									</td>
									<td className="p-3 text-right pr-6">
										{item.mfaRequired ? (
											<Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1">
												<IconLockCheck className="size-3" /> 2FA Obligatorio
											</Badge>
										) : (
											<Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border gap-1">
												<IconCheck className="size-3" /> Estándar
											</Badge>
										)}
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

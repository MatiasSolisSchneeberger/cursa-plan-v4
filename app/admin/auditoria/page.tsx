import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
	IconHistory,
	IconSearch,
	IconDownload,
	IconFilter,
	IconShieldCheck,
	IconAlertOctagon,
	IconInfoCircle,
	IconKey,
	IconUserCheck,
	IconCode,
} from "@tabler/icons-react"

export const metadata = {
	title: "Auditoría de Accesos | CursaPlan Admin",
	description: "Registro cronológico de eventos de permisos, modificaciones de roles y accesos.",
}

export default function AuditoriaAdminPage() {
	const auditLogs = [
		{
			id: "LOG-9842",
			timestamp: "2026-07-26 17:35:12",
			actor: "Matias Solis (matias_admin)",
			action: "ROLE_GRANTED",
			module: "Usuarios & Perfiles",
			description: "Asignación del rol 'Gestor de Planes' al usuario Maria Fernandez (usr_2)",
			ip: "190.19.24.110",
			severity: "INFO",
			severityColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
		},
		{
			id: "LOG-9841",
			timestamp: "2026-07-26 15:10:04",
			actor: "Matias Solis (matias_admin)",
			action: "PERMISSION_REVOKED",
			module: "Carreras & Planes",
			description: "Revocación de permiso 'carreras:eliminar' del rol 'Moderador de Contenido'",
			ip: "190.19.24.110",
			severity: "WARNING",
			severityColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
		},
		{
			id: "LOG-9840",
			timestamp: "2026-07-26 12:44:50",
			actor: "Carlos Gomez (cgomez)",
			action: "JIT_ELEVATION_REQUEST",
			module: "Seguridad & Accesos",
			description: "Solicitud de privilegio temporal Just-In-Time para editar plan de estudio #402",
			ip: "181.44.12.88",
			severity: "CRITICAL",
			severityColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
		},
		{
			id: "LOG-9839",
			timestamp: "2026-07-26 09:15:33",
			actor: "Sistema RBAC",
			action: "POLICY_UPDATED",
			module: "Configuración Global",
			description: "Actualización automática de expiración de sesión administrativa (30 min)",
			ip: "127.0.0.1 (Local)",
			severity: "INFO",
			severityColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
		},
		{
			id: "LOG-9838",
			timestamp: "2026-07-25 21:00:19",
			actor: "Laura Rossi (lrossi)",
			action: "AUDIT_EXPORTED",
			module: "Seguridad & Auditoría",
			description: "Exportación del archivo de registro mensual en formato JSON firmado",
			ip: "200.12.99.14",
			severity: "INFO",
			severityColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
		},
	]

	return (
		<div className="space-y-8">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Registro de Auditoría de Accesos</h1>
						<Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs">
							Registro Inmutable
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Trazabilidad completa de modificaciones de roles, otorgamiento de permisos e incursionamientos admin.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" className="gap-1.5 shadow-sm">
						<IconDownload className="size-4" />
						<span>Exportar Registros (JSON/CSV)</span>
					</Button>
				</div>
			</div>

			{/* CONTROLES DE BUSQUEDA Y FILTROS */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="relative w-full sm:w-80">
					<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Buscar evento por ID, usuario o IP..."
						className="pl-9 h-9 text-xs bg-muted/30"
					/>
				</div>
				<div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
					<Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
						<IconFilter className="size-3.5 text-muted-foreground" />
						<span>Todas las Severidades</span>
					</Button>
					<Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
						<span>Últimas 24 Horas</span>
					</Button>
				</div>
			</div>

			{/* TABLA DE EVENTOS DE AUDITORIA */}
			<Card className="border-border/80">
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-bold flex items-center gap-2">
						<IconHistory className="size-5 text-indigo-500" />
						<span>Logs de Seguridad Inmutables</span>
					</CardTitle>
					<CardDescription className="text-xs">
						148 eventos registrados en las últimas 24 horas
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0 overflow-x-auto">
					<table className="w-full text-left text-xs border-collapse min-w-[850px]">
						<thead>
							<tr className="border-b border-t border-border bg-muted/50 text-muted-foreground font-semibold">
								<th className="p-3 pl-6">ID Evento</th>
								<th className="p-3">Timestamp (UTC-3)</th>
								<th className="p-3">Actor / Usuario</th>
								<th className="p-3">Acción Registrada</th>
								<th className="p-3">Detalles del Evento</th>
								<th className="p-3">IP Origen</th>
								<th className="p-3 text-right pr-6">Severidad</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60 font-mono">
							{auditLogs.map((log) => (
								<tr key={log.id} className="hover:bg-accent/20 transition-colors">
									<td className="p-3 pl-6 font-bold text-foreground">
										{log.id}
									</td>
									<td className="p-3 text-muted-foreground text-[11px]">
										{log.timestamp}
									</td>
									<td className="p-3 font-sans font-medium text-foreground">
										{log.actor}
									</td>
									<td className="p-3">
										<span className="bg-secondary text-secondary-foreground font-semibold text-[10px] px-1.5 py-0.5 rounded border border-border">
											{log.action}
										</span>
									</td>
									<td className="p-3 font-sans max-w-xs text-muted-foreground leading-relaxed">
										{log.description}
									</td>
									<td className="p-3 text-muted-foreground text-[11px]">
										{log.ip}
									</td>
									<td className="p-3 text-right pr-6 font-sans">
										<Badge variant="outline" className={`text-[10px] ${log.severityColor}`}>
											{log.severity}
										</Badge>
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

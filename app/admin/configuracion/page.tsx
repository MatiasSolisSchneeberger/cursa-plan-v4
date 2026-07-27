import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
	IconAdjustmentsHorizontal,
	IconShieldCheck,
	IconLockCheck,
	IconKey,
	IconClock,
	IconBuildingBroadcastTower,
	IconCheck,
	IconAlertTriangle,
} from "@tabler/icons-react"

export const metadata = {
	title: "Políticas de Seguridad | CursaPlan Admin",
	description: "Configuración global de reglas de seguridad, 2FA y políticas de acceso.",
}

export default function ConfiguracionSeguridadPage() {
	return (
		<div className="space-y-8">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Políticas de Seguridad & Permisos</h1>
						<Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
							Configuración Estricta
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Establecer parámetros globales para la expiración de sesiones, autenticación obligatoria de 2 factores y restricciones.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button className="gap-1.5 shadow-sm">
						<IconCheck className="size-4" />
						<span>Guardar Cambios</span>
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* FORMULARIO DE POLITICAS GENERALES */}
				<div className="lg:col-span-2 space-y-6">
					{/* TARJETA 1: AUTENTICACION DE DOS FACTORES */}
					<Card className="border-border/80">
						<CardHeader>
							<CardTitle className="text-base font-bold flex items-center gap-2">
								<IconLockCheck className="size-5 text-amber-500" />
								<span>Políticas de Autenticación de Dos Factores (MFA / 2FA)</span>
							</CardTitle>
							<CardDescription className="text-xs">
								Reglas de 2FA requeridas para ingresar al panel de administración y ejecutar acciones de alto riesgo.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-3.5 rounded-lg bg-secondary/40 border border-border/60">
								<div>
									<h4 className="text-xs font-semibold text-foreground">2FA Obligatorio para Administradores</h4>
									<p className="text-[11px] text-muted-foreground mt-0.5">Exigir TOTP / FIDO2 para todos los usuarios con roles admin</p>
								</div>
								<Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
									Activado
								</Badge>
							</div>

							<div className="flex items-center justify-between p-3.5 rounded-lg bg-secondary/40 border border-border/60">
								<div>
									<h4 className="text-xs font-semibold text-foreground">Confirmación de 2FA para Cambios de Permisos</h4>
									<p className="text-[11px] text-muted-foreground mt-0.5">Solicitar código de seguridad antes de modificar matrices o asignar roles</p>
								</div>
								<Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
									Activado
								</Badge>
							</div>
						</CardContent>
					</Card>

					{/* TARJETA 2: TIEMPOS DE SESION Y EXPIRACION */}
					<Card className="border-border/80">
						<CardHeader>
							<CardTitle className="text-base font-bold flex items-center gap-2">
								<IconClock className="size-5 text-blue-500" />
								<span>Tiempos de Sesión y Expiración por Inactividad</span>
							</CardTitle>
							<CardDescription className="text-xs">
								Límites de tiempo para cerrar automáticamente sesiones administrativas inactivas
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs font-medium">Expiración por Inactividad (Minutos)</Label>
									<Input type="number" defaultValue={30} className="h-9 text-xs" />
									<span className="text-[10px] text-muted-foreground">Rango recomendado: 15 - 60 minutos</span>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs font-medium">Duración Máxima de Sesión Admin (Horas)</Label>
									<Input type="number" defaultValue={8} className="h-9 text-xs" />
									<span className="text-[10px] text-muted-foreground">Requiere re-autenticación al finalizar</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* TARJETA 3: RESTRICCION DE IPS Y ACCESO */}
					<Card className="border-border/80">
						<CardHeader>
							<CardTitle className="text-base font-bold flex items-center gap-2">
								<IconBuildingBroadcastTower className="size-5 text-indigo-500" />
								<span>Restricciones de Red e IP Whitelist</span>
							</CardTitle>
							<CardDescription className="text-xs">
								Permitir el acceso al panel `/admin` únicamente desde direcciones IP autorizadas
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-1.5">
								<Label className="text-xs font-medium">IPs Autorizadas (Separadas por comas)</Label>
								<Input defaultValue="190.19.24.110, 181.44.12.88, 127.0.0.1" className="h-9 text-xs font-mono" />
								<span className="text-[10px] text-muted-foreground">Dejar vacío para permitir acceso desde cualquier ubicación autorizada</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* COLUMNA LATERAL: RESUMEN DE ESTADO Y BLOQUEO DE EMERGENCIA */}
				<div className="space-y-6">
					<Card className="border-border/80">
						<CardHeader>
							<CardTitle className="text-sm font-bold flex items-center gap-2">
								<IconShieldCheck className="size-4 text-emerald-500" />
								<span>Resumen de Seguridad RBAC</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-xs">
							<div className="flex justify-between py-1.5 border-b border-border/60">
								<span className="text-muted-foreground">Roles Activos:</span>
								<span className="font-semibold text-foreground">5 Roles</span>
							</div>
							<div className="flex justify-between py-1.5 border-b border-border/60">
								<span className="text-muted-foreground">Permisos Totales:</span>
								<span className="font-semibold text-foreground">32 Permisos</span>
							</div>
							<div className="flex justify-between py-1.5 border-b border-border/60">
								<span className="text-muted-foreground">Política de Contraseña:</span>
								<span className="font-semibold text-foreground">Complejidad Alta</span>
							</div>
							<div className="flex justify-between py-1.5">
								<span className="text-muted-foreground">Registro de Auditoría:</span>
								<span className="font-semibold text-emerald-600 dark:text-emerald-400">Inmutable (Activo)</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10">
						<CardHeader>
							<CardTitle className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
								<IconAlertTriangle className="size-4" />
								<span>Modo de Bloqueo de Emergencia</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-xs text-muted-foreground leading-relaxed">
								Desactiva temporalmente el acceso a todos los administradores excepto Super Admin en caso de incidente de seguridad.
							</p>
							<Button variant="outline" size="sm" className="w-full text-xs border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10">
								Activar Bloqueo de Emergencia
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

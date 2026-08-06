import Link from "next/link"
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {IconBox} from "@/components/ui/icon-box"
import Icon from "@/components/Icon"
import {Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip"
import {IconArrowRight, IconHeartFilled} from "@tabler/icons-react"
import {cn} from "@/lib/utils"
import {rutaPlan} from "@/lib/rutas"
import {Skeleton} from "@/components/ui/skeleton"

export interface PlanEstudio {
	anio: number
	isLiked?: boolean
	hasMaterias?: boolean
}

interface CardCarreraProps {
	icon: string
	carrera: string
	slug: string
	facultad?: string
	planes?: PlanEstudio[]
	className?: string
}

export default function CardCarrera({
	icon,
	carrera,
	slug,
	facultad = "FaCENA",
	planes = [],
	className,
}: CardCarreraProps) {
	// Obtener los planes vigentes/válidos que tienen materias disponibles
	const validPlanes = planes.filter(({hasMaterias}) => hasMaterias !== false)

	return (
		<Card
			className={cn(
				`border border-border hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between theme-${slug}`,
				className,
			)}>
			{/* CABECERA DE LA CARD */}
			<CardHeader className="space-y-3">
				<div className="flex items-center justify-between">
					<IconBox>
						<Icon icon={icon || "school"} className="size-6" />
					</IconBox>
					<Badge
						variant="outline"
						className="text-[10px] uppercase font-semibold text-muted-foreground border-border/80">
						{facultad}
					</Badge>
				</div>
				<div>
					<CardTitle className="text-lg font-bold text-foreground line-clamp-1">{carrera}</CardTitle>
					<CardDescription className="text-xs font-mono text-muted-foreground mt-0.5">/{slug}</CardDescription>
				</div>
			</CardHeader>

			{/* BOTONES PARA CADA PLAN DE ESTUDIO EN CONTENIDO */}
			<CardContent className="pt-0">
				{planes.length >= 2 && (
					<div className="flex flex-wrap gap-1.5 pt-2">
						{planes.map(({anio, isLiked, hasMaterias}) => {
							const isDisabled = hasMaterias === false

							if (isDisabled) {
								return (
									<Tooltip key={anio}>
										<TooltipTrigger render={<span className="inline-block cursor-not-allowed" />}>
											<Button
												disabled
												variant={isLiked ? "default" : "outline"}
												size="sm"
												className="text-[11px] h-7 px-2.5 opacity-50 pointer-events-none">
												{isLiked && <IconHeartFilled className="size-3 text-rose-500 mr-1" />}
												Plan {anio}
											</Button>
										</TooltipTrigger>
										<TooltipContent>No se tiene información completa para mostrar</TooltipContent>
									</Tooltip>
								)
							}

							return (
								<Button
									key={anio}
									variant={isLiked ? "default" : "outline"}
									size="sm"
									className="text-[11px] h-7 px-2.5 hover:border-primary/50 hover:text-primary transition-colors"
									render={
										<Link href={rutaPlan(slug, anio)}>
											{isLiked && <IconHeartFilled className="size-3 text-rose-500 mr-1" />}
											Plan {anio}
										</Link>
									}
								/>
							)
						})}
					</div>
				)}
			</CardContent>

			{/* FOOTER CON BOTÓN(ES) ESTILO LANDING */}
			<CardFooter className="pt-3 border-t border-border/50">
				{validPlanes.length > 1 ?
					<div className="grid grid-cols-2 gap-2 w-full">
						{validPlanes.slice(0, 2).map(({anio}) => (
							<Button
								key={anio}
								render={<Link href={rutaPlan(slug, anio)} />}
								variant="ghost"
								size="sm"
								className="justify-between text-xs font-bold text-primary group border border-border/40 hover:border-primary/50 px-2.5">
								<span>Plan {anio}</span>
								<IconArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
							</Button>
						))}
					</div>
				: validPlanes.length === 1 ?
					<Button
						render={<Link href={rutaPlan(slug, validPlanes[0].anio)} />}
						variant="ghost"
						size="sm"
						className="w-full justify-between text-xs font-bold text-primary group border border-border/40 hover:border-primary/50 px-2.5">
						<span>Ver Plan {validPlanes[0].anio}</span>
						<IconArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
					</Button>
				:	<Tooltip>
						<TooltipTrigger render={<span className="w-full inline-block cursor-not-allowed" />}>
							<Button
								disabled
								variant="ghost"
								size="sm"
								className="w-full justify-between text-xs font-bold text-muted-foreground opacity-50 pointer-events-none">
								<span>Ver Plan de Estudio</span>
								<IconArrowRight className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>No se tiene información completa para mostrar</TooltipContent>
					</Tooltip>
				}
			</CardFooter>
		</Card>
	)
}

export function CardCarreraSkeleton() {
	return (
		<Card className="shadow-xs animate-pulse flex flex-col justify-between">
			<CardHeader className="space-y-3">
				<div className="flex items-center justify-between">
					<Skeleton className="size-10 rounded-md bg-muted-foreground/10" />
					<Skeleton className="h-5 w-16 rounded-full bg-muted-foreground/10" />
				</div>
				<div className="space-y-1.5">
					<Skeleton className="h-6 w-3/4 bg-muted-foreground/10" />
					<Skeleton className="h-4 w-1/3 bg-muted-foreground/10" />
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="flex gap-2">
					<Skeleton className="h-7 w-20 rounded-md bg-muted-foreground/10" />
					<Skeleton className="h-7 w-20 rounded-md bg-muted-foreground/10" />
				</div>
			</CardContent>
			<CardFooter className="pt-3 border-t border-border/50">
				<Skeleton className="h-8 w-full rounded-md bg-muted-foreground/10" />
			</CardFooter>
		</Card>
	)
}

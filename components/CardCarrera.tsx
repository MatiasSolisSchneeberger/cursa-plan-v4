import IconCarrera from "@/components/Icon"
import {Card, CardAction, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {IconArrowRight, IconHeartFilled} from "@tabler/icons-react"
import {Button} from "./ui/button"
import {cn} from "@/lib/utils"
import Link from "next/link"
import { Skeleton } from "./ui/skeleton"

/**
 * Plan de Estudio
 *
 * @param anio - Año de inicio del plan
 * @param isLiked - Si el plan está en favoritos
 */
export interface PlanEstudio {
	anio: number
	isLiked?: boolean
	hasMaterias?: boolean
}

/**
 * Interfaz para las props del componente CardCarrera
 *
 * @param icon - Ícono de la carrera
 * @param carrera - Nombre de la carrera
 * @param slug - Slug de la carrera
 * @param facultad - Facultad de la carrera
 * @param planes - Planes de estudio de la carrera
 */
interface CardCarreraProps {
	icon: string
	carrera: string
	slug: string
	facultad?: string
	planes?: PlanEstudio[]
	className?: string
}

/**
 * Componente CardCarrera, muestra una tarjeta con el ícono de la carrera, el nombre de la carrera, la facultad y los planes de estudio.
 *
 * @param icon - Ícono de la carrera
 * @param carrera - Nombre de la carrera
 * @param slug - Slug de la carrera
 * @param facultad - Facultad de la carrera
 * @param planes - Planes de estudio de la carrera
 */
export default function CardCarrera({
	icon,
	carrera,
	slug,
	facultad = "FaCENA", // Valor por defecto temporal
	planes,
	className,
}: CardCarreraProps) {
	return (
		<Card className={cn(`shadow-xs hover:shadow-sm theme-${slug}`, className)}>
			{/* Cabecera: Icono y Textos */}
			<CardHeader>
				{/* Información de la carrera */}
				<CardTitle className="flex items-center gap-3 overflow-hidden">
					<span
						className="bg-primary p-2 rounded-md text-primary-foreground">
						<IconCarrera icon={icon} className="size-5" />
					</span>
					{carrera}
				</CardTitle>
				<CardAction>
					<Badge variant="outline">{facultad}</Badge>
				</CardAction>
				{/* Contenedor del ícono estilo "App" */}
			</CardHeader>

			{/* Selector de Planes (Acciones) */}
			{planes && planes.length > 0 && (
				<CardFooter className="flex gap-2">
					{planes?.map(({anio, isLiked, hasMaterias}) =>
						hasMaterias === false ?
							<Button key={anio} disabled variant={isLiked ? "default" : "outline"}>
								{isLiked && <IconHeartFilled size={14} />}
								Ver Plan {anio}
								<IconArrowRight />
							</Button>
						:	<Button
								key={anio}
								variant={isLiked ? "default" : "outline"}
								render={
									<Link href={`/${slug}/${anio}`}>
										{isLiked && <IconHeartFilled size={14} />}
										Ver Plan {anio}
										<IconArrowRight />
									</Link>
								}
							/>,
					)}
				</CardFooter>
			)}
		</Card>
	)
}

export function CardCarreraSkeleton() {
	return (
		<Card className="shadow-xs animate-pulse">
			<CardHeader>
				<CardTitle className="flex items-center gap-3 overflow-hidden">
					<Skeleton className="size-9 rounded-md bg-muted-foreground/10" />
					<Skeleton className="h-6 w-32 bg-muted-foreground/10" />
				</CardTitle>
				<CardAction>
					<Skeleton className="h-5 w-16 rounded-full bg-muted-foreground/10" />
				</CardAction>
			</CardHeader>
			<CardFooter className="flex gap-2">
				<Skeleton className="h-9 w-28 rounded-md bg-muted-foreground/10" />
				<Skeleton className="h-9 w-28 rounded-md bg-muted-foreground/10" />
			</CardFooter>
		</Card>
	)
}
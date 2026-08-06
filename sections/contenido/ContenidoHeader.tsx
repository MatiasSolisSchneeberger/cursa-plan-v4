import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatearFechaActualizacion } from "@/lib/contenido"
import type { ContentFrontmatter } from "@/types/content"

export default function ContenidoHeader({
	title,
	description,
	lastUpdated,
	category,
}: ContentFrontmatter) {
	return (
		<div className="not-typeset space-y-4 mb-8">
			<Badge variant="secondary">{category}</Badge>
			<h1 className="text-3xl font-bold">{title}</h1>
			<p className="text-base text-muted-foreground leading-relaxed">{description}</p>
			<p className="text-sm text-muted-foreground">
				Última actualización: {formatearFechaActualizacion(lastUpdated)}
			</p>
			<Separator />
		</div>
	)
}

import {formatearRango, ESTILOS_FERIADO, ESTILOS_PERIODO} from "@/utils/calendario"
import {Item, ItemMedia, ItemContent, ItemTitle, ItemDescription} from "@/components/ui/item"
import {cn} from "@/lib/utils"

interface EventoItemProps {
	id: string
	title: string
	start: Date
	end: Date
	nota?: string | null
	eventType?: string
	categoria: string
	estiloFeriado?: string
	diasRestantes?: number
}

export function EventoItem({
	title,
	start,
	end,
	nota,
	eventType,
	categoria,
	estiloFeriado,
	diasRestantes,
}: EventoItemProps) {
	let colorPunto = "bg-muted"

	if (categoria === "feriados") {
		const estilo = estiloFeriado || "inamovible"
		const classes = ESTILOS_FERIADO[estilo as keyof typeof ESTILOS_FERIADO]
		colorPunto = classes.split(" ").find((c) => c.startsWith("bg-")) || "bg-destructive"
	} else {
		const estilos = ESTILOS_PERIODO[categoria as keyof typeof ESTILOS_PERIODO]
		if (estilos) {
			colorPunto = estilos.extremo.split(" ").find((c) => c.startsWith("bg-")) || "bg-muted"
		}
	}

	return (
		<Item variant="outline" size="sm">
			<ItemContent>
				<ItemTitle className="flex items-start">
					<span className="font-mono">{formatearRango(start, end)}</span>
					<span className="text-muted-foreground">|</span>
					{title}
				</ItemTitle>
				<ItemDescription>{nota || eventType}</ItemDescription>
				{diasRestantes !== undefined && (
					<span className="text-xs text-muted-foreground">
						En <span className="font-mono">{diasRestantes}</span> {diasRestantes === 1 ? "día" : "días"}
					</span>
				)}
			</ItemContent>
		</Item>
	)
}

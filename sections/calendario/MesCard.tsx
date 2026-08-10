import {Card, CardContent} from "@/components/ui/card"
import {CalendarEvent} from "@/utils/transformEventos"
import {eventosDelMes, claveDia} from "@/utils/calendario"
import {DiaCelda} from "./DiaCelda"
import {EventoItem} from "./EventoItem"
import {ItemGroup} from "@/components/ui/item"

interface MesCardProps {
	mes: number
	nombre: string
	dias: (Date | null)[]
	eventos: CalendarEvent[]
	anioActivo: number
}

const ENCABEZADOS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]

export function MesCard({mes, nombre, dias, eventos, anioActivo}: MesCardProps) {
	const eventosDelMesLocal = eventosDelMes(eventos, anioActivo, mes)

	const semanas: (Date | null)[][] = []
	for (let i = 0; i < dias.length; i += 7) {
		semanas.push(dias.slice(i, i + 7))
	}

	return (
		<Card className="[--cell-radius:var(--radius-md)]">
			<CardContent className="space-y-3">
				<p className="text-center text-sm font-medium">{nombre}</p>

				<div>
					<div className="flex">
						{ENCABEZADOS.map((d) => (
							<div key={d} className="flex-1 text-center text-[0.8rem] font-normal text-muted-foreground select-none">
								{d}
							</div>
						))}
					</div>
					{semanas.map((semana, i) => (
						<div key={i} className="mt-2 flex w-full">
							{semana.map((dia, j) =>
								dia ?
									<DiaCelda key={claveDia(dia)} dia={dia} eventos={eventos} />
								:	<div key={`v-${j}`} className="aspect-square w-full" />,
							)}
						</div>
					))}
				</div>

				{eventosDelMesLocal.length > 0 && (
					<ItemGroup className="border-t pt-3">
						{eventosDelMesLocal.map(({id, title, start, end, nota, categoria, eventType, estiloFeriado}) => (
							<EventoItem
								key={id}
								id={id}
								title={title}
								start={start}
								end={end}
								nota={nota}
								eventType={eventType}
								categoria={categoria}
								estiloFeriado={estiloFeriado}
							/>
						))}
					</ItemGroup>
				)}
			</CardContent>
		</Card>
	)
}

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Item, ItemGroup, ItemMedia, ItemContent as IItemContent, ItemTitle as IItemTitle } from "@/components/ui/item"
import { CalendarEvent } from "@/utils/transformEventos"
import { LINKS_CALENDARIO, eventosProximos } from "@/utils/calendario"
import { EventoItem } from "./EventoItem"
import { IconCircleCheck, IconChevronRight } from "@tabler/icons-react"

interface CalendarioHeroProps {
  eventos: CalendarEvent[]
}

export function CalendarioHero({ eventos }: CalendarioHeroProps) {
  const proximos = eventosProximos(eventos, new Date(), 14)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendario</CardTitle>
        <CardDescription>
          Fechas de cursado, inscripciones, mesas de examen y feriados del calendario académico.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Importante</p>
          <ItemGroup>
            {LINKS_CALENDARIO.map(({ id, label, href }) => (
              <Item
                key={id}
                variant="outline"
                size="sm"
                render={
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 w-full"
                  >
                    <ItemMedia variant="icon">
                      <IconCircleCheck className="size-4" />
                    </ItemMedia>
                    <IItemContent>
                      <IItemTitle>{label}</IItemTitle>
                    </IItemContent>
                    <IconChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </a>
                }
              />
            ))}
          </ItemGroup>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Próximos eventos</p>
          {proximos.length > 0 ? (
            <ItemGroup>
              {proximos.map(({ id, title, start, end, nota, categoria, eventType, estiloFeriado }) => (
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
          ) : (
            <p className="text-sm text-muted-foreground">Sin eventos en los próximos 14 días.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

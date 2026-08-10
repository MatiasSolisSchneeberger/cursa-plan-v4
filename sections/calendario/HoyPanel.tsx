"use client"

import { Card } from "@/components/ui/card"
import { CalendarEvent } from "@/utils/transformEventos"
import { claveDia, eventosDelDia, formatearRango } from "@/utils/calendario"
import { calcularDiasCalendario } from "@/utils/fechaProxima"

interface HoyPanelProps {
  eventos: CalendarEvent[]
}

export function HoyPanel({ eventos }: HoyPanelProps) {
  const hoy = new Date()
  const clavHoy = claveDia(hoy)

  const eventoHoy = eventosDelDia(eventos, hoy)
  const eventosProximos = eventos
    .filter(({ start }) => claveDia(start) > clavHoy)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Hoy</p>
          <p className="text-sm font-mono">{hoy.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>

        {eventoHoy.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Vigentes</p>
            <div className="space-y-1">
              {eventoHoy.map(({ id, title, eventType, start, end }) => (
                <div key={id} className="text-xs">
                  <p className="font-medium truncate">{title}</p>
                  <p className="text-muted-foreground">{eventType}</p>
                  <p className="text-muted-foreground text-[10px] font-mono">{formatearRango(start, end)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Sin eventos</p>
        )}

        {eventosProximos.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground">Próximos</p>
            <div className="space-y-2">
              {eventosProximos.map(({ id, title, eventType, start, end }) => {
                const dias = calcularDiasCalendario(start, hoy)
                return (
                  <div key={id} className="text-xs">
                    <p className="font-medium truncate">{title}</p>
                    <p className="text-muted-foreground">{eventType}</p>
                    <p className="text-muted-foreground text-[10px] font-mono">{formatearRango(start, end)}</p>
                    <p className="text-muted-foreground text-[10px] mt-1">
                      {dias} <span className="font-mono">{dias === 1 ? "día" : "días"}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

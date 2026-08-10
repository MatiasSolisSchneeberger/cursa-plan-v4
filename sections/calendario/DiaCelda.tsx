import { CalendarEvent } from "@/utils/transformEventos"
import { eventosDelDia, claveDia, ESTILOS_PERIODO, ESTILOS_FERIADO, PRIORIDAD_FERIADO } from "@/utils/calendario"
import { cn } from "@/lib/utils"

interface DiaCeldaProps {
  dia: Date
  eventos: CalendarEvent[]
}

export function DiaCelda({ dia, eventos }: DiaCeldaProps) {
  const claveDiaActual = claveDia(dia)
  const eventosDia = eventosDelDia(eventos, dia)
  const esHoy = claveDiaActual === claveDia(new Date())

  const franjas: Array<{ key: string; clases: string; colorTexto: string }> = []
  let colorTextoFinal = "text-foreground"

  for (const evento of eventosDia) {
    const esInicio = claveDiaActual === claveDia(evento.start)
    const esFin = claveDiaActual === claveDia(evento.end)

    let clases = ""
    let colorTexto = "text-foreground"

    if (evento.categoria === "feriados") {
      const feriados = eventosDia
        .filter((e) => e.categoria === "feriados")
        .sort((a, b) => {
          const indexA = PRIORIDAD_FERIADO.indexOf(a.estiloFeriado || "inamovible")
          const indexB = PRIORIDAD_FERIADO.indexOf(b.estiloFeriado || "inamovible")
          return indexA - indexB
        })

      if (feriados[0]?.id !== evento.id) continue

      const estilo = evento.estiloFeriado || "inamovible"
      clases = cn("rounded-(--cell-radius)", ESTILOS_FERIADO[estilo])
      colorTexto = ESTILOS_FERIADO[estilo].split(" ").find((c) => c.startsWith("text-")) || "text-foreground"
    } else {
      const estilosPeriodo = ESTILOS_PERIODO[evento.categoria]
      if (!estilosPeriodo) continue

      if (esInicio || esFin) {
        clases = estilosPeriodo.extremo
        if (esInicio && !esFin) clases = cn("rounded-l-(--cell-radius)", estilosPeriodo.extremo)
        if (esFin && !esInicio) clases = cn("rounded-r-(--cell-radius)", estilosPeriodo.extremo)
        if (esInicio && esFin) clases = cn("rounded-(--cell-radius)", estilosPeriodo.extremo)
        colorTexto = estilosPeriodo.extremo.split(" ").find((c) => c.startsWith("text-")) || "text-foreground"
      } else {
        clases = estilosPeriodo.medio
        if (dia.getDay() === 0) clases = cn("rounded-l-(--cell-radius)", estilosPeriodo.medio)
        if (dia.getDay() === 6) clases = cn("rounded-r-(--cell-radius)", estilosPeriodo.medio)
        colorTexto = estilosPeriodo.medio.split(" ").find((c) => c.startsWith("text-")) || "text-foreground"
      }
    }

    franjas.push({
      key: `${evento.id}`,
      clases,
      colorTexto,
    })

    if (franjas.length === 1) {
      colorTextoFinal = colorTexto
    }
  }

  return (
    <div className="relative aspect-square w-full">
      {franjas.length > 0 && (
        <div className="absolute inset-0 flex flex-col">
          {franjas.map(({ key, clases }) => (
            <div key={key} className={cn("flex-1", clases)} />
          ))}
        </div>
      )}
      <div
        className={cn(
          "relative z-10 flex size-full items-center justify-center text-sm tabular-nums",
          colorTextoFinal,
          esHoy && "font-bold underline underline-offset-4",
        )}
      >
        {dia.getDate()}
      </div>
    </div>
  )
}

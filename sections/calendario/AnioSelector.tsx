import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

interface AnioSelectorProps {
  anioActivo: number
  anios: number[]
}

export function AnioSelector({ anioActivo, anios }: AnioSelectorProps) {
  const anioAnterior = anioActivo - 1
  const anioSiguiente = anioActivo + 1

  const puedeAnterior = anios.includes(anioAnterior)
  const puedeSiguiente = anios.includes(anioSiguiente)

  return (
    <div data-slot="button-group" className="flex items-center rounded-lg border border-border">
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!puedeAnterior}
        render={puedeAnterior ? <Link href={`/calendario/${anioAnterior}`} /> : undefined}
      >
        <IconChevronLeft className="size-4" />
      </Button>
      <span className="min-w-16 text-center font-mono text-sm font-medium">{anioActivo}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!puedeSiguiente}
        render={puedeSiguiente ? <Link href={`/calendario/${anioSiguiente}`} /> : undefined}
      >
        <IconChevronRight className="size-4" />
      </Button>
    </div>
  )
}

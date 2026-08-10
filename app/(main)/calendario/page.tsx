import { Suspense } from "react"
import { cacheLife } from "next/cache"
import { CalendarioView } from "@/sections/calendario/CalendarioView"
import { CalendarioSkeleton } from "@/sections/calendario/CalendarioSkeleton"
import { obtenerDatosCalendario } from "@/sections/calendario/CalendarioContenido"

export default function CalendarioPage() {
  return (
    <Suspense fallback={<CalendarioSkeleton />}>
      <CalendarioContent />
    </Suspense>
  )
}

async function CalendarioContent() {
  "use cache"
  cacheLife("days")

  const anioActivo = new Date().getFullYear()
  const { eventos, anios } = await obtenerDatosCalendario(anioActivo)

  return <CalendarioView eventos={eventos} anioActivo={anioActivo} anios={anios} />
}

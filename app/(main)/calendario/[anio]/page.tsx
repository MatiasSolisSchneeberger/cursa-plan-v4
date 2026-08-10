import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CalendarioView } from "@/sections/calendario/CalendarioView"
import { CalendarioSkeleton } from "@/sections/calendario/CalendarioSkeleton"
import { obtenerDatosCalendario } from "@/sections/calendario/CalendarioContenido"
import { getAniosCalendario } from "@/lib/carreras"

interface CalendarioAnioPageProps {
  params: Promise<{ anio: string }>
}

export default function CalendarioAnioPage({ params }: CalendarioAnioPageProps) {
  return (
    <Suspense fallback={<CalendarioSkeleton />}>
      <CalendarioAnioContent params={params} />
    </Suspense>
  )
}

async function CalendarioAnioContent({ params }: CalendarioAnioPageProps) {
  const { anio } = await params
  const anioActivo = parseInt(anio, 10)

  if (isNaN(anioActivo)) {
    notFound()
  }

  const datos = await obtenerDatosCalendario(anioActivo)

  if (!datos.anios.includes(anioActivo)) {
    notFound()
  }

  return <CalendarioView eventos={datos.eventos} anioActivo={anioActivo} anios={datos.anios} />
}

export async function generateStaticParams() {
  const anios = await getAniosCalendario()
  return anios.map((anio) => ({
    anio: String(anio),
  }))
}

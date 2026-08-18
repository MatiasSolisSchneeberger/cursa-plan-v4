import { ImageResponse } from "next/og"
import { OgImage } from "@/components/OgImage"
import { getMateriaDetalle } from "@/lib/carreras"
import { ogSize, ogContentType, cargarFuentesOg } from "@/lib/og"

export const alt = "Información de materia"
export const size = ogSize
export const contentType = ogContentType

interface Props {
	params: Promise<{ carreraSlug: string; plan: string; materia: string }>
}

export default async function Image({ params }: Props) {
	const { carreraSlug, plan, materia } = await params
	const fonts = await cargarFuentesOg()

	try {
		const materiaData = await getMateriaDetalle(carreraSlug, plan, materia)

		return new ImageResponse(
			<OgImage
				tipo="materia"
				titulo={materiaData.nombre}
				subtitulo={materiaData.plan.carrera.nombre}
				metadata={[`${materiaData.anio}º año`, `${materiaData.nroPeriodo}º cuatrimestre`]}
			/>,
			{
				...size,
				fonts,
			}
		)
	} catch {
		return new ImageResponse(<OgImage tipo="default" />, {
			...size,
			fonts,
		})
	}
}

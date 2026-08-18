import { ImageResponse } from "next/og"
import { OgImage } from "@/components/OgImage"
import { getPlanEstudio } from "@/lib/carreras"
import { ogSize, ogContentType, cargarFuentesOg } from "@/lib/og"

export const alt = "Plan de estudios"
export const size = ogSize
export const contentType = ogContentType

interface Props {
	params: Promise<{ carreraSlug: string; plan: string }>
}

export default async function Image({ params }: Props) {
	const { carreraSlug, plan } = await params
	const fonts = await cargarFuentesOg()

	try {
		const planData = await getPlanEstudio(plan, carreraSlug)
		const cantMaterias = planData.anios.reduce((acc, anio) => {
			return (
				acc +
				anio.periodos.reduce((perAcc, periodo) => {
					return perAcc + periodo.materias.length
				}, 0)
			)
		}, 0)

		return new ImageResponse(
			<OgImage
				tipo="plan"
				titulo={`${planData.carrera.nombre}`}
				subtitulo={`Plan ${planData.anioInicio}`}
				metadata={[`${cantMaterias} materias`]}
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

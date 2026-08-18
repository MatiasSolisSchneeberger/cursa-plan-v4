import { ImageResponse } from "next/og"
import { OgImage } from "@/components/OgImage"
import { ogSize, ogContentType, cargarFuentesOg } from "@/lib/og"

export const alt = "CursaPlan - Correlativas y fechas de examen"
export const size = ogSize
export const contentType = ogContentType

export default async function Image() {
	const fonts = await cargarFuentesOg()

	return new ImageResponse(<OgImage tipo="default" />, {
		...size,
		fonts,
	})
}

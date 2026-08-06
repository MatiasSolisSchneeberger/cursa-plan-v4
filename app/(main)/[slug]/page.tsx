import { notFound } from "next/navigation"
import { contenido, esContenidoSlug, buildContentMetadata } from "@/lib/contenido"
import ContenidoHeader from "@/sections/contenido/ContenidoHeader"

interface PageProps {
	params: Promise<{ slug: string }>
}

export function generateStaticParams() {
	return Object.keys(contenido).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params
	if (!esContenidoSlug(slug)) return {}
	return buildContentMetadata(contenido[slug].frontmatter)
}

export default async function ContenidoPage({ params }: PageProps) {
	const { slug } = await params
	if (!esContenidoSlug(slug)) notFound()

	const { default: Documento, frontmatter } = contenido[slug]

	return (
		<article className="typeset mx-auto w-full max-w-3xl py-8 md:py-12">
			<ContenidoHeader {...frontmatter} />
			<Documento />
		</article>
	)
}

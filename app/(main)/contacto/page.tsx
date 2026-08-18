import Link from "next/link"
import { buildContentMetadata } from "@/lib/contenido"
import ContenidoHeader from "@/sections/contenido/ContenidoHeader"
import ContactoForm from "@/sections/contacto/ContactoForm"
import type { ContentFrontmatter } from "@/types/content"

const frontmatter: ContentFrontmatter = {
	title: "Contacto",
	description: "Ponete en contacto con nosotros para consultas, sugerencias o reportar problemas en la plataforma.",
	lastUpdated: "2026-08-17",
	category: "Contacto",
}

export const metadata = buildContentMetadata(frontmatter)

export default function ContactoPage() {
	return (
		<div className="mx-auto w-full max-w-3xl py-8 md:py-12">
			<ContenidoHeader {...frontmatter} />

			<section className="typeset space-y-6">
				<div>
					<h2 className="text-2xl font-bold mb-4">Canales de Contacto</h2>
					<p className="text-base leading-7 mb-4">
						Podés ponerte en contacto con nosotros de varias maneras:
					</p>
					<ul className="list-disc list-inside space-y-2 text-base">
						<li>
							<strong>Formulario de contacto</strong> — completa el formulario de abajo y te responderemos a la brevedad.
						</li>
						<li>
							<strong>GitHub</strong> — si encontrás un problema técnico,{" "}
							<Link
								href="https://github.com/MatiasSolisSchneeberger/cursa-plan-v4/issues"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								abrí una issue en el repositorio
							</Link>
							.
						</li>
						<li>
							<strong>Datos incorrectos</strong> — si encontrás un error en correlativas, fechas de examen u otra información,{" "}
							<Link href="/errores" className="text-primary hover:underline">
								dirígete a la página de Reportar errores
							</Link>
							.
						</li>
					</ul>
				</div>
			</section>

			<ContactoForm />

			<section className="typeset space-y-6">
				<div>
					<h2 className="text-2xl font-bold mb-4">¿Qué incluir en tu mensaje?</h2>
					<p className="text-base leading-7 mb-4">
						Para que podamos ayudarte de forma rápida y efectiva, te pedimos que incluyas:
					</p>
					<ul className="list-disc list-inside space-y-2 text-base">
						<li>
							<strong>Tu nombre y email</strong> — para poder responderte
						</li>
						<li>
							<strong>Tipo de consulta clara</strong> — selecciona la categoría que mejor se ajuste (consulta general, error en datos, bug, sugerencia)
						</li>
						<li>
							<strong>Descripción detallada</strong> — qué carrera, plan y materia involucra (si aplica), y qué está pasando
						</li>
						<li>
							<strong>Pasos a reproducir</strong> (si es un bug) — cómo llegaste a la pantalla con el problema
						</li>
						<li>
							<strong>Capturas de pantalla</strong> — muy útiles para entender issues visuales o errores inesperados
						</li>
					</ul>
				</div>

				<hr className="border-border/60" />

				<div>
					<h2 className="text-2xl font-bold mb-4">Tiempos de Respuesta</h2>
					<p className="text-base leading-7">
						Hacemos nuestro mejor esfuerzo por contestar en el menor tiempo posible. Dependiendo del volumen y la complejidad, esperá una respuesta en{" "}
						<strong>3 a 5 días hábiles</strong>.
					</p>
				</div>

				<hr className="border-border/60" />

				<div>
					<h2 className="text-2xl font-bold mb-4">¿Es un error en los datos?</h2>
					<p className="text-base leading-7">
						Si encontraste un dato desactualizado o erróneo (una correlativa mal cargada, una fecha de examen incorrecta, etc.), podés también ir directo a la página de{" "}
						<Link href="/errores" className="text-primary hover:underline">
							Reportar errores
						</Link>{" "}
						donde te explicamos paso a paso qué información aportar.
					</p>
				</div>
			</section>
		</div>
	)
}

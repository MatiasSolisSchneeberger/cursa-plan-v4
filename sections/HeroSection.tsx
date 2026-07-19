import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconRocket, IconSchool } from "@tabler/icons-react";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="typeset container flex flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
			<Badge>
				<IconRocket />
				Cursa Plan v3.2
			</Badge>

			<h1>Bienvenido a Cursa Plan</h1>

			<p>
				Entrá para conocer cada materia, sus correlativas y requisitos, además del plan de estudios y las próximas mesas
				de examen. Toda la información para avanzar en tu carrera.
			</p>

			{/* CTA */}
			<footer className="flex flex-wrap justify-center gap-4 pt-4">
				<Button render={
					<Link href="/register">
						Comenzar ahora
						<IconArrowRight size={20} />
					</Link>

                }/>

				<Button variant="secondary" render={
					<Link href="/carreras">
						<IconSchool size={20} />
						Explorar carreras
					</Link>
				}/>
			</footer>
		</section>
	)
}

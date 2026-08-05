import LandingHero from "@/sections/landing/LandingHero"
import LandingFeatures from "@/sections/landing/LandingFeatures"
import LandingBenefits from "@/sections/landing/LandingBenefits"
import LandingCarreras from "@/sections/landing/LandingCarreras"
import LandingCta from "@/sections/landing/LandingCta"
import {getCarreras} from "@/lib/carreras"

export default async function IndexPage() {
	const carreras = await getCarreras()

	return (
		<main className="w-full">
			<LandingHero />
			{/*
            <LandingFeatures />
			<LandingBenefits />
            */}
			<LandingCarreras carreras={carreras} />
			{/*
            <LandingCta />
            */}
		</main>
	)
}

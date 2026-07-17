import {
	IconMicroscope,
	IconBolt,
	IconRobot,
	IconSeedling,
	IconAtom,
	IconFlask,
	IconMath,
	IconDeviceImac,
	IconButterfly,
	IconRuler,
	IconTestPipe,
	IconPrismLight,
	IconFlask2Filled,
	IconGeometry,
	IconIcons,
	IconAlien,
	IconBook,
	IconBriefcase,
	IconBulb,
	IconCalculator,
	IconCode,
	IconCoffee,
	IconCpu,
	IconDna,
	IconFlame,
	IconGhost,
	IconHeadphones,
	IconMoodCrazyHappy,
	IconMoodHappy,
	IconMoodNerd,
	IconMoodSmile,
	IconPlanet,
	IconRocket,
	IconTrophy,
} from "@tabler/icons-react"

export default function Icon({icon, className, size}: {icon: string; className?: string; size?: number}) {
	switch (icon) {
		/* Carreras */
		case "microscope":
			return <IconMicroscope size={size} className={className} />
		case "geometry":
			return <IconGeometry size={size} className={className} />
		case "bolt":
			return <IconBolt size={size} className={className} />
		case "robot":
			return <IconRobot size={size} className={className} />
		case "seedling":
			return <IconSeedling size={size} className={className} />
		case "atom":
			return <IconAtom size={size} className={className} />
		case "flask":
			return <IconFlask size={size} className={className} />
		case "math":
			return <IconMath size={size} className={className} />
		case "device-imac":
			return <IconDeviceImac size={size} className={className} />
		case "butterfly":
			return <IconButterfly size={size} className={className} />
		case "telescope":
			return <IconPrismLight size={size} className={className} />
		case "ruler":
			return <IconRuler size={size} className={className} />
		case "test-pipe":
			return <IconTestPipe size={size} className={className} />
		case "flask-2-filled":
			return <IconFlask2Filled size={size} className={className} />

		/* avatars */
		case "mood-nerd":
			return <IconMoodNerd className={className} size={size} />
		case "mood-smile":
			return <IconMoodSmile className={className} size={size} />
		case "mood-happy":
			return <IconMoodHappy className={className} size={size} />
		case "mood-crazy-happy":
			return <IconMoodCrazyHappy className={className} size={size} />
		case "ghost":
			return <IconGhost className={className} size={size} />
		case "robot":
			return <IconRobot className={className} size={size} />
		case "alien":
			return <IconAlien className={className} size={size} />
		case "code":
			return <IconCode className={className} size={size} />
		case "flask":
			return <IconFlask className={className} size={size} />
		case "calculator":
			return <IconCalculator className={className} size={size} />
		case "dna":
			return <IconDna className={className} size={size} />
		case "atom":
			return <IconAtom className={className} size={size} />
		case "cpu":
			return <IconCpu className={className} size={size} />
		case "briefcase":
			return <IconBriefcase className={className} size={size} />
		case "bulb":
			return <IconBulb className={className} size={size} />
		case "book":
			return <IconBook className={className} size={size} />
		case "coffee":
			return <IconCoffee className={className} size={size} />
		case "headphones":
			return <IconHeadphones className={className} size={size} />
		case "rocket":
			return <IconRocket className={className} size={size} />
		case "trophy":
			return <IconTrophy className={className} size={size} />
		case "flame":
			return <IconFlame className={className} size={size} />
		case "planet":
			return <IconPlanet className={className} size={size} />

        /* default */
		default:
			return <IconIcons size={size} className={className} />
	}
}

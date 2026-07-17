import { IconSchool } from "@tabler/icons-react";
import Link from "next/link";

export default function LogoPage() {
	return (
		<Link
			href="/"
			id="logo"
			className="bg-primary text-primary-foreground relative flex h-min w-min shrink-0 flex-row items-center gap-2.5 rounded-2xl py-2.5 pr-3 pl-2.5"
		>
			<IconSchool size="22" />
			<span className="font-title text-sm font-bold tracking-wide whitespace-nowrap">
				CursaPlan
			</span>
		</Link>
	);
}

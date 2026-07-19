import Navbar from "@/sections/Navbar"

export default function MainLayout({children}: {children: React.ReactNode}) {
	return (
		<main className="px-4 py-2 sm:px-4 md:px-8 lg:px-12 flex flex-col gap-4">
			<Navbar />
			{children}
		</main>
	)
}

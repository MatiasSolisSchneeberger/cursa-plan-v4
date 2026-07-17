import Navbar from "@components/Navbar"

export default function MainLayout({children}: {children: React.ReactNode}) {
	return (
		<main className="px-12 py-2">
			<Navbar />
			{children}
		</main>
	)
}

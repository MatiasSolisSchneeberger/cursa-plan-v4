import { Suspense } from "react"
import { sanitizeNext } from "@/utils/redirect"
import RegisterForm from "@/components/RegisterForm"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
	title: "Registrarse | CursaPlan",
	description: "Crea una nueva cuenta en CursaPlan para organizar tu plan de estudios",
}

function RegisterSkeleton() {
	return (
		<section className="w-full h-full flex items-center justify-center py-6">
			<Skeleton className="w-full max-w-md mx-auto h-96" />
		</section>
	)
}

async function RegisterContent({ next }: { next?: string }) {
	const sanitizedNext = sanitizeNext(next)
	return <RegisterForm next={sanitizedNext} />
}

export default function RegisterPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string }>
}) {
	return (
		<Suspense fallback={<RegisterSkeleton />}>
			<RegisterPageAsync searchParams={searchParams} />
		</Suspense>
	)
}

async function RegisterPageAsync({
	searchParams,
}: {
	searchParams: Promise<{ next?: string }>
}) {
	const { next } = await searchParams
	return <RegisterContent next={next} />
}

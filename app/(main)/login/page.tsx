import {Suspense} from "react"
import {sanitizeNext} from "@/utils/redirect"
import LoginForm from "@/components/LoginForm"
import {Skeleton} from "@/components/ui/skeleton"

export const metadata = {
	title: "Iniciar Sesión | CursaPlan",
	description: "Inicia sesión en tu cuenta de CursaPlan para acceder a tu plan de estudios",
}

function LoginSkeleton() {
	return (
		<section className="w-full h-full flex items-center justify-center py-6">
			<Skeleton className="w-full max-w-md mx-auto h-96" />
		</section>
	)
}

async function LoginContent({next}: {next?: string}) {
	const sanitizedNext = sanitizeNext(next)
	return <LoginForm next={sanitizedNext} />
}

export default function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{next?: string}>
}) {
	return (
		<Suspense fallback={<LoginSkeleton />}>
			<LoginPageAsync searchParams={searchParams} />
		</Suspense>
	)
}

async function LoginPageAsync({
	searchParams,
}: {
	searchParams: Promise<{next?: string}>
}) {
	const {next} = await searchParams
	return <LoginContent next={next} />
}

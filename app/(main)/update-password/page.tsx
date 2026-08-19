import { redirect } from "next/navigation"
import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth"
import { UpdatePasswordForm } from "@/sections/auth/UpdatePasswordForm"

async function UpdatePasswordContent() {
	const result = await getCurrentUser()

	if (!result.success || !result.data?.user) {
		redirect("/forgot-password?error=link_invalido")
	}

	return <UpdatePasswordForm />
}

export default function UpdatePasswordPage() {
	return (
		<Suspense fallback={<div className="flex items-center justify-center p-8">Cargando...</div>}>
			<UpdatePasswordContent />
		</Suspense>
	)
}

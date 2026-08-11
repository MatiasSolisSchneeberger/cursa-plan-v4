import { getCurrentUser } from "@/lib/auth"
import UserDropdown from "@/components/UserDropdown"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconLogin, IconUserPlus } from "@tabler/icons-react"
import LoginButton from "@/components/LoginButton"

export default async function NavUser() {
	const { data } = await getCurrentUser()
	const user = data?.user

	if (!user) {
		return (
			<>
				<div className="hidden flex-row gap-2 lg:flex">
					<LoginButton variant="secondary">
						<IconLogin />
						Iniciar Sesión
					</LoginButton>
					<Button
						variant="default"
						render={
							<Link href="/register">
								<IconUserPlus />
								Registrarte
							</Link>
						}
					/>
				</div>
				<div className="flex flex-row gap-2 lg:hidden">
					<LoginButton size="icon-lg" variant="secondary">
						<IconLogin />
					</LoginButton>
					<Button
						size="icon-lg"
						variant="default"
						render={
							<Link href="/register">
								<IconUserPlus />
							</Link>
						}
					/>
				</div>
			</>
		)
	}

	return <UserDropdown user={user} />
}

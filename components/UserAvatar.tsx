import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import Icon from "@/components/Icon"
import type {Usuario} from "@/types/auth"
import {cn} from "@/lib/utils"

interface UserAvatarProps {
	user: Partial<Usuario>
	size?: "default" | "sm" | "lg"
	className?: string
}

export default function UserAvatar({user, size = "default", className}: UserAvatarProps) {
	const displayName = user.full_name || user.username || "Usuario"
	const initial = displayName.trim().charAt(0).toUpperCase() || "U"

	const hasAvatarUrl = Boolean(user.avatar_url && user.avatar_url.trim().length > 0)
	const hasIcon = Boolean(user.icon && user.icon.trim().length > 0)

	return (
		<Avatar size={size}>
			{hasAvatarUrl && <AvatarImage src={user.avatar_url!} alt={displayName} className="object-cover" />}
			{hasIcon && !hasAvatarUrl ?
				<AvatarFallback className="bg-primary/10 text-primary font-medium flex items-center justify-center">
					<Icon icon={user.icon!} className="size-5" />
				</AvatarFallback>
			:	<AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm flex items-center justify-center">
					{initial}
				</AvatarFallback>
			}
		</Avatar>
	)
}

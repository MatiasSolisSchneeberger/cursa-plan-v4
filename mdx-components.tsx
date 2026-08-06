import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"
import Link from "next/link"

const components: MDXComponents = {
	a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
		if (href.startsWith("/")) return <Link href={href} {...props}>{children}</Link>
		if (href.startsWith("#")) return <a href={href} {...props}>{children}</a>
		return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
	},
}

export function useMDXComponents(): MDXComponents {
	return components
}

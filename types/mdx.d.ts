declare module "*.mdx" {
	import type { ContentFrontmatter } from "@/types/content"

	export const frontmatter: ContentFrontmatter
}

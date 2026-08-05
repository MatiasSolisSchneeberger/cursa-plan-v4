import type {NextConfig} from "next"
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
	cacheComponents: true,
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

const withMDX = createMDX({
	extension: /\.(md|mdx)$/,
})

export default withMDX(nextConfig)

import { ogTema, ogTextos } from "@/lib/og"

interface OgImageProps {
	tipo: "default" | "plan" | "materia"
	titulo?: string
	subtitulo?: string
	metadata?: string[]
}

export function OgImage({ tipo, titulo, subtitulo, metadata }: OgImageProps) {
	const tema = ogTema

	if (tipo === "default") {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: `${tema.padding}px`,
					backgroundColor: tema.fondo,
					color: tema.texto,
					fontFamily: "Montserrat, sans-serif",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<div
						style={{
							width: "24px",
							height: "24px",
							borderRadius: "6px",
							backgroundColor: tema.acento,
						}}
					/>
					<span style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "0.06em" }}>
						{ogTextos.marca}
					</span>
				</div>
				<span style={{ fontSize: "56px", lineHeight: 1.2, fontWeight: 500 }}>
					{ogTextos.tagline}
				</span>
			</div>
		)
	}

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: `${tema.padding}px`,
				backgroundColor: tema.fondo,
				color: tema.texto,
				fontFamily: "Montserrat, sans-serif",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
				<div
					style={{
						width: "24px",
						height: "24px",
						borderRadius: "6px",
						backgroundColor: tema.acento,
					}}
				/>
				<span style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "0.06em" }}>
					{ogTextos.marca}
				</span>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
				{subtitulo && (
					<span style={{ fontSize: tema.tamSubtitulo, color: tema.acento, fontWeight: 500 }}>
						{subtitulo}
					</span>
				)}
				{titulo && (
					<span style={{ fontSize: tema.tamTitulo, lineHeight: 1.1, color: tema.texto, fontWeight: 500 }}>
						{titulo}
					</span>
				)}
			</div>

			{metadata && metadata.length > 0 && (
				<div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
					{metadata.map((item, idx) => (
						<span
							key={idx}
							style={{
								fontSize: tema.tamMeta,
								color: tema.texto,
								background: tema.acento,
								padding: "5px 12px",
								borderRadius: "999px",
							}}
						>
							{item}
						</span>
					))}
				</div>
			)}
		</div>
	)
}

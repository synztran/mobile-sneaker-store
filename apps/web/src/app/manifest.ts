import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Gariffe Lab",
		short_name: "Gariffe Lab",
		description: "Premium curated sneaker drops",
		start_url: "/",
		scope: "/",
		display: "standalone",
		orientation: "any",
		background_color: "#fbf9f5",
		theme_color: "#9b3f1c",
		categories: ["shopping", "lifestyle"],
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	};
}

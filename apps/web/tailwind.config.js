/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Primary terracotta palette
				primary: "#9b3f1c",
				"primary-container": "#bb5732",
				"primary-action": "#D46A43",
				"on-primary": "#ffffff",
				"primary-fixed": "#ffdbcf",
				"primary-fixed-dim": "#ffb59c",
				"on-primary-fixed": "#380c00",
				"on-primary-fixed-variant": "#7f2b07",
				"inverse-primary": "#ffb59c",

				// Secondary olive green
				secondary: "#52652a",
				"secondary-container": "#d4eca2",
				"on-secondary": "#ffffff",
				"secondary-fixed": "#d4eca2",
				"secondary-fixed-dim": "#b8cf88",
				"on-secondary-fixed": "#141f00",
				"on-secondary-fixed-variant": "#3b4d14",
				"on-secondary-container": "#576b2f",
				"success-state": "#4A5D23",

				// Tertiary neutral warm
				tertiary: "#5e5c58",
				"tertiary-container": "#777470",
				"on-tertiary": "#ffffff",
				"tertiary-fixed": "#e6e2dd",
				"tertiary-fixed-dim": "#cac6c1",
				"on-tertiary-fixed": "#1d1b19",
				"on-tertiary-fixed-variant": "#484643",
				"on-tertiary-container": "#fffbff",

				// Surface tokens
				background: "#fbf9f5",
				surface: "#fbf9f5",
				"surface-bright": "#fbf9f5",
				"surface-dim": "#dbdad6",
				"surface-container-lowest": "#ffffff",
				"surface-container-low": "#f5f3ef",
				"surface-container": "#f0eeea",
				"surface-container-high": "#eae8e4",
				"surface-container-highest": "#e4e2de",
				"surface-variant": "#e4e2de",
				"surface-tint": "#9e421e",

				// On-surface tokens
				"on-surface": "#1b1c1a",
				"on-background": "#1b1c1a",
				"on-surface-variant": "#56423c",

				// Outline
				outline: "#89726a",
				"outline-variant": "#ddc1b8",

				// Inverse
				"inverse-surface": "#30312e",
				"inverse-on-surface": "#f2f0ec",

				// Error
				error: "#ba1a1a",
				"error-container": "#ffdad6",
				"on-error": "#ffffff",
				"on-error-container": "#93000a",
			},
			borderRadius: {
				DEFAULT: "0.25rem",
				sm: "0.375rem",
				md: "0.5rem",
				lg: "0.5rem",
				xl: "0.75rem",
				"2xl": "1rem",
				"3xl": "1.5rem",
				"4xl": "2rem",
				"5xl": "2.5rem",
				full: "9999px",
			},
			fontFamily: {
				sans: ["Manrope", "sans-serif"],
				headline: ["Manrope", "sans-serif"],
				body: ["Manrope", "sans-serif"],
				label: ["Manrope", "sans-serif"],
			},
			boxShadow: {
				ambient: "0 40px 40px rgba(155, 63, 28, 0.06)",
				"ambient-sm": "0 4px 20px rgba(155, 63, 28, 0.04)",
				"ambient-lg": "0 20px 50px rgba(155, 63, 28, 0.08)",
				float: "0 -4px 20px rgba(155, 63, 28, 0.06)",
			},
			backgroundImage: {
				"primary-gradient":
					"linear-gradient(135deg, #9B3F1C 0%, #BB5732 100%)",
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				sneakerlab: {
					primary: "#9b3f1c",
					"primary-content": "#ffffff",
					secondary: "#52652a",
					"secondary-content": "#ffffff",
					accent: "#D46A43",
					"accent-content": "#ffffff",
					neutral: "#2D2B2A",
					"neutral-content": "#ffffff",
					"base-100": "#fbf9f5",
					"base-200": "#f0eeea",
					"base-300": "#eae8e4",
					"base-content": "#1b1c1a",
					info: "#3b82f6",
					success: "#52652a",
					warning: "#D46A43",
					error: "#ba1a1a",
				},
			},
		],
		darkTheme: false,
		base: true,
		styled: true,
		utils: true,
	},
};

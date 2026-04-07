import { StoreHydrator } from "@/components/ui/StoreHydrator";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Giraffe Lab",
	description: "Premium curated sneaker drops",
	manifest: "/manifest.webmanifest",
	appleWebApp: {
		capable: true,
		title: "Giraffe Lab",
		statusBarStyle: "black-translucent",
	},
	icons: {
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
		icon: [
			{ url: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
	themeColor: "#9b3f1c",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="giraffelab">
			<body className="bg-background font-sans text-on-surface antialiased">
				<AuthProvider>
					{children}
					<ToastProvider />
					<StoreHydrator />
				</AuthProvider>
			</body>
		</html>
	);
}

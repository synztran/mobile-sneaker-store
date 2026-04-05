import { StoreHydrator } from "@/components/ui/StoreHydrator";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Sneaker Lab",
	description: "Premium curated sneaker drops",
	// manifest: "/manifest.json",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: "#fbf9f5",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="sneakerlab">
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

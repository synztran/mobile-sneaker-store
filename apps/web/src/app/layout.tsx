import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Sneaker Lab",
	description: "Premium curated sneaker drops",
	manifest: "/manifest.json",
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
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
					rel="stylesheet"
				/>
			</head>
			<body className="bg-background font-sans text-on-surface antialiased">
				<AuthProvider>
					{children}
					<ToastProvider />
				</AuthProvider>
			</body>
		</html>
	);
}

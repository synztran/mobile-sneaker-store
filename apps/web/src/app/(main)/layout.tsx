import { CartDrawer } from "@/components/cart/CartDrawer";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<TopNav />
			<main className="mt-16 mb-32 min-h-screen">{children}</main>
			<BottomNav />
			<CartDrawer />
		</>
	);
}

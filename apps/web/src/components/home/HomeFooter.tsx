import Icon from "@/components/ui/Icon";
import Link from "next/link";

export function HomeFooter() {
	return (
		<footer className="bg-surface-container py-16 px-6">
			<div className="flex flex-col items-center mb-12">
				<h2 className="text-4xl font-black tracking-tight uppercase mb-8">
					Sneaker Lab
				</h2>
				<div className="flex gap-8">
					{(
						[
							{ icon: "share", label: "Share" },
							{ icon: "public", label: "Website" },
							{ icon: "contact_support", label: "Support" },
						] as const
					).map(({ icon, label }) => (
						<a
							key={icon}
							href="#"
							aria-label={label}
							className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-colors">
							<Icon name={icon} />
						</a>
					))}
				</div>
			</div>
			<div className="border-t border-outline-variant/30 pt-8 flex flex-col items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
				<div className="flex gap-6">
					<Link href="#">Privacy</Link>
					<Link href="#">Terms</Link>
					<Link href="#">Shipping</Link>
				</div>
				<p className="opacity-50">© 2024 Sneaker Lab Collective</p>
			</div>
		</footer>
	);
}

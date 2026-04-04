"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
	{
		href: "/checkout/shipping",
		icon: "local_shipping",
		label: "SHIPPING",
		step: 1,
	},
	{ href: "/checkout/payment", icon: "payments", label: "PAYMENT", step: 2 },
	{ href: "/checkout/review", icon: "rate_review", label: "REVIEW", step: 3 },
];

export default function CheckoutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const currentStep = steps.findIndex((s) =>
		pathname.includes(s.href.split("/").pop()!),
	);

	return (
		<div className="min-h-screen bg-background">
			{/* TopAppBar */}
			<nav className="fixed top-0 w-full z-50 glass-nav flex items-center justify-between px-6 py-4">
				<Link
					href="/"
					className="hover:opacity-70 transition-opacity active:scale-95 duration-200">
					<span className="material-symbols-outlined text-primary">
						arrow_back
					</span>
				</Link>
				<h1 className="font-sans font-bold tracking-tight uppercase text-lg text-on-surface">
					CHECKOUT
				</h1>
				<Link
					href="/shop"
					className="hover:opacity-70 transition-opacity active:scale-95 duration-200">
					<span className="material-symbols-outlined text-primary">
						shopping_bag
					</span>
				</Link>
			</nav>

			<main className="pt-20 pb-32 px-6 max-w-2xl mx-auto">
				{children}
			</main>

			{/* Bottom Step Nav */}
			<nav className="fixed bottom-0 left-0 w-full h-20 glass-nav flex justify-around items-center px-8 rounded-t-3xl z-50 shadow-float">
				{steps.map(({ href, icon, label, step }) => {
					const idx = step - 1;
					const isActive = pathname.includes(href.split("/").pop()!);
					const isPast = currentStep > idx;

					return (
						<Link
							key={href}
							href={isPast ? href : "#"}
							className={clsx(
								"flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all",
								isActive
									? "bg-primary text-white"
									: "text-on-surface/40",
							)}>
							<span className="material-symbols-outlined text-[20px]">
								{icon}
							</span>
							<span className="font-sans text-[10px] font-semibold uppercase tracking-widest mt-0.5">
								{label}
							</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}

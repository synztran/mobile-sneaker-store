"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/", icon: "home_app_logo", label: "HOME", iconFilled: true },
	{ href: "/shop", icon: "storefront", label: "SHOP", iconFilled: false },
	{ href: "/profile", icon: "person", label: "PROFILE", iconFilled: false },
];

export function BottomNav() {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 glass-nav rounded-t-3xl z-50 shadow-float">
			{navItems.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.href}
						href={item.href}
						className={clsx(
							"flex flex-col items-center justify-center rounded-2xl px-5 py-2 transition-all active:scale-90 duration-200",
							isActive
								? "text-primary bg-primary-fixed/30"
								: "text-on-surface opacity-50 hover:text-primary hover:opacity-100",
						)}>
						<span
							className={clsx(
								"material-symbols-outlined mb-1",
								isActive && item.iconFilled && "icon-filled",
							)}>
							{item.icon}
						</span>
						<span className="font-sans text-[10px] font-semibold uppercase tracking-widest">
							{item.label}
						</span>
					</Link>
				);
			})}
		</nav>
	);
}

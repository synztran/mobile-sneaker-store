"use client";

import clsx from "clsx";
import { House, ShoppingBasket, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/", icon: <House />, label: "Trang chủ", iconFilled: true },
	{
		href: "/shop",
		icon: <ShoppingBasket />,
		label: "Cửa hàng",
		iconFilled: false,
	},
	{
		href: "/profile",
		icon: <UserRound />,
		label: "Hồ sơ",
		iconFilled: false,
	},
];

export function BottomNav() {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 glass-nav !bg-[#fbf9f5ee] rounded-t-3xl z-50 bottom-nav-pad">
			{navItems.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.href}
						href={item.href}
						className={clsx(
							"flex flex-col items-center justify-center rounded-2xl px-5 py-2 transition-all active:scale-90 duration-200",
							isActive
								? "text-primary bg-primary-fixed/60"
								: "text-on-surface opacity-50 hover:text-primary hover:opacity-100",
						)}>
						{
							<div
								className={clsx(
									isActive &&
										item.iconFilled &&
										"icon-filled",
									"mb-1",
								)}>
								{item.icon}
							</div>
						}
						<span className="font-sans text-[10px] font-semibold uppercase tracking-widest">
							{item.label}
						</span>
					</Link>
				);
			})}
		</nav>
	);
}

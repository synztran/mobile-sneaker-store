"use client";

import { useCartStore } from "@/store";
import clsx from "clsx";
import Link from "next/link";

interface TopNavProps {
	title?: string;
	showBack?: boolean;
	backHref?: string;
	showCart?: boolean;
	showFavorite?: boolean;
	className?: string;
}

export function TopNav({
	title = "SNEAKER LAB",
	showBack = false,
	backHref = "/",
	showCart = true,
	showFavorite = false,
	className,
}: TopNavProps) {
	const { openCart, itemCount } = useCartStore();
	const count = itemCount();

	return (
		<nav
			className={clsx(
				"fixed top-0 w-full z-50 glass-nav flex justify-between items-center px-6 py-4",
				className,
			)}>
			<div className="flex items-center gap-4 w-10">
				{showBack ? (
					<Link
						href={backHref}
						className="text-on-surface hover:opacity-70 transition-opacity active:scale-95 duration-200">
						<span className="material-symbols-outlined text-primary">
							arrow_back
						</span>
					</Link>
				) : (
					<button className="text-on-surface hover:opacity-70 transition-opacity active:scale-95 duration-200">
						<span className="material-symbols-outlined">menu</span>
					</button>
				)}
			</div>

			<h1 className="text-xl font-black tracking-tighter text-on-surface font-sans">
				{title}
			</h1>

			<div className="flex items-center gap-4 w-10 justify-end">
				{showFavorite && (
					<button className="text-on-surface hover:opacity-70 transition-opacity active:scale-95 duration-200">
						<span className="material-symbols-outlined">
							favorite
						</span>
					</button>
				)}
				{showCart && (
					<button
						onClick={openCart}
						className="relative text-on-surface hover:opacity-70 transition-opacity active:scale-95 duration-200">
						<span className="material-symbols-outlined">
							shopping_cart
						</span>
						{count > 0 && (
							<span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
								{count}
							</span>
						)}
					</button>
				)}
			</div>
		</nav>
	);
}

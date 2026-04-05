"use client";

import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface TopNavDrawerProps {
	open: boolean;
	onClose: () => void;
}

export default function TopNavDrawer({ open, onClose }: TopNavDrawerProps) {
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (open) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", onKey);
			setTimeout(() => menuRef.current?.focus(), 0);
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<>
			<div className="fixed inset-0 bg-black/40 z-60" onClick={onClose} />

			<aside
				id="topnav-menu"
				ref={menuRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				className="fixed top-0 left-0 z-[51] h-full w-72 sm:w-80 bg-base-100 text-on-surface shadow-lg p-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold">Danh mục</h2>
					<button
						aria-label="Close menu"
						onClick={onClose}
						className="text-on-surface hover:opacity-70">
						<Icon name="close" />
					</button>
				</div>

				<nav className="mt-4">
					<ul className="flex flex-col gap-3">
						<li>
							<Link
								href="/"
								onClick={onClose}
								className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
								<Icon name="home" className="text-[18px]" />
								Trang chủ
							</Link>
						</li>
						<li>
							<Link
								href="/shop"
								onClick={onClose}
								className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
								<Icon
									name="shopping_bag"
									className="text-[18px]"
								/>
								Cửa hàng
							</Link>
						</li>
						<li>
							<Link
								href="/profile"
								onClick={onClose}
								className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
								<Icon name="person" className="text-[18px]" />
								Tài khoảng người dùng
							</Link>
						</li>
					</ul>
				</nav>
			</aside>
		</>
	);
}

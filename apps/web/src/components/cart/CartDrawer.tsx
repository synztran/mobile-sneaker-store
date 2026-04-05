"use client";

import Icon from "@/components/ui/Icon";
import { useIsMounted } from "@/hooks/useIsMounted";
import { formatVND } from "@/lib/currency";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export function CartDrawer() {
	const mounted = useIsMounted();
	const { items, isOpen, closeCart, updateQty, removeItem, total } =
		useCartStore();
	const subtotal = mounted ? total() : 0;
	const visibleItems = mounted ? items : [];
	const drawerOpen = mounted && isOpen;

	useEffect(() => {
		if (drawerOpen) {
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [drawerOpen]);

	return (
		<>
			<div
				className={`fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
					drawerOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={closeCart}
			/>

			{/* Drawer */}
			<div
				className={`fixed left-0 right-0 z-[999] bg-surface rounded-t-5xl max-h-[80vh] h-full flex flex-col transition-all duration-250 ease-out ${
					drawerOpen ? "top-[20vh]" : "top-[110vh]"
				}`}>
				{/* Handle */}
				<div className="flex justify-center pt-3 pb-2">
					<div className="w-10 h-1 bg-outline-variant rounded-full" />
				</div>

				{/* Header */}
				<div className="flex justify-between items-center px-6 py-4">
					<h2 className="text-xl font-black tracking-tight text-on-surface">
						Giỏ hàng của bạn
					</h2>
					<button
						onClick={closeCart}
						className="text-on-surface hover:opacity-70 transition-opacity active:scale-95">
						<Icon name="close" className="text-on-surface" />
					</button>
				</div>

				{/* Items */}
				<div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
					{visibleItems.length === 0 ? (
						<div className="text-center py-12">
							<Icon
								name="shopping_bag"
								className="text-5xl text-outline-variant"
							/>
							<p className="mt-3 text-on-surface-variant font-semibold">
								Giỏ hàng trống
							</p>
						</div>
					) : (
						visibleItems.map((item) => (
							<div
								key={`${item.product.id}-${item.size.id}-${item.color.id}`}
								className="flex gap-4 items-center bg-surface-container-low rounded-3xl p-3">
								<div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0">
									<Image
										src={item.product.images[0]}
										alt={item.product.name}
										fill
										className="object-contain p-2 mix-blend-darken"
										unoptimized
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-bold text-on-surface text-base leading-tight truncate">
										{item.product.name}
									</p>
									<p className="text-sm text-on-surface-variant font-semibold tracking-wide mt-0.5">
										Size: {item.size.label}
									</p>
									<div className="flex items-center justify-between mt-2">
										<div className="flex items-center gap-3 bg-surface-container rounded-full px-3 py-1.5">
											<button
												onClick={() =>
													updateQty(
														item.product.id,
														item.size.id,
														item.color.id,
														-1,
													)
												}
												className="text-on-surface font-bold text-base leading-none active:scale-90 transition-transform">
												−
											</button>
											<span className="text-sm font-bold text-on-surface w-4 text-center">
												{item.quantity}
											</span>
											<button
												onClick={() =>
													updateQty(
														item.product.id,
														item.size.id,
														item.color.id,
														1,
													)
												}
												className="text-on-surface font-bold text-base leading-none active:scale-90 transition-transform">
												+
											</button>
										</div>
										<p className="text-primary font-black">
											{formatVND(
												item.product.price *
													item.quantity,
											)}
										</p>
									</div>
								</div>
							</div>
						))
					)}

					{/* Sustainable packaging badge */}
					{visibleItems.length > 0 && (
						<div className="flex items-center gap-3 bg-secondary/10 rounded-2xl px-4 py-3">
							<Icon
								name="eco"
								className="text-secondary text-sm"
							/>
							<p className="text-secondary text-xs font-bold uppercase tracking-wider">
								Đơn hàng này được đóng gói thân thiện với môi
								trường.
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				{visibleItems.length > 0 && (
					<div className="px-6 py-4 border-t border-outline-variant/20 bg-surface">
						<div className="space-y-2 mb-4">
							<div className="flex justify-between">
								<span className="text-on-surface-variant text-sm">
									Tạm tính
								</span>
								<span className="font-semibold text-on-surface">
									{formatVND(subtotal)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-on-surface-variant text-sm">
									Phí vận chuyển dự kiến
								</span>
								<span className="font-semibold text-secondary">
									Miễn phí
								</span>
							</div>
							<div className="flex justify-between pt-2">
								<span className="font-bold text-on-surface">
									Tổng cộng
								</span>
								<span className="text-primary font-black text-xl">
									{formatVND(subtotal)}
								</span>
							</div>
						</div>

						<Link
							href="/checkout/shipping"
							onClick={closeCart}
							className="btn w-full primary-gradient text-white border-0 rounded-full normal-case font-bold tracking-widest uppercase py-4 h-auto text-base shadow-ambient-sm active:scale-[0.98] transition-transform">
							THANH TOÁN →
						</Link>
						<p className="text-center text-xs text-on-surface-variant mt-3 font-semibold uppercase tracking-widest">
							Thanh toán bảo mật & mã hóa
						</p>
					</div>
				)}
			</div>
		</>
	);
}

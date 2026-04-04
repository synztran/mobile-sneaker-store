"use client";

import { SHIPPING_COST, TAX_RATE } from "@/lib/data";
import { toast } from "@/lib/toast";
import { useCartStore, useCheckoutStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
	const router = useRouter();
	const { items, total, clearCart } = useCartStore();
	const { shipping } = useCheckoutStore();

	const subtotal = total();
	const shippingCost = shipping ? SHIPPING_COST[shipping.deliverySpeed] : 0;
	const tax = subtotal * TAX_RATE;
	const orderTotal = subtotal + shippingCost + tax;

	const handlePlaceOrder = async () => {
		toast.success("Order placed successfully! 🎉");
		clearCart();
		router.push("/");
	};

	return (
		<>
			{/* Header */}
			<header className="space-y-2 mb-8">
				<p className="text-primary font-semibold text-xs tracking-widest uppercase">
					Step 3 of 3
				</p>
				<h2 className="text-3xl font-extrabold tracking-tight text-on-surface leading-tight">
					Review &amp; Confirm
				</h2>
			</header>

			{/* Your Selection */}
			<section className="space-y-4 mb-6">
				<div className="flex justify-between items-end">
					<h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
						Your Selection
					</h3>
					<Link
						href="/shop"
						className="text-xs text-primary font-bold underline underline-offset-4">
						Edit Cart
					</Link>
				</div>

				{items.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-on-surface-variant">
							No items in cart
						</p>
					</div>
				) : (
					items.map((item) => (
						<div
							key={`${item.product.id}-${item.size}`}
							className="bg-surface-container-lowest rounded-xl p-4 flex gap-6 items-center shadow-ambient-sm overflow-hidden group">
							<div className="relative w-32 h-32 flex-shrink-0 bg-surface-container-low rounded-lg p-2">
								<div className="absolute inset-0 bg-primary-fixed/20 rounded-full blur-2xl scale-75" />
								<Image
									src={item.product.images[0]}
									alt={item.product.name}
									fill
									className="relative z-10 object-contain -rotate-12 group-hover:scale-110 transition-transform duration-500"
									unoptimized
								/>
							</div>
							<div className="flex-grow space-y-1">
								{item.product.isLimitedEdition && (
									<p className="text-xs font-bold text-primary tracking-widest uppercase">
										Limited Edition
									</p>
								)}
								<h4 className="text-xl font-bold tracking-tight text-on-surface">
									{item.product.name}
								</h4>
								<div className="flex gap-4 text-sm text-on-surface-variant">
									<span>
										Size:{" "}
										<strong className="text-on-surface">
											{item.size}
										</strong>
									</span>
									<span>
										Qty:{" "}
										<strong className="text-on-surface">
											{item.quantity}
										</strong>
									</span>
								</div>
								<p className="text-lg font-extrabold text-on-surface">
									$
									{(
										item.product.price * item.quantity
									).toFixed(2)}
								</p>
							</div>
						</div>
					))
				)}
			</section>

			{/* Info cards */}
			<div className="grid grid-cols-1 gap-4 mb-6">
				{/* Shipping */}
				<div className="bg-surface-container rounded-xl p-5 space-y-3">
					<div className="flex justify-between items-start">
						<span className="material-symbols-outlined text-primary">
							local_shipping
						</span>
						<Link href="/checkout/shipping">
							<span className="material-symbols-outlined text-outline-variant text-sm cursor-pointer">
								edit
							</span>
						</Link>
					</div>
					<div className="space-y-1">
						<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
							Shipping to
						</p>
						{shipping ? (
							<>
								<p className="text-sm font-bold text-on-surface">
									{shipping.fullName}
								</p>
								<p className="text-sm text-on-surface-variant leading-relaxed">
									{shipping.streetAddress}
									{shipping.apartment &&
										`, ${shipping.apartment}`}
									<br />
									{shipping.city}, {shipping.postalCode}
								</p>
							</>
						) : (
							<Link
								href="/checkout/shipping"
								className="text-sm text-primary font-semibold">
								Add shipping address →
							</Link>
						)}
					</div>
				</div>

				{/* Payment */}
				<div className="bg-surface-container rounded-xl p-5 space-y-3">
					<div className="flex justify-between items-start">
						<span className="material-symbols-outlined text-primary">
							qr_code_2
						</span>
						<Link href="/checkout/payment">
							<span className="material-symbols-outlined text-outline-variant text-sm cursor-pointer">
								edit
							</span>
						</Link>
					</div>
					<div className="space-y-1">
						<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
							Payment Method
						</p>
						<p className="text-sm font-bold text-on-surface">
							Digital Wallet / QR
						</p>
						<p className="text-sm text-on-surface-variant leading-relaxed">
							Verified Secure
						</p>
					</div>
				</div>
			</div>

			{/* Order Calculations */}
			<section className="bg-surface-container-low rounded-xl p-6 space-y-4 mb-6">
				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<span className="text-on-surface-variant text-sm">
							Subtotal
						</span>
						<span className="text-on-surface font-semibold">
							${subtotal.toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-on-surface-variant text-sm">
							{shipping?.deliverySpeed === "express"
								? "Express"
								: "Standard"}{" "}
							Shipping
						</span>
						<span className="text-on-surface font-semibold">
							{shippingCost === 0
								? "Free"
								: `$${shippingCost.toFixed(2)}`}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-on-surface-variant text-sm">
							Estimated Tax
						</span>
						<span className="text-on-surface font-semibold">
							${tax.toFixed(2)}
						</span>
					</div>
				</div>
				<div className="pt-4 border-t-2 border-outline-variant/20 flex justify-between items-center">
					<span className="text-on-surface font-bold text-lg">
						Order Total
					</span>
					<span className="text-2xl font-extrabold text-primary tracking-tight">
						${orderTotal.toFixed(2)}
					</span>
				</div>
			</section>

			{/* Place Order */}
			<button
				onClick={handlePlaceOrder}
				className="btn w-full primary-gradient text-white border-0 rounded-full normal-case font-bold text-lg h-auto py-5 shadow-ambient active:scale-95 transition-all flex items-center justify-center gap-3">
				<span>Place Order</span>
				<span className="material-symbols-outlined">arrow_forward</span>
			</button>
		</>
	);
}

"use client";

import type { ShopProduct } from "@/app/api/products/route";
import Icon from "@/components/ui/Icon";
import { formatVND } from "@/lib/currency";
import type { ColorOption, Product } from "@/lib/data";
import { toast } from "@/lib/toast";
import { useCartStore } from "@/store";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

interface QuickPickDrawerProps {
	product: ShopProduct | null;
	isOpen: boolean;
	onClose: () => void;
}

export function QuickPickDrawer({
	product,
	isOpen,
	onClose,
}: QuickPickDrawerProps) {
	const [selectedColorIdx, setSelectedColorIdx] = useState(0);
	const [selectedSize, setSelectedSize] = useState<number | null>(null);
	const { addItem, openCart } = useCartStore();

	// Reset selections whenever a new product is opened
	useEffect(() => {
		if (isOpen && product) {
			setSelectedColorIdx(0);
			setSelectedSize(null);
		}
	}, [isOpen, product?.id]);

	// Close on Escape
	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [isOpen, onClose]);

	const handleAdd = () => {
		if (!product) return;
		if (selectedSize === null) {
			toast.error("Please select a size");
			return;
		}

		const cartColor: ColorOption = product.colors[selectedColorIdx] ?? {
			color_value: "#000000",
			id: null,
			name: "Unknown",
		};

		const cartProduct: Product = {
			id: String(product.id),
			name: product.model_name,
			brand: product.brand,
			category: product.condition ?? "sneakers",
			price: product.min_price,
			originalPrice: product.retail_price ?? undefined,
			badge: product.badge ?? undefined,
			description: product.description ?? "",
			story: "",
			colors: product.colors,
			sizes: product.sizes,
			images:
				product.images.length > 0
					? product.images
					: ["/placeholder.jpg"],
			rating: 0,
			reviews: 0,
			inStock: product.sizes.some((s) => s.available),
		};

		const selectedSizeObj = product.sizes.find(
			(s) => s.id === selectedSize,
		);

		if (!selectedSizeObj) return;

		addItem(
			cartProduct,
			{
				gender: selectedSizeObj.gender,
				label: selectedSizeObj.label,
				id: selectedSizeObj.id,
			},
			cartColor,
		);
		onClose();
		openCart();
		toast.success(`${product.model_name} added to cart`);
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className={clsx(
					"fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[80] transition-opacity duration-300",
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none",
				)}
				onClick={onClose}
			/>

			{/* Drawer */}
			<div
				className={clsx(
					"fixed left-0 right-0 bottom-0 z-[90] bg-surface rounded-t-5xl flex flex-col transition-transform duration-300 ease-out",
					isOpen ? "translate-y-0" : "translate-y-full",
				)}>
				{/* Handle */}
				<div className="flex justify-center pt-3 pb-1">
					<div className="w-10 h-1 bg-outline-variant rounded-full" />
				</div>

				{product && (
					<div className="px-6 pt-3 pb-8 space-y-5 overflow-y-auto max-h-[85vh]">
						{/* Product summary */}
						<div className="flex items-center gap-4">
							<div className="w-20 h-20 rounded-2xl bg-surface-container flex-shrink-0 overflow-hidden flex items-center justify-center">
								{product.images[0] ? (
									<Image
										src={product.images[0]}
										alt={product.model_name}
										width={80}
										height={80}
										className="object-contain w-full h-full p-2 mix-blend-darken"
										unoptimized
									/>
								) : (
									<Icon
										name="image_not_supported"
										className="text-2xl text-outline-variant"
									/>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary leading-none mb-1">
									{product.brand}
								</p>
								<h3 className="text-base font-black text-on-surface uppercase leading-tight truncate">
									{product.model_name}
								</h3>
								<p className="text-sm font-extrabold text-on-surface mt-1">
									{formatVND(product.min_price)}
								</p>
							</div>
							<button
								onClick={onClose}
								className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center active:scale-90 transition-transform">
								<Icon
									name="close"
									className="text-[18px] text-on-surface"
								/>
							</button>
						</div>

						{/* Color selector */}
						{product.colors.length > 0 && (
							<section>
								<p className="text-[10px] font-black uppercase tracking-widest text-on-surface mb-3">
									Color{" "}
									<span className="normal-case font-medium text-on-surface-variant">
										—{" "}
										{product.colors[selectedColorIdx]?.name}
									</span>
								</p>
								<div className="flex gap-3 flex-wrap">
									{product.colors.map((c, i) => (
										<button
											key={c.name}
											title={c.name}
											onClick={() => {
												setSelectedColorIdx(i);
												setSelectedSize(null);
											}}
											className={clsx(
												"w-9 h-9 rounded-full border-4 transition-all",
												selectedColorIdx === i
													? "border-on-surface scale-110"
													: "border-transparent",
											)}
											style={{
												backgroundColor: c.color_value,
											}}
										/>
									))}
								</div>
							</section>
						)}

						{/* Size selector */}
						<section>
							<p className="text-[10px] font-black uppercase tracking-widest text-on-surface mb-3">
								Size (US)
							</p>
							<div className="grid grid-cols-4 gap-2">
								{product.sizes
									.slice()
									.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0))
									.map(({ id, label, available }) => (
										<button
											key={id}
											disabled={!available}
											onClick={() => setSelectedSize(id)}
											className={clsx(
												"py-3 rounded-2xl text-sm font-bold transition-all",
												!available &&
													"opacity-30 cursor-not-allowed line-through",
												selectedSize === id
													? "bg-primary text-white shadow-ambient-sm"
													: available
														? "bg-surface-container text-on-surface"
														: "bg-surface-container text-on-surface",
											)}>
											{label}
										</button>
									))}
							</div>
						</section>

						{/* CTA */}
						<button
							onClick={handleAdd}
							disabled={selectedSize === null}
							className={clsx(
								"w-full py-4 rounded-2xl font-bold text-base uppercase tracking-widest transition-all active:scale-[0.98]",
								selectedSize !== null
									? "primary-gradient text-white shadow-ambient-sm"
									: "bg-surface-container text-on-surface-variant cursor-not-allowed",
							)}>
							{selectedSize === null
								? "Select a Size"
								: "Add to Bag"}
						</button>
					</div>
				)}
			</div>
		</>
	);
}

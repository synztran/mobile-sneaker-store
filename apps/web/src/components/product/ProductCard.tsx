"use client";

import type { ShopProduct } from "@/app/api/products/route";
import { formatVND } from "@/lib/currency";
import type { ColorOption, Product } from "@/lib/data";
import { toast } from "@/lib/toast";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ─── Badge config ─────────────────────────────────────────────────────────────

const BADGE_STYLE: Record<string, string> = {
	NEW: "bg-primary text-on-primary",
	SALE: "bg-secondary text-on-secondary",
	LIMITED: "bg-on-surface text-surface",
};

const BADGE_LABEL: Record<string, string> = {
	NEW: "NEW",
	SALE: "SALE",
	LIMITED: "LIMITED",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ProductCardSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="aspect-[4/5] bg-surface-container rounded-xl mb-3" />
			<div className="space-y-1.5">
				<div className="h-2 w-1/3 bg-surface-container rounded-full" />
				<div className="h-3 w-4/5 bg-surface-container rounded-full" />
				<div className="h-3 w-2/5 bg-surface-container rounded-full" />
				<div className="flex gap-1.5 pt-1">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="w-3 h-3 rounded-full bg-surface-container"
						/>
					))}
				</div>
			</div>
		</div>
	);
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface ProductCardProps {
	product: ShopProduct;
}

export function ProductCard({ product }: ProductCardProps) {
	const [selectedColor, setSelectedColor] = useState(0);
	const addItem = useCartStore((s) => s.addItem);
	const openCart = useCartStore((s) => s.openCart);

	const handleAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const firstAvailableSize =
			product.sizes.find((s) => s.available) ?? product.sizes[0];
		const cartColor: ColorOption = product.colors[selectedColor] ?? {
			name: "Default",
			hex: "#9ca3af",
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

		addItem(cartProduct, firstAvailableSize?.size ?? 10, cartColor);
		openCart();
		toast.success(`${product.model_name} added to cart`);
	};

	return (
		<Link href={`/shop/${product.slug}`} className="group block">
			{/* ── Image box ─────────────────────────────────────────── */}
			<div
				className="relative aspect-[4/5] bg-surface-container rounded-xl mb-3 overflow-hidden"
				style={{
					boxShadow: "0 20px 40px -15px rgba(155,63,28,0.08)",
				}}>
				{/* Badge */}
				{product.badge && (
					<span
						className={`absolute top-3 left-3 z-10 text-[10px] font-black px-2.5 py-1 rounded tracking-tighter ${BADGE_STYLE[product.badge] ?? "bg-primary text-on-primary"}`}>
						{BADGE_LABEL[product.badge] ?? product.badge}
					</span>
				)}

				{/* Aura — appears on hover */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="w-32 h-32 bg-primary-fixed/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
				</div>

				{/* Product image */}
				{product.images[0] ? (
					<div className="absolute inset-0 flex items-center justify-center p-4">
						<Image
							src={product.images[0]}
							alt={product.model_name}
							fill
							className="object-contain p-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out z-10 mix-blend-darken  "
							unoptimized
						/>
					</div>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="material-symbols-outlined text-4xl text-outline-variant">
							image_not_supported
						</span>
					</div>
				)}

				{/* Quick-add button — appears on hover */}
				<button
					onClick={handleAdd}
					aria-label={`Add ${product.model_name} to cart`}
					className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-on-surface text-surface flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 shadow-lg active:scale-90">
					<span className="material-symbols-outlined text-[18px]">
						add_shopping_cart
					</span>
				</button>
			</div>

			{/* ── Details — outside the box ─────────────────────────── */}
			<div className="space-y-1">
				{/* Brand / series */}
				<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary leading-none">
					{product.brand}
				</p>

				{/* Name */}
				<h3 className="text-sm font-bold leading-tight text-on-surface uppercase">
					{product.model_name}
				</h3>

				{/* Price */}
				<div className="flex items-baseline gap-2 pt-0.5">
					<span className="text-sm font-extrabold text-on-surface">
						{formatVND(product.min_price)}
					</span>
					{product.retail_price &&
						product.retail_price > product.min_price && (
							<span className="text-[11px] text-outline line-through">
								{formatVND(product.retail_price)}
							</span>
						)}
				</div>

				{/* Color swatches */}
				<div className="flex gap-1.5 pt-1.5">
					{product.colors.slice(0, 4).map((c, i) => (
						<button
							key={c.name}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setSelectedColor(i);
							}}
							title={c.name}
							className={`w-3 h-3 rounded-full border transition-all duration-150 ${
								i === selectedColor
									? "ring-1 ring-offset-2 ring-on-surface scale-110"
									: "border-outline-variant hover:scale-110"
							}`}
							style={{ backgroundColor: c.hex }}
						/>
					))}
					{product.colors.length > 4 && (
						<span className="text-[9px] font-semibold text-outline self-center">
							+{product.colors.length - 4}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}

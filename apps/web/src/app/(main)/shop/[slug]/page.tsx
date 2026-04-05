"use client";

import type { ProductDetail } from "@/app/api/products/[slug]/route";
import { TopNav } from "@/components/layout/TopNav";
import Icon from "@/components/ui/Icon";
import { formatVND } from "@/lib/currency";
import type { ColorOption, Product } from "@/lib/data";
import { toast } from "@/lib/toast";
import { useCartStore } from "@/store";
import clsx from "clsx";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use, useEffect, useMemo, useRef, useState } from "react";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
	return (
		<>
			<TopNav showBack backHref="/shop" showCart showFavorite />
			<main className="pt-20 pb-32 animate-pulse">
				<div className="mx-6 mb-10 aspect-square bg-surface-container rounded-5xl" />
				<div className="px-6 space-y-8">
					<div className="space-y-3">
						<div className="h-2 w-1/4 bg-surface-container rounded-full" />
						<div className="h-10 w-4/5 bg-surface-container rounded-full" />
						<div className="h-8 w-1/3 bg-surface-container rounded-full" />
					</div>
					<div className="flex gap-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="w-10 h-10 rounded-full bg-surface-container"
							/>
						))}
					</div>
					<div className="grid grid-cols-4 gap-3">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<div
								key={i}
								className="h-14 rounded-2xl bg-surface-container"
							/>
						))}
					</div>
				</div>
			</main>
		</>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage({
	params: paramsPromise,
}: {
	params: Promise<{ slug: string }>;
}) {
	const params = use(paramsPromise);
	const [product, setProduct] = useState<ProductDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [notFoundState, setNotFoundState] = useState(false);

	const [selectedColor, setSelectedColor] = useState<{
		name: string;
		color_value: string;
		id: number | null;
	} | null>(null);
	const [selectedSize, setSelectedSize] = useState<{
		label: string;
		id: number | null;
		gender: string | null;
	} | null>(null);
	const [activeImage, setActiveImage] = useState(0);
	const [saved, setSaved] = useState(false);
	const touchStartX = useRef<number | null>(null);

	const { addItem, openCart } = useCartStore();

	// Variants available for the selected color
	const variantsForColor = useMemo(
		() =>
			product && selectedColor
				? product.variants.filter(
						(v) => v.color?.id === selectedColor.id,
					)
				: (product?.variants ?? []),
		[product, selectedColor],
	);

	// Unique sizes for the selected color, sorted by id
	const sizesForColor = useMemo(
		() =>
			variantsForColor
				.reduce<
					{
						label: string | null;
						available: boolean;
						gender: string | null;
						id: number | null;
					}[]
				>((acc, v) => {
					if (!acc.find((a) => a.id === v.size.id)) {
						acc.push({
							label: v.size.label || null,
							available: v.stock_quantity > 0,
							gender: v.size.gender,
							id: v.size.id,
						});
					}
					return acc;
				}, [])
				.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)),
		[variantsForColor],
	);

	useEffect(() => {
		async function fetchProduct() {
			try {
				const res = await fetch(`/api/products/${params.slug}`, {
					cache: "no-store",
				});
				if (res.status === 404) {
					setNotFoundState(true);
					return;
				}
				if (!res.ok) throw new Error("Failed to load product");
				const data: ProductDetail = await res.json();
				setProduct(data);
				setSelectedColor(data.colors[0] ?? null);
			} catch {
				setNotFoundState(true);
			} finally {
				setLoading(false);
			}
		}
		fetchProduct();
	}, [params.slug]);

	if (loading) return <ProductDetailSkeleton />;
	if (notFoundState) notFound();
	if (!product) return null;

	// Price to display: selected size variant price, or min price
	const displayVariant =
		selectedSize !== null
			? variantsForColor.find((v) => v.size?.id === selectedSize.id)
			: null;
	const displayPrice = displayVariant?.price ?? product.min_price;

	const handleAddToCart = () => {
		if (!selectedSize) {
			toast.error("Vui lòng chọn cỡ");
			return;
		}

		const colorObj = product.colors.find(
			(c) => c.id === selectedColor?.id,
		) ?? {
			name: "Default",
			color_value: "#9ca3af",
			id: null,
		};

		const cartColor: ColorOption = colorObj;
		const cartProduct: Product = {
			id: String(product.id),
			name: product.model_name,
			brand: product.brand,
			category: product.condition ?? "sneakers",
			price: displayPrice,
			originalPrice: product.retail_price ?? undefined,
			badge: product.badge ?? undefined,
			description: product.description ?? "",
			story: "",
			colors: product.colors,
			sizes: product.sizes.map((s) => ({
				id: s.id,
				label: s.name,
				available: s.available,
				gender: s.gender,
			})),
			images:
				product.images.length > 0
					? product.images.map((i) => i.url)
					: ["/placeholder.jpg"],
			rating: 0,
			reviews: 0,
			inStock: product.sizes.some((s) => s.available),
		};

		addItem(
			cartProduct,
			{
				label: selectedSize.label,
				id: selectedSize.id,
				gender: selectedSize?.gender || "",
			},
			{
				name: cartColor.name,
				color_value: cartColor.color_value,
				id: cartColor.id,
			},
		);
		toast.success("Đã thêm vào giỏ!");
		openCart();
	};

	const heroImages =
		product.images.length > 0
			? product.images.map((i) => i.url)
			: ["/placeholder.jpg"];

	return (
		<>
			<TopNav showBack backHref="/shop" showCart showFavorite />

			<main className="my-auto">
				{/* Product Hero Carousel */}
				<section className="relative mx-6 mb-10 overflow-hidden rounded-5xl bg-gradient-to-b from-surface-container-low to-surface-container shadow-ambient-sm">
					<div
						className="relative overflow-hidden"
						onTouchStart={(e) => {
							touchStartX.current = e.touches[0].clientX;
						}}
						onTouchEnd={(e) => {
							if (touchStartX.current === null) return;
							const delta =
								touchStartX.current -
								e.changedTouches[0].clientX;
							if (Math.abs(delta) > 40) {
								if (delta > 0)
									setActiveImage((p) =>
										Math.min(p + 1, heroImages.length - 1),
									);
								else setActiveImage((p) => Math.max(p - 1, 0));
							}
							touchStartX.current = null;
						}}>
						<div
							className="flex w-full transition-transform duration-500 bg-surface-container relative"
							style={{
								transform: `translateX(-${activeImage * 100}%)`,
							}}>
							{heroImages.map((img, i) => (
								<div
									key={i}
									className="min-w-full p-10 flex items-center justify-center relative bg-surface-container">
									<Image
										src={img}
										alt={`${product.model_name} view ${i + 1}`}
										width={360}
										height={360}
										className="z-10 w-full h-[360px] object-contain mix-blend-darken"
										priority={i === 0}
										unoptimized
									/>
								</div>
							))}
						</div>
					</div>

					{/* Indicators */}
					{heroImages.length > 1 && (
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
							{heroImages.map((_, i) => (
								<button
									key={i}
									onClick={() => setActiveImage(i)}
									className={clsx(
										"h-1.5 rounded-full transition-all",
										i === activeImage
											? "w-8 bg-primary-action"
											: "w-2.5 bg-gray-300",
									)}
								/>
							))}
						</div>
					)}
				</section>

				{/* Product Info */}
				<div className="px-6 space-y-8">
					{/* Header */}
					<header>
						<div className="flex justify-between items-start mb-3">
							<span className="text-primary-action font-black text-[10px] uppercase tracking-[0.25em]">
								{product.badge === "LIMITED"
									? "Phiên bản giới hạn"
									: (product.condition ?? "Giày thể thao")}
							</span>
							{product.badge && (
								<span
									className={clsx(
										"text-[10px] font-black px-2.5 py-1 rounded tracking-tighter",
										product.badge === "LIMITED" &&
											"bg-on-surface text-surface",
										product.badge === "NEW" &&
											"bg-primary text-on-primary",
										product.badge === "SALE" &&
											"bg-secondary text-on-secondary",
									)}>
									{product.badge}
								</span>
							)}
						</div>
						<h1 className="text-2xl font-black leading-[1.1] tracking-tighter text-on-surface mb-1 uppercase">
							{product.model_name}
						</h1>
						<p className="text-sm font-bold text-primary mb-4">
							{product.brand}
						</p>
						<div className="flex items-center gap-4">
							<span className="text-3xl font-black text-on-surface">
								{formatVND(displayPrice)}
							</span>
							{product.retail_price &&
								product.retail_price > displayPrice && (
									<span className="text-lg text-outline line-through">
										{formatVND(product.retail_price)}
									</span>
								)}
						</div>
					</header>

					{/* Color selector */}
					{product.colors.length > 0 && (
						<section>
							<h3 className="text-xs font-black text-on-surface uppercase tracking-widest mb-4">
								Chọn màu sắc{" "}
								{selectedColor && (
									<span className="normal-case font-medium text-on-surface-variant ml-1">
										— {selectedColor.name}
									</span>
								)}
							</h3>
							<div className="flex gap-4">
								{product.colors.map((color) => (
									<button
										key={color.name}
										onClick={() => {
											setSelectedColor(color);
											setSelectedSize(null);
										}}
										title={color.name}
										className={clsx(
											"w-8 h-8 rounded-full border-2 transition-all",
											selectedColor === color
												? "border-on-surface scale-110"
												: "border-transparent",
										)}
										style={{
											backgroundColor: color.color_value,
										}}
									/>
								))}
							</div>
						</section>
					)}

					{/* Size selector */}
					<section>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xs font-black text-on-surface uppercase tracking-widest">
								Chọn cỡ (US)
							</h3>
							<button className="text-primary font-black text-xs uppercase tracking-widest">
								Hướng dẫn cỡ
							</button>
						</div>
						<div className="grid grid-cols-4 gap-3">
							{sizesForColor.map((size) => (
								<button
									key={size.id}
									disabled={!size.available}
									onClick={() =>
										setSelectedSize({
											label: size?.label || "",
											id: size?.id,
											gender: size.gender,
										})
									}
									className={clsx(
										"py-4 rounded-2xl text-sm font-bold transition-all",
										!size.available &&
											"opacity-30 cursor-not-allowed line-through",
										selectedSize?.id === size.id
											? "bg-primary text-white shadow-ambient-sm"
											: size.available
												? "bg-surface-container text-on-surface hover:bg-surface-container-high"
												: "bg-surface-container text-on-surface",
									)}>
									{size.label}
								</button>
							))}
						</div>
					</section>

					{/* Description */}
					{product.description && (
						<section className="bg-surface-container-low rounded-3xl p-6">
							<h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">
								Về sản phẩm này
							</h3>
							<p className="text-on-surface text-sm leading-relaxed">
								{product.description}
							</p>
						</section>
					)}

					{/* Release info */}
					{(product.release_date || product.condition) && (
						<div className="grid grid-cols-2 gap-4">
							{product.condition && (
								<div className="flex items-center gap-3">
									<Icon
										name="verified"
										className="text-secondary text-2xl"
									/>
									<div>
										<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
											Tình trạng
										</p>
										<p className="font-bold text-on-surface text-sm capitalize">
											{product.condition}
										</p>
									</div>
								</div>
							)}
							{product.release_date && (
								<div className="flex items-center gap-3">
									<Icon
										name="calendar_month"
										className="text-tertiary text-2xl"
									/>
									<div>
										<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
											Ngày ra mắt
										</p>
										<p className="font-bold text-on-surface text-sm">
											{new Date(
												product.release_date,
											).toLocaleDateString("vi-VN")}
										</p>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</main>

			{/* Bottom Action Bar */}
			<div className="fixed bottom-0 left-0 right-0 z-[100] px-6 py-4 bg-gray-50 rounded-tr-2xl rounded-tl-2xl border-outline-variant/20 flex gap-4">
				<button
					onClick={() => setSaved(!saved)}
					className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
					<Icon
						name="bookmark"
						className={clsx(
							"text-2xl",
							saved && "icon-filled text-primary",
						)}
					/>
				</button>
				<button
					onClick={handleAddToCart}
					className="flex-1 btn primary-gradient text-white border-0 rounded-2xl normal-case font-bold text-base h-auto py-4 active:scale-[0.98] transition-transform shadow-ambient-sm">
					<Icon name="shopping_bag" className="text-xl mr-2" />
					THÊM VÀO GIỎ
				</button>
			</div>
		</>
	);
}

"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

const BRANDS = ["Nike", "Adidas", "New Balance", "Puma", "Jordan", "Reebok"];
const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13];
const COLORS = [
	{ name: "Black", hex: "#1a1a1a" },
	{ name: "White", hex: "#ffffff" },
	{ name: "Grey", hex: "#9ca3af" },
	{ name: "Red", hex: "#ef4444" },
	{ name: "Blue", hex: "#3b82f6" },
	{ name: "Green", hex: "#22c55e" },
	{ name: "Yellow", hex: "#eab308" },
];

export interface FilterState {
	brand: string | null;
	sizes: number[];
	color: string | null;
	priceMin: number;
	priceMax: number;
}

const DEFAULT_FILTER_STATE: FilterState = {
	brand: null,
	sizes: [],
	color: null,
	priceMin: 0,
	priceMax: 500,
};

interface FilterOverlayProps {
	onClose: () => void;
	onApply?: (state: FilterState) => void;
	initialState?: Partial<FilterState>;
}

export function FilterOverlay({
	onClose,
	onApply,
	initialState,
}: FilterOverlayProps) {
	const init = { ...DEFAULT_FILTER_STATE, ...initialState };
	const [selectedBrand, setSelectedBrand] = useState<string | null>(
		init.brand,
	);
	const [selectedSizes, setSelectedSizes] = useState<number[]>(init.sizes);
	const [selectedColor, setSelectedColor] = useState<string | null>(
		init.color,
	);
	const [priceMin, setPriceMin] = useState(init.priceMin);
	const [priceMax, setPriceMax] = useState(Math.min(init.priceMax, 500));

	// Lock body scroll while overlay is mounted
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	const toggleSize = (size: number) => {
		setSelectedSizes((prev) =>
			prev.includes(size)
				? prev.filter((s) => s !== size)
				: [...prev, size],
		);
	};

	return (
		<>
			<div
				className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-[60]"
				onClick={onClose}
			/>
			<div className="fixed inset-x-4 top-16 bottom-4 z-[70] bg-white rounded-3xl overflow-y-auto shadow-2xl hide-scrollbar">
				{/* Header */}
				<div className="sticky top-0 bg-white flex justify-between items-center px-6 py-5 border-b border-outline-variant/20">
					<h2 className="text-xl font-black text-on-surface">
						Filter Sneakers
					</h2>
					<button
						onClick={onClose}
						className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
						<span className="material-symbols-outlined text-on-surface text-xl">
							close
						</span>
					</button>
				</div>

				<div className="px-6 py-4 space-y-8 pb-24">
					{/* Brand */}
					<section>
						<h3 className="font-black text-on-surface text-base mb-4">
							Brand
						</h3>
						<div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
							{BRANDS.map((brand) => (
								<button
									key={brand}
									onClick={() =>
										setSelectedBrand(
											brand === selectedBrand
												? null
												: brand,
										)
									}
									className={clsx(
										"flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
										selectedBrand === brand
											? "bg-primary/10 ring-2 ring-primary"
											: "bg-surface-container-low",
									)}>
									<span className="text-xs font-bold text-on-surface">
										{brand}
									</span>
								</button>
							))}
						</div>
					</section>

					<div className="h-px bg-outline-variant/30" />

					{/* Price Range */}
					<section>
						<h3 className="font-black text-on-surface text-base mb-4">
							Price Range
						</h3>
						<div className="space-y-4">
							<input
								type="range"
								min={0}
								max={500}
								value={priceMax}
								onChange={(e) =>
									setPriceMax(Number(e.target.value))
								}
								className="range range-xs range-primary w-full"
							/>
							<div className="flex gap-4">
								<div className="flex-1">
									<p className="text-xs text-outline mb-1 font-semibold">
										Min
									</p>
									<div className="border border-outline-variant rounded-xl px-4 py-2">
										<span className="font-bold text-on-surface">
											${priceMin}
										</span>
									</div>
								</div>
								<div className="flex-1">
									<p className="text-xs text-outline mb-1 font-semibold">
										Max
									</p>
									<div className="border border-outline-variant rounded-xl px-4 py-2">
										<span className="font-bold text-on-surface">
											${priceMax}
										</span>
									</div>
								</div>
							</div>
						</div>
					</section>

					<div className="h-px bg-outline-variant/30" />

					{/* Size */}
					<section>
						<h3 className="font-black text-on-surface text-base mb-4">
							Size
						</h3>
						<div className="grid grid-cols-6 gap-2">
							{SIZES.map((size) => (
								<button
									key={size}
									onClick={() => toggleSize(size)}
									className={clsx(
										"py-2.5 rounded-xl text-sm font-bold transition-all",
										selectedSizes.includes(size)
											? "bg-on-surface text-surface ring-2 ring-on-surface"
											: "bg-surface-container text-on-surface",
									)}>
									{size}
								</button>
							))}
						</div>
					</section>

					<div className="h-px bg-outline-variant/30" />

					{/* Color */}
					<section>
						<h3 className="font-black text-on-surface text-base mb-4">
							Color
						</h3>
						<div className="flex flex-wrap gap-4">
							{COLORS.map((color) => (
								<button
									key={color.name}
									onClick={() =>
										setSelectedColor(
											selectedColor === color.name
												? null
												: color.name,
										)
									}
									className="flex flex-col items-center gap-2">
									<div
										className={clsx(
											"w-10 h-10 rounded-full border-2 transition-all",
											selectedColor === color.name
												? "border-on-surface ring-2 ring-on-surface ring-offset-2"
												: "border-outline-variant",
										)}
										style={{ backgroundColor: color.hex }}
									/>
									<span className="text-[10px] font-semibold text-on-surface-variant">
										{color.name}
									</span>
								</button>
							))}
						</div>
					</section>
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 bg-white border-t border-outline-variant/20 flex items-center justify-between px-6 py-4">
					<button
						onClick={() => {
							setSelectedBrand(null);
							setSelectedSizes([]);
							setSelectedColor(null);
							setPriceMin(0);
							setPriceMax(500);
						}}
						className="font-bold text-on-surface text-sm">
						Reset All
					</button>
					<button
						onClick={() => {
							onApply?.({
								brand: selectedBrand,
								sizes: selectedSizes,
								color: selectedColor,
								priceMin,
								priceMax,
							});
							onClose();
						}}
						className="btn primary-gradient text-white border-0 rounded-2xl normal-case font-bold px-8 py-3 h-auto">
						Apply Filters
					</button>
				</div>
			</div>
		</>
	);
}

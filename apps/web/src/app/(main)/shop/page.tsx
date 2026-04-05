"use client";

import type { ShopProduct, SortOption } from "@/app/api/products/route";
import {
	FilterOverlay,
	type FilterState,
} from "@/components/product/FilterOverlay";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/components/product/ProductCard";
import Icon from "@/components/ui/Icon";
import { formatVND } from "@/lib/currency";
import { ArrowDown01, ArrowDown10, CalendarArrowUp } from "lucide-react";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

// ─── Sort sheet ───────────────────────────────────────────────────────────────

const SORT_OPTIONS: {
	value: SortOption;
	label: string;
	icon: string | ReactElement;
}[] = [
	{ value: "newest", label: "Mới nhất", icon: <CalendarArrowUp size={16} /> },
	{
		value: "price_asc",
		label: "Giá: Thấp đến Cao",
		icon: <ArrowDown01 size={16} />,
	},
	{
		value: "price_desc",
		label: "Giá: Cao đến Thấp",
		icon: <ArrowDown10 size={16} />,
	},
];

function SortSheet({
	current,
	onSelect,
	onClose,
}: {
	current: SortOption;
	onSelect: (v: SortOption) => void;
	onClose: () => void;
}) {
	return (
		<>
			<div
				className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-[60]"
				onClick={onClose}
			/>
			<div className="fixed inset-x-4 bottom-4 z-[70] bg-white rounded-3xl shadow-2xl overflow-hidden">
				<div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/20">
					<h2 className="text-lg font-black text-on-surface">
						Sắp xếp theo
					</h2>
					<button
						onClick={onClose}
						className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
						<Icon
							name="close"
							className="text-on-surface text-xl"
						/>
					</button>
				</div>
				<div className="p-4 space-y-2 pb-8">
					{SORT_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							onClick={() => {
								onSelect(opt.value);
								onClose();
							}}
							className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors ${
								current === opt.value
									? "bg-primary/10 text-primary"
									: "bg-surface-container-low text-on-surface hover:bg-surface-container"
							}`}>
							{typeof opt.icon === "string" ? (
								<Icon name={opt.icon} className="text-xl" />
							) : (
								opt.icon
							)}
							<span className="font-bold text-sm">
								{opt.label}
							</span>
							{current === opt.value && (
								<Icon
									name="check_circle"
									className="text-primary ml-auto text-xl"
								/>
							)}
						</button>
					))}
				</div>
			</div>
		</>
	);
}

// ─── Active filter pills ──────────────────────────────────────────────────────

function ActiveFilterPills({
	filters,
	onClear,
}: {
	filters: FilterState;
	onClear: () => void;
}) {
	const pills: string[] = [];
	if (filters.brand) pills.push(filters.brand);
	if (filters.color) pills.push(filters.color);
	if (filters.sizes.length > 0)
		pills.push(`Sizes: ${filters.sizes.join(", ")}`);
	if (filters.priceMin > 0 || filters.priceMax < 500)
		pills.push(
			`${formatVND(filters.priceMin)} – ${formatVND(filters.priceMax)}`,
		);

	if (pills.length === 0) return null;

	return (
		<div className="flex items-center gap-2 flex-wrap mb-4">
			{pills.map((p) => (
				<span
					key={p}
					className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wide">
					{p}
				</span>
			))}
			<button
				onClick={onClear}
				className="text-[10px] font-bold text-outline underline">
				Xóa tất cả
			</button>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: FilterState = {
	brand: null,
	sizes: [],
	color: null,
	priceMin: 0,
	priceMax: 500,
};

export default function ShopPage() {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [sort, setSort] = useState<SortOption>("newest");
	const [activeFilters, setActiveFilters] =
		useState<FilterState>(DEFAULT_FILTERS);
	const [showFilter, setShowFilter] = useState(false);
	const [showSort, setShowSort] = useState(false);

	// Lock body scroll whenever any overlay is open
	useEffect(() => {
		const isOpen = showFilter || showSort;
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [showFilter, showSort]);

	const [products, setProducts] = useState<ShopProduct[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const filterApplied =
		activeFilters.brand !== null ||
		activeFilters.color !== null ||
		activeFilters.sizes.length > 0 ||
		activeFilters.priceMin > 0 ||
		activeFilters.priceMax < 500;

	// Debounce search input
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(
			() => setDebouncedSearch(search),
			search ? 400 : 0,
		);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [search]);

	// Fetch products whenever query params change
	const fetchProducts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			console.log("init fetch product");
			const params = new URLSearchParams();
			if (debouncedSearch) params.set("search", debouncedSearch);
			if (sort !== "newest") params.set("sort", sort);
			if (activeFilters.brand) params.set("brand", activeFilters.brand);
			if (activeFilters.color) params.set("color", activeFilters.color);
			if (activeFilters.sizes.length > 0)
				params.set("sizes", activeFilters.sizes.join(","));
			if (activeFilters.priceMin > 0)
				params.set("priceMin", String(activeFilters.priceMin));
			if (activeFilters.priceMax < 500)
				params.set("priceMax", String(activeFilters.priceMax));

			console.log("params", params.toString());

			const res = await fetch(`/api/products?${params.toString()}`, {
				cache: "no-store",
			});
			console.log("Res", res);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			setProducts(data.products ?? []);
			setTotal(data.total ?? 0);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Không thể tải sản phẩm");
		} finally {
			setLoading(false);
		}
	}, [debouncedSearch, sort, activeFilters]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const sortLabel =
		SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";

	return (
		<>
			<div className="px-4 py-4 ">
				<div className="flex items-center gap-3 bg-surface-container rounded-full px-3 py-3.5 mb-6">
					<Icon name="search" className="text-outline" />
					<input
						type="search"
						placeholder="Tìm kiếm sản phẩm..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-medium outline-none"
					/>
					{search && (
						<button
							onClick={() => setSearch("")}
							className="text-outline">
							<Icon name="close" className="text-sm" />
						</button>
					)}
				</div>

				{/* Header with filter/sort */}
				<div className="flex justify-between items-center mb-4">
					<div>
						<p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
							Bộ sưu tập
						</p>
						<h2 className="text-2xl font-black tracking-tighter">
							{loading ? (
								<span className="inline-block w-20 h-7 bg-surface-container rounded-full animate-pulse" />
							) : (
								`${total} kết quả`
							)}
						</h2>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => setShowFilter(true)}
							className={`flex items-center gap-2 rounded-full px-4 py-2.5 font-bold text-xs transition-colors ${
								filterApplied
									? "bg-primary text-on-primary"
									: "bg-surface-container text-on-surface"
							}`}>
							<Icon name="tune" className="text-base" />
							Lọc
						</button>
						<button
							onClick={() => setShowSort(true)}
							className="flex items-center gap-2 primary-gradient text-white rounded-full px-4 py-2.5 font-bold text-xs">
							{SORT_OPTIONS.find((o) => o.value === sort)
								?.icon ?? (
								<Icon name="sort" className="text-sm" />
							)}
							Sắp xếp
						</button>
					</div>
				</div>

				{/* Active filter pills */}
				{filterApplied && (
					<ActiveFilterPills
						filters={activeFilters}
						onClear={() => setActiveFilters(DEFAULT_FILTERS)}
					/>
				)}

				{/* Error state */}
				{error && (
					<div className="text-center py-8">
						<Icon
							name="error_outline"
							className="text-4xl text-error"
						/>
						<p className="mt-2 text-on-surface-variant font-semibold">
							{error}
						</p>
						<button
							onClick={fetchProducts}
							className="mt-3 text-primary font-bold text-sm underline">
							Try again
						</button>
					</div>
				)}

				{/* Product grid */}
				{!error && (
					<div className="grid grid-cols-2 gap-x-4 gap-y-8">
						{loading
							? Array.from({ length: 6 }).map((_, i) => (
									<ProductCardSkeleton key={i} />
								))
							: products.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
									/>
								))}
					</div>
				)}

				{!loading && !error && products.length === 0 && (
					<div className="flex justify-center items-center text-center py-16 gap-4">
						<Icon
							name="search_off"
							className="text-2xl text-outline-variant"
						/>
						<p className="text-on-surface-variant font-semibold">
							Không tìm thấy sản phẩm phù hợp
						</p>
					</div>
				)}
			</div>

			{showFilter && (
				<FilterOverlay
					onClose={() => setShowFilter(false)}
					onApply={(state) => setActiveFilters(state)}
					initialState={activeFilters}
				/>
			)}

			{showSort && (
				<SortSheet
					current={sort}
					onSelect={setSort}
					onClose={() => setShowSort(false)}
				/>
			)}
		</>
	);
}

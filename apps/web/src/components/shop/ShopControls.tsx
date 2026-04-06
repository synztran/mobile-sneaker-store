"use client";

import type { SortOption } from "@/app/api/products/route";
import {
	FilterOverlay,
	type FilterState,
} from "@/components/product/FilterOverlay";
import Icon from "@/components/ui/Icon";
import { ArrowDown01, ArrowDown10, CalendarArrowUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactElement, useEffect, useRef, useState } from "react";

// ─── Sort options ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS: {
	value: SortOption;
	label: string;
	icon: ReactElement;
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

// ─── Sort sheet ───────────────────────────────────────────────────────────────

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
							{opt.icon}
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

// ─── Controls ─────────────────────────────────────────────────────────────────

export function ShopControls({ total }: { total: number }) {
	const router = useRouter();
	const sp = useSearchParams();

	const [search, setSearch] = useState(sp.get("search") ?? "");
	const [sort, setSort] = useState<SortOption>(
		(sp.get("sort") as SortOption) ?? "newest",
	);
	const [filters, setFilters] = useState<FilterState>({
		brand: sp.get("brand") ?? null,
		color: sp.get("color") ?? null,
		sizes: sp.get("sizes") ? sp.get("sizes")!.split(",").map(Number) : [],
		priceMin: Number(sp.get("priceMin") ?? 0),
		priceMax: Number(sp.get("priceMax") ?? 500),
	});
	const [showFilter, setShowFilter] = useState(false);
	const [showSort, setShowSort] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Push all state to URL — server re-renders with new data
	const pushParams = (
		newSearch: string,
		newSort: SortOption,
		newFilters: FilterState,
	) => {
		const params = new URLSearchParams();
		if (newSearch) params.set("search", newSearch);
		if (newSort !== "newest") params.set("sort", newSort);
		if (newFilters.brand) params.set("brand", newFilters.brand);
		if (newFilters.color) params.set("color", newFilters.color);
		if (newFilters.sizes.length > 0)
			params.set("sizes", newFilters.sizes.join(","));
		if (newFilters.priceMin > 0)
			params.set("priceMin", String(newFilters.priceMin));
		if (newFilters.priceMax < 500)
			params.set("priceMax", String(newFilters.priceMax));
		router.push(`/shop?${params.toString()}`);
	};

	// Debounced search
	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(
			() => pushParams(search, sort, filters),
			search ? 400 : 0,
		);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	const handleSort = (v: SortOption) => {
		setSort(v);
		pushParams(search, v, filters);
	};

	const handleApplyFilter = (state: FilterState) => {
		setFilters(state);
		pushParams(search, sort, state);
	};

	const handleClearFilters = () => {
		const cleared: FilterState = {
			brand: null,
			sizes: [],
			color: null,
			priceMin: 0,
			priceMax: 500,
		};
		setFilters(cleared);
		pushParams(search, sort, cleared);
	};

	// Lock body scroll when overlays open
	useEffect(() => {
		document.body.style.overflow = showFilter || showSort ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [showFilter, showSort]);

	const filterApplied =
		filters.brand !== null ||
		filters.color !== null ||
		filters.sizes.length > 0 ||
		filters.priceMin > 0 ||
		filters.priceMax < 500;

	return (
		<>
			{/* Search bar */}
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

			{/* Header row */}
			<div className="flex justify-between items-center mb-4">
				<div>
					<p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
						Bộ sưu tập
					</p>
					<h2 className="text-2xl font-black tracking-tighter">
						{total} kết quả
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
						{SORT_OPTIONS.find((o) => o.value === sort)?.icon}
						Sắp xếp
					</button>
				</div>
			</div>

			{/* Active filter pills */}
			{filterApplied && (
				<div className="flex items-center gap-2 flex-wrap mb-4">
					{[
						filters.brand,
						filters.color,
						filters.sizes.length > 0
							? `Sizes: ${filters.sizes.join(", ")}`
							: null,
						filters.priceMin > 0 || filters.priceMax < 500
							? `${filters.priceMin}–${filters.priceMax}`
							: null,
					]
						.filter(Boolean)
						.map((p) => (
							<span
								key={p}
								className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wide">
								{p}
							</span>
						))}
					<button
						onClick={handleClearFilters}
						className="text-[10px] font-bold text-outline underline">
						Xóa tất cả
					</button>
				</div>
			)}

			{showFilter && (
				<FilterOverlay
					onClose={() => setShowFilter(false)}
					onApply={handleApplyFilter}
					initialState={filters}
				/>
			)}

			{showSort && (
				<SortSheet
					current={sort}
					onSelect={handleSort}
					onClose={() => setShowSort(false)}
				/>
			)}
		</>
	);
}

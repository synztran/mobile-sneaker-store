import type { SortOption } from "@/app/api/products/route";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/components/product/ProductCard";
import { ShopControls } from "@/components/shop/ShopControls";
import Icon from "@/components/ui/Icon";
import { getProducts } from "@/lib/products-server";
import { Suspense } from "react";

interface ShopPageProps {
	searchParams: Promise<{
		search?: string;
		sort?: string;
		brand?: string;
		color?: string;
		sizes?: string;
		priceMin?: string;
		priceMax?: string;
	}>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
	const sp = await searchParams;

	const { products, total } = await getProducts({
		search: sp.search,
		brand: sp.brand,
		color: sp.color,
		sizes: sp.sizes ? sp.sizes.split(",").map(Number) : [],
		priceMin: sp.priceMin ? Number(sp.priceMin) : 0,
		priceMax: sp.priceMax ? Number(sp.priceMax) : 500,
		sort: (sp.sort as SortOption) ?? "newest",
	});

	return (
		<div className="px-4 py-4">
			<Suspense fallback={null}>
				<ShopControls total={total} />
			</Suspense>

			{/* Product grid */}
			{products.length > 0 ? (
				<div className="grid grid-cols-2 gap-x-4 gap-y-8">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
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
	);
}

function ShopPageSkeleton() {
	return (
		<div className="px-4 py-4">
			<div className="flex items-center gap-3 bg-surface-container rounded-full px-3 py-3.5 mb-6 h-12 animate-pulse" />
			<div className="grid grid-cols-2 gap-x-4 gap-y-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<ProductCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}

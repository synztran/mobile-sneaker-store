import { ProductCard } from "@/components/product/ProductCard";
import { getNewestProducts } from "@/lib/products-server";
import Link from "next/link";

export async function HotDropsSection() {
	const products = await getNewestProducts(4);

	return (
		<section className="bg-surface-container py-16">
			<div className="px-6 mb-8 flex justify-between items-end">
				<div>
					<span className="text-[10px] uppercase tracking-widest text-primary font-bold">
						Trending Now
					</span>
					<h3 className="text-3xl font-extrabold tracking-tighter uppercase">
						Hot Drops
					</h3>
				</div>
				<Link href="/shop" className="text-primary font-bold text-sm">
					View All
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-4 px-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}

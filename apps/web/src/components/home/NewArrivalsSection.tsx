import type { ShopProduct } from "@/app/api/products/route";
import { formatVND } from "@/lib/currency";
import { getNewestProducts } from "@/lib/products-server";
import Image from "next/image";
import Link from "next/link";

function NewArrivalCard({ product }: { product: ShopProduct }) {
	return (
		<Link
			href={`/shop/${product.slug}`}
			className="flex-shrink-0 w-[260px] group">
			<div className="h-[340px] rounded-3xl overflow-hidden relative mb-4 bg-[#fbf9f5]">
				{product.images[0] ? (
					<Image
						src={product.images[0]}
						alt={product.model_name}
						fill
						className="object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-darken"
						unoptimized
					/>
				) : (
					<div className="w-full h-full bg-surface-container" />
				)}
				<div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
					Just In
				</div>
			</div>
			<h4 className="font-bold text-base mb-1 line-clamp-1">
				{product.model_name}
			</h4>
			<p className="text-sm text-on-surface-variant font-medium">
				{formatVND(product.min_price)}
			</p>
		</Link>
	);
}

export async function NewArrivalsSection() {
	const products = await getNewestProducts(6);

	return (
		<section className="py-16 overflow-hidden">
			<div className="flex justify-between items-end px-6 mb-8">
				<h3 className="text-3xl font-extrabold tracking-tighter uppercase">
					New Arrivals
				</h3>
				<Link href="/shop" className="text-primary font-bold text-sm">
					View All
				</Link>
			</div>
			<div className="flex gap-6 overflow-x-auto px-6 hide-scrollbar">
				{products.map((product) => (
					<NewArrivalCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}

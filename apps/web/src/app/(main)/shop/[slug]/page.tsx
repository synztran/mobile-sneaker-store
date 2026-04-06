import { ProductView } from "@/components/product/ProductView";
import { TopNav } from "@/components/layout/TopNav";
import { getProductBySlug } from "@/lib/products-server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

async function ProductLoader({ slug }: { slug: string }) {
	const product = await getProductBySlug(slug);
	if (!product) notFound();
	return <ProductView product={product} />;
}

export default async function ProductPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return (
		<Suspense fallback={<ProductDetailSkeleton />}>
			<ProductLoader slug={slug} />
		</Suspense>
	);
}

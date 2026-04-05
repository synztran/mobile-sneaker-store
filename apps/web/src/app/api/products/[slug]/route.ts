import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─── Public Types ─────────────────────────────────────────────────────────────

export interface ProductVariantDetail {
	id: number;
	color_id: number | null;
	size_id: number | null;
	size: {
		label: string;
		gender: string;
		id: number | null;
	};
	color: {
		name: string;
		color_value: string;
		id: number | null;
	};
	price: number;
	stock_quantity: number;
	sku: string | null;
}

export interface ProductSize {
	id: number | null;
	name: string;
	us_size: number;
	available: boolean;
	gender: string;
}

export interface ProductDetail {
	id: number;
	slug: string;
	model_name: string;
	brand: string;
	brand_id: number | null;
	description: string | null;
	condition: "new" | "used" | "deadstock" | null;
	retail_price: number | null;
	resale_price: number | null;
	release_date: string | null;
	images: { url: string; alt: string | null; is_primary: boolean }[];
	variants: ProductVariantDetail[];
	colors: {
		name: string;
		color_value: string;
		id: number | null;
	}[];
	sizes: ProductSize[];
	min_price: number;
	badge: "NEW" | "SALE" | "LIMITED" | null;
}

// ─── Color name → hex map ─────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
	Black: "#1a1a1a",
	White: "#ffffff",
	Grey: "#9ca3af",
	Gray: "#9ca3af",
	Red: "#ef4444",
	Blue: "#3b82f6",
	Green: "#22c55e",
	Yellow: "#eab308",
	Orange: "#f97316",
	Pink: "#ec4899",
	Purple: "#a855f7",
	Brown: "#92400e",
	Navy: "#1e3a5f",
	Beige: "#d4b483",
	Tan: "#c4a882",
	Cream: "#f5f0e8",
};

// ─── Internal raw row type ──────────────────────────────────────────────────

type RawProductRow = {
	id: number;
	slug: string;
	model_name: string;
	description: string | null;
	retail_price: number | null;
	resale_price: number | null;
	condition: string | null;
	release_date: string | null;
	brand_id: number | null;
	brands: { id: number; name: string } | null;
	product_images: {
		image_url: string;
		alt_text: string | null;
		is_primary: boolean;
		sort_order: number;
	}[];
	product_variants: {
		id: number;
		size: string;
		color: string;
		color_id: number | null;
		size_id: number | null;
		price: number;
		stock_quantity: number;
		sku: string | null;
		colors: { name: string; color_value: string }[] | null;
		sizes:
			| {
					available: boolean;
					name: string;
					us_size: number;
					gender: string;
			  }[]
			| null;
	}[];
};

// ─── GET /api/products/[slug] ─────────────────────────────────────────────────

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	const { slug } = await params;
	if (!slug) {
		return NextResponse.json(
			{ error: "Slug is required" },
			{ status: 400 },
		);
	}

	try {
		const supabase = await createClient();

		const { data: product, error } = await supabase
			.from("products")
			.select(
				`
          id,
          slug,
          model_name,
          description,
          retail_price,
          resale_price,
          condition,
          release_date,
          brand_id,
          brands(id, name),
          product_images(image_url, alt_text, is_primary, sort_order),
          product_variants(
            id,
            color_id,
            size_id,
            price,
            stock_quantity,
            sku,
            colors(id, name, color_value),
            sizes(id, name, us_size, gender)
          )
        `,
			)
			.eq("slug", slug)
			.limit(1)
			.maybeSingle();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!product) {
			return NextResponse.json(
				{ error: "Product not found" },
				{ status: 404 },
			);
		}

		// FK-hint selects produce a type Supabase can't infer from Relationships:[],
		// so we cast to any here. The runtime shape is correct.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const p = product as any;

		// ── Process Images ─────────────────────────────────────
		const images = (p.product_images ?? [])
			.sort(
				(a: any, b: any) =>
					(b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
					(a.sort_order ?? 0) - (b.sort_order ?? 0),
			)
			.map((i: any) => ({
				url: i.image_url,
				alt: i.alt_text,
				is_primary: i.is_primary,
			}));

		// ── Process Variants + Sizes (Much Cleaner) ─────────────
		const variants: ProductVariantDetail[] = [];
		const sizeMap = new Map<string, any>();

		(p.product_variants ?? []).forEach((variant: any) => {
			const sizeRow = variant.sizes; // This comes from the join
			const colorRow = variant.colors; // This comes from the join

			const sizeLabel = sizeRow?.name ?? "Unknown Size";
			const numericSize = sizeRow?.us_size ?? null;
			const gender = sizeRow?.gender ?? null;

			variants.push({
				id: variant.id,
				color_id: variant.color_id,
				color: colorRow,
				size_id: variant.size_id,
				size: {
					label: sizeLabel,
					gender: gender,
					id: variant.size_id,
				},
				price: variant.price,
				stock_quantity: variant.stock_quantity,
				sku: variant.sku,
			});

			// Build unique sizes for display (with gender)
			if (sizeRow?.name) {
				const key = `${sizeRow.name}-${sizeRow.gender || "unisex"}`;
				if (!sizeMap.has(key)) {
					sizeMap.set(key, {
						size:
							numericSize ||
							parseFloat(
								String(variant.sizes).replace(/[^0-9.]/g, ""),
							) ||
							0,
						name: sizeLabel, // "US 9 Men"
						gender: sizeRow.gender,
						available: variant.stock_quantity > 0,
						size_id: sizeRow.id,
					});
				} else if (variant.stock_quantity > 0) {
					sizeMap.get(key).available = true;
				}
			}
		});

		const uniqueSizes = Array.from(sizeMap.values()).sort((a, b) => {
			if (a.sizes !== b.sizes) return a.sizes - b.sizes;
			return (a.gender ?? "").localeCompare(b.gender ?? "");
		});

		// Unique Colors
		const uniqueColors = Array.from(
			new Map(
				variants.map((v) => [
					v.color_id,
					{
						name: v.color?.name,
						color_value: v.color?.color_value,
						id: v.color_id,
					},
				]),
			).values(),
		);

		const minPrice =
			variants.length > 0
				? Math.min(...variants.map((v) => v.price))
				: (p.resale_price ?? p.retail_price ?? 0);

		const finalProduct: ProductDetail = {
			id: p.id,
			slug: p.slug,
			model_name: p.model_name,
			brand: p.brands?.name ?? "",
			brand_id: p.brand_id,
			description: p.description,
			condition: p.condition as any,
			retail_price: p.retail_price,
			resale_price: p.resale_price,
			release_date: p.release_date,
			images,
			variants,
			colors: uniqueColors,
			sizes: uniqueSizes, // ← Now contains name + gender
			min_price: minPrice,
			badge: getBadge(p),
		};

		return NextResponse.json(finalProduct);
	} catch (err: any) {
		console.error("Product detail error:", err);
		return NextResponse.json(
			{ error: err.message || "Internal server error" },
			{ status: 500 },
		);
	}
}

// Helper function
function getBadge(product: any): ProductDetail["badge"] {
	if (product.condition === "deadstock") return "LIMITED";
	if (product.condition === "new") return "NEW";
	if (
		product.resale_price &&
		product.retail_price &&
		product.resale_price < product.retail_price
	) {
		return "SALE";
	}
	return null;
}

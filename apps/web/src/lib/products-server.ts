/**
 * Server-side product data fetching — used by async server components.
 * Mirrors the shaping logic in /api/products/route.ts.
 */

import type {
	ProductDetail,
	ProductVariantDetail,
} from "@/app/api/products/[slug]/route";
import type { ShopProduct } from "@/app/api/products/route";
import type { Fee } from "@/lib/supabase/database.types";
import { getPublicClient } from "@/lib/supabase/public";

export type { ProductDetail };

// ─── Color name → hex ─────────────────────────────────────────────────────────

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

// ─── Internal row types ───────────────────────────────────────────────────────

type BrandRow = { id: number; name: string } | null;
type ImageRow = { image_url: string; is_primary: boolean; sort_order: number };
type VariantRow = {
	color: string;
	color_id: number;
	size_id: number;
	price: number;
	stock_quantity: number;
	colors: { name: string; color_value: string; id: number | null } | null;
	sizes: {
		id: number;
		name: string;
		us_size: number | null;
		gender: string;
		available: boolean;
	} | null;
};
type RawListRow = {
	id: number;
	slug: string;
	model_name: string;
	description: string | null;
	retail_price: number | null;
	resale_price: number | null;
	condition: string | null;
	created_at: string;
	brands: BrandRow;
	product_images: ImageRow[] | null;
	product_variants: VariantRow[] | null;
};

// ─── Shared shaping logic ─────────────────────────────────────────────────────

function shapeRow(p: RawListRow): ShopProduct {
	const images = (p.product_images ?? [])
		.sort(
			(a, b) =>
				(b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
				a.sort_order - b.sort_order,
		)
		.map((i) => i.image_url);

	const variants = p.product_variants ?? [];
	const uniqueColors = [...new Set(variants.map((v) => v.color))];
	const uniqueSizes = [
		...new Map(
			variants.filter((v) => v.sizes).map((v) => [v.sizes!.id, v.sizes!]),
		).values(),
	].sort((a, b) => (a.us_size ?? 0) - (b.us_size ?? 0));

	const minPrice =
		variants.length > 0
			? Math.min(...variants.map((v) => v.price))
			: (p.resale_price ?? p.retail_price ?? 0);

	let badge: ShopProduct["badge"] = null;
	if (p.condition === "deadstock") badge = "LIMITED";
	else if (p.condition === "new") badge = "NEW";
	else if (
		p.retail_price &&
		p.resale_price &&
		p.resale_price < p.retail_price
	)
		badge = "SALE";

	return {
		id: p.id,
		slug: p.slug,
		model_name: p.model_name,
		brand: p.brands?.name ?? "Unknown",
		description: p.description,
		condition: p.condition as ShopProduct["condition"],
		retail_price: p.retail_price,
		min_price: minPrice,
		images,
		colors: uniqueColors.map((name) => {
			const variant = variants.find((v) => v.color === name);
			return {
				name,
				color_value:
					variant?.colors?.color_value ?? COLOR_HEX[name] ?? "",
				id: variant?.color_id ?? null,
			};
		}),
		sizes: uniqueSizes.map((sizeRow) => ({
			label: sizeRow.name ?? "",
			gender: sizeRow.gender,
			id: sizeRow.id || null,
			available: variants.some(
				(v) => v.sizes?.id === sizeRow.id && v.stock_quantity > 0,
			),
		})),
		badge,
	};
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface GetProductsParams {
	search?: string;
	brand?: string;
	color?: string;
	sizes?: number[];
	priceMin?: number;
	priceMax?: number;
	sort?: "newest" | "price_asc" | "price_desc";
	limit?: number;
}

/**
 * Flexible product query for server components (shop page, search, etc.)
 */
export async function getProducts(
	params: GetProductsParams = {},
): Promise<{ products: ShopProduct[]; total: number }> {
	const {
		search = "",
		brand = "",
		color = "",
		sizes = [],
		priceMin = 0,
		priceMax = 500,
		sort = "newest",
		limit,
	} = params;

	try {
		const supabase = getPublicClient();

		// Resolve brand → id
		let brandId: number | null = null;
		if (brand) {
			const { data: brandRow } = await supabase
				.from("brands")
				.select("id")
				.ilike("name", `%${brand}%`)
				.limit(1)
				.maybeSingle();
			if (!brandRow) return { products: [], total: 0 };
			brandId = (brandRow as { id: number }).id;
		}

		let query = supabase.from("products").select(
			`id, slug, model_name, description, retail_price, resale_price, condition, created_at,
			 brands(id, name),
			 product_images(image_url, is_primary, sort_order),
			 product_variants(color, color_id, size_id, price, stock_quantity, colors(name, color_value), sizes(id, name, us_size, gender))`,
		);

		if (search) query = query.ilike("model_name", `%${search}%`);
		if (brandId !== null) query = query.eq("brand_id", brandId);
		query = query.order("created_at", { ascending: false });

		const { data, error } = await query;
		if (error) {
			console.error(
				"[getProducts] Supabase error:",
				error.message,
				error.code,
			);
			return { products: [], total: 0 };
		}

		let products = ((data ?? []) as unknown as RawListRow[]).map(shapeRow);

		// JS-level filters
		if (sizes.length > 0) {
			products = products.filter((p) =>
				sizes.some((fs) =>
					p.sizes.some((s) => s.id === fs && s.available),
				),
			);
		}
		if (color) {
			products = products.filter((p) =>
				p.colors.some(
					(c) => c.name.toLowerCase() === color.toLowerCase(),
				),
			);
		}
		if (priceMin > 0 || priceMax < 500) {
			products = products.filter(
				(p) => p.min_price >= priceMin && p.min_price <= priceMax,
			);
		}

		if (sort === "price_asc")
			products.sort((a, b) => a.min_price - b.min_price);
		else if (sort === "price_desc")
			products.sort((a, b) => b.min_price - a.min_price);

		const sliced = limit && limit > 0 ? products.slice(0, limit) : products;
		return { products: sliced, total: sliced.length };
	} catch (err) {
		console.error("[getProducts] Unexpected error:", err);
		return { products: [], total: 0 };
	}
}

/**
 * Fetch the N newest products for use in server components.
 */
export async function getNewestProducts(limit: number): Promise<ShopProduct[]> {
	try {
		const { data, error } = await getPublicClient()
			.from("products")
			.select(
				`id, slug, model_name, description, retail_price, resale_price, condition, created_at,
				 brands(id, name),
				 product_images(image_url, is_primary, sort_order),
				 product_variants(color, color_id, size_id, price, stock_quantity, colors(name, color_value), sizes(id, name, us_size, gender))`,
			)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error(
				"[getNewestProducts] Supabase error:",
				error.message,
				error.code,
			);
			return [];
		}
		if (!data) return [];
		return (data as unknown as RawListRow[]).map(shapeRow);
	} catch (err) {
		console.error("[getNewestProducts] Unexpected error:", err);
		return [];
	}
}

function getBadge(product: {
	condition: string | null;
	retail_price: number | null;
	resale_price: number | null;
}): ProductDetail["badge"] {
	if (product.condition === "deadstock") return "LIMITED";
	if (product.condition === "new") return "NEW";
	if (
		product.retail_price &&
		product.resale_price &&
		product.resale_price < product.retail_price
	)
		return "SALE";
	return null;
}

/**
 * Fetch a single product's full detail by slug — for the product detail server component.
 */
export async function getProductBySlug(
	slug: string,
): Promise<ProductDetail | null> {
	try {
		const supabase = getPublicClient();

		const { data: product, error } = await supabase
			.from("products")
			.select(
				`id, slug, model_name, description, retail_price, resale_price, condition, release_date, brand_id,
				 brands(id, name),
				 product_images(image_url, alt_text, is_primary, sort_order),
				 product_variants(id, color_id, size_id, price, stock_quantity, sku,
				   colors(id, name, color_value),
				   sizes(id, name, us_size, gender)
				 )`,
			)
			.eq("slug", slug)
			.limit(1)
			.maybeSingle();

		if (error || !product) return null;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const p = product as any;

		const images = (p.product_images ?? [])
			.sort(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(a: any, b: any) =>
					(b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
					(a.sort_order ?? 0) - (b.sort_order ?? 0),
			)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((i: any) => ({
				url: i.image_url,
				alt: i.alt_text,
				is_primary: i.is_primary,
			}));

		const variants: ProductVariantDetail[] = [];
		const sizeMap = new Map<string, Record<string, unknown>>();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(p.product_variants ?? []).forEach((variant: any) => {
			const sizeRow = variant.sizes;
			const colorRow = variant.colors;
			const sizeLabel = sizeRow?.name ?? "Unknown Size";
			const numericSize = sizeRow?.us_size ?? null;
			const gender = sizeRow?.gender ?? null;

			variants.push({
				id: variant.id,
				color_id: variant.color_id,
				color: colorRow,
				size_id: variant.size_id,
				size: { label: sizeLabel, gender, id: variant.size_id },
				price: variant.price,
				stock_quantity: variant.stock_quantity,
				sku: variant.sku,
			});

			if (sizeRow?.name) {
				const key = `${sizeRow.name}-${sizeRow.gender ?? "unisex"}`;
				if (!sizeMap.has(key)) {
					sizeMap.set(key, {
						id: sizeRow.id,
						name: sizeLabel,
						us_size: numericSize ?? 0,
						gender: sizeRow.gender,
						available: variant.stock_quantity > 0,
					});
				} else if (variant.stock_quantity > 0) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					sizeMap.get(key)!.available = true;
				}
			}
		});

		const uniqueSizes = Array.from(sizeMap.values()).sort((a, b) => {
			if (a.us_size !== b.us_size)
				return (a.us_size as number) - (b.us_size as number);
			return ((a.gender ?? "") as string).localeCompare(
				(b.gender ?? "") as string,
			);
		});

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

		return {
			id: p.id,
			slug: p.slug,
			model_name: p.model_name,
			brand: p.brands?.name ?? "",
			brand_id: p.brand_id,
			description: p.description,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			condition: p.condition as any,
			retail_price: p.retail_price,
			resale_price: p.resale_price,
			release_date: p.release_date,
			images,
			variants,
			colors: uniqueColors,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			sizes: uniqueSizes as any,
			min_price: minPrice,
			badge: getBadge(p),
		};
	} catch (err) {
		console.error("[getProductBySlug] Unexpected error:", err);
		return null;
	}
}

/**
 * Fetch delivery fees for the checkout shipping page.
 */
export async function getFees(): Promise<Fee | null> {
	try {
		const { data, error } = await getPublicClient()
			.from("fees")
			.select(
				"delivery_immediate_price, delivery_basic_price, insurance_fee, packing_fee, handling_fee, updated_at",
			)
			.limit(1)
			.maybeSingle();

		if (error) return null;
		return data as Fee | null;
	} catch {
		return null;
	}
}

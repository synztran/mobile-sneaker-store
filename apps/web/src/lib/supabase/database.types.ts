export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					full_name: string | null;
					avatar_url: string | null;
					shipping_address: Json | null;
					created_at: string;
				};
				Insert: {
					id: string;
					full_name?: string | null;
					avatar_url?: string | null;
					shipping_address?: Json | null;
					created_at?: string;
				};
				Update: {
					id?: never;
					full_name?: string | null;
					avatar_url?: string | null;
					shipping_address?: Json | null;
					created_at?: never;
				};
			};

			brands: {
				Row: {
					id: number;
					name: string;
					logo_url: string | null;
					created_at: string;
				};
				Insert: {
					id?: never;
					name: string;
					logo_url?: string | null;
					created_at?: string;
				};
				Update: {
					id?: never;
					name?: string;
					logo_url?: string | null;
					created_at?: never;
				};
			};

			products: {
				Row: {
					id: number;
					brand_id: number | null;
					model_name: string;
					description: string | null;
					release_date: string | null;
					retail_price: number | null;
					resale_price: number | null;
					condition: "new" | "used" | "deadstock" | null;
					slug: string; // ← New field
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: never;
					brand_id?: number | null;
					model_name: string;
					description?: string | null;
					release_date?: string | null;
					retail_price?: number | null;
					resale_price?: number | null;
					condition?: "new" | "used" | "deadstock" | null;
					created_at?: string;
					updated_at?: string;
					slug?: string; // ← New field (optional on insert if you use trigger)
				};
				Update: {
					id?: never;
					brand_id?: number | null;
					model_name?: string;
					description?: string | null;
					release_date?: string | null;
					retail_price?: number | null;
					resale_price?: number | null;
					condition?: "new" | "used" | "deadstock" | null;
					slug?: string;
					created_at?: never;
					updated_at?: string;
				};
			};

			product_variants: {
				Row: {
					id: number;
					product_id: number;
					size: string;
					color: string;
					color_id: number | null;
          size_id: number | null;           // ← NEW
					sku: string | null;
					stock_quantity: number;
					price: number;
					created_at: string;
				};
				Insert: {
					id?: never;
					product_id: number;
					size: string;
					color: string;
					color_id?: number | null;
          size_id?: number | null;          // ← NEW
					sku?: string | null;
					stock_quantity?: number;
					price: number;
					created_at?: string;
				};
				Update: {
					id?: never;
					product_id?: number;
					size?: string;
					color?: string;
					color_id?: number | null;
          size_id?: number | null;          // ← NEW
					sku?: string | null;
					stock_quantity?: number;
					price?: number;
					created_at?: never;
				};
			};

			product_images: {
				Row: {
					id: number;
					product_id: number;
					image_url: string;
					alt_text: string | null;
					is_primary: boolean;
					sort_order: number;
				};
				Insert: {
					id?: never;
					product_id: number;
					image_url: string;
					alt_text?: string | null;
					is_primary?: boolean;
					sort_order?: number;
				};
				Update: {
					id?: never;
					product_id?: number;
					image_url?: string;
					alt_text?: string | null;
					is_primary?: boolean;
					sort_order?: number;
				};
			};

			cart_items: {
				Row: {
					id: number;
					user_id: string;
					variant_id: number;
					quantity: number;
					created_at: string;
				};
				Insert: {
					id?: never;
					user_id: string;
					variant_id: number;
					quantity?: number;
					created_at?: string;
				};
				Update: {
					id?: never;
					user_id?: never;
					variant_id?: never;
					quantity?: number;
					created_at?: never;
				};
			};

			orders: {
				Row: {
					id: number;
					user_id: string | null;
					status:
						| "pending"
						| "paid"
						| "shipped"
						| "delivered"
						| "cancelled";
					total_amount: number;
					shipping_address: Json | null;
					payment_intent_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: never;
					user_id?: string | null;
					status?:
						| "pending"
						| "paid"
						| "shipped"
						| "delivered"
						| "cancelled";
					total_amount: number;
					shipping_address?: Json | null;
					payment_intent_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: never;
					user_id?: string | null;
					status?:
						| "pending"
						| "paid"
						| "shipped"
						| "delivered"
						| "cancelled";
					total_amount?: number;
					shipping_address?: Json | null;
					payment_intent_id?: string | null;
					created_at?: never;
					updated_at?: string;
				};
			};

			order_items: {
				Row: {
					id: number;
					order_id: number;
					variant_id: number | null;
					quantity: number;
					price_at_purchase: number;
				};
				Insert: {
					id?: never;
					order_id: number;
					variant_id?: number | null;
					quantity: number;
					price_at_purchase: number;
				};
				Update: {
					id?: never;
					order_id?: never;
					variant_id?: number | null;
					quantity?: number;
					price_at_purchase?: number;
				};
			};

			wishlist_items: {
				Row: {
					id: number;
					user_id: string;
					product_id: number;
					created_at: string;
				};
				Insert: {
					id?: never;
					user_id: string;
					product_id: number;
					created_at?: string;
				};
				Update: {
					id?: never;
					user_id?: never;
					product_id?: never;
					created_at?: never;
				};
			};

			colors: {
				Row: {
					id: number;
					name: string;
					color_value: string;
					slug: string;
					sort_order: number | null;
					created_at: string;
				};
				Insert: {
					id?: never;
					name: string;
					color_value: string;
					slug: string;
					sort_order?: number | null;
					created_at?: string;
				};
				Update: {
					id?: never;
					name?: string;
					color_value?: string;
					slug?: string;
					sort_order?: number | null;
					created_at?: never;
				};
			};

      sizes: {
        Row: {
          id: number;
          name: string;
          slug: string;
          sort_order: number | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          name: string;
          slug: string;
          sort_order?: number | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          name?: string;
          slug?: string;
          sort_order?: number | null;
          created_at?: never;
        };
      };
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
}

// Profiles
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Brands
export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type BrandInsert = Database["public"]["Tables"]["brands"]["Insert"];
export type BrandUpdate = Database["public"]["Tables"]["brands"]["Update"];

// Products
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

// Product Variants
export type ProductVariant =
	Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductVariantInsert =
	Database["public"]["Tables"]["product_variants"]["Insert"];
export type ProductVariantUpdate =
	Database["public"]["Tables"]["product_variants"]["Update"];

// Product Images
export type ProductImage =
	Database["public"]["Tables"]["product_images"]["Row"];
export type ProductImageInsert =
	Database["public"]["Tables"]["product_images"]["Insert"];
export type ProductImageUpdate =
	Database["public"]["Tables"]["product_images"]["Update"];

// Cart Items
export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
export type CartItemInsert =
	Database["public"]["Tables"]["cart_items"]["Insert"];
export type CartItemUpdate =
	Database["public"]["Tables"]["cart_items"]["Update"];

// Orders
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

// Order Items
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInsert =
	Database["public"]["Tables"]["order_items"]["Insert"];
export type OrderItemUpdate =
	Database["public"]["Tables"]["order_items"]["Update"];

// Wishlist Items
export type WishlistItem =
	Database["public"]["Tables"]["wishlist_items"]["Row"];
export type WishlistItemInsert =
	Database["public"]["Tables"]["wishlist_items"]["Insert"];
export type WishlistItemUpdate =
	Database["public"]["Tables"]["wishlist_items"]["Update"];

// Colors
export type Color = Database["public"]["Tables"]["colors"]["Row"];
export type ColorInsert = Database["public"]["Tables"]["colors"]["Insert"];
export type ColorUpdate = Database["public"]["Tables"]["colors"]["Update"];

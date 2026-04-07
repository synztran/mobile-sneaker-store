export interface Product {
	id: string;
	name: string;
	brand: string;
	category: string;
	price: number;
	originalPrice?: number;
	badge?: "NEW" | "SALE" | "LIMITED";
	description: string;
	story: string;
	colors: ColorOption[];
	sizes: SizeOption[];
	images: string[];
	rating: number;
	reviews: number;
	sustainability?: string;
	weight?: string;
	inStock: boolean;
	isLimitedEdition?: boolean;
}

export interface ColorOption {
	name: string;
	color_value: string;
	id: number | null;
}

export interface SizeOption {
	id: number | null;
	available: boolean;
	label: string;
	gender: string;
}

export interface CartItem {
	product: Product;
	size: {
		label: string;
		gender: string;
		id: number | null;
	};
	color: ColorOption;
	quantity: number;
}

export interface ShippingDetails {
	fullName: string;
	streetAddress: string;
	apartment: string;
	city: string;
	postalCode: string;
	phoneNumber: string;
	deliverySpeed: "standard" | "express" | "shipment";
}

export const CATEGORIES = [
	"Running",
	"Lifestyle",
	"Basketball",
	"Training",
	"Outdoor",
];

export const SHIPPING_COST = {
	standard: 0,
	express: 15,
};

export const TAX_RATE = 0.0517; // ~5.17%

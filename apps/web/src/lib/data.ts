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

// export const PRODUCTS: Product[] = [
// 	{
// 		id: "terra-arche-01",
// 		name: "Terra Arche Type-01",
// 		brand: "Sneaker Lab",
// 		category: "LIFESTYLE",
// 		price: 285,
// 		originalPrice: 340,
// 		badge: "LIMITED",
// 		description:
// 			"The Terra Arche Type-01 represents a synthesis of organic materials and brutalist geometry.",
// 		story: "Crafted from premium vegetable-tanned leather and recycled ocean mesh, each pair features a signature terracotta gradient sole inspired by Mediterranean clay deposits. Engineered for the tactile curator who demands both architectural form and sustainable function.",
// 		colors: [
// 			{ label: "Terracotta", hex: "#9b3f1c", id: 1 },
// 			{ label: "Olive", hex: "#52652a", id: 2 },
// 			{ label: "Onyx", hex: "#2D2B2A", id: 3 },
// 		],
// 		sizes: [
// 			{ size: 8, available: true },
// 			{ size: 8.5, available: true },
// 			{ size: 9, available: true },
// 			{ size: 9.5, available: true },
// 			{ size: 10, available: true },
// 			{ size: 10.5, available: true },
// 			{ size: 11, available: false },
// 			{ size: 12, available: true },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuAYVnbk3J-VrsS0276nxNrCKK0XezGbrV_b-RYBqtuuJp-EEUcU26f8NBJAaI-IrwmsN0g0d1_rs-hkyYBYSLe1l0iPfGbqidbwwI1M5xOGdHN6kxp11BfkOYywYuLcjaqvxIz6LsRnuXyvmyLYkqNdj6n25xwF7XTmmyvm94r-Ak2JJSIxsGYfE7JDwQPBfEVFJVP_WzE03seDznzNIkGIbuIqwzW9rc57GCVSbZKhCh4XuP-PBt5v7m54jeCr1JI6J_S6d8HG30w",
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuCp2yIk1H2UgfPI0VPWuVZsR-s_wFy9BovdbASACAl4dSK7rG7Yp86zkykEr5zZSxdAFVk2EQ71wyfzAVW-icNqt2-GP9QrarVvo8ccYAwoqMYfBml1pEnn1tVHTNMwMRq_iPZAYYmJiS1clzpz89ZhfJdMe1JnA7NsAAizAiIkQ3rHnVUOelA__fzUXQZYqMxZaFVfotc-a1tg7WSmkxELrqBZUIHhnEB4noo4N3JHYiTy0yIpiamZbgekPPMe1Yqf1RAF7EEbK40",
// 		],
// 		rating: 4.9,
// 		reviews: 128,
// 		sustainability: "100% Recycled",
// 		weight: "340g / Ultra-light",
// 		inStock: true,
// 		isLimitedEdition: true,
// 	},
// 	{
// 		id: "vista-runner-x",
// 		name: "Vista Runner X",
// 		brand: "Sneaker Lab",
// 		category: "RUNNING SHOES",
// 		price: 125,
// 		originalPrice: 180,
// 		badge: "NEW",
// 		description: "Performance running shoe with premium cushioning.",
// 		story: "Engineered for the urban runner, the Vista Runner X combines lightweight mesh uppers with responsive foam midsoles.",
// 		colors: [
// 			{ label: "White", hex: "#ffffff", id: 4 },
// 			{ label: "Terracotta", hex: "#9b3f1c", id: 5 },
// 			{ label: "Slate", hex: "#475569", id: 6 },
// 			{ label: "Sand", hex: "#d4c5a9", id: 7 },
// 		],
// 		sizes: [
// 			{ size: 7, available: true },
// 			{ size: 7.5, available: true },
// 			{ size: 8, available: true },
// 			{ size: 8.5, available: true },
// 			{ size: 9, available: true },
// 			{ size: 9.5, available: true },
// 			{ size: 10, available: true },
// 			{ size: 10.5, available: true },
// 			{ size: 11, available: true },
// 			{ size: 12, available: false },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuBtpDZmOa72mJwZiHc7Gg77fPcLuhbxIPBX5cRqrZHkVXYIaMJeBmgbVNGOXFTJli1m9LS-Ovtlyp5d3DcWQUU7qSBEs2pVodNV942EaBa2RP1Tpw_jzZ3pNdh5P0fO9LChMlRaqgX_o-SGqr62matzTKw6xyKZ0oLp1svcBxTH4goNnm5rI7x0bqEGgCz_ocja0lFD0ahUxYFCM0yodnsFNyRvlNMk-t_xbccC_dKBoeJI_iBO3KFnW_B5anLp4o3I6EffMyJgCXk",
// 		],
// 		rating: 4.7,
// 		reviews: 89,
// 		inStock: true,
// 	},
// 	{
// 		id: "terracotta-canvas",
// 		name: "Terracotta Canvas",
// 		brand: "Retro High",
// 		category: "LIFESTYLE",
// 		price: 185,
// 		originalPrice: 220,
// 		badge: "NEW",
// 		description: "Classic canvas silhouette in warm terracotta tones.",
// 		story: "A timeless design reimagined with modern sustainable materials.",
// 		colors: [
// 			{ label: "Terracotta", hex: "#9b3f1c", id: 5 },
// 			{ label: "White", hex: "#ffffff", id: 4 },
// 			{ label: "Onyx", hex: "#2D2B2A", id: 3 },
// 		],
// 		sizes: [
// 			{ size: 7, available: true },
// 			{ size: 8, available: true },
// 			{ size: 9, available: true },
// 			{ size: 10, available: true },
// 			{ size: 11, available: true },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuCo6wgIBUS-cFOXbibGnGXwW3SIY0e-CUz2kGFQswvirZDHS9SgW78iwlc3B89JONaq1QB3uq3-bP9ZoLPwXdtZpE1qi17PctTyJaD5oq1Z8wJ0mvd_8Ny95kW3HAXoIvjRGUGAU8EISH1PIT9Fz6jcUw--Y-a1biQSQHqIcp0vfhJNqol3o3taRT1uK6s-JuS5d1w6qWrylFsLCbJ70cYVjz5BEJhiMU5SDBBwXCwbt2x7v1xVsy9coFcmqICDyGlT3Siayr6t5DA",
// 		],
// 		rating: 4.5,
// 		reviews: 67,
// 		inStock: true,
// 	},
// 	{
// 		id: "olive-archive",
// 		name: "Olive Archive",
// 		brand: "Archival Series",
// 		category: "LIFESTYLE",
// 		price: 145,
// 		originalPrice: 210,
// 		badge: "SALE",
// 		description: "Archive silhouette in muted olive tones.",
// 		story: "Drawn from the archives, reissued with contemporary comfort.",
// 		colors: [
// 			{ label: "Olive", hex: "#52652a", id: 2 },
// 			{ label: "White", hex: "#ffffff", id: 4 },
// 		],
// 		sizes: [
// 			{ size: 8, available: true },
// 			{ size: 9, available: true },
// 			{ size: 10, available: true },
// 			{ size: 11, available: false },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuA67PTtpgol5Ho2MG-eAEf_2CoCCwRt6dtsdPQN1Dy3jbattq6xqp0tfV4Kd2yZUEUjIaHWorzqV1ck4QY63JggRrSLhhLf7DXKLDaiLHfmJDpk64Y_ZWLhyEgt6DxmfX8atFn6t0XKwhrwsfmr366WaEb-HG3Nv_dPfTsrKlYXNWX7-_PsRSpD--4nY4mEEIEIOyi4lkIGYGPXuHZe4xZbVOqQP2Ug4FJyRbK9nxgPw4qy2DouOLGDyG54IWnFNX9NlUy8PyWilw0",
// 		],
// 		rating: 4.3,
// 		reviews: 45,
// 		inStock: true,
// 	},
// 	{
// 		id: "crimson-heritage",
// 		name: "Crimson Heritage",
// 		brand: "Heritage Low",
// 		category: "LIFESTYLE",
// 		price: 190,
// 		originalPrice: 245,
// 		description: "Premium heritage low-top in deep crimson.",
// 		story: "A collector piece for those who appreciate heritage craftsmanship.",
// 		colors: [
// 			{ label: "Crimson", hex: "#9b3f1c", id: 1 },
// 			{ label: "Onyx", hex: "#2D2B2A", id: 3 },
// 		],
// 		sizes: [
// 			{ size: 8, available: true },
// 			{ size: 9, available: true },
// 			{ size: 10, available: true },
// 			{ size: 11, available: true },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuAoDnQ1ZNBd6nR7hQTeEZejpmgvfOJd-fM09mfsNKgBttUG_f9x0VhLxbv1abQ_URBdhfUEimvqny_6PijNE_kj99kz1zUeWdMATKbO75HcWAMxU1NZD-C7eSlGV25HwM4PUqzVm9r6uqoSq19Oyv3_1EtLCkrfb1rwZuh2GVM_6a_FYyCMs-oK5kKaQ89KTQ9zVGMrjcSoIwTktws5DjlByZWL96AT5XDUaUigJlB9FYbWv9czkLkO6MKIS-JgV-ptSo5X3qfyKS4",
// 		],
// 		rating: 4.6,
// 		reviews: 33,
// 		inStock: true,
// 	},
// 	{
// 		id: "ghost-white-highs",
// 		name: "Ghost White Highs",
// 		brand: "Limited Drop",
// 		category: "LIFESTYLE",
// 		price: 310,
// 		originalPrice: 350,
// 		badge: "NEW",
// 		isLimitedEdition: true,
// 		description: "Ultra-limited ghost white high-top.",
// 		story: "A spectral silhouette that disappears into the light.",
// 		colors: [
// 			{ name: "Ghost White", hex: "#f8f8f8" },
// 			{ name: "Fog", hex: "#d4d4d4" },
// 		],
// 		sizes: [
// 			{ size: 8, available: true },
// 			{ size: 9, available: false },
// 			{ size: 10, available: true },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuADrUhneZqMRDzXgw4YvT3HrCEH5PlmpZ4mNAxxboeGGOAu2r5GUlGbsrI91odysx5_nYbgRU95AOZn5bjTd6LYaIfuK2Jrq_KCNUnsSI9N9pLy_vYj7xsL47X5RrrgvNt8bvHVZGfF334SWweu88na6oMwWhb38ZiUwVKureZUXuKamcvGBdHS-VXWhmz3fbd_vaxtSrwqFjHi5U7MZdxZpDW_2gqP5y92rVXriquJc-zRsx4ZgxwepHMq01fQhna0gOaZbG3Dxn4",
// 		],
// 		rating: 4.8,
// 		reviews: 12,
// 		inStock: true,
// 	},
// 	{
// 		id: "terra-runner",
// 		name: "Terra Runner",
// 		brand: "Sneaker Lab",
// 		category: "RUNNING",
// 		price: 185,
// 		description: "Lightweight trail runner with terracotta appeal.",
// 		story: "Built for trails and streets alike.",
// 		colors: [
// 			{ label: "Terracotta", hex: "#9b3f1c", id: 5 },
// 			{ label: "Olive", hex: "#52652a", id: 2 },
// 		],
// 		sizes: [
// 			{ size: 8, available: true },
// 			{ size: 9, available: true },
// 			{ size: 10, available: true },
// 			{ size: 11, available: true },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuCo6wgIBUS-cFOXbibGnGXwW3SIY0e-CUz2kGFQswvirZDHS9SgW78iwlc3B89JONaq1QB3uq3-bP9ZoLPwXdtZpE1qi17PctTyJaD5oq1Z8wJ0mvd_8Ny95kW3HAXoIvjRGUGAU8EISH1PIT9Fz6jcUw--Y-a1biQSQHqIcp0vfhJNqol3o3taRT1uK6s-JuS5d1w6qWrylFsLCbJ70cYVjz5BEJhiMU5SDBBwXCwbt2x7v1xVsy9coFcmqICDyGlT3Siayr6t5DA",
// 		],
// 		rating: 4.4,
// 		reviews: 55,
// 		inStock: true,
// 	},
// 	{
// 		id: "aero-knit",
// 		name: "Aero-Knit",
// 		brand: "Sneaker Lab",
// 		category: "RUNNING",
// 		price: 210,
// 		description: "Precision-knit upper with adaptive fit.",
// 		story: "Where technology meets artisan craft.",
// 		colors: [
// 			{ name: "White", hex: "#ffffff" },
// 			{ name: "Slate", hex: "#475569" },
// 		],
// 		sizes: [
// 			{ size: 8, available: true },
// 			{ size: 9, available: true },
// 			{ size: 10, available: true },
// 			{ size: 11, available: true },
// 		],
// 		images: [
// 			"https://lh3.googleusercontent.com/aida-public/AB6AXuA67PTtpgol5Ho2MG-eAEf_2CoCCwRt6dtsdPQN1Dy3jbattq6xqp0tfV4Kd2yZUEUjIaHWorzqV1ck4QY63JggRrSLhhLf7DXKLDaiLHfmJDpk64Y_ZWLhyEgt6DxmfX8atFn6t0XKwhrwsfmr366WaEb-HG3Nv_dPfTsrKlYXNWX7-_PsRSpD--4nY4mEEIEIOyi4lkIGYGPXuHZe4xZbVOqQP2Ug4FJyRbK9nxgPw4qy2DouOLGDyG54IWnFNX9NlUy8PyWilw0",
// 		],
// 		rating: 4.6,
// 		reviews: 72,
// 		inStock: true,
// 	},
// ];

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

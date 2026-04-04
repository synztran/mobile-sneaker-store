"use client";

import type {
	CartItem,
	ColorOption,
	Product,
	ShippingDetails,
} from "@/lib/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
	items: CartItem[];
	isOpen: boolean;
	addItem: (product: Product, size: number, color: ColorOption) => void;
	removeItem: (productId: string, size: number, colorName: string) => void;
	updateQty: (
		productId: string,
		size: number,
		colorName: string,
		delta: number,
	) => void;
	clearCart: () => void;
	openCart: () => void;
	closeCart: () => void;
	total: () => number;
	itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			isOpen: false,

			addItem: (product, size, color) => {
				set((state) => {
					const existing = state.items.find(
						(i) =>
							i.product.id === product.id &&
							i.size === size &&
							i.color.name === color.name,
					);
					if (existing) {
						return {
							items: state.items.map((i) =>
								i.product.id === product.id &&
								i.size === size &&
								i.color.name === color.name
									? { ...i, quantity: i.quantity + 1 }
									: i,
							),
						};
					}
					return {
						items: [
							...state.items,
							{ product, size, color, quantity: 1 },
						],
					};
				});
			},

			removeItem: (productId, size, colorName) => {
				set((state) => ({
					items: state.items.filter(
						(i) =>
							!(
								i.product.id === productId &&
								i.size === size &&
								i.color.name === colorName
							),
					),
				}));
			},

			updateQty: (productId, size, colorName, delta) => {
				set((state) => ({
					items: state.items
						.map((i) =>
							i.product.id === productId &&
							i.size === size &&
							i.color.name === colorName
								? {
										...i,
										quantity: Math.max(
											0,
											i.quantity + delta,
										),
									}
								: i,
						)
						.filter((i) => i.quantity > 0),
				}));
			},

			clearCart: () => set({ items: [] }),
			openCart: () => set({ isOpen: true }),
			closeCart: () => set({ isOpen: false }),

			total: () =>
				get().items.reduce(
					(sum, i) => sum + i.product.price * i.quantity,
					0,
				),

			itemCount: () =>
				get().items.reduce((sum, i) => sum + i.quantity, 0),
		}),
		{ name: "sneaker-lab-cart" },
	),
);

interface CheckoutStore {
	shipping: ShippingDetails | null;
	setShipping: (data: ShippingDetails) => void;
	orderId: string;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
	shipping: null,
	orderId: `SNKR-${Math.floor(1000 + Math.random() * 9000)}`,
	setShipping: (data) => set({ shipping: data }),
}));

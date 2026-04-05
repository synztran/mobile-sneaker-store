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
	totalPrice: number;
	isOpen: boolean;
	addItem: (
		product: Product,
		size: CartItem["size"],
		color: ColorOption,
	) => void;
	removeItem: (
		productId: string,
		sizeId: number | null,
		colorId: number | null,
	) => void;
	updateQty: (
		productId: string,
		sizeId: number | null,
		colorId: number | null,
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
			totalPrice: 0,
			isOpen: false,

			addItem: (product, size, color) => {
				set((state) => {
					const existing = state.items.find(
						(i) =>
							i.product.id === product.id &&
							i.size.id === size.id &&
							i.color.id === color.id,
					);
					if (existing) {
						return {
							items: state.items.map((i) =>
								i.product.id === product.id &&
								i.size.id === size.id &&
								i.color.id === color.id
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

			removeItem: (productId, sizeId, colorId) => {
				set((state) => ({
					items: state.items.filter(
						(i) =>
							!(
								i.product.id === productId &&
								i.size.id === sizeId &&
								i.color.id === colorId
							),
					),
				}));
			},

			updateQty: (productId, sizeId, colorId, delta) => {
				set((state) => ({
					items: state.items
						.map((i) =>
							i.product.id === productId &&
							i.size.id === sizeId &&
							i.color.id === colorId
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

			clearCart: () => set({ items: [], totalPrice: 0 }),
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
		{ name: "sneaker-lab-cart", skipHydration: true },
	),
);

interface CheckoutStore {
	shipping: ShippingDetails | null;
	deliveryFee: number;
	setShipping: (data: ShippingDetails, deliveryFee: number) => void;
	clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
	persist(
		(set) => ({
			shipping: null,
			deliveryFee: 0,
			setShipping: (data, deliveryFee) =>
				set({ shipping: data, deliveryFee }),
			clearCheckout: () => set({ shipping: null, deliveryFee: 0 }),
		}),
		{ name: "sneaker-lab-checkout" },
	),
);

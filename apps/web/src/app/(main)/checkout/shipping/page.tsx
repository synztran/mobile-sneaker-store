"use client";

import { formatVND } from "@/lib/currency";
import { SHIPPING_COST } from "@/lib/data";
import { toast } from "@/lib/toast";
import { useCartStore, useCheckoutStore } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShippingPage() {
	const router = useRouter();
	const { setShipping } = useCheckoutStore();
	const { total } = useCartStore();
	const [delivery, setDelivery] = useState<"standard" | "express">(
		"standard",
	);
	const [form, setForm] = useState({
		fullName: "",
		streetAddress: "",
		apartment: "",
		city: "",
		postalCode: "",
		phoneNumber: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!form.fullName ||
			!form.streetAddress ||
			!form.city ||
			!form.postalCode
		) {
			toast.error("Please fill in required fields");
			return;
		}
		setShipping({ ...form, deliverySpeed: delivery });
		router.push("/checkout/payment");
	};

	const subtotal = total();
	const shipping = SHIPPING_COST[delivery];
	const orderTotal = subtotal + shipping;

	return (
		<>
			{/* Header */}
			<header className="mb-10">
				<div className="bg-surface-container-lowest p-6 rounded-xl mb-4 flex items-center justify-between shadow-ambient-sm">
					<div>
						<p className="text-primary font-bold text-xs tracking-widest uppercase mb-1">
							Step 01
						</p>
						<h2 className="text-2xl font-bold text-on-surface">
							Shipping Details
						</h2>
					</div>
					<div className="w-12 h-12 rounded-full border-4 border-surface-container-high flex items-center justify-center relative">
						<span className="text-xs font-bold text-primary">
							33%
						</span>
						<svg
							className="absolute inset-0 -rotate-90"
							viewBox="0 0 36 36">
							<circle
								className="stroke-primary"
								cx="18"
								cy="18"
								fill="none"
								r="16"
								strokeDasharray="33, 100"
								strokeLinecap="round"
								strokeWidth="4"
							/>
						</svg>
					</div>
				</div>
				<p className="text-on-surface-variant text-sm leading-relaxed">
					Please provide your delivery information to ensure your
					curated selection arrives safely at your doorstep.
				</p>
			</header>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="space-y-2">
					<label className="block text-xs font-bold uppercase tracking-widest text-primary ml-1">
						Full Name
					</label>
					<input
						name="fullName"
						value={form.fullName}
						onChange={handleChange}
						placeholder="Cameron Williamson"
						className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-colors py-4 px-1 text-on-surface placeholder:text-on-surface-variant/40 font-medium"
					/>
				</div>

				<div className="space-y-2">
					<label className="block text-xs font-bold uppercase tracking-widest text-primary ml-1">
						Street Address
					</label>
					<input
						name="streetAddress"
						value={form.streetAddress}
						onChange={handleChange}
						placeholder="2464 Royal Ln. Mesa"
						className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-colors py-4 px-1 text-on-surface placeholder:text-on-surface-variant/40 font-medium"
					/>
				</div>

				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="block text-xs font-bold uppercase tracking-widest text-primary ml-1">
							Apartment / Suite
						</label>
						<input
							name="apartment"
							value={form.apartment}
							onChange={handleChange}
							placeholder="Apt 4B"
							className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-colors py-4 px-1 text-on-surface placeholder:text-on-surface-variant/40 font-medium"
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-xs font-bold uppercase tracking-widest text-primary ml-1">
							City
						</label>
						<input
							name="city"
							value={form.city}
							onChange={handleChange}
							placeholder="New Jersey"
							className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-colors py-4 px-1 text-on-surface placeholder:text-on-surface-variant/40 font-medium"
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="block text-xs font-bold uppercase tracking-widest text-primary ml-1">
							Postal Code
						</label>
						<input
							name="postalCode"
							value={form.postalCode}
							onChange={handleChange}
							placeholder="45463"
							className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-colors py-4 px-1 text-on-surface placeholder:text-on-surface-variant/40 font-medium"
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-xs font-bold uppercase tracking-widest text-primary ml-1">
							Phone Number
						</label>
						<input
							name="phoneNumber"
							value={form.phoneNumber}
							onChange={handleChange}
							type="tel"
							placeholder="(201) 555-0124"
							className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none transition-colors py-4 px-1 text-on-surface placeholder:text-on-surface-variant/40 font-medium"
						/>
					</div>
				</div>

				{/* Delivery Speed */}
				<div className="bg-surface-container-low p-6 rounded-xl">
					<h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-4">
						Delivery Speed
					</h3>
					<div className="flex gap-4 overflow-x-auto hide-scrollbar">
						{(["standard", "express"] as const).map((speed) => (
							<label
								key={speed}
								className="flex-shrink-0 cursor-pointer">
								<input
									type="radio"
									name="delivery"
									value={speed}
									checked={delivery === speed}
									onChange={() => setDelivery(speed)}
									className="hidden"
								/>
								<div
									className={`px-6 py-4 rounded-xl bg-surface-container-lowest border-2 transition-all ${
										delivery === speed
											? "border-primary"
											: "border-transparent"
									}`}>
									<span className="block font-bold text-on-surface capitalize">
										{speed}
									</span>
									<span className="text-xs text-on-surface-variant">
										{speed === "standard"
											? "5-7 Business Days"
											: "2-3 Business Days"}
									</span>
									<span className="block mt-2 text-primary font-bold">
										{speed === "standard"
											? "Free"
											: "$15.00"}
									</span>
								</div>
							</label>
						))}
					</div>
				</div>

				{/* Order Total */}
				<div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient-sm">
					<div className="flex justify-between items-center mb-6">
						<span className="text-on-surface-variant">
							Order Total
						</span>
						<span className="text-2xl font-bold text-on-surface">
							{formatVND(orderTotal)}
						</span>
					</div>
					<button
						type="submit"
						className="btn w-full primary-gradient text-white border-0 rounded-xl normal-case font-bold tracking-widest uppercase shadow-ambient-sm active:scale-[0.98] transition-transform h-auto py-5 gap-2">
						Continue to Payment
						<span className="material-symbols-outlined text-[18px]">
							arrow_forward
						</span>
					</button>
				</div>
			</form>
		</>
	);
}

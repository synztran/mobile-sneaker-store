"use client";

import { formatVND } from "@/lib/currency";
import { toast } from "@/lib/toast";
import { useCartStore, useCheckoutStore } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Dummy QR code URL for demo purposes
const QR_CODE_URL =
	"https://lh3.googleusercontent.com/aida-public/AB6AXuAxAcft-d-5MIlA3Uo8qB-qjJ53z19qzWA53LfgKSApVHIxZbIXyGvQio5aybViZ5VbZInSgLE4z8iicsbJqJmHZy2f4D98ia0zLvSuB48wb-zF77-jzCtx8t6WCoXr65XekzvPzYSlN0Fo8DsIHEZs9JYPBofPfki3FMrTJ6FeNVzdHmrY22_mW-v6UZ9RItNgBCRlJNHNpdrYz1V6_XgK65fBhbBQi092QAZqiUsCdB3sarD2tGTXgo-x62hwxTlE493MVL6Jp58";

const BANK_INFO = [
	{ label: "Bank Name", value: "Premium Bank" },
	{ label: "Account Number", value: "1234 5678 9012 3456" },
	{ label: "Account Holder", value: "Kicks Enterprise Ltd." },
];

function copyToClipboard(value: string, label: string) {
	navigator.clipboard.writeText(value).then(() => {
		toast.success(`${label} copied!`);
	});
}

export default function PaymentPage() {
	const router = useRouter();
	const { orderId } = useCheckoutStore();
	const { items } = useCartStore();

	const handleCompleted = () => {
		router.push("/checkout/review");
	};

	return (
		<>
			{/* Progress indicator */}
			<div className="flex justify-between items-center mb-10 px-2">
				{[
					{ icon: "check", label: "Shipping", done: true },
					{ icon: "payments", label: "Payment", active: true },
					{ icon: "rate_review", label: "Review", done: false },
				].map(({ icon, label, done, active }: any) => (
					<div
						key={label}
						className="flex flex-col items-center gap-2">
						<div
							className={`w-${active ? "10" : "8"} h-${active ? "10" : "8"} rounded-full flex items-center justify-center ${
								active
									? "bg-primary shadow-ambient-sm scale-110 w-10 h-10"
									: done
										? "bg-surface-container-highest w-8 h-8"
										: "bg-surface-container-highest w-8 h-8"
							}`}>
							<span
								className={`material-symbols-outlined text-sm ${
									active
										? "text-white icon-filled"
										: "text-outline"
								}`}>
								{icon}
							</span>
						</div>
						<span
							className={`text-[10px] font-bold uppercase tracking-widest ${
								active ? "text-primary" : "text-outline"
							}`}>
							{label}
						</span>
					</div>
				))}
			</div>

			{/* QR Scan Section */}
			<section className="mb-8">
				<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
					Instant Checkout
				</h2>
				<div className="bg-surface-container-lowest rounded-5xl p-8 flex flex-col items-center shadow-ambient relative overflow-hidden group">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,219,207,0.3)_0%,transparent_70%)] blur-2xl" />
					<div className="bg-white p-4 rounded-2xl shadow-inner mb-6 relative z-10">
						<Image
							src={QR_CODE_URL}
							alt="Payment QR Code"
							width={192}
							height={192}
							className="w-48 h-48"
							unoptimized
						/>
					</div>
					<p className="text-on-surface font-bold text-lg mb-1 relative z-10">
						Scan to Pay
					</p>
					<p className="text-outline text-sm leading-relaxed text-center relative z-10">
						Open your banking app and scan this code to complete the
						transfer instantly.
					</p>
				</div>
			</section>

			{/* Bank Transfer */}
			<section className="mb-8">
				<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
					Manual Transfer
				</h2>
				<div className="bg-surface-container-low rounded-5xl p-6 space-y-6">
					{BANK_INFO.map(({ label, value }) => (
						<div
							key={label}
							className="flex items-center justify-between">
							<div>
								<p className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
									{label}
								</p>
								<p className="text-on-surface font-bold text-base">
									{value}
								</p>
							</div>
							<button
								onClick={() => copyToClipboard(value, label)}
								className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center active:scale-90 transition-transform hover:bg-surface-container-high">
								<span className="material-symbols-outlined text-primary text-xl">
									content_copy
								</span>
							</button>
						</div>
					))}
				</div>
			</section>

			{/* Notice */}
			<div className="bg-primary-fixed/20 rounded-2xl p-5 mb-8 flex gap-4 border border-primary-fixed/30">
				<div className="bg-primary-container text-white w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center">
					<span className="material-symbols-outlined icon-filled text-sm">
						info
					</span>
				</div>
				<p className="text-on-primary-fixed-variant text-sm leading-relaxed">
					<span className="font-bold">Important:</span> Please include
					your Order ID{" "}
					<span className="font-extrabold underline decoration-2 decoration-primary">
						{orderId}
					</span>{" "}
					in the payment reference for faster verification.
				</p>
			</div>

			{/* Your Selection */}
			{items.length > 0 && (
				<section className="mb-12">
					<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
						Your Selection
					</h2>
					<div className="flex gap-4 bg-surface-container-lowest p-4 rounded-3xl items-center">
						<div className="w-20 h-20 bg-surface-container rounded-2xl overflow-hidden relative flex-shrink-0">
							<Image
								src={items[0].product.images[0]}
								alt={items[0].product.name}
								fill
								className="object-contain p-2 -rotate-12 scale-110"
								unoptimized
							/>
						</div>
						<div>
							<h3 className="font-bold text-on-surface text-base">
								{items[0].product.name}
							</h3>
							<div className="flex items-center gap-2 mt-1">
								<span className="text-xs text-outline font-semibold">
									Size {items[0].size}
								</span>
								<span className="text-xs text-outline">·</span>
								<span className="text-xs text-outline font-semibold">
									{items[0].color.name}
								</span>
							</div>
							<p className="text-primary font-black mt-1">
								{formatVND(items[0].product.price)}
							</p>
						</div>
						{items.length > 1 && (
							<p className="ml-auto text-xs text-outline font-semibold pr-2">
								+{items.length - 1} more
							</p>
						)}
					</div>
				</section>
			)}

			<button
				onClick={handleCompleted}
				className="btn w-full primary-gradient text-white border-0 rounded-full normal-case font-bold text-base h-auto py-5 active:scale-[0.98] transition-transform shadow-ambient-sm">
				I have completed payment →
			</button>
			<p className="text-center text-xs text-outline mt-4 font-semibold uppercase tracking-widest">
				Secured by Sneaker Lab Checkout
			</p>
		</>
	);
}

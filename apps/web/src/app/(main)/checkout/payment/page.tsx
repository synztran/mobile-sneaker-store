"use client";

import Icon from "@/components/ui/Icon";
import { formatVND } from "@/lib/currency";
import { toast } from "@/lib/toast";
import { useCartStore, useCheckoutStore } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
	const [orderId, setOrderId] = useState("");
	useEffect(() => {
		setOrderId(`SNKR-${Math.floor(1000 + Math.random() * 9000)}`);
	}, []);
	const { items } = useCartStore();
	const { shipping, deliveryFee } = useCheckoutStore();

	const subtotal = items.reduce(
		(sum, i) => sum + i.product.price * i.quantity,
		0,
	);
	const orderTotal = subtotal + deliveryFee;

	const handleCompleted = () => {
		router.push("/checkout/review");
	};

	const buildQRBank = (message: string, paymentPrice: number) => {
		return `https://qr.sepay.vn/img?acc=${process.env.BANK_ACCOUNT_NUMBER}&bank=${process.env.BANK_NAME}&amount=${paymentPrice}&des=${message}&template=compact`;
	};

	return (
		<>
			{/* QR Scan Section */}
			<section className="mb-8">
				<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
					Instant Checkout
				</h2>
				<div className="bg-surface-container-lowest rounded-5xl p-8 flex flex-col items-center shadow-ambient relative overflow-hidden group">
					<div className="bg-white p-4 rounded-2xl mb-6 relative z-10 w-full h-64">
						<Image
							src={buildQRBank(
								`${orderId} - ${items.length} items`,
								items.reduce(
									(total, item) =>
										total +
										item.product.price * item.quantity,
									0,
								),
							)}
							alt="Payment QR Code"
							objectFit="contain"
							fill
							unoptimized
						/>
					</div>
					<p className="text-on-surface font-bold text-lg mb-1 relative z-10">
						Quét để thanh toán
					</p>
					{/* Amount breakdown */}
					<div className="w-full bg-surface-container rounded-2xl p-4 mt-3 relative z-10 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-on-surface-variant">
								Tạm tính
							</span>
							<span className="font-bold text-on-surface">
								{formatVND(subtotal)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-on-surface-variant">
								Phí vận chuyển
							</span>
							<span
								className={`font-bold ${deliveryFee === 0 ? "text-secondary" : "text-on-surface"}`}>
								{deliveryFee === 0
									? "Miễn phí"
									: formatVND(deliveryFee)}
							</span>
						</div>
						<div className="h-px bg-outline-variant/30" />
						<div className="flex justify-between">
							<span className="font-black text-on-surface">
								Tổng cộng
							</span>
							<span className="font-black text-primary text-lg">
								{formatVND(orderTotal)}
							</span>
						</div>
					</div>
					<p className="text-on-surface-variant text-sm leading-relaxed text-center relative z-10 mt-2">
						Mở ứng dụng ngân hàng và quét mã để hoàn tất thanh toán.
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
								<Icon
									name="content_copy"
									className="text-primary text-xl"
								/>
							</button>
						</div>
					))}
				</div>
			</section>

			{/* Notice */}
			<div className="bg-primary-fixed/20 rounded-2xl p-5 mb-8 flex gap-4 border border-primary-fixed/30">
				<div className="bg-primary-container text-white w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center">
					<Icon
						name="info"
						className="icon-filled text-sm text-white"
					/>
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
					<div className="space-y-3">
						{items.map((item) => (
							<div
								key={`${item.product.id}-${item.size}-${item.color.name}`}
								className="flex gap-4 bg-surface-container-lowest p-4 rounded-3xl items-center">
								<div className="w-16 h-16 bg-surface-container rounded-2xl overflow-hidden relative flex-shrink-0">
									<Image
										src={item.product.images[0]}
										alt={item.product.name}
										fill
										className="object-contain p-2"
										unoptimized
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-bold text-on-surface text-sm truncate">
										{item.product.name}
									</h3>
									<div className="flex items-center gap-2 mt-0.5">
										<span className="text-xs text-outline font-semibold">
											Size {item.size.label}
										</span>
										<span className="text-xs text-outline">
											·
										</span>
										<span className="text-xs text-outline font-semibold">
											{item.color.name}
										</span>
									</div>
									<p className="text-primary font-black mt-1 text-sm">
										{formatVND(item.product.price)}
									</p>
								</div>
								<span className="text-xs font-bold text-on-surface-variant bg-surface-container rounded-full px-2.5 py-1 flex-shrink-0">
									x{item.quantity}
								</span>
							</div>
						))}
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

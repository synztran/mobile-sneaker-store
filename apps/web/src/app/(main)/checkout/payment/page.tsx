"use client";

import type { SubmitPaymentResponse } from "@/app/api/checkout/submit/route";
import Icon from "@/components/ui/Icon";
import { useIsMounted } from "@/hooks/useIsMounted";
import { formatVND } from "@/lib/currency";
import { toast } from "@/lib/toast";
import { useCartStore, useCheckoutStore } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BANK_INFO = [
	{ label: "Ngân hàng", value: "Premium Bank" },
	{ label: "Số tài khoản", value: "1234 5678 9012 3456" },
	{ label: "Chủ tài khoản", value: "Kicks Enterprise Ltd." },
	{ id: "payment_content", label: "Nội dung", value: "{t}" },
];

function copyToClipboard(value: string, label: string) {
	navigator.clipboard.writeText(value).then(() => {
		toast.success(`${label} đã sao chép!`);
	});
}

export default function PaymentPage() {
	const router = useRouter();
	const mounted = useIsMounted();
	const [orderRef, setOrderRef] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		setOrderRef(`SNKR-${Math.floor(10000 + Math.random() * 90000)}`);
	}, []);

	const { items: rawItems, clearCart, cartId } = useCartStore();
	const {
		shipping,
		deliveryFee: rawDeliveryFee,
		setOrder,
	} = useCheckoutStore();

	const items = mounted ? rawItems : [];
	const deliveryFee = mounted ? rawDeliveryFee : 0;

	const subtotal = items.reduce(
		(sum, i) => sum + i.product.price * i.quantity,
		0,
	);
	const orderTotal = subtotal + deliveryFee;

	if (!mounted) {
		return (
			<div className="animate-pulse space-y-6">
				<div className="h-4 w-32 bg-surface-container rounded-full" />
				<div className="bg-surface-container-lowest rounded-5xl p-8 flex flex-col items-center gap-4">
					<div className="w-full h-64 bg-surface-container rounded-2xl" />
					<div className="w-full h-24 bg-surface-container rounded-2xl" />
				</div>
				<div className="h-4 w-48 bg-surface-container rounded-full" />
				<div className="bg-surface-container-low rounded-5xl p-6 space-y-6">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="flex justify-between items-center">
							<div className="space-y-1.5">
								<div className="h-2.5 w-24 bg-surface-container rounded-full" />
								<div className="h-4 w-40 bg-surface-container rounded-full" />
							</div>
							<div className="w-10 h-10 rounded-full bg-surface-container" />
						</div>
					))}
				</div>
				<div className="h-14 rounded-full bg-surface-container" />
			</div>
		);
	}

	const buildQRBank = (message: string, paymentPrice: number) => {
		return `https://qr.sepay.vn/img?acc=${process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER}&bank=${process.env.NEXT_PUBLIC_BANK_NAME}&amount=${paymentPrice}&des=${message}&template=compact`;
	};

	const handleCompleted = async () => {
		setSubmitting(true);
		try {
			const res = await fetch("/api/checkout/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					cart_id: cartId,
					total_amount: orderTotal,
					delivery_fee: deliveryFee,
					shipping,
					items: items.map((i) => ({
						variant_id: i.size.id,
						quantity: i.quantity,
						price: i.product.price,
					})),
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error ?? "Không thể gửi đơn hàng");
				setSubmitting(false);
				return;
			}
			const result = data as SubmitPaymentResponse;
			setOrder(
				result.order_id,
				result.order_code,
				result.transaction_id,
				result.submitted_at,
				orderTotal,
				items,
			);
			clearCart();
			router.push(`/checkout/checking/${result.order_id}`);
		} catch {
			toast.error("Lỗi kết nối, vui lòng thử lại");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			{/* QR Scan Section */}
			<section className="mb-8">
				<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
					Chuyển khoản QR
				</h2>
				<div className="bg-surface-container-lowest rounded-5xl p-8 flex flex-col items-center shadow-ambient relative overflow-hidden group">
					<div className="bg-white p-4 rounded-2xl mb-6 relative z-10 w-full h-64">
						<Image
							src={buildQRBank(
								`${orderRef} - ${items.length} items`,
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
					Thông tin và nội dung chuyển khoản
				</h2>
				<div className="bg-surface-container-low rounded-5xl p-6 space-y-6">
					{BANK_INFO.map(({ id, label, value }) => (
						<div
							key={label}
							className="flex items-center justify-between">
							<div>
								<p className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
									{label}
								</p>
								<p className="text-on-surface font-bold text-base">
									{id === "payment_content"
										? value.replace("{t}", orderRef)
										: value}
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
			<div className="bg-primary-fixed/20 rounded-2xl p-5 mb-8 flex gap-2 border border-primary-fixed/30">
				<div className="bg-primary-container text-white w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center">
					<Icon
						name="info"
						className="icon-filled text-sm text-white"
					/>
				</div>
				<p className="text-on-primary-fixed-variant text-sm leading-relaxed">
					<span className="font-bold">Lưu ý:</span> Vui lòng kiểm tra{" "}
					<br />
					Mã đơn hàng{" "}
					<span className="font-extrabold underline decoration-2 decoration-primary">
						{orderRef}
					</span>{" "}
					trong nội dung chuyển khoản để xác nhận nhanh hơn.
				</p>
			</div>

			{/* Your Selection */}
			{items.length > 0 && (
				<section className="mb-12">
					<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
						Đơn hàng của bạn
					</h2>
					<div className="space-y-3">
						{items.map((item) => (
							<div
								key={`${item.product.id}-${item.size.id}-${item.color.id}`}
								className="flex gap-4 bg-surface-container-lowest p-4 rounded-3xl items-center">
								<div className="w-16 h-16 bg-surface-container rounded-2xl overflow-hidden relative flex-shrink-0">
									<Image
										src={item.product.images[0]}
										alt={item.product.name}
										fill
										className="object-contain p-2 mix-blend-darken"
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
				disabled={submitting}
				className="btn w-full primary-gradient text-white border-0 rounded-full normal-case font-bold text-base h-auto py-5 active:scale-[0.98] transition-transform shadow-ambient-sm disabled:opacity-60">
				{submitting ? (
					<span className="loading loading-spinner loading-sm" />
				) : (
					"Tôi đã chuyển khoản →"
				)}
			</button>
		</>
	);
}

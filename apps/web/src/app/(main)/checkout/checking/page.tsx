"use client";

import Icon from "@/components/ui/Icon";
import { useIsMounted } from "@/hooks/useIsMounted";
import { formatVND } from "@/lib/currency";
import { useCheckoutStore } from "@/store";
import { Heart, MessageCircleMore } from "lucide-react";
import Link from "next/link";

export default function CheckingPage() {
	const mounted = useIsMounted();
	const { orderCode, transactionId, submittedAt, totalAmount, orderedItems } =
		useCheckoutStore();

	if (!mounted) {
		return (
			<div className="animate-pulse space-y-5">
				<div className="h-32 bg-surface-container rounded-3xl" />
				<div className="h-48 bg-surface-container rounded-3xl" />
				<div className="h-14 bg-surface-container rounded-full" />
			</div>
		);
	}

	const formattedDate = submittedAt
		? new Date(submittedAt).toLocaleString("vi-VN", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			})
		: "—";
	return (
		<div className="space-y-6">
			{/* Status card */}
			<div className="bg-surface-container-lowest rounded-3xl p-6 flex flex-col items-center text-center gap-4">
				{/* Animated status badge */}
				<div className="relative">
					<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
						<div className="w-16 h-16 rounded-full bg-primary/10 absolute animate-ping" />
						{/* <Icon
							name="hourglass_top"
							className="text-primary text-3xl relative z-10"
						/> */}
						<span className="loading loading-spinner text-accent"></span>
					</div>
				</div>
				<div>
					<p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">
						Trạng thái đơn hàng
					</p>
					<h2 className="text-xl font-black text-on-surface tracking-tight">
						Đang kiểm tra thanh toán
					</h2>
				</div>
				{orderCode && (
					<div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-2">
						<p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
							Mã đơn hàng
						</p>
						<p className="text-lg font-black text-primary tracking-widest">
							{orderCode}
						</p>
					</div>
				)}
			</div>

			{/* Payment summary */}
			<div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
				<h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">
					Thông tin thanh toán
				</h3>

				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<span className="text-sm text-on-surface-variant font-medium">
							Tổng tiền chuyển khoản
						</span>
						<span className="font-black text-primary text-base">
							{formatVND(totalAmount)}
						</span>
					</div>

					<div className="flex justify-between items-start">
						<span className="text-sm text-on-surface-variant font-medium">
							Mã giao dịch
						</span>
						<span className="font-bold text-on-surface text-sm text-right max-w-[55%] break-all">
							{transactionId || "—"}
						</span>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-sm text-on-surface-variant font-medium">
							Thời gian thanh toán
						</span>
						<span className="font-bold text-on-surface text-sm">
							{formattedDate}
						</span>
					</div>
				</div>
			</div>

			{/* Ordered items */}
			{orderedItems.length > 0 && (
				<div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
					<h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">
						Sản phẩm đã đặt
					</h3>
					<div className="space-y-3">
						{orderedItems.map((item, idx) => (
							<div
								key={`${item.product.id}-${item.size.id}-${item.color.id}-${idx}`}
								className="flex items-center gap-3">
								{item.product.images?.[0] && (
									<div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0">
										<img
											src={item.product.images[0]}
											alt={item.product.name}
											className="w-full h-full object-contain mix-blend-darken"
										/>
									</div>
								)}
								<div className="flex-1 min-w-0">
									<p className="font-bold text-on-surface text-sm truncate">
										{item.product.name}
									</p>
									<p className="text-xs text-on-surface-variant">
										{item.color.name} · {item.size.label}{" "}
										{item.size.gender}
									</p>
								</div>
								<div className="text-right flex-shrink-0">
									<p className="font-black text-on-surface text-sm">
										{formatVND(
											item.product.price * item.quantity,
										)}
									</p>
									<p className="text-xs text-on-surface-variant">
										x{item.quantity}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Thank you message */}
			<div className="bg-primary/5 border border-primary/15 rounded-3xl p-4 flex justify-start gap-2">
				<Heart size={20} className="w-20 m-0.5" />
				<p className="text-on-surface text-sm leading-relaxed">
					<span className="font-black">
						Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của
						chúng tôi.
						<br />
					</span>{" "}
					Hệ thống đang kiểm tra thanh toán và sẽ phản hồi sớm nhất có
					thể. Quý khách có thể kiểm tra trạng thái đơn hàng trong mục{" "}
					<Link
						href="/profile/orders"
						className="font-bold text-primary">
						Đơn hàng của tôi
					</Link>
					.
				</p>
			</div>

			{/* Support button */}
			<a
				href="https://zalo.me/0000000000"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center justify-center gap-3 w-full bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4 active:scale-[0.98] transition-transform">
				<MessageCircleMore />
				<div className="text-left">
					<p className="font-bold text-on-surface text-sm">
						Liên hệ hỗ trợ
					</p>
					<p className="text-xs text-on-surface-variant">
						Zalo / Chat trực tiếp với nhân viên
					</p>
				</div>
				<Icon
					name="chevron_right"
					className="text-outline-variant ml-auto"
				/>
			</a>

			{/* Back to home */}
			{/* <Link
				href="/"
				className="flex items-center justify-center gap-2 text-sm text-on-surface-variant font-semibold py-2">
				<Icon name="home" className="text-base" />
				Về trang chủ
			</Link> */}
		</div>
	);
}

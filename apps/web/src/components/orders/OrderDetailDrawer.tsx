"use client";

import type { OrderDetail } from "@/app/api/user/orders/[id]/route";
import { formatVND } from "@/lib/currency";
import {
	CalendarDays,
	CheckCircle2,
	CircleX,
	Hash,
	HourglassIcon,
	MapPin,
	PackageCheck,
	Phone,
	Truck,
	X,
	Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const STATUS_CONFIG: Record<
	string,
	{ label: string; Icon: React.ElementType; color: string; bg: string }
> = {
	pending: {
		label: "Chờ xác nhận",
		Icon: HourglassIcon,
		color: "text-amber-600",
		bg: "bg-amber-50",
	},
	paid: {
		label: "Đã thanh toán",
		Icon: CheckCircle2,
		color: "text-emerald-600",
		bg: "bg-emerald-50",
	},
	shipped: {
		label: "Đang vận chuyển",
		Icon: Truck,
		color: "text-blue-600",
		bg: "bg-blue-50",
	},
	delivered: {
		label: "Đã giao hàng",
		Icon: PackageCheck,
		color: "text-primary",
		bg: "bg-primary/5",
	},
	cancelled: {
		label: "Đã hủy",
		Icon: CircleX,
		color: "text-error",
		bg: "bg-error/5",
	},
};

const SPEED_LABEL: Record<string, string> = {
	standard: "Tiêu chuẩn",
	express: "Hỏa tốc",
	shipment: "Đơn vị vận chuyển",
};

interface Props {
	orderId: number | null;
	onClose: () => void;
}

export function OrderDetailDrawer({ orderId, onClose }: Props) {
	const [detail, setDetail] = useState<OrderDetail | null>(null);
	const [loading, setLoading] = useState(false);
	const isOpen = orderId !== null;

	useEffect(() => {
		if (!isOpen) {
			setDetail(null);
			return;
		}
		setLoading(true);
		fetch(`/api/user/orders/${orderId}`)
			.then((r) => r.json())
			.then((d) => setDetail(d))
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [orderId, isOpen]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const formatDate = (iso: string | null) => {
		if (!iso) return "—";
		return new Date(iso).toLocaleString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const cfg = detail
		? (STATUS_CONFIG[detail.status] ?? STATUS_CONFIG.pending)
		: null;

	console.log("detail", detail);
	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-[60] transition-opacity duration-300 !mt-0 ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
			/>

			{/* Drawer */}
			<div
				className={`fixed left-0 right-0 z-[999] bg-surface rounded-t-5xl max-h-[85vh] flex flex-col transition-all duration-250 ease-out ${
					isOpen ? "bottom-0" : "-bottom-full"
				}`}
				style={{ height: "85vh" }}>
				{/* Handle */}
				<div className="flex justify-center pt-3 pb-1 flex-shrink-0">
					<div className="w-10 h-1 bg-outline-variant rounded-full" />
				</div>

				{/* Header */}
				<div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-outline-variant/20">
					<div>
						<p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
							Chi tiết đơn hàng
						</p>
						<p className="font-black text-primary tracking-widest text-base">
							{detail?.order_code ??
								(loading ? "…" : `#${orderId}`)}
						</p>
					</div>
					<button
						onClick={onClose}
						className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center active:scale-90 transition-transform">
						<X size={18} className="text-on-surface" />
					</button>
				</div>

				{/* Scrollable body */}
				<div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
					{loading ? (
						<div className="animate-pulse space-y-4">
							<div className="h-14 bg-surface-container rounded-2xl" />
							<div className="h-28 bg-surface-container rounded-2xl" />
							<div className="space-y-3">
								{[1, 2].map((i) => (
									<div key={i} className="flex gap-3">
										<div className="w-16 h-16 bg-surface-container rounded-2xl flex-shrink-0" />
										<div className="flex-1 space-y-2 pt-1">
											<div className="h-3 bg-surface-container rounded-full w-3/4" />
											<div className="h-3 bg-surface-container rounded-full w-1/2" />
										</div>
									</div>
								))}
							</div>
						</div>
					) : detail ? (
						<>
							{/* Status + timeline */}
							{(() => {
								const StatusIcon = cfg!.Icon;
								return (
									<div
										className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${cfg!.bg}`}>
										<StatusIcon
											size={22}
											className={cfg!.color}
										/>
										<div>
											<p
												className={`font-black text-sm ${cfg!.color}`}>
												{cfg!.label}
											</p>
											<p className="text-xs text-on-surface-variant">
												{formatDate(
													detail.submitted_at ??
														detail.created_at,
												)}
											</p>
										</div>
									</div>
								);
							})()}

							{/* Transaction ID */}
							{detail.transaction_id && (
								<div className="bg-surface-container rounded-2xl px-4 py-3 flex items-center gap-2">
									<Hash
										size={14}
										className="text-outline-variant flex-shrink-0"
									/>
									<div>
										<p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
											Mã giao dịch
										</p>
										<p className="font-mono text-xs text-on-surface font-bold">
											{detail.transaction_id}
										</p>
									</div>
								</div>
							)}

							{/* Shipping address */}
							{detail.shipping_address && (
								<div className="bg-surface-container rounded-2xl px-4 py-3 space-y-2">
									<p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
										Địa chỉ giao hàng
									</p>
									{detail.shipping_address.fullName && (
										<p className="font-bold text-on-surface text-sm">
											{detail.shipping_address.fullName}
										</p>
									)}
									{detail.shipping_address.streetAddress && (
										<p className="text-sm text-on-surface-variant flex items-start gap-1.5">
											<MapPin
												size={16}
												className="flex-shrink-0 mt-1"
											/>
											{
												detail.shipping_address
													.streetAddress
											}
											{detail.shipping_address
												.apartment &&
												`, ${detail.shipping_address.apartment}`}
											{detail.shipping_address.city &&
												`, ${detail.shipping_address.city}`}
										</p>
									)}
									{detail.shipping_address.phoneNumber && (
										<p className="text-sm text-on-surface-variant flex items-center gap-1.5">
											<Phone
												size={16}
												className="flex-shrink-0 mt-0.5"
											/>
											{
												detail.shipping_address
													.phoneNumber
											}
										</p>
									)}
									{detail.shipping_address.deliverySpeed && (
										<p className="text-sm text-on-surface-variant flex items-center gap-1.5">
											<Zap
												size={16}
												className="flex-shrink-0 mt-0.5"
											/>
											{SPEED_LABEL[
												detail.shipping_address
													.deliverySpeed
											] ??
												detail.shipping_address
													.deliverySpeed}
										</p>
									)}
								</div>
							)}

							{/* Order items */}
							{detail.items.length > 0 && (
								<div className="space-y-2">
									<p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
										Sản phẩm ({detail.items.length})
									</p>
									{detail.items.map((item) => (
										<div
											key={item.id}
											className="bg-surface-container-lowest rounded-2xl p-3 flex gap-3 items-center">
											<div className="w-16 h-16 bg-surface-container rounded-xl overflow-hidden relative flex-shrink-0">
												{item.product_image ? (
													<Image
														src={item.product_image}
														alt={
															item.product_name ??
															""
														}
														fill
														className="object-contain p-1 mix-blend-darken"
														unoptimized
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<PackageCheck
															size={24}
															className="text-outline-variant"
														/>
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-bold text-on-surface text-sm truncate">
													{item.product_name ??
														`Variant #${item.variant_id}`}
												</p>
												<p className="text-xs text-on-surface-variant mt-0.5">
													{item.size_label ? (
														<span>
															Size:{" "}
															{item.size_label}
														</span>
													) : null}
													{item.color_name ? (
														<span>
															Color:{" "}
															{item.color_name}
														</span>
													) : null}
												</p>
												<div className="flex items-center justify-between mt-1.5">
													<span className="text-xs text-on-surface-variant">
														x{item.quantity}
													</span>
													<span className="font-black text-primary text-sm">
														{formatVND(
															item.price_at_purchase *
																item.quantity,
														)}
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Price summary */}
							<div className="bg-surface-container rounded-2xl px-4 py-3 space-y-2">
								<p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">
									Tổng cộng
								</p>
								<div className="flex justify-between text-sm">
									<span className="text-on-surface-variant">
										Tạm tính
									</span>
									<span className="font-bold text-on-surface">
										{formatVND(
											detail.items.reduce(
												(s, i) =>
													s +
													i.price_at_purchase *
														i.quantity,
												0,
											),
										)}
									</span>
								</div>
								<div className="h-px bg-outline-variant/30" />
								<div className="flex justify-between">
									<span className="font-black text-on-surface">
										Tổng đơn hàng
									</span>
									<span className="font-black text-primary text-base">
										{formatVND(detail.total_amount)}
									</span>
								</div>
							</div>

							{/* Order date */}
							<div className="flex items-center gap-2 text-xs text-on-surface-variant pb-4">
								<CalendarDays size={12} />
								<span>
									Đặt lúc {formatDate(detail.created_at)}
								</span>
							</div>
						</>
					) : (
						<div className="flex items-center justify-center py-20 text-on-surface-variant text-sm">
							Không thể tải chi tiết đơn hàng
						</div>
					)}
				</div>
			</div>
		</>
	);
}

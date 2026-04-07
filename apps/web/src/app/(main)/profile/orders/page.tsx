"use client";

import type { OrderSummary } from "@/app/api/user/orders/route";
import { OrderDetailDrawer } from "@/components/orders/OrderDetailDrawer";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatVND } from "@/lib/currency";
import {
	ArrowLeft,
	CalendarDays,
	CheckCircle2,
	CircleX,
	Hash,
	HourglassIcon,
	MapPin,
	PackageCheck,
	ReceiptText,
	Search,
	Truck,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STATUS_CONFIG: Record<
	string,
	{
		label: string;
		Icon: React.ElementType;
		color: string;
		bg: string;
	}
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

function StatusBadge({ status }: { status: string }) {
	const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
			<cfg.Icon size={10} />
			{cfg.label}
		</span>
	);
}

function OrderSkeleton() {
	return (
		<div className="animate-pulse space-y-3">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="bg-surface-container rounded-3xl p-4 space-y-3">
					<div className="flex justify-between">
						<div className="h-4 w-28 bg-surface-container-high rounded-full" />
						<div className="h-4 w-20 bg-surface-container-high rounded-full" />
					</div>
					<div className="h-3 w-40 bg-surface-container-high rounded-full" />
					<div className="flex justify-between">
						<div className="h-3 w-24 bg-surface-container-high rounded-full" />
						<div className="h-3 w-16 bg-surface-container-high rounded-full" />
					</div>
				</div>
			))}
		</div>
	);
}

export default function OrdersPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();

	const [orders, setOrders] = useState<OrderSummary[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");
	const [debouncedQ, setDebouncedQ] = useState("");
	const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

	// Debounce search
	useEffect(() => {
		const t = setTimeout(() => setDebouncedQ(q), 350);
		return () => clearTimeout(t);
	}, [q]);

	const fetchOrders = useCallback(
		async (search: string) => {
			setLoading(true);
			try {
				const params = new URLSearchParams();
				if (search) params.set("q", search);
				const res = await fetch(`/api/user/orders?${params}`);
				if (res.status === 401) {
					router.push("/login");
					return;
				}
				if (!res.ok) return;
				const data = await res.json();
				setOrders(data.orders);
				setTotal(data.total);
			} finally {
				setLoading(false);
			}
		},
		[router],
	);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
		}
	}, [authLoading, user, router]);

	useEffect(() => {
		if (!authLoading && user) {
			fetchOrders(debouncedQ);
		}
	}, [authLoading, user, debouncedQ, fetchOrders]);

	const formatDate = (iso: string | null) => {
		if (!iso) return "—";
		return new Date(iso).toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	return (
		<div className="px-4 pt-2 pb-24 space-y-5">
			{/* Header */}
			<div className="flex items-center gap-3 mb-2">
				<Link
					href="/profile"
					className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center active:scale-90 transition-transform">
					<ArrowLeft size={18} className="text-on-surface" />
				</Link>
				<div>
					<h1 className="text-xl font-black text-on-surface tracking-tight">
						Đơn hàng của tôi
					</h1>
					{!loading ? (
						<p className="text-xs text-on-surface-variant">
							{total} đơn hàng
						</p>
					) : (
						<div className="h-3 w-16 bg-surface-container-high rounded-full mt-1" />
					)}
				</div>
			</div>

			{/* Search */}
			<div className="flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-primary transition-all">
				<Search
					size={18}
					className="text-outline-variant flex-shrink-0"
				/>
				<input
					type="text"
					placeholder="Tìm theo mã đơn, mã giao dịch..."
					value={q}
					onChange={(e) => setQ(e.target.value)}
					className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/40 font-medium text-sm"
				/>
				{q && (
					<button onClick={() => setQ("")}>
						<X size={18} className="text-outline-variant" />
					</button>
				)}
			</div>

			{/* List */}
			{loading || authLoading ? (
				<OrderSkeleton />
			) : orders.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 gap-4">
					<div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
						<ReceiptText
							size={28}
							className="text-outline-variant"
						/>
					</div>
					<p className="text-on-surface-variant font-semibold text-sm">
						{q ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng nào"}
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{orders.map((order) => (
						<button
							key={order.id}
							onClick={() => setSelectedOrderId(order.id)}
							className="w-full text-left bg-surface-container-lowest rounded-3xl p-4 space-y-3 shadow-ambient-sm active:scale-[0.99] transition-transform">
							{/* Row 1: order code + status */}
							<div className="flex items-center justify-between gap-2">
								<span className="font-black text-primary tracking-widest text-sm">
									{order.order_code ?? `#${order.id}`}
								</span>
								<StatusBadge status={order.status} />
							</div>

							{/* Row 2: date + city */}
							<div className="flex items-center gap-3 text-xs text-on-surface-variant">
								<span className="flex items-center gap-1">
									<CalendarDays size={11} />
									{formatDate(
										order.submitted_at ?? order.created_at,
									)}
								</span>
								{order.shipping_address?.city && (
									<>
										<span className="text-outline-variant">
											·
										</span>
										<span className="flex items-center gap-1">
											<MapPin size={11} />
											{order.shipping_address.city}
										</span>
									</>
								)}
								{order.shipping_address?.fullName && (
									<>
										<span className="text-outline-variant">
											·
										</span>
										<span className="truncate max-w-[100px]">
											{order.shipping_address.fullName}
										</span>
									</>
								)}
							</div>

							{/* Row 3: items count + total */}
							<div className="flex items-center justify-between">
								<span className="text-xs text-on-surface-variant font-medium">
									{order.item_count} sản phẩm
								</span>
								<span className="font-black text-on-surface text-base">
									{formatVND(order.total_amount)}
								</span>
							</div>

							{/* Row 4: transaction id */}
							{order.transaction_id && (
								<div className="bg-surface-container rounded-xl px-3 py-1.5 flex items-center gap-2">
									<Hash
										size={11}
										className="text-outline-variant flex-shrink-0"
									/>
									<span className="text-[10px] text-on-surface-variant font-mono truncate">
										{order.transaction_id}
									</span>
								</div>
							)}
						</button>
					))}
				</div>
			)}

			<OrderDetailDrawer
				orderId={selectedOrderId}
				onClose={() => setSelectedOrderId(null)}
			/>
		</div>
	);
}

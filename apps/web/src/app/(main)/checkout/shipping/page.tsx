"use client";

import Icon from "@/components/ui/Icon";
import { VIETNAM_CITIES } from "@/constants/vietnam-cities";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatVND } from "@/lib/currency";
import { Fee } from "@/lib/supabase/database.types";
import { toast } from "@/lib/toast";
import { useCartStore, useCheckoutStore } from "@/store";
import clsx from "clsx";
import { Motorbike } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const FIELDS = [
	{
		name: "fullName",
		label: "Họ và tên",
		placeholder: "Nguyễn Văn A",
		icon: "person",
		type: "text",
		required: true,
		colSpan: 2,
	},
	{
		name: "streetAddress",
		label: "Địa chỉ",
		placeholder: "123 Đường Nguyễn Huệ, Quận 1",
		icon: "home",
		type: "text",
		required: true,
		colSpan: 2,
	},
	{
		name: "apartment",
		label: "Căn hộ / Tầng",
		placeholder: "Tầng 4B",
		icon: "apartment",
		type: "text",
		required: false,
		colSpan: 2,
	},
	{
		name: "postalCode",
		label: "Mã bưu điện",
		placeholder: "70000",
		icon: "markunread_mailbox",
		type: "text",
		required: false,
		colSpan: 1,
	},
	{
		name: "phoneNumber",
		label: "Số điện thoại",
		placeholder: "0901 234 567",
		icon: "phone",
		type: "tel",
		required: false,
		colSpan: 1,
	},
] as const;

const mappingDisplayPrice = {
	0: "Miễn phí",
	null: "Cập nhật sau",
};

type FieldName = (typeof FIELDS)[number]["name"];
type FormData = Record<FieldName, string> & { city: string };

const HCM_CITY = "TP. Hồ Chí Minh";

const DELIVERY_OPTIONS = [
	{
		id: "standard" as const,
		label: "Tiêu chuẩn",
		sublabel: "12-24 giờ xử lý",
		icon: Motorbike,
		price: 0,
		tag: null,
		isHidden: false,
	},
	{
		id: "express" as const,
		label: "Hỏa tốc",
		sublabel: "2-4 giờ xử lý",
		icon: "bolt",
		price: null as number | null, // resolved dynamically from fees
		tag: "NHANH",
		isHidden: false,
	},
	{
		id: "shipment" as const,
		label: "Đơn vị vận chuyển",
		sublabel: "Giao bởi đơn vị vận chuyển",
		icon: "local_shipping",
		price: null as number | null, // resolved dynamically from fees
		isHidden: true,
	},
];

export default function ShippingPage() {
	const router = useRouter();
	const { setShipping } = useCheckoutStore();
	const { total } = useCartStore();
	const { shipping } = useCheckoutStore();
	const { profile } = useAuth();
	const [mounted, setMounted] = useState(false);
	const [delivery, setDelivery] = useState<
		"standard" | "express" | "shipment"
	>("standard");
	const [fees, setFees] = useState<Fee | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		fetch("/api/fees")
			.then((r) => r.json())
			.then((data: Fee) => setFees(data))
			.catch(() => null);
	}, []);

	useEffect(() => {
		setForm((f) => ({
			...f,
			fullName: shipping?.fullName ?? profile?.full_name ?? "",
			phoneNumber: shipping?.phoneNumber ?? profile?.phone_number ?? "",
			city: shipping?.city ?? "",
			apartment: shipping?.apartment ?? "",
			postalCode: shipping?.postalCode ?? "",
			streetAddress: shipping?.streetAddress ?? "",
			deliverySpeed: shipping?.deliverySpeed ?? "standard",
		}));
	}, [profile, shipping]);
	const [form, setForm] = useState<FormData>({
		fullName: profile?.full_name ?? "",
		streetAddress: "",
		apartment: "",
		city: "",
		postalCode: "",
		phoneNumber: profile?.phone_number ?? "",
	});

	const [cityTouched, setCityTouched] = useState(false);

	const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
		{},
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setTouched({ ...touched, [e.target.name]: true });
	};

	const isInvalid = (field: (typeof FIELDS)[number]) =>
		field.required && touched[field.name] && !form[field.name].trim();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const allTouched = Object.fromEntries(
			FIELDS.map((f) => [f.name, true]),
		) as Record<FieldName, boolean>;
		setTouched(allTouched);
		setCityTouched(true);

		if (!form.fullName || !form.streetAddress || !form.city) {
			toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
			return;
		}
		setShipping({ ...form, deliverySpeed: delivery }, shippingCost);
		router.push("/checkout/payment");
	};

	const immediateFee = mounted ? (fees?.delivery_immediate_price ?? 0) : 0;
	const basicFee = mounted ? (fees?.delivery_basic_price ?? 0) : 0;
	const subtotal = mounted ? total() : 0;

	const isHCM = form.city && form.city === HCM_CITY;
	const shippingCost = delivery === "express" ? immediateFee : basicFee;
	const orderTotal = subtotal + shippingCost;

	const mappingFees: Record<"express" | "standard", number> = {
		express: immediateFee,
		standard: basicFee,
	};

	const deliveryOptions = useMemo(() => {
		return DELIVERY_OPTIONS.map((opt) => {
			const hasFee = opt.id in mappingFees;
			const fee = hasFee
				? mappingFees[opt.id as keyof typeof mappingFees]
				: opt.price;
			return {
				...opt,
				price: fee,
				isHidden: isHCM ? opt.isHidden : !opt.isHidden, // shipment option only available for non-HCM cities
			};
		});
	}, [immediateFee, basicFee, isHCM]);

	return (
		<div className="space-y-8">
			{/* ── Hero header ─────────────────────────────────────────── */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-surface-container to-surface-container-low p-6">
				<div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
				<div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl pointer-events-none" />
				<div className="relative flex items-center gap-4">
					<div className="w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center shadow-ambient-sm flex-shrink-0">
						<Icon
							name="local_shipping"
							className="text-white text-2xl"
						/>
					</div>
					<div>
						<p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">
							Bước 01 / 03
						</p>
						<h2 className="text-2xl font-black text-on-surface tracking-tight">
							Thông tin giao hàng
						</h2>
						<p className="text-xs text-on-surface-variant mt-0.5">
							Nhập địa chỉ nhận hàng của bạn
						</p>
					</div>
				</div>
				{/* Progress bar */}
				<div className="mt-5 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
					<div className="h-full w-1/3 primary-gradient rounded-full" />
				</div>
			</div>

			{/* ── Address form ─────────────────────────────────────────── */}
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					{FIELDS.map((field) => (
						<div
							key={field.name}
							className={
								field.colSpan === 2
									? "col-span-2"
									: "col-span-1"
							}>
							<label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
								{field.label}
								{field.required && (
									<span className="text-primary ml-0.5">
										*
									</span>
								)}
							</label>
							<div
								className={clsx(
									"flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 border-2 transition-all",
									isInvalid(field)
										? "border-error"
										: "border-transparent focus-within:border-primary",
								)}>
								<Icon
									name={String(field.icon)}
									className={clsx(
										"text-xl flex-shrink-0 transition-colors",
										isInvalid(field)
											? "text-error"
											: "text-outline-variant",
									)}
								/>
								<input
									name={field.name}
									value={form[field.name]}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder={field.placeholder}
									type={field.type}
									autoComplete="off"
									className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/40 font-medium text-sm min-w-0"
								/>
								{form[field.name] && !isInvalid(field) && (
									<Icon
										name="check_circle"
										className="text-base text-primary flex-shrink-0"
									/>
								)}
							</div>
							{isInvalid(field) && (
								<p className="text-error text-[10px] font-bold mt-1 ml-1">
									Trường này là bắt buộc
								</p>
							)}
						</div>
					))}
				</div>

				{/* ── City select ─────────────────────────────────────── */}
				<div>
					<label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
						Tỉnh / Thành phố
						<span className="text-primary ml-0.5">*</span>
					</label>
					<div
						className={clsx(
							"flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3.5 border-2 transition-all",
							cityTouched && !form.city
								? "border-error"
								: "border-transparent focus-within:border-primary",
						)}>
						<Icon
							name="location_city"
							className={clsx(
								"text-xl flex-shrink-0 transition-colors",
								cityTouched && !form.city
									? "text-error"
									: "text-outline-variant",
							)}
						/>
						<select
							value={form.city}
							onChange={(e) => {
								const city = e.target.value;
								setForm({ ...form, city });
								if (city !== HCM_CITY) {
									setDelivery("shipment");
								} else if (delivery === "shipment") {
									setDelivery("standard");
								}
							}}
							onBlur={() => setCityTouched(true)}
							className="flex-1 bg-transparent outline-none text-on-surface font-medium text-sm appearance-none cursor-pointer">
							<option value="" disabled>
								Chọn tỉnh / thành phố
							</option>
							{VIETNAM_CITIES.map((c) => (
								<option key={c.code} value={c.name}>
									{c.name}
								</option>
							))}
						</select>
						{form.city && (
							<Icon
								name="check_circle"
								className="text-base text-primary flex-shrink-0"
							/>
						)}
					</div>
					{cityTouched && !form.city && (
						<p className="text-error text-[10px] font-bold mt-1 ml-1">
							Vui lòng chọn tỉnh / thành phố
						</p>
					)}
					{form.city && form.city !== HCM_CITY && (
						<p className="text-xs font-bold mt-1 ml-1 text-on-surface-variant">
							⚠️ Khu vực ngoài TP.HCM — chỉ giao hàng bởi đơn vị
							vận chuyển
						</p>
					)}
				</div>

				{/* ── Delivery speed ───────────────────────────────────── */}
				<div className="space-y-3">
					<p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
						Phương thức giao hàng
					</p>
					<div className="space-y-3">
						{deliveryOptions.map((opt) => {
							return (
								<button
									key={opt.id}
									type="button"
									disabled={opt.isHidden}
									onClick={() =>
										!opt.isHidden && setDelivery(opt.id)
									}
									className={clsx(
										"w-full flex items-center gap-4 rounded-2xl p-4 border-2 transition-all",
										opt.isHidden && "hidden",
									)}>
									<div
										className={clsx(
											"w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
											delivery === opt.id
												? "primary-gradient shadow-ambient-sm"
												: "bg-surface-container-high",
										)}>
										{typeof opt.icon === "string" ? (
											<Icon
												name={opt.icon}
												className={clsx(
													delivery === opt.id
														? "text-white"
														: "text-on-surface-variant",
													"text-xl",
												)}
											/>
										) : (
											<opt.icon
												className={`text-xl ${delivery === opt.id ? "text-white" : "text-on-surface-variant"}`}
											/>
										)}
									</div>
									<div className="flex-1 text-left min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-black text-on-surface text-base">
												{opt.label}
											</span>
											{opt.tag && (
												<span className="text-[9px] font-black bg-primary text-on-primary px-1.5 py-0.5 rounded tracking-wider">
													{opt.tag}
												</span>
											)}
											{/* {lockedOut && (
												<span className="text-[9px] font-bold text-on-surface-variant/60 border border-outline-variant/40 px-1.5 py-0.5 rounded tracking-wider">
													Không khả dụng
												</span>
											)} */}
										</div>
										<span className="text-sm text-on-surface-variant">
											{opt.sublabel}
										</span>
									</div>
									<div className="text-right flex-shrink-0">
										<span
											className={clsx(
												"font-black text-sm",
												delivery === opt.id
													? "text-primary"
													: "text-on-surface",
											)}>
											{mappingDisplayPrice[
												opt.price as keyof typeof mappingDisplayPrice
											] ?? formatVND(opt.price as number)}
										</span>
									</div>
									<div
										className={clsx(
											"w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
											delivery === opt.id
												? "border-primary bg-primary"
												: "border-outline-variant",
										)}>
										{delivery === opt.id && (
											<div className="w-2 h-2 rounded-full bg-on-primary" />
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* ── Order summary + CTA ──────────────────────────────── */}
				<div className="rounded-3xl overflow-hidden bg-surface-container-low">
					<div className="px-5 pt-5 pb-4 space-y-3">
						<p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
							Tóm tắt đơn hàng
						</p>
						<div className="flex justify-between items-center text-sm">
							<span className="text-on-surface-variant">
								Tạm tính
							</span>
							<span className="font-bold text-on-surface">
								{formatVND(subtotal)}
							</span>
						</div>
						<div className="flex justify-between items-center text-sm">
							<span className="text-on-surface-variant">
								Phí vận chuyển
							</span>
							<span
								className={clsx(
									"font-bold",
									shippingCost === 0
										? "text-secondary"
										: "text-on-surface",
								)}>
								{shippingCost === 0
									? "Miễn phí"
									: formatVND(shippingCost)}
							</span>
						</div>
						<div className="h-px bg-outline-variant/30" />
						<div className="flex justify-between items-center">
							<span className="font-black text-on-surface">
								Tổng cộng
							</span>
							<span className="text-2xl font-black text-on-surface">
								{formatVND(orderTotal)}
							</span>
						</div>
					</div>
					<button
						type="submit"
						className="w-full primary-gradient text-white font-black uppercase tracking-widest py-5 flex items-center justify-center gap-2 text-sm active:opacity-90 transition-opacity">
						Tiếp tục thanh toán
						<Icon name="arrow_forward" className="text-lg" />
					</button>
				</div>
			</form>
		</div>
	);
}

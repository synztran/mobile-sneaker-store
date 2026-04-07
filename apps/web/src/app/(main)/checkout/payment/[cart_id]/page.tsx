"use client";

import PaymentPageContent from "@/app/(main)/checkout/payment/page";
import { use } from "react";

export default function PaymentWithCartId({
	params,
}: {
	params: Promise<{ cart_id: string }>;
}) {
	void use(params).cart_id;
	return <PaymentPageContent />;
}

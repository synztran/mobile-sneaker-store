"use client";

import CheckingPageContent from "@/app/(main)/checkout/checking/page";
import { use } from "react";

export default function CheckingWithOrderId({
	params,
}: {
	params: Promise<{ order_id: string }>;
}) {
	void use(params).order_id;
	return <CheckingPageContent />;
}

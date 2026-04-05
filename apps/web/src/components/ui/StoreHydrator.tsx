"use client";

import { useCartStore } from "@/store";
import { useEffect } from "react";

export function StoreHydrator() {
	useEffect(() => {
		useCartStore.persist.rehydrate();
	}, []);

	return null;
}

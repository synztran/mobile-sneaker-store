"use client";

import { mountToaster, unmountToaster } from "gooey-toast";
import "gooey-toast/styles.css";
import { useEffect } from "react";

export function ToastProvider() {
	useEffect(() => {
		mountToaster({
			position: "top-center",
		});
		return () => {
			unmountToaster();
		};
	}, []);

	return null;
}

export { gooeyToast as toast } from "gooey-toast";

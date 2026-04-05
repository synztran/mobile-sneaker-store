import { useEffect, useState } from "react";

/**
 * Returns `false` on the server and during the first render,
 * then `true` after the component has mounted on the client.
 *
 * Use this to guard any value that is only available client-side
 * (localStorage-backed Zustand stores, Math.random, Date.now, etc.)
 * to prevent React hydration mismatches.
 */
export function useIsMounted(): boolean {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return mounted;
}

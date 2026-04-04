/**
 * Format a number as Vietnamese Dong (VND).
 *
 * Examples:
 *   formatVND(285000)   → "285.000 ₫"
 *   formatVND(1500000)  → "1.500.000 ₫"
 *   formatVND(0)        → "0 ₫"
 */
export function formatVND(amount: number): string {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(amount);
}

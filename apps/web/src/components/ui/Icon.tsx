"use client";

import * as LucideIcons from "lucide-react";

type IconProps = {
	name: string;
	className?: string;
	title?: string;
};

const MANUAL_MAP: Record<string, string> = {
	close: "X",
	check: "Check",
	check_circle: "CheckCircle",
	shopping_cart: "ShoppingCart",
	add_shopping_cart: "ShoppingCart",
	shopping_bag: "ShoppingBag",
	arrow_forward: "ArrowRight",
	arrow_back: "ArrowLeft",
	arrow_upward: "ArrowUp",
	arrow_downward: "ArrowDown",
	swap_vert: "ArrowsUpDown",
	tune: "Sliders",
	schedule: "Clock",
	search: "Search",
	search_off: "Search",
	error_outline: "AlertCircle",
	menu: "Menu",
	favorite: "Heart",
	person: "User",
	mail: "Mail",
	lock: "Lock",
	visibility: "Eye",
	visibility_off: "EyeOff",
	image_not_supported: "ImageOff",
	image: "Image",
	add: "Plus",
	eco: "Leaf",
	sprint: "Activity",
	directions_run: "Activity",
	fitness_center: "Dumbbell",
	chevron_right: "ChevronRight",
	logout: "LogOut",
	edit: "Edit",
	favorite_border: "Heart",
	shopping_basket: "ShoppingBag",
	payment: "CreditCard",
	notifications: "Bell",
	location_on: "MapPin",
	help: "HelpCircle",
	bookmark: "Bookmark",
	content_copy: "Copy",
};

function toPascalCase(name: string) {
	return name
		.split(/[_\-\s]+/)
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join("");
}

export function Icon({ name, className, title }: IconProps) {
	const lookup = MANUAL_MAP[name] ?? toPascalCase(name);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const Comp = (LucideIcons as any)[lookup] ?? (LucideIcons as any)["Square"];

	return (
		<span
			className={className}
			aria-hidden={!!title ? undefined : true}
			title={title}>
			{/* render SVG sized to 1em so it respects font-size utilities */}
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<Comp style={{ width: "1em", height: "1em" }} />
		</span>
	);
}

export default Icon;

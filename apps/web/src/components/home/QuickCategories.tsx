import Icon from "@/components/ui/Icon";
import Link from "next/link";

const CATEGORIES = [
	{ icon: "directions_run", label: "Chạy bộ", slug: "running", active: true },
	{
		icon: "checkroom",
		label: "Phong cách sống",
		slug: "lifestyle",
		active: false,
	},
	{
		icon: "sports_basketball",
		label: "Bóng rổ",
		slug: "basketball",
		active: false,
	},
	{ icon: "hiking", label: "Ngoài trời", slug: "outdoor", active: false },
	{ icon: "skateboarding", label: "Trượt ván", slug: "skate", active: false },
];

export function QuickCategories() {
	return (
		<section className="py-12 pl-6">
			<div className="flex items-center justify-between pr-6 mb-6">
				<h3 className="text-xl font-bold tracking-tight">Danh mục</h3>
			</div>
			<div className="flex gap-4 overflow-x-auto hide-scrollbar pr-6">
				{CATEGORIES.map((cat) => (
					<Link
						key={cat.slug}
						href={`/shop?category=${cat.slug}`}
						className="flex-shrink-0 flex flex-col items-center gap-3">
						<div
							className={`w-20 h-20 rounded-full flex items-center justify-center ${
								cat.active
									? "bg-primary text-on-primary"
									: "bg-surface-container text-primary"
							}`}>
							<Icon name={cat.icon} className="text-3xl" />
						</div>
						<span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
							{cat.label}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

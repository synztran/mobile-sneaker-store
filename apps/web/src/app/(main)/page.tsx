import { formatVND } from "@/lib/currency";
import { PRODUCTS } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
	{ icon: "directions_run", label: "Running", active: false },
	{ icon: "styler", label: "Lifestyle", active: true },
	{ icon: "sports_basketball", label: "Basketball", active: false },
	{ icon: "fitness_center", label: "Training", active: false },
	{ icon: "hiking", label: "Outdoor", active: false },
];

const EDITOR_PICKS = [
	{
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoDnQ1ZNBd6nR7hQTeEZejpmgvfOJd-fM09mfsNKgBttUG_f9x0VhLxbv1abQ_URBdhfUEimvqny_6PijNE_kj99kz1zUeWdMATKbO75HcWAMxU1NZD-C7eSlGV25HwM4PUqzVm9r6uqoSq19Oyv3_1EtLCkrfb1rwZuh2GVM_6a_FYyCMs-oK5kKaQ89KTQ9zVGMrjcSoIwTktws5DjlByZWL96AT5XDUaUigJlB9FYbWv9czkLkO6MKIS-JgV-ptSo5X3qfyKS4",
		label: "Heritage Series",
		title: "THE ARCHIVE REVIVAL",
		desc: "A curated selection of silhouettes that defined a generation, reconstructed with modern materials for the streets of today.",
		cta: "Discover Story",
	},
	{
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADrUhneZqMRDzXgw4YvT3HrCEH5PlmpZ4mNAxxboeGGOAu2r5GUlGbsrI91odysx5_nYbgRU95AOZn5bjTd6LYaIfuK2Jrq_KCNUnsSI9N9pLy_vYj7xsL47X5RrrgvNt8bvHVZGfF334SWweu88na6oMwWhb38ZiUwVKureZUXuKamcvGBdHS-VXWhmz3fbd_vaxtSrwqFjHi5U7MZdxZpDW_2gqP5y92rVXriquJc-zRsx4ZgxwepHMq01fQhna0gOaZbG3Dxn4",
		label: "Sustainability Focus",
		title: "THE OCEAN BOUND",
		desc: "Made from 85% recycled marine plastics, this collection proves that performance and environmental responsibility go hand in hand.",
		cta: "Explore Impact",
	},
];

const trendingProducts = PRODUCTS.slice(6, 8);

export default function HomePage() {
	return (
		<>
			{/* Hero Section */}
			<section className="relative h-[80vh] w-full overflow-hidden">
				<Image
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtpDZmOa72mJwZiHc7Gg77fPcLuhbxIPBX5cRqrZHkVXYIaMJeBmgbVNGOXFTJli1m9LS-Ovtlyp5d3DcWQUU7qSBEs2pVodNV942EaBa2RP1Tpw_jzZ3pNdh5P0fO9LChMlRaqgX_o-SGqr62matzTKw6xyKZ0oLp1svcBxTH4goNnm5rI7x0bqEGgCz_ocja0lFD0ahUxYFCM0yodnsFNyRvlNMk-t_xbccC_dKBoeJI_iBO3KFnW_B5anLp4o3I6EffMyJgCXk"
					alt="Summer Sale Hero"
					fill
					className="object-cover"
					priority
					unoptimized
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent" />
				<div className="absolute inset-0 flex flex-col justify-end p-8 pb-16">
					<span className="text-white/80 font-bold tracking-[0.3em] text-xs mb-2 uppercase">
						Summer Series 2024
					</span>
					<h2 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-8">
						STEP INTO <br />
						THE LIGHT
					</h2>
					<Link
						href="/shop"
						className="btn w-full bg-primary-action text-white border-0 rounded-2xl normal-case font-black text-lg py-5 h-auto active:scale-[0.98] transition-transform">
						Shop Sale
					</Link>
				</div>
			</section>

			{/* Quick Categories */}
			<section className="py-10">
				<div className="flex overflow-x-auto gap-6 px-6 hide-scrollbar">
					{CATEGORIES.map((cat) => (
						<Link
							key={cat.label}
							href={`/shop?category=${cat.label.toLowerCase()}`}
							className="flex flex-col items-center gap-3 flex-shrink-0">
							<div
								className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-ambient-sm ${
									cat.active
										? "bg-white border-2 border-primary/20"
										: "bg-white"
								}`}>
								<span
									className={`material-symbols-outlined text-3xl ${
										cat.active ? "text-primary" : ""
									}`}>
									{cat.icon}
								</span>
							</div>
							<span
								className={`text-[10px] font-black tracking-widest uppercase ${
									cat.active ? "text-primary" : "opacity-60"
								}`}>
								{cat.label}
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* Trending Now */}
			<section className="px-6 mb-16">
				<div className="flex justify-between items-end mb-8">
					<h3 className="text-3xl font-black tracking-tighter">
						TRENDING NOW
					</h3>
					<Link
						href="/shop"
						className="text-primary font-bold text-sm border-b-2 border-primary/20">
						All
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-4">
					{trendingProducts.map((product) => (
						<Link
							key={product.id}
							href={`/shop/${product.id}`}
							className="bg-white p-4 rounded-[2rem] shadow-ambient-sm hover:shadow-ambient transition-shadow">
							<div className="h-32 flex items-center justify-center mb-4 relative">
								<Image
									src={product.images[0]}
									alt={product.name}
									fill
									className="object-contain rotate-[-10deg]"
									unoptimized
								/>
							</div>
							<h4 className="font-bold text-sm leading-tight mb-1">
								{product.name}
							</h4>
							<span className="text-primary font-black text-xs">
								{formatVND(product.price)}
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* Editor's Picks */}
			<section className="px-6 mb-16">
				<h3 className="text-3xl font-black tracking-tighter mb-8 italic">
					EDITOR&apos;S PICKS
				</h3>
				<div className="space-y-8">
					{EDITOR_PICKS.map((pick) => (
						<div
							key={pick.title}
							className="bg-white rounded-5xl overflow-hidden shadow-ambient-sm">
							<div className="h-72 overflow-hidden relative">
								<Image
									src={pick.image}
									alt={pick.title}
									fill
									className="object-cover"
									unoptimized
								/>
							</div>
							<div className="p-8">
								<span className="text-primary font-black tracking-widest text-[10px] uppercase mb-3 block">
									{pick.label}
								</span>
								<h4 className="text-2xl font-black tracking-tight mb-4 leading-none">
									{pick.title}
								</h4>
								<p className="text-on-surface/60 text-sm leading-relaxed mb-6">
									{pick.desc}
								</p>
								<button className="flex items-center gap-2 text-on-surface font-black text-sm uppercase tracking-widest">
									{pick.cta}{" "}
									<span className="material-symbols-outlined text-sm">
										arrow_forward
									</span>
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Search FAB */}
			<div className="fixed bottom-24 right-6 z-40">
				<Link
					href="/shop"
					className="w-16 h-16 bg-primary-action text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
					<span className="material-symbols-outlined text-3xl">
						search
					</span>
				</Link>
			</div>
		</>
	);
}

import Icon from "@/components/ui/Icon";
import Link from "next/link";

export function FlashSaleBanner() {
	return (
		<section className="px-6 mb-16">
			<div className="bg-primary-container rounded-3xl p-10 relative overflow-hidden text-on-primary-container">
				<div className="relative z-10">
					<h3 className="text-4xl font-extrabold tracking-tighter uppercase mb-4 leading-none">
						Flash Sale
						<br />
						Up to 40% Off
					</h3>
					<p className="mb-8 font-medium opacity-90 max-w-[200px]">
						Limited time offer on selected archival silhouettes.
					</p>
					<Link
						href="/shop?sort=price_asc"
						className="inline-block bg-on-primary-container text-primary px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all">
						Shop Sale
					</Link>
				</div>
				<Icon
					name="percent"
					className="absolute -bottom-8 -right-8 text-[180px] opacity-10 rotate-12 pointer-events-none"
				/>
			</div>
		</section>
	);
}

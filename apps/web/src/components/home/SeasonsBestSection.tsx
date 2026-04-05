import Image from "next/image";
import Link from "next/link";

export function SeasonsBestSection() {
	return (
		<section className="px-6 mb-16">
			<div className="relative bg-surface-container-high rounded-3xl overflow-hidden p-8 flex flex-col justify-end min-h-[400px]">
				<Image
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuB352C2TbJUB_WijqCP3Vi0xU46Ak69Ld0tmGnOOFtuWRxIzefi0Dk1fvT5Qu73ryIJjxUUuK1cE2a_yy9cwU_YCqhI4vmMgqxVwkFqv8xaUHY66XnaKs5Hhoi69QEFl2OblOUPTw0xTGSJAIZIY7XaYhljkwgt8AVuLM9hpNiGashMENwcqNxIcNrKHBxgMxjX-8xwc6WBdBmcLlkRNHkbwYHEz80TmrCGYqiYqTKvSb4PfVsKYIYNgu0rOikeF8Z--itdM5tn2C0"
					alt="Summer Series 2024 – seasonal feature"
					fill
					className="object-cover mix-blend-multiply opacity-60"
					unoptimized
				/>
				<div className="relative z-10">
					<h3 className="text-3xl font-extrabold tracking-tighter uppercase mb-2">
						Summer Series 2024
					</h3>
					<p className="text-on-surface-variant mb-6 text-sm max-w-[200px]">
						The essential lightness for the warmest days of the
						year.
					</p>
					<Link
						href="/shop"
						className="inline-block border-b-2 border-primary text-primary font-bold pb-1 text-sm tracking-wide">
						View Collection
					</Link>
				</div>
			</div>
		</section>
	);
}

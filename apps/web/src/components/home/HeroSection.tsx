import Icon from "@/components/ui/Icon";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-end">
			<Image
				src="https://lh3.googleusercontent.com/aida-public/AB6AXuCszZIfbfjyA34c5shE3vYt_gY0PorRGiTIHTiCScxfqUmp_YUdaVk06Ojj-e-HG34nnXlK16fKYZYy1QslqvuAIpPG7i_nygrq6_Nh1YdlpCN2QYYlkyfUW-2pgTUQot24FfGkIQ3CRhnhv9p3i4tvva4zd7zKstmCLGLzxnUwrRZJwsokwxoKYTO5caxg-eXhKpIdlMqboH0BehS1YiKBKd5gzc13g_MRQXl0lX_WebJNm-Qsr5omTtIfRQVSKmxY4SuUbu8jgxU"
				alt="The Autumn Collection – premium sneaker hero"
				fill
				className="object-cover"
				priority
				unoptimized
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
			<div className="relative z-10 px-6 pb-12 w-full">
				<span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2 block">
					Premium Drop
				</span>
				<h2 className="text-5xl font-extrabold leading-[0.95] tracking-tighter text-on-surface mb-6 uppercase">
					The Autumn
					<br />
					Collection
				</h2>
				<Link
					href="/shop"
					className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-3xl font-bold hover:opacity-90 active:scale-95 transition-all">
					Khám phá ngay
					<Icon name="arrow_forward" className="text-lg" />
				</Link>
			</div>
		</section>
	);
}

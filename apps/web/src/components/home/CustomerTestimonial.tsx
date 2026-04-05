import { Star } from "lucide-react";

export function CustomerTestimonial() {
	return (
		<section className="py-16 px-6">
			<div className="flex flex-col items-center text-center max-w-sm mx-auto">
				<div className="flex gap-1 text-primary mb-6">
					{Array.from({ length: 5 }).map((_, i) => (
						<Star key={i} size={20} fill="currentColor" />
					))}
				</div>
				<p className="text-xl font-bold tracking-tight italic mb-6">
					&ldquo;The curation is unmatched. Every drop feels like it
					was selected just for my aesthetic.&rdquo;
				</p>
				<span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">
					— Marcus R., New York
				</span>
			</div>
		</section>
	);
}

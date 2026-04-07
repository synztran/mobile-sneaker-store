import Image from "next/image";

const ARTICLES = [
	{
		tag: "Heritage",
		title: "The History of the Air Jordan 1",
		meta: "4 min read • By Lab Team",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZFARDQTHW2e8pIh3N7bt-iQrKb7mDsQFiHfir0l0EqE7e8p5aQnCf6WkvAOMqAXtmIEiLeS3jGgnxjJipaVw5prjcYJmRL2hZcd9O_duxj4hqpjI1NT2Sa3AvceGoFKX95po67GZr5X5x6LR09bM6EbXO1epa3ADhiM_DNiBmtkbxotA5N_Xy2VAPsomJkG0R6IXMb8W_fxb8Y9EUvGBq5Oe3qpNugm1nQhy8L5wcfdweJ4aLYxZMyRU-7sOtPB81pUTl9ivaczA",
	},
	{
		tag: "Innovation",
		title: "Eco-Soling: Future of Tread",
		meta: "6 min read • By Sarah Chen",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPhfGhLTw_aqmRYGYcy0EJ6h4XJpFXT-8bFrMIyb-K0YufZ09J23qS-SALy6u1aN32K5XFXtw4-VW5Z6VmhY49E8hNnTqxw5rM1x4rZ8vHFFf1zamxc5wNyL4uUG16BCiXzjr3-M9XQwDN_-6EGT1fk9AyhHy3ZB2JwtHNPnndquMMMyXQolLqwC4AGzutjJa0Wl5A8EdvtXcBk9QLNs5qIqfJ6jKvY8zoaggbEsH10JPFWbsSmreHCNFsbl9HtkMYWbvd4YMwndI",
	},
];

export function LabNotesSection() {
	return (
		<section className="px-6 mb-16">
			<h3 className="text-3xl font-extrabold tracking-tighter uppercase mb-8">
				Giraffe Lab Chia sẻ
			</h3>
			<div className="space-y-8">
				{ARTICLES.map((article) => (
					<div
						key={article.title}
						className="flex gap-4 items-center">
						<div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
							<Image
								src={article.image}
								alt={article.title}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>
						<div>
							<span className="text-[10px] font-bold text-primary uppercase tracking-widest">
								{article.tag}
							</span>
							<h4 className="font-extrabold text-base leading-tight mt-1">
								{article.title}
							</h4>
							<p className="text-xs text-on-surface-variant mt-2">
								{article.meta}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

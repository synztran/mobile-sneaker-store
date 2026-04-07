import Icon from "@/components/ui/Icon";
import { Globe, MessageCircleMore } from "lucide-react";
import Link from "next/link";

export function HomeFooter() {
	return (
		<footer className="bg-surface-container py-16 px-6">
			<div className="flex flex-col items-center mb-12">
				<h2 className="text-4xl font-black tracking-tight uppercase mb-8">
					Giraffe Lab
				</h2>
				<div className="flex gap-8">
					{(
						[
							{ id: 1, icon: "share", label: "Chia sẻ" },
							{
								id: 2,
								icon: <Globe size={16} />,
								label: "Website",
							},
							{
								id: 3,
								icon: <MessageCircleMore size={16} />,
								label: "Hỗ trợ",
							},
						] as const
					).map(({ id, icon, label }) => (
						<a
							key={id}
							href="#"
							aria-label={label}
							className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-colors">
							{typeof icon === "string" ? (
								<Icon name={icon} />
							) : (
								icon
							)}
						</a>
					))}
				</div>
			</div>
			<div className="border-t border-outline-variant/30 pt-8 flex flex-col items-center gap-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
				<div className="flex gap-6">
					<Link href="#">Chính sách bảo mật</Link>
					<Link href="#">Điều khoản</Link>
					<Link href="#">Vận chuyển</Link>
				</div>
				<p className="opacity-50">© 2026 Giraffe Lab</p>
			</div>
		</footer>
	);
}

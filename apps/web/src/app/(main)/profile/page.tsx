"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
	{ icon: "shopping_bag", label: "My Orders" },
	{ icon: "favorite", label: "Saved Items" },
	{ icon: "location_on", label: "Addresses" },
	{ icon: "payment", label: "Payment Methods" },
	{ icon: "notifications", label: "Notifications" },
	{ icon: "help", label: "Help & Support" },
];

export default function ProfilePage() {
	const router = useRouter();
	const { user, profile, loading, signOut } = useAuth();

	const handleSignOut = async () => {
		await signOut();
		toast.success("Signed out");
		router.push("/login");
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	const displayName =
		profile?.full_name ?? user?.email?.split("@")[0] ?? "Sneaker Head";
	const initials = displayName
		.split(" ")
		.map((n: string) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="px-6 pt-4">
			{/* Avatar & name */}
			<div className="flex items-center gap-4 mb-8">
				{profile?.avatar_url ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={profile.avatar_url}
						alt={displayName}
						className="w-16 h-16 rounded-full object-cover"
					/>
				) : (
					<div className="w-16 h-16 rounded-full primary-gradient flex items-center justify-center flex-shrink-0">
						<span className="text-white font-black text-xl">
							{initials}
						</span>
					</div>
				)}
				<div>
					<h2 className="text-2xl font-black text-on-surface">
						{displayName}
					</h2>
					<p className="text-on-surface-variant text-sm">
						{user ? user.email : "Sneaker Lab Member"}
					</p>
				</div>
			</div>

			{/* Menu items */}
			<div className="space-y-3">
				{NAV_ITEMS.map(({ icon, label }) => (
					<button
						key={label}
						className="w-full flex items-center gap-4 bg-surface-container-lowest rounded-2xl px-5 py-4 shadow-ambient-sm hover:bg-surface-container-low transition-colors">
						<span className="material-symbols-outlined text-primary">
							{icon}
						</span>
						<span className="font-semibold text-on-surface">
							{label}
						</span>
						<span className="material-symbols-outlined text-outline-variant ml-auto">
							chevron_right
						</span>
					</button>
				))}
			</div>

			{/* Auth CTA */}
			<div className="mt-8 space-y-3">
				{user ? (
					<button
						onClick={handleSignOut}
						className="btn w-full bg-surface-container text-error border-0 rounded-2xl normal-case font-bold h-auto py-4">
						<span className="material-symbols-outlined mr-2">
							logout
						</span>
						Sign Out
					</button>
				) : (
					<>
						<Link
							href="/login"
							className="btn w-full primary-gradient text-white border-0 rounded-2xl normal-case font-bold h-auto py-4">
							Sign In
						</Link>
						<Link
							href="/register"
							className="btn w-full bg-surface-container text-on-surface border-0 rounded-2xl normal-case font-bold h-auto py-4">
							Create Account
						</Link>
					</>
				)}
			</div>
		</div>
	);
}

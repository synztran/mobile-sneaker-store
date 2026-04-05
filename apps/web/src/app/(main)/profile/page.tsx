"use client";

import Icon from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
	const { user, profile, loading, signOut, refreshProfile } = useAuth();

	console.log(user, profile);

	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [fullName, setFullName] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (profile?.full_name) setFullName(profile.full_name);
	}, [profile]);

	const handleSignOut = async () => {
		await signOut();
		toast.success("Signed out");
		router.push("/login");
	};

	const handleSave = async () => {
		if (!fullName.trim()) return;
		setSaving(true);
		try {
			const res = await fetch("/api/user/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ full_name: fullName.trim() }),
			});
			if (!res.ok) throw new Error("Failed to save");
			await refreshProfile();
			toast.success("Profile updated");
			setEditing(false);
		} catch {
			toast.error("Could not save profile");
		} finally {
			setSaving(false);
		}
	};

	const handleEditToggle = () => {
		setEditing((v) => {
			if (!v) setTimeout(() => inputRef.current?.focus(), 50);
			return !v;
		});
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
				<div className="flex-1 min-w-0">
					{editing ? (
						<input
							ref={inputRef}
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSave();
								if (e.key === "Escape") setEditing(false);
							}}
							className="w-full bg-surface-container rounded-xl px-3 py-1.5 text-xl font-black text-on-surface outline-none border-2 border-primary"
							placeholder="Your name"
						/>
					) : (
						<h2 className="text-2xl font-black text-on-surface truncate">
							{displayName}
						</h2>
					)}
					<p className="text-on-surface-variant text-sm mt-0.5">
						{user ? user.email : "Sneaker Lab Member"}
					</p>
				</div>
				{user && (
					<div className="flex gap-2 flex-shrink-0">
						{editing ? (
							<>
								<button
									onClick={handleSave}
									disabled={saving}
									className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50">
									{saving ? (
										<span className="loading loading-spinner loading-xs text-white" />
									) : (
										<Icon
											name="check"
											className="text-white text-lg"
										/>
									)}
								</button>
								<button
									onClick={() => setEditing(false)}
									className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center active:scale-90 transition-transform">
									<Icon
										name="close"
										className="text-on-surface text-lg"
									/>
								</button>
							</>
						) : (
							<button
								onClick={handleEditToggle}
								className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center active:scale-90 transition-transform">
								<Icon
									name="edit"
									className="text-on-surface text-lg"
								/>
							</button>
						)}
					</div>
				)}
			</div>

			{/* Menu items */}
			<div className="space-y-3">
				{NAV_ITEMS.map(({ icon, label }) => (
					<button
						key={label}
						className="w-full flex items-center gap-4 bg-surface-container-lowest rounded-2xl px-5 py-4 shadow-ambient-sm hover:bg-surface-container-low transition-colors">
						<Icon name={icon} className="text-primary" />
						<span className="font-semibold text-on-surface">
							{label}
						</span>
						<Icon
							name="chevron_right"
							className="text-outline-variant ml-auto"
						/>
					</button>
				))}
			</div>

			{/* Auth CTA */}
			<div className="mt-8 space-y-3">
				{user ? (
					<button
						onClick={handleSignOut}
						className="btn w-full bg-surface-container text-error border-0 rounded-2xl normal-case font-bold h-auto py-4">
						<Icon name="logout" className="mr-2" />
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

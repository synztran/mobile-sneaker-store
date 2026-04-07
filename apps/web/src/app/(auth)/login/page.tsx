"use client";

import Icon from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const { signIn, signInWithGoogle } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Vui lòng điền đầy đủ thông tin");
			return;
		}
		setLoading(true);
		const { error } = await signIn(email, password);
		if (error) {
			toast.error(error);
  		setLoading(false);
			return;
		}
		toast.success("Chào mừng trở lại!");
		router.push("/");
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		const { error } = await signInWithGoogle();
		if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }
	};

	return (
		<div className="flex-1 flex flex-col px-8 pt-20 pb-12">
			{/* Logo */}
			<div className="flex flex-col items-center mb-12">
				<div className="flex items-center gap-2 mb-2">
					<Icon
						name="sprint"
						className="text-5xl text-on-surface icon-filled"
					/>
				</div>
				<h1 className="text-2xl font-black tracking-tighter text-on-surface font-sans">
					GIRAFFE LAB
				</h1>
			</div>

			{/* Heading */}
			<h2 className="text-4xl font-black text-on-surface mb-8 tracking-tight text-center">
				Chào mừng trở lại
			</h2>

			{/* Form */}
			<form onSubmit={handleSignIn} className="space-y-4 w-full">
				{/* Email */}
				<div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4">
					<Icon name="mail" className="text-outline text-xl" />
					<input
						type="email"
						placeholder="Địa chỉ Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-medium outline-none"
						autoComplete="email"
            disabled={loading}
					/>
				</div>

				{/* Password */}
				<div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4">
					<Icon name="lock" className="text-outline text-xl" />
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Mật khẩu"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-medium outline-none"
						autoComplete="current-password"
            disabled={loading}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="text-outline hover:text-on-surface transition-colors">
						<Icon
							name={
								showPassword ? "visibility" : "visibility_off"
							}
							className="text-xl"
						/>
					</button>
				</div>

				{/* Forgot password */}
				<div className="text-right">
					<Link
						href="/forgot-password"
						className="text-sm font-semibold text-on-surface underline underline-offset-4">
						Quên mật khẩu?
					</Link>
				</div>

				{/* Sign In Button */}
				<button
					type="submit"
					disabled={loading}
					className="btn w-full primary-gradient text-white border-0 rounded-2xl normal-case font-bold text-base py-4 h-auto mt-2 active:scale-[0.98] transition-transform shadow-ambient-sm disabled:opacity-60">
					{loading ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						"Đăng nhập"
					)}
				</button>
			</form>

			{/* <div className="flex items-center gap-4 my-6">
				<div className="flex-1 h-px bg-outline-variant" />
				<span className="text-sm text-on-surface-variant font-medium">
					Hoặc tiếp tục với
				</span>
				<div className="flex-1 h-px bg-outline-variant" />
			</div>

			<div className="flex gap-4">
				<button
					type="button"
					onClick={handleGoogleSignIn}
					className="flex-1 flex items-center justify-center gap-2 bg-white border border-outline-variant rounded-2xl py-3.5 font-semibold text-on-surface hover:bg-surface-container-low transition-colors">
					<svg className="w-5 h-5" viewBox="0 0 24 24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Google
				</button>
				<button
					type="button"
					className="flex-1 flex items-center justify-center gap-2 bg-white border border-outline-variant rounded-2xl py-3.5 font-semibold text-on-surface hover:bg-surface-container-low transition-colors">
					<svg
						className="w-5 h-5"
						viewBox="0 0 24 24"
						fill="currentColor">
						<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
					</svg>
					Apple
				</button>
			</div> */}

			{/* Sign up link */}
			<p className="text-center mt-8 text-on-surface text-sm">
				Don&apos;t have an account?{" "}
				<Link
					href="/register"
					className="font-black text-on-surface underline underline-offset-4">
					Đăng ký
				</Link>
			</p>
		</div>
	);
}

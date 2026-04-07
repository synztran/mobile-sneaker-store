"use client";

import Icon from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
	const router = useRouter();
	const { signUp, signInWithGoogle } = useAuth();
	const [agreed, setAgreed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.fullName || !form.email || !form.password) {
			toast.error("Vui lòng điền đầy đủ thông tin");
			return;
		}
		if (form.password.length < 8) {
			toast.error("Mật khẩu phải có ít nhất 8 ký tự");
			return;
		}
		if (form.password !== form.confirmPassword) {
			toast.error("Mật khẩu không khớp");
			return;
		}
		if (!agreed) {
			toast.warning("Vui lòng đồng ý với Điều khoản & Điều kiện");
			return;
		}
		setLoading(true);
		const { error } = await signUp(
			form.email,
			form.password,
			form.fullName,
		);
		setLoading(false);
		if (error) {
			if (
				error.toLowerCase().includes("sending confirmation email") ||
				error.toLowerCase().includes("unexpected_failure")
			) {
				toast.error(
					"Không thể gửi email xác nhận. Vui lòng thử lại sau.",
				);
			} else if (
				error.toLowerCase().includes("already registered") ||
				error.toLowerCase().includes("user already")
			) {
				toast.error("Email này đã được đăng ký. Vui lòng đăng nhập.");
			} else {
				toast.error(error);
			}
			return;
		}
		toast.success(
			"Tài khoản đã được tạo! Vui lòng kiểm tra email để xác nhận.",
		);
		router.push("/login");
	};

	const handleGoogleSignUp = async () => {
		const { error } = await signInWithGoogle();
		if (error) toast.error(error);
	};

	return (
		<div className="flex-1 flex flex-col px-8 pt-16 pb-12">
			{/* Heading */}
			<h2 className="text-4xl font-black text-on-surface mb-2 tracking-tight">
				Tạo tài khoản
			</h2>
			<p className="text-on-surface-variant text-sm mb-8">
				Tham gia Gariffe Lab để có quyền truy cập độc quyền.
			</p>

			{/* Form */}
			<form onSubmit={handleRegister} className="space-y-4 w-full">
				{/* Full Name */}
				<div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4">
					<Icon name="person" className="text-outline text-xl" />
					<input
						type="text"
						name="fullName"
						placeholder="Họ và tên"
						value={form.fullName}
						onChange={handleChange}
						className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-medium outline-none"
						autoComplete="name"
					/>
				</div>

				{/* Email */}
				<div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4">
					<Icon name="mail" className="text-outline text-xl" />
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-medium outline-none"
						autoComplete="email"
					/>
				</div>

				{/* Password */}
				<div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4">
					<Icon name="lock" className="text-outline text-xl" />
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={form.password}
						minLength={8}
						onChange={handleChange}
						className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-medium outline-none"
						autoComplete="new-password"
					/>
				</div>

				{/* Confirm Password */}
				<div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-4">
					<Icon name="lock" className="text-outline text-xl" />
					<input
						type="password"
						name="confirmPassword"
						placeholder="Xác nhận mật khẩu"
						value={form.confirmPassword}
						minLength={8}
						onChange={handleChange}
						className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-medium outline-none"
						autoComplete="new-password"
					/>
				</div>

				{/* Terms checkbox */}
				<label className="flex items-start gap-3 cursor-pointer mt-2">
					<input
						type="checkbox"
						checked={agreed}
						onChange={(e) => setAgreed(e.target.checked)}
						className="checkbox checkbox-sm mt-0.5 rounded border-outline-variant checked:bg-primary checked:border-primary"
					/>
					<span className="text-sm text-on-surface leading-relaxed">
						Tôi đồng ý với{" "}
						<Link href="#" className="underline underline-offset-2">
							Điều khoản &amp; Điều kiện
						</Link>{" "}
						và{" "}
						<Link href="#" className="underline underline-offset-2">
							Chính sách bảo mật
						</Link>
					</span>
				</label>

				{/* Register Button */}
				<button
					type="submit"
					disabled={loading}
					className="btn w-full primary-gradient text-white border-0 rounded-2xl normal-case font-bold text-base py-4 h-auto mt-2 active:scale-[0.98] transition-transform shadow-ambient-sm disabled:opacity-60">
					{loading ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						"Đăng ký"
					)}
				</button>
			</form>

			{/* Divider */}
			{/* <div className="flex items-center gap-4 my-6">
				<div className="flex-1 h-px bg-outline-variant" />
				<span className="text-sm text-on-surface-variant font-medium">
					Hoặc đăng ký với
				</span>
				<div className="flex-1 h-px bg-outline-variant" />
			</div>

			<div className="flex gap-4 justify-center">
				<button
					type="button"
					aria-label="Sign up with Apple"
					className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center bg-white hover:bg-surface-container-low transition-colors">
					<svg
						className="w-6 h-6"
						viewBox="0 0 24 24"
						fill="currentColor">
						<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
					</svg>
				</button>
				<button
					type="button"
					aria-label="Sign up with Google"
					onClick={handleGoogleSignUp}
					className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center bg-white hover:bg-surface-container-low transition-colors">
					<svg className="w-6 h-6" viewBox="0 0 24 24">
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
				</button>
				<button
					type="button"
					aria-label="Sign up with Facebook"
					className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center bg-white hover:bg-surface-container-low transition-colors">
					<svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
					</svg>
				</button>
			</div> */}

			{/* Log in link */}
			<p className="text-center mt-8 text-on-surface text-sm">
				Đã có tài khoản?{" "}
				<Link href="/login" className="font-black text-primary">
					Đăng nhập
				</Link>
			</p>
		</div>
	);
}

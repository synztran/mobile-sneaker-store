"use client";

import type { Profile } from "@/lib/supabase/database.types";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

// Use @supabase/supabase-js directly so the session is stored in localStorage
// instead of cookies — cookies don't persist in iOS PWA standalone mode.
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
	{
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
			storage:
				typeof window !== "undefined" ? window.localStorage : undefined,
		},
	},
);

interface AuthContextValue {
	user: User | null;
	session: Session | null;
	profile: Profile | null;
	loading: boolean;
	signIn: (
		email: string,
		password: string,
	) => Promise<{ error: string | null }>;
	signUp: (
		email: string,
		password: string,
		fullName: string,
	) => Promise<{ error: string | null }>;
	signOut: () => Promise<void>;
	signInWithGoogle: () => Promise<{ error: string | null }>;
	refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch profile directly from Supabase (no API round-trip)
	const fetchProfile = useCallback(async (): Promise<void> => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				setProfile(null);
				return;
			}

			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.maybeSingle();

			if (error) {
				console.error("Failed to fetch profile:", error.message);
				setProfile(null);
				return;
			}

			// Self-heal: insert profile row if missing
			if (!data) {
				const { data: created } = await supabase
					.from("profiles")
					.insert({
						id: user.id,
						full_name:
							(user.user_metadata?.full_name as
								| string
								| undefined) ?? null,
						avatar_url:
							(user.user_metadata?.avatar_url as
								| string
								| undefined) ?? null,
					})
					.select()
					.single();
				setProfile(created ?? null);
			} else {
				setProfile(data);
			}
		} catch (err) {
			console.error("Failed to fetch profile:", err);
			setProfile(null);
		}
	}, []);

	const refreshProfile = useCallback(() => fetchProfile(), [fetchProfile]);

	// Initial session + auth listener
	useEffect(() => {
		let mounted = true;

		// 1. Get initial session
		const initializeAuth = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error) console.error("getSession error:", error);

				if (mounted) {
					setSession(session);
					setUser(session?.user ?? null);
					if (session?.user) await fetchProfile();
					else setProfile(null);
				}
			} catch (err) {
				console.error("Auth initialization error:", err);
			} finally {
				if (mounted) setLoading(false);
			}
		};

		initializeAuth();

		// 2. Listen to auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, newSession) => {
			if (!mounted) return;

			setSession(newSession);
			setUser(newSession?.user ?? null);

			if (newSession?.user) {
				// Don't await heavy work inside listener if possible
				fetchProfile();
			} else {
				setProfile(null);
			}
		});

		// Cleanup
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [fetchProfile]); // ← fetchProfile is stable thanks to useCallback

	// Auth methods
	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return { error: error?.message ?? null };
	};

	const signUp = async (
		email: string,
		password: string,
		fullName: string,
	) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { full_name: fullName },
			},
		});
		return { error: error?.message ?? null };
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setProfile(null);
	};

	const signInWithGoogle = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
		return { error: error?.message ?? null };
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				profile,
				loading,
				signIn,
				signUp,
				signOut,
				signInWithGoogle,
				refreshProfile,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}

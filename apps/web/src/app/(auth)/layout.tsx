export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-surface-container-lowest flex flex-col [padding-top:env(safe-area-inset-top,0px)]">
			{children}
		</div>
	);
}

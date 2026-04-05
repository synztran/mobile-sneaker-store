import { CommunityGallery } from "@/components/home/CommunityGallery";
import { CustomerTestimonial } from "@/components/home/CustomerTestimonial";
import { FlashSaleBanner } from "@/components/home/FlashSaleBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HotDropsSection } from "@/components/home/HotDropsSection";
import { LabNotesSection } from "@/components/home/LabNotesSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { QuickCategories } from "@/components/home/QuickCategories";
import { SeasonsBestSection } from "@/components/home/SeasonsBestSection";
import { Suspense } from "react";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<QuickCategories />
			<SeasonsBestSection />

			<Suspense
				fallback={
					<div className="h-96 bg-surface-container animate-pulse" />
				}>
				<HotDropsSection />
			</Suspense>

			<Suspense fallback={<div className="h-80 animate-pulse" />}>
				<NewArrivalsSection />
			</Suspense>

			<FlashSaleBanner />
			<LabNotesSection />
			<CommunityGallery />
			<CustomerTestimonial />
			<HomeFooter />
		</>
	);
}

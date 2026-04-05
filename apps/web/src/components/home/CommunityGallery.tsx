import Image from "next/image";

const PHOTOS = [
	{
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO_ML5Wlzl1HMbf08oMqtkVG4otQVg5bA7Vw6iatwXJ3y6ipbX963wcS3EdeTQSPPZ0fNaocnQcthKTXO2gAbwZ4LwNSu9CYi-lLBfELgQq1IowaReuykMhMVBIlab8pEhrSLSgXL9A-W0cijFMqUlmSZ8-GNVApEAlQ8u1o_3yYi4RqxPNAcoha44b_idWIIoJv0jiLRNjqswqxIv0pclDNhu_z3k3s3pwK7U0nQrI83UwATED-aAGuKJ78YI-sqIL8krkcq8Jg4",
		alt: "Street style sneakers in urban alleyway",
	},
	{
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl0EHr3-Bf3M20kTsHgwsyqBC3LJqHJnfRtVEacOJdJIHAf2VgWU7NHsoBRX1HVJmq4Qh3pQq44de3O9hJ9Io12Oy84YqebEpYUJbf3wSXNERLBVckMRlamO5On9UCAEVsZxxMt6cDr9TOph2ntxzSwQFf_cFZ74GrIoqULpLRxreyZcwYaFmKOWCGL5GouF2wG4_r94FBKpi394I9QkDn-2Gk0HcHq2Uc416Ec8Zo_oxe4K1_CI9PSc4jF-slYi3pDJeci7T6U1U",
		alt: "Runner's feet in vibrant athletic shoes",
	},
	{
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGncOfk3t_aPmtm1fu4SAEFAJov0l6z_NkM2q1n0tno7v8Yfk9RBE1AmDgSZYwjnJkPCvIWK8iTq988FS64Lq1gdqqr45xmyEoPgz2rFIQlaNzEmaajYFLrJGce8C2wvZRNA60_rpS3UEbwWmdmr_a5B457cn9eL3peFpDjkhx3lZhRAHWyUceHyIoKYKP64fhuy3HI5bCUvsB5i9c2Mj6gqfxFdAywIZn46KTUB_yosd7VRMLyRB6o7_S7_hMQ9xo4NztYj-_ojg",
		alt: "Skateboarder's feet in suede sneakers",
	},
	{
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHvPjNjsbdeykgftB4Ygo2C98zJHLsT0Kw52akQTyR7GqnchZ9axHKR28KASJS9Vl_OYWERKzSAYrp5uyaR-BOTV0XHCZZgC71-5RHkMW1Y7FrDD3Y-uOFN_W6nS0XQy39g1Vzfds5vAStQKY3bpwpE-iZ031RFNMOA8kKcOuIbc4-EW6O_t8neAHSxjMmVdZmNaSDFlOyrfEfOIGiXzr4P4S_HVylvknV_07KovJJffs9IhNWvdW0qhm9sc4nlOYJrBVJgJPKebs",
		alt: "Colorful designer sneakers on concrete stairs",
	},
	{
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCntPExyxVDCJ-0UrDcfKk-ueTlucysJtrpOYGxsA-BaUkKY63V8p4ZT188fM-3J2zmGEzvnknGBaqkyMaFOkakfww1C_zoTn7C41vIgSgEIaR2BK4szkMk4lHVvjLNuXfgvaHBmL-WqJX6DHNxPQDTr4tq0AIw6aRCzvnoYbQbsG5hhMKKq-pOj_WOBcyD7ozGUHqBGTqUeBHm-NOdLh3ZN8_1xdOcPM9RK2jGqWB_vN9VJhHqlu1EoXX75Gc_6jW748jDBQWZLsk",
		alt: "Sneakers at a modern café",
	},
	{
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfwnExEl5otzyqYgZTqFDGbWRVOOBGFpv83GzcCxF4_2MQvWBEPz8F-qf75jM5o7eAEwOL58GScKowLAQ2xBg9roCbXgZ1KWcw7JUTL9bUJBWIBGNXWoAp4fFXixpu9BaKRSlMjQRTCwGkHIe3gx550aa-iKbpxbbuQvA28T4o9IBBCt4P0rYkXIm99yzRb1GlPIr3xIyK1HJb2Nenl_Hr0GZwwuyDMEWyfgGzyAQFP9JmYuZyotmoYy4p-y6knoIxMeE4nfF5Ww",
		alt: "Sneakers displayed in a high-end boutique",
	},
];

export function CommunityGallery() {
	return (
		<section className="py-16 bg-surface-container-low">
			<div className="px-6 mb-8 text-center">
				<h3 className="text-3xl font-extrabold tracking-tighter uppercase">
					Seen In The Lab
				</h3>
				<p className="text-on-surface-variant text-sm mt-2">
					Tag @SneakerLab to be featured
				</p>
			</div>
			<div className="grid grid-cols-3 gap-1 px-1">
				{PHOTOS.map((photo) => (
					<div
						key={photo.src}
						className="relative aspect-square overflow-hidden">
						<Image
							src={photo.src}
							alt={photo.alt}
							fill
							className="object-cover"
							unoptimized
						/>
					</div>
				))}
			</div>
		</section>
	);
}

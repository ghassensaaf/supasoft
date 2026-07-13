import React from "react";
import { Marquee } from "./marquee";

// Placeholder wordmarks — replace with your real client names, or swap the
// <span> for a monochrome <Image> logo (e.g. grayscale + opacity classes).
const clients = [
	"Nexora",
	"HelioBank",
	"Vantage Group",
	"Meridian Health",
	"Atlas Logistics",
	"Lumen Retail",
	"Orbital Media",
	"Cobalt Energy",
];

export const LogoMarquee: React.FC = () => {
	return (
		<div className="container mx-auto flex flex-col items-center gap-12 px-4">
			<h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
				Trusted by our clients
			</h2>
			<Marquee duration={40}>
				{clients.map((name) => (
					<span
						key={name}
						className="mx-8 whitespace-nowrap text-xl font-medium text-zinc-500 duration-500 hover:text-zinc-200 sm:mx-12 sm:text-2xl font-display"
					>
						{name}
					</span>
				))}
			</Marquee>
		</div>
	);
};

import React from "react";
import { Marquee } from "./marquee";
import { TechLogo, techLogos } from "./tech-logos";

// One marquee row per category (AI, languages & frameworks, data &
// backend, cloud & devops), in the order the data file defines them.
// Categories only decide the grouping — they are never rendered.
const rows = techLogos.reduce<TechLogo[][]>((acc, tech) => {
	const row = acc.find((r) => r[0].category === tech.category);
	if (row) {
		row.push(tech);
	} else {
		acc.push([tech]);
	}
	return acc;
}, []);

// A seamless loop needs a reasonably wide track; repeat short rows
// until they hold at least 8 items.
const filled = rows.map((row) => {
	const items: TechLogo[] = [];
	while (items.length < 8) {
		items.push(...row);
	}
	return items;
});

const TechItem: React.FC<{ tech: TechLogo }> = ({ tech }) => (
	<span className="mx-8 flex items-center gap-3 whitespace-nowrap text-zinc-500 duration-500 hover:text-zinc-200 sm:mx-10">
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className="h-6 w-6 shrink-0 sm:h-7 sm:w-7"
			role="img"
			aria-label={`${tech.name} logo`}
		>
			<path d={tech.path} />
		</svg>
		<span className="text-lg font-medium sm:text-xl font-display">
			{tech.name}
		</span>
	</span>
);

/**
 * Technology partners as stacked carousels matching the clients marquee.
 * Adjacent rows drift in opposite directions at slightly different
 * speeds, which reads as depth rather than a single repeating band.
 */
export const TechMarquee: React.FC = () => {
	return (
		<div className="container mx-auto flex flex-col items-center gap-12 px-4">
			<div className="flex flex-col items-center gap-4 text-center">
				<h2 className="text-3xl font-display text-zinc-100 sm:text-4xl">
					Powered by best-in-class technology
				</h2>
				<p className="max-w-xl text-sm text-zinc-400">
					We build on the platforms we trust — modern, proven and ready to
					scale with you.
				</p>
			</div>
			<div className="flex w-full flex-col gap-8 sm:gap-10">
				{filled.map((items, rowIndex) => (
					<Marquee
						key={items[0].category}
						reverse={rowIndex % 2 === 1}
						duration={55 + rowIndex * 7}
					>
						{items.map((tech, i) => (
							<TechItem key={`${tech.name}-${i}`} tech={tech} />
						))}
					</Marquee>
				))}
			</div>
		</div>
	);
};

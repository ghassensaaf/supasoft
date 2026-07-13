import fs from "fs";
import path from "path";
import React from "react";
import { Marquee } from "./marquee";

/**
 * Adding a client logo = dropping a file into public/logos/clients/
 * (svg/png/webp/jpg) — no code changes. This is a server component, so
 * the directory is read once at build time and the list is baked into
 * the static page.
 *
 * - The alt text is derived from the filename: "smart-flow.svg" →
 *   "Smart Flow". An optional numeric prefix orders the carousel and is
 *   stripped: "01-evaro.svg" → "Evaro".
 * - Logos are normalized to white monochrome silhouettes with a CSS
 *   filter (brightness(0) invert(1)), so colored artwork blends into
 *   the site's zinc palette without editing the files.
 */
const LOGO_DIR = path.join(process.cwd(), "public", "logos", "clients");

interface ClientLogo {
	src: string;
	name: string;
}

function loadClientLogos(): ClientLogo[] {
	let files: string[] = [];
	try {
		files = fs.readdirSync(LOGO_DIR);
	} catch {
		return [];
	}
	return files
		.filter((file) => /\.(svg|png|webp|jpe?g)$/i.test(file))
		.sort()
		.map((file) => ({
			src: `/logos/clients/${file}`,
			name: file
				.replace(/\.[^.]+$/, "")
				.replace(/^\d+[-_]/, "")
				.replace(/[-_]+/g, " ")
				.replace(/\b\w/g, (c) => c.toUpperCase()),
		}));
}

export const LogoMarquee: React.FC = () => {
	const logos = loadClientLogos();
	if (logos.length === 0) {
		return null;
	}

	// A seamless loop needs a reasonably wide track; with few logos,
	// repeat the set until there are at least 8 items.
	const items: ClientLogo[] = [];
	while (items.length < 8) {
		items.push(...logos);
	}

	return (
		<div className="container mx-auto flex flex-col items-center gap-12 px-4">
			<h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
				Trusted by our clients
			</h2>
			<Marquee duration={40}>
				{items.map((logo, i) => (
					<img
						key={`${logo.src}-${i}`}
						src={logo.src}
						alt={logo.name}
						loading="lazy"
						className="mx-10 h-8 w-auto max-w-[10rem] object-contain opacity-50 duration-500 [filter:brightness(0)_invert(1)] hover:opacity-100 sm:mx-12 sm:h-9"
					/>
				))}
			</Marquee>
		</div>
	);
};

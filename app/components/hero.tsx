import Link from "next/link";
import React from "react";

const navigation = [{ name: "Contact", href: "/contact" }];

/**
 * Opening scene — the original fullscreen hero, markup and CSS entry
 * animation (title reveal, glow lines) untouched. Its exit is handled by
 * the scene system in scenes.tsx, so this is pure content.
 */
export const Hero: React.FC = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
			<nav className="my-16 animate-fade-in">
				<ul className="flex items-center justify-center gap-4">
					{navigation.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
						>
							{item.name}
						</Link>
					))}
				</ul>
			</nav>
			<div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
			<h1 className="z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
				Supasoft Consulting
			</h1>
			<div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
		</div>
	);
};

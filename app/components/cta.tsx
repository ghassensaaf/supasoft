import Link from "next/link";
import React from "react";

/**
 * Final scene: a closing statement rather than a traditional footer. The
 * scene system supplies the fullscreen stage; this is pure content.
 */
export const FooterCta: React.FC = () => {
	return (
		<div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 text-center">
			<div className="hidden h-px w-screen md:block bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
			<h2 className="text-4xl text-transparent bg-white bg-clip-text font-display sm:text-6xl md:text-7xl">
				Ready to build what's next?
			</h2>
			<p className="max-w-xl text-sm text-zinc-400 sm:text-base">
				From idea to production — we design, build and ship software that
				moves your business forward.
			</p>
			<div className="flex flex-col items-center gap-4 sm:flex-row">
				<Link
					href="/contact"
					className="rounded-full bg-zinc-100 px-8 py-3 text-sm font-medium text-black duration-500 hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
				>
					Let's build together
				</Link>
				{/* Swap the mailto for your scheduling link (Cal.com / Calendly) when ready */}
				<Link
					href="mailto:info@supasoft.com.tn"
					className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-medium text-zinc-300 duration-500 hover:border-zinc-400 hover:text-white"
				>
					Book a call
				</Link>
			</div>
			<p className="mt-16 text-xs text-zinc-600">
				© {new Date().getFullYear()} Supasoft Consulting. All rights reserved.
			</p>
		</div>
	);
};

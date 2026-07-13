import React, { PropsWithChildren } from "react";

interface MarqueeProps extends PropsWithChildren {
	/** Scroll direction of the track */
	reverse?: boolean;
	/** Seconds for one full loop */
	duration?: number;
	className?: string;
}

/**
 * Infinite auto-scrolling track. Children are rendered twice and a CSS
 * keyframe translates the track by -50%, so the loop point is invisible.
 * Pure CSS animation = compositor-only, no JS on the hot path. Hover
 * pauses via `animation-play-state`; `motion-reduce` disables it.
 *
 * Items must carry their own horizontal spacing (e.g. mx-8) — a flex gap
 * on the track would break the exact -50% seam.
 */
export const Marquee: React.FC<MarqueeProps> = ({
	children,
	reverse = false,
	duration = 40,
	className = "",
}) => {
	return (
		<div
			className={`group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] ${className}`}
		>
			<div
				className={`flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
					reverse ? "[animation-direction:reverse]" : ""
				}`}
				style={{ animationDuration: `${duration}s` }}
			>
				<div className="flex items-center">{children}</div>
				<div className="flex items-center" aria-hidden="true">
					{children}
				</div>
			</div>
		</div>
	);
};

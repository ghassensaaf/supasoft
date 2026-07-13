"use client";
import {
	MotionValue,
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import React, { PropsWithChildren, useRef, useState } from "react";

/**
 * Scene-based scroll presentation.
 *
 * The page is NOT a scrolling document: all scenes are stacked on top of
 * each other (absolute inset-0) inside one sticky, fullscreen stage. The
 * outer runway div is `count * 150vh` tall and exists purely to give the
 * wheel/touchpad something to scrub — its scroll progress (0..1) drives
 * the transitions. Nothing translates vertically, so the user never sees
 * the page move; scrolling dissolves one scene into the next within the
 * same viewport, like a keynote controlled by the wheel.
 *
 * Transitions are SEQUENTIAL, never overlapping: the outgoing scene
 * fully fades out (receding to scale 0.9) before the incoming scene
 * starts fading in (rising from scale 0.9 to 1), with a beat of pure
 * particle field between them. Each fade spans ~50vh of scroll, so the
 * handoff is deliberate and clearly visible rather than a quick blend.
 * Everything is scroll-scrubbed, reversible, and compositor-only
 * (opacity/transform).
 */
export const ScrollScenes: React.FC<PropsWithChildren> = ({ children }) => {
	const ref = useRef<HTMLDivElement>(null);
	const scenes = React.Children.toArray(children);
	const count = scenes.length;

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end end"],
	});

	// Only the active scene may receive pointer events (buttons, marquee
	// hover-pause); inactive scenes are invisible and inert.
	const [active, setActive] = useState(0);
	useMotionValueEvent(scrollYProgress, "change", (v) => {
		setActive(Math.min(count - 1, Math.max(0, Math.round(v * (count - 1)))));
	});

	// 150vh of runway per scene: generous dwell time plus slow, readable
	// transitions between scenes.
	return (
		<div ref={ref} className="relative" style={{ height: `${count * 150}vh` }}>
			<div className="sticky top-0 h-screen overflow-hidden">
				{scenes.map((child, i) => (
					<Scene
						// rome-ignore lint/suspicious/noArrayIndexKey: static scene order
						key={i}
						index={i}
						count={count}
						progress={scrollYProgress}
						active={active === i}
					>
						{child}
					</Scene>
				))}
			</div>
		</div>
	);
};

interface SceneProps extends PropsWithChildren {
	index: number;
	count: number;
	progress: MotionValue<number>;
	active: boolean;
}

const Scene: React.FC<SceneProps> = ({
	index,
	count,
	progress,
	active,
	children,
}) => {
	const prefersReducedMotion = useReducedMotion();

	// Scene i dwells around progress i/(count-1). The handoff to the next
	// scene is centered on the midpoint between the two scenes and is
	// strictly sequential: the outgoing scene fades out BEFORE the
	// midpoint, the incoming scene fades in AFTER it — the two are never
	// on screen at the same time.
	const seg = 1 / (count - 1);
	const w = 0.3 * seg; // duration of each fade (out or in)
	const mPrev = (index - 0.5) * seg; // midpoint shared with previous scene
	const mNext = (index + 0.5) * seg; // midpoint shared with next scene

	const inStart = mPrev;
	const inEnd = mPrev + w;
	const outStart = mNext - w;
	const outEnd = mNext;

	const first = index === 0;
	const last = index === count - 1;

	const input = first
		? [outStart, outEnd]
		: last
		? [inStart, inEnd]
		: [inStart, inEnd, outStart, outEnd];

	const opacity = useTransform(
		progress,
		input,
		first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0],
	);
	// A full 10% of scale movement so the recede/rise is clearly felt.
	const scale = useTransform(
		progress,
		input,
		first ? [1, 0.9] : last ? [0.9, 1] : [0.9, 1, 1, 0.9],
	);
	// Fully faded scenes are hidden outright: their CSS marquees stop
	// painting and their content drops out of the tab order.
	const visibility = useTransform(opacity, (o) =>
		o <= 0.001 ? "hidden" : "visible",
	);

	return (
		<motion.div
			style={{
				opacity,
				visibility,
				...(prefersReducedMotion ? {} : { scale }),
				pointerEvents: active ? "auto" : "none",
			}}
			className="absolute inset-0 flex items-center justify-center"
		>
			{children}
		</motion.div>
	);
};

"use client";
import {
	MotionValue,
	animate,
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import React, {
	PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from "react";

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

	// The scene transforms follow a spring-smoothed copy of the scroll
	// progress, so discrete wheel ticks render as fluid, inertial motion
	// instead of visible steps. Raw progress still drives the snap logic
	// and active-scene tracking, which need the real scroll position.
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	// Only the active scene may receive pointer events (buttons, marquee
	// hover-pause); inactive scenes are invisible and inert.
	const [active, setActive] = useState(0);

	// Scene snapping: while the user scrolls, everything stays scrubbed;
	// when input goes quiet mid-transition, glide to a scene's dwell point
	// so the page always settles on a fully visible scene.
	//
	// The snap is direction-aware rather than nearest-wins: scrolling
	// forward commits to the next scene once the transition is ~18%
	// underway (and symmetrically when scrolling back), so a gentle wheel
	// flick is enough to advance — you never get pulled back to the scene
	// you just left.
	const SNAP_COMMIT = 0.18;
	const prefersReducedMotion = useReducedMotion();
	const settleTimer = useRef<ReturnType<typeof setTimeout>>();
	const snapAnimation = useRef<ReturnType<typeof animate> | null>(null);
	const snapping = useRef(false);
	const lastProgress = useRef(0);
	const direction = useRef(0);

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		setActive(Math.min(count - 1, Math.max(0, Math.round(v * (count - 1)))));

		if (snapping.current) return; // our own glide is driving the scroll
		if (v !== lastProgress.current) {
			direction.current = v > lastProgress.current ? 1 : -1;
			lastProgress.current = v;
		}
		clearTimeout(settleTimer.current);
		settleTimer.current = setTimeout(() => {
			const el = ref.current;
			if (!el) return;
			// Position in scene units: 1.3 = 30% through the 1 -> 2 transition.
			const pos = v * (count - 1);
			const base = Math.floor(pos);
			const frac = pos - base;
			let index: number;
			if (direction.current > 0) {
				index = frac > SNAP_COMMIT ? base + 1 : base;
			} else if (direction.current < 0) {
				index = frac < 1 - SNAP_COMMIT ? base : base + 1;
			} else {
				index = Math.round(pos);
			}
			index = Math.min(count - 1, Math.max(0, index));
			const target = index / (count - 1);
			if (Math.abs(v - target) < 0.004) return; // already on a scene
			const scrollable = el.offsetHeight - window.innerHeight;
			const targetY = el.offsetTop + target * scrollable;
			if (prefersReducedMotion) {
				window.scrollTo(0, targetY);
				return;
			}
			snapping.current = true;
			snapAnimation.current = animate(window.scrollY, targetY, {
				type: "tween",
				duration: 0.7,
				ease: [0.32, 0.72, 0, 1],
				onUpdate: (y) => window.scrollTo(0, y),
				onComplete: () => {
					snapping.current = false;
				},
				onStop: () => {
					snapping.current = false;
				},
			});
		}, 150);
	});

	// Any fresh user input takes control back from an in-flight glide.
	useEffect(() => {
		const cancel = () => snapAnimation.current?.stop();
		window.addEventListener("wheel", cancel, { passive: true });
		window.addEventListener("touchstart", cancel, { passive: true });
		window.addEventListener("mousedown", cancel, { passive: true });
		return () => {
			window.removeEventListener("wheel", cancel);
			window.removeEventListener("touchstart", cancel);
			window.removeEventListener("mousedown", cancel);
			clearTimeout(settleTimer.current);
		};
	}, []);

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
						progress={prefersReducedMotion ? scrollYProgress : smoothProgress}
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

import { Crown } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card } from "./card";

// Upwork share link for a completed contract; redirects visitors to the
// verified freelancer profile.
const UPWORK_URL =
	"https://www.upwork.com/ab/g/pub/wom/prx/eyJwZXJzb25VaWQiOiIxMTQ0NDYxOTc2NDM1ODE0NDAwIiwiY29udHJhY3RSaWQiOiIzNTM0MDg4MiIsImJhbm5lclR5cGUiOiJjb250cmFjdCIsImJhbm5lclZhcmlhbnQiOiJkZWZhdWx0Iiwid29tIjoiZmx2MiIsInJlZGlyZWN0IjoiZmxfcHJvZmlsZV9wcm9tbyJ9?network=linkedin";

// Upwork brand mark from simple-icons (https://simpleicons.org), CC0.
const UPWORK_PATH =
	"M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z";

const STAR_PATH =
	"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

// Verbatim client reviews from completed Upwork contracts.
const reviews = [
	{
		contract: "Full-Stack Developer — Santé Prime",
		quote:
			"Working with Ghassen has been a very good experience. As a developer, he demonstrated exceptional technical skills and a deep understanding of the project requirements. He delivered clean, efficient, and well-documented code, all while adhering to tight deadlines. I highly recommend Ghassen to anyone in need of a top-notch developer.",
	},
	{
		contract: "Full Stack JS Developer - Shopify Apps (Tada, Smart flow, ..)",
		quote:
			"Ghassen was a solid full stack developer and easy to work with during the contract. He showed strong skills in NodeJS and React, communicated clearly, and stayed responsive to feedback. Tasks were handled professionally and delivered as expected.",
	},
	{
		contract: "React Developer — Superstruct",
		quote:
			"Wonderful FE dev that excelled with his work here. We're happy to have had him on the team.",
	},
];

const Stars: React.FC = () => (
	<span className="flex items-center gap-1.5">
		<span className="flex gap-0.5" aria-hidden="true">
			{[0, 1, 2, 3, 4].map((i) => (
				<svg
					key={i}
					viewBox="0 0 24 24"
					fill="currentColor"
					className="h-3.5 w-3.5 text-zinc-200"
				>
					<path d={STAR_PATH} />
				</svg>
			))}
		</span>
		<span className="text-xs font-medium text-zinc-300">5.0</span>
	</span>
);

/**
 * Social-proof scene: verified 5-star client reviews from Upwork,
 * designed in the site's own language (monochrome, spotlight cards)
 * rather than embedding Upwork's banner graphic.
 */
export const UpworkScene: React.FC = () => {
	return (
		<div className="container mx-auto flex flex-col items-center gap-5 px-4 sm:gap-12">
			<h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
				Independently verified
			</h2>
			{/* Official Upwork profile badges — the only color accents on the
			    page, kept intentionally: buyers recognize these marks. */}
			<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
				<span className="flex items-center gap-2">
					<span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 sm:h-6 sm:w-6">
						<Crown
							className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5"
							fill="currentColor"
							strokeWidth={0}
							aria-hidden="true"
						/>
					</span>
					<span className="text-xs font-medium text-zinc-200 sm:text-sm">
						100% Job Success
					</span>
				</span>
				<span className="flex items-center gap-2">
					{/* Upwork "Top Rated Plus" badge mark */}
					<svg
						viewBox="0 0 28 28"
						fill="none"
						className="h-5 w-5 sm:h-6 sm:w-6"
						aria-hidden="true"
					>
						<path
							fill="#F66DBC"
							d="M12 1.155a4 4 0 014 0l8.124 4.69a4 4 0 012 3.464v9.382a4 4 0 01-2 3.464L16 26.845a4 4 0 01-4 0l-8.124-4.69a4 4 0 01-2-3.464V9.309a4 4 0 012-3.464L12 1.155z"
						/>
						<path
							stroke="#fff"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeMiterlimit="10"
							strokeWidth="1.5"
							d="M17.94 18.396c.2.73-.597 1.262-1.195.863l-2.723-1.793-2.724 1.793c-.598.399-1.395-.199-1.196-.863l.731-3.122-2.524-2.06c-.598-.465-.266-1.395.465-1.46l3.255-.2 1.196-3.056c.265-.664 1.262-.664 1.527 0l1.196 3.056m1.662.199v4.65M20 14.078h-4.65"
						/>
					</svg>
					<span className="text-xs font-medium text-zinc-200 sm:text-sm">
						Top Rated Plus
					</span>
				</span>
			</div>
			<ul className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
				{reviews.map((review) => (
					<li key={review.contract}>
						<Card>
							<figure className="flex h-full flex-col gap-3 p-4 text-left sm:gap-4 sm:p-6">
								<Stars />
								<blockquote className="text-sm italic leading-relaxed text-zinc-300 line-clamp-3 sm:line-clamp-6">
									"{review.quote}"
								</blockquote>
								<figcaption className="mt-auto text-xs text-zinc-500">
									{review.contract}
								</figcaption>
							</figure>
						</Card>
					</li>
				))}
			</ul>
			<Link
				href={UPWORK_URL}
				target="_blank"
				rel="noopener noreferrer"
				className="group flex items-center gap-2 text-sm text-zinc-400 duration-500 hover:text-white"
			>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					className="h-5 w-5"
					role="img"
					aria-label="Upwork logo"
				>
					<path d={UPWORK_PATH} />
				</svg>
				<span>View our verified profile on Upwork →</span>
			</Link>
		</div>
	);
};

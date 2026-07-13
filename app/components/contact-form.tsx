"use client";
import React, { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClasses =
	"w-full rounded-md border border-zinc-700 bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none duration-500 focus:border-zinc-400";

export const ContactForm: React.FC = () => {
	const [status, setStatus] = useState<Status>("idle");
	const [error, setError] = useState("");

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = Object.fromEntries(new FormData(form));
		setStatus("sending");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.error ?? "Something went wrong. Please try again.");
			}
			form.reset();
			setStatus("sent");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong. Please try again.",
			);
			setStatus("error");
		}
	}

	if (status === "sent") {
		return (
			<p className="py-16 text-center text-zinc-300">
				Thank you — your message has been sent. We'll get back to you shortly.
			</p>
		);
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<input
					name="name"
					type="text"
					required
					maxLength={200}
					placeholder="Your name"
					aria-label="Your name"
					className={inputClasses}
				/>
				<input
					name="email"
					type="email"
					required
					maxLength={200}
					placeholder="you@company.com"
					aria-label="Your email"
					className={inputClasses}
				/>
			</div>
			<textarea
				name="message"
				required
				maxLength={5000}
				rows={6}
				placeholder="Tell us about your project…"
				aria-label="Your message"
				className={`${inputClasses} resize-y`}
			/>
			{status === "error" && (
				<p role="alert" className="text-sm text-red-400">
					{error}
				</p>
			)}
			<button
				type="submit"
				disabled={status === "sending"}
				className="self-end rounded-full bg-zinc-100 px-8 py-3 text-sm font-medium text-black duration-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
			>
				{status === "sending" ? "Sending…" : "Send message"}
			</button>
		</form>
	);
};

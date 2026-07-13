"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { ContactForm } from "../components/contact-form";

export default function Example() {
	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="flex w-full max-w-2xl flex-col gap-8 mx-auto mt-32 sm:mt-0 py-16">
					<div className="flex flex-col items-center gap-4 text-center">
						<h1 className="text-3xl font-display text-zinc-100 sm:text-4xl">
							Get in touch
						</h1>
						<p className="max-w-md text-sm text-zinc-400">
							Tell us about your project and we'll get back to you within one
							business day.
						</p>
					</div>
					<Card>
						<div className="p-6 sm:p-10">
							<ContactForm />
						</div>
					</Card>
					<Link
						href="mailto:contact@supasoft.dev"
						className="group mx-auto flex items-center gap-2 text-sm text-zinc-500 duration-500 hover:text-zinc-200"
					>
						<Mail size={16} />
						<span>Or email us directly — contact@supasoft.dev</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

import { NextResponse } from "next/server";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "contact@supasoft.dev";
// Until supasoft.dev is verified in Resend, onboarding@resend.dev is the
// only allowed sender (and it can only deliver to the Resend account
// owner's address). After verifying the domain, switch CONTACT_FROM_EMAIL
// to e.g. "Supasoft Website <contact@supasoft.dev>".
const FROM_EMAIL =
	process.env.CONTACT_FROM_EMAIL ?? "Supasoft Website <onboarding@resend.dev>";

export async function POST(request: Request) {
	let body: { name?: string; email?: string; message?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid request." }, { status: 400 });
	}

	const name = body.name?.trim() ?? "";
	const email = body.email?.trim() ?? "";
	const message = body.message?.trim() ?? "";

	if (!name || !email || !message) {
		return NextResponse.json(
			{ error: "Name, email and message are all required." },
			{ status: 400 },
		);
	}
	if (name.length > 200 || email.length > 200 || message.length > 5000) {
		return NextResponse.json({ error: "Message too long." }, { status: 400 });
	}
	if (!/^\S+@\S+\.\S+$/.test(email)) {
		return NextResponse.json(
			{ error: "Please enter a valid email address." },
			{ status: 400 },
		);
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{
				error: `The contact form is not configured yet — please email us directly at ${TO_EMAIL}.`,
			},
			{ status: 503 },
		);
	}

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: FROM_EMAIL,
			to: [TO_EMAIL],
			reply_to: email,
			subject: `New inquiry from ${name}`,
			text: `${message}\n\n— ${name} <${email}>`,
		}),
	});

	if (!res.ok) {
		console.error("Resend error:", res.status, await res.text());
		return NextResponse.json(
			{
				error: `We couldn't send your message right now — please email us directly at ${TO_EMAIL}.`,
			},
			{ status: 502 },
		);
	}

	return NextResponse.json({ ok: true });
}

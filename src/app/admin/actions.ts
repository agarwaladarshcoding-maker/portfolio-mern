"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Grind from "@/models/Grind";
import Now from "@/models/Now";
import Subscriber from "@/models/Subscriber";
import Project from "@/models/Project";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY || "dummy_key");


// Extreme zero-trust master password environment var.
const ADMIN_SECRET = process.env.ADMIN_SECRET || "quant_god";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  if (password === ADMIN_SECRET) {
    // Generate a simple secure signed cookie (HTTP-Only)
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    redirect("/admin");
  } else {
    throw new Error("Invalid password");
  }
}

export async function submitGrindPost(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== "authenticated") throw new Error("Unauthorized");

  await connectDB();

  const title = formData.get("title") as string;
  const dayCount = parseInt(formData.get("dayCount") as string, 10);
  const tagsString = (formData.get("tags") as string) || "";
  const body = formData.get("body") as string;

  const tags = tagsString.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
  const slug = `day-${dayCount}`;

  try {
    await Grind.create({
      dayCount,
      title,
      body,
      tags,
      slug,
      published: true
    });
  } catch (error: any) {
    throw new Error(error.message);
  }

  redirect("/admin");
}

export async function updateNowPage(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== "authenticated") throw new Error("Unauthorized");

  await connectDB();

  const content = formData.get("content") as string;

  try {
    // Either update the existing Now or create a new single document
    const current = await Now.findOne();
    if (current) {
      current.content = content;
      current.lastUpdated = new Date();
      await current.save();
    } else {
      await Now.create({ content, lastUpdated: new Date() });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }

  redirect("/admin");
}

/**
 * logoutAdmin — clears the session cookie and redirects to admin login gate.
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // immediately expire
    path: "/",
  });
  redirect("/admin");
}

/**
 * broadcastUpdate — sends a custom email to all verified subscribers.
 */
export async function broadcastUpdate(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== "authenticated") throw new Error("Unauthorized");

  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!subject || !message) throw new Error("Missing subject or message");

  await connectDB();
  const verifiedSubscribers = await Subscriber.find({ verified: true }).lean();

  if (!verifiedSubscribers || verifiedSubscribers.length === 0) {
    console.log("No verified subscribers to notify.");
    redirect("/admin");
    return;
  }

  const emails = verifiedSubscribers.map((s) => s.email as string);

  try {
    const resend = getResend();
    // resend.emails.send supports an array of recipients (up to 50 per call usually)
    // For larger lists, should use batching.
    const { error } = await resend.emails.send({
      from: "Adarsh Agarwala <stealth@resend.dev>", // update after verification
      to: "subscribers@adarshagarwala.com", // dummy placeholder for 'to' field when bcc used
      bcc: emails,
      subject: subject,
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #f2f2f2; padding: 40px; max-width: 600px; margin: auto;">
          <div style="color: #C5A059; font-size: 11px; letter-spacing: 0.2em; margin-bottom: 2rem;">
            STEALTH_LOG UPDATE — BROADCAST
          </div>
          <h1 style="font-family: Georgia, serif; font-size: 24px; color: #f2f2f2; margin: 0 0 1.5rem;">
            ${subject}
          </h1>
          <div style="color: #ccc; line-height: 1.8; font-family: sans-serif; font-size: 16px; white-space: pre-wrap;">
${message}
          </div>
          <div style="margin-top: 3rem; border-top: 1px solid #222; paddingTop: 1.5rem; color: #555; font-size: 12px;">
            Sent from the command center. To stop receiving these, click 'unsubscribe' soon.
          </div>
        </div>
      `,
    });

    if (error) throw new Error(error.message);
  } catch (err: any) {
    console.error("Broadcast failed:", err);
    throw new Error("Mass mail failed: " + err.message);
  }

  redirect("/admin");
}

export async function updateProjectSettings(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== "authenticated") throw new Error("Unauthorized");

  await connectDB();

  const slug = formData.get("slug") as string;
  const hasGithubLink = formData.get("hasGithubLink") === "on";
  const githubUrl = formData.get("githubUrl") as string;

  if (!slug) throw new Error("Missing project slug");

  try {
    await Project.findOneAndUpdate(
      { slug },
      { hasGithubLink, githubUrl },
      { upsert: true, new: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }

  redirect("/admin");
}

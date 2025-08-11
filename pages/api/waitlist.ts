import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string // server-only
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, source, metadata } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    // very basic email check
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) return res.status(400).json({ error: "Invalid email" });

    // upsert so duplicates don’t blow up
    const { error } = await supabaseAdmin
      .from("waitlist_emails")
      .upsert(
        { email, source: source ?? "landing", metadata: metadata ?? {} },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to save email" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

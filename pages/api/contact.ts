// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, organization, message, source } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });
    if (!name) return res.status(400).json({ error: "Name required" });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        organization: organization || null,
        message: message || null,
        source,
        metadata: {},
        created_at: new Date().toISOString()
      });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}


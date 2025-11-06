import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; // simple & permissive; rely on server for final validation

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [honeypot, setHoneypot] = useState(""); // spam trap
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const isValid = useMemo(() => emailRegex.test(email.trim()) && name.trim().length > 0, [email, name]);

  useEffect(() => {
    // Clear field error as the user types
    if (fieldError && isValid) setFieldError("");
  }, [isValid, fieldError]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (honeypot) {
      // Bot likely filled the hidden field
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      setFieldError("Please enter a valid email address.");
      return;
    }
    if (!cleanName) {
      setFieldError("Please enter your name.");
      return;
    }

    // Abort any in-flight request to prevent races
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setMsg("");

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: cleanName,
          email: cleanEmail, 
          organization: organization.trim(),
          message: message.trim(),
          source: "contact" 
        }),
        signal: controller.signal,
      });

      // Only parse JSON once we know it's parseable/needed
      if (!r.ok) {
        let errorText = "Something went wrong";
        try {
          const json = await r.json();
          errorText = json?.error ?? errorText;
        } catch {
          // fall back to status text
          errorText = r.statusText || errorText;
        }
        setStatus("error");
        setMsg(errorText);
        return;
      }

      setStatus("ok");
      setMsg("Thank you! We'll get back to you soon.");
      setName("");
      setEmail("");
      setOrganization("");
      setMessage("");
    } catch (err: any) {
      if (err?.name === "AbortError") return; // silently ignore aborted submit
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <Head>
        <title>Get Started with Us Today | Mesh</title>
        <meta name="description" content="Get in touch with Mesh." />
        <link rel="icon" href="/logo.png" type="image/png" />
        <style>{`
          @keyframes gradient-mesh {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-mesh { background-size: 400% 400%; animation: gradient-mesh 8s ease infinite; }
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce){
            .animate-gradient-mesh, .spin { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
          }
        `}</style>
      </Head>

      {/* Gradient background */}
      <div className="absolute inset-0 animate-gradient-mesh z-0 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/50">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Mesh logo" className="h-16 w-16" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Get Started with Us Today
        </h1>
        <p className="text-sm text-gray-700 mb-6 text-center">
          Let's start a conversation about how we can help you.
        </p>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* Name field */}
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={[
                "w-full border rounded-lg px-3 py-3",
                "outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                "text-gray-900 placeholder-gray-500",
                fieldError && !name ? "border-red-500" : "border-gray-300",
              ].join(" ")}
            />
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={[
                "w-full border rounded-lg px-3 py-3",
                "outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                "text-gray-900 placeholder-gray-500",
                fieldError && !emailRegex.test(email) ? "border-red-500" : "border-gray-300",
              ].join(" ")}
              aria-invalid={!!fieldError}
              aria-describedby={fieldError ? "email-error" : undefined}
            />
            {fieldError && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {fieldError}
              </p>
            )}
          </div>

          {/* Organization field (optional) */}
          <div>
            <label htmlFor="organization" className="sr-only">Organization/College</label>
            <input
              id="organization"
              name="organization"
              type="text"
              autoComplete="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Organization/College (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Message field */}
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your needs..."
              className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
            />
          </div>

          {/* Honeypot (hidden from humans) */}
          <div className="hidden" aria-hidden>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !isValid}
            className={[
              "w-full bg-black text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-lg",
              "hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600",
              "disabled:hover:scale-100 disabled:hover:bg-black",
            ].join(" ")}
          >
            {status === "loading" ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity=".25"/>
                  <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" />
                </svg>
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        {/* Status region (screen-reader friendly) */}
        <div aria-live="polite" className="min-h-[1.25rem]">
          {msg && (
            <div
              className={`mt-4 text-sm text-center ${
                status === "ok" ? "text-green-700" : "text-red-600"
              }`}
            >
              {msg}
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-6 text-sm text-gray-600 hover:underline block mx-auto"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}


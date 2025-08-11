import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing" })
      });
      const json = await r.json();
      if (!r.ok) {
        setStatus("error");
        setMsg(json?.error ?? "Something went wrong");
        return;
      }
      setStatus("ok");
      setMsg("You’re on the list! We’ll email you when invites go out.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <Head>
        <title>Join the Mesh Waitlist</title>
        <style>{`
          @keyframes gradient-mesh {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-mesh {
            background: linear-gradient(-45deg, #a18cd1, #fbc2eb, #fad0c4, #ffd1ff);
            background-size: 400% 400%;
            animation: gradient-mesh 8s ease infinite;
          }
        `}</style>
      </Head>

      {/* Gradient background */}
      <div className="absolute inset-0 animate-gradient-mesh z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Mesh Logo" className="h-16 w-16" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Join the Waitlist</h1>
        <p className="text-sm text-gray-700 mb-6 text-center">
          Enter your email and we’ll notify you when Mesh is ready for you.
        </p>

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-black text-white px-4 py-2 rounded-lg font-medium disabled:opacity-70 hover:scale-105 transition"
          >
            {status === "loading" ? "Adding..." : "Join"}
          </button>
        </form>

        {msg && (
          <div
            className={`mt-4 text-sm text-center ${
              status === "ok" ? "text-green-700" : "text-red-600"
            }`}
          >
            {msg}
          </div>
        )}

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

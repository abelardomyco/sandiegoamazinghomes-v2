"use client";

import { useState } from "react";

const INPUT_CLASS =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-sd-500 focus:outline-none focus:ring-1 focus:ring-sd-500";

export default function AskRosameliaWidget({ source = "market_widget" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          question: question.trim(),
          source,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Thanks! Rosamelia will get back to you soon.");
        setName("");
        setEmail("");
        setQuestion("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (_) {
      setStatus("error");
      setMessage("Network error. Try again or email amazinghsd@gmail.com.");
    }
  };

  if (status === "success") {
    return (
      <section
        className="rounded-lg border border-sd-200 bg-sd-50/50 p-3"
        aria-labelledby="ask-rosamelia-title"
      >
        <h2 id="ask-rosamelia-title" className="text-sm font-bold text-slate-900 mb-1">
          Ask Rosamelia
        </h2>
        <p className="text-sm text-sd-800">{message}</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-3"
      aria-labelledby="ask-rosamelia-title"
    >
      <h2 id="ask-rosamelia-title" className="text-sm font-bold text-slate-900 mb-2">
        Ask Rosamelia
      </h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={INPUT_CLASS}
            disabled={status === "loading"}
          />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={INPUT_CLASS}
            disabled={status === "loading"}
          />
        </label>
        <label className="block">
          <span className="sr-only">Question</span>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Your question"
            required
            rows={3}
            className={INPUT_CLASS + " resize-y min-h-[4.5rem]"}
            disabled={status === "loading"}
          />
        </label>
        {message && status === "error" && (
          <p className="text-xs text-red-600">{message}</p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-sd-600 text-white py-2 text-sm font-semibold hover:bg-sd-700 disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}

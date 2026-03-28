import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const { loadAdminDashboardSnapshot } = require("@/lib/admin-dashboard-data");
  const d = await loadAdminDashboardSnapshot();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Site dashboard</h1>
          <p className="text-sm text-slate-600 mt-0.5">Internal — not for public indexing.</p>
        </div>
        <AdminLogoutButton />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Analytics and traffic</h2>
        <p className="text-sm text-slate-600 mt-2">{d.analytics.recommendation}</p>
        <p className="text-xs text-slate-500 mt-2">
          Status: <span className="font-medium text-amber-700">{d.analytics.status}</span> — cards below are
          placeholders until a provider is wired. This app does not log visitor IPs for this dashboard.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs text-slate-500">
          <li className="rounded-lg bg-slate-50 border border-slate-100 p-3">Visits (7d): connect analytics</li>
          <li className="rounded-lg bg-slate-50 border border-slate-100 p-3">Pageviews (7d): —</li>
          <li className="rounded-lg bg-slate-50 border border-slate-100 p-3">Top pages: —</li>
          <li className="rounded-lg bg-slate-50 border border-slate-100 p-3">Referrers: —</li>
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Contact submissions</h2>
          {!d.contacts.ok && <p className="text-sm text-amber-800 mt-2">{d.contacts.reason}</p>}
          {d.contacts.ok && d.contacts.rows.length === 0 && (
            <p className="text-sm text-slate-500 mt-2">No rows yet for this site key.</p>
          )}
          <ul className="mt-2 space-y-2 max-h-64 overflow-y-auto text-sm">
            {d.contacts.rows.map((r, i) => (
              <li key={i} className="border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-400">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                </span>
                <div className="font-medium text-slate-800">{r.email}</div>
                {r.name && <div className="text-xs text-slate-600">{r.name}</div>}
                {r.message && <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{r.message}</p>}
                <span className="text-[10px] uppercase text-slate-400">{r.source}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Blog inventory</h2>
          <p className="text-sm text-slate-600 mt-1">
            {d.blog.count} posts in list ·{" "}
            {d.blog.missingMd > 0 ? (
              <span className="text-amber-700">{d.blog.missingMd} missing .md file</span>
            ) : (
              <span className="text-green-700">all slugs have files</span>
            )}
          </p>
          <ul className="mt-2 text-xs space-y-1 max-h-52 overflow-y-auto">
            {d.blog.rows.map((b) => (
              <li key={b.slug}>
                <Link href={`/blog/${b.slug}`} className="text-sd-600 hover:underline" target="_blank">
                  {b.title || b.slug}
                </Link>
                {!b.hasMd && <span className="text-red-600 ml-1">no file</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Neighborhoods</h2>
          <p className="text-sm text-slate-600 mt-1">
            {d.neighborhoods.count} areas · {d.neighborhoods.placeholderHeroes} placeholder heroes ·{" "}
            {d.neighborhoods.missingMd} missing .md
          </p>
          <ul className="mt-2 text-xs space-y-1 max-h-52 overflow-y-auto">
            {d.neighborhoods.rows.map((n) => (
              <li key={n.slug}>
                <Link href={`/neighborhoods/${n.slug}`} className="text-sd-600 hover:underline" target="_blank">
                  {n.name}
                </Link>
                {n.heroIsPlaceholder && <span className="text-amber-700 ml-1">placeholder img</span>}
                {!n.hasMd && <span className="text-red-600 ml-1">no md</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Assets</h2>
          <p className="text-sm text-slate-600 mt-1">
            About {d.assets.count} image files in sdah photos to use
          </p>
          <p className="text-xs text-slate-500 mt-1">{d.assets.note}</p>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-amber-50/50 p-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">SEO / launch</h2>
        <p className="text-sm text-slate-700 mt-1">{d.seoNote}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Market quick notes</h2>
        <p className="text-xs text-slate-500 mt-1">Edit: content/admin/market-notes.md</p>
        <pre className="mt-2 text-xs text-slate-700 whitespace-pre-wrap font-sans bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto">
          {d.marketNotes.text}
        </pre>
      </section>
    </div>
  );
}

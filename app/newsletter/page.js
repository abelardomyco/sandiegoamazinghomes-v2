import { redirect } from "next/navigation";
import { getPublicSiteUrl } from "@/lib/public-site-url";

const base = getPublicSiteUrl();

export const metadata = {
  title: "Newsletter",
  robots: { index: false, follow: true },
  alternates: { canonical: `${base}/` },
};

export default function NewsletterPage() {
  redirect("/");
}

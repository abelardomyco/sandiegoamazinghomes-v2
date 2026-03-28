import { redirect } from "next/navigation";
import { getPublicSiteUrl } from "@/lib/public-site-url";

const base = getPublicSiteUrl();

export const metadata = {
  title: "Contact | San Diego Amazing Homes",
  description: "Contact Rosamelia for questions, tours, and local guidance.",
  alternates: { canonical: `${base}/` },
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  redirect("/#contact");
}


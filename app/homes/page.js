import { redirect } from "next/navigation";
import { getPublicSiteUrl } from "@/lib/public-site-url";

export const metadata = {
  title: "Homes",
  description: "San Diego real estate guidance: market, neighborhoods, and local insights.",
  alternates: { canonical: `${getPublicSiteUrl()}/` },
  robots: { index: false, follow: true },
};

export default function HomesPage() {
  // Homes/listings pages removed for now.
  redirect("/");
}

import Link from "next/link";
import { Instagram, Home, FileText } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/market", label: "Market" },
  { href: "/blog", label: "Blog" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const partnerLink = {
  href: "https://thebajalandcompany.com/",
  label: "The Baja Land Company",
  external: true,
};

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-gradient-footer text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-sd-300 transition-colors">
              <Home className="w-5 h-5" />
              San Diego Amazing Homes
            </Link>
            <p className="mt-3 text-sm text-slate-400">
              Royal California Real Estate — Your trusted partner in San Diego.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={partnerLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  {partnerLink.label}
                </a>
              </li>
            </ul>
          </div>

          {/* Blog & Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Stay in Touch
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Real estate insights for buyers and relocators—neighborhoods, schools, and market tips.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-sd-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Read the Blog
            </Link>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Follow
            </h3>
            <a
              href="https://www.instagram.com/sandiegoamazinghomes/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
              @sandiegoamazinghomes
            </a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-xs text-slate-500 text-center md:text-left">
            San Diego Amazing Homes — Royal California Real Estate. Rosamelia Lopez-Platt, REALTOR® DRE #02026714.
          </p>
        </div>
      </div>
    </footer>
  );
}

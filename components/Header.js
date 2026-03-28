"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, MapPin, FileText, Users, TrendingUp } from "lucide-react";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/market", label: "Market", icon: TrendingUp },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/neighborhoods", label: "Neighborhoods", icon: MapPin },
  { href: "/about", label: "About", icon: Users },
];

function NavLink({ href, label, icon: Icon, isActive, onClick, isMobile = false }) {
  if (isMobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? "bg-sd-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative px-3 py-2 text-sm font-medium transition-all ${
        isActive
          ? "text-white"
          : "text-slate-300 hover:text-white"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-sd-400 rounded-full" />
      )}
    </Link>
  );
}

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 bg-gradient-header transition-shadow duration-300 ${
        scrolled ? "shadow-header" : ""
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4rem] py-3">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Home className="w-5 h-5 text-sd-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">San Diego</span>
              <span className="text-sd-300 text-xs font-medium tracking-wide uppercase">Amazing Homes</span>
            </div>
          </Link>

          <nav className="header-desktop-nav items-center gap-1" aria-label="Main">
            {mainNav.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                isActive={isActivePath(pathname, href)}
              />
            ))}
            <Link
              href="/#contact"
              className="ml-4 px-4 py-2 bg-white text-sd-700 font-medium text-sm rounded-lg hover:bg-sd-50 transition-colors shadow-sm"
            >
              Contact
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="header-mobile-trigger p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div
          id="mobile-nav"
          className={`header-mobile-panel overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? "open max-h-[28rem] opacity-100 pb-4" : "closed max-h-0 opacity-0"
          }`}
          aria-hidden={!mobileOpen}
        >
          <nav className="pt-2 border-t border-white/10" aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {mainNav.map(({ href, label, icon }) => (
                <li key={href}>
                  <NavLink
                    href={href}
                    label={label}
                    icon={icon}
                    isActive={isActivePath(pathname, href)}
                    onClick={() => setMobileOpen(false)}
                    isMobile
                  />
                </li>
              ))}
              <li className="mt-2 pt-2 border-t border-white/10">
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-sd-700 font-medium rounded-lg hover:bg-sd-50 transition-colors"
                >
                  Contact Rosamelia
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

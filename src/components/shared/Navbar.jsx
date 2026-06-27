"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiLogOut, FiLayout, FiUser } from "react-icons/fi";
import { GiBottledBolt } from "react-icons/gi";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, isPending, error, refetch } = authClient.useSession();

  const status = session?.user ? "authenticated" : "unauthenticated";

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Classes", href: "/classes" },
    { name: "Community Forum", href: "/forum" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col items-center pointer-events-none font-sans">
      {/* Floating pill wrapper */}
      <div
        className={`pointer-events-auto w-[calc(100%-2rem)] max-w-5xl mt-4 mx-4 rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "bg-[#131313]/90 backdrop-blur-2xl border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
            : "bg-[#131313]/60 backdrop-blur-xl border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
        }`}
      >
        <nav className="px-4 md:px-5 py-3 flex justify-between items-center gap-4">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shrink-0"
          >
            {/* Icon with glow ring */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#d2f000]/10 border border-[#d2f000]/20 shadow-[0_0_16px_rgba(210,240,0,0.25)]">
              <GiBottledBolt className="text-[#d2f000] text-2xl" />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c6c9ab]/60 -mb-0.5">
                by elite
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tighter italic uppercase text-[#d2f000] leading-none">
                Elevate
                <span className="bg-linear-to-r from-[#dfff00] to-[#00daf8] bg-clip-text text-transparent">
                  X
                </span>
              </h1>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1 bg-[#1c1b1b]/60 p-1 rounded-xl border border-white/5">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 ${
                  isActive(link.href)
                    ? "bg-[#d2f000] text-[#131313] font-bold"
                    : "text-[#c6c9ab] hover:text-white"
                }`}
              >
                {link.name}
                {!isActive(link.href) && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[#d2f000] transition-all duration-300 group-hover:w-3/4 rounded-full" />
                )}
              </Link>
            ))}

            {status === "authenticated" && session?.user?.role && (
              <Link
                href={`/dashboard/${session.user.role}`}
                className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 ${
                  pathname.startsWith("/dashboard")
                    ? "bg-[#d2f000] text-[#131313] font-bold"
                    : "text-[#c6c9ab] hover:text-white"
                }`}
              >
                Dashboard
                {!pathname.startsWith("/dashboard") && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[#d2f000] transition-all duration-300 group-hover:w-3/4 rounded-full" />
                )}
              </Link>
            )}
          </div>

          {/* ── Desktop Auth ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {status === "authenticated" ? (
              <div className="flex items-center gap-2.5 bg-[#1e1e1e] border border-white/10 py-1.5 pl-2 pr-2 rounded-xl">
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#0e0e0e] border border-white/20 flex items-center justify-center shrink-0">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-[#c6c9ab] text-xs" />
                  )}
                </div>
                <span className="text-xs font-semibold uppercase text-[#e5e2e1] tracking-wider max-w-[90px] truncate">
                  {session.user.name.split(" ")[0]}
                </span>
                <div className="w-px h-4 bg-white/10" />
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#c6c9ab] hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <FiLogOut className="text-sm" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-[#c6c9ab] text-sm font-semibold hover:text-[#e5e2e1] transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#d2f000] text-[#191e00] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#00e0ff] active:scale-[0.97] transition-all shadow-[0_0_16px_rgba(210,240,0,0.2)]"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-[#e5e2e1] p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>

        {/* ── Mobile Drawer ── */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 px-4 pt-3 pb-5 space-y-3">
            <div className="flex flex-col gap-1.5">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all ${
                    isActive(link.href)
                      ? "bg-[#d2f000] text-[#131313]"
                      : "bg-[#0e0e0e] text-[#c6c9ab] hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {status === "authenticated" && session?.user?.role && (
                <Link
                  href={`/dashboard/${session.user.role}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide uppercase flex items-center gap-2 transition-all ${
                    pathname.startsWith("/dashboard")
                      ? "bg-[#d2f000] text-[#131313]"
                      : "bg-[#0e0e0e] text-[#c6c9ab] hover:bg-white/5"
                  }`}
                >
                  <FiLayout size={15} /> Dashboard
                </Link>
              )}
            </div>

            <div className="h-px bg-white/5" />

            {status === "authenticated" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-[#0e0e0e] p-3 rounded-xl border border-white/5">
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#1e1e1e] flex items-center justify-center shrink-0">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <FiUser className="text-[#c6c9ab]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#e5e2e1]">
                      {session.user.name}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-[#d2f000]">
                      {session.user.role} Account
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-red-950/40 text-red-400 border border-red-900/30 font-semibold py-3 rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full border border-white/10 text-center font-bold text-sm text-[#e5e2e1] py-3 rounded-xl uppercase tracking-wider bg-[#0e0e0e]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#d2f000] text-center font-bold text-sm text-[#191e00] py-3 rounded-xl uppercase tracking-wider"
                >
                  Join Elite
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

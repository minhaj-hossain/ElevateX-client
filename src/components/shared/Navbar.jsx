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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  console.log(session);

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
    setIsProfileOpen(false);
  }, [pathname]);

  // Helper check for active route layout styles
  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Base Public Links
  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Classes", href: "/classes" },
    { name: "Community Forum", href: "/forum" },
  ];

  return (
    <header className="bg-[#131313]/60 backdrop-blur-2xl sticky top-0 z-50 w-full border-b border-white/5 font-sans">
      <nav className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex justify-between items-center">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <div className="text-[#d2f000] text-3xl">
            <GiBottledBolt />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter italic uppercase text-[#d2f000]">
              Elevate
              <span className="bg-linear-to-r from-[#dfff00] to-[#00daf8] bg-clip-text text-transparent">
                X
              </span>
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2 bg-[#1c1b1b]/50 p-1 rounded-full border border-white/5">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5 ${
                isActive(link.href)
                  ? "bg-[#d2f000] text-[#131313] font-bold"
                  : "text-[#c6c9ab]"
              }`}
            >
              {link.name}

              {!isActive(link.href) && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[#d2f000] transition-all duration-300 group-hover:w-3/4" />
              )}
            </Link>
          ))}

          {status === "authenticated" && session?.user?.role && (
            <Link
              href={`/dashboard/${session.user.role}`}
              className={`group relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5 ${
                pathname.startsWith("/dashboard")
                  ? "bg-[#d2f000] text-[#131313] font-bold"
                  : "text-[#c6c9ab]"
              }`}
            >
              Dashboard
              {!pathname.startsWith("/dashboard") && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[#d2f000] transition-all duration-300 group-hover:w-3/4" />
              )}
            </Link>
          )}
        </div>

        {/* Profile Avatar Actions / Authentication Entry */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <div className="flex items-center gap-3 bg-[#1e1e1e] border border-white/10 py-1.5 pl-3 pr-2 rounded-full">
              {/* Profile Picture display container */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0e0e0e] border border-white/20 flex items-center justify-center">
                {session?.user?.image ? (
                  <Image
                    src={session?.user?.image}
                    alt={session?.user?.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover"
                  />
                ) : (
                  <FiUser className="text-[#c6c9ab] text-sm" />
                )}
              </div>
              <span className="text-xs font-semibold uppercase text-[#e5e2e1] tracking-wider max-w-22.5 truncate">
                {session?.user?.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-[#c6c9ab] hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                title="Sign Out"
              >
                <FiLogOut className="text-base" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#c6c9ab] text-sm font-semibold hover:text-[#e5e2e1] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#d2f000] text-[#191e00] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#00e0ff] active:scale-[0.97] transition-all"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Action Key */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-[#e5e2e1] p-1 focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Responsive Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#131313] border-b border-white/10 px-5 pt-2 pb-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold tracking-wide uppercase ${
                  isActive(link.href)
                    ? "bg-[#d2f000] text-[#131313]"
                    : "bg-[#0e0e0e] text-[#c6c9ab]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {status === "authenticated" && session?.user?.role && (
              <Link
                href={`/dashboard/${session.user.role}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold tracking-wide uppercase flex items-center gap-2 ${
                  pathname.startsWith("/dashboard")
                    ? "bg-[#d2f000] text-[#131313]"
                    : "bg-[#0e0e0e] text-[#c6c9ab]"
                }`}
              >
                <FiLayout /> Dashboard
              </Link>
            )}
          </div>

          <hr className="border-white/5" />

          {/* User Profile / Access Actions Drawer Bottom */}
          <div className="pt-2">
            {status === "authenticated" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#0e0e0e] p-3 rounded-lg border border-white/5">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#1e1e1e] flex items-center justify-center">
                    {session?.user?.image ? (
                      <Image
                        src={session?.user?.image}
                        alt={session?.user?.name}
                        fill
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-[#c6c9ab]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#e5e2e1]">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-[#d2f000]">
                      {session?.user?.role} Account
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-red-950/40 text-red-400 border border-red-900/30 font-semibold py-3 rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Sign Out from Device
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full border border-white/10 text-center font-bold text-sm text-[#e5e2e1] py-3 rounded-lg uppercase tracking-wider bg-[#0e0e0e]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#d2f000] text-center font-bold text-sm text-[#191e00] py-3 rounded-lg uppercase tracking-wider"
                >
                  Join Elite
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

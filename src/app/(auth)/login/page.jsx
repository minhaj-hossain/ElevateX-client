"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { GiBottledBolt } from "react-icons/gi";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Login() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log("Form Submitted:", { email, password });

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
        rememberMe: true,
      },
      {
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          console.log("success");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );
  };

  const handleGoogleAuth = async () => {
    console.log("click happend");
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden min-h-screen relative font-sans">
      {/* Background Hero Layer */}
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAC-aajEAF2bQiCDFg7J8zQsCg_Q2DemxQylVETqHMnvCdA5b26xucqRWBny1mOf8cl4aBb5bB40BmAt1oIJUHS07ddyhyWIb38xTplAbsZgJQTCcHK9kjQpRgKOPInfYnX8i23nLvKqMcfuGXcuvQCeaAl40uVl7Pr5ip4AgHoObdzTgBltFjU1AUp8xIE1hjCFt35zl7Z4rdnWbmsYrp883HlRv_9TjA1VdwGAbTGoBFlOkRsiJK1WVJJ7hq4ikuazj1uQXjfFwM')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/60 to-transparent" />
      </div>

      {/* Main Content Canvas */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-5 md:px-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-120"
        >
          {/* Brand Identity Header */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter italic uppercase text-[#d2f000]">
              Elevate
              <span className="bg-linear-to-r from-[#dfff00] to-[#00daf8] bg-clip-text text-transparent">
                X
              </span>
            </h1>
            <p className="text-sm text-[#c6c9ab] mt-2 tracking-widest uppercase">
              Uncompromising Performance
            </p>
          </div>

          {/* Login Card Container */}
          <div className="bg-[#1e1e1e]/70 backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Subtle glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d2f000]/10 rounded-full blur-3xl group-hover:bg-[#d2f000]/20 transition-colors duration-500" />

            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-[#ffffff] mb-2">
                Member Login
              </h2>
              <p className="text-sm text-[#c6c9ab] mb-8">
                Access your elite performance dashboard.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2 relative border-b border-transparent focus-within:border-[#dfff00] transition-colors duration-300">
                  <label
                    className="text-xs font-semibold text-[#c6c9ab] uppercase ml-1"
                    htmlFor="email"
                  >
                    Work Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c9ab] text-[20px]" />
                    <input
                      className="w-full bg-[#0e0e0e] border-none rounded-lg py-4 pl-12 pr-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#d2f000]/30 focus:shadow-[0_0_15px_rgba(223,255,0,0.2)] transition-all placeholder:text-[#353534] outline-none"
                      id="email"
                      name="email"
                      placeholder="name@elevatex.fit"
                      required
                      type="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 relative border-b border-transparent focus-within:border-[#dfff00] transition-colors duration-300">
                  <div className="flex justify-between items-center px-1">
                    <label
                      className="text-xs font-semibold text-[#c6c9ab] uppercase"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <a
                      className="text-xs font-semibold text-[#d2f000] hover:text-[#a5eeff] transition-colors"
                      href="#"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c6c9ab] text-[20px]" />
                    <input
                      className="w-full bg-[#0e0e0e] border-none rounded-lg py-4 pl-12 pr-4 text-[#e5e2e1] focus:ring-2 focus:ring-[#d2f000]/30 focus:shadow-[0_0_15px_rgba(223,255,0,0.2)] transition-all placeholder:text-[#353534] outline-none"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type="password"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  className="w-full bg-[#d2f000] text-[#191e00] font-semibold py-4 rounded-lg mt-4 flex items-center justify-center gap-2 hover:bg-[#00e0ff] active:scale-[0.98] transition-all group overflow-hidden relative"
                  type="submit"
                >
                  <span className="relative z-10">LOGIN</span>
                  <GiBottledBolt className="relative z-10 group-hover:translate-x-1 transition-transform text-lg" />
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out skew-x-12" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center gap-4 my-6">
                <div className="grow h-px bg-white/10" />
                <span className="text-xs font-semibold text-[#c6c9ab] uppercase whitespace-nowrap">
                  OR CONTINUE WITH
                </span>
                <div className="grow h-px bg-white/10" />
              </div>

              {/* Social Login Button */}
              <button
                onClick={handleGoogleAuth}
                type="button"
                className="w-full bg-transparent border-2 border-white/10 hover:border-white/30 text-[#ffffff] font-semibold py-4 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="currentColor"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="currentColor"
                  />
                </svg>
                Sign in with Google
              </button>

              {/* Register Redirect Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-[#c6c9ab]">
                  New to the facility?
                  <Link
                    href={"/register"}
                    className="text-[#d2f000] font-semibold hover:underline underline-offset-4 decoration-2 transition-all ml-1"
                  >
                    Join the Elite
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

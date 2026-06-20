import Link from "next/link";
import { FiLock, FiHome, FiLogIn } from "react-icons/fi";

export default function Unauthorized() {
  return (
    <section className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#d2f000]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00daf8]/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-8">
          <FiLock />
          <span className="uppercase tracking-[0.2em] text-xs font-semibold">
            403 Restricted Access
          </span>
        </div>

        {/* Main Content */}
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
          Access{" "}
          <span className="bg-linear-to-r from-[#d2f000] to-[#00daf8] bg-clip-text text-transparent">
            Denied
          </span>
        </h1>

        <p className="text-[#c6c9ab] text-lg md:text-xl max-w-2xl mx-auto mb-12">
          You do not have permission to access this page. Your current account
          role doesn&apos;t meet the required authorization level.
        </p>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#1c1b1b]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-[#c6c9ab] mb-2">
              Status
            </p>
            <h3 className="text-red-400 font-bold">Restricted</h3>
          </div>

          <div className="bg-[#1c1b1b]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-[#c6c9ab] mb-2">
              Security
            </p>
            <h3 className="text-[#d2f000] font-bold">Protected Route</h3>
          </div>

          <div className="bg-[#1c1b1b]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-[#c6c9ab] mb-2">
              Clearance
            </p>
            <h3 className="text-[#00daf8] font-bold">Insufficient</h3>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#d2f000] text-[#191e00] font-bold hover:bg-[#00daf8] transition-all duration-300 active:scale-95"
          >
            <FiLogIn />
            Login
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#d2f000]/40 text-[#d2f000] hover:bg-[#d2f000]/10 transition-all duration-300 active:scale-95"
          >
            <FiHome />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

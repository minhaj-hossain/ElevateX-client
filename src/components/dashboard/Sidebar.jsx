"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiCalendar,
  FiPlusCircle,
  FiEdit3,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiPlay,
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiLayers,
  FiDollarSign,
  FiX,
  FiHome,
} from "react-icons/fi";

// ← Accept isOpen and onClose props
export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const menuItemsByRole = {
    trainer: [
      { label: "Overview", href: "/dashboard/trainer", icon: FiGrid },
      {
        label: "My Classes",
        href: "/dashboard/trainer/my-classes",
        icon: FiCalendar,
      },
      {
        label: "Add Class",
        href: "/dashboard/trainer/add-class",
        icon: FiPlusCircle,
      },
      {
        label: "Add Forum Post",
        href: "/dashboard/trainer/forum/create",
        icon: FiEdit3,
      },
      {
        label: "My Forum Posts",
        href: "/dashboard/trainer/forum",
        icon: FiMessageSquare,
      },
    ],
    user: [
      { label: "Overview", href: "/dashboard/user", icon: FiGrid },
      {
        label: "My Bookings",
        href: "/dashboard/user/bookings",
        icon: FiCalendar,
      },
      {
        label: "Apply as Trainer",
        href: "/dashboard/user/apply-trainer",
        icon: FiPlusCircle,
      },
      {
        label: "Favorite Classes",
        href: "/dashboard/user/favorites",
        icon: FiPlusCircle,
      },
      {
        label: "My Profile",
        href: "/dashboard/user/profile",
        icon: FiSettings,
      },
    ],
    admin: [
      { label: "Overview", href: "/dashboard/admin", icon: FiGrid },
      {
        label: "Manage Users",
        href: "/dashboard/admin/manage-users",
        icon: FiUsers,
      },
      {
        label: "Applied Trainers",
        href: "/dashboard/admin/applied-trainers",
        icon: FiUserPlus,
      },
      {
        label: "Manage Trainers",
        href: "/dashboard/admin/manage-trainers",
        icon: FiUserCheck,
      },
      {
        label: "Manage Classes",
        href: "/dashboard/admin/manage-classes",
        icon: FiLayers,
      },
      {
        label: "Add Forum Post",
        href: "/dashboard/admin/add-forum-post",
        icon: FiEdit3,
      },
      {
        label: "Transactions Page",
        href: "/dashboard/admin/transactions",
        icon: FiDollarSign,
      },
      {
        label: "Forum Post Manage",
        href: "/dashboard/admin/forum-manage",
        icon: FiMessageSquare,
      },
    ],
  };

  const menuItems = user?.role ? menuItemsByRole[user.role] || [] : [];

  if (isPending) {
    return (
      // ← Same positioning classes applied to loading state too
      <aside className="h-screen w-64 bg-[#131313] border-r border-white/10 flex flex-col py-8 px-4 fixed top-0 left-0 z-50 lg:sticky lg:translate-x-0">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#d2f000]"></div>
        </div>
      </aside>
    );
  }

  if (!user) {
    return (
      <aside className="h-screen w-64 bg-[#131313] border-r border-white/10 flex flex-col py-8 px-4 fixed top-0 left-0 z-50 lg:sticky lg:translate-x-0">
        <div className="text-center text-[#c6c9ab]">
          <p>Please log in</p>
        </div>
      </aside>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* ← Overlay: closes drawer when tapping outside, hidden on desktop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* ← Sidebar: fixed + slide-in on mobile, sticky on desktop */}
      <aside
        className={`
          h-screen w-64 bg-[#131313] border-r border-white/10 flex flex-col py-8 px-4
          fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="mb-10 px-4 flex items-start justify-between">
          <div>
            <Link href={'/'}>
              <h1 className="text-3xl font-black tracking-tight text-[#d2f000]">
                ElevateX
              </h1>
            </Link>
            <p className="text-sm text-[#c6c9ab]">{user.role} Portal</p>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-[#c6c9ab] hover:text-[#d2f000] transition-colors mt-1"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // ← Close drawer on nav
                className={`group flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
                  active
                    ? "bg-[#d2f000] text-[#191e00] font-bold scale-[0.98]"
                    : "text-[#c6c9ab] hover:text-[#d2f000] hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d2f000]/10 border border-[#d2f000]/20 text-[#d2f000] font-semibold hover:bg-[#d2f000] hover:text-[#191e00] transition-all duration-300">
            <FiPlay size={16} />
            Launch Session
          </button>
          <Link
            href="/"
            onClick={onClose}
            className="
    flex
    items-center
    gap-3
    px-4
    py-3
    rounded-xl
    text-[#c6c9ab]
    hover:text-[#d2f000]
    hover:bg-white/5
    transition-all
  "
          >
            <FiHome size={18} />
            <span className="text-sm font-medium">Homepage</span>
          </Link>
          <Link
            href="/dashboard/trainer/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#c6c9ab] hover:text-[#d2f000] hover:bg-white/5 transition-all"
          >
            <FiSettings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#c6c9ab] hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

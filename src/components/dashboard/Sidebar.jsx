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
} from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Define menu items as an object (better than array)
  const menuItemsByRole = {
    trainer: [
      {
        label: "Overview",
        href: "/dashboard/trainer",
        icon: FiGrid,
      },
      {
        label: "My Classes",
        href: "/dashboard/trainer/classes",
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
      {
        label: "Overview",
        href: "/dashboard/user",
        icon: FiGrid,
      },
      {
        label: "My Bookings",
        href: "/dashboard/user/bookings",
        icon: FiCalendar,
      },
      {
        label: "My Profile",
        href: "/dashboard/user/profile",
        icon: FiSettings,
      },
    ],
  };

  // Get menu items based on user role, with fallback
  const menuItems = user?.role ? menuItemsByRole[user.role] || [] : [];

  // Show loading state if session is pending
  if (isPending) {
    return (
      <aside className="h-screen w-64 bg-[#131313] border-r border-white/10 flex flex-col py-8 px-4">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#d2f000]"></div>
        </div>
      </aside>
    );
  }

  // Handle case where user is not authenticated
  if (!user) {
    return (
      <aside className="h-screen w-64 bg-[#131313] border-r border-white/10 flex flex-col py-8 px-4">
        <div className="text-center text-[#c6c9ab]">
          <p>Please log in</p>
        </div>
      </aside>
    );
  }

  // Now safe to log user role
  console.log(user.role);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="h-screen w-64 bg-[#131313] border-r border-white/10 flex flex-col py-8 px-4">
      {/* Logo */}
      <div className="mb-10 px-4">
        <h1 className="text-3xl font-black tracking-tight text-[#d2f000]">
          ElevateX
        </h1>
        <p className="text-sm text-[#c6c9ab]">Trainer Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
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
        <button
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-3
            rounded-xl
            bg-[#d2f000]/10
            border
            border-[#d2f000]/20
            text-[#d2f000]
            font-semibold
            hover:bg-[#d2f000]
            hover:text-[#191e00]
            transition-all
            duration-300
          "
        >
          <FiPlay size={16} />
          Launch Session
        </button>

        <Link
          href="/dashboard/trainer/settings"
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
          <FiSettings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-[#c6c9ab]
            hover:text-red-400
            hover:bg-red-500/10
            transition-all
          "
        >
          <FiLogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

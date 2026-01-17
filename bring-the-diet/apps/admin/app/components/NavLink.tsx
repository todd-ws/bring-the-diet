"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="navitem"
      style={
        isActive
          ? { borderColor: "rgba(0,0,0,0.65)", fontWeight: 700, background: "rgba(0,0,0,0.05)" }
          : undefined
      }
    >
      {label}
    </Link>
  );
}

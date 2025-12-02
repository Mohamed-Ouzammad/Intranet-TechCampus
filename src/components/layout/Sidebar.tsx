"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { canAccess, getCurrentUser, logout, Role } from "@/lib/auth";

export default function Sidebar() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setRole(user?.role ?? null);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-bold">Intranet</h2>

      <nav className="flex flex-col gap-2 text-sm text-gray-700">
        {canAccess(role, "dashboard") && (
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        )}
        {canAccess(role, "planning_view") && (
          <Link href="/planning" className="hover:text-blue-600">
            Planning
          </Link>
        )}
        {canAccess(role, "documents") && (
          <Link href="/documents" className="hover:text-blue-600">
            Documents
          </Link>
        )}
        {canAccess(role, "notes") && (
          <Link href="/notes" className="hover:text-blue-600">
            Notes
          </Link>
        )}
        {canAccess(role, "messages") && (
          <Link href="/messages" className="hover:text-blue-600">
            Messages
          </Link>
        )}
        {canAccess(role, "admin") && (
          <Link href="/admin" className="hover:text-blue-600">
            Admin
          </Link>
        )}
      </nav>

      <div className="mt-6 border-t pt-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}


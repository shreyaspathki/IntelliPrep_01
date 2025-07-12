import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import LogoutButton from "@/components/LogoutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between w-full py-6 border-b border-border/20">
        <Link
          href="/"
          className="flex items-center justify-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo_final.png"
            alt="IntelliPrep Logo"
            width={50}
            height={50}
            className="object-contain flex-shrink-0"
          />
          <h1 className="text-3xl font-bold text-primary-200 tracking-tight leading-none">
            IntelliPrep
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-primary-200 font-medium">
            Welcome, {user?.name || "User"}
          </span>
          <LogoutButton />
        </div>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;

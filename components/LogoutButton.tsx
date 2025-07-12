"use client";

import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-primary-200 hover:text-white transition-colors duration-200 border border-primary-200/30 hover:border-primary-200 rounded-full hover:bg-primary-200/10"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

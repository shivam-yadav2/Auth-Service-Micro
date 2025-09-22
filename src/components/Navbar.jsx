"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/signup">
            <Button >Sign Up</Button>
          </Link>
          <Link href="/login">
            <Button >Login</Button>
          </Link>
          {token && (
            <Link href="/devices">
              <Button >Devices</Button>
            </Link>
          )}
        </div>
        {token && (
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}

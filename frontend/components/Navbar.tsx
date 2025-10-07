"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RootState } from "@/state/store";

export default function Navbar() {
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.user);

  return (
    <div className="flex flex-col items-start h-full max-h-screen gap-6 p-2.5 max-w-[25rem] border-r bg-primary text-primary-foreground">
      <Link href="/">
        <Button variant="nav" className="w-full justify-start">
          <img src="/compass-icon-1.png" width={50} alt="compass icon" />
          <h1 className="ml-2">Course Compass</h1>
        </Button>
      </Link>

      <ul className="space-y-5 w-full">
        <li>
          <Link href="/search">
            <Button variant="nav" className="w-full justify-start">
              <img src="/search-icon-png-1.png" width={15} alt="search icon" />
              <h1 className="ml-2">Explore</h1>
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/user">
            <Button variant="nav" className="w-full justify-start">
              <img src="/star-icon.png" width={15} alt="star icon" />
              <h1 className="ml-2">My Reviews</h1>
            </Button>
          </Link>
        </li>
      </ul>

      <DropdownMenu>
        <DropdownMenuTrigger className="w-full mt-auto mb-10 h-auto hover:bg-accent rounded-md text-sm font-medium transition-all justify-start p-2 whitespace-normal cursor-pointer flex items-center gap-2 group hover:bg-accent">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400" /> // placeholder
          )}
          <span className="transition-colors group-hover:text-black">
            {user.name?.trim() || user.email?.split("@")[0] || "User"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Subscriptions</DropdownMenuItem>

          <Link href="/settings" passHref>
            <DropdownMenuItem
              asChild
              className={
                pathname === "/settings"
                  ? "bg-primary text-white font-semibold"
                  : ""
              }
            >
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

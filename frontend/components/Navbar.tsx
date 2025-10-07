"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();

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
        <DropdownMenuTrigger className="w-full mt-auto mb-10 h-auto hover:bg-accent rounded-md text-sm font-medium transition-all justify-start p-2 whitespace-normal cursor-pointer">
          Username
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

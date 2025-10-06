"use client";
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
    <div
      className="flex items-left flex-col bg-primary text-primary-foreground w-1/8 max-w-[25rem] 
        min-w-min h-screen gap-6 p-2.5"
    >
      <Link href="/">
        <Button variant="nav">
          <img src="/compass-icon-1.png" width={50} alt="compass icon"></img>
          <h1>Course Compass</h1>
        </Button>
      </Link>
      <ul className="space-y-5">
        <li>
          <Link href="/search">
            <Button variant="nav">
              <img
                src="/search-icon-png-1.png"
                width={15}
                alt="search icon"
              ></img>
              <h1 className="ml-2">Explore</h1>
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/user">
            <Button variant="nav">
              <img src="/star-icon.png" width={15} alt="star icon"></img>
              <h1 className="ml-2">My Reviews</h1>
            </Button>
          </Link>
        </li>
      </ul>
      <DropdownMenu>
        <DropdownMenuTrigger className="!w-full mt-auto mb-10 h-auto hover:bg-accent rounded-md text-sm font-medium transition-all !justify-start !p-2 whitespace-normal cursor-pointer">
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
              className={`${
                pathname === "/settings"
                  ? "bg-primary text-white font-semibold"
                  : ""
              }`}
            >
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

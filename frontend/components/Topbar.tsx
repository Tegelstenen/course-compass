import Link from "next/link";

export default function Topbar() {
  return (
    <div className="flex w-full justify-end p-5 bg-primary z-50 fixed">
      <ul className="flex w-1/2 pr-10 justify-end gap-15">
        <li>
          <Link href="/about" className="p-3 text-primary-foreground hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="p-3 text-primary-foreground hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}

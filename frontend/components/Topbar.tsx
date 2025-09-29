import Link from "next/link";

export default function Topbar() {
  return (
    <div className="flex w-full justify-end p-5 bg-gray-300 z-50 fixed">
      <ul className="flex w-1/2 pr-10 justify-end gap-15">
        <li>
          <Link href="/about" className="p-3">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="p-3">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}

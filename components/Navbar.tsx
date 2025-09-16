import Link from "next/link";

export default function Navbar() {
  return (
    <div
      className="flex items-left flex-col bg-gray-200 w-1/8 max-w-[15rem] 
        min-w-min h-screen gap-6 p-2.5"
    >
      <Link
        href="/"
        className="flex items-center rounded-sm w-full min-w-[8rem] hover:bg-gray-50 transition-all p-1.5"
      >
        <img src="/compass-icon-1.png" width={50} alt="compass icon"></img>
        <h1 className="ml-2">Course Compass</h1>
      </Link>
      <ul className="space-y-5">
        <li>
          <Link
            href="/search"
            className="flex items-center rounded-sm w-full min-w-[8rem] hover:bg-gray-50 transition-all p-1.5"
          >
            <img src="/search-icon-png-1.png" width={15} alt="search icon"></img>
            <h1 className="ml-2">Explore</h1>
          </Link>
        </li>
        <li>
          <Link
            href="/user"
            className="flex items-center rounded-sm w-full min-w-[8rem] hover:bg-gray-50 transition-all p-1.5"
          >
            <img src="/star-icon.png" width={15} alt="star icon"></img>
            <h1 className="ml-2">My Reviews</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
}

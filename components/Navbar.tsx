import Link from 'next/link'

export default function Navbar() {
    return (
        <div className="flex flex-col bg-gray-200 w-1/10 h-screen gap-6">
            <h1><Link href="/">Course Compass</Link></h1>
            <ul className="space-y-5">
                <li><Link href="/search">Explore</Link></li>
                <li><Link href="/user">My Reviews</Link></li>
            </ul>
        </div>
    )
}
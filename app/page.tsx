import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return <div className="bg-dark text-primary">
    <Link href="/participant/available">Available</Link>
  </div>;
}

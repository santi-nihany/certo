import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-dark text-primary mx-auto flex flex-col items-center justify-center">
      <Image
        className="mx-auto mt-20"
        src="/certo-logo.svg"
        alt="CERTO"
        width={1000}
        height={1000}
      />
    </div>
  );
}

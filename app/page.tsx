import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return <div className="bg-dark text-primary mx-auto flex flex-col items-center justify-center">
    <Image className="mx-auto mt-20" src="/certo-logo.svg" alt="CERTO" width={1000} height={1000} />
    <div className="flex gap-4">
      <div>
        <Button className="border-2 border-primary bg-transparent hover:bg-none">
          <Link href="/participant/available">Participate</Link>
        </Button>
      </div>
      <div>
        <Button className="border-2 border-primary bg-transparent hover:bg-none">
          <Link href="/researcher/dashboard">My Surveys</Link>
        </Button>
      </div>
    </div>
  </div>;
}

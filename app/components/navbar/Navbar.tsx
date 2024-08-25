"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/participant/available", label: "Participate" },
  { href: "/researcher/dashboard", label: "My Surveys" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-light/30 bg-black text-light">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/certo-logo.svg" alt="CERTO" width={100} height={100} />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Button className="border-2 border-primary bg-transparent hover:bg-none">
            <Link href={`/login`}>Design a survey</Link>
          </Button>
        </nav>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Toggle Menu">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-dark">
            <div className="flex justify-between items-center mb-4">
              <Image
                src="/certo-logo.svg"
                alt="CERTO"
                width={100}
                height={100}
              />
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Close Menu">
                  <X className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-light" : "text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                className="border-2 border-primary bg-transparent hover:bg-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                World Coin
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

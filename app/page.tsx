"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Header from "./components/session/header";

export default function Home() {
  return (
    <div className="h-screen bg-cover bg-center flex flex-col">
      <Header />
      <div className="h-screen w-full text-primary mx-auto flex flex-col items-center mt-20">
        <div className="text-3xl md:text-7xl font-light italic text-center mt-20 mr-20 ml-20">
          BRING REPLICABILITY BACK TO SCIENCE
        </div>
        <div className="flex flex-col items-center justify-center text-xl md:text-3xl mt-5">
          VERIFIABLE RESEARCH
        </div>
        <div className="flex flex-col items-center justify-center text-xl md:text-3xl mt-5">
          <Button className="mt-5 bg-primary text-black hover:bg-black hover:border-2 hover:border-primary hover:text-primary">
            <a href="#protocol">Learn more</a>
          </Button>
        </div>
        <Image
          src="/curves.svg"
          alt="hero"
          width={2000}
          height={500}
          className="m-20"
        />
        <div
          className="m-20 flex flex-col items-center justify-center"
          id="#protocol"
        >
          <Image
            src="/protocol.svg"
            alt="protocol"
            width={1000}
            height={500}
            className="mb-6"
          />
        </div>
        <div className="flex flex-col items-center justify-center text-sm m-10 p-10 h-full">
          Made with love by Pato, Bauti, Pedro, Santi and Luz.
          <Button className="m-5 bg-primary text-black hover:bg-black hover:border-2 hover:border-primary hover:text-primary">
            <Link
              href="https://github.com/santi-nihany/certo/tree/main"
              className="flex items-center"
            >
              <FontAwesomeIcon icon={faGithub} className="mr-2 w-5" />
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

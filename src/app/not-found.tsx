import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <Image src={"/not_found.svg"} width={200} height={200} alt="" />
      <div className="mt-12 flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold">404</h1>
        <p>Oops! We can't seem to find the page you're looking for.</p>
        <Button asChild>
          <Link href={"/"} className="flex items-center gap-2">
            Back to Home Page
            <ArrowRightIcon size={18} />
          </Link>
        </Button>
      </div>
    </main>
  );
}

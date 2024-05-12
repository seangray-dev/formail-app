"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SubmitSuccessPage() {
  const goBack = () => {
    window.history.back();
    console.log(window.history.back);
  };

  return (
    <main className="container flex max-w-lg flex-1 flex-col justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-col gap-6 text-center">
            <CheckIcon className="mx-auto h-10 w-10 rounded-full border border-white bg-white p-2 text-black" />
            Your form has been submitted!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={goBack}>Go Back</Button>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 pt-4">
        <p className="text-left text-sm">Powered by</p>
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            width={100}
            height={100}
            alt="Formail Logo"
          />
        </Link>
      </div>
    </main>
  );
}

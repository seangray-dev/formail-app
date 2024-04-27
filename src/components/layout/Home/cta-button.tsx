import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function CTAButton() {
  return (
    <Button asChild>
      <Link href={"/sign-up"}>Manage Your Forms For Free</Link>
    </Button>
  );
}

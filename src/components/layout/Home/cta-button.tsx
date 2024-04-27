"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import React from "react";

export default function CTAButton() {
  const posthog = usePostHog();

  return (
    <Button
      asChild
      onClick={() => {
        posthog.capture("cta button clicked");
      }}
    >
      <Link href={"/sign-up"}>Manage Your Forms For Free</Link>
    </Button>
  );
}

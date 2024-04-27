"use client";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import React from "react";

interface CTAButtonProps {
  className?: string;
  buttonText?: string;
}

export default function CTAButton({
  className = "",
  buttonText = "Manage Your Forms For Free",
}: CTAButtonProps) {
  const posthog = usePostHog();

  return (
    <HoverBorderGradient
      onClick={() => {
        posthog.capture("cta button clicked");
      }}
      containerClassName="rounded"
      as="button"
      className={`flex items-center space-x-2 bg-secondary text-secondary-foreground ${className}`}
    >
      <Link href={"/sign-up"}>{buttonText}</Link>
    </HoverBorderGradient>
  );
}

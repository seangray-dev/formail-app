"use client";

import { Boxes } from "@/components/ui/background-boxes";
import React from "react";
import CTAButton from "./cta-button";

export default function CTASection() {
  return (
    <section className="relative flex h-96 w-full flex-col items-center justify-center overflow-hidden rounded bg-secondary bg-dot-white/[0.2]">
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-secondary [mask-image:radial-gradient(transparent,white)]" />
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="relative z-20 text-xl text-white md:text-4xl">
          Get Started For Free
        </p>
        <CTAButton className="bg-background" />
      </div>
    </section>
  );
}

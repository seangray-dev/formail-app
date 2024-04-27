import { CheckIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import CTAButton from "./cta-button";

export default function HeroSection() {
  return (
    <section className="mb-20 flex flex-col-reverse items-center justify-between gap-16 md:mb-32 md:grid md:grid-cols-2 md:gap-10 2xl:mb-36">
      <div>
        <div className="flex max-w-xl flex-col gap-3 text-center md:gap-4 md:text-left 2xl:gap-5">
          <h1 className="text-3xl font-extrabold capitalize leading-none tracking-tight md:text-5xl 2xl:text-6xl">
            Make{" "}
            <span
              className={`bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent transition-opacity`}
            >
              Form
            </span>{" "}
            Management Effortless
          </h1>
          <p className="text-muted-foreground">
            Streamline form handling for developers and businesses, ensuring
            instant notifications and seamless data integration for a smoother
            workflow. Ideal for contact forms, surveys, and feedback, Formail
            enhances your strategy seamlessly.
          </p>
        </div>
        <div className="mt-12 flex flex-col items-center justify-start gap-3 md:items-start">
          <CTAButton />
          <div className="flex items-center gap-1">
            <CheckIcon size={18} className="text-muted-foreground" />
            <p className="text-sm">No Credit Card Required</p>
          </div>
        </div>
      </div>
      <div>
        <Image
          className="h-full w-full object-contain"
          src={"/screenshot.png"}
          height={600}
          width={600}
          alt="screenshot of product"
        />
      </div>
    </section>
  );
}

"use client";

import PricingCard from "@/components/pricing/pricing-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { api } from "../../../convex/_generated/api";

export default function PricingPage() {
  const freeFeatures = [
    { text: "Up to 5 Forms", included: true },
    { text: "500 total submissions", included: true },
    { text: "Basic Analytics", included: true },
    { text: "File Submissions", included: false },
    { text: "Multi-Organization Access", included: false },
  ];

  const premiumFeatures = [
    { text: "Unlimited Forms", included: true },
    { text: "Unlimited submissions", included: true },
    { text: "Advanced Analytics", included: true },
    { text: "File Submissions", included: true },
    { text: "Multi-Organization Access", included: true },
  ];

  const pay = useAction(api.stripe.pay);
  const router = useRouter();
  const user = useUser();

  const handleUpgradeClick = async () => {
    if (user.isSignedIn) {
      const url = await pay();
      router.push(url);
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <section className="container flex flex-1 flex-col items-center justify-center pb-20 pt-10">
      <div className="mb-10 flex flex-col gap-4 text-center">
        <h2 className="text-3xl font-extrabold capitalize leading-none tracking-tight md:text-5xl 2xl:text-6xl">
          Build Your Projects,
          <br />
          <span className="bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent transition-opacity">
            Not Your Bills
          </span>
        </h2>
        <p className="text-muted-foreground">
          Our pricing is designed to be clear and predictable. Simple choices,
          no surprises.
        </p>
      </div>
      <div className="mb-20 flex flex-col justify-between gap-10 sm:flex-row">
        <PricingCard
          title="Free"
          description="Great for getting started and small projects"
          price="$0/mo"
          features={freeFeatures}
          buttonText="Try It Free"
          buttonLink="/sign-up"
          buttonVariant="secondary"
        />
        <PricingCard
          title="Premium"
          description="Best for professionals and teams needing advanced features"
          price="$4.99/mo"
          features={premiumFeatures}
          buttonText="Coming Soon!"
          buttonVariant="default"
          onClick={handleUpgradeClick}
        />
      </div>
      <div className="w-full max-w-xl">
        <h3 className="mb-6 text-2xl font-semibold">FAQ</h3>
        <Accordion className="mb-8" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm md:text-base">
              Can I upgrade or downgrade at any time?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, you can adjust your plan directly from your dashboard
              whenever your needs change.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-sm md:text-base">
              What happens when I reach my submission limit on the Free tier?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Form submissions will be paused. You can either delete existing
              submissions to free up space or upgrade to Premium for unlimited
              submissions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-sm md:text-base">
              Do unused submissions on the Free tier roll over?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              The Free tier has a total submission cap, not based on a monthly
              cycle. Once reached, you would need to upgrade to continue
              receiving submissions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-sm md:text-base">
              How do I switch between organizations on the Premium tier?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Premium users can navigate to account settings to manage and
              switch between organizations seamlessly.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="text-muted-foreground">
          For more questions, please{" "}
          <Link
            className="text-primary underline"
            target="_blank"
            href={"/contact"}
          >
            contact us
          </Link>
        </p>
      </div>
    </section>
  );
}

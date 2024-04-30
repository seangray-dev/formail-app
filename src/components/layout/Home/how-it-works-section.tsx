import { CableIcon, InboxIcon, PieChartIcon } from "lucide-react";
import FeatureCard from "./feature-card";

export default function HowItWorksSection() {
  return (
    <section className="mt-24 flex flex-col gap-12 border-t py-12">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <p className="mx-auto text-muted-foreground md:max-w-3xl">
          Transform the way you manage forms with Formail, from initial setup to
          collecting and reviewing data. Here&apos;s how you can streamline your
          form processes effortlessly:
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3 2xl:gap-8">
        <FeatureCard
          icon={
            <CableIcon
              aria-hidden="true"
              size={28}
              className="relative text-white"
            />
          }
          title="Setup & Connect"
          description="Create your form using any tool, link it to Formail with your unique Form ID for seamless integration."
        />

        <FeatureCard
          icon={
            <InboxIcon
              aria-hidden="true"
              size={28}
              className="relative text-white"
            />
          }
          title="Collect Submissions"
          description="Your form is live! Start receiving submissions in real-time, with no extra effort needed."
        />

        <FeatureCard
          icon={
            <PieChartIcon
              aria-hidden="true"
              size={28}
              className="relative text-white"
            />
          }
          title="Analyze & Act"
          description="Access and analyze your submissions via the Formail dashboard to make informed decisions efficiently."
        />
      </div>
    </section>
  );
}

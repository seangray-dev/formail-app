import {
  FileJsonIcon,
  LayoutListIcon,
  SendIcon,
  ShieldAlertIcon,
} from "lucide-react";
import FeatureCard from "./feature-card";

export default function FeaturesSection() {
  return (
    <section className="flex flex-col gap-12 border-t pt-12">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold">Why Choose Formail?</h2>
        <p className="mx-auto text-muted-foreground md:max-w-3xl 2xl:max-w-5xl">
          Formail simplifies your form management needs with efficiency and
          ease. Enjoy seamless submissions, organized data, and enhanced
          productivity. Our tailored solutions fit your unique requirements,
          making form handling smooth and effective.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 2xl:gap-8">
        <FeatureCard
          icon={
            <SendIcon
              aria-hidden="true"
              size={28}
              className="relative text-white"
            />
          }
          title="Email Notifications"
          description="Get real-time alerts with every form submission, keeping you promptly informed."
        />

        <FeatureCard
          icon={
            <ShieldAlertIcon
              aria-hidden="true"
              size={28}
              className="relative text-white"
            />
          }
          title="Spam Protection"
          description="Effortlessly shield spam with Akismet, custom spam words, and reCaptcha integrations."
        />

        <FeatureCard
          icon={
            <LayoutListIcon
              aria-hidden="true"
              size={28}
              className="relative text-white"
            />
          }
          title="Form Flexibility"
          description="Submit anything. Our platform dynamically adapts, organizing and storing your data effortlessly."
        />

        <FeatureCard
          icon={
            <FileJsonIcon
              aria-hidden="true"
              size={28}
              className="relative text-white"
            />
          }
          title="Data Management"
          description="Easily manage submissions. Download data in JSON or CSV formats for convenient access."
        />
      </div>
    </section>
  );
}

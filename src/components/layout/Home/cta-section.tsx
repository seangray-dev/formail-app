import CTAButton from "./cta-button";

export default function CTASection() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 bg-secondary py-1">
      <h6 className="text-lg">Get Started for free</h6>
      <CTAButton />
    </section>
  );
}

import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <section className="container flex flex-1 flex-col items-center justify-center py-10">
      <div className="mb-6 text-center">
        <h2 className="mb-4 text-xl font-extrabold capitalize leading-none tracking-tight md:text-3xl 2xl:text-4xl">
          Get in touch with us Today! Testing
        </h2>
        <p className="mx-auto max-w-[65ch] font-light text-muted-foreground">
          At Formail, we&apos;re committed to supporting your communication
          needs. Whether you have questions about our form management platform,
          need assistance with form submissions, or are interested in discussing
          partnership opportunities, we&apos;re here to help. Feel free to reach
          out through the contact form below, and our team will ensure your
          inquiries are addressed promptly. Let us be a part of your solution,
          helping to streamline and enhance your data collection process.
        </p>
      </div>
      <ContactForm />
    </section>
  );
}

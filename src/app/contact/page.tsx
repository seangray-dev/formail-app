import { ContactForm } from '@/components/contact/contact-form';

export default function ContactPage() {
  return (
    <section className='container py-10 flex-1'>
      <div className='mb-6 text-center md:text-left'>
        <h2 className='text-2xl mb-4'>Get in touch with us Today!</h2>
        <p className='text-muted-foreground font-light max-w-[65ch] mx-auto md:text-left md:mx-0'>
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

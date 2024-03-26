import React from "react";

export default function GettingStartedPage() {
  return (
    <div className="prose prose-invert max-w-[65ch] overflow-hidden">
      <h1>What is Formail?</h1>
      <p>
        Formail streamlines form management, offering instant notifications and
        flexible data handling. Ideal for developers and small businesses, it
        simplifies submission processes, making them user-friendly and
        efficient.
      </p>
      <div>
        <h2>Simplifying Form Managment</h2>
        <p>
          Handling form submissions can be cumbersome, which is why we
          streamline the process for you. Currently, we&apos;re enhancing form
          management with efficient data handling and with more features on the
          horizon.
        </p>
        <p>
          This is the core service we offer, and our pricing structure is
          straightforward and transparent.
        </p>
      </div>
      <div>
        <h2>Centralized Submission Processing</h2>
        <p>
          With Formail, form submissions are seamlessly directed to{" "}
          <code>{`formail.dev/submit/<your-form-id>`}</code>, a secure endpoint
          we manage. This approach centralizes data processing, relieving you of
          the direct server management burden.
        </p>
        <p>
          This system is built to ensure that while you retain control over form
          design and integration, the heavy lifting of data handling is managed
          efficiently by our infrastructure, offering a blend of convenience and
          reliability.
        </p>
      </div>
      <div>
        <h2>Streamlined Integration for any framework</h2>
        <p>
          Formail provides an open-source{" "}
          <a
            href="https://www.npmjs.com/package/formail-hooks"
            target="_blank"
            rel="noopener noreferrer"
          >
            TypeScript library
          </a>
          , designed to be framework-agnostic, enabling easy data submissions to
          our servers.
        </p>
        <p>Simplifying form submissions becomes effortless with our library:</p>

        <div className="rounded bg-muted ">
          <pre className="whitespace-pre-wrap break-words">
            <code className="block px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{`import { formailSubmit } from 'formail-hooks';

function MyForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formId = 'your-unique-form-id';
    try {
      await formailSubmit({ formId, formData: new FormData(e.target) });
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };
  
  return <form onSubmit={handleSubmit}><button type="submit">Submit</button></form>;
}`}</code>
          </pre>
        </div>
      </div>

      <div className="flex justify-end text-xs">
        Last updated on March 26, 2024
      </div>
    </div>
  );
}

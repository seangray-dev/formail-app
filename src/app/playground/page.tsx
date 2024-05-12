import { PlaygroundForm } from "@/components/playground/playground-form";

export default function PlaygroundPage() {
  const hardcodedData = {
    Name: "John Doe",
    Email: "john.doe@example.com",
    Message: "This is a test message.",
  };

  const formId = "j574c5qqbe2x8482ajcq0cd52h6rw6wv";

  return (
    <section className="container flex-1 py-10">
      {/* <PlaygroundForm /> */}
      <form
        action={`http://localhost:3000/submit/${formId}`}
        method="POST"
        className="flex flex-col gap-4"
      >
        <label htmlFor="email">Email</label>
        <input type="email" name="email" className="text-black" />
        <label htmlFor="email">Name</label>
        <input type="text" name="name" className="text-black" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

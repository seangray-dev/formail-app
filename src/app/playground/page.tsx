import { PlaygroundForm } from "@/components/playground/playground-form";

export default function PlaygroundPage() {
  const hardcodedData = {
    Name: "John Doe",
    Email: "john.doe@example.com",
    Message: "This is a test message.",
  };

  const formId = "j571gwa7mjbv1d4yj1amqw8mxs6rfrvm";

  return (
    <section className="container py-10">
      {/* <PlaygroundForm /> */}
      <form action={`http://localhost:3000/submit/${formId}`} method="POST">
        <input type="email" name="email" className="text-black" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

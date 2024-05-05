import { PlaygroundForm } from "@/components/playground/playground-form";

export default function PlaygroundPage() {
  const hardcodedData = {
    Name: "John Doe",
    Email: "john.doe@example.com",
    Message: "This is a test message.",
  };

  return (
    <section className="container py-10">
      <PlaygroundForm />
    </section>
  );
}

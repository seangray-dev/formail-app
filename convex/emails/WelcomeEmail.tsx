import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name?: string;
}

const baseUrl = "https://formail.dev";

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const previewText = `Welcome to Formail, ${name}! Ready to streamline your form submission management?`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea]">
            <Section className="mb-[32px] p-[20px]">
              <Img
                src={`https://utfs.io/f/f5a5196b-21f9-44a6-8e4f-9a77be13898d-899a5y.png`}
                width="200"
                height="150"
                alt="Formail logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading>Welcome</Heading>
            <Text className="px-[20px] text-[14px] leading-[24px] text-black">
              We're thrilled to have you onboard {name}! Begin collecting
              submissions through your custom forms. Get started with Formail
              and experience seamless submission management.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline dark:bg-black"
                href={`${baseUrl}/dashboard`}
              >
                Explore Your Dashboard
              </Button>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="px-[20px] text-[14px] leading-[24px] text-black">
              Discover the features that make Formail a powerful tool for your
              needs:
            </Text>
            <Section className="mb-[32px] px-[20px] text-[14px]">
              <ul className="list-disc pl-[20px]">
                <li className="mb-2">
                  <strong>Email Notifications:</strong> Get real-time alerts
                  with every form submission.
                </li>
                <li className="mb-2">
                  <strong>Spam Protection:</strong> Shield your forms from spam
                  with Akismet, custom filters, and reCaptcha.
                </li>
                <li>
                  <strong>Data Management:</strong> Manage and download your
                  submissions in formats like JSON or CSV for easy access.
                </li>
              </ul>
            </Section>
            <Text className="mb-[32px] px-[20px] text-[14px] text-black">
              Best Regards,
              <br />
              The Formail Team
            </Text>
            <Text className="text-center text-[14px] leading-[24px] text-black">
              Need help getting started? Visit the{" "}
              <Link
                target="_blank"
                href={`https://docs.formail.dev`}
                className="text-blue-600 no-underline"
              >
                docs
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

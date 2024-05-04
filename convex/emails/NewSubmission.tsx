import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewSubmissionEmailProps {
  submissionData: { [key: string]: any };
  formName: string;
}

const baseUrl = "https://formail.dev";

export const NewSubmissionEmail = ({
  submissionData,
  formName,
}: NewSubmissionEmailProps) => {
  const previewText = `New submission received for ${formName}. Check your dashboard for more details.`;

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
              New Submission for {formName}
            </Text>

            <Section className="mb-[32px] px-[20px]">
              <ul style={{ listStyleType: "none", padding: "0" }}>
                {Object.entries(submissionData).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "10px" }}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </Section>
            <Section className="text-center">
              <Button
                className="rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline dark:bg-black"
                href={`${baseUrl}/dashboard`}
              >
                View in Formail
              </Button>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Section className="px-[20px]">
              <Text className="mb-[32px] text-[14px] text-black">
                Best Regards,
                <br />
                The Formail Team
              </Text>
              <Text className="text-[12px] leading-[24px] text-black">
                If you no longer want to receive email notifications for this
                form, please update your form settings.
              </Text>
              <Text className="text-[12px] leading-[24px] text-black">
                This is an automated message. Please do not reply.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewSubmissionEmail;

import { AkismetClient } from "akismet-api";

// Creating the client
const comment = {
  user_ip: "127.0.0.1", // Sample IP
  user_agent: "Mozilla/5.0", // Sample User Agent
  // Other parameters as needed, refer to Akismet API documentation for details
  content: "This is a test comment to check for spam.",
};

const key = "6bc0f6570d6f";
const blog = "http://localhost:3000";
const client = new AkismetClient({ key, blog, charset: "utf8" });

export async function checkCommentForSpam() {
  try {
    // Verify the Akismet API key
    const isValidKey = await client.verifyKey();
    console.log("API key is valid:", isValidKey);

    // Check if the comment is spam
    const isSpam = await client.checkSpam(comment);
    console.log("Is comment spam:", isSpam);
  } catch (error) {
    console.error("Error checking spam:", error);
  }
}

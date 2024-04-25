import { AkismetClient } from "akismet-api";

const key = process.env.AKISMET_SECRET;
console.log("Using Akismet API key:", key);

const client = new AkismetClient({
  key: key,
  blog: "https://yourblog.com",
});

const comment = {
  user_ip: "127.0.0.1", // Sample IP
  user_agent: "Mozilla/5.0", // Sample User Agent
  // Other parameters as needed, refer to Akismet API documentation for details
  content: "This is a test comment to check for spam.",
};

async function checkCommentForSpam() {
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

checkCommentForSpam();

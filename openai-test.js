import OpenAI from "openai";
// require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}
);

(async () => {
    try {
      // Call the OpenAI API for chat completion
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use gpt-3.5-turbo for chat-based responses
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello! How can I help you today?" }
        ],
        max_tokens: 50,
      });
  
      // Log the response from OpenAI
      console.log(response.choices[0].message.content.trim());
    } catch (error) {
      // Handle any errors during the API call
      console.error("Error calling OpenAI API:", error);
    }
  })();
// server/server.js
import express from 'express';
import cors from 'cors'
import OpenAI from 'openai';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, })

// Define a simple route
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the Node.js backend!' });
});

app.post('/api/chatbot', async (req, res) => {
    const { conversation } = req.body; // Conversation history passed from frontend

    try {
        const userMessage = conversation[conversation.length - 1].msg;

        // Filter out any messages that are null or have an empty message content
        const filteredMessages = conversation
            .filter((chat) => chat.msg && chat.msg.trim()) // Filter out null/empty messages
            .map((chat) => ({
                role: chat.sender === 'user' ? 'user' : 'assistant',
                content: chat.msg,
            }));

        // Call OpenAI API for a chat-based response
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Use the latest GPT model
            messages: [
                { role: 'system', content: 'You are DealBot, a chatbot for Groupon, designed to help users navigate the platform, answer general inquiries, and assist with finding deals. If users ask about deals or selling items on Groupon, prompt them to return to the main menu and select the appropriate option: "Find Deals" or "Sell on Groupon." Do not provide direct answers to questions about deals or selling, as these should always be handled through the menu options. \nKeep in mind: \n- Users are already on the Groupon platform, so avoid directing them to visit the website.\n- For FAQs, let users know you\'re redirecting them to the FAQ section and ask if they have a specific question they would like to type in. Your primary role is to handle other inquiries and ensure smooth navigation of the platform.' },
                ...filteredMessages // Pass the filtered conversation history
            ],
            max_tokens: 150,
        });

        res.json({ response: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        res.status(500).json({ error: "Failed to get a response from the chatbot." });
    }
});


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

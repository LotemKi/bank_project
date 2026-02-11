import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBalance, getRecentTransactions } from "./getdata.service.js";

// Initialize with the key from Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tools = [{
    functionDeclarations: [
        {
            name: "getBalance",
            description: "Get user's current balance in ILS",
            parameters: { type: "OBJECT", properties: {} }
        },
        {
            name: "getRecentTransactions",
            description: "Get the last transaction",
            parameters: { type: "OBJECT", properties: {} }
        }
    ]
}];

export async function handleChatMessage({ userId, message }) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview", // Use the 2026 version
            tools: tools,
            generationConfig: {
                // 'low' minimizes latency for banking apps
                thinking_level: "low"
            }
        });

        const chat = model.startChat();
        const result = await chat.sendMessage(message);

        // Gemini 3 uses a more structured response object
        const response = result.response;
        const calls = response.functionCalls();

        if (calls && calls.length > 0) {
            const call = calls[0];
            console.log("AI using tool:", call.name);

            let data;
            if (call.name === "getBalance") {
                data = await getBalance(userId);
            } else if (call.name === "getRecentTransactions") {
                data = await getRecentTransactions(userId, 1);
            }

            // Send data back to Gemini 3 to generate the natural language text
            const finalResult = await chat.sendMessage([{
                functionResponse: {
                    name: call.name,
                    response: { content: data }
                }
            }]);

            return finalResult.response.text();
        }

        return response.text();

    } catch (error) {
        // If you hit a 429 here, it means you've sent >15 messages in 60 seconds
        console.error("Gemini 3 Error:", error.message);
        return "The Vault is stabilizing. Please try again in a moment.";
    }
}
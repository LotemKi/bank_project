import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBalance, getRecentTransactions } from "./getdata.service.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tools = [{
    functionDeclarations: [
        {
            name: "getBalance",
            description: "Get user's current balance in ILS",
            parameters: { type: "OBJECT", properties: {} } // Required for some versions
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
            model: "gemini-1.5-flash",
            tools: tools
        });

        const chat = model.startChat();
        const result = await chat.sendMessage(message);
        const response = result.response;

        // DEBUG: See what the AI is thinking
        console.log("AI Response Type:", response.candidates[0].content.parts[0]);

        const calls = response.functionCalls();

        // CASE A: AI wants data
        if (calls && calls.length > 0) {
            const call = calls[0];
            console.log("AI requested tool:", call.name);

            let data;
            if (call.name === "getBalance") {
                data = await getBalance(userId);
            } else if (call.name === "getRecentTransactions") {
                data = await getRecentTransactions(userId, 1);
            }

            // IMPORTANT: You must send the result BACK to get the final text
            const finalResult = await chat.sendMessage([{
                functionResponse: {
                    name: call.name,
                    response: { content: data }
                }
            }]);

            return finalResult.response.text();
        }

        // CASE B: Standard text (like "Hello")
        return response.text();

    } catch (error) {
        console.error("Chat Error:", error);
        return "The Vault is temporarily offline. Please try again shortly.";
    }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBalance, getRecentTransactions } from "./getdata.service.js";

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the "Tools" Gemini is allowed to use
const tools = [
    {
        functionDeclarations: [
            {
                name: "getBalance",
                description: "Fetch the user's current account balance in ILS (₪).",
            },
            {
                name: "getRecentTransactions",
                description: "Fetch the most recent transactions for the user account.",
            },
        ],
    },
];

export async function handleChatMessage({ userId, message }) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        tools: tools,
        systemInstruction: "You are the Vault Secure Assistant. You have access to the user's bank data via tools. Be professional, concise, and helpful."
    });

    // 1. Start a chat session
    const chat = model.startChat();

    // 2. Ask Gemini to process the message
    let result = await chat.sendMessage(message);
    let response = result.response;

    // 3. Handle Function Calls (The "Smart" Part)
    // If Gemini decides it needs data, it won't return text; it returns a function call.
    const calls = response.functionCalls();

    if (calls && calls.length > 0) {
        const call = calls[0]; // Let's handle the first requested tool
        let toolData;

        // Route the AI's request to your actual services
        if (call.name === "getBalance") {
            const balance = await getBalance(userId);
            toolData = { balance: `₪${balance}` };
        }
        else if (call.name === "getRecentTransactions") {
            const tx = await getRecentTransactions(userId, 1);
            toolData = { latest_transaction: tx };
        }

        // 4. Send the database result back to Gemini so it can "talk" to the user
        const finalResponse = await chat.sendMessage([
            {
                functionResponse: {
                    name: call.name,
                    response: toolData
                }
            }
        ]);

        return finalResponse.response.text();
    }

    // If no data was needed (e.g., the user just said "Hello"), return the text
    return response.text();
}
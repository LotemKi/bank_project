import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBalance, getRecentTransactions } from "./getdata.service.js";
import { sendMoney } from "./sendmoney.service.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tools = [{
    functionDeclarations: [
        {
            name: "getBalance",
            description: "Get user's balance in ILS. Use this when the user asks 'how much money do I have'.",
            parameters: { type: "OBJECT", properties: {} }
        },
        {
            name: "getRecentTransactions",
            description: "Fetch the user's recent transaction history. Use this to calculate totals, find specific past payments, or list recent activity.",
            parameters: { type: "OBJECT", properties: {} }
        },

        {
            name: "sendMoney",
            description: "Transfer money. Requires 'amount' (number) and 'recipientEmail' (string email).",
            parameters: {
                type: "OBJECT",
                properties: {
                    amount: { type: "NUMBER" },
                    recipientEmail: { type: "STRING", description: "The email of the person receiving money." },
                    recipient: { type: "STRING", description: "Alternative field for the email." }
                },
                required: ["amount"]
            }
        }
    ]
}];

export async function handleChatMessage({ userId, message, history = [] }) {
    try {
        const formattedHistory = history.map(msg => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
        }));

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: tools,
            systemInstruction: "You are a professional banking assistant in Israel. Be precise and secure. Always double check if you have the recipient's email before calling sendMoney.",
        });

        const chat = model.startChat({ history: formattedHistory });
        let result = await chat.sendMessage(message);
        let response = result.response;

        let callCount = 0;
        const MAX_CALLS = 5;

        while (response.functionCalls()?.length > 0 && callCount < MAX_CALLS) {
            callCount++;
            const functionResponses = [];

            for (const call of response.functionCalls()) {
                console.log(`[AGENT ACTION]: Calling ${call.name}`);
                let data;

                if (call.name === "getBalance") {
                    data = await getBalance(userId);
                }
                else if (call.name === "getRecentTransactions") {
                    data = await getRecentTransactions(userId);
                }
                else if (call.name === "sendMoney") {
                    const email = call.args.recipientEmail || call.args.email || call.args.recipient;
                    const amount = Number(call.args.amount);

                    try {
                        if (!email) {
                            data = { error: "Recipient email is missing. Please ask the user for it." };
                        } else if (isNaN(amount) || amount <= 0) {
                            data = { error: "Invalid amount. Must be a positive number." };
                        } else {
                            data = await sendMoney(userId, amount, email, call.args.description || "Transfer");
                        }
                    } catch (serviceError) {
                        data = { error: serviceError.message };
                    }
                }

                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: { content: data }
                    }
                });
            }

            const nextTurn = await chat.sendMessage(functionResponses);
            response = nextTurn.response;
        }

        return {
            text: response.text(),
            newHistory: await chat.getHistory()
        };

    } catch (error) {
        console.error("CRITICAL CHAT ERROR:", error.message);

        const errorMessage = error.message.includes("429")
            ? "System busy. Please wait a minute."
            : "I'm having trouble connecting to the vault. Try again in a moment.";

        return {
            text: errorMessage,
            newHistory: history
        };
    }
}
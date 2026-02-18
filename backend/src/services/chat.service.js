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
            description: "Transfer money to a recipient's email.",
            parameters: {
                type: "OBJECT",
                properties: {
                    amount: {
                        type: "NUMBER",
                        description: "The numerical amount to send (e.g., 50)."
                    },
                    recipientEmail: {
                        type: "STRING",
                        description: "The full email address (e.g., user@example.com)."
                    },
                    transferDescription: {
                        type: "STRING",
                        description: "A short note for the transfer (e.g., 'Dinner' or 'Rent')."
                    }
                },
                required: ["amount", "recipientEmail", "transferDescription"]
            }
        }
    ]
}];

export async function handleChatMessage({ userId, message, history = [] }) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: tools,
            systemInstruction: "You are a professional banking assistant. To send money, you MUST have both the 'amount' and the 'recipientEmail'. If a user provides only one, do NOT call the tool. Instead, ask for the missing piece. Once you have both, call 'sendMoney'. Example: If user says 'send 50', reply 'Who should I send 50 ILS to? Please provide their email.'",
        });

        const chat = model.startChat({ history });
        let result = await chat.sendMessage(message);
        let response = result.response;

        while (response.functionCalls()?.length > 0) {
            const functionResponses = [];

            for (const call of response.functionCalls()) {
                console.log(`[AGENT ACTION]: Calling ${call.name}`);

                let data;
                if (call.name === "getBalance") data = await getBalance(userId);
                if (call.name === "getRecentTransactions") data = await getRecentTransactions(userId);
                if (call.name === "sendMoney") {
                    const email = call.args.recipientEmail || call.args.email || call.args.recipient || call.args.recipientName;
                    const amount = Number(call.args.amount);

                    try {
                        if (!email) {
                            data = { error: "Recipient email is missing." };
                        } else if (isNaN(amount) || amount <= 0) {
                            data = { error: "Invalid amount provided." };
                        } else {
                            data = await sendMoney({
                                userId: userId,
                                amount: amount,
                                toAccount: email,
                                description: call.args.transferDescription || call.args.description || "No description"
                            });
                        }
                    } catch (serviceError) {
                        console.error("Service Error:", serviceError.message);
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
        if (error.message.includes("429")) return { text: "System busy. Please wait a few minutes." };
        return { text: "The Agent encountered an error. Please try again." };
    }
}
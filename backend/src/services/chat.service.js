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
            description: "Get the most recent transaction details.",
            parameters: { type: "OBJECT", properties: {} }
        },
        {
            name: "sendMoney",
            description: "Transfer money to another contact",
            parameters: {
                type: "OBJECT",
                properties: {
                    amount: { type: "NUMBER", description: "The amount in ILS" },
                    recipientName: { type: "STRING", description: "The name of the person" }
                },
                required: ["amount", "recipientName"]
            }
        }
    ]
}];

export async function handleChatMessage({ userId, message, history = [] }) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            tools: tools,
            systemInstruction: "You are a professional banking assistant in Israel. Be precise and secure.",
            generationConfig: {
                thinkingConfig: { thinkingLevel: "low" }
            }
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
                if (call.name === "getRecentTransactions") data = await getRecentTransactions(userId, 1);
                if (call.name === "sendMoney") data = await sendMoney(userId, call.args.amount, call.args.recipientName, call.args.description || "Transfer");

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
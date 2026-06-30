import { google } from "@ai-sdk/google";
import { streamText, Message } from "ai";
import { msaClauses } from "@/demo/contracts/msa";
import { CHAT_SYSTEM_PROMPT } from "@/ai/prompts/contract-sense-ai-standard";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Construct a context string from the mock data
    const contractContext = msaClauses.map(c => `Clause ${c.order}: ${c.title}\nText: ${c.content}`).join("\n\n");

    const systemPrompt = `
${CHAT_SYSTEM_PROMPT}

You are currently in a Product Tour (Demo Mode).
The user is viewing a sample Master Service Agreement. 
Here is the text of the sample contract:
---
${contractContext}
---
Answer the user's questions strictly based on the above contract. If they ask about something not in this text, politely explain that this is a demo contract and does not include that provision.
If you refer to a specific clause, use the format [Clause Name](#clause-1) where 1 is the clause order number.
`;

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: messages as Message[],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("[DEMO_CHAT_ERROR]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

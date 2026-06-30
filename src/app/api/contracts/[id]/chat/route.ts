import { streamText, Message } from "ai";
import { CHAT_SYSTEM_PROMPT } from "@/ai/prompts/contract-sense-ai-standard";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { ContractModel } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { ChatSessionModel } from "@/database/models/ChatSession";
import { ChatMessageModel } from "@/database/models/ChatMessage";
import { connectToDatabase } from "@/database/connection";
import { auth } from "@/auth";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || ""
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: contractId } = await params;
    const { messages, sessionId, mode = "EASY_TO_UNDERSTAND" } = await request.json();
    
    const sessionAuth = await auth();
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Verify contract access
    const contract = await ContractModel.findOne({ 
      _id: contractId, 
      ownerId: sessionAuth.user.id 
    }).lean();

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Fetch all clauses for this contract
    const clauses = await ContractClauseModel.find({ contractId }).sort({ order: 1 }).lean();

    // Build the system prompt with context
    const contextString = clauses.map(c => `
---
Clause Reference: ${c.order} - ${c.title}
Text: ${c.content}
`).join('\n');

    let modeInstructions = "";
    if (mode === "BUSINESS_ADVICE") {
      modeInstructions = "Focus heavily on the financial and operational impact. Talk about cash flow, business risks, and practical decision-making.";
    } else if (mode === "NEGOTIATION_HELP") {
      modeInstructions = "Focus on what the user should say to the other party. Roleplay potential conversations. Provide exact wording for emails or counter-offers. Suggest compromises.";
    } else if (mode === "DETAILED_EXPLANATION") {
      modeInstructions = "Provide a slightly deeper, more comprehensive explanation, but still keep it accessible. Do not use legal jargon without explaining it immediately.";
    } else {
      modeInstructions = "Keep the language extremely simple, like explaining it to a smart 15-year-old. Use everyday analogies.";
    }

    const systemPrompt = `
${CHAT_SYSTEM_PROMPT}

You are sitting right beside the user while they review their document titled "${contract.title}".
Speak as if you're reviewing it together in person. 

Here is the parsed context, organized by clauses:
${contextString}

MODE INSTRUCTION (${mode}):
${modeInstructions}

ADDITIONAL CONTEXT RULES:
1. ONLY answer using information present in the context provided above.
2. If information is missing say exactly: "This document does not specify that."
3. Always cite your sources by referencing the Clause Reference (e.g., "Source: Clause 4") at the end of your answer, or if they ask about a specific clause, acknowledge it (e.g., "You're referring to Clause 8").
4. Proactive Insights: If you notice a missing protection or related risk while answering their question, proactively bring it up! (e.g., "While answering this, I also noticed...")
`;

    // Extract the latest user message
    const latestMessage = messages[messages.length - 1];

    // Handle ChatSession
    let chatSession;
    if (sessionId) {
      chatSession = await ChatSessionModel.findOne({ _id: sessionId, userId: sessionAuth.user.id });
    }

    if (!chatSession) {
      chatSession = await ChatSessionModel.create({
        contractId,
        userId: sessionAuth.user.id,
        title: latestMessage.content.substring(0, 50)
      });
    }

    // Save User message
    await ChatMessageModel.create({
      sessionId: chatSession._id,
      role: "user",
      content: latestMessage.content,
      citations: []
    });

    // We only take the last 10 messages from the payload to avoid infinite token growth
    const recentMessages = messages.slice(-10);

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: recentMessages,
      async onFinish({ text }) {
        // Parse citations heuristically from the AI's response text, or just leave empty in DB for now
        // A more advanced extraction could use function calling or regex to populate the DB citations array
        await ChatMessageModel.create({
          sessionId: chatSession._id,
          role: "assistant",
          content: text,
          citations: [] // You can parse the text to extract formal citations here later
        });
      }
    });

    return result.toDataStreamResponse({
      headers: {
        "x-chat-session-id": chatSession._id.toString()
      }
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

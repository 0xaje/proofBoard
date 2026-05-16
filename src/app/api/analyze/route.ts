import { NextResponse } from "next/server";
import OpenAI from "openai";

// Instantiate OpenAI client. It expects OPENAI_API_KEY to be set in the environment.
// For hackathon demo mode, we won't crash if it's missing.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy_key' });

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (!title && !description) {
      return NextResponse.json(
        { error: "Title or description is required for analysis." },
        { status: 400 }
      );
    }

    // In demo mode without a real key, we fallback
    if (!process.env.OPENAI_API_KEY) {
      // Small artificial delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({
        summary: `Heuristic Analysis: The user mentioned "${title || 'an issue'}". This seems like a priority item for the team to investigate.`,
        sentiment: title.toLowerCase().includes("error") || title.toLowerCase().includes("bug") ? "Negative" : "Positive",
        category: title.toLowerCase().includes("error") ? "UI Bug" : "Feature Request",
        urgency: title.toLowerCase().includes("error") ? "High" : "Medium"
      });
    }

    const systemPrompt = `
      You are an expert product manager and technical analyst for "ProofBoard", a Web3/crypto feedback platform.
      Your job is to analyze the user's feedback report (title and description) and provide structured insights.
      
      You must respond strictly in JSON format matching the following schema:
      {
        "summary": "A concise 1-2 sentence summary of the feedback.",
        "sentiment": "Positive" | "Neutral" | "Negative",
        "category": "UI Bug" | "Feature Request" | "Performance" | "Security" | "Wallet Issue" | "Duplicate Risk" | "Other",
        "urgency": "High" | "Medium" | "Low"
      }
      
      Guidelines:
      - Urgency is "High" for security flaws, wallet failures, and critical bugs.
      - Urgency is "Medium" for most feature requests and minor bugs.
      - Sentiment is "Negative" if the user expresses frustration or mentions a critical failure.
      - "Wallet Issue" applies if wallets, transactions, signatures, or on-chain interactions fail.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Title: ${title}\n\nDescription: ${description}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) {
      throw new Error("Empty response from OpenAI");
    }

    const resultJSON = JSON.parse(resultText);

    return NextResponse.json(resultJSON);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    // Demo mode fallback on error
    return NextResponse.json({
      summary: "Backup Insight Pipeline: An error occurred during live analysis. This is a heuristic insight response to ensure the platform remains responsive.",
      sentiment: "Neutral",
      category: "Other",
      urgency: "Medium"
    });
  }
}

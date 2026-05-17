import { NextResponse } from "next/server";
import OpenAI from "openai";


const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration: OPENAI_API_KEY is not set." },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const { title, description } = await req.json();

    if (!title && !description) {
      return NextResponse.json(
        { error: "Title or description is required for analysis." },
        { status: 400, headers: CORS_HEADERS }
      );
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

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    return NextResponse.json(resultJSON, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI analysis", details: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

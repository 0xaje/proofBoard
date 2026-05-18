import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blobId = searchParams.get("blobId");

  if (!blobId) {
    return NextResponse.json({ message: "Blob ID is required" }, { status: 400, headers: CORS_HEADERS });
  }

  try {
    const aggregator = process.env.WALRUS_AGGREGATOR || "https://aggregator.walrus-testnet.walrus.space";
    const url = `${aggregator.replace(/\/$/, "")}/v1/${blobId}?nocache=${Date.now()}`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch blob from Walrus: ${response.statusText}` },
        { status: response.status, headers: CORS_HEADERS }
      );
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";

    // We stream the response body directly to prevent holding large files in memory
    // which can easily crash Vercel Serverless Functions.
    return new NextResponse(response.body, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("API Read Failure:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

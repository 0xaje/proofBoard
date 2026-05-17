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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400, headers: CORS_HEADERS });
    }

    const publisher = process.env.WALRUS_PUBLISHER || "https://publisher.walrus-testnet.walrus.space";
    const aggregator = process.env.WALRUS_AGGREGATOR || "https://aggregator.walrus-testnet.walrus.space";

    // Official Walrus Publisher API (PUT /v1/blobs?epochs=5)
    const uploadUrl = `${publisher.replace(/\/$/, "")}/v1/blobs?epochs=5`;
    
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Walrus Upload Error:", errorText);
      return NextResponse.json(
        { message: `Walrus Node Error: ${response.status}`, details: errorText },
        { status: response.status, headers: CORS_HEADERS }
      );
    }

    const data = await response.json();
    
    // Parse response
    const blobInfo = data.newlyCreated?.blobObject || data.alreadyCertified || data;
    const blobId = blobInfo.blobId || blobInfo.blob_id;

    if (!blobId) {
      throw new Error("Malformed Walrus response: No Blob ID found");
    }

    return NextResponse.json({
      blobId,
      url: `${aggregator.replace(/\/$/, "")}/v1/${blobId}`,
      alreadyCertified: !!data.alreadyCertified,
      success: true
    }, { headers: CORS_HEADERS });
  } catch (err: any) {
    console.error("API Upload Failure:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

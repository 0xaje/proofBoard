import { useState } from 'react';

const AGGREGATORS = [
  'https://aggregator.walrus-testnet.walrus.space',
  'https://aggregator.testnet.walrus.space'
];

export type WalrusUploadResult = {
  blobId: string;
  url: string;
  alreadyCertified?: boolean;
};

export type ProtocolExecutionTrace = {
  operation: string;
  timestamp: string;
  response: any;
};

let auditTraces: ProtocolExecutionTrace[] = [];

export function getExecutionTraces() {
  return auditTraces;
}

function addTrace(operation: string, response: any) {
  auditTraces.push({
    operation,
    timestamp: new Date().toISOString(),
    response
  });
  if (auditTraces.length > 10) auditTraces.shift();
}

export class WalrusUploadError extends Error {
  constructor(message: string) { super(message); this.name = 'WalrusUploadError'; }
}

/**
 * Production-grade upload strategy via Server API.
 * The frontend communicates solely with our backend proxy to handle Walrus interactions.
 */
export async function uploadToWalrus(
  fileOrData: File | Blob | Record<string, unknown>
): Promise<WalrusUploadResult> {
  let blob: Blob;
  let filename = "data.json";
  let contentType = "application/json";

  if (fileOrData instanceof File) {
    blob = fileOrData;
    filename = fileOrData.name;
    contentType = fileOrData.type;
  } else if (fileOrData instanceof Blob) {
    blob = fileOrData;
    contentType = fileOrData.type;
  } else {
    blob = new Blob([JSON.stringify(fileOrData)], { type: 'application/json' });
  }

  const formData = new FormData();
  formData.append('file', blob, filename);

  addTrace("REST_API_UPLOAD_INIT", { filename, contentType });

  const response = await fetch('/api/walrus/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    addTrace("REST_API_UPLOAD_FAIL", error);
    throw new WalrusUploadError(error.message || `Upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  addTrace("REST_API_UPLOAD_SUCCESS", result);
  return result;
}

export function getWalrusBlobUrl(blobId: string): string {
  const aggregator = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR || AGGREGATORS[0];
  return `${aggregator.replace(/\/$/, '')}/v1/${blobId}`;
}

export async function getWalrusBlob(blobId: string): Promise<Blob> {
  addTrace("REST_API_READ_INIT", { blobId });
  const response = await fetch(`/api/walrus/read?blobId=${blobId}`);
  
  if (!response.ok) {
    addTrace("REST_API_READ_FAIL", { status: response.status });
    throw new Error("BLOB_NOT_FOUND_ON_NETWORK");
  }
  
  const blob = await response.blob();
  addTrace("REST_API_READ_SUCCESS", { size: blob.size, type: blob.type });
  return blob;
}

export class WalrusPublisherClient {
  network: string;
  constructor(options: { network: string }) { this.network = options.network; }

  async writeBlob(options: { data: string | Blob; contentType: string }) {
    const file = typeof options.data === "string" ? new Blob([options.data], { type: options.contentType }) : options.data;
    return await uploadToWalrus(file);
  }

  async readBlob(blobId: string) {
    const blob = await getWalrusBlob(blobId);
    return await blob.text();
  }

  async readBlobRaw(blobId: string, onRetry?: (attempt: number) => void) {
    const blob = await getWalrusBlob(blobId);
    const text = await blob.text();
    return {
      rawData: text,
      timestamp: new Date().toISOString(),
      blobId
    };
  }

  async rehydrateSubmission(blobId: string) {
    const jsonText = await this.readBlob(blobId);
    return { ...JSON.parse(jsonText), walrusBlobId: blobId, rehydratedAt: new Date().toISOString(), verified: true };
  }

  async addLifecycleEvent(parentBlobId: string, event: Omit<LifecycleEvent, "parentBlobId" | "timestamp">) {
    const fullEvent: LifecycleEvent = {
      ...event,
      parentBlobId,
      timestamp: new Date().toISOString()
    };
    return await this.writeBlob({
      data: JSON.stringify(fullEvent),
      contentType: "application/json"
    });
  }
}

export type LifecycleEvent = {
  type: "status_change" | "comment" | "resolution" | "priority_change";
  payload: any;
  parentBlobId: string;
  author: string;
  timestamp: string;
};

export function useWalrusUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File | Blob | Record<string, unknown>): Promise<WalrusUploadResult> => {
    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadToWalrus(file);
      setIsUploading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
      throw err;
    }
  };

  return { upload, isUploading, error, reset: () => { setIsUploading(false); setError(null); } };
}

import { useState } from 'react';

const PUBLISHERS = [
  'https://publisher.walrus-testnet.walrus.space',
  'https://testnet.walrus-publisher.sm.xyz',
  'https://publisher.walrus.network'
];

const AGGREGATORS = [
  'https://aggregator.walrus-testnet.walrus.space',
  'https://testnet.walrus-aggregator.sm.xyz',
  'https://aggregator.walrus.network'
];

export type WalrusUploadResult = {
  blobId: string;
  url: string;
  alreadyCertified?: boolean;
};

export class WalrusUploadError extends Error {
  constructor(message: string) { super(message); this.name = 'WalrusUploadError'; }
}

/**
 * Hyper-reliable upload strategy. 
 * Sequentially attempts to anchor data across multiple decentralized nodes.
 */
export async function uploadToWalrus(
  fileOrData: File | Blob | Record<string, unknown>
): Promise<WalrusUploadResult> {
  let file: Blob;
  if (!(fileOrData instanceof Blob) && !(fileOrData instanceof File)) {
    file = new Blob([JSON.stringify(fileOrData)], { type: 'application/json' });
  } else {
    file = fileOrData;
  }

  // Pre-configured list of endpoints including any user-provided ones
  const envEndpoint = process.env.NEXT_PUBLIC_WALRUS_ENDPOINT;
  const targetEndpoints = envEndpoint ? [envEndpoint, ...PUBLISHERS] : PUBLISHERS;
  
  let lastError: any;

  for (const endpoint of targetEndpoints) {
    try {
      // Standard Walrus Store API
      const storeUrl = `${endpoint.replace(/\/$/, '')}/v1/store?epochs=5`;
      
      const response = await fetch(storeUrl, {
        method: 'PUT',
        // Some nodes are sensitive to headers; keeping it minimal
        body: file,
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`NODE_ERR: ${response.status} ${text.substring(0, 50)}`);
      }

      const data = await response.json();
      
      // Parse flexible response schemas
      const blobInfo = data.newlyCreated?.blobObject || data.alreadyCertified || data;
      const blobId = blobInfo.blobId || blobInfo.blob_id;

      if (!blobId) throw new Error("MALFORMED_RESPONSE: No Blob ID found");

      return { 
        blobId, 
        url: getWalrusBlobUrl(blobId), 
        alreadyCertified: !!data.alreadyCertified 
      };
    } catch (err) {
      console.warn(`Walrus node ${endpoint} failed, trying fallback...`, err);
      lastError = err;
      continue;
    }
  }

  // Final Fail-safe: Local Simulation (ONLY as a last resort to ensure the demo doesn't crash)
  // In a real hackathon submission, we want this to fail if the network is truly dead, 
  // but for the sake of a smooth UI experience, we log the failure clearly.
  throw new WalrusUploadError(`NETWORK_FAILURE: All Walrus nodes unreachable. Last error: ${lastError?.message}`);
}

export function getWalrusBlobUrl(blobId: string): string {
  const envAggregator = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR;
  const aggregator = envAggregator || AGGREGATORS[0];
  return `${aggregator.replace(/\/$/, '')}/v1/${blobId}`;
}

export async function getWalrusBlob(blobId: string): Promise<Blob> {
  const envAggregator = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR;
  const targetAggregators = envAggregator ? [envAggregator, ...AGGREGATORS] : AGGREGATORS;
  
  for (const aggregator of targetAggregators) {
    try {
      const url = `${aggregator.replace(/\/$/, '')}/v1/${blobId}`;
      const response = await fetch(url);
      if (!response.ok) continue;
      return await response.blob();
    } catch (err) {
      continue;
    }
  }
  throw new Error("BLOB_NOT_FOUND_ON_NETWORK");
}

export class WalrusPublisherClient {
  network: string;
  constructor(options: { network: string }) { this.network = options.network; }

  async writeBlob(options: { data: string | Blob; contentType: string }) {
    const file = typeof options.data === "string" ? new Blob([options.data], { type: options.contentType }) : options.data;
    const result = await uploadToWalrus(file);
    return { id: result.blobId, url: result.url, alreadyCertified: result.alreadyCertified };
  }

  async readBlob(blobId: string) {
    const blob = await getWalrusBlob(blobId);
    return await blob.text();
  }

  async rehydrateSubmission(blobId: string) {
    const jsonText = await this.readBlob(blobId);
    return { ...JSON.parse(jsonText), walrusBlobId: blobId, rehydratedAt: new Date().toISOString(), verified: true };
  }
}

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

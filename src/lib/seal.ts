/**
 * Seal Encryption Utilities
 * Implements a simple AES-GCM encryption for securing sensitive feedback.
 * In a real-world scenario, this should use Hybrid Encryption (RSA + AES)
 * where the frontend only holds the Public Key, and the Admin Dashboard holds the Private Key.
 * For this MVP, we use a deterministic symmetric key for demonstration purposes.
 */

// A fixed 256-bit key for MVP demonstration (in production, use a secure key management system)
const MVP_DEMO_KEY = new Uint8Array([
  114, 21, 193, 22, 101, 88, 201, 56, 45, 233, 11, 44,
  87, 109, 230, 99, 112, 54, 76, 211, 23, 9, 144, 12,
  77, 88, 19, 210, 65, 33, 101, 99
]);

async function getDemoKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    "raw",
    MVP_DEMO_KEY,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a string (e.g., feedback description) and returns a base64 string
 * containing the IV and the encrypted payload.
 */
export async function encryptSealData(text: string): Promise<string> {
  const key = await getDemoKey();
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  // Combine IV and encrypted content into a single Uint8Array
  const encryptedBytes = new Uint8Array(encryptedContent);
  const combined = new Uint8Array(iv.length + encryptedBytes.length);
  combined.set(iv, 0);
  combined.set(encryptedBytes, iv.length);

  // Convert to Base64 for easy storage
  return arrayBufferToBase64(combined);
}

/**
 * Decrypts a base64 string back into the original text.
 * Expects the format: [12 bytes IV][Encrypted Data]
 */
export async function decryptSealData(encryptedBase64: string): Promise<string> {
  try {
    const key = await getDemoKey();
    const combinedBytes = base64ToArrayBuffer(encryptedBase64);

    // Extract IV and Encrypted Data
    const iv = combinedBytes.slice(0, 12);
    const encryptedContent = combinedBytes.slice(12);

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedContent
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error("Decryption failed", error);
    throw new Error("Failed to decrypt sensitive data.");
  }
}

// Utility: ArrayBuffer <-> Base64
function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

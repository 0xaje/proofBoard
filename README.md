# ProofBoard | Walrus-Native CAS Primitive

ProofBoard is a shardless, content-addressable feedback architecture designed for the Walrus storage layer. It provides a technical framework for provisioning dynamic schemas and anchoring atomic user interactions as immutable blobs without centralized state dependencies.

## Technical Architecture

### 1. Schema Provisioning (CAS)
Dynamic form definitions are serialized as JSON-LD and provisioned to Walrus aggregator nodes. Every form exists as a unique, content-addressable hash, enabling stateless UI rehydration.

### 2. Atomic Submission Anchoring
User interactions are captured at the application edge, hashed, and anchored to Walrus. The system supports 5-epoch retention as a standard settlement parameter for feedback lifecycle management.

### 3. Seal Cryptographic Primitives
Optional AES-GCM client-side encryption provides end-to-end privacy. Data is transformed into a sealed cipher-text before network ingress, ensuring that only the provisioner holds the decryption keys.

### 4. Verification & Rehydration Protocol
ProofBoard implements an independent audit layer for rehydrating truth directly from decentralized nodes. This bypasses internal indexing and provides a transparent verification specification for all stored shards.

## Core Stack

- **Persistence**: Walrus CAS (Aggregator/Publisher Nodes)
- **Privacy**: Seal AES-GCM (Client-side)
- **Framework**: Next.js 15 (Turbopack)
- **Telemetry**: Protocol Execution Tracing (PET)
- **Audit**: VSD (Verification Specification Document)

## Local Operations

### Environment Configuration
Ensure your `.env.local` contains valid aggregator and publisher endpoints:
```bash
NEXT_PUBLIC_WALRUS_ENDPOINT="https://publisher.walrus.network"
NEXT_PUBLIC_WALRUS_AGGREGATOR="https://aggregator.walrus.network"
```

### Deployment
```bash
npm install
npm run dev
```

## Security & Sovereignty
Trust is derived from decentralized storage and cryptographic reproducibility. ProofBoard operates on a zero-trust model regarding mutable backends, placing state sovereignty entirely within the content-addressable storage layer.

---
**Audit Layer**: Access `/verify?blobId={id}` for independent shard reconstruction.

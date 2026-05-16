# ProofBoard: Walrus-Native Dynamic Form Builder

ProofBoard is a decentralized, verifiable form builder and feedback system where anyone can create forms, collect submissions, and verify data independently via immutable Walrus storage.

ProofBoard transforms human input (surveys, bug reports, feature requests) into cryptographically verifiable, independently reconstructable data objects.

## Core Features

### Walrus-Native Dynamic Builder
Design custom forms with rich input types (text, select, checkbox, rating, url). Every form schema is anchored directly to Walrus as an immutable blob.

### Shareable Decentralized Links
Generate unique, Walrus-anchored links for every form. Distribute forms across the ecosystem without relying on a centralized database for persistence.

### Seal Privacy Integration
Optional client-side encryption ensures sensitive feedback is protected before it ever leaves the browser. Raw data is never exposed to the storage layer.

### Independent Verification Portal
ProofBoard provides a transparent verification layer where any submission can be cross-referenced against Walrus storage to confirm integrity and authenticity.

### Management & Export Console
Admin dashboard with advanced filtering, status management, and CSV export for Walrus-native submissions.

## Architecture

1. Form Builder: Save dynamic schemas as Walrus blobs.
2. Public Form: Fetch schema via blobId and render UI.
3. Submission: Anchor response to Walrus with optional Seal encryption.
4. Admin: Monitor and export decentralized submissions.

## Technical Guarantees

- No central database for schemas or responses.
- Stateless recovery: fully reconstruct application state from Walrus blobs.
- Execution transparency: millisecond-accurate network tracing for all interactions.
- Zero-dependency verification via VSD (Verification Specification Document).

## Security Model

Trust is derived from cryptographic storage and external reproducibility. ProofBoard assumes no trusted backend or mutable database, placing sovereignty entirely in decentralized storage.

## Development

### Prerequisites
- Node.js 18+
- Walrus Testnet/Mainnet Endpoint

### Setup
1. Clone the repository.
2. Install dependencies: npm install
3. Configure .env with Walrus endpoints.
4. Run locally: npm run dev

### Verification
Visit /verify to audit any Walrus blobId and confirm protocol integrity.

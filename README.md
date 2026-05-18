# ProofBoard: Decentralized Walrus-Native Dynamic Form Builder

ProofBoard is a fully decentralized, professional form builder and feedback system. It allows organizations, developer groups, and communities to create custom surveys, gather feedback, and collect dynamic uploads (such as screenshots and video logs) without relying on a centralized database. All form structures, responder submissions, dynamic assets, and admin lifecycle notes are stored immutably as content-addressed blobs directly on the Walrus storage network, with client-side privacy powered by the Seal encryption shield.

* **Live Deployment:** [https://proof-board-five.vercel.app/](https://proof-board-five.vercel.app/)
* **GitHub Repository:** [https://github.com/0xaje/proofBoard](https://github.com/0xaje/proofBoard)

---

## 1. Core Platform Features

* **Dynamic Form Builder:** A drag-and-drop workspace (/builder) to construct custom surveys. Admins can configure 7 standard input types (text, textarea, select, checkbox, rating, url, and file) with options and validation rules.
* **Direct-to-Node File Streaming:** Responder attachments (such as bug screenshots and video screen recordings) are streamed directly from the browser to the Walrus Testnet nodes via CORS-enabled PUT uploads. This bypasses Vercel's serverless 4.5MB payload limit, allowing users to securely upload large file assets.
* **Seal Privacy Shield:** Optional client-side AES encryption secures sensitive responses (like vulnerability exploits or contact info) in the browser before they are written to the decentralized network, ensuring only the form creator can read them.
* **On-Chain Lifecycle Governance:** Administrators can transition feedback through status stages (Pending -> Reviewing -> Planned -> Resolved) and attach follow-up notes. Every action is anchored as a child blob linked to the parent feedback on Walrus, creating a transparent, auditable timeline.
* **High-Resilience Client Caching:** A local caching layer instantly hydrates form templates in the browser, eliminating network synchronization lag during active testing and ensuring a zero-latency responder experience.

---

## 2. Technical and Architectural Workflow

### The Admin Flow (Form Creation and Governance)
1. **Creation:** The administrator builds a custom form in the Builder canvas (/builder) and clicks "Publish to Walrus".
2. **Anchoring:** The app packages the structure into a Form Schema JSON, writes it directly to the Walrus Testnet, and generates a shareable decentralized link in the format: `/form/[Walrus_Blob_ID]`.
3. **Tracking:** The administrator monitors incoming submissions in the Admin Dashboard (/admin), utilizing the Seal Privacy Shield decryption key to view private data in the browser.
4. **Governance:** The administrator updates the submission status or posts internal comments inside the timeline view, which are permanently anchored on the Walrus Testnet as child blobs.
5. **Data Export:** The administrator exports all structured feedback directly into a standard CSV file for secondary reporting.

### The User Flow (Submitting Feedback)
1. **Rehydration:** The responder opens the shareable link `/form/[blobId]`. The page dynamically fetches the schema from the Walrus Aggregator and renders the form fields.
2. **Uploading Assets:** The responder fills out the form and selects an image or video attachment. The browser streams the file directly to Walrus storage nodes, generating a live thumbnail preview and securing the file on-chain.
3. **Privacy Safeguard:** The responder toggles the optional Seal Privacy Shield to encrypt their answers before submission.
4. **Anchor Submission:** The responder submits the form, anchoring the entire response payload as an immutable blob on the Walrus Testnet.

---

## 3. Environment Variables and Backend Configuration

To deploy the backend and ensure all features (including server-side read/write proxies and AI analysis services) function perfectly on Vercel, the following environment variables must be configured in your Vercel project settings:

```env
# Walrus Testnet Storage Endpoints
NEXT_PUBLIC_WALRUS_ENDPOINT=https://publisher.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space
WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space

# AI Analysis Service (Optional)
OPENAI_API_KEY=your_openai_api_key_here
```

*Note: The frontend utilizes the browser-to-node PUT method to bypass serverless payload limits for file uploads. The backend environment variables act as a redundant, secure proxy fallback in case of strict browser policies.*

---

## 4. Local Development Setup

### Prerequisites
* Node.js version 18.0.0 or higher
* npm package manager

### Installation and Run Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/0xaje/proofBoard.git
   cd proofBoard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Local Environment:**
   Create a `.env.local` file in the root directory and add the environment variables listed in the configuration section above.

4. **Wipe Stale Compiler Cache:**
   To prevent cache conflicts during active routing modifications, run:
   ```bash
   rm -rf .next
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` to interact with the local build.

---

## 5. Technical Architecture Matrix

| Platform Capability | Technology Layer | Decentralized Protocol | Architectural Value |
| :--- | :--- | :--- | :--- |
| **Form Schemas** | Dynamic JSON Objects | Walrus Testnet | Content-addressed, permanent, impossible to alter. |
| **Asset Attachments** | Binary Node Streams | Walrus Testnet | High-throughput, direct browser-to-node uploads. |
| **Private Responses** | AES Cryptography | Seal Privacy Shield | Local client-side encryption keeps private data secure. |
| **Submission Logs** | Structured JSON | Walrus Testnet | Completely database-free persistence. |
| **Governance Updates** | Cryptographic Linkages | Walrus Testnet | Audit logs of project resolutions. |

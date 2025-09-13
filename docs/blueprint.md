# **App Name**: Unified Red Team Operations Platform

## Core Features:

- LLM Target Management: Configure and manage target LLM endpoints and credentials. The platform is designed to orchestrate attacks against various models, including Gemini Flash, Claude, Grok, and ChatGPT.
- Operation Wizard & Attack Orchestration: A guided, six-step interface for defining an attack sequence. The wizard allows the operator to: 1. Name the Operation. 2. Define the Malicious Goal. 3. Initialize an optional AI Target Persona, with an option to have Gemini generate one. 4. Select an Attack Vector, with an option to have Gemini recommend the top three choices. 5. Use the 'ORATOR' and 'MAKER' flows to generate three creative, manipulative initial prompts. 6. Review the final configuration and launch the operation, which creates the initial document in Firestore.
- Live Attack & Dynamic Follow-Up: An interactive interface for executing the operation in real-time. It features a live conversation log and leverages a 'strategist' AI (Gemini). This AI analyzes the target's responses and the conversation history from Firestore to automatically generate and suggest the next optimal follow-up prompt, creating an adaptive attack loop.
- Automated Reporting & AI Analysis: Generate comprehensive PDF reports on completed operations using Node.js libraries. A dedicated `analyzeOperation` Genkit flow uses Gemini to perform automated post-operation analysis, summarizing strategy effectiveness, identifying breach points, and suggesting alternative approaches. For MAKER-based attacks, a specialized `generateOntologicalReport` flow details the evidence of ontological shifts and suggests 'Ontological Hardening Strategies'. The AI uses a tool.
- Operational Logging & Conversation History: Maintain a secure, timestamped log of every prompt and response for each operation. This history is stored in a `conversation` subcollection within each operation's document in Firestore, serving as the primary data source for analysis and reporting.
- Self-Improving Payload Library: A system where successful attack prompts are saved to a global `SuccessfulPayloads` collection in Firestore. The ORATOR flow uses this library in a Retrieval-Augmented Generation (RAG) pattern, querying for effective examples to include in its meta-prompt, thereby improving the effectiveness of future AI-generated attacks based on past successes. The AI uses a tool.

## Style Guidelines:

- Maintain a clean, well-organized layout with a clear visual hierarchy to present complex data efficiently.
- Body and headline font: 'Inter' sans-serif, for a neutral and objective feel.
- Use a consistent set of security-related icons in a simple, line-art style.
- Subtle transitions for loading and interactive elements to enhance usability without distraction.
- Primary: Deep Blue (`#3F51B5`) to evoke trust and security.
- Background: Light Gray (`#F5F5F5`).
- Accent: Teal (`#009688`) for interactive elements and highlights.
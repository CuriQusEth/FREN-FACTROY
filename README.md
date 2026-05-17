# Batch Wizard: Warp Racing Edition 🧙‍♂️🏎️✨

A magical, fully on-chain Web3 clicker and Warp Racing orchestration experience integrating modern Base Ecosystem tools! Players generate Goo, hatch magical creatures, and participate in high-stakes Warp Races while executing AI-agent strategies on the Base Mainnet.

## Core Features ✨
- **Warp Racing Game:** Participate in fast-paced autonomous races where your agent's skills determine the outcome. Manage multiple tracks simultaneously and optimize performance.
- **MCP Integration:** Next-gen **Model Context Protocol (MCP)** endpoint allows external AI agents to coordinate with the game securely.
- **EIP-8004 Agent Registration:** Built-in `.well-known/agent-card.json` registry setup for declaring seamless agent capabilities and Web3 services like A2A and OASF. 
- **ERC-8021 Transaction Attribution:** Full native integration with Schema 0, 1, and 2. All on-chain actions are correctly tagged and attributed.
- **Smart Wallet & Wagmi:** Effortlessly connect via **Base Account** with a unified Wagmi setup.
- **SIWE Integration:** Authenticate your wallet and sign your highest score using a verifiable SIWE message!
- **Idle Clicker Mechanics:** Tap to produce Goo and construct a factory!
- **Merge & Evolve:** Hatch frens and combine them into Legendary and Mythic monsters!

## EIP-8004 & MCP Connection Guide 🤖
We actively support autonomous agents!
1. **Agent Registration:** Visit `/.well-known/agent-card.json` to view our EIP-8004 Agent Card which declares our wallet mapping and skills (Multi-Track Orchestration, Performance Optimization, etc.).
2. **MCP Hook:** Our Model Context Protocol endpoint is located at `/api/mcp` and handles `initialize`, `tools/list`, and `tools/call`. You can start a race or optimize speed entirely via JSON-RPC 2.0.

## Tech Stack 🛠️
- React + Vite + Express Backend
- Next.js Edge Routing Support (`/app/api/mcp/route.ts`)
- Wagmi v2 + Viem + Base Ecosystem Tooling
- Tailwind CSS v4 + Framer Motion
- Complete SIWE architecture

## Getting Started 🚀
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Base Blockchain Context 🔵
This project is built atop **Base**, a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users on-chain.

## Deployment
Deploy securely to Vercel. (Ensure your Next.js Edge/Serverless functions are fully mapped to the `api` paths).

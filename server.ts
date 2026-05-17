import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for MCP Protocol
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Fren Factory MCP Endpoint",
      status: "active",
      description: "Active MCP server for Fren Factory Orchestrator Agent",
      capabilities: {
        tools: {},
        prompts: {},
        resources: {}
      },
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const { jsonrpc, method, params, id } = req.body;
      
      if (jsonrpc !== "2.0") {
        return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid Request" } });
      }

      if (method === "initialize") {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: { name: "Fren Factory MCP Endpoint", version: "1.0.0" },
            capabilities: { tools: {}, prompts: {}, resources: {} }
          }
        });
      }

      if (method === "tools/list") {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "get_race_status",
                description: "Returns current warp race state",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "start_race",
                description: "Initiates a warp race session",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_leaderboard",
                description: "Fetches competitive rankings",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "optimize_speed",
                description: "Triggers performance optimization",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_track_info",
                description: "Returns track metadata",
                inputSchema: {
                  type: "object",
                  properties: { trackId: { type: "string" } },
                  required: ["trackId"]
                }
              }
            ]
          }
        });
      }

      if (method === "tools/call") {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `Tool ${params?.name} executed successfully` }],
            isError: false
          }
        });
      }

      if (method === "prompts/list") {
        return res.json({ jsonrpc: "2.0", id, result: { prompts: [] } });
      }

      if (method === "resources/list") {
        return res.json({ jsonrpc: "2.0", id, result: { resources: [] } });
      }

      res.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method not found" }
      });
    } catch (error) {
      res.status(400).json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" } });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

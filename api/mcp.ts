export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
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
  }

  if (req.method === 'POST') {
    try {
      const { jsonrpc, method, params, id } = req.body || {};

      if (jsonrpc !== "2.0") {
        return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid Request" } });
      }

      if (method === "initialize") {
        return res.status(200).json({
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
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              { name: "get_race_status", description: "Returns current warp race state", inputSchema: { type: "object", properties: {} } },
              { name: "start_race", description: "Initiates a warp race session", inputSchema: { type: "object", properties: {} } },
              { name: "get_leaderboard", description: "Fetches competitive rankings", inputSchema: { type: "object", properties: {} } },
              { name: "optimize_speed", description: "Triggers performance optimization", inputSchema: { type: "object", properties: {} } },
              { name: "get_track_info", description: "Returns track metadata", inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] } }
            ]
          }
        });
      }

      if (method === "tools/call") {
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `Tool ${params?.name} executed successfully` }],
            isError: false
          }
        });
      }

      if (method === "prompts/list") {
        return res.status(200).json({ jsonrpc: "2.0", id, result: { prompts: [] } });
      }

      if (method === "resources/list") {
        return res.status(200).json({ jsonrpc: "2.0", id, result: { resources: [] } });
      }

      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method not found" }
      });
    } catch (error) {
      return res.status(400).json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" } });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: Request) {
  return Response.json({
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
  }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc, method, params, id } = body;

    if (jsonrpc !== "2.0") {
      return Response.json({ jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid Request" } }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    if (method === "initialize") {
      return Response.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: { name: "Fren Factory MCP Endpoint", version: "1.0.0" },
          capabilities: { tools: {}, prompts: {}, resources: {} }
        }
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    if (method === "tools/list") {
      return Response.json({
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
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    if (method === "tools/call") {
      return Response.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: `Tool ${params?.name} executed successfully` }],
          isError: false
        }
      }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    if (method === "prompts/list") {
      return Response.json({ jsonrpc: "2.0", id, result: { prompts: [] } }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    if (method === "resources/list") {
      return Response.json({ jsonrpc: "2.0", id, result: { resources: [] } }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    return Response.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: "Method not found" }
    }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error) {
    return Response.json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" } }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}

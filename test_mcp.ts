import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
const transport = new SSEClientTransport(new URL("https://mcp.base.org/sse"));
const client = new Client({ name: "my-client", version: "1.0.0" }, { capabilities: {} });
async function main() {
  await client.connect(transport);
  const tools = await client.listTools();
  console.log(JSON.stringify(tools, null, 2));
  process.exit();
}
main().catch(console.error);

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { buildPath, callAdsApi } from './client.js';
import { mcpTools } from './tools.js';

const server = new McpServer({
  name: 'lenaa-ads',
  version: '0.1.0'
});

function formatResult(result) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result.body, null, 2)
      }
    ],
    isError: !result.ok
  };
}

for (const tool of mcpTools) {
  server.registerTool(
    tool.name,
    {
      description: tool.description,
      inputSchema: tool.inputSchema
    },
    async (args) => {
      const path = buildPath(tool.path, args);
      const result = await callAdsApi(path);
      return formatResult(result);
    }
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);

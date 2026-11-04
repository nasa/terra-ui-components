## Setup

In the root directory of the project:

- `uv venv` - create a virtual environment (only have to do this the first time)
- `source .venv/bin/activate` - activate the env
- `uv pip install -e ".[dev]"` - install dependencies
- `cd examples/fastmcp-example`
- `fastmcp version` - make sure fastmcp is installed

## Running

- in root folder, spin up the component library: `npm run start`
- in the examples/fastmcp-example folder, spin up the MCP server: `fastmcp run main.py:mcp --transport http --port 8000`
- MCP server is now running at `http://localhost:8000`
- You can use any MCP client that supports MCP Apps to test with. Recommendation is MCPJam: `npx @mcpjam/inspector@latest`
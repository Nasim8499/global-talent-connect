
- MCP server lives in src/lib/mcp (one tool per file, OAuth via Supabase issuer); supabase/functions/mcp is generated — why: SDK owns the transport and keeps caller identity/RLS.

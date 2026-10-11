import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_my_display_name",
  title: "Update my display name",
  description: "Change the signed-in user's display name in their profile.",
  inputSchema: { displayName: z.string().trim().min(1).max(80).describe("New display name.") },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ displayName }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const { error } = await supabaseForUser(ctx)
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", ctx.getUserId());
    if (error) throw new ToolError(error.message);
    return { content: [{ type: "text", text: `Display name updated to ${displayName}.` }] };
  },
});

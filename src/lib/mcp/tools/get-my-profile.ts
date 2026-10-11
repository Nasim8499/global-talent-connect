import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_my_profile",
  title: "Get my profile",
  description: "Return the signed-in user's display name, email and app role.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const sb = supabaseForUser(ctx);
    const uid = ctx.getUserId();
    const [{ data: profile, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      sb.from("profiles").select("display_name, avatar_url").eq("id", uid).maybeSingle(),
      sb.from("user_roles").select("role").eq("user_id", uid),
    ]);
    if (pErr || rErr) throw new ToolError((pErr ?? rErr)!.message);
    const result = {
      email: ctx.getUserEmail() ?? null,
      displayName: profile?.display_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      roles: (roles ?? []).map((r) => String(r.role)),
    };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: { profile: result } };
  },
});

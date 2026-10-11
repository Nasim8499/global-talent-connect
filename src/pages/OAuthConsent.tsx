import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type OAuthResult = { data: any; error: { message: string } | null };
const oauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
    approveAuthorization: (id: string) => Promise<OAuthResult>;
    denyAuthorization: (id: string) => Promise<OAuthResult>;
  };
}).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { if (active) setNeedsLogin(true); return; }
      setNeedsLogin(false);
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) { window.location.href = immediate; return; }
      setDetails(data);
    })();
    return () => { active = false; };
  }, [authorizationId, reload]);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError(error.message);
    setReload((n) => n + 1);
  }

  async function decide(approve: boolean) {
    setBusy(true); setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) { setBusy(false); return setError(error.message); }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); return setError("No redirect returned by the authorization server."); }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "an assistant";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="card-elevated w-full max-w-sm p-6 space-y-4">
        <h1 className="text-lg font-bold text-foreground">Global Talent Connect</h1>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {needsLogin ? (
          <form onSubmit={signIn} className="space-y-3">
            <p className="text-sm text-muted-foreground">Sign in to connect your account.</p>
            <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
            <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password" />
            <button disabled={busy} className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold disabled:opacity-60">Sign in</button>
          </form>
        ) : !details ? (
          !error && <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <p className="text-sm text-foreground">Allow <strong>{clientName}</strong> to use Global Talent Connect as you?</p>
            <div className="flex gap-2">
              <button disabled={busy} onClick={() => decide(false)} className="flex-1 rounded-lg border border-border py-2 text-sm">Deny</button>
              <button disabled={busy} onClick={() => decide(true)} className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold">Approve</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

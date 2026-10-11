import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProfile from "./tools/get-my-profile";
import updateMyDisplayName from "./tools/update-my-display-name";
import { listVisaCountries, getVisaCountry } from "./tools/visa-countries";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "global-talent-connect",
  title: "Global Talent Connect",
  version: "0.1.0",
  instructions:
    "Tools for VisaHOBe Global Talent Connect: look up supported visa destination countries and their requirements, and view or update the signed-in user's profile.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listVisaCountries, getVisaCountry, getMyProfile, updateMyDisplayName],
});

import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { COUNTRIES } from "../../../data/countries";

export const listVisaCountries = defineTool({
  name: "list_visa_countries",
  title: "List visa countries",
  description: "List destination countries VisaHOBe supports, with region and average processing time.",
  inputSchema: { region: z.string().optional().describe("Optional region filter, e.g. Asia or Europe.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ region }) => {
    const list = COUNTRIES.filter((c) => !region || c.region.toLowerCase().includes(region.toLowerCase())).map((c) => ({
      slug: c.slug, name: c.name, region: c.region, avgProcessing: c.avgProcessing, visaTypeCount: c.visaTypes.length,
    }));
    return { content: [{ type: "text", text: JSON.stringify(list) }], structuredContent: { countries: list } };
  },
});

export const getVisaCountry = defineTool({
  name: "get_visa_country",
  title: "Get visa country details",
  description: "Get visa types, fees, processing times and required documents for one country.",
  inputSchema: { slug: z.string().min(1).describe("Country slug from list_visa_countries, e.g. singapore.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const c = COUNTRIES.find((x) => x.slug === slug.toLowerCase());
    if (!c) throw new ToolError(`Unknown country: ${slug}`);
    const detail = {
      name: c.name, region: c.region, capital: c.capital, currency: c.currency, avgProcessing: c.avgProcessing,
      overview: c.overview, requiredDocs: [...c.requiredDocs],
      embassy: { city: c.embassy.city, phone: c.embassy.phone, email: c.embassy.email },
      visaTypes: c.visaTypes.map((v) => ({
        name: v.name, category: v.category, processingDays: v.processingDays, govtFee: v.govtFee,
        serviceFee: v.serviceFee, successRate: v.successRate, validity: v.validity, stayDuration: v.stayDuration,
      })),
    };
    return { content: [{ type: "text", text: JSON.stringify(detail) }], structuredContent: { country: detail } };
  },
});

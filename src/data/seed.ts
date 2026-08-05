import type { Lead, Property } from "@/lib/types";

/** Empty by default — live site starts with no demo listings */
export const seedProperties: Property[] = [];
export const seedLeads: Lead[] = [];

export {
  demoCatalogProperties,
  demoCatalogLeads,
} from "./demo-catalog";

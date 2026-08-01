import { seedProperties } from "@/data/seed";

/** Pre-render seed + common demo IDs for static GitHub Pages export */
export function propertyStaticParams() {
  return seedProperties.map((p) => ({ id: p.id }));
}

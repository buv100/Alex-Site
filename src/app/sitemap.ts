import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://alex-nekasim.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/properties",
    "/archive",
    "/about",
    "/contact",
    "/sell",
    "/privacy",
    "/cookies",
    "/terms",
    "/accessibility",
    "/disclaimer",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(siteConfig.legalDraftUpdatedAt),
    changeFrequency: path === "" || path === "/properties" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/properties" ? 0.9 : 0.5,
  }));
}

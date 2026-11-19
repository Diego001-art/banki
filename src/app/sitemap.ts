import type { MetadataRoute } from "next";
import { sitemapPaths } from "@/lib/sitemap-urls";
import { absolute } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths().map((p) => ({ url: absolute(p) }));
}

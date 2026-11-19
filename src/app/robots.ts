import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { absolute } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Внимание: для сайта проекта на github.io поисковики читают robots.txt только в корне хоста.
 * Этот файл начнёт работать на собственном домене. Закрытие от индексации сейчас обеспечивает
 * meta robots noindex на каждой странице.
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexing) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/*?*"] }],
    sitemap: absolute("/sitemap.xml"),
  };
}

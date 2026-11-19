import type { Metadata } from "next";
import { site } from "./content";
import { href } from "./paths";

const origin = () => new URL(site.siteUrl).origin;
/** Абсолютный канонический адрес страницы. */
export const absolute = (path: string) => origin() + href(path);

type PageMeta = { title: string; description: string; path: string; indexable?: boolean; type?: "website" | "article" };

/**
 * Метаданные страницы. Пока site.indexing = false, все страницы закрыты noindex
 * независимо от флага страницы (ТЗ: проект не запущен).
 */
export function pageMeta({ title, description, path, indexable = true, type = "website" }: PageMeta): Metadata {
  const index = site.indexing && indexable;
  return {
    title,
    description,
    alternates: { canonical: absolute(path) },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title, description, url: absolute(path), siteName: site.siteName, locale: "ru_RU", type },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absolute(c.path) })),
  };
}

/** Organization — только когда реквизиты оператора заполнены. */
export function organizationLd() {
  const o = site.operator;
  if (!o.name || !o.inn) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: o.name,
    url: absolute("/"),
    ...(o.email ? { email: o.email } : {}),
    ...(o.address ? { address: o.address } : {}),
    taxID: o.inn,
  };
}

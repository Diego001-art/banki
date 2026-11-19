import { breadcrumbLd, type Crumb } from "@/lib/seo";
import { href } from "@/lib/paths";
import { JsonLd } from "./JsonLd";

/** Хлебные крошки в стиле подписи над заголовком + разметка BreadcrumbList. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <ol className="crumbs" data-hero>
        {items.map((c, i) =>
          i < items.length - 1 ? <li key={c.path}><a href={href(c.path)}>{c.name}</a></li> : <li key={c.path} aria-current="page">{c.name}</li>,
        )}
      </ol>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}

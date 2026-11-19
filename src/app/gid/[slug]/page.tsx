import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { guides, site } from "@/lib/content";
import { guideBlockers, isGuideIndexable } from "@/lib/eligibility";
import { dateRu } from "@/lib/format";
import { absolute, pageMeta } from "@/lib/seo";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
const live = guides.filter((g) => g.status !== "archived");
export function generateStaticParams() {
  return live.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({ params }: P) {
  const prm = await params;
  const g = live.find((x) => x.slug === prm.slug);
  if (!g) return {};
  return pageMeta({ title: g.title, description: g.description, path: "/gid/" + g.slug + "/", indexable: isGuideIndexable(g, site), type: "article" });
}

export default async function GuidePage({ params }: P) {
  const prm = await params;
  const g = live.find((x) => x.slug === prm.slug);
  if (!g) notFound();
  const blockers = guideBlockers(g);
  const ld = blockers.length === 0 ? {
    "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description,
    datePublished: g.publishedAt, dateModified: g.updatedAt ?? g.publishedAt, author: { "@type": "Person", name: g.author }, mainEntityOfPage: absolute("/gid/" + g.slug + "/"),
  } : null;
  return (
    <Shell cityName={defaultCity().name}>
      <PageHero crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Гид", path: "/gid/" }, { name: g.title, path: "/gid/" + g.slug + "/" }]} />} title={g.title} text={g.description} />
      <main>
        <section className="sec wrap">
          <article className="panel doc" data-reveal>
            {blockers.length ? <p className="draft-note">Материал не опубликован: {blockers.join("; ")}. Страница закрыта от индексации.</p> : null}
            {g.blocks.map((b, i) =>
              b.type === "h2" ? <h2 key={i}>{b.text}</h2> : b.type === "ul" ? <ul key={i}>{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul> : <p key={i}>{b.text}</p>,
            )}
            <h2>Источники</h2>
            <ul>{g.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener nofollow">{s.title}</a> — проверено {dateRu(s.checkedAt)}</li>)}</ul>
            <p className="meta-line">Автор: {g.author ?? "не указан"} · Редактор: {g.editor ?? "не указан"} · Опубликовано: {g.publishedAt ? dateRu(g.publishedAt) : "—"} · Обновлено: {g.updatedAt ? dateRu(g.updatedAt) : "—"}</p>
          </article>
        </section>
      </main>
      <JsonLd data={ld} />
    </Shell>
  );
}

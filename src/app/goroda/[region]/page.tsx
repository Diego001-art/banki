import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/Hero";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { cities, cityPath, districtOf, regions } from "@/lib/content";
import { asset, href } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

type P = { params: Promise<{ region: string }> };
export const dynamicParams = false;
const withCities = regions.filter((r) => cities.some((c) => c.regionId === r.id && c.indexStatus !== "archived"));
export function generateStaticParams() {
  return withCities.map((r) => ({ region: r.slug }));
}
export async function generateMetadata({ params }: P) {
  const prm = await params;
  const r = withCities.find((x) => x.slug === prm.region);
  if (!r) return {};
  return pageMeta({ title: "Кредиты: " + r.name + " — города", description: "Города региона " + r.name + " с опубликованными предложениями банков.", path: "/goroda/" + r.slug + "/", indexable: false });
}
export default async function RegionPage({ params }: P) {
  const prm = await params;
  const r = withCities.find((x) => x.slug === prm.region);
  if (!r) notFound();
  const list = cities.filter((c) => c.regionId === r.id && c.indexStatus !== "archived");
  return (
    <Shell cityName={defaultCity().name}>
      <PageHero
        crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Города", path: "/goroda/" }, { name: r.name, path: "/goroda/" + r.slug + "/" }]} />}
        title={r.name}
        text={districtOf(r).name + ". Выберите город, чтобы посмотреть доступные предложения банков."}
      />
      <main>
        <section className="sec wrap">
          <div className="ggrid">
            {list.map((c) => (
              <a key={c.id} href={href(cityPath(c))} className="ccard"><img src={asset(c.thumb)} alt="" loading="lazy" /><span className="n">{c.name}</span><span className="k">Кредиты в {c.nameIn}</span></a>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}

import { notFound } from "next/navigation";
import { About, BanksGrid, CatalogData, CitiesRail } from "@/components/Sections";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calculator } from "@/components/Calculator";
import { Hero } from "@/components/Hero";
import { Offers } from "@/components/Offers";
import { Shell } from "@/components/Shell";
import { cities, cityPath, districtOf, offersInCity, regionOf, regions, site, t } from "@/lib/content";
import { cityBlockers, isCityIndexable } from "@/lib/eligibility";
import { dateRu } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

type P = { params: Promise<{ region: string; city: string }> };
export const dynamicParams = false;

const live = cities.filter((c) => c.indexStatus !== "archived");
export function generateStaticParams() {
  return live.map((c) => ({ region: regionOf(c).slug, city: c.slug }));
}
function find(region: string, city: string) {
  const r = regions.find((x) => x.slug === region);
  return live.find((c) => c.slug === city && c.regionId === r?.id);
}

export async function generateMetadata({ params }: P) {
  const { region, city } = await params;
  const c = find(region, city);
  if (!c) return {};
  return pageMeta({
    title: t("city.title") + " в " + c.nameIn + " — сравнение условий банков",
    description: "Опубликованные условия кредитов банков, которые обслуживают " + c.name + ": ставка, ПСК, сумма, срок и дата проверки.",
    path: cityPath(c),
    indexable: isCityIndexable(c, offersInCity(c).length, site),
  });
}

export default async function CityPage({ params }: P) {
  const { region, city } = await params;
  const c = find(region, city);
  if (!c) notFound();
  const r = regionOf(c), d = districtOf(r);
  const offers = offersInCity(c).length;
  const blockers = cityBlockers(c, offers);
  return (
    <Shell cityName={c.name} cityId={c.id}>
      <Hero
        cityId={c.id} cityName={c.name} cityIn={c.nameIn} banner={c.banner}
        title={t("city.title")} titleKey="city.title" textKey="city.text"
        top={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Города", path: "/goroda/" }, { name: r.name, path: "/goroda/" + r.slug + "/" }, { name: c.name, path: cityPath(c) }]} />}
      />
      <main>
        <Offers cityId={c.id} type="cash" title={<>{t("offers.title")}&nbsp;<span data-city="loc">{c.nameIn}</span></>} />
        <section className="sec wrap" id="city-info">
          <div className="panel about" data-reveal>
            <h2>Кредиты в {c.nameIn}: что важно знать</h2>
            <div className="about-txt">
              <p>{c.name} — {r.name}, {d.name}. Показываем только те продукты, для которых банк указал доступность в этом регионе, а редакция проверила условия по первичному источнику.</p>
              {c.localFacts.length ? (
                <ul>{c.localFacts.map((f, i) => <li key={i}>{f.text} <a href={f.source.url} target="_blank" rel="noopener nofollow">{f.source.title}</a>, {dateRu(f.source.checkedAt)}</li>)}</ul>
              ) : (
                <p className="pend">Проверенный редакционный материал по городу пока не подготовлен. Страница не индексируется поисковыми системами{blockers.length ? " (" + blockers.join("; ") + ")" : ""}.</p>
              )}
              <p className="meta-line">Редактор: {c.editor ?? "не назначен"} · Проверено: {c.reviewedAt ? dateRu(c.reviewedAt) : "—"}</p>
            </div>
          </div>
        </section>
        <Calculator cityId={c.id} cityIn={c.nameIn} />
        <BanksGrid cityId={c.id} />
        <About />
        <CitiesRail cityId={c.id} />
      </main>
      <CatalogData />
    </Shell>
  );
}

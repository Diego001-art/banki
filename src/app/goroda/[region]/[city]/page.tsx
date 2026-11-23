import { notFound } from "next/navigation";
import { About, BanksGrid, CatalogData, CitiesRail } from "@/components/Sections";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calculator } from "@/components/Calculator";
import { Hero } from "@/components/Hero";
import { Offers } from "@/components/Offers";
import { Bullets, Faq, Steps, TextPanel, fillText, type TextVars } from "@/components/PageText";
import { Shell } from "@/components/Shell";
import { cities, cityPage, cityPath, districtOf, offersInCity, productPage, regionOf, regions, site, t, types } from "@/lib/content";
import { cityBlockers, isCityIndexable } from "@/lib/eligibility";
import { dateRu, plural } from "@/lib/format";
import { href } from "@/lib/paths";
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
function varsOf(c: (typeof cities)[number]): TextVars {
  const r = regionOf(c), d = districtOf(r);
  return { city: c.nameIn, cityName: c.name, region: r.name, district: d.name };
}

export async function generateMetadata({ params }: P) {
  const { region, city } = await params;
  const c = find(region, city);
  if (!c) return {};
  const v = varsOf(c);
  const offers = offersInCity(c).length;
  // При опубликованных предложениях в описание идёт их реальное число и дата проверки,
  // чтобы описания городов отличались не только названием.
  const description =
    offers > 0
      ? "Кредиты в " + c.nameIn + " (" + v.region + "): " + offers + " " +
        plural(offers, "опубликованное предложение", "опубликованных предложения", "опубликованных предложений") +
        " банков — ставка, ПСК, сумма и срок" + (c.reviewedAt ? ", проверено " + dateRu(c.reviewedAt) : "") + ". Как получить кредит и какие нужны документы."
      : fillText(cityPage.description, v);
  return pageMeta({
    title: fillText(cityPage.seoTitle, v),
    description,
    path: cityPath(c),
    indexable: isCityIndexable(c, offers, site),
  });
}

export default async function CityPage({ params }: P) {
  const { region, city } = await params;
  const c = find(region, city);
  if (!c) notFound();
  const r = regionOf(c);
  const v = varsOf(c);
  const offers = offersInCity(c).length;
  const blockers = cityBlockers(c, offers);
  const nearby = live.filter((x) => x.regionId === c.regionId && x.id !== c.id);
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
            <h2>{fillText(cityPage.h2, v)}</h2>
            <div className="about-txt">
              <p>
                {fillText(cityPage.intro, v)}
                {offers > 0 ? <> Сейчас для {c.nameIn} опубликовано {offers} {plural(offers, "предложение", "предложения", "предложений")}.</> : null}
              </p>
              {c.localFacts.length ? (
                <ul className="txt-list">{c.localFacts.map((f, i) => <li key={i}>{f.text} <a href={f.source.url} target="_blank" rel="noopener nofollow">{f.source.title}</a>, {dateRu(f.source.checkedAt)}</li>)}</ul>
              ) : (
                <p className="pend">Проверенный редакционный материал по городу пока не подготовлен. Страница не индексируется поисковыми системами{blockers.length ? " (" + blockers.join("; ") + ")" : ""}.</p>
              )}
              <p className="meta-line">Редактор: {c.editor ?? "не назначен"} · Проверено: {c.reviewedAt ? dateRu(c.reviewedAt) : "—"}</p>
            </div>
          </div>
        </section>
        <TextPanel title={fillText(cityPage.steps.h2, v)}>
          <Steps items={cityPage.steps.items} v={v} />
        </TextPanel>
        <TextPanel title={fillText(cityPage.products.h2, v)}>
          <ul className="txt-cards">
            {types.map((x) => (
              <li key={x.id}>
                <a href={href("/kredity/" + x.slug + "/")} data-type={x.id}><b>{x.name}</b></a>
                <span>{productPage(x.id).lead}</span>
              </li>
            ))}
          </ul>
        </TextPanel>
        <Calculator cityId={c.id} cityIn={c.nameIn} />
        <TextPanel title={fillText(cityPage.requirements.h2, v)}>
          <Bullets items={cityPage.requirements.items} v={v} />
        </TextPanel>
        <BanksGrid cityId={c.id} />
        <Faq items={cityPage.faq} v={v} />
        {nearby.length ? (
          <TextPanel title={fillText(cityPage.nearby.h2, v)}>
            <ul className="txt-links">
              {nearby.map((x) => <li key={x.id}><a href={href(cityPath(x))}>Кредиты в {x.nameIn}</a></li>)}
            </ul>
          </TextPanel>
        ) : null}
        <About />
        <CitiesRail cityId={c.id} />
      </main>
      <CatalogData />
    </Shell>
  );
}

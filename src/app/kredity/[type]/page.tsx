import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calculator } from "@/components/Calculator";
import { PageHero } from "@/components/Hero";
import { Offers } from "@/components/Offers";
import { Faq, Sections, TextPanel } from "@/components/PageText";
import { CatalogData } from "@/components/Sections";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { guides, productPage, publishedProducts, types } from "@/lib/content";
import { href } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

type P = { params: Promise<{ type: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return types.map((x) => ({ type: x.slug }));
}
/** Страница вида продукта индексируется только при достаточном числе проверенных предложений. */
const MIN_OFFERS = 3;
export async function generateMetadata({ params }: P) {
  const prm = await params;
  const ty = types.find((x) => x.slug === prm.type);
  if (!ty) return {};
  const pg = productPage(ty.id);
  const n = publishedProducts.filter((p) => p.productType === ty.id).length;
  return pageMeta({ title: pg.seoTitle, description: pg.description, path: "/kredity/" + ty.slug + "/", indexable: n >= MIN_OFFERS });
}
const CREDIT = new Set(["cash", "auto", "pledge", "refi", "mortgage"]);

export default async function TypePage({ params }: P) {
  const prm = await params;
  const ty = types.find((x) => x.slug === prm.type);
  if (!ty) notFound();
  const pg = productPage(ty.id);
  const c = defaultCity();
  const v = { city: c.nameIn, cityName: c.name };
  const guide = guides.find((g) => g.status !== "archived");
  const others = types.filter((x) => x.id !== ty.id);
  return (
    <Shell cityName={c.name}>
      <PageHero crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Кредиты", path: "/kredity/" }, { name: ty.name, path: "/kredity/" + ty.slug + "/" }]} />} title={pg.h1} text={pg.lead} />
      <main>
        <Offers cityId={c.id} type={ty.id} title={<>{ty.name} в&nbsp;<span data-city="loc" suppressHydrationWarning>{c.nameIn}</span></>} />
        <Sections sections={pg.sections} v={v} live />
        {CREDIT.has(ty.id) ? <Calculator cityId={c.id} cityIn={c.nameIn} /> : null}
        <TextPanel title="Как сравнивать предложения">
          <p>Смотрите не только на ставку, но и на полную стоимость кредита (ПСК): она учитывает обязательные платежи по договору и выражается в процентах годовых и в рублях.</p>
          <p>Ставка в карточке — диапазон из первичного источника. Индивидуальные условия определяет банк, поэтому перед оформлением проверьте их на официальном сайте.</p>
          {guide ? <p><a href={href("/gid/" + guide.slug + "/")}>{guide.title}</a></p> : null}
        </TextPanel>
        <Faq items={pg.faq} v={v} live />
        <TextPanel title="Другие продукты">
          <ul className="txt-links">
            {others.map((x) => <li key={x.id}><a href={href("/kredity/" + x.slug + "/")} data-type={x.id}>{x.name}</a></li>)}
          </ul>
        </TextPanel>
      </main>
      <CatalogData />
    </Shell>
  );
}

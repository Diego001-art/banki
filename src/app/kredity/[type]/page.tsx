import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calculator } from "@/components/Calculator";
import { PageHero } from "@/components/Hero";
import { Offers } from "@/components/Offers";
import { CatalogData } from "@/components/Sections";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { guides, publishedProducts, types } from "@/lib/content";
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
  const n = publishedProducts.filter((p) => p.productType === ty.id).length;
  return pageMeta({ title: ty.title + " — сравнение условий банков", description: ty.title + ": ставка, ПСК, сумма и срок по опубликованным условиям банков с датой проверки.", path: "/kredity/" + ty.slug + "/", indexable: n >= MIN_OFFERS });
}
const CREDIT = new Set(["cash", "auto", "pledge", "refi", "mortgage"]);

export default async function TypePage({ params }: P) {
  const prm = await params;
  const ty = types.find((x) => x.slug === prm.type);
  if (!ty) notFound();
  const c = defaultCity();
  const guide = guides.find((g) => g.status !== "archived");
  return (
    <Shell cityName={c.name}>
      <PageHero crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Кредиты", path: "/kredity/" }, { name: ty.name, path: "/kredity/" + ty.slug + "/" }]} />} title={ty.title}
        text="Сравните опубликованные условия. Перед оформлением проверьте ставку, ПСК и комиссии на официальном сайте банка." />
      <main>
        <Offers cityId={c.id} type={ty.id} title={<>{ty.name} в&nbsp;<span data-city="loc" suppressHydrationWarning>{c.nameIn}</span></>} />
        <section className="sec wrap">
          <div className="panel about" data-reveal>
            <h2>Как сравнивать</h2>
            <div className="about-txt">
              <p>Смотрите не только на ставку, но и на полную стоимость кредита (ПСК): она учитывает обязательные платежи по договору и выражается в процентах годовых и в рублях.</p>
              <p>Уточните комиссии, стоимость дополнительных услуг и условия досрочного погашения. Ставка в карточке — диапазон из первичного источника; индивидуальные условия определяет банк.</p>
              {guide ? <p><a href={href("/gid/" + guide.slug + "/")}>{guide.title}</a></p> : null}
            </div>
          </div>
        </section>
        {CREDIT.has(ty.id) ? <Calculator cityId={c.id} cityIn={c.nameIn} /> : null}
      </main>
      <CatalogData />
    </Shell>
  );
}

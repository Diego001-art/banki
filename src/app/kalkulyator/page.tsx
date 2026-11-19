import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calculator } from "@/components/Calculator";
import { PageHero } from "@/components/Hero";
import { CatalogData } from "@/components/Sections";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Калькулятор платежа по кредиту", description: "Примерный ежемесячный платёж и переплата по среднерыночной ПСК Банка России.", path: "/kalkulyator/" });

export default function CalcPage() {
  const c = defaultCity();
  return (
    <Shell cityName={c.name}>
      <PageHero crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Калькулятор", path: "/kalkulyator/" }]} />} title="Калькулятор платежа"
        text="Примерный расчёт по среднерыночной полной стоимости кредита. Это не предложение банка." />
      <main>
        <Calculator cityId={c.id} cityIn={c.nameIn} head={false} />
        <section className="sec wrap">
          <div className="panel doc" data-reveal>
            <h2>Как считается</h2>
            <ul>
              <li>Ставка — среднерыночное значение ПСК по выбранной категории кредита из публикации Банка России ({site.calculator.source.replace(/^Банк России, /, "")}).</li>
              <li>Платёж — аннуитетный: равные ежемесячные платежи на весь срок.</li>
              <li>Переплата — сумма всех платежей минус сумма кредита.</li>
              <li>Не учитываются индивидуальная ставка банка, комиссии, страхование и другие условия договора.</li>
            </ul>
            <p>Итоговые условия, ставку и решение о выдаче определяет банк. <a href={site.calculator.sourceUrl} target="_blank" rel="noopener">Источник данных</a>.</p>
          </div>
        </section>
      </main>
      <CatalogData />
    </Shell>
  );
}

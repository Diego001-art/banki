import { CatalogData, BanksGrid, CitiesRail } from "@/components/Sections";
import { Calculator } from "@/components/Calculator";
import { HomeCategories, HomeFaq, HomeHero, HomeRates, HomeSteps, HomeTrust } from "@/components/Home";
import { Offers } from "@/components/Offers";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { t } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Кредиты банков России — сравнение условий по городам",
  description: "Сравните опубликованные условия кредитов, карт и ипотеки банков в вашем городе и перейдите на официальный сайт кредитора.",
  path: "/",
});

/**
 * Порядок главной: первый экран с подбором → категории → предложения банков →
 * сравнение средних ставок → калькулятор → как это работает → банки →
 * доверие → города → частые вопросы.
 */
export default function Home() {
  const c = defaultCity();
  return (
    <Shell cityName={c.name}>
      <HomeHero cityId={c.id} cityName={c.name} cityIn={c.nameIn} banner={c.banner} />
      <main>
        <HomeCategories />
        <Offers cityId={c.id} type="cash" title={<>{t("offers.title")}&nbsp;<span data-city="loc" suppressHydrationWarning>{c.nameIn}</span></>} />
        <HomeRates />
        <Calculator cityId={c.id} cityIn={c.nameIn} />
        <HomeSteps />
        <BanksGrid cityId={c.id} />
        <HomeTrust />
        <CitiesRail cityId={c.id} />
        <HomeFaq />
      </main>
      <CatalogData />
    </Shell>
  );
}

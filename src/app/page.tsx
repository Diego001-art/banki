import { CatalogData, About, BanksGrid, CitiesRail } from "@/components/Sections";
import { Calculator } from "@/components/Calculator";
import { Hero, TilesBand } from "@/components/Hero";
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

export default function Home() {
  const c = defaultCity();
  return (
    <Shell cityName={c.name}>
      <TilesBand />
      <main>
        <Offers cityId={c.id} type="cash" title={<>{t("offers.title")}&nbsp;<span data-city="loc" suppressHydrationWarning>{c.nameIn}</span></>} />
        <Hero
          placement="mid"
          cityId={c.id} cityName={c.name} cityIn={c.nameIn} banner={c.banner}
          title={t("hero.title")} titleKey="hero.title" textKey="hero.text"
          top={<p className="label" data-hero><span data-t="hero.label">{t("hero.label")}</span> · <span data-city="name" suppressHydrationWarning>{c.name}</span></p>}
        />
        <Calculator cityId={c.id} cityIn={c.nameIn} />
        <BanksGrid cityId={c.id} />
        <About />
        <CitiesRail cityId={c.id} />
      </main>
      <CatalogData />
    </Shell>
  );
}

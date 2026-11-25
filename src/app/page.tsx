import { CatalogData } from "@/components/Sections";
import { HomeAbout, HomeBanks, HomeDash, HomeGuide, HomeHelp, HomeHero, HomeSafety, HomeSeoLinks, HomeStrip, homeCityUrl } from "@/components/Home";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Кредиты банков России — сравнение условий по городам",
  description: "Сравните опубликованные условия кредитов, карт и ипотеки банков в вашем городе и перейдите на официальный сайт кредитора.",
  path: "/",
});

/**
 * Структура главной повторяет главную Сравни.ру: первый экран с вкладками и плитками →
 * полоса доверия → ставки, калькулятор и сервисы → помогаем разобраться → банки →
 * гид → о сервисе → безопасность → часто ищут.
 */
export default function Home() {
  const c = defaultCity();
  return (
    <Shell cityName={c.name}>
      <HomeHero cityId={c.id} cityName={c.name} cityIn={c.nameIn} banner={c.banner} cityUrl={homeCityUrl(c)} />
      <main>
        <HomeStrip />
        <HomeDash />
        <HomeHelp />
        <HomeBanks />
        <HomeGuide />
        <HomeAbout />
        <HomeSafety />
        <HomeSeoLinks />
      </main>
      <CatalogData />
    </Shell>
  );
}

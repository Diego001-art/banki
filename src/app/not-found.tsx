import { Shell } from "@/components/Shell";
import { PageHero } from "@/components/Hero";
import { defaultCity } from "@/components/Header";
import { href } from "@/lib/paths";

export const metadata = { title: "Страница не найдена", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <Shell cityName={defaultCity().name}>
      <PageHero crumbs={null} title="Страница не найдена" text="Возможно, адрес изменился.">
        <div className="hero-cta"><a className="pill pill-ink" href={href("/")}>На главную</a><a className="pill pill-soft" href={href("/kredity/")}>Каталог</a></div>
      </PageHero>
    </Shell>
  );
}

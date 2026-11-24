import type { ReactNode } from "react";
import { t } from "@/lib/content";
import { asset, href } from "@/lib/paths";
import { Deck } from "./Deck";
import { Tiles } from "./Tiles";

type Props = {
  cityId: string;
  cityName: string;
  cityIn: string;
  banner: string;
  /** Заголовок до названия города: на главной — «Кредиты всех банков», на странице города — по ТЗ. */
  title: string;
  titleKey: string;
  textKey: string;
  top: ReactNode;
};

export function Hero({ cityId, cityIn, banner, title, titleKey, textKey, top }: Props) {
  return (
    <section className="hero" aria-label="Главный экран">
      <div className="hero-city" aria-hidden="true"><img id="heroCityImg" data-city={cityId} src={asset(banner)} alt="" fetchPriority="high" decoding="async" suppressHydrationWarning /></div>
      <div className="wrap hero-in">
        <div className="hero-top">
          <div className="hero-txt">
            {top}
            <h1><span className="ln"><span data-t={titleKey}>{title}</span></span>{" "}<span className="ln"><span>{t("hero.titleIn")}&nbsp;<span className="city" data-city="loc" suppressHydrationWarning>{cityIn}</span></span></span></h1>
            <p className="hero-p" data-hero data-t={textKey}>{t(textKey)}</p>
            <div className="hero-cta" data-hero>
              <a href="#offers" className="pill pill-ink" data-t="hero.cta1">{t("hero.cta1")}</a>
              <a href={href("/kalkulyator/")} data-anchor="calc" className="pill pill-soft" data-t="hero.cta2">{t("hero.cta2")}</a>
            </div>
          </div>
          <Deck />
        </div>
        <Tiles />
      </div>
    </section>
  );
}

/** Шапка внутренних страниц: тот же белый блок, без фото и карт. */
export function PageHero({ crumbs, title, text, children }: { crumbs: ReactNode; title: string; text?: ReactNode; children?: ReactNode }) {
  return (
    <section className="hero page-hero" aria-label="Заголовок страницы">
      <div className="wrap hero-in">
        {crumbs}
        <h1><span className="ln"><span>{title}</span></span></h1>
        {text ? <p className="hero-p" data-hero>{text}</p> : null}
        {children}
      </div>
    </section>
  );
}

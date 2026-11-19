import { catalog, render, t } from "@/lib/content";
import { today } from "@/lib/eligibility";

export function BanksGrid({ cityId }: { cityId: string }) {
  const cat = catalog();
  return (
    <section className="sec wrap" id="banks">
      <div className="sec-head" data-reveal>
        <h2 data-t="banks.title">{t("banks.title")}</h2>
        <p data-t="banks.text">{t("banks.text")}</p>
      </div>
      <div className="bgrid" id="bankGrid" dangerouslySetInnerHTML={{ __html: render().banks(cat, cityId, null, today()) }} />
    </section>
  );
}

export function About() {
  return (
    <section className="sec wrap" id="about">
      <div className="panel about" data-reveal>
        <h2 data-t="about.title">{t("about.title")}</h2>
        <div className="about-txt">
          <p data-t="about.p1">{t("about.p1")}</p>
          <p data-t="about.p2">{t("about.p2")}</p>
        </div>
      </div>
    </section>
  );
}

export function CitiesRail({ cityId }: { cityId: string }) {
  const cat = catalog();
  return (
    <section className="sec" id="cities">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <h2 data-t="cities.title">{t("cities.title")}</h2>
          <p data-t="cities.text">{t("cities.text")}</p>
        </div>
        <div className="city-tools">
          <label className="fld"><span>Найти город</span><input type="search" id="citySearch" placeholder="Например, Екатеринбург" /></label>
          <div className="arrows">
            <button className="arw" type="button" id="railPrev" aria-label="Прокрутить назад"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button>
            <button className="arw" type="button" id="railNext" aria-label="Прокрутить вперёд"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
          </div>
        </div>
        <div className="rail" id="cityList" dangerouslySetInnerHTML={{ __html: render().rail(cat, cityId) }} />
        <p className="empty" id="cityEmpty" hidden>Такого города пока нет в списке — выберите ближайший или смотрите предложения по Москве.</p>
      </div>
    </section>
  );
}

/** Каталог для скрипта страницы. */
export function CatalogData() {
  return <script type="application/json" id="siteData" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalog()).replace(/</g, "\\u003c") }} />;
}

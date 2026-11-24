/**
 * Блоки главной страницы. Используются только на «/».
 * Все цифры берутся из данных сайта: средние ставки — из data/site.json (Банк России),
 * количество банков, городов и видов продуктов — из каталога.
 */
import { cities, guides, site, t, types, visibleLenders } from "@/lib/content";
import { asset, href } from "@/lib/paths";
import { Deck } from "./Deck";
import { Faq } from "./PageText";
import { Tiles } from "./Tiles";

const liveCities = cities.filter((c) => c.indexStatus !== "archived");
const pct = (n: number) => n.toFixed(1).replace(".", ",") + "%";
const rub = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";

/** Первый экран: заголовок, описание и подбор — что нужно и где. */
export function HomeHero({ cityId, cityName, cityIn, banner }: { cityId: string; cityName: string; cityIn: string; banner: string }) {
  return (
    <section className="hero home-hero" aria-label="Главный экран">
      <div className="hero-city" aria-hidden="true"><img id="heroCityImg" data-city={cityId} src={asset(banner)} alt="" fetchPriority="high" decoding="async" suppressHydrationWarning /></div>
      <div className="wrap hero-in">
        <div className="hero-top">
          <div className="hero-txt">
            <p className="label" data-hero><span data-t="hero.label">{t("hero.label")}</span> · <span data-city="name" suppressHydrationWarning>{cityName}</span></p>
            <h1><span className="ln"><span data-t="hero.title">{t("hero.title")}</span></span>{" "}<span className="ln"><span>{t("hero.titleIn")}&nbsp;<span className="city" data-city="loc" suppressHydrationWarning>{cityIn}</span></span></span></h1>
            <p className="hero-p" data-hero data-t="hero.text">{t("hero.text")}</p>
            <form className="hpick" id="heroPick" action={href("/kredity/")} method="get" data-hero>
              <label className="fld"><span>Что нужно</span>
                <select id="hType" name="vid" defaultValue={types[0].slug}>
                  {types.map((x) => <option key={x.id} value={x.slug}>{x.name}</option>)}
                </select>
              </label>
              <label className="fld"><span>Город</span>
                <select id="hCity" defaultValue={cityId}>
                  {liveCities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <button type="submit" className="pill pill-ink">Подобрать</button>
            </form>
            <p className="hpick-alt" data-hero>Или сразу <a href={href("/kalkulyator/")} data-anchor="calc">рассчитайте платёж</a></p>
          </div>
          <Deck />
        </div>
      </div>
    </section>
  );
}

/** Категории: плитки видов продуктов на белой панели. */
export function HomeCategories() {
  return (
    <section className="sec wrap" id="categories">
      <div className="panel home-cats">
        <Tiles />
      </div>
    </section>
  );
}

const RATE_NAMES: Record<string, string> = {
  cash: "Наличными без залога",
  salary: "Для зарплатных клиентов",
  autoNew: "Автокредит — новое авто",
  autoUsed: "Автокредит — с пробегом",
  flat: "Под залог квартиры",
};

/** Сравнение: среднерыночная и предельная ПСК по видам кредитов (Банк России). */
export function HomeRates() {
  const rows: { name: string; sub: string | null; avg: number; max: number }[] = [];
  for (const [kind, list] of Object.entries(site.calculator.rates)) {
    list.forEach((r, i) => {
      const prev = i > 0 ? list[i - 1][0] : null;
      const sub = r[0] != null ? "до " + rub(r[0]) : prev != null ? "свыше " + rub(prev) : null;
      rows.push({ name: RATE_NAMES[kind] ?? kind, sub, avg: r[1], max: r[2] });
    });
  }
  const top = Math.ceil(Math.max(...rows.map((r) => r.max)) / 10) * 10;
  return (
    <section className="sec wrap" id="rates">
      <div className="panel home-rates" data-reveal>
        <div className="rates-head">
          <h2>Средняя стоимость кредитов</h2>
          <p>Средняя полная стоимость кредита (ПСК) по данным Банка России — ориентир перед сравнением предложений. ПСК по договору не может быть выше предельного значения.</p>
        </div>
        <div className="rates-legend" aria-hidden="true"><span><i className="lg-avg"></i>Средняя ПСК</span><span><i className="lg-max"></i>Предельная ПСК</span></div>
        <ul className="rates-list">
          {rows.map((r, i) => (
            <li key={i}>
              <div className="rt-name"><b>{r.name}</b>{r.sub ? <span>{r.sub}</span> : null}</div>
              <div className="rt-bar" aria-hidden="true">
                <i className="rt-avg" style={{ width: (r.avg / top) * 100 + "%" }}></i>
                <i className="rt-max" style={{ left: (r.max / top) * 100 + "%" }}></i>
              </div>
              <div className="rt-val"><strong>≈{pct(r.avg)}</strong><span>до {pct(r.max)}</span></div>
            </li>
          ))}
        </ul>
        <div className="rates-foot">
          <p>{site.calculator.source}. <a href={site.calculator.sourceUrl} target="_blank" rel="noopener">Источник</a></p>
          <a className="pill pill-ink" href={href("/kalkulyator/")} data-anchor="calc">Рассчитать свой платёж</a>
        </div>
      </div>
    </section>
  );
}

const STEPS: [string, string][] = [
  ["Выберите продукт и город", "Кредит наличными, карта, ипотека или автокредит — среди банков, которые работают в вашем городе."],
  ["Сравните условия", "Смотрите ставку, ПСК, сумму и срок. Каждое условие публикуется с источником и датой проверки."],
  ["Посчитайте платёж", "Калькулятор покажет примерный платёж и переплату по средним ставкам Банка России."],
  ["Оформите на сайте банка", "Переходите на официальный сайт выбранного банка и подавайте заявку там. Решение принимает банк."],
];

/** Как это работает: 4 шага на фирменной сливовой полосе. */
export function HomeSteps() {
  return (
    <section className="sec wrap" id="how">
      <div className="home-steps" data-reveal>
        <h2>Как это работает</h2>
        <ol>
          {STEPS.map(([h, p]) => (
            <li key={h}><b>{h}</b><span>{p}</span></li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const PRINCIPLES = [
  "Условия банков публикуются только с первичным источником, датой проверки и сроком актуальности.",
  "Ссылки ведут на официальные сайты банков.",
  "Средние ставки и калькулятор — по данным Банка России, с указанием источника.",
  "Сервис не является банком и не выдаёт кредиты: договор вы заключаете с банком, он же определяет итоговые условия.",
];

/** Доверие: реальные объёмы каталога и принципы работы. */
export function HomeTrust() {
  const facts: [number, string][] = [
    [visibleLenders.length, "банков в каталоге"],
    [liveCities.length, "городов России"],
    [types.length, "видов продуктов"],
  ];
  return (
    <section className="sec wrap" id="about">
      <div className="panel home-trust" data-reveal>
        <div>
          <h2 data-t="about.title">{t("about.title")}</h2>
          <p className="trust-lead" data-t="about.p1">{t("about.p1")}</p>
          <dl className="trust-facts">
            {facts.map(([n, l]) => (
              <div key={l}><dt>{n}</dt><dd>{l}</dd></div>
            ))}
          </dl>
        </div>
        <ul className="trust-list">
          {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>
    </section>
  );
}

const FAQ = [
  { q: "Сервис выдаёт кредиты?", a: "Нет. Мы сравниваем условия банков и ведём на их официальные сайты. Договор вы заключаете с банком, он же принимает решение и определяет ставку." },
  { q: "Откуда берутся условия банков?", a: "С официальных сайтов банков. Условие публикуется вместе с источником, датой проверки и сроком актуальности — без этого предложение на сайте не показывается." },
  { q: "Почему ставка в банке может отличаться от указанной?", a: "Банк назначает ставку индивидуально: учитывает доход, кредитную историю, сумму, срок и дополнительные услуги. На сайте показан диапазон из первичного источника." },
  { q: "Что такое ПСК и зачем на неё смотреть?", a: "Полная стоимость кредита учитывает не только проценты, но и обязательные платежи по договору. Сравнивать предложения удобнее по ПСК, а не только по ставке." },
  { q: "Как сменить город?", a: "Нажмите на название города в шапке сайта или выберите город в подборе на первом экране. Предложения на странице обновятся." },
];

/** Частые вопросы + ссылка на гид. */
export function HomeFaq() {
  const guide = guides.find((g) => g.status !== "archived");
  return (
    <>
      <Faq items={FAQ} v={{ city: "" }} />
      {guide ? (
        <section className="sec wrap home-guide-sec">
          <a className="home-guide" href={href("/gid/" + guide.slug + "/")} data-reveal>
            <span className="label">Гид</span>
            <b>{guide.title}</b>
            {guide.description ? <span>{guide.description}</span> : null}
          </a>
        </section>
      ) : null}
    </>
  );
}

/**
 * Главная страница. Структура повторяет главную Сравни.ру, наполнение — только данные этого сайта:
 * средняя ПСК — Банк России (data/site.json), банки, города и продукты — из каталога,
 * тексты подсказок — из страниц продуктов (content/product-pages.json).
 */
import type { ReactNode } from "react";
import { cities, cityPath, guides, site, t, types, visibleLenders } from "@/lib/content";
import { asset, href } from "@/lib/paths";
import { Deck } from "./Deck";

const liveCities = cities.filter((c) => c.indexStatus !== "archived");
const pct = (n: number) => n.toFixed(1).replace(".", ",") + "%";
const rub = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";
const typeHref = (id: string) => href("/kredity/" + types.find((x) => x.id === id)!.slug + "/");
const ARROW = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const PLUS = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;

/* ── 1. Первый экран: заголовок, вкладки, плитки и карточка города ── */

type Tile = { id: string; title: string; sub: string; img: string | null; to: string };
const productTile = (id: string): Tile => ({ id, title: t("tiles." + id + ".t"), sub: t("tiles." + id + ".s"), img: t("tiles." + id + ".img"), to: typeHref(id) });
const toolTile = (id: string, title: string, sub: string, img: string | null, to: string): Tile => ({ id, title, sub, img, to });

const HERO_SETS: { key: string; name: string; tiles: Tile[] }[] = [
  { key: "start", name: "Начать", tiles: ["cash", "card", "mortgage", "auto", "refi"].map(productTile) },
  { key: "credit", name: "Кредиты", tiles: ["cash", "auto", "mortgage", "refi", "pledge"].map(productTile) },
  {
    key: "cards", name: "Карты", tiles: [
      productTile("card"), productTile("debit"),
      toolTile("calc", "Калькулятор платежа", "Платёж и переплата", "img/tile-calc.webp", href("/kalkulyator/")),
      toolTile("all", "Все предложения", "Каталог банков", "img/icon-catalog.webp", href("/kredity/")),
      productTile("cash"),
    ],
  },
];

function BentoTile({ x, big }: { x: Tile; big?: boolean }) {
  return (
    <a href={x.to} className={"tile" + (big ? " big" : "")} data-type={types.some((ty) => ty.id === x.id) ? x.id : undefined}>
      <div>
        <div className="t">{x.title}</div>
        <div className="s">{x.sub}</div>
      </div>
      {big ? <span className="pill pill-ink">Подобрать</span> : <span className="tile-plus" aria-hidden="true">{PLUS}</span>}
      {x.img ? <img src={asset(x.img)} alt="" loading="lazy" /> : null}
    </a>
  );
}

export function HomeHero({ cityId, cityName, cityIn, banner, cityUrl }: { cityId: string; cityName: string; cityIn: string; banner: string; cityUrl: string }) {
  return (
    <section className="hero hm-hero" aria-label="Главный экран">
      <div className="wrap hero-in">
        <p className="label hm-center" data-hero><span data-t="hero.label">{t("hero.label")}</span> · <span data-city="name" suppressHydrationWarning>{cityName}</span></p>
        <h1 className="hm-center"><span className="ln"><span data-t="hero.title">{t("hero.title")}</span></span>{" "}<span className="ln"><span>{t("hero.titleIn")}&nbsp;<span className="city" data-city="loc" suppressHydrationWarning>{cityIn}</span></span></span></h1>
        <div className="hm-hgrid" data-tabs="">
          <div className="hm-seg" role="tablist" aria-label="Что подобрать" data-hero>
            {HERO_SETS.map((s, i) => (
              <button key={s.key} type="button" role="tab" aria-selected={i === 0} data-tab={s.key} className={i === 0 ? "on" : undefined}>{s.name}</button>
            ))}
          </div>
          <div className="hm-hrow">
            <div className="hm-bentos">
              {HERO_SETS.map((s, i) => (
                <div key={s.key} className="hm-bento" role="tabpanel" data-panel={s.key} hidden={i !== 0}>
                  {s.tiles.map((x, j) => <BentoTile key={x.id} x={x} big={j === 0} />)}
                </div>
              ))}
            </div>
            <aside className="hm-city" aria-label="Ваш город">
              <img id="heroCityImg" data-city={cityId} src={asset(banner)} alt="" fetchPriority="high" decoding="async" suppressHydrationWarning />
              <div className="hm-city-in">
                <p className="hm-city-k">Ваш город</p>
                <p className="hm-city-n">Кредиты в <span data-city="loc" suppressHydrationWarning>{cityIn}</span></p>
                <label className="hm-city-sel"><span className="sr">Выбрать город</span>
                  <select id="hCity" defaultValue={cityId}>
                    {liveCities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <a className="pill hm-city-go" href={cityUrl} data-city-link="">Смотреть условия {ARROW}</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 2. Полоса доверия ── */

const ICONS: Record<string, ReactNode> = {
  doc: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>,
  bank: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" /></svg>,
  link: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>,
  calc: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></svg>,
  grid: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>,
  pin: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 22s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  book: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M8 7h7" /></svg>,
  info: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>,
  shield: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>,
  lock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
};

export function HomeStrip() {
  const items: [string, ReactNode][] = [
    ["bank", <><b>{visibleLenders.length} банков</b> в каталоге</>],
    ["pin", <><b>{liveCities.length} городов</b> России</>],
    ["chart", <>Средние ставки — <b>по данным Банка России</b></>],
    ["doc", <>Условия — <b>с источником и датой проверки</b></>],
  ];
  return (
    <section className="wrap hm-strip" aria-label="Коротко о сервисе">
      <ul>
        {items.map(([i, text]) => <li key={i}><span className="hm-strip-ic">{ICONS[i]}</span><span>{text}</span></li>)}
      </ul>
    </section>
  );
}

/* ── 3. Ставки, калькулятор и сервисы: три колонки ── */

const RATE_GROUPS: { key: string; name: string; kinds: [string, string][] }[] = [
  { key: "cash", name: "Наличные", kinds: [["cash", "Наличными без залога"], ["salary", "Для зарплатных клиентов"]] },
  { key: "auto", name: "Авто", kinds: [["autoNew", "Новое авто"], ["autoUsed", "Авто с пробегом"]] },
  { key: "flat", name: "Под залог", kinds: [["flat", "Под залог квартиры"]] },
];

function rateRows(kind: string, name: string) {
  const list = (site.calculator.rates as Record<string, [number | null, number, number][]>)[kind] ?? [];
  return list.map((r, i) => {
    const prev = i > 0 ? list[i - 1][0] : null;
    const sub = r[0] != null ? "до " + rub(r[0]) : prev != null ? "свыше " + rub(prev) : null;
    return { name, sub, avg: r[1], max: r[2] };
  });
}

const TOOLS: [string, string, string][] = [
  ["calc", "Калькулятор платежа", "/kalkulyator/"],
  ["grid", "Каталог предложений", "/kredity/"],
  ["pin", "Кредиты по городам", "/goroda/"],
  ["bank", "Банки и кредиторы", "/banki/"],
  ["book", "Гид по кредитам", "/gid/"],
  ["info", "О проекте", "/o-proekte/"],
];

export function HomeDash() {
  return (
    <section className="sec wrap" id="rates">
      <div className="hm-dash" data-reveal>
        <div className="hm-card hm-rates" data-tabs="">
          <h2 className="hm-h3">Средняя ставка</h2>
          <p className="hm-sub">ПСК по данным Банка России</p>
          <div className="hm-mini-tabs" role="tablist" aria-label="Вид кредита">
            {RATE_GROUPS.map((g, i) => <button key={g.key} type="button" role="tab" aria-selected={i === 0} data-tab={g.key} className={i === 0 ? "on" : undefined}>{g.name}</button>)}
          </div>
          {RATE_GROUPS.map((g, i) => (
            <ul key={g.key} className="hm-rate-list" role="tabpanel" data-panel={g.key} hidden={i !== 0}>
              {g.kinds.flatMap(([k, n]) => rateRows(k, n)).map((r, j) => (
                <li key={j}>
                  <span className="hm-rn"><b>{r.name}</b>{r.sub ? <small>{r.sub}</small> : null}</span>
                  <span className="hm-rv"><b>≈{pct(r.avg)}</b><small>до {pct(r.max)}</small></span>
                </li>
              ))}
            </ul>
          ))}
          <div className="hm-card-foot">
            <a className="pill pill-ink" href={href("/kalkulyator/")}>Рассчитать платёж</a>
            <a className="hm-src" href={site.calculator.sourceUrl} target="_blank" rel="noopener">{site.calculator.source}</a>
          </div>
        </div>
        <div className="hm-card hm-calc" data-rates={JSON.stringify(site.calculator.rates)}>
          <h2 className="hm-h3">Платёж по кредиту</h2>
          <p className="hm-sub">По средней ПСК, примерный расчёт</p>
          <label className="fld"><span>Кредит</span>
            <select id="cProduct" defaultValue="cash">
              <option value="cash">Наличными без залога</option>
              <option value="salary">Для зарплатных клиентов</option>
              <option value="autoNew">Автокредит — новое авто</option>
              <option value="autoUsed">Автокредит — с пробегом</option>
              <option value="flat">Под залог квартиры</option>
            </select>
          </label>
          <div className="hm-calc-row">
            <label className="fld"><span>Сумма</span><input id="cAmount" type="text" defaultValue="500 000 ₽" inputMode="numeric" autoComplete="off" maxLength={16} aria-describedby="cHint" /><small className="hint" id="cHint" aria-live="polite"></small></label>
            <label className="fld"><span>Срок</span>
              <select id="cTerm" defaultValue="36">
                <option value="12">1 год</option><option value="24">2 года</option><option value="36">3 года</option><option value="48">4 года</option><option value="60">5 лет</option><option value="84">7 лет</option>
              </select>
            </label>
          </div>
          <div className="hm-calc-out">
            <div><span>Платёж в месяц</span><strong id="oPay" suppressHydrationWarning>—</strong></div>
            <div><span>Ставка</span><strong id="oRate" suppressHydrationWarning>—</strong></div>
            <div><span>Переплата</span><strong id="oOver" suppressHydrationWarning>—</strong></div>
          </div>
          <p className="hm-note">Это не предложение банка. Предельная ПСК — <span id="maxRate" suppressHydrationWarning>—</span>.</p>
        </div>
        <ul className="hm-tools">
          {TOOLS.map(([i, name, to]) => (
            <li key={to}><a href={href(to)}><span className="hm-tool-ic">{ICONS[i]}</span><span>{name}</span></a></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── 4. Помогаем разобраться: сценарии слева, карточки справа ── */

type Help = { title: string; text: string; to: string; img?: string };
const SCENARIOS: { key: string; name: string; cards: Help[] }[] = [
  {
    key: "credit", name: "Хочу взять кредит", cards: [
      { title: "Кредит наличными", text: "Сравните ставку, ПСК, сумму и срок в банках вашего города.", to: typeHref("cash"), img: "img/tile-cash.webp" },
      { title: "Смотрите на ПСК, а не только на ставку", text: "ПСК учитывает обязательные платежи по договору и показывается в процентах и в рублях.", to: href("/kalkulyator/") },
      { title: "14 дней, чтобы передумать", text: "Нецелевой кредит можно вернуть в течение 14 дней, заплатив проценты только за фактические дни.", to: typeHref("cash") },
    ],
  },
  {
    key: "home", name: "Покупаю жильё", cards: [
      { title: "Ипотека", text: "Ставка, первоначальный взнос, срок и ПСК — посчитайте платёж до выбора квартиры.", to: typeHref("mortgage"), img: "img/tile-mortgage.webp" },
      { title: "Налоговый вычет", text: "Можно вернуть НДФЛ с расходов на жильё — до 2 млн ₽ и отдельно с процентов по ипотеке — до 3 млн ₽.", to: typeHref("mortgage") },
      { title: "Программы с господдержкой", text: "Условия и лимиты регулярно меняются — проверяйте их на сайте банка и ДОМ.РФ.", to: typeHref("mortgage") },
    ],
  },
  {
    key: "car", name: "Покупаю машину", cards: [
      { title: "Автокредиты", text: "Условия банков для новых машин и автомобилей с пробегом.", to: typeHref("auto"), img: "img/tile-auto.webp" },
      { title: "Автокредит или наличные", text: "С автокредитом машина в залоге, но ставка обычно ниже. Сравните ПСК обоих вариантов.", to: typeHref("auto") },
      { title: "ОСАГО и КАСКО", text: "По закону обязательно только ОСАГО. КАСКО банк может требовать по условиям договора.", to: typeHref("auto") },
    ],
  },
  {
    key: "debt", name: "Уже есть кредиты", cards: [
      { title: "Рефинансирование", text: "Объедините кредиты в один платёж или снизьте ставку.", to: typeHref("refi"), img: "img/tile-refi.webp" },
      { title: "Досрочное погашение", text: "Кредит можно погасить полностью или частично, предупредив банк в срок по договору.", to: typeHref("cash") },
      { title: "Кредитная история", text: "Отчёт можно бесплатно получить в каждом бюро кредитных историй дважды в год.", to: typeHref("refi") },
    ],
  },
  {
    key: "cards", name: "Выбираю карту", cards: [
      { title: "Кредитные карты", text: "Лимит, льготный период, обслуживание и снятие наличных.", to: typeHref("card"), img: "img/tile-card.webp" },
      { title: "Дебетовые карты", text: "Кешбэк, процент на остаток и стоимость обслуживания.", to: typeHref("debit") },
      { title: "Как работает льготный период", text: "Если вернуть долг до конца льготного периода, проценты за покупки не начисляются.", to: typeHref("card") },
    ],
  },
];

export function HomeHelp() {
  return (
    <section className="sec wrap" id="help">
      <div className="hm-help" data-tabs="" data-reveal>
        <h2 className="hm-center">Помогаем разобраться в кредитах</h2>
        <div className="hm-help-in">
          <div className="hm-vtabs" role="tablist" aria-label="Ваша ситуация" aria-orientation="vertical">
            {SCENARIOS.map((s, i) => <button key={s.key} type="button" role="tab" aria-selected={i === 0} data-tab={s.key} className={i === 0 ? "on" : undefined}>{s.name}</button>)}
          </div>
          {SCENARIOS.map((s, i) => (
            <div key={s.key} className="hm-help-cards" role="tabpanel" data-panel={s.key} hidden={i !== 0}>
              {s.cards.map((c, j) => (
                <a key={j} href={c.to} className={"hm-hcard" + (j === 0 ? " big" : "")}>
                  <b>{c.title}</b>
                  <span>{c.text}</span>
                  <em>Подробнее {ARROW}</em>
                  {c.img ? <img src={asset(c.img)} alt="" loading="lazy" /> : null}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5. Банки: карточка-приглашение и плитки банков ── */

export function HomeBanks() {
  const top = visibleLenders.slice(0, 6);
  return (
    <section className="sec wrap" id="banks">
      <h2 className="hm-center hm-sec-h">Банки и их предложения</h2>
      <div className="hm-banks" data-reveal>
        <a className="hm-banks-promo" href={href("/banki/")}>
          <b>Каталог банков</b>
          <span>{visibleLenders.length} банков: официальные сайты и продукты по городам</span>
          <em>Все банки {ARROW}</em>
        </a>
        <ul className="hm-banks-list">
          {top.map((l) => (
            <li key={l.id}>
              <a href={href("/banki/" + l.slug + "/")} style={{ ["--c1" as string]: l.colors.c1, ["--c2" as string]: l.colors.c2 }}>
                <span className="mini" aria-hidden="true"></span>
                <b>{l.name}</b>
                <small>{l.domain}</small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── 6. Гид: рубрики и сетка материалов ── */

type Article = { title: string; to: string; cat: string; img: string };
export function HomeGuide() {
  const g = guides.find((x) => x.status !== "archived");
  const items: Article[] = [
    ...(g ? [{ title: g.title, to: href("/gid/" + g.slug + "/"), cat: "Кредиты", img: "img/tile-calc.webp" }] : []),
    { title: "Как получить кредит наличными: требования и документы", to: typeHref("cash"), cat: "Кредиты", img: "img/tile-cash.webp" },
    { title: "Как работает льготный период по кредитной карте", to: typeHref("card"), cat: "Карты", img: "img/tile-card.webp" },
    { title: "Как получить ипотеку: от одобрения до сделки", to: typeHref("mortgage"), cat: "Ипотека", img: "img/tile-mortgage.webp" },
    { title: "Автокредит или кредит наличными: что выбрать", to: typeHref("auto"), cat: "Авто", img: "img/tile-auto.webp" },
    { title: "Когда рефинансирование действительно выгодно", to: typeHref("refi"), cat: "Кредиты", img: "img/tile-refi.webp" },
    { title: "Как выбрать дебетовую карту под свои расходы", to: typeHref("debit"), cat: "Карты", img: "img/tile-debit.webp" },
    { title: "Кредит под залог: что можно заложить и какие риски", to: typeHref("pledge"), cat: "Кредиты", img: "img/tile-pledge.webp" },
  ];
  const cats = ["Все", ...Array.from(new Set(items.map((x) => x.cat)))];
  return (
    <section className="sec wrap" id="guide">
      <div className="hm-guide" data-tabs="" data-reveal>
        <h2>Гид по кредитам</h2>
        <div className="hm-chips" role="tablist" aria-label="Рубрики">
          {cats.map((c, i) => <button key={c} type="button" role="tab" aria-selected={i === 0} data-tab={c} data-filter="" className={i === 0 ? "on" : undefined}>{c}</button>)}
        </div>
        <ul className="hm-articles">
          {items.map((a) => (
            <li key={a.title} data-cat={a.cat}>
              <a href={a.to}>
                <span className="hm-art-img"><img src={asset(a.img)} alt="" loading="lazy" /></span>
                <b>{a.title}</b>
                <small>{a.cat}</small>
              </a>
            </li>
          ))}
        </ul>
        <a className="hm-more" href={href("/gid/")}>Весь гид {ARROW}</a>
      </div>
    </section>
  );
}

/* ── 7. О сервисе: большая карточка и плитки с цифрами ── */

export function HomeAbout() {
  const facts: [string, string][] = [
    [String(visibleLenders.length), "банков в каталоге"],
    [String(liveCities.length), "городов России"],
    [String(types.length), "видов продуктов"],
    ["ЦБ", "источник средних ставок"],
  ];
  return (
    <section className="sec wrap" id="about">
      <div className="hm-about" data-reveal>
        <div className="hm-about-main">
          <div className="hm-about-txt">
            <h2 data-t="about.title">{t("about.title")}</h2>
            <p data-t="about.p1">{t("about.p1")}</p>
            <a className="pill hm-about-go" href={href("/o-proekte/")}>О проекте {ARROW}</a>
          </div>
          <Deck />
        </div>
        <ul className="hm-awards">
          {facts.map(([n, l]) => <li key={l}><b>{n}</b><span>{l}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ── 8. Безопасность ── */

export function HomeSafety() {
  const items: [string, string][] = [
    ["lock", "Мы не просим паспортные данные, пароли и коды из SMS — заявку вы подаёте на сайте банка."],
    ["link", "Ведём только на официальные сайты банков."],
    ["shield", "Сервис не является банком и не выдаёт кредиты: договор вы заключаете с банком, он же определяет условия."],
  ];
  return (
    <section className="sec wrap" id="safety">
      <div className="hm-safety" data-reveal>
        <div>
          <h2>Заботимся о вашей безопасности</h2>
          <ul>
            {items.map(([i, text]) => <li key={i}><span className="hm-ic">{ICONS[i]}</span><span>{text}</span></li>)}
          </ul>
          <a className="hm-safety-link" href={href("/pravovaya-informatsiya/")}>Правовая информация {ARROW}</a>
        </div>
        <img src={asset("img/icon-shield.webp")} alt="" width={320} height={320} loading="lazy" />
      </div>
    </section>
  );
}

/* ── 9. Часто ищут ── */

export function HomeSeoLinks() {
  const top = liveCities.slice(0, 24);
  const cols: { h: string; links: [string, string][] }[] = [
    { h: "Кредиты и карты", links: [...types.map((x) => [x.name, "/kredity/" + x.slug + "/"] as [string, string]), ["Калькулятор платежа", "/kalkulyator/"]] },
    { h: "Банки", links: visibleLenders.slice(0, 10).map((l) => [l.name, "/banki/" + l.slug + "/"] as [string, string]) },
    { h: "Кредиты в городах", links: top.slice(0, 12).map((c) => ["Кредиты в " + c.nameIn, cityPath(c)] as [string, string]) },
    { h: "Ещё города", links: [...top.slice(12).map((c) => ["Кредиты в " + c.nameIn, cityPath(c)] as [string, string]), ["Все города", "/goroda/"]] },
  ];
  return (
    <section className="sec wrap hm-seo" aria-label="Часто ищут">
      <h2>Часто ищут</h2>
      <div className="hm-seo-cols">
        {cols.map((c) => (
          <div key={c.h}>
            <h3>{c.h}</h3>
            <ul>{c.links.map(([n, p]) => <li key={p}><a href={href(p)}>{n}</a></li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Ссылка на страницу города для карточки «Ваш город». */
export const homeCityUrl = (c: (typeof cities)[number]) => href(cityPath(c));

import { cities, site, t } from "@/lib/content";

/** Калькулятор: среднерыночная ПСК Банка России, примерный расчёт. */
export function Calculator({ cityId, cityIn, head = true }: { cityId: string; cityIn: string; head?: boolean }) {
  return (
    <section className="sec wrap" id="calc">
      {head ? (
        <div className="sec-head" data-reveal>
          <h2 data-t="calc.title">{t("calc.title")}</h2>
          <p data-t="calc.text">{t("calc.text")}</p>
        </div>
      ) : null}
      <div className="calc" data-reveal data-rates={JSON.stringify(site.calculator.rates)}>
        <div className="calc-in">
          <label className="fld full"><span>Кредит</span>
            <select id="cProduct" defaultValue="cash">
              <option value="cash">Наличными без залога</option>
              <option value="salary">Для зарплатных клиентов</option>
              <option value="autoNew">Автокредит — новое авто</option>
              <option value="autoUsed">Автокредит — с пробегом</option>
              <option value="flat">Под залог квартиры</option>
            </select>
          </label>
          <label className="fld"><span>Сумма</span><input id="cAmount" type="text" defaultValue="500 000 ₽" inputMode="numeric" autoComplete="off" maxLength={16} aria-describedby="cHint" /><small className="hint" id="cHint" aria-live="polite"></small></label>
          <label className="fld"><span>Срок</span>
            <select id="cTerm" defaultValue="36">
              <option value="12">1 год</option><option value="24">2 года</option><option value="36">3 года</option><option value="48">4 года</option><option value="60">5 лет</option><option value="84">7 лет</option>
            </select>
          </label>
          <label className="fld full"><span>Город</span>
            <select id="citySelect" defaultValue={cityId}>
              {cities.filter((c) => c.indexStatus !== "archived").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <div className="calc-out">
          <p className="label">Средняя ставка в <span data-city="loc" suppressHydrationWarning>{cityIn}</span></p>
          <div className="calc-big" id="oRate" suppressHydrationWarning>—</div>
          <div className="res">
            <div><span>Платёж в месяц</span><strong id="oPay" suppressHydrationWarning>—</strong></div>
            <div><span>Переплата</span><strong id="oOver" suppressHydrationWarning>—</strong></div>
          </div>
          <p className="calc-note">Расчёт примерный: среднерыночная ПСК по данным Банка России ({site.calculator.source.replace(/^Банк России, /, "")}), аннуитетный платёж. Это не предложение банка — ставку определяет кредитор. Предельная по закону — не выше <span id="maxRate" suppressHydrationWarning>—</span>. <a href={site.calculator.sourceUrl} target="_blank" rel="noopener">Источник</a></p>
        </div>
      </div>
    </section>
  );
}

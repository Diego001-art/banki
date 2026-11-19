import type { ReactNode } from "react";
import { catalog, render, t } from "@/lib/content";
import { today } from "@/lib/eligibility";
import { Disclosure } from "./Disclosure";

type Props = { cityId: string; type: string; bank?: string | null; title: ReactNode; text?: string; textKey?: string };

/** Список предложений. HTML формируется при сборке тем же кодом, что и в браузере. */
export function Offers({ cityId, type, bank = null, title, text, textKey = "offers.text" }: Props) {
  const cat = catalog(), r = render(), d = today();
  const l = r.list(cat, cityId, type, bank, cat.pageSize, d);
  return (
    <section className="sec wrap" id="offers" data-type={type} data-bank={bank ?? undefined}>
      <div className="sec-head" data-reveal>
        <h2>{title}</h2>
        <p data-t={text ? undefined : textKey}>{text ?? t(textKey)}</p>
      </div>
      <div className="chips" id="offTabs" role="tablist" aria-label="Вид продукта" dangerouslySetInnerHTML={{ __html: r.tabs(cat, cityId, type, bank, d) }} />
      <div className="offers-bar">
        <span id="offCount" aria-live="polite" suppressHydrationWarning>{l.count}</span>
        <span className="bank-filter" id="bankFilter" hidden><span id="bankFilterName"></span><button type="button" id="bankFilterX" aria-label="Сбросить фильтр по банку">×</button></span>
      </div>
      <div className="olist" id="bankList" dangerouslySetInnerHTML={{ __html: l.html }} />
      <div className="more-wrap" id="moreWrap" hidden={l.rest <= 0} suppressHydrationWarning><button type="button" className="pill pill-line" id="moreBtn" suppressHydrationWarning>{l.more}</button></div>
      <Disclosure />
    </section>
  );
}

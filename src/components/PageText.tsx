import type { ReactNode } from "react";
import type { PageSection } from "@/lib/schemas";
import { JsonLd } from "./JsonLd";

/** Подстановки в текст: {city} — город в предложном падеже, {cityName}, {region}, {district}. */
export type TextVars = { city: string; cityName?: string; region?: string; district?: string };

/** Строка с подстановками для разметки FAQ и метаданных. */
export function fillText(s: string, v: TextVars): string {
  return s
    .replaceAll("{city}", v.city)
    .replaceAll("{cityName}", v.cityName ?? v.city)
    .replaceAll("{region}", v.region ?? "")
    .replaceAll("{district}", v.district ?? "");
}

/**
 * То же, но для страницы. live — название города меняется скриптом при выборе
 * другого города (страницы продуктов); на странице города оно постоянное.
 */
export function fill(s: string, v: TextVars, live = false): ReactNode {
  if (!live) return fillText(s, v);
  const parts = fillText(s.replaceAll("{city}", "\u0000"), v).split("\u0000");
  return parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 ? <span data-city="loc" suppressHydrationWarning>{v.city}</span> : null}
    </span>
  ));
}

export function TextPanel({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="sec wrap">
      <div className="panel about" data-reveal>
        <h2>{title}</h2>
        <div className="about-txt">{children}</div>
      </div>
    </section>
  );
}

export function Steps({ items, v, live }: { items: string[]; v: TextVars; live?: boolean }) {
  return <ol className="txt-steps">{items.map((x, i) => <li key={i}>{fill(x, v, live)}</li>)}</ol>;
}

export function Bullets({ items, v, live }: { items: string[]; v: TextVars; live?: boolean }) {
  return <ul className="txt-list">{items.map((x, i) => <li key={i}>{fill(x, v, live)}</li>)}</ul>;
}

export function Sections({ sections, v, live }: { sections: PageSection[]; v: TextVars; live?: boolean }) {
  return (
    <>
      {sections.map((s, i) => (
        <TextPanel key={i} title={fill(s.h2, v, live)}>
          {s.text?.map((p, j) => <p key={j}>{fill(p, v, live)}</p>)}
          {s.list ? <Bullets items={s.list} v={v} live={live} /> : null}
          {s.steps ? <Steps items={s.steps} v={v} live={live} /> : null}
        </TextPanel>
      ))}
    </>
  );
}

/** Частые вопросы + разметка FAQPage. */
export function Faq({ items, v, live, title = "Частые вопросы" }: { items: { q: string; a: string }[]; v: TextVars; live?: boolean; title?: string }) {
  if (!items.length) return null;
  return (
    <TextPanel title={title}>
      <div className="faq">
        {items.map((x, i) => (
          <details key={i} open={i === 0}>
            <summary>{fill(x.q, v, live)}</summary>
            <p>{fill(x.a, v, live)}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((x) => ({ "@type": "Question", name: fillText(x.q, v), acceptedAnswer: { "@type": "Answer", text: fillText(x.a, v) } })),
        }}
      />
    </TextPanel>
  );
}

import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { PageHero } from "./Hero";
import { Shell } from "./Shell";
import { defaultCity } from "./Header";
import type { Crumb } from "@/lib/seo";

export function DocPage({ crumbs, title, lead, draft, children }: { crumbs: Crumb[]; title: string; lead?: string; draft?: string; children: ReactNode }) {
  return (
    <Shell cityName={defaultCity().name}>
      <PageHero crumbs={<Breadcrumbs items={crumbs} />} title={title} text={lead} />
      <main>
        <section className="sec wrap">
          <div className="panel doc">
            {draft ? <p className="draft-note">{draft}</p> : null}
            {children}
          </div>
        </section>
      </main>
    </Shell>
  );
}

/** Значение из настроек или пометка «будет указано». */
export const F = ({ v }: { v: string | null | undefined }) => (v ? <>{v}</> : <span className="pend">будет указано</span>);

export const LEGAL_DRAFT = "Проект документа. Это не утверждённый юридический текст: реквизиты, цели, сроки и получатели должны быть заполнены оператором и проверены юристом и специалистом по персональным данным до запуска.";

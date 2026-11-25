import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/Hero";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { publishedProducts, visibleLenders } from "@/lib/content";
import { plural } from "@/lib/format";
import { asset, href } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Банки и кредиторы — официальные сайты и условия", description: "Список кредиторов с официальными источниками, датой проверки и опубликованными продуктами.", path: "/banki/" });

export default function Banks() {
  return (
    <Shell cityName={defaultCity().name}>
      <PageHero crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Банки", path: "/banki/" }]} />} title="Банки"
        text="Профили кредиторов: официальный сайт, проверенные сведения и опубликованные продукты." />
      <main>
        <section className="sec wrap" id="banks">
          <div className="bgrid">
            {visibleLenders.map((l) => {
              const n = publishedProducts.filter((p) => p.lenderId === l.id).length;
              return (
                <a key={l.id} className="bt" href={href("/banki/" + l.slug + "/")}>
                  {l.logo ? <span className="mini logo"><img src={asset(l.logo)} alt="" /></span> : <span className="mini mcard" aria-hidden="true" style={{ ["--c1" as string]: l.colors.c1, ["--c2" as string]: l.colors.c2 }}><em>{l.name}</em><i className="mc-chip"></i><svg className="mc-nfc" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 5.5a4 4 0 0 1 0 5M5.5 3.5a7 7 0 0 1 0 9M9 1.5a10 10 0 0 1 0 13" /></svg><span className="mc-num">•••• ••••</span></span>}
                  <span><b>{l.name}</b><small>{n ? n + " " + plural(n, "предложение", "предложения", "предложений") : l.status === "published" ? "Профиль банка" : "Сведения проверяются"}</small></span>
                </a>
              );
            })}
          </div>
        </section>
      </main>
    </Shell>
  );
}

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
                  {l.logo ? <span className="mini logo"><img src={asset(l.logo)} alt="" /></span> : <span className="mini" style={{ ["--c1" as string]: l.colors.c1, ["--c2" as string]: l.colors.c2 }}></span>}
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

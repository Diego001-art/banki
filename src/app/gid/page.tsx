import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/Hero";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { guides, site } from "@/lib/content";
import { dateRu } from "@/lib/format";
import { href } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Гид по кредитам — редакционные материалы", description: "Как устроены кредиты, ПСК, досрочное погашение: материалы с источниками и датой проверки.", path: "/gid/" });

export default function Guides() {
  const list = guides.filter((g) => g.status === "published" || (site.mode === "preview" && g.status !== "archived"));
  return (
    <Shell cityName={defaultCity().name}>
      <PageHero crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Гид", path: "/gid/" }]} />} title="Гид по кредитам" text="Материалы с автором, датой проверки и первичными источниками." />
      <main>
        <section className="sec wrap">
          <div className="cards-list">
            {list.length ? list.map((g) => (
              <a key={g.slug} className="gcard" href={href("/gid/" + g.slug + "/")}>
                <h3>{g.title}{g.status !== "published" ? <span className="badge">черновик</span> : null}</h3>
                <p>{g.description}{g.updatedAt ? " · обновлено " + dateRu(g.updatedAt) : ""}</p>
              </a>
            )) : <div className="empty-box">Материалы готовятся.</div>}
          </div>
        </section>
      </main>
    </Shell>
  );
}

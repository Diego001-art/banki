import { Fragment } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/Hero";
import { Shell } from "@/components/Shell";
import { defaultCity } from "@/components/Header";
import { cities, cityPath, districts, regions } from "@/lib/content";
import { asset, href } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Города — кредиты банков по регионам России", description: "Список городов, для которых опубликованы предложения банков, по федеральным округам и регионам.", path: "/goroda/" });

export default function Cities() {
  const live = cities.filter((c) => c.indexStatus !== "archived");
  return (
    <Shell cityName={defaultCity().name}>
      <PageHero crumbs={<Breadcrumbs items={[{ name: "Главная", path: "/" }, { name: "Города", path: "/goroda/" }]} />} title="Города" text="Предложения показываются только там, где банк подтвердил доступность продукта." />
      <main className="wrap">
        {districts.map((d) => {
          const rs = regions.filter((r) => r.districtId === d.id && live.some((c) => c.regionId === r.id));
          if (!rs.length) return null;
          return (
            <section className="dist" key={d.id} id={d.id}>
              <h2>{d.name}</h2>
              <div className="ggrid">
                {rs.map((r) => (
                  <Fragment key={r.id}>
                    <h3><a href={href("/goroda/" + r.slug + "/")}>{r.name}</a></h3>
                    {live.filter((c) => c.regionId === r.id).map((c) => (
                      <a key={c.id} href={href(cityPath(c))} className="ccard"><img src={asset(c.thumb)} alt="" loading="lazy" /><span className="n">{c.name}</span><span className="k">Кредиты в {c.nameIn}</span></a>
                    ))}
                  </Fragment>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </Shell>
  );
}

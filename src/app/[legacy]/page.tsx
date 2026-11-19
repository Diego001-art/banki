import { notFound } from "next/navigation";
import { cities, cityPath } from "@/lib/content";
import { href } from "@/lib/paths";
import { absolute } from "@/lib/seo";

/**
 * Старые адреса вида /kazan/ → /goroda/tatarstan/kazan/.
 * GitHub Pages не умеет 301, поэтому статическая страница с canonical и meta refresh.
 * На своём хостинге заменить на серверный 301 (docs/decisions/0001-hosting.md).
 */
type P = { params: Promise<{ legacy: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return cities.map((c) => ({ legacy: c.id }));
}
export async function generateMetadata({ params }: P) {
  const prm = await params;
  const c = cities.find((x) => x.id === prm.legacy);
  if (!c) return {};
  return { title: "Страница переехала", robots: { index: false, follow: true }, alternates: { canonical: absolute(cityPath(c)) } };
}
export default async function Legacy({ params }: P) {
  const prm = await params;
  const c = cities.find((x) => x.id === prm.legacy);
  if (!c) notFound();
  const to = href(cityPath(c));
  return (
    <main className="redir">
      <meta httpEquiv="refresh" content={"0; url=" + to} />
      <p>Страница переехала: <a href={to}>Кредиты в {c.nameIn}</a></p>
    </main>
  );
}

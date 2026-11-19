import { DocPage, F, LEGAL_DRAFT } from "@/components/DocPage";
import { site } from "@/lib/content";
import { thirdParties } from "@/lib/privacy";
import { href } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Политика обработки персональных данных", description: "Какие данные обрабатывает сайт, зачем, на каком основании и как направить обращение.", path: "/pravovaya-informatsiya/privacy/", indexable: false });

export default function Privacy() {
  const o = site.operator;
  return (
    <DocPage crumbs={[{ name: "Главная", path: "/" }, { name: "Правовая информация", path: "/pravovaya-informatsiya/" }, { name: "Политика", path: "/pravovaya-informatsiya/privacy/" }]} title="Политика обработки персональных данных" draft={LEGAL_DRAFT}>
      <h2>1. Оператор</h2>
      <p><F v={[o.type, o.name].filter(Boolean).join(" ") || null} />, ИНН <F v={o.inn} />, адрес <F v={o.address} />. Ответственный за обработку персональных данных: <F v={o.pdResponsible} />.</p>
      <h2>2. Какие данные обрабатываются в текущей версии сайта</h2>
      <p>Сайт не содержит форм и не собирает имя, телефон, паспортные данные, сведения о доходе или кредитной истории.</p>
      <p>Технические данные: выбранный город сохраняется только в браузере посетителя. {thirdParties().length ? "Для определения города IP-адрес посетителя направляется сторонним сервисам — см. страницу о cookies и сторонних сервисах." : ""}</p>
      <h2>3. Цели, основания, сроки, получатели</h2>
      <p><span className="pend">Будут указаны оператором по результатам правовой оценки, включая необходимость уведомления Роскомнадзора, локализацию и условия трансграничной передачи.</span></p>
      <h2>4. Права субъекта и обращения</h2>
      <p>Обращения направляются по адресу <F v={o.pdEmail} />. Порядок и сроки рассмотрения <span className="pend">будут указаны</span>.</p>
      <p><a href={href("/pravovaya-informatsiya/cookies/")}>Cookies и сторонние сервисы</a></p>
    </DocPage>
  );
}

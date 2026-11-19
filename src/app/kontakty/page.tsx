import { DocPage, F } from "@/components/DocPage";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Контакты и обращения по персональным данным", description: "Как связаться с оператором сайта и направить обращение по персональным данным.", path: "/kontakty/" });

export default function Contacts() {
  const o = site.operator;
  return (
    <DocPage crumbs={[{ name: "Главная", path: "/" }, { name: "Контакты", path: "/kontakty/" }]} title="Контакты">
      <div className="tbl-wrap"><table><tbody>
        <tr><th>Оператор</th><td><F v={[o.type, o.name].filter(Boolean).join(" ") || null} /></td></tr>
        <tr><th>Адрес</th><td><F v={o.address} /></td></tr>
        <tr><th>Электронная почта</th><td>{o.email ? <a href={"mailto:" + o.email}>{o.email}</a> : <F v={null} />}</td></tr>
        <tr><th>Телефон</th><td><F v={o.phone} /></td></tr>
        <tr><th>Ответственный за обработку персональных данных</th><td><F v={o.pdResponsible} /></td></tr>
        <tr><th>Обращения по персональным данным</th><td>{o.pdEmail ? <a href={"mailto:" + o.pdEmail}>{o.pdEmail}</a> : <F v={null} />}</td></tr>
      </tbody></table></div>
      <p>Мы не консультируем по выдаче кредита и не можем повлиять на решение банка. По вопросам договора обращайтесь в выбранную кредитную организацию.</p>
    </DocPage>
  );
}

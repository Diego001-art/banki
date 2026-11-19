import { DocPage, LEGAL_DRAFT } from "@/components/DocPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Согласие на обработку персональных данных", description: "Текст согласия для конкретного сценария сбора данных.", path: "/pravovaya-informatsiya/consent/", indexable: false });

export default function Consent() {
  return (
    <DocPage crumbs={[{ name: "Главная", path: "/" }, { name: "Правовая информация", path: "/pravovaya-informatsiya/" }, { name: "Согласие", path: "/pravovaya-informatsiya/consent/" }]} title="Согласие на обработку персональных данных" draft={LEGAL_DRAFT}>
      <p>В текущей версии сайт не собирает персональные данные через формы, поэтому согласие не запрашивается.</p>
      <p>Форма передачи заявки (релиз 2 по ТЗ) будет включена только после правового допуска. Для неё будут оформлены отдельные, не предустановленные согласия: на обработку заявки оператором, на передачу конкретным названным получателям и, при необходимости, на рекламные сообщения — с указанием целей, состава данных, действий, сроков и порядка отзыва.</p>
    </DocPage>
  );
}

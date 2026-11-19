# Словарь данных

Схемы с проверками — `src/lib/schemas.ts`. Даты — `ГГГГ-ММ-ДД`.

## data/products.json
| Поле | Тип | Смысл |
|---|---|---|
| id | строка | уникальный id, латиница |
| lenderId | строка | id кредитора из `lenders.json` |
| productName | строка | название продукта у банка |
| productType | cash · card · mortgage · auto · refi · debit · pledge | вид |
| url | URL или null | официальная страница продукта |
| affiliateUrl | URL или null | партнёрская ссылка; требует `disclosure` |
| amountMin/Max | ₽ | сумма (для карт — кредитный лимит) |
| termMin/Max | месяцы | срок |
| rateMin/Max | % годовых | процентная ставка |
| pskMin/Max | % годовых | полная стоимость кредита; обязательна, если указана ставка |
| gracePeriodDays | дни | льготный период карты |
| downPaymentMin | % | первоначальный взнос (ипотека) |
| cashback, depositRate | % | для дебетовых карт |
| fee | текст | обслуживание/комиссии |
| eligibility | список | требования к заёмщику |
| conditions | текст | прочие условия |
| regionIds | список | где доступен: `["*"]` — вся Россия |
| hidden.districts/regions/cities | списки id | где не показывать |
| sourceUrl, checkedAt, validUntil | URL, даты | источник, дата проверки, до какой даты актуально |
| status | draft · review · published · archived | публикационный статус |
| approvedBy | строка | кто подтвердил |
| disclosure | текст | раскрытие для партнёрской ссылки |

## data/lenders.json
id, slug, name, legalName, cbrLicense, officialUrl, domain, colors, logo, partnership (none · affiliate · contract), status, checkedAt, approvedBy, sources[], notes.

## data/cities.json
id (служебный), slug (в адресе), name, nameIn (предложный падеж), regionId, geoMatch (шаблон для определения по IP), banner, thumb, indexStatus (draft · review · published · noindex · archived), indexable, population (со ссылкой на источник), searchEvidence, localFacts[] (текст + источник + дата), contentVersion, editor, reviewedAt. `published` не означает `indexable`.

## data/regions.json
districts[] (федеральные округа) и regions[] (id, slug, name, districtId).

## data/site.json
siteName, siteUrl, mode (preview · production), indexing, geoLookup, operator{…}, commercial{model, affiliateLinks, disclosure}, conditionsCheckedAt, calculator{source, sourceUrl, rates}.

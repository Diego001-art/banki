/**
 * Релиз 1: сайт не собирает персональные данные через формы.
 * Здесь — перечень обращений к сторонним сервисам для страницы cookies
 * и для карты данных (docs/privacy-data-map.md).
 */
import { site } from "./content";

export type ThirdParty = { name: string; purpose: string; data: string; when: string; country: string };

export function thirdParties(): ThirdParty[] {
  const list: ThirdParty[] = [];
  if (site.geoLookup)
    list.push(
      { name: "ipapi.co", purpose: "Определение города для подстановки предложений", data: "IP-адрес посетителя (передаётся сервису при запросе)", when: "При первом посещении, если город ещё не выбран", country: "за пределами РФ — требует правовой оценки трансграничной передачи" },
      { name: "ipwho.is", purpose: "Запасной сервис определения города", data: "IP-адрес посетителя", when: "Только если ipapi.co не ответил", country: "за пределами РФ — требует правовой оценки трансграничной передачи" },
    );
  return list;
}

/** Хранилище браузера: только выбранный город. */
export const browserStorage = [{ key: "city", purpose: "Запомнить выбранный город", where: "localStorage этого браузера", expires: "до очистки данных сайта" }];

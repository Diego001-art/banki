import type { ReactNode } from "react";
import { Header } from "./Header";

/** Шапка + содержимое. data-city/data-type читает скрипт страницы. */
export function Shell({ cityName, cityId, children }: { cityName: string; cityId?: string; children: ReactNode }) {
  return (
    <div id="page" data-city={cityId}>
      <Header cityName={cityName} />
      {children}
    </div>
  );
}

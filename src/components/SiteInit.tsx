"use client";
import { useEffect } from "react";

declare global {
  interface Window { __siteReady?: boolean; __initSite?: () => void }
}

/** Запускает скрипт страницы строго после гидратации React, чтобы изменения DOM не конфликтовали с ней. */
export function SiteInit() {
  useEffect(() => {
    window.__siteReady = true;
    window.__initSite?.();
  }, []);
  return null;
}

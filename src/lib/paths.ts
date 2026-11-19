/** Префикс сайта: на GitHub Pages — /banki, на своём домене — пусто. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/banki";

/** Внутренняя ссылка с учётом префикса. Путь всегда со слешем в конце. */
export const href = (path: string) => BASE_PATH + path;
export const asset = (path: string) => BASE_PATH + "/" + path.replace(/^\//, "");

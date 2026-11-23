import type { Metadata, Viewport } from "next";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import "@fontsource/onest/cyrillic-400.css";
import "@fontsource/onest/cyrillic-500.css";
import "@fontsource/onest/cyrillic-600.css";
import "@fontsource/onest/cyrillic-700.css";
import "@fontsource/onest/latin-400.css";
import "@fontsource/onest/latin-500.css";
import "@fontsource/onest/latin-600.css";
import "@fontsource/onest/latin-700.css";
import "@/styles/site.css";
import "@/styles/pages.css";
import { site } from "@/lib/content";
import { BASE_PATH, asset } from "@/lib/paths";
import { organizationLd } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SiteInit } from "@/components/SiteInit";

export const metadata: Metadata = {
  metadataBase: new URL(new URL(site.siteUrl).origin),
  title: { default: "Сравнение кредитов банков России по городам", template: "%s" },
  icons: { icon: asset("logo-bird.svg") },
  robots: site.indexing ? undefined : { index: false, follow: false },
};

/** Адрес скрипта из public/ с версией по содержимому: после выкладки браузер берёт свежий файл, а не старый из кэша. */
function versioned(file: string) {
  const hash = createHash("sha1").update(fs.readFileSync(path.join(process.cwd(), "public", file))).digest("hex").slice(0, 10);
  return asset(file) + "?v=" + hash;
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FFFFFF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-base={BASE_PATH} data-geo={site.geoLookup ? "1" : "0"}>
      <body>
        {children}
        <Footer />
        <JsonLd data={organizationLd()} />
        <SiteInit />
        <script defer src={asset("vendor/gsap.min.js")} />
        <script defer src={asset("vendor/ScrollTrigger.min.js")} />
        <script defer src={versioned("js/offers-render.js")} />
        <script defer src={versioned("js/site.js")} />
      </body>
    </html>
  );
}

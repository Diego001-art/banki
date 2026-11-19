// Копирует GSAP из npm в public/vendor — без внешних CDN (ТЗ, разделы 7 и 8).
import fs from "node:fs";
fs.mkdirSync("public/vendor", { recursive: true });
for (const f of ["gsap.min.js", "ScrollTrigger.min.js"]) fs.copyFileSync("node_modules/gsap/dist/" + f, "public/vendor/" + f);
console.log("vendor: gsap скопирован");

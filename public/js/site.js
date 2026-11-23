/*
 * Поведение страниц: выбор города, вкладки предложений, банки, калькулятор,
 * карусель карт, мобильное меню, анимации. Запускается после гидратации React.
 */
(function () {
  "use strict";
  var started = false;
  function init() {
    if (started) return;
    started = true;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var R = window.OffersRender;
    var BASE = document.documentElement.getAttribute("data-base") || "";
    var page = $("#page") || document.body;
    var CAT = null;
    try { CAT = JSON.parse($("#siteData").textContent); } catch (e) {}
    var TODAY = new Date().toISOString().slice(0, 10);
    var smooth = reduce ? "auto" : "smooth";

    var CITIES = CAT ? CAT.cities.map(function (c) { return { id: c.id, name: c.name, loc: c.nameIn, banner: BASE + "/" + c.banner, re: new RegExp(c.geo, "i") }; }) : [];
    var isCity = function (id) { return CITIES.some(function (c) { return c.id === id; }); };
    var PAGE_CITY = page.getAttribute("data-city");
    var CITY = PAGE_CITY || "moscow";

    /* ── Предложения ── */
    var offers = $("#offers");
    var TYPE = offers ? offers.getAttribute("data-type") || "cash" : "cash";
    var FIXED_BANK = offers ? offers.getAttribute("data-bank") : null;
    var BANK = FIXED_BANK || null;
    var shown = CAT ? CAT.pageSize : 10;

    function renderOffers() {
      if (!offers || !CAT) return;
      $("#offTabs").innerHTML = R.tabs(CAT, CITY, TYPE, BANK, TODAY);
      var l = R.list(CAT, CITY, TYPE, BANK, shown, TODAY);
      $("#bankList").innerHTML = l.html;
      $("#offCount").textContent = l.count;
      $("#moreWrap").hidden = l.rest <= 0;
      $("#moreBtn").textContent = l.more;
      var bf = $("#bankFilter");
      if (BANK && !FIXED_BANK) {
        var b = CAT.lenders.filter(function (x) { return x.id === BANK; })[0];
        $("#bankFilterName").textContent = b ? b.name : "";
        bf.hidden = false;
      } else bf.hidden = true;
    }
    function renderBanks() {
      var g = $("#bankGrid");
      if (g && CAT) g.innerHTML = R.banks(CAT, CITY, BANK, TODAY);
    }
    function setType(id, scroll) {
      if (!CAT || !CAT.types.some(function (t) { return t.id === id; })) return false;
      TYPE = id; shown = CAT.pageSize; renderOffers();
      if (scroll) offers.scrollIntoView({ behavior: smooth });
      return true;
    }
    // страница отдельного продукта (/kredity/<вид>/): вкладки ведут на страницы других продуктов
    var PRODUCT_PAGE = !!(CAT && offers && CAT.types.some(function (t) {
      return location.pathname.replace(/\/+$/, "/").slice(-("/kredity/" + t.slug + "/").length) === "/kredity/" + t.slug + "/";
    }));
    if (offers) {
      $("#offTabs").addEventListener("click", function (e) {
        var b = e.target.closest("[data-type]");
        if (!b) return;
        var id = b.getAttribute("data-type");
        if (PRODUCT_PAGE && id !== TYPE) {
          var t = CAT.types.filter(function (x) { return x.id === id; })[0];
          if (t) { location.href = CAT.base + "/kredity/" + t.slug + "/"; return; }
        }
        setType(id);
      });
      $("#moreBtn").addEventListener("click", function () {
        var from = shown; shown += CAT.pageSize; renderOffers();
        var fresh = $$("#bankList .oc").slice(from, shown);
        if (fresh[0]) fresh[0].querySelector(".oc-go").focus({ preventScroll: true });
        if (window.gsap && !reduce) gsap.from(fresh, { y: 20, opacity: 0, duration: 0.5, stagger: 0.04, ease: "power3.out", clearProps: "transform,opacity" });
      });
      $("#bankFilterX").addEventListener("click", function () { BANK = null; shown = CAT.pageSize; renderOffers(); renderBanks(); });
      // плитки, меню и подвал — обычные ссылки: каждый продукт открывается своей страницей
    }
    var grid = $("#bankGrid");
    if (grid) grid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-bank]");
      if (!b || !CAT) return;
      BANK = b.getAttribute("data-bank");
      if (!R.offersOf(CAT, CITY, TYPE, BANK, TODAY).length) {
        var t = CAT.types.filter(function (t) { return R.offersOf(CAT, CITY, t.id, BANK, TODAY).length; })[0];
        if (t) TYPE = t.id;
      }
      shown = CAT.pageSize; renderOffers(); renderBanks();
      if (offers) offers.scrollIntoView({ behavior: smooth });
    });
    // якоря на разделы этой же страницы: «Банки», «Калькулятор», «Города»
    $$("a[data-anchor]").forEach(function (a) {
      var target = document.getElementById(a.getAttribute("data-anchor"));
      if (!target) return;
      a.addEventListener("click", function (e) { e.preventDefault(); target.scrollIntoView({ behavior: smooth }); });
    });

    /* ── Город ── */
    var select = $("#citySelect"), rail = $("#cityList");
    function setCity(id, remember) {
      var c = CITIES.filter(function (x) { return x.id === id; })[0] || CITIES[0];
      if (!c) return;
      CITY = c.id;
      $$('[data-city="name"]').forEach(function (el) { el.textContent = c.name; });
      $$('[data-city="loc"]').forEach(function (el) { el.textContent = c.loc; });
      if (select) select.value = c.id;
      var hi = $("#heroCityImg");
      if (hi && hi.getAttribute("data-city") !== c.id) {
        hi.setAttribute("data-city", c.id);
        var pre = new Image(); pre.src = c.banner; hi.style.opacity = 0;
        var swap = function () { if (hi.getAttribute("data-city") !== c.id) return; hi.src = c.banner; hi.style.opacity = 1; };
        if (pre.complete) setTimeout(swap, reduce ? 0 : 200); else { pre.onload = swap; pre.onerror = swap; }
      }
      if (rail) $$(".ccard", rail).forEach(function (a) { a.classList.toggle("cur", a.getAttribute("data-id") === c.id); });
      if (remember) { try { localStorage.setItem("city", c.id); } catch (e) {} }
      shown = CAT ? CAT.pageSize : 10;
      renderOffers(); renderBanks();
    }
    if (select) select.addEventListener("change", function () {
      // на странице города выбор другого города ведёт на его страницу
      var c = CAT.cities.filter(function (x) { return x.id === select.value; })[0];
      if (PAGE_CITY && c) { location.href = R.cityUrl(CAT, c); return; }
      setCity(select.value, true); calc();
    });
    if (rail) rail.addEventListener("click", function (e) {
      var a = e.target.closest(".ccard");
      if (a && rail.getAttribute("data-moved") === "1") e.preventDefault();
      if (a) { try { localStorage.setItem("city", a.getAttribute("data-id")); } catch (x) {} }
    });
    var cityBtn = $("#cityBtn");
    if (cityBtn) cityBtn.addEventListener("click", function () {
      var sec = $("#cities");
      if (!sec) { location.href = BASE + "/goroda/"; return; }
      sec.scrollIntoView({ behavior: smooth });
      setTimeout(function () { var s = $("#citySearch"); if (s) s.focus({ preventScroll: true }); }, reduce ? 0 : 700);
    });
    var search = $("#citySearch");
    if (search) search.addEventListener("input", function (e) {
      var q = e.target.value.trim().toLowerCase(), n = 0;
      $$(".ccard", rail).forEach(function (a) { var ok = a.querySelector(".n").textContent.toLowerCase().indexOf(q) > -1; a.style.display = ok ? "" : "none"; if (ok) n++; });
      $("#cityEmpty").hidden = n > 0; rail.scrollLeft = 0;
    });
    if (rail) {
      var step = function () { var c = $(".ccard", rail); return c ? c.getBoundingClientRect().width * 2 + 24 : 400; };
      $("#railPrev").addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: smooth }); });
      $("#railNext").addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: smooth }); });
      (function () {
        var down = false, sx = 0, sl = 0;
        rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.setAttribute("data-moved", "0"); });
        window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) { rail.setAttribute("data-moved", "1"); rail.classList.add("drag"); } rail.scrollLeft = sl - dx; });
        window.addEventListener("pointerup", function () { if (!down) return; down = false; rail.classList.remove("drag"); setTimeout(function () { rail.setAttribute("data-moved", "0"); }, 50); });
      })();
    }

    /* ── Калькулятор: среднерыночная ПСК Банка России ── */
    var calcBox = $(".calc[data-rates]"), cP = $("#cProduct"), cA = $("#cAmount"), cT = $("#cTerm");
    var RATES = {};
    try { RATES = JSON.parse(calcBox.getAttribute("data-rates")); } catch (e) {}
    var rub = function (n) { return Math.round(n).toLocaleString("ru-RU") + " ₽"; };
    var pct = function (n) { return n.toFixed(1).replace(".", ",") + "%"; };
    function amount() { var v = parseInt(String(cA.value).replace(/\D/g, ""), 10); return isNaN(v) ? 0 : v; }
    function psk(kind, a) {
      var rows = RATES[kind] || [];
      for (var i = 0; i < rows.length; i++) if (rows[i][0] == null || a <= rows[i][0]) return [rows[i][1], rows[i][2]];
      return [0, 0];
    }
    function calc() {
      if (!calcBox) return;
      var a = amount(), bad = a && (a < 10000 || a > 100000000);
      $("#cHint").textContent = bad ? (a < 10000 ? "Минимальная сумма — 10 000 ₽" : "Максимальная сумма — 100 000 000 ₽") : "";
      if (bad) a = 0;
      var m = +cT.value, r = psk(cP.value, a), avg = r[0], i = avg / 100 / 12;
      var pay = a ? a * i / (1 - Math.pow(1 + i, -m)) : 0, over = pay * m - a;
      $("#oRate").textContent = "≈" + pct(avg);
      $("#oPay").textContent = a ? rub(pay) : "—";
      $("#oOver").textContent = a ? rub(over) : "—";
      $("#maxRate").textContent = pct(r[1]);
    }
    if (calcBox) {
      cA.addEventListener("input", function () { var a = amount(); cA.value = a ? a.toLocaleString("ru-RU") : ""; calc(); });
      cA.addEventListener("blur", function () { var a = amount(); cA.value = a ? rub(a) : ""; });
      cP.addEventListener("change", calc); cT.addEventListener("change", calc);
      calc();
    }

    /* ── Карусель карт ── */
    var stage = $("#stage");
    if (stage) {
      var cards = $$(".bcard", stage), n = cards.length, active = 0, timer = null, dragging = false;
      var POS = [
        { t: "translate3d(0,0,0) rotate(-5deg) scale(1)", z: 3, f: "none", o: 1 },
        { t: "translate3d(16%,20%,-60px) rotate(1deg) scale(.9)", z: 2, f: "brightness(.86)", o: 1 },
        { t: "translate3d(31%,40%,-120px) rotate(7deg) scale(.8)", z: 1, f: "brightness(.72)", o: 0.96 },
      ];
      var layout = function () {
        cards.forEach(function (c, i) {
          var rel = (i - active + n) % n, p = POS[rel];
          c.style.setProperty("--pos", p.t); c.style.zIndex = p.z; c.style.filter = p.f; c.style.opacity = p.o;
        });
      };
      var go = function (i) { active = (i + n) % n; layout(); };
      var auto = function (on) { clearInterval(timer); timer = null; if (on && !reduce) timer = setInterval(function () { go(active + 1); }, 5000); layout(); };
      stage.addEventListener("mouseenter", function () { auto(false); });
      stage.addEventListener("mouseleave", function () { var c = cards[active]; c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); c.classList.remove("tilting"); auto(true); });
      stage.addEventListener("mousemove", function (e) {
        if (reduce || dragging) return;
        var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5, c = cards[active];
        cards.forEach(function (o) { if (o !== c) { o.classList.remove("tilting"); o.style.setProperty("--rx", "0deg"); o.style.setProperty("--ry", "0deg"); } });
        c.classList.add("tilting"); c.style.setProperty("--ry", (x * 10).toFixed(2) + "deg"); c.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
      });
      var sx = 0, dx = 0;
      stage.addEventListener("pointerdown", function (e) { dragging = true; sx = e.clientX; dx = 0; stage.classList.add("dragging"); if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId); });
      stage.addEventListener("pointermove", function (e) { if (!dragging) return; dx = e.clientX - sx; cards[active].style.setProperty("--drag", dx + "px"); });
      var end = function () { if (!dragging) return; dragging = false; stage.classList.remove("dragging"); cards[active].style.setProperty("--drag", "0px"); if (Math.abs(dx) > 50) { go(active + (dx < 0 ? 1 : -1)); auto(true); } };
      stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
      auto(true);
    }

    /* ── Мобильное меню ── */
    var burger = $("#burger"), mnav = $("#mnav"), topEl = $("#top");
    if (burger && mnav) {
      var menu = function (open) {
        topEl.classList.toggle("open", open); mnav.classList.toggle("open", open); document.body.classList.toggle("menu-open", open);
        burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню"); mnav.setAttribute("aria-hidden", !open);
        if (open) { var f = mnav.querySelector("a"); if (f) f.focus({ preventScroll: true }); }
      };
      burger.addEventListener("click", function () { menu(!mnav.classList.contains("open")); });
      $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
      $("#mCity").addEventListener("click", function () { menu(false); if (cityBtn) cityBtn.click(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mnav.classList.contains("open")) { menu(false); burger.focus(); } });
      window.addEventListener("resize", function () { if (window.innerWidth > 1080 && mnav.classList.contains("open")) menu(false); });
    }

    /* ── Анимации ── */
    if (window.gsap && window.ScrollTrigger && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      // на главной блок с заголовком стоит в середине страницы: его анимация стартует, когда он появляется на экране
      var heroMid = $(".hero-mid");
      var tl = gsap.timeline({ defaults: { ease: "power4.out" }, scrollTrigger: heroMid ? { trigger: heroMid, start: "top 80%", once: true } : undefined }).from("h1 .ln>span", { yPercent: 110, duration: 1, stagger: 0.1 });
      var heroBits = heroMid ? ".hero-mid [data-hero]:not(.deck)" : "[data-hero]:not(.deck)";
      if ($$(heroBits).length) tl.from(heroBits, { y: 20, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: "transform,opacity" }, "-=.7");
      if (heroMid && $(".hero-tiles [data-hero]")) gsap.from(".hero-tiles [data-hero]", { y: 20, opacity: 0, duration: 0.8, ease: "power4.out", clearProps: "transform,opacity" });
      if (stage) tl.from(".bcard", { x: 160, y: -140, rotation: -24, opacity: 0, duration: 1.3, stagger: { each: 0.14, from: "end" }, ease: "expo.out", clearProps: "transform,opacity" }, 0.1);
      if ($(".tile")) {
        var tiles = { y: 30, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.out", clearProps: "transform,opacity" };
        if (heroMid) gsap.from(".tile", tiles); else tl.from(".tile", tiles, "-=.6");
      }
      var hc = $(".hero-city");
      // параллакс фото — только когда блок открывает страницу; в середине страницы он сдвигал фото и оголял верх блока
      if (hc && !heroMid) gsap.to(hc, { yPercent: 10, ease: "none", scrollTrigger: { trigger: hc.closest(".hero"), start: "top top", end: "bottom top", scrub: true } });
      $$("[data-reveal]").forEach(function (el) { gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }); });
      if ($("#bankList")) ScrollTrigger.create({ trigger: "#bankList", start: "top 88%", once: true, onEnter: function () { gsap.from("#bankList .oc:not([hidden])", { y: 20, opacity: 0, duration: 0.6, stagger: 0.04, ease: "power3.out", clearProps: "transform,opacity" }); } });
      if (grid) ScrollTrigger.create({ trigger: "#bankGrid", start: "top 90%", once: true, onEnter: function () { gsap.from("#bankGrid .bt", { y: 20, opacity: 0, duration: 0.5, stagger: 0.025, ease: "power3.out", clearProps: "transform,opacity" }); } });
      if (rail) ScrollTrigger.create({ trigger: "#cityList", start: "top 90%", once: true, onEnter: function () { gsap.from("#cityList .ccard", { x: 60, opacity: 0, duration: 0.8, stagger: 0.04, ease: "power3.out", clearProps: "transform,opacity" }); } });
    }

    /* ── Начальный город ── */
    if (!CAT) return;
    // страница города запоминает город: со страницы Петербурга ссылки на продукты откроются для Петербурга
    if (PAGE_CITY && isCity(PAGE_CITY)) { setCity(PAGE_CITY, true); return; }
    if (!$("[data-city]")) return; // на странице нет блоков, зависящих от города
    var saved = null;
    try { saved = localStorage.getItem("city"); } catch (e) {}
    if (saved && isCity(saved)) { setCity(saved); calc(); return; }
    setCity("moscow"); // по умолчанию и для иностранных IP — Москва
    if (document.documentElement.getAttribute("data-geo") !== "1") return;
    // Город по IP: ipapi.co, запасной — ipwho.is (см. страницу cookies). Без переадресации.
    function geo(url, map) { return fetch(url, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) { var g = map(d); if (!g || !g.cc) throw new Error("geo"); return g; }); }
    geo("https://ipapi.co/json/", function (d) { return d && !d.error ? { cc: d.country_code, city: d.city, region: d.region } : null; })
      .catch(function () { return geo("https://ipwho.is/", function (d) { return d && d.success !== false ? { cc: d.country_code, city: d.city, region: d.region } : null; }); })
      .then(function (g) {
        if (String(g.cc).toUpperCase() !== "RU") return;
        var hay = [g.city, g.region].filter(Boolean).join(" ");
        var c = CITIES.filter(function (x) { return x.re.test(g.city || ""); })[0] || CITIES.filter(function (x) { return x.re.test(hay); })[0];
        if (c) { setCity(c.id); calc(); }
      })
      .catch(function () {});
  }
  if (window.__siteReady) init();
  else window.__initSite = init;
})();

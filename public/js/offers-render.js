/*
 * Отрисовка предложений, банков и городов.
 * Один и тот же код используется при сборке страниц (HTML для поисковиков)
 * и в браузере при смене города/вида продукта — разметка всегда совпадает.
 */
(function (root) {
  "use strict";
  var esc = function (t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  function plural(n, a, b, c) { var m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; }
  function dateRu(iso) { return iso ? iso.split("-").reverse().join(".") : ""; }
  function find(arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; }

  function place(cat, cityId) {
    var c = find(cat.cities, cityId) || cat.cities[0];
    var r = find(cat.regions, c.regionId) || {};
    return { city: c.id, region: r.id || "", district: r.districtId || "" };
  }
  function available(o, pl, today) {
    if (o.validUntil && today && o.validUntil < today) return false;
    if (o.regionIds.indexOf("*") < 0 && o.regionIds.indexOf(pl.region) < 0) return false;
    var h = o.hidden;
    return !(h.cities.indexOf(pl.city) > -1 || h.regions.indexOf(pl.region) > -1 || h.districts.indexOf(pl.district) > -1);
  }
  function offersOf(cat, cityId, type, bankId, today) {
    var pl = place(cat, cityId), out = [];
    cat.offers.forEach(function (o) {
      if (o.type !== type) return;
      if (bankId && o.lenderId !== bankId) return;
      if (!find(cat.lenders, o.lenderId)) return;
      if (available(o, pl, today)) out.push(o);
    });
    out.sort(function (a, b) { return a.sort - b.sort; });
    return out;
  }
  function thumb(l, base) {
    return l.logo
      ? '<span class="oc-thumb logo" aria-hidden="true"><img src="' + esc(/^(https?:|data:)/.test(l.logo) ? l.logo : base + "/" + l.logo) + '" alt=""></span>'
      : '<span class="oc-thumb" style="--c1:' + esc(l.c1) + ";--c2:" + esc(l.c2) + '" aria-hidden="true"><b>' + esc(l.name) + "</b><i></i></span>";
  }
  function tabs(cat, cityId, type, bankId, today) {
    return cat.types.map(function (t) {
      var n = offersOf(cat, cityId, t.id, bankId, today).length, on = t.id === type;
      return '<button type="button" class="chip' + (on ? " on" : "") + '" role="tab" aria-selected="' + on + '" data-type="' + t.id + '">' + esc(t.name) + (n ? " <i>" + n + "</i>" : "") + "</button>";
    }).join("");
  }
  function row(cat, o, l, t, hidden, base) {
    var mets, go, tags = [];
    if (o) {
      var have = o.metrics.some(function (m) { return m[1]; });
      mets = have
        ? '<div class="oc-mets">' + o.metrics.map(function (m) {
            return '<div class="oc-m"><span>' + esc(m[0]) + "</span><b>" + (m[1] ? esc(m[1]) : "—") + "</b>" + (m[2] ? "<small>" + esc(m[2]) + "</small>" : "") + "</div>";
          }).join("") + "</div>"
        : '<div class="oc-note">Условия — на сайте банка</div>';
      var href = o.affiliateUrl || o.url || l.url;
      go = '<a class="pill pill-ink oc-go" href="' + esc(href) + '" target="_blank" rel="noopener' + (o.affiliateUrl ? " sponsored" : "") + '">Перейти на сайт банка</a>';
      if (o.affiliateUrl) tags.push('<span class="hl">Партнёрская ссылка</span>');
      if (o.checkedAt) tags.push("<span>Проверено " + dateRu(o.checkedAt) + "</span>");
      if (o.sourceUrl) tags.push('<a class="tag-link" href="' + esc(o.sourceUrl) + '" target="_blank" rel="noopener nofollow">Источник ↗</a>');
      o.tags.forEach(function (x) { tags.push("<span>" + esc(x) + "</span>"); });
      tags.push("<span>Сайт: " + esc(l.domain) + "</span>");
    } else {
      mets = '<div class="oc-note">Условия и ставки — на сайте ' + esc(l.domain) + "</div>";
      go = '<a class="pill pill-ink oc-go" href="' + esc(l.url) + '" target="_blank" rel="noopener">На сайт банка</a>';
    }
    return '<article class="oc"' + (hidden ? " hidden" : "") + '><div class="oc-main">' + thumb(l, base) +
      '<div class="oc-id"><h3>' + esc(o ? o.name : l.name) + "</h3><p>" + esc(o ? l.name : t.one) + "</p></div>" + mets + go +
      '</div><div class="oc-tags">' + tags.join("") + "</div></article>";
  }
  /** Список предложений. Если условий ещё нет — список банков со ссылкой на их сайт. */
  function list(cat, cityId, type, bankId, shown, today) {
    var t = find(cat.types, type) || cat.types[0], items = offersOf(cat, cityId, t.id, bankId, today), fallback = false, rows = [];
    if (items.length) {
      items.forEach(function (o, n) { rows.push(row(cat, o, find(cat.lenders, o.lenderId), t, n >= shown, cat.base)); });
    } else {
      fallback = true;
      var pl = place(cat, cityId), ls = [];
      cat.lenders.forEach(function (l) {
        if (bankId && l.id !== bankId) return;
        var own = cat.offers.filter(function (o) { return o.lenderId === l.id && o.type === t.id; });
        if (own.length && own.every(function (o) { return !available(o, pl, today); })) return;
        ls.push(l);
      });
      ls.forEach(function (l, n) { rows.push(row(cat, null, l, t, n >= shown, cat.base)); });
    }
    var total = rows.length, rest = total - shown;
    return {
      html: total ? rows.join("") : '<div class="empty-box">В этом городе пока нет предложений этого вида. Посмотрите другие продукты.</div>',
      count: fallback ? (total ? "Банков: " + total : "") : "Найдено " + total + " " + plural(total, "предложение", "предложения", "предложений"),
      rest: rest,
      more: "Показать ещё " + Math.min(rest, cat.pageSize),
    };
  }
  function banks(cat, cityId, bankId, today) {
    var pl = place(cat, cityId);
    return cat.lenders.map(function (l) {
      var n = cat.offers.filter(function (o) { return o.lenderId === l.id && available(o, pl, today); }).length;
      return '<button type="button" class="bt' + (bankId === l.id ? " on" : "") + '" data-bank="' + l.id + '">' +
        (l.logo ? '<span class="mini logo"><img src="' + esc(cat.base + "/" + l.logo) + '" alt=""></span>' : '<span class="mini" style="--c1:' + esc(l.c1) + ";--c2:" + esc(l.c2) + '"></span>') +
        "<span><b>" + esc(l.name) + "</b><small>" + (n ? n + " " + plural(n, "предложение", "предложения", "предложений") : "Перейти к банку") + "</small></span></button>";
    }).join("");
  }
  function cityUrl(cat, c) { var r = find(cat.regions, c.regionId); return cat.base + "/goroda/" + r.slug + "/" + c.slug + "/"; }
  function rail(cat, cur) {
    return cat.cities.map(function (c) {
      return '<a href="' + esc(cityUrl(cat, c)) + '" class="ccard' + (c.id === cur ? " cur" : "") + '" data-id="' + c.id + '" draggable="false"><img src="' + esc(cat.base + "/" + c.thumb) + '" alt="" loading="lazy" draggable="false"><span class="n">' + esc(c.name) + '</span><span class="k">Кредиты в ' + esc(c.nameIn) + "</span></a>";
    }).join("");
  }
  var api = { esc: esc, plural: plural, offersOf: offersOf, tabs: tabs, list: list, banks: banks, rail: rail, cityUrl: cityUrl, place: place };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.OffersRender = api;
})(typeof self !== "undefined" ? self : this);

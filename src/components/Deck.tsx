const WAVES = <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8.5 7.5a6 6 0 0 1 0 9M12 5a9.5 9.5 0 0 1 0 14M15.5 2.8a13 13 0 0 1 0 18.4" /></svg>;
const CARDS = [["b-alfa", "Альфа-Банк", "1990"], ["b-sber", "Сбербанк", "1841"], ["b-tbank", "Т-Банк", "2006"]];

/** Карусель карт на первом экране. Это декоративная иллюстрация, а не предложение банка. */
export function Deck() {
  return (
    <div className="deck" aria-roledescription="карусель" aria-label="Иллюстрация: банковские карты" data-hero>
      <div className="stage" id="stage">
        {CARDS.map(([cls, name, num]) => (
          <div className={"bcard " + cls} aria-hidden="true" key={cls}>
            <div className="bc-art"></div>
            <div className="bc-in">
              <div className="bc-row"><span className="bc-name">{name}</span>{WAVES}</div>
              <div className="bc-chip"></div>
              <div className="bc-num">•••• •••• •••• {num}</div>
              <div className="bc-foot"><span className="bc-prod">Наличными</span><span className="bc-rate">≈29,3%</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

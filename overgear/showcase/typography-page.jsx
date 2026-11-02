// The Typography page of the Overgear showcase: the font, its weights, and the scale of the system set in it (without the colors of text).
import { Collapsible } from '../../src/components/Collapsible.jsx';

// the three weights of the family: Regular 400, Mittel 500 (Semi-Bold), Fett 700 (Bold)
const WEIGHTS = [[400, 'Regular'], [500, 'Mittel'], [700, 'Fett']];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 &?!@#%€$ ()[]{}';
const HEADER_SETTING = 'Save your time getting items, currency and skills';
const TEXT_SETTING = 'Good typography makes a page easy to read. Lines are short enough to follow, the leading gives each line room, and the size says what matters. Numbers such as 0123456789 line up, and a long word like internationalization still fits.';

const HEADERS = [48, 40, 32, 28, 24, 20].map((n) => ({ id: `Header-${n}`, label: `Header ${n}`, token: `typography-header-${n}`, para: `typography-paragraph-Header-${n}` }));
const TEXTS = [['20', 'Semi-Bold'], ['20', 'Regular'], ['16', 'Bold'], ['16', 'Semi-Bold'], ['16', 'Regular'], ['14', 'Bold'], ['14', 'Semi-Bold'], ['14', 'Regular'], ['12', 'Semi-Bold'], ['12', 'Regular']].map(([n, w]) => ({ id: `Text-${n}-${w}`, label: `Text ${n} ${w.replace('-', ' ')}`, token: `typography-text-${n}-${w}`, para: `typography-paragraph-${n}` }));

const valueOf = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--baseui-${name}`).trim().replace(/\s+/g, ' ');

function Style({ item, setting, header }) {
  const spec = (valueOf(item.token).match(/^\d+ \d+px \/ \d+px/) || [''])[0];
  const para = valueOf(item.para);
  return (
    <Collapsible
      className="ov-type-row"
      title={
        <span className="ov-type-head">
          <span className="ov-type-sample" style={{ font: `var(--baseui-${item.token})` }}>{item.label}</span>
          <span className="ov-type-meta"><span className="ov-type-name">{item.id}</span><span className="ov-note">{spec}</span></span>
        </span>
      }
    >
      <div className="ov-type-setting" style={{ font: `var(--baseui-${item.token})`, '--para': para || '0px' }}>
        <p>{setting}</p>
        {para && <p>{header ? 'Pack my box with five dozen liquor jugs' : 'A second paragraph follows after the paragraph spacing of this size, so the two read as separate thoughts of one text'}</p>}
      </div>
      <p className="ov-note">{`var(--baseui-${item.token})${para ? `, paragraph spacing ${para}` : ''}`}</p>
    </Collapsible>
  );
}

export function Typography() {
  return (
    <>
      <section className="ov-section">
        <h3 className="ov-h2">Apfel Grotezk</h3>
        <div className="ov-mode" style={{ background: 'var(--baseui-background-primary)' }}>
          <p className="ov-type-big" aria-label="Aa">Aa</p>
          <p className="ov-type-alphabet">{ALPHABET}</p>
          <div className="ov-type-weights">
            {WEIGHTS.map(([w, name]) => (
              <div key={w} className="ov-type-weight">
                <span style={{ fontWeight: w, fontSize: 32, lineHeight: '36px' }}>Gold, boosts and leveling</span>
                <span className="ov-note">{`${w}: ${name}`}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="ov-section">
        <h3 className="ov-h2">Headers</h3>
        <div className="ov-type-list">{HEADERS.map((h) => <Style key={h.id} item={h} setting={HEADER_SETTING} header />)}</div>
      </section>
      <section className="ov-section">
        <h3 className="ov-h2">Text</h3>
        <div className="ov-type-list">{TEXTS.map((t) => <Style key={t.id} item={t} setting={TEXT_SETTING} />)}</div>
      </section>
    </>
  );
}

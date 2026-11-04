// The local theme of Overgear: the settings that shape the corners, the motion and the surfaces. They live in their own cookie, so
// the documentation site keeps its theme and Overgear (the showcase and the example) keeps this one.
import { useState, useEffect } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { ButtonGroup } from '../../src/components/ButtonGroup.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Card } from '../../src/components/Card.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Slider } from '../../src/components/Slider.jsx';
import { SegmentedControl } from '../../src/components/SegmentedControl.jsx';
import { TokenGroup } from '../../src/components/TokenGroup.jsx';
import { Tabs } from '../../src/components/Tabs.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { Selector } from '../../src/components/Selector.jsx';
import { saveTheme, loadTheme, DEFAULT, MOTION_OPTIONS, BRAND_OPTIONS } from '../../site/theme.js';
import { AUDIENCES, AUDIENCE_DEFAULT, audienceOf } from '../audience.js';
import { COOKIE, LOCAL_DEFAULT, TINT_DEFAULT, FONTS, FONTS_DEFAULT, applyOvergearTheme } from '../theme.js';

// Overgear starts from the default of the system with the enhanced animations; the brand stays the default one (white in the dark theme)
const START = { ...DEFAULT, motion: 'enhanced', tint: TINT_DEFAULT, fonts: FONTS_DEFAULT, audience: AUDIENCE_DEFAULT, local: { ...LOCAL_DEFAULT } };
const seg = (values) => values.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

function Row({ title, hint, children }) {
  return (
    <div className="ov-setting">
      <div className="ov-setting__text">
        <span className="ov-setting__title">{title}</span>
        <span className="ov-note ov-setting__caption">{hint}</span>
      </div>
      <div className="ov-setting__control">{children}</div>
    </div>
  );
}

export function Theme() {
  const [theme, setTheme] = useState(() => loadTheme(COOKIE));
  const set = (patch) => setTheme((t) => ({ ...t, ...patch }));
  const local = { ...LOCAL_DEFAULT, ...theme.local };
  const setLocal = (patch) => set({ local: { ...local, ...patch } });
  const onOff = (v) => (v ? 'on' : 'off');
  useEffect(() => {
    applyOvergearTheme(theme);
    saveTheme(theme, COOKIE);
  }, [JSON.stringify(theme)]);
  return (
    <>
      <section className="ov-section">
        <div className="ov-section__head">
          <h3 className="ov-h2">Settings</h3>
          <p className="ov-note">They apply at once to this showcase and to the example, and are kept on this device. The documentation site has its own theme</p>
        </div>
        <div className="ov-settings">
          <Row title="Font" hint="The heading font and the text font together. TT Interphases Pro is the font of the live site (linked from the overgear repository) and comes first; the rest are in alphabetical order: Apfel Grotezk, the font of this showcase, and the sans-serif fonts of the catalogue uncut.wtf that are under the SIL OFL (some are in this repository, some are loaded from Fontsource when chosen)">
            <Selector label="Font" options={FONTS.map(([value, label]) => ({ value, label }))} value={FONTS.some(([key]) => key === theme.fonts) ? theme.fonts : FONTS_DEFAULT} onValueChange={(fonts) => set({ fonts })} />
          </Row>
          <Row title="Shape" hint="Buttons, fields and tags: rounded by the radius, or pills">
            <SegmentedControl label="Shape" items={seg(['rounded', 'circle'])} value={theme.shape} onValueChange={(shape) => set({ shape })} />
          </Row>
          <Row title="Radius" hint="The base radius in px; every radius token scales from it, 0 is square">
            <Slider label="Radius" showValue min={0} max={24} step={2} value={theme.radius} onValueChange={(radius) => set({ radius })} />
          </Row>
          <Row title="Animation" hint="Off: nothing moves. Basic: simple transitions. Enhanced: highlights slide, menus grow from their trigger">
            <SegmentedControl label="Animation" items={seg(MOTION_OPTIONS)} value={theme.motion} onValueChange={(motion) => set({ motion })} />
          </Row>
          <Row title="Blue cast" hint="How much blue the grays of the dark theme carry, in five steps: 1 is neutral gray, 5 is the deep navy of overgear.com. The accent blue does not change">
            <SegmentedControl label="Blue cast" items={['1', '2', '3', '4', '5'].map((v) => ({ value: v, label: v }))} value={String((theme.tint ?? TINT_DEFAULT) + 1)} onValueChange={(v) => set({ tint: Number(v) - 1 })} />
          </Row>
          <Row title="Brand" hint="The color of primary buttons and of the current step; the default is white in the dark theme. Custom takes any color">
            <TokenGroup aria-label="Brand" options={seg(BRAND_OPTIONS)} value={[BRAND_OPTIONS.includes(theme.brand) ? theme.brand : 'default']} onValueChange={(v) => v[0] && set({ brand: v[0] })} />
          </Row>
          {theme.brand === 'custom' && (
            <Row title="Brand color" hint="Your own color for the brand: primary buttons and the current step">
              <TextInput type="color" label="Brand color" value={theme.brandColor || DEFAULT.brandColor} onChange={(e) => set({ brandColor: e.target.value })} />
            </Row>
          )}
        </div>
        <ButtonGroup><Button variant="secondary" label="Reset" onClick={() => setTheme({ ...START })} /></ButtonGroup>
      </section>
      <section className="ov-section">
        <div className="ov-section__head">
          <h3 className="ov-h2">Audience</h3>
          <p className="ov-note">Who the home page of the example is made for. The game of the audience leads: its tile is the first and its products come first in the listing; the other games follow as usual. The example reads it when it opens</p>
        </div>
        <div className="ov-settings">
          <Row title="Audience" hint="All players is the example as it is. World of Warcraft and the three games with the most content now are audiences of their own: a player of Diablo 4 has Diablo 4 first, a player of World of Warcraft has World of Warcraft first">
            <Selector label="Audience" options={AUDIENCES.map(([value, label]) => ({ value, label }))} value={audienceOf(theme)} onValueChange={(audience) => set({ audience })} />
          </Row>
        </div>
      </section>
      <section className="ov-section">
        <div className="ov-section__head">
          <h3 className="ov-h2">Elements with settings of their own</h3>
          <p className="ov-note">These elements keep their own floating, glass and blur: the theme has none of its own. Switch one off and it is plain</p>
        </div>
        <div className="ov-settings">
          <Row title="Bottom bar" hint="Floating, with glass: separate rounded pieces over a blurred gradient">
            <Switch label="Own settings" checked={local.bottombar} onCheckedChange={(bottombar) => setLocal({ bottombar })} />
          </Row>
          <Row title="Dropdowns" hint="Glass: the menus of dropdowns are translucent and blurred">
            <Switch label="Own settings" checked={local.dropdowns} onCheckedChange={(dropdowns) => setLocal({ dropdowns })} />
          </Row>
          <Row title="Header" hint="Blur: the page fades out and blurs under the header as it scrolls, on a desktop and on a phone. Off, the header is solid">
            <Switch label="Own settings" checked={local.header} onCheckedChange={(header) => setLocal({ header })} />
          </Row>
        </div>
      </section>
      <section className="ov-section">
        <h3 className="ov-h2">Preview</h3>
        <div className="ov-mode">
          <div className="ov-row">
            <Button variant="primary" label="Primary" />
            <Button variant="secondary" label="Secondary" />
            <Button variant="ghost" label="Ghost" />
            <Badge variant="primary" label="Badge" />
            <Badge label="Secondary" />
          </div>
          <div className="ov-row">
            <div style={{ width: 240 }}><TextInput label="Search" defaultValue="" /></div>
            <SegmentedControl label="Range" items={seg(['day', 'week', 'month'])} defaultValue="week" />
          </div>
          <Tabs label="Sections" items={[{ value: 'a', label: 'Overview' }, { value: 'b', label: 'Activity' }, { value: 'c', label: 'Settings' }]} />
          <Card variant="surface" padding={4}><span className="ov-note">A card with a surface</span></Card>
        </div>
      </section>
    </>
  );
}

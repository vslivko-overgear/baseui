import { h, useEffect } from '../react.js';
import { describe } from '../doc.js';
import { Button } from '../components/Button.js';
import { SegmentedControl } from '../components/SegmentedControl.js';
import { Tabs, TabList, Tab } from '../components/Tabs.js';
import { Badge } from '../components/Badge.js';
import { Progress, PhoneDemo } from './_preview.js';
import { TextField, Switch, Chip } from '../base.js';
import { Plus } from '../stories/_ui.js';
import { applyTheme, saveTheme, loadTheme, DEFAULT, PRESETS, PRESET_OPTIONS, MOTION_OPTIONS, BRAND_OPTIONS, HEADLINE_FONTS, TEXT_FONTS } from '../../site/theme.js';

/** Everything the settings change, shown at once. Any change is applied to the whole site and kept in a cookie. */
export function ThemePreview(theme) {
  useEffect(() => { applyTheme(theme); saveTheme(theme); }, [JSON.stringify(theme)]);
  const items = [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }];
  const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--baseui-spacing-12)', alignItems: 'center' };
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-24)', width: '100%' } },
    h('div', null,
      h('div', { style: { font: 'var(--baseui-Typography-Header-32)' } }, 'Headline font'),
      h('p', { style: { margin: '8px 0 0', font: 'var(--baseui-Typography-Text-16-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' } }, 'The quick brown fox jumps over the lazy dog. Съешь же ещё этих мягких французских булок.')),
    h('div', { style: row }, h(Button, { variant: 'primary', label: 'Primary' }), h(Button, { label: 'Secondary' }), h(Button, { variant: 'ghost', label: 'Ghost' }), h(Button, { isIconOnly: true, label: 'Add', icon: h(Plus, { size: 24 }) })),
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--baseui-spacing-16)', alignItems: 'flex-start' } },
      h('div', { style: { width: 240 } }, h(TextField, { label: 'Email', defaultValue: 'name@example.com' })),
      h(SegmentedControl, { items, defaultValue: 'week', label: 'Range' })),
    h(Tabs, { defaultValue: 'a' }, h(TabList, { label: 'Sections' }, h(Tab, { value: 'a', counter: 4 }, 'Overview'), h(Tab, { value: 'b' }, 'Activity'), h(Tab, { value: 'c' }, 'Settings'))),
    h('div', { style: row }, h(Chip, { size: 'sm' }, 'Token'), h(Badge, { variant: 'primary', label: 'Primary' }), h(Badge, { label: 'Secondary' }), h(Badge, { variant: 'success', label: 'Success' }), h(Switch, { size: 'sm', label: 'Notifications', defaultChecked: true })),
    h(Progress, null),
    h(PhoneDemo, null));
}
describe(ThemePreview, 'The theme of this site and of your own app: the settings are applied at once and stored in a cookie on this device.', {
  preset: ["'default' | 'ocean' | 'forest' | 'sunset' | 'berry' | 'graphite' | 'custom'", "'default'", 'A ready set of the settings below; changing any of them switches it to custom'],
  brand: ["'default' | 'blue' | 'green' | 'pink' | 'orange' | 'red' | 'blue-light' | 'green-light' | 'custom'", "'default'", 'Brand color: primary buttons, the slider, the current step and page. default is black in the light theme and white in the dark one'],
  brandColor: ['string', "'#575df6'", 'Your own brand color, any CSS color (with brand: custom)'],
  shape: ["'rounded' | 'circle'", "'rounded'", 'rounded follows the base radius; circle makes buttons, fields, tokens and segmented controls pills (`data-shape` on `<html>`)'],
  radius: ['number', '12', 'Base radius in px: every radius token (4 to 32) scales from it; 0 makes square corners'],
  headingFont: ["'Geist' | 'Unbounded' | 'Montserrat Alternates' | …", "'Geist'", 'Font of the headings (`--baseui-Typography-Headline-Font-Family`); Google Fonts with Cyrillic'],
  textFont: ["'Geist' | 'Inter' | 'Manrope' | …", "'Geist'", 'Font of all other text (`--baseui-Typography-Font-Family`); Google Fonts with Cyrillic'],
  motion: ["'off' | 'basic' | 'enhanced'", "'basic'", 'off: nothing moves (loading indicators still run); basic (the default): simple transitions, the highlight of a tab, segment or bar item appears in its new place with a fade; enhanced: the highlight slides there, plus presses, lifts and the hover nudge of the tab underline (`data-motion` on `<html>`)'],
  floating: ['boolean', 'false', 'Bars and panels float above the content: rounded, inset, with a shadow (`data-floating` on `<html>`; the Navbar and Bottom Bar follow it)'],
  glass: ['boolean', 'false', 'Translucent, blurred surfaces for bars, menus, dialogs and toasts (`data-glass` on `<html>`)'],
});

const custom = { preset: 'custom' };
const meta = {
  title: 'Theming/Theme Settings', component: ThemePreview,
  parameters: { docs: { description: { component: ThemePreview.__docgenInfo.description } } },
  argTypes: {
    preset: { control: 'select', options: PRESET_OPTIONS, derive: (v) => (PRESETS[v] ? { ...PRESETS[v] } : null) },
    brand: { control: 'select', options: BRAND_OPTIONS, derive: () => custom },
    brandColor: { control: 'color', if: { arg: 'brand', eq: 'custom' }, derive: () => custom },
    shape: { control: 'inline-radio', options: ['rounded', 'circle'], derive: () => custom },
    radius: { control: { type: 'range', min: 0, max: 24, step: 2 }, derive: () => custom },
    headingFont: { control: 'select', options: Object.keys(HEADLINE_FONTS), derive: () => custom },
    textFont: { control: 'select', options: Object.keys(TEXT_FONTS), derive: () => custom },
    motion: { control: 'inline-radio', options: MOTION_OPTIONS, derive: () => custom },
    floating: { control: 'boolean', derive: () => custom },
    glass: { control: 'boolean', derive: () => custom },
  },
  // What a click on Reset restores: the default theme, also in the cookie.
  onReset: () => { applyTheme(DEFAULT); saveTheme({ ...DEFAULT, preset: 'default' }); },
};
// The settings start from the stored theme.
Object.defineProperty(meta, 'args', { get: () => loadTheme(), enumerable: true });
export default meta;
export const Playground = { parameters: { docs: { source: { originalSource: `// Set the tokens on <html>, or pick the settings on this page
document.documentElement.style.setProperty('--baseui-Background-Brand', '#575df6');
document.documentElement.dataset.shape = 'circle';` } } }, render: (args) => h(ThemePreview, args) };
export const __namedExportsOrder = ['Playground'];

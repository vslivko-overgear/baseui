import { useEffect } from '../react.js';
import { describe } from '../doc.js';
import { Button, IconButton } from '../components/Button.jsx';
import { SegmentedControl } from '../components/SegmentedControl.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { Badge } from '../components/Badge.jsx';
import { Progress, PhoneDemo } from './_preview.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Switch } from '../components/Switch.jsx';
import { Token } from '../components/Token.jsx';
import { Plus } from '../stories/_ui.jsx';
import { Card } from '../components/Card.jsx';
import {
  applyTheme,
  saveTheme,
  loadTheme,
  DEFAULT,
  PRESETS,
  PRESET_OPTIONS,
  MOTION_OPTIONS,
  BRAND_OPTIONS,
  HEADLINE_FONTS,
  TEXT_FONTS,
} from '../../site/theme.js';

/** Everything the settings change, shown at once. Any change is applied to the whole site and kept in a cookie. */
export function ThemePreview(theme) {
  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [JSON.stringify(theme)]);
  const items = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];
  const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--bui-spacing-3)', alignItems: 'center' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bui-spacing-6)', width: '100%' }}>
      <div>
        <div style={{ font: 'var(--bui-typography-header-32)' }}>Headline font</div>
        <p style={{ margin: '8px 0 0', font: 'var(--bui-typography-text-16-regular)' }}>
                  The quick brown fox jumps over the lazy dog. Съешь же ещё этих мягких французских булок
                </p>
      </div>
      <div style={row}>
        <Button variant="primary" label="Primary" />
        <Button label="Secondary" />
        <Button variant="ghost" label="Ghost" />
        <IconButton label="Add" icon={<Plus size={24} />} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bui-spacing-4)', alignItems: 'flex-start' }}>
        <div style={{ width: 240 }}>
          <TextInput label="Email" defaultValue="name@example.com" />
        </div>
        <SegmentedControl items={items} defaultValue="week" label="Range" />
      </div>
      <Tabs label="Sections" items={[{ value: 'a', label: 'Overview', counter: 4 }, { value: 'b', label: 'Activity' }, { value: 'c', label: 'Settings' }]} />
      <div style={row}>
        <Token size="sm">Token</Token>
        <Badge variant="primary" label="Primary" />
        <Badge label="Secondary" />
        <Badge variant="success" label="Success" />
        <Switch size="sm" label="Notifications" defaultChecked />
      </div>
      <Progress />
      <PhoneDemo />
    </div>
  );
}
describe(ThemePreview, 'The theme of this site and of your own app: the settings are applied at once and stored in a cookie on this device', {
  preset: [
    "'default' | 'ocean' | 'forest' | 'sunset' | 'berry' | 'graphite' | 'custom'",
    "'default'",
    'A ready set of the settings below; changing any of them switches it to custom',
  ],
  brand: [
    "'default' | 'blue' | 'green' | 'pink' | 'orange' | 'red' | 'blue-light' | 'green-light' | 'custom'",
    "'default'",
    'Brand color: primary buttons, the slider, the current step and page. default is black in the light theme and white in the dark one',
  ],
  brandColor: ['string', "'#575df6'", 'Your own brand color, any CSS color (with brand: custom)'],
  shape: [
    "'rounded' | 'circle'",
    "'rounded'",
    'rounded follows the base radius; circle makes buttons, fields, tokens and segmented controls pills (`data-shape` on `<html>`)',
  ],
  radius: ['number', '12', 'Base radius in px: every radius token (4 to 32) scales from it; 0 makes square corners'],
  headingFont: [
    "'Geist' | 'Unbounded' | 'Montserrat Alternates' | …",
    "'Geist'",
    'Font of the headings (`--bui-typography-headline-font-family`); Google Fonts with Cyrillic',
  ],
  textFont: ["'Geist' | 'Inter' | 'Manrope' | …", "'Geist'", 'Font of all other text (`--bui-typography-font-family`); Google Fonts with Cyrillic'],
  motion: [
    "'off' | 'basic' | 'enhanced'",
    "'basic'",
    'off: nothing moves (loading indicators still run); basic (the default): simple transitions, the highlight of a tab, segment or bar item appears in its new place with a fade; enhanced: the highlight slides there, and the underline of the tabs also nudges toward the hovered tab; menus and panels (Dropdown, Popover, the lists of Selector and Typeahead) grow from their trigger and play out when they close (`data-motion` on `<html>`)',
  ],
  floating: [
    'boolean',
    'false',
    'Bars and panels float above the content: rounded, inset, with a shadow (`data-floating` on `<html>`; the Navbar and Bottom Bar follow it)',
  ],
  glass: ['boolean', 'false', 'Translucent, blurred surfaces for bars, menus, dialogs and toasts (`data-glass` on `<html>`)'],
});

const custom = { preset: 'custom' };
const meta = {
  title: 'Theming/Theme Settings',
  component: ThemePreview,
  parameters: { docs: { description: { component: /** @type {any} */ (ThemePreview).__docgenInfo.description } } },
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
  onReset: () => {
    applyTheme(DEFAULT);
    saveTheme({ ...DEFAULT, preset: 'default' });
  },
};
// The settings start from the stored theme.
Object.defineProperty(meta, 'args', { get: () => loadTheme(), enumerable: true });
export default meta;
export const Playground = {
  parameters: {
    docs: {
      source: {
        originalSource: `// Set the tokens on <html>, or pick the settings on this page
document.documentElement.style.setProperty('--bui-background-brand', '#575df6');
document.documentElement.dataset.shape = 'circle';`,
      },
    },
  },
  render: (args) => <ThemePreview {...args} />,
};
export const __namedExportsOrder = ['Playground'];

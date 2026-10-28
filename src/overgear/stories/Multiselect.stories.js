import { h, useState, useEffect, Fragment } from '../../react.js';
import { Multiselect } from '../molecules/Multiselect.js';
import { Button } from '../../components/Button.js';
import { meta, playground, example } from '../../stories/_helpers.js';

const GAMES = [
  { value: 'wow', label: 'World of Warcraft' }, { value: 'dota', label: 'Dota 2' }, { value: 'cs2', label: 'Counter-Strike 2' }, { value: 'lol', label: 'League of Legends' },
  { value: 'val', label: 'Valorant' }, { value: 'poe', label: 'Path of Exile 2' }, { value: 'albion', label: 'Albion Online' }, { value: 'eso', label: 'Elder Scrolls Online', disabled: true },
];
const SERVERS = ['EU West', 'EU East', 'US East', 'US West', 'Asia', 'Oceania', 'South America', 'Middle East', 'Africa', 'Japan', 'Korea', 'India'].map((s) => ({ value: s.toLowerCase().replace(/ /g, '-'), label: s }));
const col = (children, gap = 'var(--baseui-spacing-16)') => h('div', { style: { width: 360, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap } }, children);
const room = (node, height = 420) => h('div', { style: { minHeight: height, width: 360, maxWidth: '100%' } }, node);

export default meta({
  title: 'Overgear/Molecules/Multiselect', component: Multiselect,
  args: { options: GAMES, label: 'Games', placeholder: 'Select games', size: 'md', withChips: false, withClear: true, withSelectAll: true, withSearch: false, disabled: false, error: false, loading: false, emptyText: 'No games found' },
  argTypes: {
    label: { control: 'text' }, placeholder: { control: 'text' }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, withChips: { control: 'boolean' }, withClear: { control: 'boolean' }, withSelectAll: { control: 'boolean' }, withSearch: { control: 'boolean' },
    disabled: { control: 'boolean' }, error: { control: 'boolean' }, errorText: { control: 'text' }, loading: { control: 'boolean' }, emptyText: { control: 'text' }, hintText: { control: 'text' },
    options: { control: false }, value: { control: false }, defaultValue: { control: false }, footer: { control: false }, getButtonLabel: { control: false }, getOptionLabel: { control: false }, filterFunction: { control: false },
  },
});
export const Playground = { ...playground({ source: `<Multiselect label="Games" options={games} placeholder="Select games" withClear />` }), render: (args) => room(h(Multiselect, { ...args, defaultValue: ['dota'] })) };
export const Open = example({ name: 'Open', description: 'The panel with a select-all row; a disabled option cannot be toggled.', render: () => room(h(Multiselect, { label: 'Games', options: GAMES, defaultOpen: true, defaultValue: ['wow', 'cs2'], placeholder: 'Select games' })), source: `<Multiselect options={games} defaultOpen defaultValue={['wow', 'cs2']} />` });
export const Chips = example({ name: 'Chips and Search', description: 'The selection as removable chips; with search the control turns into an input while open, and Backspace in an empty search removes the last chip.', render: () => room(h(Multiselect, { label: 'Servers', options: SERVERS, withChips: true, withSearch: true, withClear: true, defaultValue: ['eu-west', 'us-east', 'asia'], defaultOpen: true, placeholder: 'Select servers', searchPlaceholder: 'Search servers' }), 460), source: `<Multiselect withChips withSearch withClear options={servers} />` });
export const States = example({ name: 'States', description: 'Empty, with a counter, disabled and with an error.', render: () => col([
  h(Multiselect, { key: 'a', label: 'Empty', options: GAMES, placeholder: 'Select games' }),
  h(Multiselect, { key: 'b', label: 'Selected', options: GAMES, defaultValue: ['wow', 'dota', 'cs2'], withClear: true }),
  h(Multiselect, { key: 'c', label: 'Disabled', options: GAMES, defaultValue: ['wow'], disabled: true }),
  h(Multiselect, { key: 'd', label: 'Error', options: GAMES, error: true, errorText: 'Choose at least one game' }),
  h(Multiselect, { key: 'e', label: 'Chips disabled', options: GAMES, withChips: true, defaultValue: ['wow', 'dota'], disabled: true })]), source: `<Multiselect disabled />\n<Multiselect error errorText="Choose at least one game" />` });
export const Sizes = example({ name: 'Sizes', render: () => col(['sm', 'md', 'lg'].map((s) => h(Multiselect, { key: s, size: s, options: GAMES, placeholder: `Size ${s}`, defaultValue: s === 'md' ? ['wow', 'dota'] : [] }))), source: `<Multiselect size="sm" />` });
export const Empty = example({ name: 'Empty State', description: 'Nothing matches the search.', render: () => room(h(Multiselect, { label: 'Games', options: GAMES, withSearch: true, defaultOpen: true, emptyText: 'No games found' }), 260), source: `<Multiselect withSearch emptyText="No games found" />` });
const Async = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  useEffect(() => { if (!loading) return undefined; const t = setTimeout(() => { setOptions(SERVERS); setLoading(false); }, 1500); return () => clearTimeout(t); }, [loading]);
  return h('div', { style: { minHeight: 380, width: 360, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-12)' } },
    h(Multiselect, { label: 'Servers', options, loading, defaultOpen: true, placeholder: 'Select servers' }),
    h('div', null, h(Button, { size: 'sm', variant: 'secondary', onClick: () => { setOptions([]); setLoading(true); } }, 'Reload')));
};
export const Loading = example({ name: 'Async Loading', description: '`loading` shows a spinner in the control and a loading row instead of the options.', render: () => h(Async), source: `<Multiselect loading={isFetching} options={options} />` });
const Controlled = () => {
  const [v, setV] = useState(['poe']);
  return col([h(Multiselect, { label: 'Games', options: GAMES, value: v, onValueChange: setV, withChips: true, hintText: 'Pick the games you sell accounts for.' }), h('span', { style: { font: 'var(--baseui-Typography-Text-12-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' } }, `Value: ${JSON.stringify(v)}`)]);
};
export const ControlledWithHint = example({ name: 'Controlled With Hint', description: 'A controlled value and a Hint next to the label.', render: () => h(Controlled), source: `const [v, setV] = useState(['poe']);\n<Multiselect value={v} onValueChange={setV} hintText="…" />` });
export const Footer = example({ name: 'Footer', description: 'A static footer under the scrolling list, and a custom text for the control.', render: () => room(h(Multiselect, { label: 'Servers', options: SERVERS, defaultOpen: true, maxHeight: 200, defaultValue: ['japan', 'korea'], getButtonLabel: (items) => items.map((i) => i.label).join(', '), footer: h(Button, { size: 'sm', variant: 'secondary', width: '100%' }, 'Show all servers') }), 440), source: `<Multiselect footer={<Button>Show all servers</Button>} maxHeight={200} />` });
export const MobileSheet = example({ name: 'Mobile Sheet', description: 'Up to 1200px the panel becomes a bottom sheet with a search and an Apply button. Resize the window to try it.', render: () => col([h(Multiselect, { label: 'Games', options: GAMES, withSearch: true, withChips: true, defaultValue: ['wow'], mobileTitle: 'Choose games' })]), source: `<Multiselect withSearch mobileTitle="Choose games" />` });
export const __namedExportsOrder = ['Playground', 'Open', 'Chips', 'States', 'Sizes', 'Empty', 'Loading', 'ControlledWithHint', 'Footer', 'MobileSheet'];

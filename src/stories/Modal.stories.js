import { h, Fragment, useState } from '../react.js';
import { Modal } from '../components/Modal.js';
import { Button } from '../components/Button.js';
import { TextField } from '../components/TextField.js';
import { meta } from './_helpers.js';

const TEXT = 'The morning began without any particular promise, which was perhaps why it felt unusually open. A pale light rested on the rooftops, turning windows into small sheets of silver, and the street below moved at the unhurried pace of people who had nowhere urgent to be.';
const PARAGRAPHS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

// the example opens on top of the page; closing it leaves a button to open it again
function Demo({ initialOpen = true, ...props }) {
  const [open, setOpen] = useState(initialOpen);
  return h(Fragment, null, !open && h(Button, { onClick: () => setOpen(true) }, 'Open Modal'), h(Modal, { ...props, open, onOpenChange: setOpen }));
}
export default meta({
  title: 'Components/Modal', component: Modal, description: 'The dialog: a bottom sheet up to 1200px and a centered 480px window on a desktop, built on the Base UI Dialog.',
  args: { title: 'A Simple and Neutral Two-Line Title', subtitle: 'Subtitle', header: 'close', height: 'content', floating: 'theme', children: TEXT, primaryAction: h(Button, { variant: 'primary' }, 'Button'), secondaryAction: h(Button, { variant: 'secondary' }, 'Additional Button') },
  argTypes: {
    title: { control: 'text' }, subtitle: { control: 'text' },
    header: { control: 'select', options: ['close', 'close-and-back', 'title-only', false] },
    height: { control: 'inline-radio', options: ['content', 'viewport'] },
    floating: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    children: { control: 'text' }, primaryAction: { control: false }, secondaryAction: { control: false },
  },
});
const render = (args) => h(Demo, args);
const story = (name, args, source) => ({ name, args, render, parameters: { docs: { source: { originalSource: source } } } });
export const Playground = { render, parameters: { docs: { source: { originalSource: '{}' } } } };
export const Viewport = story('Viewport', { height: 'viewport' }, `<Modal height="viewport" title="Title">…</Modal>`);
export const CloseAndBack = story('Close And Back', { header: 'close-and-back', onBack: () => undefined }, `<Modal header="close-and-back" onBack={back} title="Title">…</Modal>`);
export const TitleOnly = story('Title Only', { header: 'title-only' }, `<Modal header="title-only" title="Title">…</Modal>`);
export const WithoutHeader = story('Without Header', { header: false, title: 'Modal without header', subtitle: undefined }, `<Modal header={false} title="Modal without header">…</Modal>`);
export const Scroll = story('Scroll', { height: 'viewport', title: 'A Simple and Neutral Two-Line Title That Becomes Shorter on Scroll', children: PARAGRAPHS.map((p) => h('p', { key: p }, TEXT)) }, `<Modal height="viewport" title="A long title">{paragraphs}</Modal>`);
export const Keyboard = story('Keyboard', { height: 'viewport', title: 'Keyboard viewport', children: h(Fragment, null, h(TextField, { label: 'Quantity', inputMode: 'numeric', 'data-testid': 'modal-keyboard-input' }), PARAGRAPHS.slice(0, 4).map((p) => h('p', { key: p }, TEXT))), primaryAction: h(Button, { variant: 'primary', 'data-testid': 'modal-keyboard-action' }, 'Done'), secondaryAction: undefined }, `<Modal height="viewport" title="Keyboard viewport"><TextField label="Quantity" /></Modal>`);
export const __namedExportsOrder = ['Playground', 'Viewport', 'CloseAndBack', 'TitleOnly', 'WithoutHeader', 'Scroll', 'Keyboard'];

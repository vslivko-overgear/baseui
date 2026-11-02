import { Fragment, useState } from '../react.js';
import { Dialog } from '../components/Dialog.jsx';
import { Button } from '../components/Button.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { meta } from './_helpers.jsx';

const TEXT =
  'The morning began without any particular promise, which was perhaps why it felt unusually open. A pale light rested on the rooftops, turning windows into small sheets of silver, and the street below moved at the unhurried pace of people who had nowhere urgent to be';
const PARAGRAPHS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

// the example opens on top of the page; closing it leaves a button to open it again
function Demo({ initialOpen = true, ...props }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      {!open && <Button onClick={() => setOpen(true)}>Open Dialog</Button>}
      <Dialog {...props} open={open} onOpenChange={setOpen} />
    </>
  );
}
export default meta({
  title: 'Components/Dialog',
  component: Dialog,
  description: 'The dialog: a bottom sheet below 768px and a centered 480px window on a desktop, built on the Base UI Dialog',
  args: {
    title: 'A Simple and Neutral Two-Line Title',
    subtitle: 'Subtitle',
    header: 'close',
    height: 'content',
    floating: 'theme',
    children: TEXT,
    primaryAction: <Button variant="primary">Button</Button>,
    secondaryAction: <Button variant="secondary">Additional Button</Button>,
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    header: { control: 'select', options: ['close', 'close-and-back', 'title-only', false] },
    height: { control: 'inline-radio', options: ['content', 'viewport'] },
    floating: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    children: { control: 'text' },
    primaryAction: { control: false },
    secondaryAction: { control: false },
  },
});
const render = (args) => <Demo {...args} />;
const story = (name, args, source) => ({ name, args, render, parameters: { docs: { source: { originalSource: source } } } });
export const Playground = { render, parameters: { docs: { source: { originalSource: '{}' } } } };
export const Viewport = story('Viewport', { height: 'viewport' }, `<Dialog height="viewport" title="Title">…</Dialog>`);
export const CloseAndBack = story(
  'Close And Back',
  { header: 'close-and-back', onBack: () => undefined },
  `<Dialog header="close-and-back" onBack={back} title="Title">…</Dialog>`,
);
export const TitleOnly = story('Title Only', { header: 'title-only' }, `<Dialog header="title-only" title="Title">…</Dialog>`);
export const WithoutHeader = story(
  'Without Header',
  { header: false, title: 'Dialog without header', subtitle: undefined },
  `<Dialog header={false} title="Dialog without header">…</Dialog>`,
);
export const Scroll = story(
  'Scroll',
  { height: 'viewport', title: 'A Simple and Neutral Two-Line Title That Becomes Shorter on Scroll', children: PARAGRAPHS.map((p) => <p key={p}>{TEXT}</p>) },
  `<Dialog height="viewport" title="A long title">{paragraphs}</Dialog>`,
);
export const Keyboard = story(
  'Keyboard',
  {
    height: 'viewport',
    title: 'Keyboard viewport',
    children: (
      <>
        <TextInput label="Quantity" inputMode="numeric" data-testid="dialog-keyboard-input" />
        {PARAGRAPHS.slice(0, 4).map((p) => (
          <p key={p}>{TEXT}</p>
        ))}
      </>
    ),
    primaryAction: (
      <Button variant="primary" data-testid="dialog-keyboard-action">
        Done
      </Button>
    ),
    secondaryAction: undefined,
  },
  `<Dialog height="viewport" title="Keyboard viewport"><TextInput label="Quantity" /></Dialog>`,
);
export const __namedExportsOrder = ['Playground', 'Viewport', 'CloseAndBack', 'TitleOnly', 'WithoutHeader', 'Scroll', 'Keyboard'];

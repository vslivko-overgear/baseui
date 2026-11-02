import { useState } from '../react.js';
import { Selector } from '../components/Selector.jsx';
import { Dialog } from '../components/Dialog.jsx';
import { Button, IconButton } from '../components/Button.jsx';
import { meta, example, Row } from './_helpers.jsx';
import { Settings02 } from './_ui.jsx';

const options = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'size', label: 'Size' },
];
const labelOf = (v) => (options.find((o) => o.value === v) || {}).label;

export default meta({ title: 'Components/Selector Trigger', component: Selector, args: {}, argTypes: {}, description: 'The list can open from any element' });

function IconDemo() {
  const [v, setV] = useState('name');
  return (
    <Row>
      <Selector
        trigger={<IconButton variant="ghost" label="Sort by" icon={<Settings02 />} />}
        options={options}
        value={v}
        onValueChange={setV}
        aria-label="Sort by"
      />
      <span>{`Sorted by ${labelOf(v)}`}</span>
    </Row>
  );
}
function ButtonDemo() {
  const [v, setV] = useState('date');
  return <Selector trigger={<Button variant="secondary">{`Sort: ${labelOf(v)}`}</Button>} options={options} value={v} onValueChange={setV} />;
}
function TextDemo() {
  const [v, setV] = useState('size');
  return <Selector trigger={`${labelOf(v)} ▾`} options={options} value={v} onValueChange={setV} />;
}
function DialogDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [v, setV] = useState('name');
  return (
    <div>
      <Button onClick={() => setA(true)}>Open dialog</Button>
      <Dialog
        open={a}
        onOpenChange={setA}
        title="Sort and filter"
        primaryAction={<Button onClick={() => setA(false)}>Done</Button>}
        secondaryAction={
          <Button variant="secondary" onClick={() => setB(true)}>
            More options
          </Button>
        }
      >
        <div style={{ display: 'grid', gap: 12, paddingTop: 8 }}>
          <Selector label="Sort by" options={options} value={v} onValueChange={setV} />
        </div>
      </Dialog>
      <Dialog open={b} onOpenChange={setB} title="More options" primaryAction={<Button onClick={() => setB(false)}>Close</Button>}>
              Dialogs stack: Escape or Close dismisses this one first
            </Dialog>
    </div>
  );
}
export const IconTrigger = example({
  name: 'Icon Trigger',
  render: () => <IconDemo />,
  source: `<Selector trigger={<IconButton label="Sort by" icon={<Settings02 />} />} options={options} value={v} onValueChange={setV} />`,
});
export const ButtonTrigger = example({
  name: 'Button Trigger',
  render: () => <ButtonDemo />,
  source: `<Selector trigger={<Button variant="secondary">Sort: Date</Button>} options={options} value={v} onValueChange={setV} />`,
});
export const TextTrigger = example({
  name: 'Text Trigger',
  render: () => <TextDemo />,
  source: `<Selector trigger="Size ▾" options={options} value={v} onValueChange={setV} />`,
});
export const InDialog = example({
  name: 'In a Dialog',
  render: () => <DialogDemo />,
  source: `<Dialog open={open} …><Selector label="Sort by" options={options} /></Dialog>  // the list opens above the dialog`,
});
export const __namedExportsOrder = ['IconTrigger', 'ButtonTrigger', 'TextTrigger', 'InDialog'];

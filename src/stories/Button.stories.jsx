import { Button } from '../components/Button.jsx';
import { Plus } from './_ui.jsx';
import { meta, playground, example, Row, W } from './_helpers.jsx';

export default meta({
  title: 'Components/Button',
  component: Button,
  args: { label: 'Button', variant: 'secondary', size: 'md', shape: 'rounded', disabled: false, loading: false },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] },
    textSize: { control: 'inline-radio', options: [12, 14, 16, 20] },
    shape: { control: 'inline-radio', options: ['rounded', 'circle'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
});
export const Playground = playground({ source: '{}' });
export const Variants = example({
  name: 'Variants',
  render: () => (
    <Row>
      {['primary', 'secondary', 'ghost', 'destructive'].map((v) => (
        <Button key={v} variant={v} label={v} />
      ))}
    </Row>
  ),
  source: `<Button variant="primary" label="Save" />`,
});
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <Row>
      {['xsm', 'sm', 'md', 'lg'].map((s) => (
        <Button key={s} size={s} label={s} />
      ))}
    </Row>
  ),
  source: `<Button size="lg" label="Save" />`,
});
export const TextSizes = example({
  name: 'Text Sizes',
  render: () => (
    <Row>
      {[['xsm', 12], ['sm', 12], ['sm', 14], ['md', 14], ['md', 16], ['lg', 16], ['lg', 20]].map(([size, text]) => (
        <Button key={`${size}${text}`} size={size} textSize={text} label={`${size} ${text}`} />
      ))}
    </Row>
  ),
  source: `<Button size="md" textSize={14} label="Save" />
// xsm: 12 · sm: 14 or 12 · md: 16 or 14 · lg: 16 or 20`,
});
export const Icons = example({
  name: 'Icons',
  render: () => (
    <Row>
      <Button label="New" icon={<Plus size={20} />} />
      <Button label="Next" endContent={<Plus size={20} />} />
    </Row>
  ),
  source: `<Button label="New" icon={<PlusIcon />} />`,
});
export const Loading = example({
  name: 'Loading',
  render: () => (
    <Row>
      <Button variant="primary" label="Saving" loading />
      <Button label="Async" clickAction={() => new Promise((r) => setTimeout(r, 1200))} />
    </Row>
  ),
  source: `<Button label="Async" clickAction={save} />`,
});
export const Width = example({
  name: 'Width',
  render: () => W(360, <Button variant="primary" label="Continue" width="100%" />),
  source: `<Button label="Continue" width="100%" />`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'Sizes', 'TextSizes', 'Icons', 'Loading', 'Width'];

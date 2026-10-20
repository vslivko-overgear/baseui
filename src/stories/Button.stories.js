import { h } from '../react.js';
import { Button } from '../components/Button.js';
import { Plus } from './_ui.js';
import { meta, playground, example, Row, W } from './_helpers.js';

export default meta({
  title: 'Components/Button', component: Button, args: { label: 'Button', variant: 'secondary', size: 'md', shape: 'rounded', isDisabled: false, isLoading: false },
  argTypes: { label: { control: 'text' },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['rounded', 'circle'] },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
});
export const Playground = playground({ source: '{}' });
export const Variants = example({
  name: 'Variants', render: () => h(Row, null, ['primary', 'secondary', 'ghost', 'destructive'].map((v) => h(Button, { key: v, variant: v, label: v }))),
  source: `<Button variant="primary" label="Save" />`,
});
export const Sizes = example({
  name: 'Sizes', render: () => h(Row, null, ['xsm', 'sm', 'md', 'lg'].map((s) => h(Button, { key: s, size: s, label: s }))),
  source: `<Button size="lg" label="Save" />`,
});
export const Icons = example({
  name: 'Icons', render: () => h(Row, null, h(Button, { label: 'New', icon: h(Plus, { size: 20 }) }), h(Button, { label: 'Next', endContent: h(Plus, { size: 20 }) })),
  source: `<Button label="New" icon={<PlusIcon />} />`,
});
export const Loading = example({
  name: 'Loading', render: () => h(Row, null, h(Button, { variant: 'primary', label: 'Saving', isLoading: true }), h(Button, { label: 'Async', clickAction: () => new Promise((r) => setTimeout(r, 1200)) })),
  source: `<Button label="Async" clickAction={save} />`,
});
export const Width = example({
  name: 'Width', render: () => W(360, h(Button, { variant: 'primary', label: 'Continue', width: '100%' })),
  source: `<Button label="Continue" width="100%" />`,
});
export const __namedExportsOrder = ['Playground', 'Variants', 'Sizes', 'Icons', 'Loading', 'Width'];

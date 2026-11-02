import { ButtonGroup } from '../components/ButtonGroup.jsx';
import { Button } from '../components/Button.jsx';
import { meta, playground, example } from './_helpers.jsx';

export default meta({
  title: 'Components/Button Group',
  component: ButtonGroup,
  args: { orientation: 'horizontal', stackOnMobile: false, gap: 3, justify: undefined, size: undefined },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    stackOnMobile: { control: 'boolean' },
    gap: { control: 'inline-radio', options: [2, 3, 4] },
    justify: { control: 'inline-radio', options: [undefined, 'start', 'center', 'end', 'between'] },
    size: { control: 'inline-radio', options: [undefined, 'xsm', 'sm', 'md', 'lg'] },
  },
});

const buttons = [<Button key="a" variant="primary" label="Open the example" />, <Button key="b" variant="secondary" label="Back to the documentation" />];

export const Playground = {
  ...playground({ source: `<ButtonGroup orientation="horizontal">\n  <Button variant="primary" label="Open the example" />\n  <Button variant="secondary" label="Back to the documentation" />\n</ButtonGroup>` }),
  render: (args) => (
    <div style={{ width: 420, maxWidth: '100%' }}>
      <ButtonGroup {...args}>{buttons}</ButtonGroup>
    </div>
  ),
};
export const Horizontal = example({
  name: 'Horizontal',
  description: 'A row. When the buttons do not fit they wrap to the next line',
  render: () => <ButtonGroup>{buttons}</ButtonGroup>,
  source: `<ButtonGroup>…</ButtonGroup>`,
});
export const Vertical = example({
  name: 'Vertical',
  description: 'A column: every button fills the width of the group, whatever its label. The primary action goes first',
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <ButtonGroup orientation="vertical">{buttons}</ButtonGroup>
    </div>
  ),
  source: `<ButtonGroup orientation="vertical">…</ButtonGroup>`,
});
export const StackOnMobile = example({
  name: 'Stack on mobile',
  description: 'A row on a wide screen, a full-width column below 768px',
  render: () => (
    <ButtonGroup stackOnMobile justify="end">
      <Button variant="secondary" label="Cancel" />
      <Button variant="primary" label="Save changes" />
    </ButtonGroup>
  ),
  source: `<ButtonGroup stackOnMobile justify="end">…</ButtonGroup>`,
});
export const Size = example({
  name: 'Size',
  description: 'The group gives its buttons one tier: the same height and text size',
  render: () => (
    <ButtonGroup size="sm">
      <Button variant="primary" label="Buy now" />
      <Button variant="secondary" label="Add to cart" />
    </ButtonGroup>
  ),
  source: `<ButtonGroup size="sm">…</ButtonGroup>`,
});

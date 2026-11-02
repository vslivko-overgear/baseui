import { Token } from '../components/Token.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Heart } from './_ui.jsx';
import { meta, playground, example, Row, Stack } from './_helpers.jsx';

export default meta({
  title: 'Components/Token',
  component: Token,
  args: { children: 'Label', size: 'md', status: 'none', action: false, disabled: false },
  argTypes: {
    children: { control: 'text' },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    status: { control: 'inline-radio', options: ['none', 'error', 'success'], mapping: { none: undefined } },
    action: { control: 'inline-radio', options: [false, true, 'press'] },
    disabled: { control: 'boolean' },
  },
});
export const Playground = playground({ source: '{}' });
export const States = example({
  name: 'States',
  description: 'Enabled, selected, disabled, disabled and selected',
  render: () => (
    <Row>
      <Token>Enabled</Token>
      <Token defaultPressed>Selected</Token>
      <Token disabled>Disabled</Token>
      <Token disabled defaultPressed>
        Disabled selected
      </Token>
    </Row>
  ),
  source: `<Token defaultPressed>Selected</Token>`,
});
export const Status = example({
  name: 'Status',
  description: 'Success and error colour the fill',
  render: () => (
    <Row>
      <Token status="success">Success</Token>
      <Token status="error">Error</Token>
    </Row>
  ),
  source: `<Token status="success">Success</Token>`,
});
export const Slots = example({
  name: 'Slots',
  description: 'An icon, an avatar, a counter, or no label (needs `aria-label`)',
  render: () => (
    <Stack gap="var(--baseui-spacing-3)">
      <Row>
        <Token>Label</Token>
        <Token icon={<Heart />}>Label</Token>
        <Token avatar={<Avatar name="Maya Chen" size="sm" tooltip={false} />}>Label</Token>
        <Token counter={6}>Label</Token>
        <Token icon={<Heart />} aria-label="Add to favorites" />
      </Row>
      <Row>
        <Token size="sm" icon={<Heart />}>
          Label
        </Token>
        <Token size="sm" icon={<Heart />} defaultPressed>
          Label
        </Token>
        <Token size="sm" avatar={<Avatar name="Maya Chen" size="xsm" tooltip={false} />}>
          Label
        </Token>
      </Row>
    </Stack>
  ),
  source: `<Token icon={<Heart />} counter={6}>Label</Token>`,
});
export const Removable = example({
  name: 'Removable',
  description: '`action`: a click anywhere on the chip removes it; the cross is decorative',
  render: () => (
    <Row>
      <Token action actionLabel="Remove design" onAction={() => {}}>
        Design
      </Token>
      <Token action="press" onClick={() => {}}>
        Press
      </Token>
    </Row>
  ),
  source: `<Token action onAction={remove}>Design</Token>`,
});
export const __namedExportsOrder = ['Playground', 'States', 'Status', 'Slots', 'Removable'];

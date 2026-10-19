import { h, Fragment } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.js';
import { Button, IconButton } from '../components/Button.js';
import { SegmentedControl } from '../components/SegmentedControl.js';
import { TextField, Checkbox, Switch } from '../base.js';
import { List, ListItem } from '../components/List.js';
import { Heart } from '../stories/_ui.js';

export default {
  title: 'Foundations/Focus',
  parameters: { docs: { description: { component: 'The keyboard focus ring: black in the light theme, white in the dark one.' } } },
};

export function page() {
  const s = section('Focus', useTokens());
  if (!s) return h(Loading);
  return h(Fragment, null,
    h(Block, { title: 'Focus Ring' },
      h('p', { className: 'doc-p' }, 'A 2px solid ring in the primary text color, 2px away from the element. It appears on keyboard focus (Tab), not on click.'),
      h('div', { className: 'focus-demo' },
        h(Button, { variant: 'primary' }, 'Button'),
        h(Button, { variant: 'secondary' }, 'Button'),
        h(IconButton, { variant: 'ghost', label: 'Like', icon: h(Heart) }),
        h(Checkbox, { label: 'Checkbox' }),
        h(Switch, { label: 'Switch' }),
        h(SegmentedControl, { label: 'View', items: [{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }] }),
        h('div', { className: 'focus-demo__field' }, h(TextField, { label: 'Text Input' })))),
    h(Block, { title: 'Tokens' }, h(TokenTable, { tokens: s.groups[0].tokens })),
    h(Block, { title: 'Text Fields' },
      h('p', { className: 'doc-p' }, 'Text Input and Selector draw the ring flush against the field, with no gap. Validation outlines (error, warning, success) are also drawn outside the field, so only one outline is visible at a time.'),
      h('div', { className: 'focus-demo' },
        h('div', { className: 'focus-demo__field' }, h(TextField, { label: 'Focused', defaultValue: 'Tab here' })),
        h('div', { className: 'focus-demo__field' }, h(TextField, { label: 'Error', status: 'error', caption: 'Error text', defaultValue: 'Value' })),
        h('div', { className: 'focus-demo__field' }, h(TextField, { label: 'Success', status: 'success', caption: 'All good', defaultValue: 'Value' })))),
    h(Block, { title: 'Inside Clipped Containers' },
      h('p', { className: 'doc-p' }, 'Where a container clips its content (list rows, dropdown options, the dialog close button), the ring is drawn inside the element, with the same width and color.'),
      h('p', { className: 'doc-p' }, 'Scrolling containers (the dialog content) keep a 4px gutter at their edges, so the outer ring of an input is never cut off.'),
      h('div', { className: 'focus-demo__list' }, h(List, { size: 'md' }, h(ListItem, { onClick: () => {} }, 'Item'), h(ListItem, { onClick: () => {} }, 'Item')))));
}
export const __namedExportsOrder = [];

import { Fragment } from '../react.js';
import { useTokens, section, Block, TokenTable, Loading } from './_kit.jsx';
import { Button, IconButton } from '../components/Button.jsx';
import { SegmentedControl } from '../components/SegmentedControl.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Checkbox } from '../components/Checkbox.jsx';
import { Switch } from '../components/Switch.jsx';
import { List, ListItem } from '../components/List.jsx';
import { Heart } from '../stories/_ui.jsx';

export default {
  title: 'Foundations/Focus',
  parameters: { docs: { description: { component: 'The keyboard focus ring: black in the light theme, white in the dark one' } } },
};

export function page() {
  const s = section('Focus', useTokens());
  if (!s) return <Loading />;
  return (
    <>
      <Block title="Focus Ring">
        <p className="doc-p">A 2px solid ring in the primary text color, 2px away from the element. It appears on keyboard focus (Tab), not on click</p>
        <div className="focus-demo">
          <Button variant="primary">Button</Button>
          <Button variant="secondary">Button</Button>
          <IconButton variant="ghost" label="Like" icon={<Heart />} />
          <Checkbox label="Checkbox" />
          <Switch label="Switch" />
          <SegmentedControl
            label="View"
            items={[
              { value: 'a', label: 'One' },
              { value: 'b', label: 'Two' },
            ]}
          />
          <div className="focus-demo__field">
            <TextInput label="Text Input" />
          </div>
        </div>
      </Block>
      <Block title="Tokens">
        <TokenTable tokens={s.groups[0].tokens} />
      </Block>
      <Block title="Text Fields">
        <p className="doc-p">
                  Text Input and Selector draw the ring flush against the field, with no gap. Validation outlines (error, warning, success) are also drawn outside the
                  field, so only one outline is visible at a time
                </p>
        <div className="focus-demo">
          <div className="focus-demo__field">
            <TextInput label="Focused" defaultValue="Tab here" />
          </div>
          <div className="focus-demo__field">
            <TextInput label="Error" status="error" caption="Error text" defaultValue="Value" />
          </div>
          <div className="focus-demo__field">
            <TextInput label="Success" status="success" caption="All good" defaultValue="Value" />
          </div>
        </div>
      </Block>
      <Block title="Inside Clipped Containers">
        <p className="doc-p">
                  Where a container clips its content (list rows, dropdown options, the dialog close button), the ring is drawn inside the element, with the same width
                  and color
                </p>
        <p className="doc-p">Scrolling containers (the dialog content) keep a 4px gutter at their edges, so the outer ring of an input is never cut off</p>
        <div className="focus-demo__list">
          <List size="md">
            <ListItem onClick={() => {}}>Item</ListItem>
            <ListItem onClick={() => {}}>Item</ListItem>
          </List>
        </div>
      </Block>
    </>
  );
}
export const __namedExportsOrder = [];

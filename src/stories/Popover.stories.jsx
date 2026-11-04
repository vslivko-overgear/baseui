import { Popover } from '../components/Popover.jsx';
import { Button } from './_ui.jsx';
import { meta, playground } from './_helpers.jsx';

export default meta({
  title: 'Components/Popover',
  component: Popover,
  args: { glass: 'theme', motion: 'theme', placement: 'bottom-start', label: 'Share' },
  argTypes: {
    motion: { control: 'inline-radio', options: ['theme', 'off', 'basic', 'enhanced'], mapping: { theme: undefined } },
    glass: { control: 'inline-radio', options: ['theme', 'on', 'off'], mapping: { theme: undefined, on: true, off: false } },
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
  },
});
export const Playground = {
  ...playground({ source: `<Popover trigger={(p) => <Button {...p}>Share</Button>}>…</Popover>` }),
  render: (args) => (
    <div style={{ minHeight: 200 }}>
      <Popover
        {...args}
        trigger={(p) => (
          <Button variant="secondary" {...p}>
            Share
          </Button>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bui-spacing-2)' }}>
          <strong>Share this page</strong>
          <span style={{ color: 'var(--bui-text-and-icon-secondary)' }}>Anyone with the link can view</span>
        </div>
      </Popover>
    </div>
  ),
};
export const __namedExportsOrder = ['Playground'];

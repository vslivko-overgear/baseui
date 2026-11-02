import { useState } from '../react.js';
import { Banner } from '../components/Banner.jsx';
import { Button } from './_ui.jsx';
import { meta, playground, example, Stack, W } from './_helpers.jsx';

export default meta({
  title: 'Components/Banner',
  component: Banner,
  args: { status: 'info', title: 'Update available', children: 'The new version will install on the next launch' },
  argTypes: {
    status: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
    title: { control: 'text' },
    children: { control: 'text' },
  },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => W(480, <Banner {...args} />) };
export const Statuses = example({
  name: 'Statuses',
  render: () => (
    <Stack width={480}>
      <Banner status="info" title="Information">
              A neutral message
            </Banner>
      <Banner status="success" title="Done">
              Changes saved
            </Banner>
      <Banner status="warning" title="Heads up">
              Your subscription ends in 3 days
            </Banner>
      <Banner status="error" title="Error">
              Could not save. Try again
            </Banner>
    </Stack>
  ),
  source: `<Banner status="info" title="Information">A neutral message.</Banner>
<Banner status="success" title="Done">Changes saved.</Banner>
<Banner status="warning" title="Heads up">…</Banner>
<Banner status="error" title="Error">…</Banner>`,
});
function Dismissible() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Banner status="info" title="Dismissible" onClose={() => setOpen(false)}>
          Use the close button on the right
        </Banner>
  ) : (
    <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
      Show again
    </Button>
  );
}
export const Dismissable = example({
  name: 'Dismissible',
  render: () => W(480, <Dismissible />),
  source: `<Banner title="Dismissible" onClose={() => setOpen(false)}>Use the close button on the right.</Banner>`,
});
export const __namedExportsOrder = ['Playground', 'Statuses', 'Dismissable'];

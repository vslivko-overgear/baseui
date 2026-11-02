import { useState } from '../react.js';
import { AlertDialog } from '../components/AlertDialog.jsx';
import { Button } from './_ui.jsx';
import { meta, playground } from './_helpers.jsx';

export default meta({
  title: 'Components/Alert Dialog',
  component: AlertDialog,
  args: {
    title: 'Delete project?',
    description: 'This permanently removes the project and its files',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    destructive: true,
  },
  argTypes: { title: { control: 'text' }, description: { control: 'text' }, destructive: { control: 'boolean' } },
});
function Demo(args) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      {!open && <Button onClick={() => setOpen(true)}>Open</Button>}
      <AlertDialog {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
}
export const Playground = {
  ...playground({ source: `<AlertDialog open={open} onOpenChange={setOpen} title="Delete project?" description="…" destructive />` }),
  render: (args) => <Demo {...args} />,
};
export const __namedExportsOrder = ['Playground'];

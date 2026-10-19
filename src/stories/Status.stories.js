import { h } from '../react.js';
import { Status } from '../components/Status.js';
import { SearchLg as Search } from './_ui.js';
import { meta, playground, example, Row } from './_helpers.js';

const STATUSES = ['neutral', 'accent', 'success', 'warning', 'error'];
export default meta({
  title: 'Components/Status', component: Status,
  args: { status: 'neutral', actionLabel: 'Try again', actionVariant: 'primary' },
  argTypes: {
    status: { control: 'inline-radio', options: STATUSES },
    title: { control: 'text', description: 'Leave empty to use the title of the status' },
    description: { control: 'text', description: 'Leave empty to use the text of the status' },
    actionVariant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    actionLabel: { control: 'text' },
  },
});
export const Playground = playground({ source: `<Status status="error" actionLabel="Try again" onAction={retry} />` });
export const Statuses = example({
  name: 'Statuses', render: () => h(Row, { align: 'stretch' }, STATUSES.map((s) => h('div', { key: s, style: { width: 220 } }, h(Status, { status: s })))),
  source: `<Status status="success" />  // neutral | accent | success | warning | error`,
});
export const Actions = example({
  name: 'Actions', render: () => h(Row, { align: 'stretch' }, h('div', { style: { width: 260 } }, h(Status, { status: 'error', actionLabel: 'Try again' })), h('div', { style: { width: 260 } }, h(Status, { status: 'neutral', actionLabel: 'Create project', actionVariant: 'secondary' }))),
  source: `<Status status="neutral" actionLabel="Create project" actionVariant="secondary" />`,
});
export const CustomContent = example({
  name: 'Custom Content', render: () => h('div', { style: { width: 320 } }, h(Status, { icon: h(Search, { size: 28 }), title: 'Nothing found', description: 'Try changing the query or resetting the filters.', actionLabel: 'Reset filters', actionVariant: 'secondary' })),
  source: `<Status icon={<SearchLgIcon />} title="Nothing found" description="Try changing the query." />`,
});
export const __namedExportsOrder = ['Playground', 'Statuses', 'Actions', 'CustomContent'];

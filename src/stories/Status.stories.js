import { h } from '../react.js';
import { Status } from '../components/Status.js';
import { meta, playground, example, Row } from './_helpers.js';

const STATUSES = ['empty', 'no-results', 'error', 'success', 'offline', 'no-access'];
export default meta({
  title: 'Components/Status', component: Status,
  args: { status: 'empty', color: 'base', actionLabel: 'Try again', actionVariant: 'primary' },
  argTypes: {
    status: { control: 'select', options: STATUSES },
    color: { control: 'select', options: ['base', 'accent', 'success', 'warning', 'error'] },
    title: { control: 'text', description: 'Leave empty to use the title of the status' },
    description: { control: 'text', description: 'Leave empty to use the text of the status' },
    actionVariant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    actionLabel: { control: 'text' },
  },
});
export const Playground = playground({ source: `<Status status="error" actionLabel="Try again" onAction={retry} />` });
export const Statuses = example({
  name: 'Statuses', render: () => h(Row, { align: 'stretch' }, STATUSES.map((s) => h('div', { key: s, style: { width: 260 } }, h(Status, { status: s })))),
  source: `<Status status="no-access" />  // empty | no-results | error | success | offline | no-access`,
});
export const Colors = example({
  name: 'Colors', render: () => h(Row, { align: 'stretch' }, [['base', 'empty'], ['accent', 'no-results'], ['success', 'success'], ['warning', 'offline'], ['error', 'error']].map(([c, s]) => h('div', { key: c, style: { width: 200 } }, h(Status, { status: s, color: c, title: c, description: ' ' })))),
  source: `<Status status="success" color="success" />  // base | accent | success | warning | error`,
});
export const Actions = example({
  name: 'Actions', render: () => h(Row, { align: 'stretch' }, h('div', { style: { width: 260 } }, h(Status, { status: 'error', actionLabel: 'Try again' })), h('div', { style: { width: 260 } }, h(Status, { status: 'no-results', actionLabel: 'Reset filters', actionVariant: 'secondary' }))),
  source: `<Status status="no-results" actionLabel="Reset filters" actionVariant="secondary" />`,
});
export const __namedExportsOrder = ['Playground', 'Statuses', 'Colors', 'Actions'];

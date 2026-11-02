import { Status } from '../components/Status.jsx';
import { SearchLg as Search } from './_ui.jsx';
import { meta, playground, example, Row } from './_helpers.jsx';

const STATUSES = ['neutral', 'accent', 'success', 'warning', 'error'];
export default meta({
  title: 'Components/Status',
  component: Status,
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
  name: 'Statuses',
  render: () => (
    <Row align="stretch">
      {STATUSES.map((s) => (
        <div key={s} style={{ width: 220 }}>
          <Status status={s} />
        </div>
      ))}
    </Row>
  ),
  source: `<Status status="success" />  // neutral | accent | success | warning | error`,
});
export const Actions = example({
  name: 'Actions',
  render: () => (
    <Row align="stretch">
      <div style={{ width: 260 }}>
        <Status status="error" actionLabel="Try again" />
      </div>
      <div style={{ width: 260 }}>
        <Status status="neutral" actionLabel="Create project" actionVariant="secondary" />
      </div>
    </Row>
  ),
  source: `<Status status="neutral" actionLabel="Create project" actionVariant="secondary" />`,
});
export const CustomContent = example({
  name: 'Custom Content',
  render: () => (
    <div style={{ width: 320 }}>
      <Status
        icon={<Search size={28} />}
        title="Nothing found"
        description='Try changing the query or resetting the filters'
        actionLabel="Reset filters"
        actionVariant="secondary"
      />
    </div>
  ),
  source: `<Status icon={<SearchLgIcon />} title="Nothing found" description="Try changing the query." />`,
});
export const __namedExportsOrder = ['Playground', 'Statuses', 'Actions', 'CustomContent'];

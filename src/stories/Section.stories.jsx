import { Section } from '../components/Layout.jsx';
import { meta, playground } from './_helpers.jsx';

export default meta({
  title: 'Components/Section',
  component: Section,
  args: { padding: 6, maxWidth: 480 },
  argTypes: { padding: { control: 'inline-radio', options: [0, 2, 4, 6, 8, 12] }, maxWidth: { control: { type: 'range', min: 200, max: 720, step: 20 } } },
});
export const Playground = {
  ...playground({ source: `<Section padding={6} maxWidth={480}>…</Section>` }),
  render: (args) => (
    <Section {...args} style={{ background: 'var(--bui-background-secondary)', borderRadius: 'var(--bui-radius-2xl)' }}>
      Section content
    </Section>
  ),
};
export const __namedExportsOrder = ['Playground'];

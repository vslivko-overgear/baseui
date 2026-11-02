import { ConstitutionBanner } from '../components/ConstitutionBanner.jsx';
import { meta, playground, example } from './_helpers.jsx';

export default meta({
  title: 'Components/Constitution Banner',
  component: ConstitutionBanner,
  args: { sticky: false, defaultOpen: false, audit: false, violations: [{ id: 'A1', note: 'Body text is #bbbbbb on white (1.9:1)' }, { id: 'H2', note: 'Captions are 10px' }] },
  argTypes: { sticky: { control: 'boolean' }, defaultOpen: { control: 'boolean' }, audit: { control: 'boolean' } },
});
export const Playground = {
  ...playground({ source: `<ConstitutionBanner violations={[{ id: 'A1', note: 'Body text is #bbb on white' }]} />` }),
  render: (args) => <ConstitutionBanner {...args} />,
};
export const Open = example({
  name: 'With Details',
  render: () => <ConstitutionBanner sticky={false} defaultOpen violations={['A5', { id: 'C1', note: 'The button says "Submit"' }, 'D1']} />,
  source: `<ConstitutionBanner defaultOpen violations={['A5', { id: 'C1', note: 'The button says "Submit"' }, 'D1']} />`,
});
export const __namedExportsOrder = ['Playground', 'Open'];

import { Breadcrumbs } from '../components/Breadcrumbs.jsx';
import { meta, playground, example } from './_helpers.jsx';

const items = [{ label: 'Home', href: '#' }, { label: 'Catalog', href: '#' }, { label: 'Audio', href: '#' }, { label: 'Headphones' }];
export default meta({ title: 'Components/Breadcrumbs', component: Breadcrumbs, args: { items, showCurrent: true }, argTypes: { showCurrent: { control: 'boolean' } } });
export const Playground = {
  ...playground({
    source: `<Breadcrumbs items={[
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Headphones' },
]} />`,
  }),
  render: (args) => <Breadcrumbs {...args} />,
};
export const Item = example({
  name: 'Breadcrumb Item',
  render: () => <Breadcrumbs items={[{ label: 'Link', href: '#' }, { label: 'Button', onClick: () => {} }, { label: 'Current' }]} />,
  source: `<Breadcrumbs items={[{ label: 'Link', href: '/' }, { label: 'Button', onClick }, { label: 'Current' }]} />`,
});
export const WithoutCurrent = example({
  name: 'Without Current Page',
  render: () => <Breadcrumbs showCurrent={false} items={items} />,
  source: `<Breadcrumbs showCurrent={false} items={[{ label: 'Home', href: '/' }, { label: 'Catalog', href: '/catalog' }, { label: 'Headphones' }]} />`,
});
export const __namedExportsOrder = ['Playground', 'Item', 'WithoutCurrent'];

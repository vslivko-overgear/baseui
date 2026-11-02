import { useState } from '../react.js';
import { ProductListing } from '../components/ProductListing.jsx';
import { art } from './ProductCard.stories.jsx';
import { meta, playground, example } from './_helpers.jsx';

const NAMES = ['Mythic+ Bundle', 'Power Leveling', 'Raid Clear', 'Gold, 500K', 'Camo Pack', 'Rank Boost', 'Coaching', 'Starter Pack', 'Exotic Pack', 'Boss Carry'];
const product = (i) => ({
  id: `p${i}`,
  title: `${NAMES[i % NAMES.length]} ${Math.floor(i / NAMES.length) + 1}`,
  price: `$${(19 + ((i * 17) % 120)).toFixed(2)}`,
  image: art((i * 47) % 360),
  badge: i % 4 === 0 ? 'Sale' : undefined,
  badgeVariant: 'success',
  rating: 4.5 + ((i * 3) % 6) / 10,
  meta: `${(((i * 7) % 30) / 10 + 0.4).toFixed(1)}K sold`,
});
const make = (n) => Array.from({ length: n }, (_, i) => product(i));

export default meta({
  title: 'Components/Product Listing',
  component: ProductListing,
  args: { more: 'button', rows: 2 },
  argTypes: {
    more: { control: 'inline-radio', options: ['button', 'infinite', 'pagination'] },
    rows: { control: { type: 'range', min: 1, max: 4, step: 1 } },
  },
});

export const Playground = {
  ...playground({ source: '{}' }),
  render: (args) => <ProductListing {...args} items={make(37)} />,
};

export const Endless = example({
  name: 'More products come',
  description: 'The products keep coming: `hasMore` and `onLoadMore` load the next ones, the skeletons of the next rows are shown while they load, and the cards that would start a new row wait for the rest of it',
  render: () => {
    const [items, setItems] = useState(() => make(14));
    const [loading, setLoading] = useState(false);
    return (
      <ProductListing
        items={items}
        hasMore
        loading={loading}
        onLoadMore={() => {
          setLoading(true);
          setTimeout(() => { setItems((x) => [...x, ...make(10).map((p, i) => ({ ...p, id: `p${x.length + i}` }))]); setLoading(false); }, 700);
        }}
      />
    );
  },
  source: `<ProductListing items={items} hasMore loading={loading} onLoadMore={loadNext} />`,
});

export const __namedExportsOrder = ['Playground', 'Endless'];

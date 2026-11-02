import { useState } from '../react.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { meta, playground, example } from './_helpers.jsx';

/** A picture for the stories: a gradient drawn as an image, so the stories need no files. */
export const art = (hue, hue2 = hue + 60) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 55%)"/><stop offset="1" stop-color="hsl(${hue2} 65% 28%)"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="210" cy="230" r="90" fill="rgba(255,255,255,.18)"/></svg>`)}`;

export default meta({
  title: 'Components/Product Card',
  component: ProductCard,
  args: { title: 'Mythic+ Bundle, 3+1 keys', price: '$149.00', badge: 'Hot offer', badgeVariant: 'error', rating: 4.9, meta: '2.1K sold' },
  argTypes: {
    badgeVariant: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'] },
    rating: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
  },
});

export const Playground = {
  ...playground({ source: '{}' }),
  render: (args) => {
    const [on, setOn] = useState(false);
    return (
      <div style={{ width: 240 }}>
        <ProductCard {...args} image={art(220)} favorite={{ active: on, onToggle: setOn }} />
      </div>
    );
  },
};

export const WithoutPicture = example({
  name: 'Without a picture',
  description: 'Without a picture the area shows the icon of the catalog',
  render: () => (
    <div style={{ width: 240 }}>
      <ProductCard title="Gift card, 50" price="$50.00" rating={4.8} meta="320 sold" />
    </div>
  ),
  source: `<ProductCard title="Gift card, 50" price="$50.00" rating={4.8} meta="320 sold" />`,
});

export const __namedExportsOrder = ['Playground', 'WithoutPicture'];

import { h } from '../../react.js';
import { OfferSellingPoints } from '../organisms/OfferSellingPoints.js';
import { meta, playground, example, Phone } from '../../stories/_helpers.js';
import { glyph } from './_art.js';

const POINTS = [
  { id: '1', title: 'Verified boosters', iconImage: glyph(260), text: '<p>Every booster passes an <strong>identity and skill check</strong> before the first order.</p>' },
  { id: '2', title: 'Start in 15 minutes', iconImage: glyph(40), text: '<ul><li>Boosters are online around the clock</li><li>Pick the start time at checkout</li></ul>' },
  { id: '3', title: 'Money-back guarantee', iconImage: glyph(150), text: '<p>Not satisfied? We refund the unused part of the order.</p>' },
  { id: '4', title: 'Account safety', iconImage: glyph(330) },
  { id: '5', title: 'Live progress tracking', iconImage: glyph(200), text: '<ol><li>Open the order</li><li>Follow the progress bar</li></ol>' },
  { id: '6', title: 'No title, skipped' , text: 'x' },
];
POINTS[5].title = '';
const wrap = (c) => h('div', { style: { width: '100%', maxWidth: 920 } }, c);

export default meta({
  title: 'Overgear/Organisms/OfferSellingPoints', component: OfferSellingPoints,
  args: { sellingPoints: POINTS }, argTypes: { sellingPoints: { control: 'object' } },
});
export const Playground = { ...playground({ source: `<OfferSellingPoints sellingPoints={points} />` }), render: (args) => wrap(h(OfferSellingPoints, args)) };
export const Wide = example({
  name: 'Wide', description: 'In a wide container the pills wrap. Hover or tap one with a text to open its panel.',
  render: () => wrap(h(OfferSellingPoints, { sellingPoints: POINTS })),
  source: `<OfferSellingPoints sellingPoints={[{ id: '1', title: 'Verified boosters', iconImage, text: '<p>...</p>' }]} />`,
});
export const Mobile = example({
  name: 'Mobile', description: 'In a narrow container the row scrolls sideways; the panels are drawn over the page, so the scrolling does not clip them.',
  render: () => h(Phone, { height: 200 }, h(OfferSellingPoints, { sellingPoints: POINTS })),
  source: `<div style={{ width: 340 }}><OfferSellingPoints sellingPoints={points} /></div>`,
});
export const WithoutText = example({
  name: 'Without Text', description: 'Pills without text are plain labels, not buttons.',
  render: () => wrap(h(OfferSellingPoints, { sellingPoints: POINTS.map((p) => ({ ...p, text: undefined })).slice(0, 4) })),
  source: `<OfferSellingPoints sellingPoints={[{ id: '1', title: 'Account safety' }]} />`,
});
export const __namedExportsOrder = ['Playground', 'Wide', 'Mobile', 'WithoutText'];

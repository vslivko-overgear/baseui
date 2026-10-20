import { h, useState } from '../react.js';
import { Pagination } from '../components/Pagination.js';
import { meta, playground } from './_helpers.js';

export default meta({ title: 'Components/Pagination', component: Pagination, args: { total: 20, siblings: 1, autoScroll: false, autoScrollInterval: 2000, loop: true }, argTypes: { autoScroll: { control: 'boolean' }, autoScrollInterval: { control: { type: 'range', min: 500, max: 5000, step: 250 }, if: { arg: 'autoScroll', eq: true } }, loop: { control: 'boolean', if: { arg: 'autoScroll', eq: true } }, total: { control: { type: 'range', min: 1, max: 50, step: 1 } }, siblings: { control: { type: 'range', min: 0, max: 3, step: 1 } } } });
function Demo(args) { const [page, setPage] = useState(5); return h(Pagination, { ...args, page: Math.min(page, args.total), onPageChange: setPage }); }
export const Playground = { ...playground({ source: `<Pagination page={page} total={20} onPageChange={setPage} autoScroll autoScrollInterval={2000} />` }), render: (args) => h(Demo, args) };
export const __namedExportsOrder = ['Playground'];

import { h } from '../react.js';
import { ToggleButton } from '../components/Button.js';
import { Heart } from './_ui.js';
import { meta, playground, example, Row } from './_helpers.js';

export default meta({ title: 'Components/Toggle Button', component: ToggleButton, args: { label: 'Bold', size: 'md', isDisabled: false }, argTypes: { isDisabled: { control: 'boolean' }, label: { control: 'text' }, size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg'] } } });
export const Playground = playground({ source: `<ToggleButton label="Bold" />` });
export const WithIcon = example({ name: 'With Icon', render: () => h(Row, null, h(ToggleButton, { label: 'Favorite', icon: h(Heart, { size: 20 }), isPressed: false })), source: `<ToggleButton label="Favorite" icon={<HeartIcon />} />` });
export const __namedExportsOrder = ['Playground', 'WithIcon'];

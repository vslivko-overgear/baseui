import { CheckboxGroup } from '../components/CheckboxGroup.js';
import { meta, playground } from './_helpers.js';

const methods = [{ value: 'sms', label: 'SMS' }, { value: 'email', label: 'E-mail' }, { value: 'push', label: 'Push' }, { value: 'call', label: 'Call' }];
export default meta({
  title: 'Components/CheckboxGroup', component: CheckboxGroup,
  args: { title: 'Notification methods', options: methods, defaultValue: ['email'], size: 'md', caption: '', error: '' },
  argTypes: { title: { control: 'text' }, size: { control: 'inline-radio', options: ['sm', 'md'] }, caption: { control: 'text' }, error: { control: 'text' } },
});
export const Playground = playground({ source: '{}' });
export const WithCaption = { name: 'With Caption', args: { caption: 'You can choose several' }, parameters: { docs: { description: { story: 'A caption under the group.' }, source: { originalSource: `<CheckboxGroup title="Methods" options={options} caption="You can choose several" />` } } } };
export const WithError = { name: 'With Error', args: { defaultValue: [], error: 'Choose at least one method' }, parameters: { docs: { description: { story: 'A validation error: a message under the group, the boxes stay neutral.' }, source: { originalSource: `<CheckboxGroup title="Methods" options={options} error="Choose at least one method" />` } } } };
export const Subgroup = {
  name: 'Subgroup',
  args: { title: 'Notifications', parent: 'All notifications', defaultValue: ['orders'], options: [{ value: 'orders', label: 'Orders' }, { value: 'promo', label: 'Promotions' }, { value: 'news', label: 'News' }] },
  parameters: { docs: { description: { story: '`parent` is the “select all” checkbox: it toggles every option and shows a dash on a partial selection; the options are indented.' }, source: { originalSource: `<CheckboxGroup parent="All notifications" options={options} />` } } },
};
export const __namedExportsOrder = ['Playground', 'WithCaption', 'WithError', 'Subgroup'];

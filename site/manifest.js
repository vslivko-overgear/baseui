// Documentation tree. Names, order and nesting follow Astryx; page content comes from the story modules.
//   F(name)  – foundations page          N(name) – baseui component written in src/stories
//   B(file)  – compiled baseui component in lib/
// A page is one story `file` (one component). `children` are separate pages of its important subcomponents;
// `examples` are the stories of minor subcomponents shown as examples on the page.
import { TEMPLATES } from '../src/templates/registry.js';

const F = (name) => `../src/foundations/${name}.stories.js`;
const N = (name) => `../src/stories/${name}.stories.js`;
const B = (file) => `../lib/${file}.js`;


export default [
  {
    // no heading in the menu: the gallery and the theme settings are two tabs of their own; a template page opens from its card
    section: 'Templates',
    hideTitle: true,
    items: [
      { title: 'Templates', page: 'templates', icon: 'LayoutGrid01', lead: 'Ready pages built from the components of the system, with mock data' },
      { group: 'Pages', hidden: true, items: TEMPLATES.map((t) => ({ title: t.title, template: t.id, lead: t.description })) },
    ],
  },
  {
    section: 'Theming',
    hideTitle: true,
    items: [
      { title: 'Theme Settings', file: '../src/theming/ThemeSettings.stories.js', icon: 'Palette', lead: 'Pick a ready theme, the brand color, the shape, the base radius and the fonts. Everything is applied at once to this site and stored in a cookie on your device' },
    ],
  },
  {
    section: 'Foundations',
    items: [
      { title: 'All Tokens', file: F('AllTokens'), icon: 'Hash01' },
      { title: 'Color', file: F('Color'), icon: 'Droplets01' },
      { title: 'Constitution', file: F('Constitution'), icon: 'Scales01', lead: 'The design rules to follow so that an interface is at least acceptable: what to do and what not to do' },
      { title: 'Focus', file: F('Focus'), icon: 'Scan' },
      { title: 'Icons', file: F('Icons'), icon: 'Star01', lead: 'The icon catalog. Choose outline or filled, and the stroke width for outline' },
      { title: 'Layout', file: F('Layout'), icon: 'LayoutGrid01' },
      { title: 'Motion', file: F('Motion'), icon: 'PlayCircle' },
      { title: 'Radius', file: F('Radius'), icon: 'IntersectSquare', lead: 'Corner radii: the named scale, and the custom radii that make nested corners concentric' },
      { title: 'Shadow', file: F('Shadow'), icon: 'LayersTwo01' },
      { title: 'Spacing', file: F('Spacing'), icon: 'Ruler' },
      { title: 'Typography', file: F('Typography'), icon: 'Type01', lead: 'Type styles for headings and text' },
    ],
  },
  {
    section: 'Components',
    items: [
      { title: 'Avatar', file: N('Avatar'), examples: [{ title: 'Avatar Status Dot', file: N('AvatarStatusDot') }], children: [{ title: 'Avatar Group', file: N('AvatarGroup'), examples: [{ title: 'Avatar Group Overflow', file: N('AvatarGroupOverflow') }] }] },
      { title: 'Badge', file: N('Badge') },
      { title: 'Banner', file: N('Banner') },
      { title: 'Constitution Banner', file: N('ConstitutionBanner'), lead: 'The strip across the top of a prototype that warns it breaks the design constitution' },
      { title: 'Breadcrumbs', file: N('Breadcrumbs') },
      { title: 'Button', file: N('Button'), children: [{ title: 'Icon Button', file: N('IconButton') }, { title: 'Button Group', file: N('ButtonGroup'), lead: 'The layout of the buttons of one decision: a row, or a column in which every button fills the width' }] },
      { title: 'Card', file: N('Card'), children: [{ title: 'Clickable Card', file: N('ClickableCard') }, { title: 'Selectable Card', file: N('SelectableCard') }] },
      { title: 'Collapsible', file: N('Collapsible'), examples: [{ title: 'Collapsible Group', file: N('CollapsibleGroup') }] },
      { title: 'Dialog', file: N('Dialog'), lead: 'A modal window for focused content. On small screens it becomes a bottom sheet', children: [{ title: 'Alert Dialog', file: N('AlertDialog') }] },
      { title: 'Divider', file: N('Divider') },
      { title: 'Dropdown', file: N('Dropdown'), lead: 'The list that opens under a Selector or a Typeahead' },
      { title: 'Form', file: N('Form'), lead: 'The layout of a form: fields in rows with one gap in both directions', children: [{ title: 'Form Row', file: N('FormRow'), lead: 'Fields side by side, equal or in a ratio' }, { title: 'Form Section', file: N('FormSection'), lead: 'A titled group of fields' }] },
      {
        group: 'Inputs',
        items: [
        { title: 'Calendar', file: N('Calendar'), lead: 'A month grid for picking a date or a date range', children: [{ title: 'Date Picker', file: N('DatePicker'), lead: 'A date field that opens the calendar in a popover, or in a Dialog sheet on small screens' }] },
        { title: 'Checkbox', file: N('Checkbox'), lead: 'A box that turns one option on or off', children: [{ title: 'Checkbox Group', file: N('CheckboxGroup'), lead: 'A list of checkboxes with a title, a caption, an error and nested subgroups with a parent checkbox' }] },
        { title: 'Number Input', file: N('NumberInput') },
        { title: 'OTP Input', file: N('OtpInput'), lead: 'A field for entering a one-time code' },
        { title: 'Radio', file: N('RadioGroup'), lead: 'Radio buttons for choosing one option from a list', examples: [{ title: 'Radio List Item', file: N('Radio'), props: true }] },
        { title: 'Rating', file: N('Rating'), lead: 'Stars the user picks to leave a rating' },
        { title: 'Selector', file: N('Selector'), lead: 'A field, or any element, that opens a list of options', examples: [{ title: 'Selector Trigger', file: N('SelectorTrigger') }] },
        { title: 'Slider', file: N('Slider') },
        { title: 'Switch', file: N('Switch'), lead: 'A control that turns a setting on or off immediately' },
        { title: 'Text Input', file: N('TextInput'), lead: 'A single-line or multi-line text field with a floating label' },
        { title: 'Typeahead', file: N('Typeahead'), lead: 'A text field that suggests options as you type' },
        ],
      },
      {
        group: 'Mobile Navigation',
        items: [
          { title: 'Navbar', file: N('Navbar'), lead: 'The bar at the top of a mobile screen' },
          { title: 'Bottom Bar', file: N('BottomBar'), lead: 'The bar at the bottom of a mobile screen for switching sections' },
        ],
      },
      { title: 'Layout', file: N('Stack'), lead: 'Containers that arrange content with consistent spacing', children: [{ title: 'Center', file: N('Center') }, { title: 'Grid', file: N('Grid') }, { title: 'Section', file: N('Section') }] },
      { title: 'Link', file: N('Link') },
      { title: 'List', file: N('List'), lead: 'A vertical list of rows with an optional title and divider. Text, titles and dividers line up with the content edge; hover reaches beyond it', children: [{ title: 'List Item', file: N('ListItem'), lead: 'A row with an icon or avatar, text, details and a control: the Avatar, Switch, Checkbox and Badge of the design system' }] },
      { title: 'Pagination', file: N('Pagination') },
      { title: 'Popover', file: N('Popover') },
      { title: 'Product Listing', file: N('ProductListing'), lead: 'A listing of products: cards that take the whole width of a row, whole rows, then Show more, an endless scroll or pagination by setting', children: [{ title: 'Product Card', file: N('ProductCard') }] },
      { title: 'Progress Bar', file: N('ProgressBar') },
      { title: 'Rating Display', file: N('RatingDisplay'), lead: 'Stars that show a rating, such as an average score' },
      { title: 'Segmented Control', file: N('SegmentedControl') },
      { title: 'Skeleton', file: N('Skeleton') },
      { title: 'Spinner', file: N('Spinner') },
      { title: 'Status', file: N('Status') },
      { title: 'Table', file: N('Table') },
      { title: 'Tabs', file: N('Tabs') },
      { title: 'Toast', file: N('Toast') },
      { title: 'Token', file: N('Token'), lead: 'A small token that can be selected or removed', children: [{ title: 'Token Group', file: N('TokenGroup'), lead: 'A group of tokens with single or multiple selection' }] },
      { title: 'Tooltip', file: N('Tooltip') },
    ],
  },
  {
    section: 'Tools',
    items: [
      { title: 'Radius Check', file: '../src/tools/RadiusCheck.stories.js', icon: 'Tool01', lead: 'Checks that nested rounded corners are concentric: the inner radius is the outer radius minus the inset' },
      { title: 'Size Balance', file: '../src/tools/SizeBalance.stories.js', icon: 'Tool01', lead: 'Measures a screen from the 16px body text: one ladder of text sizes and one of control heights, so nothing is small here and too big there' },
      { title: 'Spacing Balance', file: '../src/tools/SpacingBalance.stories.js', icon: 'Tool01', lead: 'Checks proximity: things that belong together sit closer than things that do not' },
    ],
  },
];

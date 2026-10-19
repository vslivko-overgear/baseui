// Documentation tree. Names, order and nesting follow Astryx; page content comes from the story modules.
//   F(name)  – foundations page          N(name) – baseui component written in src/stories
//   B(file)  – compiled baseui component in lib/
// A page is one story `file` (one component). `children` are separate pages of its important subcomponents;
// `examples` are the stories of minor subcomponents shown as examples on the page.
const F = (name) => `../src/foundations/${name}.stories.js`;
const N = (name) => `../src/stories/${name}.stories.js`;
const B = (file) => `../lib/${file}.js`;


export default [
  {
    section: 'Theming',
    items: [
      { title: 'Theme Settings', file: '../src/theming/ThemeSettings.stories.js', icon: 'Palette', lead: 'Pick a ready theme, the brand color, the shape, the base radius and the fonts. Everything is applied at once to this site and stored in a cookie on your device.' },
    ],
  },
  {
    section: 'Foundations',
    items: [
      { title: 'All Tokens', file: F('AllTokens'), icon: 'Hash01' },
      { title: 'Color', file: F('Color'), icon: 'Droplets01' },
      { title: 'Focus', file: F('Focus'), icon: 'Scan' },
      { title: 'Icons', file: B('Icons.stories-n14M4pOg'), icon: 'Star01', lead: 'The icon catalog. Choose outline or filled, and the stroke width for outline.' },
      { title: 'Layout', file: F('Layout'), icon: 'LayoutGrid01' },
      { title: 'Motion', file: F('Motion'), icon: 'PlayCircle' },
      { title: 'Shadow', file: F('Shadow'), icon: 'LayersTwo01' },
      { title: 'Shape', file: F('Shape'), icon: 'IntersectSquare' },
      { title: 'Spacing', file: F('Spacing'), icon: 'Ruler' },
      { title: 'Typography', file: B('Typography.stories-CQDoRPEx'), icon: 'Type01', lead: 'Type styles for headings and text.' },
    ],
  },
  {
    section: 'Components',
    items: [
      { title: 'Avatar', file: N('Avatar'), examples: [{ title: 'Avatar Status Dot', file: N('AvatarStatusDot') }], children: [{ title: 'Avatar Group', file: N('AvatarGroup'), examples: [{ title: 'Avatar Group Overflow', file: N('AvatarGroupOverflow') }] }] },
      { title: 'Badge', file: N('Badge') },
      { title: 'Banner', file: N('Banner') },
      { title: 'Breadcrumbs', file: N('Breadcrumbs') },
      { title: 'Button', file: N('Button'), children: [{ title: 'Icon Button', file: N('IconButton') }] },
      { title: 'Card', file: N('Card'), children: [{ title: 'Clickable Card', file: N('ClickableCard') }, { title: 'Selectable Card', file: N('SelectableCard') }] },
      { title: 'Collapsible', file: N('Collapsible'), examples: [{ title: 'Collapsible Group', file: N('CollapsibleGroup') }] },
      { title: 'Dialog', file: B('Modal.stories-BG7Qmigd'), lead: 'A modal window for focused content. On small screens it becomes a bottom sheet.', children: [{ title: 'Alert Dialog', file: N('AlertDialog') }] },
      { title: 'Divider', file: N('Divider') },
      { title: 'Dropdown', file: N('Dropdown'), lead: 'The list that opens under a Selector or a Typeahead.' },
      {
        group: 'Inputs',
        items: [
        { title: 'Calendar', file: N('Calendar'), lead: 'A month grid for picking a date or a date range.', children: [{ title: 'Date Picker', file: N('DatePicker'), lead: 'A date field that opens the calendar in a popover, or in a Dialog sheet on small screens.' }] },
        { title: 'Checkbox', file: B('Checkbox.stories-CjVZ5VOE'), lead: 'A box that turns one option on or off.', children: [{ title: 'Checkbox Group', file: B('CheckboxGroup.stories-DyCBCBrP'), lead: 'A list of checkboxes with a title, a caption, an error and nested subgroups with a parent checkbox.' }] },
        { title: 'Number Input', file: N('NumberInput') },
        { title: 'OTP Input', file: B('OtpInput.stories-DMTeWrJE'), lead: 'A field for entering a one-time code.' },
        { title: 'Radio', file: B('RadioGroup.stories-DVXazEy6'), lead: 'Radio buttons for choosing one option from a list.', examples: [{ title: 'Radio List Item', file: B('Radio.stories-ByX4his4'), props: true }] },
        { title: 'Rating', file: N('Rating'), lead: 'Stars the user picks to leave a rating.' },
        { title: 'Selector', file: B('Select.stories-vOU6jfFc'), lead: 'A field, or any element, that opens a list of options.', examples: [{ title: 'Selector Trigger', file: N('SelectTrigger') }] },
        { title: 'Slider', file: N('Slider') },
        { title: 'Switch', file: B('Switch.stories-UfYPEzH7'), lead: 'A control that turns a setting on or off immediately.' },
        { title: 'Text Input', file: B('TextField.stories-JboKGoC9'), lead: 'A single-line or multi-line text field with a floating label.' },
        { title: 'Typeahead', file: B('Autocomplete.stories-CLnOUoA7'), lead: 'A text field that suggests options as you type.' },
        ],
      },
      {
        group: 'Mobile Navigation',
        items: [
          { title: 'Navbar', file: N('Navbar'), lead: 'The bar at the top of a mobile screen.' },
          { title: 'Bottom Bar', file: N('BottomBar'), lead: 'The bar at the bottom of a mobile screen for switching sections.' },
        ],
      },
      { title: 'Layout', file: N('Stack'), lead: 'Containers that arrange content with consistent spacing.', children: [{ title: 'Center', file: N('Center') }, { title: 'Grid', file: N('Grid') }, { title: 'Section', file: N('Section') }] },
      { title: 'Link', file: N('Link') },
      { title: 'List', file: N('List'), lead: 'A vertical list of rows with an optional title and divider. Text, titles and dividers line up with the content edge; hover reaches beyond it.', children: [{ title: 'List Item', file: N('ListItem'), lead: 'A row with an icon or avatar, text, details and a control: the Avatar, Switch, Checkbox and Badge of the design system.' }] },
      { title: 'Pagination', file: N('Pagination') },
      { title: 'Popover', file: N('Popover') },
      { title: 'Progress Bar', file: N('ProgressBar') },
      { title: 'Rating Display', file: N('RatingDisplay'), lead: 'Stars that show a rating, such as an average score.' },
      { title: 'Segmented Control', file: N('SegmentedControl') },
      { title: 'Skeleton', file: N('Skeleton') },
      { title: 'Spinner', file: N('Spinner') },
      { title: 'Status', file: N('Status') },
      { title: 'Table', file: N('Table') },
      { title: 'Tabs', file: N('Tabs') },
      { title: 'Toast', file: N('Toast') },
      { title: 'Token', file: B('Chip.stories-BFj78RSq'), lead: 'A small chip that can be selected or removed.', children: [{ title: 'Token Group', file: B('ChipGroup.stories-DmXtmuTG'), lead: 'A group of tokens with single or multiple selection.' }] },
      { title: 'Tooltip', file: N('Tooltip') },
    ],
  },
];

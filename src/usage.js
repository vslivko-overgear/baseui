// Usage guidance per component: what to do and what not to do. It is attached to the component by describe() (src/doc.js),
// shown as the Usage block of its page, and written to docs/components/<name>.md, where an agent reads it before it builds.
// Keys are the names of the exported components. Rules that hold for the whole interface are in the constitution (rules.js);
// these are the choices inside one component: when to reach for it, and what goes wrong.
// Shaped by the usage guidelines of Astryx, reworded for the components and API of baseui; guidance that depends on
// Astryx-only parts (StyleX, xstyle, disabledMessage, Drawer, Stepper) is left out.

export const USAGE = {
  // ------------------------------------------------------------------ actions
  ButtonGroup: {
    do: [
      'Put the buttons of one decision in a ButtonGroup; let the group, not the buttons, decide the width',
      'Use `orientation="vertical"` when the buttons are stacked: they fill the width of the group',
      'In a vertical group put the primary action first; use `stackOnMobile` for a footer that is a row on a desktop and a column on a phone',
    ],
    dont: [
      'Set `width="100%"` on each button of a stack by hand: the group does it',
      'Put two primary buttons in one group: one primary, the rest secondary or ghost',
      'Use it for unrelated buttons or for a toolbar of icon buttons: use ControlRow',
    ],
  },
  Form: {
    do: [
      'Lay a form out with Form: one gap between rows and between columns, so the distance is the same in both directions',
      'Put fields that belong together in a FormRow (city and country, expiry and CVC); use a ratio such as [2, 1] for a long field and a short one',
      'Group a long form in FormSections with a heading; the sections stand at the group distance, and when a form has sections everything in it is in a section (a section without a title is fine)',
      'Put a switch or a checkbox beside a field in a FormRow with `align="center"`; a button beside a field takes the height of the fields by itself',
    ],
    dont: [
      'Space the fields of one form with different gaps, or give a field a margin (D18)',
      'Put more than four fields in a row, or fields of very different heights side by side',
      'Build the rows with a Stack and a Grid of your own: the gaps drift apart',
    ],
  },
  Button: {
    do: [
      'Give one primary button to the most important action of a view; use secondary or ghost for the rest',
      'Label it with the action: "Save changes", "Delete account", "Send invite"',
      'Show progress for an action that takes time: `loading`, or `clickAction` for an async handler',
      'Use IconButton for a button with only an icon',
      'Beside an input, take the height and the text size of the input: size lg and textSize 16 for a 56px input, size md and textSize 14 for a 48px one',
    ],
    dont: [
      'Put more than one primary button in the same view',
      'Use the destructive variant for something irreversible without a confirmation step (AlertDialog)',
      'Use a button to go to another page: pass `href`, or use Link. Buttons act, links navigate',
      'Label it "OK", "Submit" or "Click here"',
    ],
  },
  IconButton: {
    do: [
      'Give it a specific `label` ("Delete conversation", not "Delete"): it is the accessible name and the tooltip',
      'Use the ghost variant in toolbars and dense areas',
      'Keep the tooltip on, so that sighted people get the hint a screen reader gets from the label',
    ],
    dont: [
      'Use it when the icon alone does not say what happens: use Button with text',
      'Turn the tooltip off for an icon that has no text beside it',
    ],
  },
  Link: {
    do: ['Write link text that says where it goes', 'Use it for navigation, inside text or on its own', 'Keep the default: the color of the text and an underline'],
    dont: ['Use a link for an action that does not navigate: use Button', 'Write "click here" or "read more"', 'Recolor a link in text or take its underline away'],
  },

  // ------------------------------------------------------------------ containers
  Card: {
    do: [
      'Ask "could I reorder or remove this on its own?": if yes it is a card (one profile, one notification, one metric, one product)',
      'Try removing the card first: spacing and type often group things well enough',
      'Keep padding the same across sibling cards so they line up in a grid',
      'Truncate long ids and urls inside a card instead of letting them stretch it',
    ],
    dont: [
      'Use cards as the default way to group things, or wrap page sections ("General settings", a form group) in them: use Section or a heading with a Stack',
      'Nest a card in a card',
      'Repeat identical cards of icon, heading and text: vary the layout, or ask whether cards are needed',
      'Use a card color variant to show status: use Banner or Badge',
    ],
  },
  ClickableCard: {
    do: ['Give the card one action (`href` or `onClick`) and a `label` that names it', 'Make the whole card the target'],
    dont: ['Put buttons or links inside a clickable card: two competing click targets'],
  },
  SelectableCard: {
    do: ['Use it to choose from a few rich options, like plans, with a clear selected state', 'Name the group for what is being chosen'],
    dont: ['Use it for a long list of choices: use a list with Checkbox or Radio', 'Put interactive elements inside it'],
  },
  Section: {
    do: ['Use it for a region of a page: a settings panel, a form group, a sidebar part', 'Pair it with a heading and a Stack'],
    dont: ['Use a Card when you mean a page region'],
  },
  ProductCard: {
    do: ['Use it for a compact product summary: a picture, the price, a title of two lines, the rating and one line of meta; when a listing mixes games, put the name of the game above the price with `eyebrow`', 'Give the heart through `favorite` when the product can be kept', 'Put it inside a ProductListing, which lays the cards in rows'],
    dont: ['Use it when the content needs a different structure than this compact card supports', 'Add more lines to it (a description, three badges): a listing is scanned, not read'],
  },
  ProductListing: {
    do: ['Let the cards take the whole width of a row: the columns reflow and the listing always shows whole rows', 'Choose `more="button"`, `more="infinite"` or `more="pagination"` for the navigation the product needs', 'Set `hasMore`, `onLoadMore` and `loading` when the products come from a server'],
    dont: ['Leave a gap at the end of a row, or end a loaded part in the middle of a row', 'Mix loading and pagination state from different data sources'],
  },
  Group: { do: ['Use it for a heading with its content: the heading sits tight (8px) to what it names', 'Put the content in one block and let the Stack around the groups set the distance between them'], dont: ['Space a heading from its content as far as from the block above', 'Pull a block closer with a negative margin: put it in the same Group'] },
  Bleed: { do: ['Use it for a row of tags, a scroller or a listing that must reach the screen edges', 'Keep the first item on the edge of the text: the padding stays inside', 'Use `outset` when only a card background should reach out and the picture keeps the edge'], dont: ['Write a negative margin for it by hand', 'Use it for text, which must keep its margin'] },
  Stack: {
    do: ['Use `relation` (tight, related, group, section) for the gap when the blocks belong together to a degree; use `gap` for a number of the scale', 'Use `gap` for the space between items, never margins on the children', 'Let items flow with `wrap` when they do not fit'],
    dont: ['Nest stacks inside stacks to get a grid: use Grid'],
  },
  HStack: { do: ['Use `gap` for the space between items', 'Use `wrap` for a row that must reflow'], dont: ['Use a wrapping HStack as a grid: use Grid'] },
  VStack: { do: ['Use `gap` for the space between items'], dont: ['Nest stacks when one stack with a larger gap does it'] },
  Grid: {
    do: [
      'Use columns that reflow, like `repeat(auto-fit, minmax(240px, 1fr))`, for anything that must work on a phone',
      'Use `gap` for the space between cells',
    ],
    dont: [
      'Use `columns={4}` for a row that must survive a narrow screen: a number never reflows',
      'Write your own CSS grid when Grid does it',
    ],
  },
  Divider: { do: ['Use it between sections that spacing alone does not separate'], dont: ['Overuse it: rely on spacing and layout first'] },

  // ------------------------------------------------------------------ feedback
  Banner: {
    do: [
      'Choose the status that matches the message: info for news, warning for caution, error for problems, success for confirmation',
      'Let people close info and success banners; keep an error banner until the problem is fixed',
      'Keep the title short and scannable: "Payment failed"',
      'Say the status in the text: the icon and color are not enough for a screen reader',
    ],
    dont: [
      'Use a banner for a message that should disappear on its own: use Toast',
      'Stack several banners of the same status: combine them into one',
    ],
  },
  ToastProvider: {
    do: [
      'Keep it to a few words that say what happened: "Changes saved"',
      'Add a short undo for a reversible action',
      'Use the error type for failures that need attention but not at once: it stays until closed',
    ],
    dont: [
      'Use a toast for an error that blocks the person: use Banner',
      'Put long or multi-line content in it: it goes away before it is read',
      'Show form validation errors as toasts: show them next to the field',
    ],
  },
  Status: {
    do: [
      'Give an empty state a title that says what is empty and why, and a button (`actionLabel`) that says what to do next',
      'Pick the status that fits: neutral for empty, accent for news, and success, warning, error for outcomes',
    ],
    dont: ['Write "No data"', 'Use it for an error that needs action at once: use Banner'],
  },
  Badge: {
    do: [
      'Badge only what a person needs to notice or act on: errors, warnings, items that wait for them',
      'Use success, warning and error variants only for system status; use the color variants to categorize (team, type, priority)',
      'Keep the label to one or two words',
      'Put a text label next to any icon',
    ],
    dont: [
      'Put a success badge on every healthy item: when every row says "Active", none stands out',
      'Use a badge for metadata (a duration, a date, a description): use supporting text. A counter on a tab or an icon is what the counter type is for',
      'Repeat the same badge in every row of a table',
      'Make a badge clickable: it is a read-only indicator',
    ],
  },
  Tooltip: {
    do: ['Keep it short, under about 140 characters of plain text', 'Use it to name icon-only controls'],
    dont: ['Put links or buttons in a tooltip: use Popover', 'Put in it what a person needs to finish the task'],
  },
  Popover: {
    do: ['Keep it to one task or one piece of information', 'Give it a clear way to close'],
    dont: ['Open a popover from inside a popover'],
  },
  Skeleton: {
    do: ['Match the size and shape of the content that is loading'],
    dont: ['Use it when the size of the content is unknown: use Spinner', 'Use it together with a Spinner on the same area', 'Show it for ever: after a while show an error or an empty state'],
  },
  Spinner: {
    do: ['Give it a label that says what is loading'],
    dont: ['Use it for content whose size you know: use Skeleton', 'Show several spinners in one view'],
  },
  ProgressBar: {
    do: [
      'Use a determinate bar when the amount of work is known, and an indeterminate one when it is not',
      'Choose the color for the context: brand or accent for progress, success for done, warning or error for trouble',
      'Use `sections` for a process with named steps, like a password strength or a step 2 of 4',
      'Give it a label',
    ],
    dont: ['Use it for an action that is instant', 'Stack several bars for one operation: use one bar with a value', 'Put text or icons inside the bar'],
  },

  // ------------------------------------------------------------------ overlays
  Dialog: {
    do: [
      'Close it from a button with `data-dialog-close` (Done, Close, Cancel): the dialog closes by itself, a dialog in a dialog closes only its own',
      'Give it a clear title, so that a person knows at once what it asks',
      'Keep it to a single task, with a primary and a secondary action',
      'Use it for content that needs focus: a form, a choice, a detail',
    ],
    dont: [
      'Use it for a simple message: show it inline or as a Toast',
      'Open a dialog from inside a dialog: make it steps in one dialog',
      'Let it grow into a page: if the content is long or complex, use a page',
    ],
  },
  AlertDialog: {
    do: [
      'Label the confirm button with the action: "Delete project", not "OK"',
      'Say in the text what will happen and what cannot be undone',
      'Keep Cancel as the safe default',
    ],
    dont: ['Use it for an action that is not destructive: use Dialog', 'Signal danger by color alone: the label has to say it'],
  },
  Dropdown: {
    do: ['Keep items short and about an action', 'Group related items in sections when there are many'],
    dont: ['Use a menu for navigation', 'Put more than 10–12 items in one menu without sections'],
  },
  Collapsible: {
    do: ['Give the trigger a name that says what it opens', 'Start it open when the content is needed on the first view'],
    dont: ['Hide required or critical content in it', 'Nest collapsibles more than two levels', 'Use one for a single short paragraph: show the text'],
  },
  CollapsibleGroup: {
    do: ['Use single mode for settings and FAQ, where one section is open at a time', 'Use multiple mode when people compare sections'],
    dont: ['Wrap each item in a Card and also add dividers: pick one'],
  },

  // ------------------------------------------------------------------ inputs
  TextInput: {
    do: [
      'Give every field a visible label',
      'Explain a validation error in words, next to the field: "Email must include @", with `status="error"` and a caption',
      'Size the field to the expected input',
      'Mark as required only what is',
    ],
    dont: [
      'Use the placeholder in place of a label',
      'Use a single-line field for long text: use the multi-line one',
      'Mark every field as required',
    ],
  },
  Selector: {
    do: [
      'Give it a visible label and a placeholder that says what to choose ("Choose a country")',
      'Group the options in sections when there are more than about 8',
      'Use `multiple` when several can be chosen',
    ],
    dont: [
      'Use it for a menu of actions: use Dropdown',
      'Use it for two options: use SegmentedControl or Radio',
      'Use it for yes or no: use Switch or Checkbox',
      'Put more than about 20 options in without sections: use Typeahead',
    ],
  },
  Typeahead: {
    do: ['Use it for long lists and remote search, with a placeholder that says what can be searched', 'Keep the typed text and the chosen value as separate things'],
    dont: ['Use it for a short fixed list: use Selector', 'Place several of them side by side without clear labels'],
  },
  Switch: {
    do: ['Use it for a setting that applies at once, with no save', 'Give it a short label that names the setting'],
    dont: ['Use it for an option that needs a form to be submitted: use Checkbox', 'Use it for more than on and off'],
  },
  Checkbox: {
    do: ['Use it for an independent yes or no, or an option in a form', 'Write the label as the statement that is true when checked'],
    dont: ['Use one when only one choice is possible: use Radio'],
  },
  CheckboxGroup: {
    do: ['Keep it to 3–7 options; beyond that use Selector with `multiple`', 'Give the group a label that says what the choices are: "Export formats", not "Options"'],
    dont: ['Use it when only one thing can be chosen: use RadioGroup'],
  },
  Radio: { do: ['Use it inside a RadioGroup with a clear label'], dont: ['Use it alone: a single radio cannot be turned off'] },
  RadioGroup: {
    do: ['Keep it to 2–7 options', 'Pre-select a sensible default', 'Use clear labels that differ at a glance'],
    dont: ['Use it when several can be chosen: use CheckboxGroup', 'Use it for a long list: use Selector', 'Lay out more than 4 options in a row'],
  },
  SegmentedControl: {
    do: ['Use it to switch between 2–5 views or modes where all options should stay visible', 'Give it a label'],
    dont: ['Use it for navigation between pages: use Tabs', 'Use it for a single on and off: use Switch'],
  },
  Slider: {
    do: ['Give it a label', 'Show the value with its unit ("$50", "75%")', 'Use `range` to choose from and to'],
    dont: ['Use it to enter an exact number: use NumberInput', 'Give it so large a step that only a few positions exist: use SegmentedControl'],
  },
  NumberInput: {
    do: ['Set `min`, `max` and `step` to guide toward valid values', 'Show the unit'],
    dont: ['Use it for free text that has numbers in it: use TextInput'],
  },
  OtpInput: {
    do: ['Match the number of cells to the code that was sent', 'Show an error next to the cells when the code is wrong'],
    dont: ['Mask the digits unless the code is secret'],
  },
  Token: {
    do: [
      'Use it for a filter or a tag a person switches on (`pressed`) or takes away (`action`)',
      'Keep the label to one to three words',
      'Use `status` only for a real state, success or error',
    ],
    dont: ['Use a token for a main action or for navigation: use Button or Link', 'Hide the label unless the icon is universally understood'],
  },
  TokenGroup: {
    do: ['Use it for filters and tags a person can pick or remove', 'Keep a group to a handful of tokens; beyond that give it a search'],
    dont: ['Mix tokens that do different things (filter, remove, status) in one group'],
  },
  Calendar: {
    do: ['Limit the dates with `min`, `max` and constraints when only some are valid'],
    dont: ['Use it for something that is not a date'],
  },
  DatePicker: {
    do: ['Give it a label that says which date is meant', 'Limit the dates with `min` and `max` when only some are valid'],
    dont: ['Hide the label without context that makes the field obvious', 'Use it for free text that is not a date'],
  },

  // ------------------------------------------------------------------ navigation
  Tabs: {
    do: [
      'Use tabs to move between views of the same thing, with short labels',
      'Put what a tab owns in the panel: the `content` of its item, or `children` (a node or a function of the selected value). The page order is: what is true for the whole page, the tabs, then the panel',
      'Use a counter or a badge for what is waiting in a tab',
    ],
    dont: [
      'Change the title, the lead or anything above the row when a tab is pressed (D17): the panel is the place for it',
      'Use tabs for actions, or for the steps of a form',
      'Hide critical content in a tab nobody opens',
    ],
  },
  Breadcrumbs: {
    do: [
      'Put them above the page heading',
      'Keep the labels short and equal to the page titles they lead to',
      'Leave the last item as plain text for the current page (or hide it with `showCurrent={false}`)',
    ],
    dont: ['Use them as the main navigation: they come with a sidebar or a top bar', 'Show them on a top-level page with no parent', 'Let the trail grow beyond 5 levels'],
  },
  Pagination: {
    do: ['Place it below the content it controls', 'Pass the total so people see how much is left'],
    dont: ['Show it when everything fits on one page', 'Place it above the content'],
  },
  Navbar: {
    do: ['Use a short title; put the back button on the left and the actions on the right', 'Render it outside the padded page, so it spans the whole width of the screen at the top'],
    dont: ['Put more than two or three actions in it: group them in a menu', 'Put it inside a container with side padding: it turns into a narrow strip'],
  },
  BottomBar: {
    do: ['Use 2–6 top-level destinations, each with an icon and a short label', 'Use a filled icon for the active one', 'Render it outside the padded page, across the whole width of the screen'],
    dont: ['Use it for actions, or for more than six destinations'],
  },

  // ------------------------------------------------------------------ data
  List: {
    do: ['Give the list a header or a name that says what it holds', 'Use the start and end slots for icons, avatars and badges', 'Put a list in a box that scrolls into `bui-list-scroll`: it leaves the room for the highlight of a row, so the text stays on the edge of the content and the highlight is not cut'],
    dont: ['Put interactive elements inside an interactive row', 'Use a list for a single item', 'Mix clickable and plain rows without telling them apart', 'Take the bleed away (`--bui-list-bleed: 0`) from a list of a page: the text moves off the edge of the content'],
  },
  ListItem: {
    do: ['Make the whole row the target when it is clickable'],
    dont: ['Put buttons or links inside a clickable row'],
  },
  Table: {
    do: [
      'Use dense data as rows: a Table or a List with dividers, edge to edge, rather than a card per row',
      'Compose rich cells from Badge, Avatar and Status',
      'Set widths with `proportional()` and `pixel()`; give a text-heavy column a `minWidth`',
    ],
    dont: ['Use a table for content without consistent columns', 'Turn every feature on at once'],
  },
  Avatar: {
    do: [
      'Always pass the name: it makes the initials when the picture fails and is what a screen reader says',
      'Choose the size for the place: xsm or sm inline, md or lg in lists and cards, xl in a profile header',
      'Add a status dot when availability matters, like in chat',
    ],
    dont: ['Use an avatar for a logo or a product picture: use an image or an icon', 'Override its shape with CSS: use the `shape` prop'],
  },
  AvatarGroup: { do: ['Use it to show a few people at once, with an overflow count for the rest'], dont: ['Use it for more than a handful of people without the overflow'] },
  Icon: {
    do: [
      'Keep the standard stroke of the outline icon: do not set a weight to match the text',
      'Give an icon that stands alone a `label`',
      'Use one style of icon, outline, with filled for the active or selected state',
    ],
    dont: ['Let an icon be the only way to know something', 'Mix icon styles in one place', 'Draw raw SVG: use Icon'],
  },
  Rating: { do: ['Give it a label'], dont: ['Use stars for something that is not a rating'] },
};

/** The usage guidance of a component, by its name. Kept out of describe(): it is read by the documentation, the docs build and the agents, never by an app, so it must not ship with the components. */
export const usageOf = (component) => USAGE[component?.displayName || component?.name] || null;

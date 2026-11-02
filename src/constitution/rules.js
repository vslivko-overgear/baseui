// The design constitution: the rules an interface built with baseui must follow to be at least acceptable.
// One source for the Foundations page, the banner, the audit, CONSTITUTION.md and the agents that build prototypes.
//
// level   'must'   a violation makes the interface worse for people: it is always reported.
//         'should' a strong default: a violation is reported, a reason to keep it is welcome.
// check   'auto'   found by auditConstitution() in the browser (src/constitution/audit.js)
//         'partial' the audit finds the clear cases (markup that cannot be right); the rest needs a review
//         'tool'   found by a script in tools/ (named in `tool`)
//         'review' needs a person or an agent to look at the screen
// tools   extra scripts that also look at the rule (the row heights of D15 are measured by tools/check/sizes.mjs); `tool` and `tools` are run by tools/check/all.mjs
// signals phrases in a request that lead to a violation; an agent matches them in any language.
// source  where the rule comes from: WCAG 2.1 AA, the baseui tokens, or the UX writing principles the system follows.

export const CONSTITUTION_VERSION = '1.1';

export const CATEGORIES = [
  { id: 'A', title: 'Accessibility', lead: 'Everyone can see, reach and operate the interface. Based on WCAG 2.1 AA' },
  { id: 'U', title: 'Usability', lead: 'A person can finish what they came for, without guessing' },
  { id: 'H', title: 'Hierarchy and layout', lead: 'The eye knows where to go first and what belongs together' },
  { id: 'D', title: 'Design system', lead: 'The interface is made of the system, not next to it' },
  { id: 'C', title: 'Copy', lead: 'Words that say what happens and what to do' },
  { id: 'M', title: 'Motion and responsiveness', lead: 'It moves with care and fits the screen it is on' },
];

export const RULES = [
  // ---------------------------------------------------------------- Accessibility
  {
    id: 'A1', category: 'A', level: 'must', title: 'Text contrast',
    do: 'Keep text at 4.5:1 against its background (3:1 for large text, 24px or 18.66px bold). Use text-and-icon-primary or Secondary on background-primary or Secondary',
    dont: 'Do not set light gray text on white or text on a photo or a gradient without a scrim. Disabled controls are the only exception',
    why: 'Low contrast is the most common barrier: people with low vision, and anyone outdoors, cannot read it',
    source: 'WCAG 1.4.3', check: 'auto',
    signals: ['light gray text', 'faint or subtle text', 'low contrast', 'text over an image without overlay', 'pale text on white'],
  },
  {
    id: 'A2', category: 'A', level: 'must', title: 'Contrast of controls and graphics',
    do: 'Give borders of inputs, icons that carry meaning and chart marks 3:1 against what is behind them',
    dont: 'Do not draw a field or a button with a border or a fill so faint that its edge cannot be seen',
    why: 'A control that cannot be seen cannot be found',
    source: 'WCAG 1.4.11', check: 'review',
    signals: ['invisible border', 'ghost inputs', 'barely visible outline', 'very light icons'],
  },
  {
    id: 'A4', category: 'A', level: 'must', title: 'Keyboard',
    do: 'Make everything that works with a pointer work with the keyboard, in an order that follows the reading order. Use real buttons, links and inputs',
    dont: 'Do not build clickable divs or spans, positive tabindex, or hover-only actions',
    why: 'Keyboard and screen reader users, and switch users, depend on it',
    source: 'WCAG 2.1.1, 2.4.3', check: 'partial',
    signals: ['clickable div', 'hover-only menu', 'actions that appear only on hover', 'custom control without keyboard support'],
  },
  {
    id: 'A5', category: 'A', level: 'must', title: 'Visible focus',
    do: 'Leave the focus ring of the system (2px, 2px offset) on every interactive element',
    dont: 'Do not write outline: none, or restyle the ring so that it disappears on a background',
    why: 'Without it a keyboard user does not know where they are',
    source: 'WCAG 2.4.7', check: 'review', tools: ['tools/check/dialog-focus.mjs'],   // the ring is for the keyboard: a dialog opened with a finger or by code puts none on its first control
    signals: ['remove the outline', 'hide the focus ring', 'no focus styles', 'outline none'],
  },
  {
    id: 'A6', category: 'A', level: 'must', title: 'Labels on inputs',
    do: 'Give every input a visible label (the Text Input floating label counts) or at least an accessible name. Group radios and checkboxes under a legend',
    dont: 'Do not use the placeholder as the only label, and do not leave an icon-only button without an aria-label',
    why: 'A placeholder disappears when typing; a nameless control is announced as just "button"',
    source: 'WCAG 3.3.2, 4.1.2', check: 'auto',
    signals: ['placeholder instead of a label', 'no labels on the form', 'inputs without labels', 'icon buttons without text or names'],
  },
  {
    id: 'A7', category: 'A', level: 'must', title: 'Images',
    do: 'Describe meaningful images with alt text; give decorative ones an empty alt',
    dont: 'Do not leave img without alt, put text in images, or use a filename as alt',
    why: 'A screen reader cannot read a picture',
    source: 'WCAG 1.1.1', check: 'auto',
    signals: ['text inside an image', 'images without alt', 'screenshot of text'],
  },
  {
    id: 'A8', category: 'A', level: 'must', title: 'Not by color alone',
    do: 'Pair color with text, an icon or a shape: an error has a message, a status has a word, a chart series has a label',
    dont: 'Do not tell success from failure, or one chart series from another, by hue alone',
    why: 'About one in twelve men cannot tell some hues apart',
    source: 'WCAG 1.4.1', check: 'review',
    signals: ['red and green only', 'color-coded without labels', 'status shown only by color'],
  },
  {
    id: 'A9', category: 'A', level: 'must', title: 'Structure',
    do: 'Use one h1 per page, headings in order without skipping levels, landmarks (header, nav, main) and lists for lists',
    dont: 'Do not pick a heading level by its size, or build a table out of divs',
    why: 'Assistive technology navigates by structure',
    source: 'WCAG 1.3.1', check: 'auto',
    signals: ['h4 under h1', 'no page heading', 'everything in divs'],
  },
  {
    id: 'A10', category: 'A', level: 'must', title: 'Dialogs',
    do: 'Use the system Dialog: it moves focus in, keeps it inside, closes on Escape and gives focus back',
    dont: 'Do not build a modal from a positioned div, or open one on page load',
    why: 'A hand-made modal traps keyboard users or lets them fall behind it',
    source: 'WCAG 2.4.3, 3.2.1', check: 'partial',
    signals: ['custom modal', 'popup on page load', 'modal that cannot be closed', 'fullscreen overlay with no close'],
  },
  {
    id: 'A11', category: 'A', level: 'must', title: 'Errors are described',
    do: 'Say in words which field failed and why, next to the field, and mark it invalid for assistive technology (status="error" on the field)',
    dont: 'Do not show only a red border, or one generic "Something went wrong" at the top',
    why: 'A person has to know what to fix',
    source: 'WCAG 3.3.1', check: 'partial',
    signals: ['only a red outline for errors', 'generic error banner for a form', 'no error text'],
  },
  {
    id: 'A12', category: 'A', level: 'should', title: 'Media and time',
    do: 'Start media only on request, give it controls, and let people extend or switch off any time limit',
    dont: 'Do not autoplay sound or video, and do not move a carousel on a timer without a pause',
    why: 'Moving or timed content cannot be read at one’s own pace',
    source: 'WCAG 1.4.2, 2.2.1, 2.2.2', check: 'review',
    signals: ['autoplay', 'auto-advancing carousel', 'countdown that cannot be extended'],
  },
  {
    id: 'A13', category: 'A', level: 'should', title: 'Zoom and reflow',
    do: 'Let the layout survive 200% zoom and a 320px width: text reflows, nothing is cut off',
    dont: 'Do not lock the viewport scale (user-scalable=no), set fixed pixel heights on text containers, or clip overflowing text',
    why: 'Low-vision users magnify the page',
    source: 'WCAG 1.4.4, 1.4.10', check: 'review',
    signals: ['disable zoom', 'fixed height text box', 'pixel-perfect only at one size'],
  },

  // ---------------------------------------------------------------- Usability
  {
    id: 'U1', category: 'U', level: 'must', title: 'One primary action',
    do: 'Give a screen, a card or a dialog one primary action (Button variant primary). Other actions are secondary or ghost',
    dont: 'Do not put several primary buttons side by side, or make every action look equally loud',
    why: 'When everything shouts, a person cannot tell what to do next',
    source: 'Design critique: usability', check: 'auto',
    signals: ['make all the buttons primary', 'three big CTAs', 'every button highlighted'],
  },
  {
    id: 'U2', category: 'U', level: 'must', title: 'Interactive things look interactive',
    do: 'Make buttons, links and controls recognizable by shape, color or underline, and give them hover, pressed, disabled and focus states',
    dont: 'Do not style a link as plain text, or make plain text look like a button',
    why: 'People should not have to hover to find out what can be clicked',
    source: 'Design critique: usability', check: 'review',
    signals: ['links that look like text', 'flat text buttons everywhere', 'hidden controls'],
  },
  {
    id: 'U3', category: 'U', level: 'should', title: 'No needless steps',
    do: 'Ask only for what the task needs, in the fewest steps and screens, with sensible defaults',
    dont: 'Do not add a step, a field or a confirmation that nothing depends on',
    why: 'Every extra step loses people',
    source: 'Design critique: usability', check: 'review',
    signals: ['ask for everything up front', 'ten-field sign-up', 'extra confirmation step'],
  },
  {
    id: 'U4', category: 'U', level: 'must', title: 'All states of the data',
    do: 'Design loading (Skeleton, Spinner or ProgressBar), empty (Status), error and success for every list, table and request',
    dont: 'Do not leave a blank area while loading, or show only the filled state',
    why: 'A person who sees nothing assumes it is broken',
    source: 'Design system: states', check: 'review',
    signals: ['only the happy path', 'no loading state', 'no empty state', 'skip error handling'],
  },
  {
    id: 'U5', category: 'U', level: 'must', title: 'Destructive actions',
    do: 'Ask before deleting or overwriting, naming what will be lost, or offer an undo. Style the action as destructive',
    dont: 'Do not delete on one tap, or confirm with a bare "Are you sure?"',
    why: 'Mistakes happen, and some cannot be taken back',
    source: 'UX writing: confirmation dialogs', check: 'review',
    signals: ['delete without confirmation', 'instant delete', 'one-tap irreversible action'],
  },
  {
    id: 'U6', category: 'U', level: 'must', title: 'Where am I',
    do: 'Mark the current place in navigation (Tabs, Bottom Bar, Breadcrumbs, Pagination) and keep a way back',
    dont: 'Do not leave a person on a screen with no title, no current item and no exit',
    why: 'Orientation comes before everything else',
    source: 'Design critique: usability', check: 'review',
    signals: ['no navigation', 'no back button', 'dead-end screen'],
  },

  {
    id: 'U7', category: 'U', level: 'must', title: 'Links navigate, buttons act',
    do: 'Use a link (Link, or Button with `href`) to go to another place, and a button to do something: save, delete, submit, open a dialog',
    dont: 'Do not make a button that only navigates, a link that performs an action, or a clickable div for either',
    why: 'People and assistive technology expect a link to take them somewhere and a button to change something',
    source: 'WCAG 4.1.2; Astryx guidelines (adapted)', check: 'partial',
    signals: ['a button that goes to another page', 'a link that deletes', 'clickable text that submits'],
  },
  {
    id: 'U8', category: 'U', level: 'should', title: 'The right control for the choice',
    do: 'Match the control to the choice: Switch for an on or off that applies at once, Checkbox for an option in a form, Radio for one of 2–7, SegmentedControl for 2–5 views, Selector for one of many, Typeahead for a long or remote list, Dropdown for actions',
    dont: 'Do not use a Selector for two options or for yes and no, a Switch in a form that needs a save, or radio buttons for a long list',
    why: 'The shape of the control tells people how many choices there are and when the choice takes effect',
    source: 'Astryx guidelines (adapted); design critique: usability', check: 'review',
    signals: ['a dropdown for yes or no', 'a toggle in a form with a save button', 'radio buttons for twenty countries', 'a select with two options'],
  },
  {
    id: 'U9', category: 'U', level: 'must', title: 'Feedback in the right place',
    do: 'Put a message where it belongs: validation next to the field, a short outcome in a Toast, a problem that needs action in a Banner, the state of a whole view in Status. Show Skeleton when the layout of what loads is known and Spinner when it is not',
    dont: 'Do not show form errors as toasts, block a person with a toast, stack banners of one status, or show a skeleton and a spinner on the same area',
    why: 'A toast disappears before it is read; a banner that stays is for what has to be dealt with',
    source: 'UX writing: error messages; Astryx guidelines (adapted)', check: 'review',
    signals: ['show a toast for form errors', 'toast for a critical error', 'several banners at once', 'spinner on top of skeleton'],
  },
  {
    id: 'U10', category: 'U', level: 'must', title: 'Tooltips are hints',
    do: 'Use a tooltip for a short hint, such as the name of an icon-only button. Anything a person needs to finish the task goes in the interface. For a question mark beside a label use Hint: a tooltip with a mouse, a dialog with the text on a touch screen',
    dont: 'Do not put links, buttons or required information in a tooltip, or explain a disabled control only in a tooltip',
    why: 'A tooltip needs a hover, which touch screens do not have, and disabled controls ignore it',
    source: 'WCAG 1.4.13; Astryx guidelines (adapted)', check: 'partial', tools: ['tools/check/hint.mjs'],
    signals: ['a question mark with a tooltip', 'an info icon with a tooltip', 'explain it in a tooltip', 'a link in a tooltip', 'hide the instructions in a tooltip', 'tooltip on a disabled button as the explanation'],
  },

  // ---------------------------------------------------------------- Hierarchy and layout
  {
    id: 'U11', category: 'U', level: 'must', title: 'Do not disable a button for empty fields',
    do: 'Keep the submit button active while the form is incomplete. On press, show the errors next to the fields that are empty or wrong, say what to fix, and move focus to the first of them',
    dont: 'Do not disable a button because inputs are empty or invalid, and leave the person to guess why it does not work',
    why: 'A disabled button gives no reason and no way forward; an error next to the field does. Disabled is for an action that is not available, not for a form that is not filled',
    source: 'WCAG 3.3.1 and 3.3.3; UX writing and forms guidance', check: 'auto',
    signals: ['disable the button until the form is filled', 'the button is inactive while the fields are empty', 'enable the submit when valid'],
  },
  {
    id: 'D16', category: 'D', level: 'must', title: 'Links are text-colored and underlined',
    do: 'Set a link in the color of the text around it and underline it (the Link component does it by default). Use `underline="hover"` or `"none"` only for links that are clearly navigation: a menu, a footer list, a breadcrumb',
    dont: 'Do not recolor a link in a paragraph, a list or a hint, and do not remove its underline, so that color is the only mark of a link',
    why: 'Color alone does not tell a link from text for everyone; an underline does, and a link in the text color keeps the contrast of the text',
    source: 'WCAG 1.4.1 Use of color; baseui Link', check: 'auto',
    signals: ['make the links blue', 'links without underline', 'accent-colored links', 'style the links as buttons in text'],
  },
  {
    id: 'H1', category: 'H', level: 'should', title: 'One focal point',
    do: 'Make the most important thing the first one the eye lands on: the largest, the darkest or the one with the most space around it. Reading order follows importance',
    dont: 'Do not give several blocks the same weight, or let decoration outshine the content',
    why: 'Hierarchy tells people where to start',
    source: 'Design critique: visual hierarchy', check: 'review',
    signals: ['make everything big', 'everything bold', 'loud decorative elements'],
  },
  {
    id: 'H2', category: 'H', level: 'must', title: 'Readable type',
    do: 'Use the Typography tokens. Body text is 14px or more (16px for reading); 12px is the floor, for captions only. The text right under a heading of 24px or more (a description, a lead) is 16px or more and in the primary color',
    dont: 'Do not set text below 12px, or in uppercase for whole sentences, and do not put a small quiet note under a big heading: it detaches from the heading and gets skipped',
    why: 'Small type is the first thing to fail on a phone and for older eyes',
    source: 'Design critique: accessibility', check: 'auto',
    signals: ['tiny text', '10px', '11px', 'small print everywhere', 'all caps paragraph', 'a small gray line under the title'],
  },
  {
    id: 'H3', category: 'H', level: 'should', title: 'Proximity',
    do: 'Place related things closer than unrelated ones: the space inside a group is smaller than the space between groups, and the heavier the block above a new group (a card, a code block, a table), the more space before it. A heading belongs to what follows it: more space above it than below it. Wrap a heading and its content in one container. Use a ladder of gaps, one step per level of grouping (8 inside a group, 16 between related groups, 24 between blocks, 40 between sections), and keep it the same on a page: choose the step by how closely the blocks belong together (`Stack relation`, `Group`), not by a number (tools/check/spacing.mjs)',
    dont: 'Do not space everything evenly, put a heading as close to the block above as to its own text, crowd unrelated blocks together, or push a part of a group away from the rest by raising every gap to separate one thing',
    why: 'Distance is how people read grouping before they read a word',
    source: 'Design critique: visual hierarchy', check: 'tool', tool: 'tools/check/spacing.mjs',
    signals: ['same gap everywhere', 'cram everything together', 'no whitespace', 'a heading in a flat list of blocks'],
  },
  {
    id: 'H4', category: 'H', level: 'should', title: 'Line length and leading',
    do: 'Keep a paragraph to 45–75 characters per line and a line height of 1.4 or more',
    dont: 'Do not stretch text across a wide screen in one line, or tighten the line height to fit more',
    why: 'Long or tight lines are tiring to follow',
    source: 'Design critique: accessibility', check: 'review',
    signals: ['full-width paragraph', 'tight line height', 'wall of text'],
  },

  {
    id: 'H5', category: 'H', level: 'must', title: 'Primary text for the main text',
    do: 'Set the main text, the paragraphs, lists and descriptions a person has to read, in text-and-icon-primary. Use text-and-icon-secondary only for supporting text: captions, hints, metadata, timestamps, the helper line under a title',
    dont: 'Do not set a paragraph, a list or any main text in Secondary to make it quieter, and do not use Disabled for anything but disabled controls',
    why: 'Secondary has less contrast: a page set in it is harder to read, and when everything is quiet nothing leads',
    source: 'baseui Typography; WCAG 1.4.3', check: 'auto',
    signals: ['make the text gray', 'softer text color', 'secondary color for the body text', 'muted paragraphs', 'light gray description'],
  },

  // ---------------------------------------------------------------- Design system
  {
    id: 'H6', category: 'H', level: 'should', title: 'Rhythm of the page, and what pulls close',
    do: 'Give a page two kinds of gap: a large one between sections (40, never 48 or more) and small ones inside a section. A heading belongs to its content: the gap below it is at most 60% of its font size, 16 at least (a 28px page title is 16 from the first block under it), and it is smaller than the gap above it. A line that explains or continues the block above (a rating under a headline, a counter under a rating, a title over its tiles, a button over the list it opens) takes a gap of 8 to 16 to it, never the gap of the page. Set that with `Stack relation` and `Group`, or by putting them in one container',
    dont: 'Do not put one big gap (48 or more) between all the blocks of a page, and do not pull a block closer with a negative margin: the block belongs to another group, so wrap it in the group it belongs to',
    why: 'One gap for everything makes related things drift apart; the page then needs manual corrections block by block',
    source: 'Design critique: spacing and rhythm; baseui Layout', check: 'tool', tool: 'tools/check/spacing.mjs',
    signals: ['bring it closer', 'closer to the title', 'less space between them', 'move it up'],
  },
  {
    id: 'H7', category: 'H', level: 'should', title: 'Align by the content, let the container reach out',
    do: 'Keep the first item of every row (a title, tags, the picture of a card) on the same left edge. A row that scrolls or a listing runs out to the screen edges with `Bleed`, and keeps the padding inside so its first item stands on the edge of the text. When a card has a background around its picture, the picture stands on the edge and the background reaches out by its padding (`Bleed outset`). The top bar and the bottom bar of a screen span its whole width and sit outside the padded page, never inside it; the Navbar is pinned to the top and stays in view while the screen scrolls. The icon of an edge button of a bar stands on the margin of the content, so the button reaches past it (the Navbar does this itself)',
    dont: 'Do not shift a row or a listing by hand with a negative margin or a copy of the page padding, do not align the edge of the container instead of its content, and do not render a Navbar or a BottomBar inside a padded container: its edges are eaten and it stops being a bar',
    why: 'Eyes follow the left edge of the content: a container that is flush while its picture is not looks crooked',
    source: 'Design critique: alignment; baseui Layout', check: 'tool', tool: 'tools/check/spacing.mjs',
    signals: ['without side margins', 'to the edge of the screen', 'the cards are too far apart', 'scroll sideways'],
  },
  {
    id: 'H8', category: 'H', level: 'should', title: 'Layout is relative, not fixed',
    do: 'Build a layout as a flow: blocks are placed by the gap of their container (Stack, Group, relation), and their sizes come from their content or from their neighbours (fill the row, keep an aspect ratio). Put blocks that move together in one container, so when one of them grows, moves or goes away, everything after it follows. When a block is brought closer to another, the blocks that hang on it are brought with it',
    dont: 'Do not give a block a fixed height, an offset from the top or a margin made to match the position of a neighbour, and do not add a second gap to make up for the first: the next change will leave a hole or an overlap',
    why: 'A fixed number holds only for the layout it was measured on; a relation holds for every change',
    source: 'Layout: flow and constraints; baseui Layout', check: 'review',
    signals: ['it did not move with it', 'a gap is left', 'move it and the rest', 'fixed height', 'the content stayed'],
  },
  {
    id: 'H9', category: 'H', level: 'should', title: 'Two weights: bold and regular',
    do: 'Set the text you write yourself in one of two weights: bold for what leads (a title, a heading, a price, a name) and regular for the rest. Semi-bold comes only from the components that carry it (buttons, tabs, labels, list titles), or when the person asks for it in so many words. When a component brings its own weight, leave it',
    dont: 'Do not set semi-bold (500 or 600) on your own text, and do not add a third weight to make a line "a little" stronger or quieter: change its size or its color role instead',
    why: 'Two weights make the hierarchy readable at a glance; a third one blurs the line between a heading and a label and has to be told apart by eye',
    source: 'Design critique: type hierarchy; baseui Typography', check: 'review',
    signals: ['make it semibold', 'a bit bolder', 'slightly heavier', 'medium weight', 'not so bold'],
  },
  {
    id: 'D1', category: 'D', level: 'must', title: 'Tokens, not values',
    do: 'Take colors, type, spacing, radius, shadow and motion from the tokens (var(--baseui-…))',
    dont: 'Do not write hex colors, arbitrary pixel gaps, custom fonts or one-off shadows',
    why: 'Tokens carry the themes, the dark mode and the contrast; a literal value breaks them',
    source: 'Design system: token coverage', check: 'review',
    signals: ['use this exact hex', 'custom font', 'my own colors', 'make the shadow bigger than the scale'],
  },
  {
    id: 'D2', category: 'D', level: 'must', title: 'Components, not lookalikes',
    do: 'Use the system component when there is one: Button, Text Input, Selector, Switch, Dialog, Tabs, Table',
    dont: 'Do not restyle a div into a button, or write a second version of a component that exists',
    why: 'The system keeps behavior, states and accessibility together',
    source: 'Design system: components', check: 'review',
    signals: ['build a custom dropdown', 'my own button style', 'recreate the component'],
  },
  {
    id: 'D3', category: 'D', level: 'must', title: 'The spacing scale',
    do: 'Use the spacing tokens, counted in gaps of 4px: 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20 (2px to 80px)',
    dont: 'Do not use 5px, 7px, 15px or 18px gaps',
    why: 'A scale makes rhythm; off-scale values make noise',
    source: 'Design system: spacing', check: 'tool', tool: 'tools/check/spacing.mjs',
    signals: ['add 15px padding', 'odd margins', 'pixel-nudge'],
  },
  {
    id: 'D4', category: 'D', level: 'should', title: 'Concentric corners',
    do: 'Make an inner radius the outer radius minus the gap between them (tools/check/radii.mjs). When the result is not on the radius scale, take the custom radius (10, 14, 20 or 28)',
    dont: 'Do not put a large radius inside a small one, or mix sharp and round on one surface',
    why: 'Mismatched corners look unfinished',
    source: 'baseui Radius', check: 'tool', tool: 'tools/check/radii.mjs',
    signals: ['same radius for everything', 'round the inner box more'],
  },
  {
    id: 'D5', category: 'D', level: 'must', title: 'Same thing, same look, same name',
    do: 'Use one pattern for one job everywhere in the product, and one word for one thing',
    dont: 'Do not style two buttons that do the same differently, or call it "Delete" here and "Remove" there',
    why: 'Consistency is what lets people predict',
    source: 'Design critique: consistency; UX writing: consistent', check: 'review',
    signals: ['make this one different', 'each screen its own style'],
  },
  {
    id: 'D6', category: 'D', level: 'should', title: 'Icons',
    do: 'Take icons from the catalog, in one style (outline) with the standard stroke, the same everywhere. Use filled for the active or selected state',
    dont: 'Do not mix icon libraries, emoji as icons, or outline and filled icons at random',
    why: 'Mixed icon styles look like a collage',
    source: 'baseui Icons', check: 'review',
    signals: ['use emoji as icons', 'icons from another library', 'mix icon styles'],
  },
  {
    id: 'D7', category: 'D', level: 'should', title: 'Color has a job',
    do: 'Use the brand and accent colors for the main action and the current item, and the status colors only for status (success, warning, error). Keep most of the screen neutral',
    dont: 'Do not decorate with status colors, or give every element its own accent',
    why: 'When color means something, people can read it',
    source: 'Design system: tokens', check: 'review',
    signals: ['make it colorful', 'rainbow', 'red for emphasis', 'a different color for each card'],
  },

  {
    id: 'D8', category: 'D', level: 'should', title: 'Cards are for discrete things',
    do: 'Use a Card for one thing you could reorder or remove on its own: a profile, a notification, a metric. Group everything else with spacing, a heading and a Section, and show dense data as rows (Table, List) edge to edge',
    dont: 'Do not wrap page sections or form groups in cards, nest cards, or repeat identical cards of icon, heading and text',
    why: 'A border around everything flattens the hierarchy; whitespace and type group better',
    source: 'Design critique: visual hierarchy; Astryx guidelines (adapted)', check: 'review',
    signals: ['put everything in cards', 'a card for each section', 'nested cards', 'a grid of identical feature cards'],
  },
  {
    id: 'D9', category: 'D', level: 'should', title: 'Badges mark exceptions',
    do: 'Badge only what a person must notice or act on. Use the success, warning and error variants for system status, and the color variants to categorize. Keep a label to one or two words',
    dont: 'Do not badge every healthy item, use a badge for metadata such as a date or a duration, repeat one badge in every row, or make a badge clickable',
    why: 'When every row has a badge, none of them is seen',
    source: 'Design critique: visual hierarchy; Astryx guidelines (adapted)', check: 'review',
    signals: ['add an Active badge to every row', 'badge everything', 'a clickable badge', 'a status badge on each item'],
  },
  {
    id: 'D10', category: 'D', level: 'should', title: 'Elevation shows stacking',
    do: 'Leave flat content without a shadow. Use shadow-sm for something in the flow that must stand apart, shadow-md for a surface over content, shadow-lg for one over the whole interface, and one level per surface',
    dont: 'Do not use a shadow as a decorative border, raise a surface that overlaps nothing, or stack shadows on one element',
    why: 'A shadow says "this is above that"; used for decoration it says nothing',
    source: 'baseui Shadow; Astryx guidelines (adapted)', check: 'review',
    signals: ['add shadows to everything', 'drop shadow for depth on every card', 'a bigger shadow', 'two shadows'],
  },
  {
    id: 'D11', category: 'D', level: 'must', title: 'Secondary background sits on Primary or Surface',
    do: 'Put an element with background-secondary (a card, a filled field, a panel) on background-primary or on extensions-background-surface. In the light theme a Surface carries a shadow, in the dark theme it has none',
    dont: 'Do not put a background-secondary element on background-secondary, on background-tertiary or on a colored fill: it disappears into its ground or reads as a hole',
    why: 'Every layer has to differ from the one under it, or the structure is lost; the dark theme shows it first',
    source: 'baseui Color: backgrounds and surfaces', check: 'auto',
    signals: ['a card on a gray page', 'a field inside a card', 'gray panel on a gray background', 'nested cards'],
  },
  {
    id: 'D12', category: 'D', level: 'must', title: 'Stay inside the container',
    do: 'Keep every filled element (a highlighted row, a field, a bar, an image) inside the box of the container that holds it, with the container padding around it. Where a list sits in a card, the row highlight starts at the padding, not past it',
    dont: 'Do not let a row, a highlight or a child stick out of its card, panel or dialog, or overlap its rounded corners, with a negative margin or a width that ignores the padding',
    why: 'A fill that crosses the edge of its container looks broken and cuts through the corner radius; the container padding is what keeps the rounded shapes concentric',
    source: 'baseui Layout and Radius', check: 'auto',
    signals: ['make the list wider than the card', 'negative margin on the rows', 'full bleed inside the card', 'the highlight reaches the edge'],
  },
  {
    id: 'D13', category: 'D', level: 'should', title: 'A count is a counter',
    do: 'Show the number of items in a Tab, a Segmented Control item or a Token with its `counter`, which sets the number apart from the label and keeps it out of the accessible name of the label',
    dont: 'Do not write the count into the label text ("All 48", "Inbox (3)")',
    why: 'The system styles, aligns and announces a counter; a number typed into the label is only text and drifts from the others',
    source: 'baseui Tabs, Segmented Control, Token', check: 'auto',
    signals: ['put the number in the tab name', 'All (12)', 'label with the count', 'tab title with a number'],
  },
  {
    id: 'D14', category: 'D', level: 'should', title: 'Search is always the same field',
    do: 'Make a search from the Text Input with `type="search"`: the label works as a placeholder and never floats, the icon is the library search icon (SearchSm, 24px), and the clear button is on',
    dont: 'Do not float the label of a search, draw another magnifier, or add a search button next to the field unless the search is slow or needs a confirmation',
    why: 'People know a search by its icon and its placeholder; a floating label turns it into a form field',
    source: 'baseui Text Input', check: 'review',
    signals: ['add a search box', 'search with a floating label', 'a different search icon', 'a search field'],
  },
  {
    id: 'D15', category: 'D', level: 'must', title: 'Controls in one row match',
    do: 'Controls that stand in one row (a button and an input, a search and a sort button, a row of chips and buttons) have the same height, the same text size and the same icon size. Put them in a `ControlRow` with one tier (md or lg with a field): the controls take its height, its text size and its icon size by themselves. Without a ControlRow, set them by hand: an input of 56px with 16px text takes a button of size lg with textSize 16, an input of 48px with 16px text takes size md with textSize 16, and every icon in the row is the same size',
    dont: 'Do not put a default-size button next to a taller or shorter input, set the button text in another size than the field text, or mix a 24px icon with a 20px one in a row',
    why: 'Controls in one row read as one line; a control that is shorter, set in another size or has a bigger icon looks like a mistake',
    source: 'baseui ControlRow, Button and Text Input', check: 'auto', tools: ['tools/check/sizes.mjs'],
    signals: ['a button next to the field', 'an Apply button beside the input', 'a search button', 'a field with a submit button in the same row', 'the icons are different sizes', 'not the same height'],
  },

  {
    id: 'D17', category: 'D', level: 'must', title: 'Tabs change only what is below them',
    do: 'Put the page in this order: what is true for the whole page (title, lead, actions), then the tabs, then everything that belongs to one tab (its heading, its text, its content), in the panel of `Tabs` (the `content` of an item, or its `children`). Switching a tab changes the panel and nothing above it',
    dont: 'Do not change the title, the lead or any block above the tablist when a tab is pressed, and do not drive content somewhere else with the value of the tabs: the panel of `Tabs` is the place for it',
    why: 'Tabs read as a control for the area under them; when the heading above them changes too, the page jumps and the person cannot tell what the tabs own',
    source: 'baseui Tabs', check: 'tool', tool: 'tools/check/constitution.mjs',
    signals: ['the title changes with the tab', 'a different heading for each tab', 'tabs under the page title that switch it', 'a lead that depends on the tab'],
  },

  {
    id: 'D18', category: 'D', level: 'must', title: 'One gap between the fields of a form',
    do: 'Lay the fields of a form out with `Form`, `FormRow` and `FormSection`: the fields stand at one gap, down and across, a field alone takes a row, fields that belong together share a `FormRow`, and a titled group is a `FormSection`',
    dont: 'Do not space the fields of one form with different gaps (a 12 here, a 20 there), do not make the distance between columns differ from the distance between rows, and do not put margins on fields',
    why: 'Uneven distances between inputs read as a mistake and make a form harder to scan; one gap in both directions makes the rows and the columns look like one grid',
    source: 'baseui Form', check: 'auto',
    signals: ['a form', 'checkout form', 'sign up form', 'address fields', 'inputs side by side', 'two columns of fields', 'card number and CVC'],
  },

  {
    id: 'D19', category: 'D', level: 'should', title: 'A list stands on its text, its highlight reaches out and is not cut',
    do: 'Align the rows of a `List` on a page by their text, on the edge of the content like the heading and the fields round it. The highlight of a hovered or active row reaches out past the text (the bleed, 12px) and is never cut. A list in a box that scrolls goes in `bui-list-scroll`, which leaves the room for the highlight; inside a card, a dialog or a popup the highlight stays within it and the text is inset by its padding',
    dont: 'Do not set `--bui-list-bleed: 0` on a list of a page to stop the highlight from being cut (it moves the text off the edge), and do not put a list in a box with `overflow` that clips its highlight',
    why: 'The eye follows the left edge of the text: a list whose text is inset from the heading above it looks misaligned, and a highlight with a cut edge looks broken',
    source: 'baseui List; the text of a list on the edge of the content', check: 'auto',
    signals: ['the list is not aligned with the title', 'the highlight is cut', 'the hover is cut off at the edge', 'the active row sticks out', 'the text of the list is indented', 'a list in a scrolling box'],
  },

  // ---------------------------------------------------------------- Copy
  {
    id: 'C1', category: 'C', level: 'must', title: 'Buttons say the action',
    do: 'Start a button label with a verb and name the outcome: "Save changes", "Create account", "Download report"',
    dont: 'Do not label buttons "Submit", "OK", "Click here" or "Yes"',
    why: 'A person should know what will happen before they press',
    source: 'UX writing: CTAs', check: 'review',
    signals: ['button says Submit', 'OK button', 'click here', 'Yes and No buttons'],
  },
  {
    id: 'C2', category: 'C', level: 'must', title: 'Errors: what, why, how to fix',
    do: 'Write an error as what happened, why, and what to do: "Payment declined. Your bank declined the card. Try another card or contact your bank."',
    dont: 'Do not write "Error", "Invalid input", an error code alone, or blame the person',
    why: 'An error that gives no way forward is a dead end',
    source: 'UX writing: error messages', check: 'review',
    signals: ['just say error', 'invalid input', 'show the error code', 'Something went wrong'],
  },
  {
    id: 'C3', category: 'C', level: 'should', title: 'Empty states',
    do: 'Say what the place is for, why it is empty and how to start: "No projects yet. Create your first project to invite your team."',
    dont: 'Do not leave it blank, or write "No data"',
    why: 'An empty screen is the best moment to explain',
    source: 'UX writing: empty states', check: 'review',
    signals: ['no data', 'leave it empty', 'blank state'],
  },
  {
    id: 'C4', category: 'C', level: 'must', title: 'Confirmations name the consequence',
    do: 'Title the dialog with the action and the object ("Delete 3 files?"), say what cannot be undone, and label buttons with the verbs ("Delete files" / "Keep files")',
    dont: 'Do not ask "Are you sure?" with OK and Cancel',
    why: 'People click through vague dialogs',
    source: 'UX writing: confirmation dialogs', check: 'review',
    signals: ['are you sure', 'OK / Cancel dialog', 'generic confirmation'],
  },
  {
    id: 'C5', category: 'C', level: 'should', title: 'Plain, consistent language',
    do: 'Write the way a helpful person talks, with the fewest words that carry the meaning, and the same term for the same thing. Use sentence case',
    dont: 'Do not use jargon, internal names, lorem ipsum or filler like "Welcome to our amazing platform"',
    why: 'Every extra word is one more to read',
    source: 'UX writing: principles', check: 'review',
    signals: ['lorem ipsum', 'marketing fluff', 'technical jargon in the UI', 'TITLE CASE EVERYWHERE'],
  },

  {
    id: 'C6', category: 'C', level: 'should', title: 'No period after the last sentence',
    do: 'Write the last sentence of any piece of text without a period: a caption, a hint, a description, a list item, a tooltip, a toast, a paragraph. Periods stay between sentences inside the text, and a question mark, an exclamation mark or an ellipsis stays where it is. A text written by a person (a review, a comment) is shown as it is: mark it `data-user-content`',
    dont: 'Do not end a label, a caption, a list item, a button, a tooltip or a paragraph with a period',
    why: 'A period at the end of a single line is noise, and it makes short interface text read like a document',
    source: 'baseui Typography; UX writing: concise', check: 'auto',
    signals: ['end every sentence with a period', 'full stops everywhere', 'formal punctuation in labels', 'a period after each list item'],
  },

  // ---------------------------------------------------------------- Motion and responsiveness
  {
    id: 'M1', category: 'M', level: 'must', title: 'Careful motion',
    do: 'Use the motion tokens (150, 300, 500ms) and let prefers-reduced-motion and the Animations setting switch them off. Keep motion to what explains a change',
    dont: 'Do not flash more than three times a second, loop decorative animation, or block the interface while it plays',
    why: 'Motion can cause nausea or seizures, and it slows people down',
    source: 'WCAG 2.3.1, 2.3.3', check: 'review',
    signals: ['flashing', 'bouncing', 'parallax everywhere', 'long intro animation', 'looping background'],
  },
  {
    id: 'M2', category: 'M', level: 'must', title: 'Fits the screen',
    do: 'Make it work from 360px wide with no horizontal scroll, using the Layout tokens and the Tailwind breakpoints (mobile and sheets below md, 768px)',
    dont: 'Do not design only for a desktop width, or let content run off the screen',
    why: 'Most visits start on a phone',
    source: 'baseui Layout', check: 'auto',
    signals: ['desktop only', 'fixed 1440px width', 'horizontal scroll'],
  },
  {
    id: 'M3', category: 'M', level: 'should', title: 'Motion explains, never delays',
    do: 'Animate changes that move or rearrange things: a panel opening, content expanding. Keep hover and other frequent feedback instant, let a closing panel leave the way it came, and let tooltips and menus disappear at once',
    dont: 'Do not delay a hover or a click with an animation, make a person wait for an animation to end before they can act, or move things against where they came from or where they go',
    why: 'Motion is there to show what changed; any that gets in the way of the next action is an obstacle',
    source: 'Astryx motion guidelines (adapted); WCAG 2.3.3', check: 'review',
    signals: ['slow hover animations', 'animate everything', 'wait for the intro', 'a delay on every transition'],
  },
  {
    id: 'M4', category: 'M', level: 'must', title: 'A list of options is a sheet on a phone',
    do: 'On a phone (below 768px) open every list of options (`Selector`, `Typeahead`, `Dropdown`) as a bottom sheet, which the components do by themselves; leave `sheet` on in `Dropdown`. A menu over the page is for a desktop',
    dont: 'Do not draw a list of options with a menu of your own that floats over the page on a phone, and do not turn the sheet off (`sheet={false}`) to keep a menu on a phone',
    why: 'A menu over a phone page is small, hides behind the thumb and the keyboard and gets cut by the edge of the screen; a sheet is as wide as the screen and its rows are easy to reach',
    source: 'baseui ChoiceSheet; mobile patterns: a bottom sheet for a choice', check: 'auto', tools: ['tools/check/sheets.mjs'],
    signals: ['a dropdown on a phone', 'a menu opens over the page on mobile', 'a popup list on a phone', 'a sort menu on mobile', 'a select on mobile'],
  },
];

export const RULES_BY_ID = Object.fromEntries(RULES.map((r) => [r.id, r]));

/** Rules of a category, in order. */
export const rulesOf = (category) => RULES.filter((r) => r.category === category);

/** Looks a rule up by id; throws on an unknown one, so a typo in a violation list shows at once. */
export function rule(id) {
  const r = RULES_BY_ID[id];
  if (!r) throw new Error(`Unknown constitution rule "${id}"`);
  return r;
}

/** The "do not" line without its opening words, to follow a "Don't" label: "set light gray text …". */
export const dontBody = (r) => r.dont.replace(/^Do not /, '');

/** The text of a rule for a message: "A1 Text contrast. Do: … Don't: …". */
export const ruleText = (r) => `${r.id} ${r.title}. Do: ${r.do} Don't: ${dontBody(r)}`;

/**
 * The protocol for an agent that builds a prototype with baseui. It is printed on the Constitution page,
 * written to CONSTITUTION.md and AGENTS.md, and is the only place where it is defined.
 */
export const AGENT_PROTOCOL = [
  'Before you build, read the request against the rules of the constitution. A request breaks a rule when doing exactly what it asks produces something a rule forbids (see `signals` on each rule), or when the first version you would write would break one',
  'If it does not, build as usual and do not mention the constitution',
  'If it does, do the following. Build what was asked: the person decides, so do not refuse and do not quietly "fix" it. And in the same turn:',
  '1. In your answer, begin with a warning. For each broken rule give its id and title and quote its Do and Don\'t lines, then say in one sentence how the request breaks it and what the compliant version would be',
  '2. In the prototype, put a ConstitutionBanner at the very top of the page, before any other content, stretched across the full width: `<ConstitutionBanner violations={[{ id: \'A1\', note: \'Body text is #bbb on white\' }]} />`. List every rule you knowingly break, with a note of where. The banner is not dismissible and stays as long as a rule is broken',
  '3. Do not remove the banner to make the prototype look cleaner, and do not add rules that were not broken. If the person later changes the request so that the rule holds, remove its entry; when none are left, remove the banner',
  'Rules you break by accident are your mistake, not the person’s: fix them before you answer. `auditConstitution()` finds the ones marked check: auto',
];

/**
 * Defaults for an agent that generates an interface with baseui: what to reach for when nothing else is asked.
 * Printed on the Foundations pages they belong to, in CONSTITUTION.md and in AGENTS.md.
 * `rules` are the ids of the rules a default serves; a test keeps them real, so a default cannot outlive its rule.
 */
export const AGENT_DEFAULTS = [
  {
    id: 'punctuation',
    rules: ['C6'],
    title: 'Final period',
    text: [
      'Write the last sentence of any text without a period, in labels, captions, hints, descriptions, list items, tooltips, toasts and paragraphs. Keep the periods between sentences, and keep a question mark, an exclamation mark and an ellipsis',
    ],
  },
  {
    id: 'typography',
    rules: ['H5'],
    title: 'Text color',
    text: [
      'Set the main text in text-and-icon-primary: paragraphs, list items, descriptions and anything a person has to read. text-and-icon-secondary is for supporting text only: a caption, a hint, metadata, a timestamp, the helper line under a title',
      'When you are unsure which it is, take Primary. Disabled is for disabled controls, never for text that is merely less important',
    ],
  },
  {
    id: 'weight',
    rules: ['H9'],
    title: 'Font weight',
    text: [
      'When you set a font weight yourself, take bold or regular: bold for what leads (a title, a heading, a price, a name), regular for everything else. Semi-bold is never your choice: it comes from the components that carry it (buttons, tabs, labels, list titles), or from a direct request of the person',
    ],
  },
  {
    id: 'radius',
    rules: ['D4'],
    title: 'Radius',
    text: [
      'Use only the named radius scale: none, sm, md, lg, xl, 2xl, 3xl, 4xl and full. Do not use the custom radii (radius-custom-10, 14, 20, 28) by default',
      'Use a custom radius in two cases only: the person asks for it, or rule D4 (concentric corners) needs it. For a background around an entity (a tray around a button, a card around an image), the background gets the radius of the entity plus the padding between them, and an entity inside a background gets the radius of the background minus that padding. When the result is not on the named scale (12 − 2 = 10, 16 − 2 = 14, 24 − 4 = 20, 32 − 4 = 28), take the custom radius with that value',
    ],
  },
  {
    id: 'layout',
    rules: ['H8'],
    title: 'Relative layout',
    text: [
      'Place blocks by the gap of their container, not by fixed heights, offsets or margins that match a neighbour. Blocks that move together are one container (Stack, Group), so when one is moved, resized or removed, everything after it follows. After a change, look at the blocks around it and make sure no gap, hole or overlap is left',
    ],
  },
  {
    id: 'spacing',
    rules: ['H3', 'H6', 'H7', 'D3'],
    title: 'Spacing',
    text: [
      'Choose a gap by how closely the blocks belong together, not by one number for the page. Inside an element 4 to 8, a heading to its content 8, related blocks 16, groups 24, sections 40. Use `Stack relation` and `Group` instead of a number',
      'A heading is at most 60% of its font size from its content, 16 at least: a big heading never hangs far above what it names. A line that continues the block above it (a rating under a headline, the counter under the rating, a button over the list it opens) goes in the same group, 8 to 16 away, never at the gap of the page',
      'Never pull a block closer with a negative margin: put it in the group it belongs to. A row of tags or a listing that must reach the screen edges is a `Bleed`',
    ],
  },
  {
    id: 'buttons',
    rules: ['U1'],
    title: 'Button groups',
    text: [
      'Put the buttons of one decision in a `ButtonGroup` and let it lay them out: horizontal is a row, vertical is a column in which every button is full width. Do not set a width on each button of a stack, and give the group one primary button',
    ],
  },
  {
    id: 'forms',
    rules: ['D18'],
    title: 'Forms',
    text: [
      'Lay out the fields of a form with `Form`, `FormRow` and `FormSection`: one gap between rows and columns, related fields in a row, a titled group as a section. Do not space fields with a Stack and a Grid of your own',
    ],
  },
];

# baseui design constitution

Version 1.1. 59 rules in 6 groups (36 must, 23 should): what to do and what not to do so that an interface is at least acceptable. Generated from `src/constitution/rules.js`; the same rules are on the Foundations / Constitution page.

A **must** protects people and is always reported. A **should** is a strong default: keep it, or say why not.

## For agents: when a request breaks a rule

- Before you build, read the request against the rules of the constitution. A request breaks a rule when doing exactly what it asks produces something a rule forbids (see `signals` on each rule), or when the first version you would write would break one
- If it does not, build as usual and do not mention the constitution
- If it does, do the following. Build what was asked: the person decides, so do not refuse and do not quietly "fix" it. And in the same turn:
1. In your answer, begin with a warning. For each broken rule give its id and title and quote its Do and Don't lines, then say in one sentence how the request breaks it and what the compliant version would be
2. In the prototype, put a ConstitutionBanner at the very top of the page, before any other content, stretched across the full width: `<ConstitutionBanner violations={[{ id: 'A1', note: 'Body text is #bbb on white' }]} />`. List every rule you knowingly break, with a note of where. The banner is not dismissible and stays as long as a rule is broken
3. Do not remove the banner to make the prototype look cleaner, and do not add rules that were not broken. If the person later changes the request so that the rule holds, remove its entry; when none are left, remove the banner
- Rules you break by accident are your mistake, not the person’s: fix them before you answer. `auditConstitution()` finds the ones marked check: auto

## For agents: defaults when you generate

### Final period

- Write the last sentence of any text without a period, in labels, captions, hints, descriptions, list items, tooltips, toasts and paragraphs. Keep the periods between sentences, and keep a question mark, an exclamation mark and an ellipsis

### Text color

- Set the main text in text-and-icon-primary: paragraphs, list items, descriptions and anything a person has to read. text-and-icon-secondary is for supporting text only: a caption, a hint, metadata, a timestamp, the helper line under a title
- When you are unsure which it is, take Primary. Disabled is for disabled controls, never for text that is merely less important

### Font weight

- When you set a font weight yourself, take bold or regular: bold for what leads (a title, a heading, a price, a name), regular for everything else. Semi-bold is never your choice: it comes from the components that carry it (buttons, tabs, labels, list titles), or from a direct request of the person

### Radius

- Use only the named radius scale: none, sm, md, lg, xl, 2xl, 3xl, 4xl and full. Do not use the custom radii (radius-custom-10, 14, 20, 28) by default
- Use a custom radius in two cases only: the person asks for it, or rule D4 (concentric corners) needs it. For a background around an entity (a tray around a button, a card around an image), the background gets the radius of the entity plus the padding between them, and an entity inside a background gets the radius of the background minus that padding. When the result is not on the named scale (12 − 2 = 10, 16 − 2 = 14, 24 − 4 = 20, 32 − 4 = 28), take the custom radius with that value

### Relative layout

- Place blocks by the gap of their container, not by fixed heights, offsets or margins that match a neighbour. Blocks that move together are one container (Stack, Group), so when one is moved, resized or removed, everything after it follows. After a change, look at the blocks around it and make sure no gap, hole or overlap is left

### Spacing

- Choose a gap by how closely the blocks belong together, not by one number for the page. Inside an element 4 to 8, a heading to its content 8, related blocks 16, groups 24, sections 40. Use `Stack relation` and `Group` instead of a number
- A heading is at most 60% of its font size from its content, 16 at least: a big heading never hangs far above what it names. A line that continues the block above it (a rating under a headline, the counter under the rating, a button over the list it opens) goes in the same group, 8 to 16 away, never at the gap of the page
- Never pull a block closer with a negative margin: put it in the group it belongs to. A row of tags or a listing that must reach the screen edges is a `Bleed`

### Button groups

- Put the buttons of one decision in a `ButtonGroup` and let it lay them out: horizontal is a row, vertical is a column in which every button is full width. Do not set a width on each button of a stack, and give the group one primary button

### Forms

- Lay out the fields of a form with `Form`, `FormRow` and `FormSection`: one gap between rows and columns, related fields in a row, a titled group as a section. Do not space fields with a Stack and a Grid of your own

## For agents: the banner

```jsx
import { ConstitutionBanner } from 'baseui-kit';

<ConstitutionBanner violations={[
  { id: 'A1', note: 'Body text is #bbbbbb on white' },
  { id: 'H2', note: 'Captions are 10px' },
]} />
```

The warning in the answer follows this shape:

> **Design constitution: this request breaks 2 rules.**
> - **A1 Text contrast** — Do: keep text at 4.5:1 against its background. Don’t: set light gray text on white. Light gray (#bbb) on white is 1.9:1.
> - **H2 Readable type** — Do: body text 14px or more, 12px is the floor. Don’t: set text below 12px. The captions are 10px.
> I built it as asked and put a banner across the top of the prototype. Compliant version: …

## Accessibility

Everyone can see, reach and operate the interface. Based on WCAG 2.1 AA

### A1 Text contrast (must)

- **Do:** Keep text at 4.5:1 against its background (3:1 for large text, 24px or 18.66px bold). Use text-and-icon-primary or Secondary on background-primary or Secondary
- **Don't:** set light gray text on white or text on a photo or a gradient without a scrim. Disabled controls are the only exception
- **Why:** Low contrast is the most common barrier: people with low vision, and anyone outdoors, cannot read it
- **Source:** WCAG 1.4.3; found by `auditConstitution()`
- **Requests that lead here:** light gray text; faint or subtle text; low contrast; text over an image without overlay; pale text on white

### A2 Contrast of controls and graphics (must)

- **Do:** Give borders of inputs, icons that carry meaning and chart marks 3:1 against what is behind them
- **Don't:** draw a field or a button with a border or a fill so faint that its edge cannot be seen
- **Why:** A control that cannot be seen cannot be found
- **Source:** WCAG 1.4.11; needs a review
- **Requests that lead here:** invisible border; ghost inputs; barely visible outline; very light icons

### A4 Keyboard (must)

- **Do:** Make everything that works with a pointer work with the keyboard, in an order that follows the reading order. Use real buttons, links and inputs
- **Don't:** build clickable divs or spans, positive tabindex, or hover-only actions
- **Why:** Keyboard and screen reader users, and switch users, depend on it
- **Source:** WCAG 2.1.1, 2.4.3; needs a review
- **Requests that lead here:** clickable div; hover-only menu; actions that appear only on hover; custom control without keyboard support

### A5 Visible focus (must)

- **Do:** Leave the focus ring of the system (2px, 2px offset) on every interactive element
- **Don't:** write outline: none, or restyle the ring so that it disappears on a background
- **Why:** Without it a keyboard user does not know where they are
- **Source:** WCAG 2.4.7; needs a review
- **Requests that lead here:** remove the outline; hide the focus ring; no focus styles; outline none

### A6 Labels on inputs (must)

- **Do:** Give every input a visible label (the Text Input floating label counts) or at least an accessible name. Group radios and checkboxes under a legend
- **Don't:** use the placeholder as the only label, and do not leave an icon-only button without an aria-label
- **Why:** A placeholder disappears when typing; a nameless control is announced as just "button"
- **Source:** WCAG 3.3.2, 4.1.2; found by `auditConstitution()`
- **Requests that lead here:** placeholder instead of a label; no labels on the form; inputs without labels; icon buttons without text or names

### A7 Images (must)

- **Do:** Describe meaningful images with alt text; give decorative ones an empty alt
- **Don't:** leave img without alt, put text in images, or use a filename as alt
- **Why:** A screen reader cannot read a picture
- **Source:** WCAG 1.1.1; found by `auditConstitution()`
- **Requests that lead here:** text inside an image; images without alt; screenshot of text

### A8 Not by color alone (must)

- **Do:** Pair color with text, an icon or a shape: an error has a message, a status has a word, a chart series has a label
- **Don't:** tell success from failure, or one chart series from another, by hue alone
- **Why:** About one in twelve men cannot tell some hues apart
- **Source:** WCAG 1.4.1; needs a review
- **Requests that lead here:** red and green only; color-coded without labels; status shown only by color

### A9 Structure (must)

- **Do:** Use one h1 per page, headings in order without skipping levels, landmarks (header, nav, main) and lists for lists
- **Don't:** pick a heading level by its size, or build a table out of divs
- **Why:** Assistive technology navigates by structure
- **Source:** WCAG 1.3.1; found by `auditConstitution()`
- **Requests that lead here:** h4 under h1; no page heading; everything in divs

### A10 Dialogs (must)

- **Do:** Use the system Dialog: it moves focus in, keeps it inside, closes on Escape and gives focus back
- **Don't:** build a modal from a positioned div, or open one on page load
- **Why:** A hand-made modal traps keyboard users or lets them fall behind it
- **Source:** WCAG 2.4.3, 3.2.1; needs a review
- **Requests that lead here:** custom modal; popup on page load; modal that cannot be closed; fullscreen overlay with no close

### A11 Errors are described (must)

- **Do:** Say in words which field failed and why, next to the field, and mark it invalid for assistive technology (status="error" on the field)
- **Don't:** show only a red border, or one generic "Something went wrong" at the top
- **Why:** A person has to know what to fix
- **Source:** WCAG 3.3.1; needs a review
- **Requests that lead here:** only a red outline for errors; generic error banner for a form; no error text

### A12 Media and time (should)

- **Do:** Start media only on request, give it controls, and let people extend or switch off any time limit
- **Don't:** autoplay sound or video, and do not move a carousel on a timer without a pause
- **Why:** Moving or timed content cannot be read at one’s own pace
- **Source:** WCAG 1.4.2, 2.2.1, 2.2.2; needs a review
- **Requests that lead here:** autoplay; auto-advancing carousel; countdown that cannot be extended

### A13 Zoom and reflow (should)

- **Do:** Let the layout survive 200% zoom and a 320px width: text reflows, nothing is cut off
- **Don't:** lock the viewport scale (user-scalable=no), set fixed pixel heights on text containers, or clip overflowing text
- **Why:** Low-vision users magnify the page
- **Source:** WCAG 1.4.4, 1.4.10; needs a review
- **Requests that lead here:** disable zoom; fixed height text box; pixel-perfect only at one size

## Usability

A person can finish what they came for, without guessing

### U1 One primary action (must)

- **Do:** Give a screen, a card or a dialog one primary action (Button variant primary). Other actions are secondary or ghost
- **Don't:** put several primary buttons side by side, or make every action look equally loud
- **Why:** When everything shouts, a person cannot tell what to do next
- **Source:** Design critique: usability; found by `auditConstitution()`
- **Requests that lead here:** make all the buttons primary; three big CTAs; every button highlighted

### U2 Interactive things look interactive (must)

- **Do:** Make buttons, links and controls recognizable by shape, color or underline, and give them hover, pressed, disabled and focus states
- **Don't:** style a link as plain text, or make plain text look like a button
- **Why:** People should not have to hover to find out what can be clicked
- **Source:** Design critique: usability; needs a review
- **Requests that lead here:** links that look like text; flat text buttons everywhere; hidden controls

### U3 No needless steps (should)

- **Do:** Ask only for what the task needs, in the fewest steps and screens, with sensible defaults
- **Don't:** add a step, a field or a confirmation that nothing depends on
- **Why:** Every extra step loses people
- **Source:** Design critique: usability; needs a review
- **Requests that lead here:** ask for everything up front; ten-field sign-up; extra confirmation step

### U4 All states of the data (must)

- **Do:** Design loading (Skeleton, Spinner or ProgressBar), empty (Status), error and success for every list, table and request
- **Don't:** leave a blank area while loading, or show only the filled state
- **Why:** A person who sees nothing assumes it is broken
- **Source:** Design system: states; needs a review
- **Requests that lead here:** only the happy path; no loading state; no empty state; skip error handling

### U5 Destructive actions (must)

- **Do:** Ask before deleting or overwriting, naming what will be lost, or offer an undo. Style the action as destructive
- **Don't:** delete on one tap, or confirm with a bare "Are you sure?"
- **Why:** Mistakes happen, and some cannot be taken back
- **Source:** UX writing: confirmation dialogs; needs a review
- **Requests that lead here:** delete without confirmation; instant delete; one-tap irreversible action

### U6 Where am I (must)

- **Do:** Mark the current place in navigation (Tabs, Bottom Bar, Breadcrumbs, Pagination) and keep a way back
- **Don't:** leave a person on a screen with no title, no current item and no exit
- **Why:** Orientation comes before everything else
- **Source:** Design critique: usability; needs a review
- **Requests that lead here:** no navigation; no back button; dead-end screen

### U7 Links navigate, buttons act (must)

- **Do:** Use a link (Link, or Button with `href`) to go to another place, and a button to do something: save, delete, submit, open a dialog
- **Don't:** make a button that only navigates, a link that performs an action, or a clickable div for either
- **Why:** People and assistive technology expect a link to take them somewhere and a button to change something
- **Source:** WCAG 4.1.2; Astryx guidelines (adapted); needs a review
- **Requests that lead here:** a button that goes to another page; a link that deletes; clickable text that submits

### U8 The right control for the choice (should)

- **Do:** Match the control to the choice: Switch for an on or off that applies at once, Checkbox for an option in a form, Radio for one of 2–7, SegmentedControl for 2–5 views, Selector for one of many, Typeahead for a long or remote list, Dropdown for actions
- **Don't:** use a Selector for two options or for yes and no, a Switch in a form that needs a save, or radio buttons for a long list
- **Why:** The shape of the control tells people how many choices there are and when the choice takes effect
- **Source:** Astryx guidelines (adapted); design critique: usability; needs a review
- **Requests that lead here:** a dropdown for yes or no; a toggle in a form with a save button; radio buttons for twenty countries; a select with two options

### U9 Feedback in the right place (must)

- **Do:** Put a message where it belongs: validation next to the field, a short outcome in a Toast, a problem that needs action in a Banner, the state of a whole view in Status. Show Skeleton when the layout of what loads is known and Spinner when it is not
- **Don't:** show form errors as toasts, block a person with a toast, stack banners of one status, or show a skeleton and a spinner on the same area
- **Why:** A toast disappears before it is read; a banner that stays is for what has to be dealt with
- **Source:** UX writing: error messages; Astryx guidelines (adapted); needs a review
- **Requests that lead here:** show a toast for form errors; toast for a critical error; several banners at once; spinner on top of skeleton

### U10 Tooltips are hints (must)

- **Do:** Use a tooltip for a short hint, such as the name of an icon-only button. Anything a person needs to finish the task goes in the interface
- **Don't:** put links, buttons or required information in a tooltip, or explain a disabled control only in a tooltip
- **Why:** A tooltip needs a hover, which touch screens do not have, and disabled controls ignore it
- **Source:** WCAG 1.4.13; Astryx guidelines (adapted); needs a review
- **Requests that lead here:** explain it in a tooltip; a link in a tooltip; hide the instructions in a tooltip; tooltip on a disabled button as the explanation

### U11 Do not disable a button for empty fields (must)

- **Do:** Keep the submit button active while the form is incomplete. On press, show the errors next to the fields that are empty or wrong, say what to fix, and move focus to the first of them
- **Don't:** disable a button because inputs are empty or invalid, and leave the person to guess why it does not work
- **Why:** A disabled button gives no reason and no way forward; an error next to the field does. Disabled is for an action that is not available, not for a form that is not filled
- **Source:** WCAG 3.3.1 and 3.3.3; UX writing and forms guidance; found by `auditConstitution()`
- **Requests that lead here:** disable the button until the form is filled; the button is inactive while the fields are empty; enable the submit when valid

## Hierarchy and layout

The eye knows where to go first and what belongs together

### H1 One focal point (should)

- **Do:** Make the most important thing the first one the eye lands on: the largest, the darkest or the one with the most space around it. Reading order follows importance
- **Don't:** give several blocks the same weight, or let decoration outshine the content
- **Why:** Hierarchy tells people where to start
- **Source:** Design critique: visual hierarchy; needs a review
- **Requests that lead here:** make everything big; everything bold; loud decorative elements

### H2 Readable type (must)

- **Do:** Use the Typography tokens. Body text is 14px or more (16px for reading); 12px is the floor, for captions only. The text right under a heading of 24px or more (a description, a lead) is 16px or more and in the primary color
- **Don't:** set text below 12px, or in uppercase for whole sentences, and do not put a small quiet note under a big heading: it detaches from the heading and gets skipped
- **Why:** Small type is the first thing to fail on a phone and for older eyes
- **Source:** Design critique: accessibility; found by `auditConstitution()`
- **Requests that lead here:** tiny text; 10px; 11px; small print everywhere; all caps paragraph; a small gray line under the title

### H3 Proximity (should)

- **Do:** Place related things closer than unrelated ones: the space inside a group is smaller than the space between groups, and the heavier the block above a new group (a card, a code block, a table), the more space before it. A heading belongs to what follows it: more space above it than below it. Wrap a heading and its content in one container. Use a ladder of gaps, one step per level of grouping (8 inside a group, 16 between related groups, 24 between blocks, 40 between sections), and keep it the same on a page: choose the step by how closely the blocks belong together (`Stack relation`, `Group`), not by a number (tools/check/spacing.mjs)
- **Don't:** space everything evenly, put a heading as close to the block above as to its own text, crowd unrelated blocks together, or push a part of a group away from the rest by raising every gap to separate one thing
- **Why:** Distance is how people read grouping before they read a word
- **Source:** Design critique: visual hierarchy; found by a script (`tools/check/spacing.mjs`)
- **Requests that lead here:** same gap everywhere; cram everything together; no whitespace; a heading in a flat list of blocks

### H4 Line length and leading (should)

- **Do:** Keep a paragraph to 45–75 characters per line and a line height of 1.4 or more
- **Don't:** stretch text across a wide screen in one line, or tighten the line height to fit more
- **Why:** Long or tight lines are tiring to follow
- **Source:** Design critique: accessibility; needs a review
- **Requests that lead here:** full-width paragraph; tight line height; wall of text

### H5 Primary text for the main text (must)

- **Do:** Set the main text, the paragraphs, lists and descriptions a person has to read, in text-and-icon-primary. Use text-and-icon-secondary only for supporting text: captions, hints, metadata, timestamps, the helper line under a title
- **Don't:** set a paragraph, a list or any main text in Secondary to make it quieter, and do not use Disabled for anything but disabled controls
- **Why:** Secondary has less contrast: a page set in it is harder to read, and when everything is quiet nothing leads
- **Source:** baseui Typography; WCAG 1.4.3; found by `auditConstitution()`
- **Requests that lead here:** make the text gray; softer text color; secondary color for the body text; muted paragraphs; light gray description

### H6 Rhythm of the page, and what pulls close (should)

- **Do:** Give a page two kinds of gap: a large one between sections (40, never 48 or more) and small ones inside a section. A heading belongs to its content: the gap below it is at most 60% of its font size, 16 at least (a 28px page title is 16 from the first block under it), and it is smaller than the gap above it. A line that explains or continues the block above (a rating under a headline, a counter under a rating, a title over its tiles, a button over the list it opens) takes a gap of 8 to 16 to it, never the gap of the page. Set that with `Stack relation` and `Group`, or by putting them in one container
- **Don't:** put one big gap (48 or more) between all the blocks of a page, and do not pull a block closer with a negative margin: the block belongs to another group, so wrap it in the group it belongs to
- **Why:** One gap for everything makes related things drift apart; the page then needs manual corrections block by block
- **Source:** Design critique: spacing and rhythm; baseui Layout; found by a script (`tools/check/spacing.mjs`)
- **Requests that lead here:** bring it closer; closer to the title; less space between them; move it up

### H7 Align by the content, let the container reach out (should)

- **Do:** Keep the first item of every row (a title, tags, the picture of a card) on the same left edge. A row that scrolls or a listing runs out to the screen edges with `Bleed`, and keeps the padding inside so its first item stands on the edge of the text. When a card has a background around its picture, the picture stands on the edge and the background reaches out by its padding (`Bleed outset`). The top bar and the bottom bar of a screen span its whole width and sit outside the padded page, never inside it; the Navbar is pinned to the top and stays in view while the screen scrolls. The icon of an edge button of a bar stands on the margin of the content, so the button reaches past it (the Navbar does this itself)
- **Don't:** shift a row or a listing by hand with a negative margin or a copy of the page padding, do not align the edge of the container instead of its content, and do not render a Navbar or a BottomBar inside a padded container: its edges are eaten and it stops being a bar
- **Why:** Eyes follow the left edge of the content: a container that is flush while its picture is not looks crooked
- **Source:** Design critique: alignment; baseui Layout; found by a script (`tools/check/spacing.mjs`)
- **Requests that lead here:** without side margins; to the edge of the screen; the cards are too far apart; scroll sideways

### H8 Layout is relative, not fixed (should)

- **Do:** Build a layout as a flow: blocks are placed by the gap of their container (Stack, Group, relation), and their sizes come from their content or from their neighbours (fill the row, keep an aspect ratio). Put blocks that move together in one container, so when one of them grows, moves or goes away, everything after it follows. When a block is brought closer to another, the blocks that hang on it are brought with it
- **Don't:** give a block a fixed height, an offset from the top or a margin made to match the position of a neighbour, and do not add a second gap to make up for the first: the next change will leave a hole or an overlap
- **Why:** A fixed number holds only for the layout it was measured on; a relation holds for every change
- **Source:** Layout: flow and constraints; baseui Layout; needs a review
- **Requests that lead here:** it did not move with it; a gap is left; move it and the rest; fixed height; the content stayed

### H9 Two weights: bold and regular (should)

- **Do:** Set the text you write yourself in one of two weights: bold for what leads (a title, a heading, a price, a name) and regular for the rest. Semi-bold comes only from the components that carry it (buttons, tabs, labels, list titles), or when the person asks for it in so many words. When a component brings its own weight, leave it
- **Don't:** set semi-bold (500 or 600) on your own text, and do not add a third weight to make a line "a little" stronger or quieter: change its size or its color role instead
- **Why:** Two weights make the hierarchy readable at a glance; a third one blurs the line between a heading and a label and has to be told apart by eye
- **Source:** Design critique: type hierarchy; baseui Typography; needs a review
- **Requests that lead here:** make it semibold; a bit bolder; slightly heavier; medium weight; not so bold

## Design system

The interface is made of the system, not next to it

### D16 Links are text-colored and underlined (must)

- **Do:** Set a link in the color of the text around it and underline it (the Link component does it by default). Use `underline="hover"` or `"none"` only for links that are clearly navigation: a menu, a footer list, a breadcrumb
- **Don't:** recolor a link in a paragraph, a list or a hint, and do not remove its underline, so that color is the only mark of a link
- **Why:** Color alone does not tell a link from text for everyone; an underline does, and a link in the text color keeps the contrast of the text
- **Source:** WCAG 1.4.1 Use of color; baseui Link; found by `auditConstitution()`
- **Requests that lead here:** make the links blue; links without underline; accent-colored links; style the links as buttons in text

### D1 Tokens, not values (must)

- **Do:** Take colors, type, spacing, radius, shadow and motion from the tokens (var(--baseui-…))
- **Don't:** write hex colors, arbitrary pixel gaps, custom fonts or one-off shadows
- **Why:** Tokens carry the themes, the dark mode and the contrast; a literal value breaks them
- **Source:** Design system: token coverage; needs a review
- **Requests that lead here:** use this exact hex; custom font; my own colors; make the shadow bigger than the scale

### D2 Components, not lookalikes (must)

- **Do:** Use the system component when there is one: Button, Text Input, Selector, Switch, Dialog, Tabs, Table
- **Don't:** restyle a div into a button, or write a second version of a component that exists
- **Why:** The system keeps behavior, states and accessibility together
- **Source:** Design system: components; needs a review
- **Requests that lead here:** build a custom dropdown; my own button style; recreate the component

### D3 The spacing scale (must)

- **Do:** Use the spacing tokens, counted in gaps of 4px: 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20 (2px to 80px)
- **Don't:** use 5px, 7px, 15px or 18px gaps
- **Why:** A scale makes rhythm; off-scale values make noise
- **Source:** Design system: spacing; found by a script (`tools/check/spacing.mjs`)
- **Requests that lead here:** add 15px padding; odd margins; pixel-nudge

### D4 Concentric corners (should)

- **Do:** Make an inner radius the outer radius minus the gap between them (tools/check/radii.mjs). When the result is not on the radius scale, take the custom radius (10, 14, 20 or 28)
- **Don't:** put a large radius inside a small one, or mix sharp and round on one surface
- **Why:** Mismatched corners look unfinished
- **Source:** baseui Radius; found by a script (`tools/check/radii.mjs`)
- **Requests that lead here:** same radius for everything; round the inner box more

### D5 Same thing, same look, same name (must)

- **Do:** Use one pattern for one job everywhere in the product, and one word for one thing
- **Don't:** style two buttons that do the same differently, or call it "Delete" here and "Remove" there
- **Why:** Consistency is what lets people predict
- **Source:** Design critique: consistency; UX writing: consistent; needs a review
- **Requests that lead here:** make this one different; each screen its own style

### D6 Icons (should)

- **Do:** Take icons from the catalog, in one style (outline) with the standard stroke, the same everywhere. Use filled for the active or selected state
- **Don't:** mix icon libraries, emoji as icons, or outline and filled icons at random
- **Why:** Mixed icon styles look like a collage
- **Source:** baseui Icons; needs a review
- **Requests that lead here:** use emoji as icons; icons from another library; mix icon styles

### D7 Color has a job (should)

- **Do:** Use the brand and accent colors for the main action and the current item, and the status colors only for status (success, warning, error). Keep most of the screen neutral
- **Don't:** decorate with status colors, or give every element its own accent
- **Why:** When color means something, people can read it
- **Source:** Design system: tokens; needs a review
- **Requests that lead here:** make it colorful; rainbow; red for emphasis; a different color for each card

### D8 Cards are for discrete things (should)

- **Do:** Use a Card for one thing you could reorder or remove on its own: a profile, a notification, a metric. Group everything else with spacing, a heading and a Section, and show dense data as rows (Table, List) edge to edge
- **Don't:** wrap page sections or form groups in cards, nest cards, or repeat identical cards of icon, heading and text
- **Why:** A border around everything flattens the hierarchy; whitespace and type group better
- **Source:** Design critique: visual hierarchy; Astryx guidelines (adapted); needs a review
- **Requests that lead here:** put everything in cards; a card for each section; nested cards; a grid of identical feature cards

### D9 Badges mark exceptions (should)

- **Do:** Badge only what a person must notice or act on. Use the success, warning and error variants for system status, and the color variants to categorize. Keep a label to one or two words
- **Don't:** badge every healthy item, use a badge for metadata such as a date or a duration, repeat one badge in every row, or make a badge clickable
- **Why:** When every row has a badge, none of them is seen
- **Source:** Design critique: visual hierarchy; Astryx guidelines (adapted); needs a review
- **Requests that lead here:** add an Active badge to every row; badge everything; a clickable badge; a status badge on each item

### D10 Elevation shows stacking (should)

- **Do:** Leave flat content without a shadow. Use shadow-sm for something in the flow that must stand apart, shadow-md for a surface over content, shadow-lg for one over the whole interface, and one level per surface
- **Don't:** use a shadow as a decorative border, raise a surface that overlaps nothing, or stack shadows on one element
- **Why:** A shadow says "this is above that"; used for decoration it says nothing
- **Source:** baseui Shadow; Astryx guidelines (adapted); needs a review
- **Requests that lead here:** add shadows to everything; drop shadow for depth on every card; a bigger shadow; two shadows

### D11 Secondary background sits on Primary or Surface (must)

- **Do:** Put an element with background-secondary (a card, a filled field, a panel) on background-primary or on extensions-background-surface. In the light theme a Surface carries a shadow, in the dark theme it has none
- **Don't:** put a background-secondary element on background-secondary, on background-tertiary or on a colored fill: it disappears into its ground or reads as a hole
- **Why:** Every layer has to differ from the one under it, or the structure is lost; the dark theme shows it first
- **Source:** baseui Color: backgrounds and surfaces; found by `auditConstitution()`
- **Requests that lead here:** a card on a gray page; a field inside a card; gray panel on a gray background; nested cards

### D12 Stay inside the container (must)

- **Do:** Keep every filled element (a highlighted row, a field, a bar, an image) inside the box of the container that holds it, with the container padding around it. Where a list sits in a card, the row highlight starts at the padding, not past it
- **Don't:** let a row, a highlight or a child stick out of its card, panel or dialog, or overlap its rounded corners, with a negative margin or a width that ignores the padding
- **Why:** A fill that crosses the edge of its container looks broken and cuts through the corner radius; the container padding is what keeps the rounded shapes concentric
- **Source:** baseui Layout and Radius; found by `auditConstitution()`
- **Requests that lead here:** make the list wider than the card; negative margin on the rows; full bleed inside the card; the highlight reaches the edge

### D13 A count is a counter (should)

- **Do:** Show the number of items in a Tab, a Segmented Control item or a Token with its `counter`, which sets the number apart from the label and keeps it out of the accessible name of the label
- **Don't:** write the count into the label text ("All 48", "Inbox (3)")
- **Why:** The system styles, aligns and announces a counter; a number typed into the label is only text and drifts from the others
- **Source:** baseui Tabs, Segmented Control, Token; found by `auditConstitution()`
- **Requests that lead here:** put the number in the tab name; All (12); label with the count; tab title with a number

### D14 Search is always the same field (should)

- **Do:** Make a search from the Text Input with `type="search"`: the label works as a placeholder and never floats, the icon is the library search icon (SearchSm, 24px), and the clear button is on
- **Don't:** float the label of a search, draw another magnifier, or add a search button next to the field unless the search is slow or needs a confirmation
- **Why:** People know a search by its icon and its placeholder; a floating label turns it into a form field
- **Source:** baseui Text Input; needs a review
- **Requests that lead here:** add a search box; search with a floating label; a different search icon; a search field

### D15 Controls in one row match (must)

- **Do:** Controls that stand in one row (a button and an input, a search and a sort button, a row of chips and buttons) have the same height, the same text size and the same icon size. Put them in a `ControlRow` with one tier (md or lg with a field): the controls take its height, its text size and its icon size by themselves. Without a ControlRow, set them by hand: an input of 56px with 16px text takes a button of size lg with textSize 16, an input of 48px with 16px text takes size md with textSize 16, and every icon in the row is the same size
- **Don't:** put a default-size button next to a taller or shorter input, set the button text in another size than the field text, or mix a 24px icon with a 20px one in a row
- **Why:** Controls in one row read as one line; a control that is shorter, set in another size or has a bigger icon looks like a mistake
- **Source:** baseui ControlRow, Button and Text Input; found by `auditConstitution()`
- **Requests that lead here:** a button next to the field; an Apply button beside the input; a search button; a field with a submit button in the same row; the icons are different sizes; not the same height

### D17 Tabs change only what is below them (must)

- **Do:** Put the page in this order: what is true for the whole page (title, lead, actions), then the tabs, then everything that belongs to one tab (its heading, its text, its content), in the panel of `Tabs` (the `content` of an item, or its `children`). Switching a tab changes the panel and nothing above it
- **Don't:** change the title, the lead or any block above the tablist when a tab is pressed, and do not drive content somewhere else with the value of the tabs: the panel of `Tabs` is the place for it
- **Why:** Tabs read as a control for the area under them; when the heading above them changes too, the page jumps and the person cannot tell what the tabs own
- **Source:** baseui Tabs; found by a script (`tools/check/constitution.mjs`)
- **Requests that lead here:** the title changes with the tab; a different heading for each tab; tabs under the page title that switch it; a lead that depends on the tab

### D18 One gap between the fields of a form (must)

- **Do:** Lay the fields of a form out with `Form`, `FormRow` and `FormSection`: the fields stand at one gap, down and across, a field alone takes a row, fields that belong together share a `FormRow`, and a titled group is a `FormSection`
- **Don't:** space the fields of one form with different gaps (a 12 here, a 20 there), do not make the distance between columns differ from the distance between rows, and do not put margins on fields
- **Why:** Uneven distances between inputs read as a mistake and make a form harder to scan; one gap in both directions makes the rows and the columns look like one grid
- **Source:** baseui Form; found by `auditConstitution()`
- **Requests that lead here:** a form; checkout form; sign up form; address fields; inputs side by side; two columns of fields; card number and CVC

## Copy

Words that say what happens and what to do

### C1 Buttons say the action (must)

- **Do:** Start a button label with a verb and name the outcome: "Save changes", "Create account", "Download report"
- **Don't:** label buttons "Submit", "OK", "Click here" or "Yes"
- **Why:** A person should know what will happen before they press
- **Source:** UX writing: CTAs; needs a review
- **Requests that lead here:** button says Submit; OK button; click here; Yes and No buttons

### C2 Errors: what, why, how to fix (must)

- **Do:** Write an error as what happened, why, and what to do: "Payment declined. Your bank declined the card. Try another card or contact your bank."
- **Don't:** write "Error", "Invalid input", an error code alone, or blame the person
- **Why:** An error that gives no way forward is a dead end
- **Source:** UX writing: error messages; needs a review
- **Requests that lead here:** just say error; invalid input; show the error code; Something went wrong

### C3 Empty states (should)

- **Do:** Say what the place is for, why it is empty and how to start: "No projects yet. Create your first project to invite your team."
- **Don't:** leave it blank, or write "No data"
- **Why:** An empty screen is the best moment to explain
- **Source:** UX writing: empty states; needs a review
- **Requests that lead here:** no data; leave it empty; blank state

### C4 Confirmations name the consequence (must)

- **Do:** Title the dialog with the action and the object ("Delete 3 files?"), say what cannot be undone, and label buttons with the verbs ("Delete files" / "Keep files")
- **Don't:** ask "Are you sure?" with OK and Cancel
- **Why:** People click through vague dialogs
- **Source:** UX writing: confirmation dialogs; needs a review
- **Requests that lead here:** are you sure; OK / Cancel dialog; generic confirmation

### C5 Plain, consistent language (should)

- **Do:** Write the way a helpful person talks, with the fewest words that carry the meaning, and the same term for the same thing. Use sentence case
- **Don't:** use jargon, internal names, lorem ipsum or filler like "Welcome to our amazing platform"
- **Why:** Every extra word is one more to read
- **Source:** UX writing: principles; needs a review
- **Requests that lead here:** lorem ipsum; marketing fluff; technical jargon in the UI; TITLE CASE EVERYWHERE

### C6 No period after the last sentence (should)

- **Do:** Write the last sentence of any piece of text without a period: a caption, a hint, a description, a list item, a tooltip, a toast, a paragraph. Periods stay between sentences inside the text, and a question mark, an exclamation mark or an ellipsis stays where it is. A text written by a person (a review, a comment) is shown as it is: mark it `data-user-content`
- **Don't:** end a label, a caption, a list item, a button, a tooltip or a paragraph with a period
- **Why:** A period at the end of a single line is noise, and it makes short interface text read like a document
- **Source:** baseui Typography; UX writing: concise; found by `auditConstitution()`
- **Requests that lead here:** end every sentence with a period; full stops everywhere; formal punctuation in labels; a period after each list item

## Motion and responsiveness

It moves with care and fits the screen it is on

### M1 Careful motion (must)

- **Do:** Use the motion tokens (150, 300, 500ms) and let prefers-reduced-motion and the Animations setting switch them off. Keep motion to what explains a change
- **Don't:** flash more than three times a second, loop decorative animation, or block the interface while it plays
- **Why:** Motion can cause nausea or seizures, and it slows people down
- **Source:** WCAG 2.3.1, 2.3.3; needs a review
- **Requests that lead here:** flashing; bouncing; parallax everywhere; long intro animation; looping background

### M2 Fits the screen (must)

- **Do:** Make it work from 360px wide with no horizontal scroll, using the Layout tokens and the Tailwind breakpoints (mobile and sheets below md, 768px)
- **Don't:** design only for a desktop width, or let content run off the screen
- **Why:** Most visits start on a phone
- **Source:** baseui Layout; found by `auditConstitution()`
- **Requests that lead here:** desktop only; fixed 1440px width; horizontal scroll

### M3 Motion explains, never delays (should)

- **Do:** Animate changes that move or rearrange things: a panel opening, content expanding. Keep hover and other frequent feedback instant, let a closing panel leave the way it came, and let tooltips and menus disappear at once
- **Don't:** delay a hover or a click with an animation, make a person wait for an animation to end before they can act, or move things against where they came from or where they go
- **Why:** Motion is there to show what changed; any that gets in the way of the next action is an obstacle
- **Source:** Astryx motion guidelines (adapted); WCAG 2.3.3; needs a review
- **Requests that lead here:** slow hover animations; animate everything; wait for the intro; a delay on every transition


Live page: https://baseuikit.vercel.app/#/foundations/constitution

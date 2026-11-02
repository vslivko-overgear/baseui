// The page templates: metadata only (no components), so the site, the docs build and the registry can list them
// without loading any template. Each template is src/templates/<id>.jsx, a page built from baseui components with mock data.
// The set and the categories follow the templates of Astryx; the ones that need a canvas, a code editor or a tree grid are left out.

export const TEMPLATE_CATEGORIES = ['Dashboard', 'Table', 'Form', 'Settings', 'Login', 'Tools', 'Content', 'AI Chat', 'Gallery', 'Shell'];

const t = (id, title, category, description, uses) => ({ id, title, category, description, uses });

export const TEMPLATES = [
  // ------------------------------------------------------------------ Dashboard
  t('analytics-dashboard', 'Analytics Dashboard', 'Dashboard', 'Three bands: headline tiles, then charts, then supporting tables, all read from one filter bar. A summary surface rather than a drill-down', ['Card', 'Table', 'Badge', 'SegmentedControl', 'Select']),
  t('data-dashboard', 'Data Dashboard', 'Dashboard', 'Comparison-heavy analytics behind a persistent filter bar: tiles that carry a sparkline and period-over-period deltas, then segmented breakdowns', ['Card', 'Badge', 'Select', 'Tabs', 'ProgressBar']),
  t('executive-summary-dashboard', 'Executive Summary Dashboard', 'Dashboard', 'A report-shaped page: a scorecard of headline numbers with deltas and status colors, goal bars, a trend grid and a written commentary column', ['Card', 'ProgressBar', 'Badge', 'Status']),
  t('funnel-cohort-dashboard', 'Funnel & Cohort Dashboard', 'Dashboard', 'Analytics for sequence and retention: a staged funnel that reads as drop-off between steps, and a cohort matrix drawn as a heatmap', ['Card', 'Select', 'SegmentedControl']),
  t('portfolio-dashboard', 'Portfolio Dashboard', 'Dashboard', 'Holdings at a glance: total value, an allocation breakdown, a performance line and a sortable table of positions', ['Card', 'Table', 'Badge', 'SegmentedControl']),
  t('project-status-dashboard', 'Project Status Dashboard', 'Dashboard', 'Where every project stands: health by status, progress against milestones, who is blocked and what ships next', ['Card', 'ProgressBar', 'Badge', 'Avatar', 'Table']),
  t('service-monitoring-dashboard', 'Service Monitoring Dashboard', 'Dashboard', 'Uptime and latency for a set of services: a status grid, response time charts, an incident banner and a list of recent events', ['Banner', 'Card', 'Status', 'List', 'Badge']),
  // ------------------------------------------------------------------ Table
  t('searchable-table', 'Searchable Table', 'Table', 'A flat collection with one search field above it: results narrow as you type, with an empty state when nothing matches', ['Table', 'TextField', 'Status', 'Pagination']),
  t('filterable-table', 'Filterable Table', 'Table', 'Progressive filtering over a flat collection: filter chips that stack, a saved view and a detail panel for the selected row', ['Table', 'Chip', 'Select', 'Tabs']),
  t('grouped-table', 'Grouped Table', 'Table', 'Rows bundled into collapsible sections with a count per group, so a long list reads as a few blocks', ['Table', 'Collapsible', 'Badge']),
  t('collapsible-table', 'Collapsible Table', 'Table', 'Several tables on one page, each in a collapsible card with its own columns, for groups that do not share a schema', ['CollapsibleGroup', 'Table', 'Badge']),
  t('inbox-table', 'Inbox Table', 'Table', 'A two-pane message queue: the list indexes a reading pane, and replying opens a composer that leaves the list live', ['List', 'Avatar', 'Badge', 'TextField', 'Button']),
  t('comparison-table', 'Comparison Table', 'Table', 'Candidates in the columns and criteria in grouped rows, with a pinned label column and the best value in each row marked', ['Table', 'Switch', 'Badge']),
  // ------------------------------------------------------------------ Form
  t('contact-form', 'Contact Form', 'Form', 'A flat single-column form that mixes control types and ends on one full-width submit: no steps, no branching', ['TextField', 'Select', 'ChipGroup', 'Checkbox', 'Button']),
  t('two-column-form', 'Two-column Form', 'Form', 'Fields that belong together sit side by side, with a section title for each group and one action row at the end', ['TextField', 'Select', 'Switch', 'Button']),
  t('checkout-form', 'Checkout Form', 'Form', 'A long sectioned form beside a summary that stays in view and recalculates as fields change', ['TextField', 'Select', 'RadioGroup', 'Card', 'Button']),
  t('checkout-wizard', 'Checkout Wizard', 'Form', 'Cart, order and payment as steps, with a running summary that recalculates and validation before every advance', ['ProgressBar', 'TextField', 'RadioGroup', 'Card', 'Button']),
  t('form-wizard', 'Form Wizard', 'Form', 'A linear form, one panel at a time, with a progress track above so every step keeps the full width; a step left broken stays flagged', ['ProgressBar', 'TextField', 'Select', 'Banner', 'Button']),
  t('vertical-wizard', 'Vertical Wizard', 'Form', 'Steps listed down the side with the current panel beside them: completed steps stay reachable, the rest are locked', ['List', 'TextField', 'Button', 'Badge']),
  t('inline-wizard', 'Inline Wizard', 'Form', 'A short flow inside a card on the page: steps swap in place, without a dialog or a new page', ['Card', 'ProgressBar', 'TextField', 'Button']),
  t('dialog-wizard', 'Dialog Wizard', 'Form', 'Two to four short steps in a dialog launched from the page, which stays where it was', ['Modal', 'ProgressBar', 'TextField', 'Button']),
  // ------------------------------------------------------------------ Settings
  t('settings-form', 'Settings Form', 'Settings', 'One long settings page of sections, each with its fields, and a single save row that stays within reach', ['TextField', 'Switch', 'Select', 'Section', 'Button']),
  t('settings-panels', 'Settings Panels', 'Settings', 'Settings split into panels: a list of areas on the left and the chosen area on the right, saved as you go', ['List', 'Switch', 'SegmentedControl', 'Banner']),
  t('settings-dialog', 'Settings Dialog', 'Settings', 'Preferences in a dialog with tabs, opened from the page and closed without losing the place underneath', ['Modal', 'Tabs', 'Switch', 'Select', 'Button']),
  // ------------------------------------------------------------------ Login
  t('login-card', 'Login Card', 'Login', 'A centered card with email and password, a remembered-device switch and one primary action', ['Card', 'TextField', 'Checkbox', 'Button', 'Link']),
  t('login-split', 'Login Split', 'Login', 'A sign-in form on one half and a picture with a short promise on the other', ['TextField', 'Button', 'Link', 'Divider']),
  t('login-sso', 'Login SSO', 'Login', 'Sign-in through identity providers first, with the password form folded under a divider', ['Button', 'Divider', 'TextField', 'Card']),
  // ------------------------------------------------------------------ Tools
  t('kanban-board', 'Kanban Board', 'Tools', 'Columns of cards by stage, with a count per column, avatars and labels on every card', ['Card', 'Badge', 'Avatar', 'Button']),
  t('file-explorer', 'File Explorer', 'Tools', 'A folder tree beside a file list, with breadcrumbs, a list or grid switch and a details pane for the selected file', ['List', 'Breadcrumbs', 'SegmentedControl', 'Card']),
  // ------------------------------------------------------------------ Content
  t('centered-hero', 'Centered Hero', 'Content', 'A symmetrical stack: headline, a short blurb and two actions, resting on one wide picture with nothing on the flanks', ['Button', 'Badge']),
  t('gallery-hero', 'Gallery Hero', 'Content', 'The same centered stack, resolving into a grid of several pictures so the imagery reads as a set', ['Button', 'Grid']),
  t('documentation-catalog', 'Documentation Catalog', 'Content', 'A reference landing that is pure wayfinding: a banner above a grid of category cards that link into sections', ['Banner', 'ClickableCard', 'TextField']),
  t('documentation-design', 'Documentation Design', 'Content', 'An article that alternates prose with live examples: a preview, a property table, paired do and don’t comparisons and a code block', ['Table', 'Card', 'Tabs', 'Breadcrumbs']),
  t('documentation-technical', 'Documentation Technical', 'Content', 'A reference article in numbered steps with code at each stage, and callout cards for prerequisites and next links', ['Banner', 'Card', 'Breadcrumbs']),
  t('order-detail', 'Order Detail', 'Content', 'One order in full: its status and timeline, the items, the totals, the addresses and the actions that are still possible', ['Card', 'Badge', 'Table', 'Button', 'List']),
  t('product-detail', 'Product Detail', 'Content', 'A product page: gallery, price, options, an add-to-cart action, details in tabs and a rating summary', ['Rating', 'Select', 'Button', 'Tabs', 'Chip']),
  t('work-item-detail', 'Work Item Detail', 'Content', 'A ticket page: title, description, activity with comments, and a side column of status, assignee, labels and dates', ['Select', 'Avatar', 'Badge', 'TextField', 'Tabs']),
  // ------------------------------------------------------------------ AI Chat
  t('ai-chat-conversation', 'AI Chat Conversation', 'AI Chat', 'A transcript of alternating turns with rich content inline, beside a panel that holds the generated result', ['Avatar', 'TextField', 'Button', 'Card', 'Collapsible']),
  t('ai-chat-landing', 'AI Chat Landing', 'AI Chat', 'The empty counterpart to a transcript: one composer in the middle and suggestion chips instead of history', ['TextField', 'Chip', 'Button']),
  // ------------------------------------------------------------------ Gallery
  t('card-grid', 'Card Grid', 'Gallery', 'A searchable grid of cards with filter tabs and a real empty state: uniform tiles, narrowing in place', ['Card', 'Tabs', 'TextField', 'Status']),
  t('classic-gallery', 'Classic Gallery', 'Gallery', 'A uniform grid of equal-ratio tiles under a centered intro, with filters that narrow the set in place', ['Tabs', 'Grid']),
  t('mixed-gallery', 'Mixed Gallery', 'Gallery', 'Tiles of different heights packed in columns, like a masonry wall, with a filter row above', ['Chip', 'Grid']),
  t('product-gallery', 'Product Gallery', 'Gallery', 'A storefront grid: product cards with price, badge and a rating, sorted and filtered from a toolbar', ['Card', 'Badge', 'Rating', 'Select', 'Button']),
  t('side-gallery', 'Side Gallery', 'Gallery', 'A filter column on the side and a result grid beside it, with a count and a sort control above the grid', ['Checkbox', 'Slider', 'Select', 'Card']),
  // ------------------------------------------------------------------ Shell
  t('top-nav', 'Top Nav', 'Shell', 'An application frame with a top bar of destinations, an account menu and a page area below', ['Tabs', 'Avatar', 'Dropdown', 'Button']),
  t('side-nav', 'Side Nav', 'Shell', 'An application frame with a collapsible side navigation of sections and a page area beside it', ['List', 'Avatar', 'Collapsible', 'Button']),
  t('shell-nav', 'Shell Nav', 'Shell', 'The frame in both shapes: a top bar on a narrow screen and a side column on a wide one, from the same destinations', ['BottomBar', 'Navbar', 'List']),
];

export const TEMPLATES_BY_ID = Object.fromEntries(TEMPLATES.map((x) => [x.id, x]));
export const templatesOf = (category) => TEMPLATES.filter((x) => x.category === category);

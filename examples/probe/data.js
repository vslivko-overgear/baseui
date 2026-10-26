// Mock data: there is no backend, everything lives in memory (studies and settings are kept in localStorage).
import { I } from './icons.js';
import { rng, seedOf, DAY, avg } from './util.js';
import { centerOf, SCREENS } from './screens.js';

export const NOW = Date.now();
export const ME = { id: 'alex', name: 'Alex Morgan', role: 'Owner', email: 'alex@northwind.studio' };

/** What a study is made of. */
export const BLOCK_TYPES = {
  welcome: { label: 'Welcome screen', icon: I.Flag01, hint: 'Greet people and set expectations', group: 'Screens' },
  thanks: { label: 'Thank you', icon: I.CheckCircle, hint: 'The closing message', group: 'Screens' },
  task: { label: 'Prototype task', icon: I.Cursor01, hint: 'People try to complete a task on a screen', group: 'Tests' },
  fivesec: { label: 'Five-second test', icon: I.Clock, hint: 'A screen shown for five seconds, then questions', group: 'Tests' },
  scale: { label: 'Opinion scale', icon: I.Sliders01, hint: 'Rate something from 1 to 5, 7 or 10', group: 'Questions' },
  choice: { label: 'Multiple choice', icon: I.CheckSquare, hint: 'Pick one or several options', group: 'Questions' },
  yesno: { label: 'Yes / No', icon: I.MessageQuestionCircle, hint: 'A question with two answers', group: 'Questions' },
  text: { label: 'Open question', icon: I.MessageTextSquare01, hint: 'A free-text answer', group: 'Questions' },
};

let seq = 1;
export const uid = (p = 'x') => `${p}${Date.now().toString(36)}${seq++}`;

const base = (type, o = {}) => ({ id: uid('b'), type, title: '', desc: '', required: true, ...o });
export function newBlock(type) {
  switch (type) {
    case 'welcome': return base('welcome', { title: 'Welcome!', desc: 'This takes about 5 minutes. There are no wrong answers: we are testing the design, not you.', required: false });
    case 'thanks': return base('thanks', { title: 'Thank you for your time', desc: 'Your answers help us make the product better.', required: false });
    case 'task': return base('task', { title: 'Find the checkout button', desc: 'Imagine you are ready to pay for the items in your cart. Click where you would go next.', screen: 'cart', targets: ['checkout'] });
    case 'fivesec': return base('fivesec', { title: 'Look at this page', desc: 'You will see it for 5 seconds. Try to remember as much as you can.', screen: 'pricing' });
    case 'scale': return base('scale', { title: 'How easy was it?', max: 5, low: 'Very hard', high: 'Very easy' });
    case 'choice': return base('choice', { title: 'Which of these matters most to you?', multiple: false, options: [{ id: uid('o'), label: 'Price' }, { id: uid('o'), label: 'Speed' }, { id: uid('o'), label: 'Support' }] });
    case 'yesno': return base('yesno', { title: 'Did you find what you were looking for?' });
    default: return base('text', { title: 'What would you change?', desc: 'Write a few words, or as many as you like.', required: false });
  }
}
const opts = (...labels) => labels.map(([label, w = 1], i) => ({ id: `o${i + 1}`, label, w }));

const blk = (id, type, o = {}) => ({ id, type, title: '', desc: '', required: true, ...o });
const SEED_STUDIES = [
  {
    id: 's1', name: 'Checkout redesign: usability test', status: 'live', owner: 'alex', created: NOW - 12 * DAY, n: 64, goal: 100, minutes: 6, tags: ['Usability', 'E-commerce'],
    blocks: [
      blk('b1', 'welcome', { title: 'Help us improve checkout', desc: 'You will try to pay for an order on a prototype. It takes about 6 minutes.', required: false }),
      blk('b2', 'task', { title: 'Find the checkout button', desc: 'You added two items to your cart. Click where you would go to pay.', screen: 'cart', targets: ['checkout'], bias: 0.74 }),
      blk('b3', 'scale', { title: 'How easy was it to find the checkout button?', max: 5, low: 'Very hard', high: 'Very easy', bias: 0.72 }),
      blk('b4', 'choice', { title: 'What almost stopped you from paying?', multiple: true, options: opts(['Nothing, it was clear', 3], ['I could not find the button', 2], ['Too many options on the page', 2], ['I wanted to change the quantity', 1], ['The promo code field', 1]) }),
      blk('b5', 'text', { title: 'What would you change on this page?', required: false, samples: ['The checkout button could be bigger.', 'I looked for a PayPal option first.', 'Nothing, it is pretty clear.', 'The promo code link is easy to confuse with the button.', 'I would show the delivery date in the summary.', 'Make the total more prominent.', 'Too much grey, everything blends together.'] }),
      blk('b6', 'thanks', { title: 'Thank you!', desc: 'Your answers will help us make checkout faster.', required: false }),
    ],
  },
  {
    id: 's2', name: 'Pricing page: five-second test', status: 'done', owner: 'maya', created: NOW - 30 * DAY, n: 120, goal: 120, minutes: 4, tags: ['First impression'],
    blocks: [
      blk('b1', 'welcome', { title: 'A quick first-impression test', desc: 'You will see a page for five seconds, then answer a few questions.', required: false }),
      blk('b2', 'fivesec', { title: 'Look at this page', desc: 'You will see it for 5 seconds.', screen: 'pricing' }),
      blk('b3', 'text', { title: 'What do you remember about the page?', samples: ['Three plans and one of them highlighted.', 'The price of the Pro plan, $29.', 'A clean page, blue button.', 'Not much, I think it was about teams.', 'A free plan and a trial.', 'Plans that grow with your team.', 'Pricing for a software product.'] }),
      blk('b4', 'choice', { title: 'Which plan would fit a freelancer?', options: opts(['Free', 5], ['Pro', 4], ['Team', 1], ['I am not sure', 1]) }),
      blk('b5', 'scale', { title: 'How clear was the page?', max: 7, low: 'Confusing', high: 'Crystal clear', bias: 0.7 }),
      blk('b6', 'thanks', { title: 'Thanks a lot!', required: false }),
    ],
  },
  {
    id: 's3', name: 'Onboarding survey: new users', status: 'live', owner: 'nora', created: NOW - 5 * DAY, n: 41, goal: 80, minutes: 3, tags: ['Survey', 'Onboarding'],
    blocks: [
      blk('b1', 'welcome', { title: 'How was your first week?', desc: 'Three short questions about getting started.', required: false }),
      blk('b2', 'yesno', { title: 'Did you finish the setup checklist?', yes: 0.64 }),
      blk('b3', 'scale', { title: 'How likely are you to recommend us to a colleague?', max: 10, low: 'Not likely', high: 'Very likely', bias: 0.66 }),
      blk('b4', 'choice', { title: 'What would have helped you most?', options: opts(['A guided tour', 3], ['Templates', 4], ['Sample data', 2], ['Live chat', 1]) }),
      blk('b5', 'text', { title: 'Anything else you want to tell us?', required: false, samples: ['Templates saved me a lot of time.', 'I did not know where to start.', 'The checklist is great.', 'Please add dark mode.', 'Inviting teammates was confusing.', 'Love the product!'] }),
      blk('b6', 'thanks', { title: 'Thank you!', required: false }),
    ],
  },
  {
    id: 's4', name: 'Mobile navigation concept', status: 'draft', owner: 'alex', created: NOW - 1 * DAY, n: 0, goal: 50, minutes: 5, tags: ['Navigation', 'Mobile'],
    blocks: [
      blk('b1', 'welcome', { title: 'Try our new app navigation', desc: 'You will try a mobile prototype.', required: false }),
      blk('b2', 'task', { title: 'Find your saved trails', desc: 'You want to look at the trails you saved earlier. Tap where you would go.', screen: 'trails', targets: ['saved'] }),
      blk('b3', 'text', { title: 'Was anything unclear?', required: false, samples: [] }),
      blk('b4', 'thanks', { title: 'Thank you!', required: false }),
    ],
  },
  {
    id: 's5', name: 'Settings: invite teammates', status: 'paused', owner: 'sofia', created: NOW - 20 * DAY, n: 18, goal: 60, minutes: 5, tags: ['Usability', 'Settings'],
    blocks: [
      blk('b1', 'welcome', { title: 'Invite your team', required: false }),
      blk('b2', 'task', { title: 'Find where to invite a teammate', screen: 'pricing', targets: ['team'], bias: 0.5 }),
      blk('b3', 'scale', { title: 'How confident were you?', max: 5, low: 'Not at all', high: 'Completely', bias: 0.5 }),
      blk('b4', 'thanks', { title: 'Thank you!', required: false }),
    ],
  },
  {
    id: 's6', name: 'Competitor benchmark: signup flow', status: 'done', owner: 'sofia', created: NOW - 45 * DAY, n: 88, goal: 88, minutes: 7, tags: ['Benchmark'],
    blocks: [
      blk('b1', 'welcome', { title: 'Compare two signup flows', required: false }),
      blk('b2', 'yesno', { title: 'Have you used a similar product before?', yes: 0.7 }),
      blk('b3', 'scale', { title: 'How smooth was the signup?', max: 5, low: 'Rough', high: 'Smooth', bias: 0.62 }),
      blk('b4', 'text', { title: 'What stood out?', required: false, samples: ['Fewer fields than the others.', 'The progress bar helped.', 'Too many emails asked.', 'Social login saved time.'] }),
      blk('b5', 'thanks', { title: 'Thank you!', required: false }),
    ],
  },
];
export const seedStudies = () => SEED_STUDIES.map((s) => ({ ...s, blocks: s.blocks.map((b) => ({ ...b })) }));

/** The gallery of templates: each one starts a draft with its blocks. */
export const TEMPLATES = [
  { id: 't-usability', name: 'Usability test', category: 'Usability', icon: I.Cursor01, minutes: 6, desc: 'Give people a task on a prototype and see where they click, how fast and how sure they are.', blocks: ['welcome', 'task', 'scale', 'text', 'thanks'] },
  { id: 't-five', name: 'Five-second test', category: 'First impression', icon: I.Clock, minutes: 3, desc: 'Show a screen for five seconds and ask what people remember and what they think it is for.', blocks: ['welcome', 'fivesec', 'text', 'scale', 'thanks'] },
  { id: 't-nps', name: 'NPS survey', category: 'Surveys', icon: I.Sliders01, minutes: 2, desc: 'The classic “how likely are you to recommend us” with a follow-up question.', blocks: ['welcome', 'scale', 'text', 'thanks'] },
  { id: 't-concept', name: 'Concept feedback', category: 'Concepts', icon: I.Lightbulb01, minutes: 5, desc: 'Present an idea and collect first reactions, expectations and concerns.', blocks: ['welcome', 'fivesec', 'yesno', 'choice', 'text', 'thanks'] },
  { id: 't-nav', name: 'Navigation test', category: 'Usability', icon: I.Rows01, minutes: 5, desc: 'Check whether people find things in your menu: three tasks and a confidence rating.', blocks: ['welcome', 'task', 'task', 'task', 'scale', 'thanks'] },
  { id: 't-satisfaction', name: 'Feature satisfaction', category: 'Surveys', icon: I.Star01, minutes: 3, desc: 'How people use a feature, how satisfied they are and what is missing.', blocks: ['welcome', 'choice', 'scale', 'text', 'thanks'] },
  { id: 't-exit', name: 'Exit survey', category: 'Surveys', icon: I.MessageQuestionCircle, minutes: 2, desc: 'Learn why people leave: a reason, a rating and a free comment.', blocks: ['welcome', 'choice', 'text', 'thanks'] },
  { id: 't-prices', name: 'Pricing perception', category: 'Concepts', icon: I.Coins01, minutes: 4, desc: 'Test how a pricing page is understood and which plan people pick for themselves.', blocks: ['welcome', 'fivesec', 'choice', 'scale', 'thanks'] },
];
export const CATEGORIES = ['Usability', 'First impression', 'Surveys', 'Concepts'];

/** The panel of participants for recruiting. */
const P = (name, country, age, job, device, rating) => ({ name, country, age, job, device, rating });
export const PANEL = [
  P('Hannah Weber', 'Germany', 29, 'Designer', 'desktop', 4.8), P('Lucas Martin', 'France', 34, 'Developer', 'desktop', 4.6), P('Sofia Rossi', 'Italy', 41, 'Marketing', 'mobile', 4.9),
  P('James Carter', 'United States', 27, 'Student', 'mobile', 4.2), P('Aiko Tanaka', 'Japan', 31, 'Product manager', 'desktop', 4.7), P('Mateo Garcia', 'Spain', 38, 'Teacher', 'mobile', 4.4),
  P('Emma Johnson', 'United States', 45, 'Accountant', 'desktop', 4.9), P('Noah Brown', 'United Kingdom', 23, 'Student', 'mobile', 4.1), P('Chloe Dubois', 'France', 36, 'Nurse', 'mobile', 4.5),
  P('Arjun Mehta', 'India', 30, 'Developer', 'desktop', 4.8), P('Olivia Wilson', 'United Kingdom', 52, 'Manager', 'desktop', 4.3), P('Liam Schmidt', 'Germany', 26, 'Designer', 'mobile', 4.6),
  P('Mia Kowalski', 'Poland', 33, 'Marketing', 'desktop', 4.7), P('Ethan Davis', 'United States', 39, 'Engineer', 'desktop', 4.5), P('Isabella Costa', 'Brazil', 28, 'Designer', 'mobile', 4.8),
  P('Lena Novak', 'Czechia', 35, 'Analyst', 'desktop', 4.4), P('Yusuf Demir', 'Turkey', 42, 'Shop owner', 'mobile', 4.2), P('Grace Lee', 'United States', 31, 'Researcher', 'desktop', 5.0),
  P('Pedro Alves', 'Brazil', 47, 'Driver', 'mobile', 4.0), P('Amara Okafor', 'Nigeria', 25, 'Student', 'mobile', 4.3), P('Elena Ivanova', 'Bulgaria', 37, 'Developer', 'desktop', 4.9),
  P('Oliver Smith', 'United Kingdom', 58, 'Retired', 'desktop', 4.1), P('Zoe Martin', 'Canada', 24, 'Photographer', 'mobile', 4.6), P('Daniel Cohen', 'Israel', 32, 'Product manager', 'desktop', 4.7),
].map((p, i) => ({ id: `p${i + 1}`, ...p, email: `${p.name.toLowerCase().replace(/[^a-z]+/g, '.')}@mail.test` }));
export const COUNTRIES = [...new Set(PANEL.map((p) => p.country))].sort();
export const RATE = 9; // dollars per participant for a study of about 5 minutes

export const TEAM = [
  { id: 'alex', name: 'Alex Morgan', email: 'alex@northwind.studio', role: 'owner' },
  { id: 'maya', name: 'Maya Chen', email: 'maya@northwind.studio', role: 'editor' },
  { id: 'nora', name: 'Nora Haddad', email: 'nora@northwind.studio', role: 'editor' },
  { id: 'sofia', name: 'Sofia Rossi', email: 'sofia@northwind.studio', role: 'viewer' },
];
export const memberOf = (id) => TEAM.find((m) => m.id === id) || TEAM[0];

// ---- responses: generated from the study, the same every time ----
const COUNTRY_POOL = ['United States', 'Germany', 'France', 'United Kingdom', 'Spain', 'Poland', 'Brazil', 'India', 'Japan', 'Canada'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const gauss = (r) => (r() + r() + r() + r()) / 4;

function answerOf(block, r) {
  switch (block.type) {
    case 'scale': {
      const bias = block.bias ?? 0.65;
      const v = clamp(gauss(r) + (bias - 0.5) * 0.9, 0, 1);
      return block.max === 10 ? Math.round(v * 10) : 1 + Math.round(v * (block.max - 1));
    }
    case 'choice': {
      const list = block.options || [];
      const pick = () => { const total = list.reduce((a, o) => a + (o.w ?? 1), 0); let x = r() * total; return (list.find((o) => (x -= (o.w ?? 1)) < 0) || list[0])?.id; };
      const first = pick();
      return block.multiple && r.chance(0.4) ? [...new Set([first, pick()])] : [first];
    }
    case 'yesno': return r.chance(block.yes ?? 0.6);
    case 'text': return block.samples?.length ? r.pick(block.samples) : 'No comment';
    case 'fivesec': return { seen: true };
    case 'task': {
      const hit = r.chance(block.bias ?? 0.7);
      const t = centerOf(block.screen, block.targets?.[0]);
      const misses = hit ? (r.chance(0.65) ? 0 : r.int(1, 2)) : r.int(1, 4);
      const clicks = Array.from({ length: misses }, () => ({ x: clamp(r() * 100, 3, 97), y: clamp(r() * 100, 5, 95), hit: false }));
      const spread = (n) => (r() - 0.5) * n * 0.7;
      clicks.push({ x: hit ? t.x + spread(t.w) : clamp(t.x + (r() - 0.5) * 50, 3, 97), y: hit ? t.y + spread(t.h) : clamp(t.y + (r() - 0.5) * 40, 5, 95), hit });
      return { success: hit, secs: Math.round((hit ? 4 : 12) + r() * 14), misses, clicks };
    }
    default: return undefined;
  }
}

export function makeResponses(study) {
  const r = rng(seedOf(study.id));
  const names = PANEL.map((p) => p.name);
  const list = [];
  const questions = study.blocks.filter((b) => !['welcome', 'thanks'].includes(b.type));
  for (let i = 0; i < study.n; i += 1) {
    const done = r.chance(0.86);
    const stop = done ? questions.length : r.int(0, Math.max(0, questions.length - 1));
    const answers = {};
    questions.slice(0, stop).forEach((b) => { answers[b.id] = answerOf(b, r); });
    const scales = questions.filter((b) => b.type === 'scale' && answers[b.id] !== undefined);
    list.push({
      id: `${study.id}-r${i + 1}`, who: i % 3 === 0 ? `Anonymous #${1000 + i}` : names[(i * 7) % names.length], device: r.pick(['desktop', 'desktop', 'desktop', 'mobile', 'mobile', 'tablet']),
      country: r.pick(COUNTRY_POOL), at: NOW - r.int(0, 13) * DAY - r.int(0, 23) * 36e5, secs: r.int(70, 60 * study.minutes + 60), done, answers,
      score: scales.length ? Math.round(avg(scales.map((b) => (b.max === 10 ? answers[b.id] / 10 : (answers[b.id] - 1) / (b.max - 1)) * 100))) : null,
    });
  }
  return list.sort((a, b) => b.at - a.at);
}

export const STATUS = { draft: ['Draft', 'secondary'], live: ['Live', 'success'], paused: ['Paused', 'warning'], done: ['Completed', 'info'] };
export const DEVICES = { desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablet' };
export const screenLabel = (key) => SCREENS[key]?.label || key;

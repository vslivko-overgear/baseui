// Mock data: there is no backend, everything lives in memory (the settings in localStorage).
const MIN = 60 * 1000;
export const NOW = Date.now();
const ago = (m) => NOW - m * MIN;

export const ME = { id: 'me', name: 'Alex Morgan', bio: 'Product designer · coffee first', phone: '+1 (415) 555-0142', birthday: '1992-04-18' };

export const CONTACTS = [
  { id: 'maya', name: 'Maya Chen', status: 'success', bio: 'Design systems lead', seen: 'online' },
  { id: 'leo', name: 'Leo Fischer', status: 'neutral', bio: 'Frontend engineer', seen: 'last seen 25 minutes ago' },
  { id: 'nora', name: 'Nora Haddad', status: 'success', bio: 'Product manager', seen: 'online' },
  { id: 'ivan', name: 'Ivan Petrov', status: 'error', bio: 'Do not disturb', seen: 'busy' },
  { id: 'sofia', name: 'Sofia Rossi', status: 'neutral', bio: 'UX researcher', seen: 'last seen yesterday' },
  { id: 'kai', name: 'Kai Tanaka', status: 'success', bio: 'Illustrator', seen: 'online' },
  { id: 'amara', name: 'Amara Okafor', status: 'neutral', bio: 'QA engineer', seen: 'last seen 2 hours ago' },
  { id: 'tom', name: 'Tom Becker', status: 'neutral', bio: 'Backend engineer', seen: 'last seen today at 09:12' },
  { id: 'lena', name: 'Lena Novak', status: 'success', bio: 'Marketing', seen: 'online' },
  { id: 'omar', name: 'Omar Haddad', status: 'neutral', bio: 'Dad', seen: 'last seen recently' },
  { id: 'zoe', name: 'Zoe Martin', status: 'neutral', bio: 'Photographer', seen: 'last seen a week ago' },
  { id: 'dmitri', name: 'Dmitri Volkov', status: 'neutral', bio: 'DevOps', seen: 'last seen 3 days ago' },
  { id: 'ana', name: 'Ana Silva', status: 'success', bio: 'Support lead', seen: 'online' },
  { id: 'jonas', name: 'Jonas Weber', status: 'neutral', bio: 'Data analyst', seen: 'last seen yesterday' },
  { id: 'priya', name: 'Priya Nair', status: 'neutral', bio: 'Engineering manager', seen: 'last seen 5 hours ago' },
  { id: 'felix', name: 'Felix Braun', status: 'neutral', bio: 'Sales', seen: 'last seen long ago' },
  { id: 'yuki', name: 'Yuki Sato', status: 'success', bio: 'Motion designer', seen: 'online' },
  { id: 'carlos', name: 'Carlos Mendez', status: 'neutral', bio: 'Finance', seen: 'last seen yesterday' },
];
export const contactOf = (id) => CONTACTS.find((c) => c.id === id);

let uid = 100;
export const nextId = () => ++uid;
const m = (from, text, minutes, extra = {}) => ({ id: nextId(), from, text, time: ago(minutes), status: 'read', ...extra });

export const makeChats = () => [
  { id: 'c-maya', type: 'direct', with: 'maya', pinned: true, muted: false, unread: 2, messages: [
    m('me', 'Morning! Did you see the new floating navbar?', 190),
    m('maya', 'Yes! The gradient under it is a great touch 😍', 186),
    m('maya', 'Can we use glass on the bottom bar too?', 185),
    m('me', 'Already done, check the Theme settings', 170, { reactions: { '👍': 1 } }),
    m('maya', 'Nice, here is the mockup for the onboarding', 42, { kind: 'image', caption: 'Onboarding, v3', hue: 210 }),
    m('maya', 'Thoughts?', 41),
    m('maya', 'Also: are we still on for 15:00?', 3, { replyTo: null }),
  ] },
  { id: 'g-design', type: 'group', name: 'Design team', members: ['maya', 'kai', 'sofia', 'yuki'], pinned: true, muted: false, unread: 0, messages: [
    m('kai', 'Uploaded the new icon set', 600),
    m('sofia', 'The research summary is ready', 480, { kind: 'file', file: { name: 'Research summary.pdf', size: '2.4 MB' } }),
    m('yuki', 'Voice note about the animation', 300, { kind: 'voice', duration: 24 }),
    m('me', 'Thanks everyone — reviewing today', 280),
    m('maya', 'Reminder: critique at 16:00 ☕', 95, { reactions: { '👍': 3, '🔥': 1 } }),
  ] },
  { id: 'c-nora', type: 'direct', with: 'nora', pinned: false, muted: false, unread: 1, messages: [
    m('nora', 'Roadmap for Q3 is attached', 1500, { kind: 'file', file: { name: 'Roadmap Q3.xlsx', size: '640 KB' } }),
    m('me', 'Got it, will comment by Friday', 1490),
    m('nora', 'Can you join the planning call tomorrow?', 12),
  ] },
  { id: 'g-trip', type: 'group', name: 'Lisbon trip ✈️', members: ['leo', 'lena', 'ana', 'tom'], pinned: false, muted: true, unread: 14, messages: [
    m('lena', 'Booked the apartment!', 2400),
    m('tom', 'Flights are 40% cheaper on Tuesday', 1800),
    m('ana', 'Who is bringing the speaker?', 700),
    m('leo', 'Me 🙌', 660),
    m('lena', 'Photos from last year', 300, { kind: 'image', caption: 'Alfama', hue: 30 }),
  ] },
  { id: 'c-leo', type: 'direct', with: 'leo', pinned: false, muted: false, unread: 0, messages: [
    m('leo', 'The build is green again', 3000),
    m('me', 'Amazing, thank you!', 2990, { status: 'read' }),
  ] },
  { id: 'c-ivan', type: 'direct', with: 'ivan', pinned: false, muted: false, unread: 0, messages: [
    m('me', 'Can you send the invoice?', 4200),
    m('ivan', 'Sure, tomorrow', 4100),
  ] },
  { id: 'c-sofia', type: 'direct', with: 'sofia', pinned: false, muted: false, unread: 0, messages: [
    m('sofia', 'Interview notes are in the doc', 5000),
    m('me', 'Perfect 👌', 4990),
  ] },
  { id: 'g-eng', type: 'group', name: 'Frontend guild', members: ['leo', 'tom', 'priya', 'dmitri', 'amara'], pinned: false, muted: false, unread: 5, messages: [
    m('priya', 'Release train leaves at 17:00', 90),
    m('dmitri', 'Staging is back up', 60),
    m('amara', 'Found a focus-order bug in the dialog', 30),
    m('tom', 'On it', 28),
  ] },
  { id: 'c-omar', type: 'direct', with: 'omar', pinned: false, muted: false, unread: 0, messages: [
    m('omar', 'Call me when you are free', 7000),
  ] },
  { id: 'c-zoe', type: 'direct', with: 'zoe', pinned: false, muted: false, unread: 0, messages: [
    m('zoe', 'The prints are ready', 9000, { kind: 'image', caption: 'Contact sheet', hue: 330 }),
  ] },
];

export const CALLS = [
  { id: 1, who: 'maya', kind: 'incoming', minutes: 55, length: '12:04' },
  { id: 2, who: 'ivan', kind: 'missed', minutes: 230, length: '' },
  { id: 3, who: 'nora', kind: 'outgoing', minutes: 1400, length: '03:31' },
  { id: 4, who: 'omar', kind: 'missed', minutes: 2900, length: '' },
  { id: 5, who: 'leo', kind: 'incoming', minutes: 4400, length: '25:18' },
  { id: 6, who: 'sofia', kind: 'outgoing', minutes: 5800, length: '01:12' },
  { id: 7, who: 'kai', kind: 'incoming', minutes: 8000, length: '07:45' },
];

export const FILES = [
  { id: 1, name: 'Research summary.pdf', size: '2.4 MB', date: '2025-03-04' },
  { id: 2, name: 'Roadmap Q3.xlsx', size: '640 KB', date: '2025-03-01' },
  { id: 3, name: 'Icon set v2.zip', size: '18.2 MB', date: '2025-02-26' },
  { id: 4, name: 'Brand guidelines.pdf', size: '5.1 MB', date: '2025-02-19' },
  { id: 5, name: 'Onboarding flow.fig', size: '9.8 MB', date: '2025-02-11' },
];

export const SESSIONS = [
  { id: 1, device: 'MacBook Pro · Chrome', place: 'San Francisco, US', active: 'Now', current: true },
  { id: 2, device: 'iPhone 15 · App', place: 'San Francisco, US', active: '12 minutes ago' },
  { id: 3, device: 'iPad Air · Safari', place: 'Oakland, US', active: '3 days ago' },
];

export const STORAGE = [
  { id: 'photos', name: 'Photos and videos', size: 1840 },
  { id: 'files', name: 'Files', size: 920 },
  { id: 'voice', name: 'Voice messages', size: 210 },
  { id: 'cache', name: 'Cache', size: 640 },
];

export const REPLIES = ['Sounds good 👍', 'Haha, yes!', 'Let me check and get back to you', 'On my way', 'Thanks!', 'Can we do it a bit later?', 'Perfect, see you then', 'Interesting, tell me more'];
export const QUICK = ['Sounds good', 'On my way', 'Thanks!', 'Call me'];
export const EMOJI = ['😀', '😂', '😍', '🤔', '😎', '🙌', '👍', '👏', '🔥', '🎉', '❤️', '☕', '🚀', '✨', '🙏', '😴'];
export const WALLPAPERS = [
  { value: 'plain', label: 'Plain' },
  { value: 'dawn', label: 'Dawn' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'meadow', label: 'Meadow' },
];

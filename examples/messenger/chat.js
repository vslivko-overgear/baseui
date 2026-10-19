import { h, cx, React, useState, useEffect, useRef, useMemo } from '../../src/react.js';
const useLayoutEffect = React.useLayoutEffect;
import { Navbar } from '../../src/components/MobileNavigation.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { Avatar, AvatarStatusDot } from '../../src/components/Avatar.js';
import { Dropdown } from '../../src/components/Dropdown.js';
import { Popover } from '../../src/components/Popover.js';
import { Tooltip } from '../../src/components/Tooltip.js';
import { Divider } from '../../src/components/Divider.js';
import { ProgressBar } from '../../src/components/ProgressBar.js';
import { Card } from '../../src/components/Card.js';
import { List, ListItem } from '../../src/components/List.js';
import { Modal, TextField } from '../../src/base.js';
import { DatePicker } from '../../src/components/Calendar.js';
import { Select } from '../../src/base.js';
import { I, S } from './icons.js';
import { contactOf, ME, QUICK, EMOJI } from './data.js';
import { hhmm, fullDate, dayKey, dayLabel } from './util.js';

const nameOf = (id) => (id === 'me' ? ME.name : contactOf(id)?.name ?? id);
export const chatTitle = (chat) => (chat.type === 'group' ? chat.name : nameOf(chat.with));
export const chatSubtitle = (chat, typing) => {
  if (typing) return 'typing…';
  if (chat.type === 'group') return `${chat.members.length + 1} members`;
  return contactOf(chat.with)?.seen ?? '';
};
export const previewOf = (msg) => (msg.kind === 'image' ? '📷 Photo' : msg.kind === 'file' ? `📎 ${msg.file.name}` : msg.kind === 'voice' ? '🎤 Voice message' : msg.text);

/** Avatar of a chat or a contact with the online mark. */
export function PersonAvatar({ id, name, group, size = 'md', dot = true }) {
  const c = contactOf(id);
  const nm = name ?? (group ? 'G' : c?.name);
  const status = dot && !group && c && c.status !== 'neutral'
    ? h(AvatarStatusDot, { variant: c.status, label: c.status === 'success' ? 'Online' : 'Busy' }) : undefined;
  return h(Avatar, { name: nm, size, status, tooltip: false, shape: group ? 'rounded' : 'circle' });
}

// one tick: sent; two ticks: delivered, and read (full strength)
function Ticks({ status }) {
  const path = (d) => h('path', { d });
  return h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-label': status },
    status === 'sent' ? path('M20 6 9 17l-5-5') : [path('M17 6 8 17l-4-5'), path('m22 6-9 11')]);
}

function Voice({ msg }) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => setPos((p) => { if (p >= msg.duration) { setPlaying(false); return 0; } return p + 0.25; }), 250);
    return () => clearInterval(t);
  }, [playing, msg.duration]);
  return h('div', { className: 'mm-voice' },
    h(IconButton, { variant: 'ghost', size: 'sm', label: playing ? 'Pause' : 'Play voice message', icon: playing ? h(I.PauseCircle) : h(I.PlayCircle), onClick: () => setPlaying(!playing), tooltip: false }),
    h(ProgressBar, { value: Math.min(100, (pos / msg.duration) * 100), 'aria-label': 'Voice message position' }),
    h('span', { className: 'mm-time', style: { color: 'inherit' } }, `0:${String(Math.round(msg.duration - pos)).padStart(2, '0')}`));
}

function Bubble({ msg, own, first, group, showAvatars, chat, onAction, onReact, replied }) {
  const sender = own ? null : nameOf(msg.from);
  const actions = [
    { value: 'reply', label: 'Reply', icon: h(I.CornerUpLeft) },
    { value: 'copy', label: 'Copy text', icon: h(I.Copy01), disabled: !msg.text },
    { value: 'forward', label: 'Forward', icon: h(I.FlipForward) },
    { type: 'group', label: 'React' },
    ...[['👍', 'Like'], ['❤️', 'Love'], ['😂', 'Haha'], ['🔥', 'Fire']].map(([e, n]) => ({ value: `react:${e}`, label: `${e}  ${n}` })),
    { type: 'divider' },
    { value: 'delete', label: 'Delete', icon: h(I.Trash01) },
  ];
  const body = msg.kind === 'image' ? h('div', null, h('div', { className: 'mm-image', style: { background: `linear-gradient(135deg, hsl(${msg.hue} 80% 62%), hsl(${msg.hue + 50} 75% 48%))` } }, msg.caption))
    : msg.kind === 'file' ? h('div', { className: 'mm-file' }, h('span', { className: 'mm-file__icon' }, h(I.File06, { size: 24 })),
      h('div', { className: 'mm-grow' }, h('div', null, msg.file.name), h('div', { className: 'mm-time', style: { color: 'inherit', opacity: .8 } }, msg.file.size)),
      h(IconButton, { variant: 'ghost', size: 'sm', label: 'Download', icon: h(I.Download01), onClick: () => onAction('download', msg) }))
    : msg.kind === 'voice' ? h(Voice, { msg }) : null;
  const reactions = Object.entries(msg.reactions || {});
  return h('div', { className: 'mm-msg', 'data-own': own || undefined, 'data-first': first || undefined, id: `m-${msg.id}` },
    group && !own && showAvatars && h('div', { className: 'mm-msg__avatar' }, first && h(PersonAvatar, { id: msg.from, size: 'sm', dot: false })),
    h('div', { className: 'mm-bubble' },
      group && !own && first && h('div', { className: 'mm-author' }, sender),
      replied && h('div', { className: 'mm-quote' }, h('b', null, nameOf(replied.from)), h('span', null, previewOf(replied))),
      body,
      msg.text && h('span', { className: 'mm-text' }, msg.text),
      h(Tooltip, { content: fullDate(msg.time), placement: 'top' },
        h('span', { className: 'mm-meta', 'data-read': msg.status === 'read' || undefined }, hhmm(msg.time), own && h(Ticks, { status: msg.status }))),
      reactions.length > 0 && h('div', { className: 'mm-reactions' }, reactions.map(([e, n]) =>
        h('button', { key: e, type: 'button', 'data-mine': msg.mine?.includes(e) || undefined, 'aria-label': `${e} ${n}`, onClick: () => onReact(msg, e) }, e, ' ', n)))),
    h(Dropdown, {
      className: 'mm-msg__more', options: actions, value: null, placement: own ? 'bottom-end' : 'bottom-start', label: 'Message actions',
      onValueChange: (v) => (v.startsWith('react:') ? onReact(msg, v.slice(6)) : onAction(v, msg)),
      trigger: (p) => h(IconButton, { ...p, variant: 'ghost', size: 'xsm', label: 'Message actions', icon: h(I.DotsVertical), tooltip: false }),
    }));
}

function Composer({ chat, draft, setDraft, replyTo, setReplyTo, onSend, onAttach, onSchedule, lastIncoming, compact }) {
  const ref = useRef(null);
  const [emoji, setEmoji] = useState(false);
  const [attach, setAttach] = useState(false);
  const empty = !draft.trim();
  const submit = () => { if (!empty) onSend({ text: draft.trim() }); };
  return h('div', { className: 'mm-composer', ref, onKeyDown: (e) => { if (e.key === 'Enter' && !e.shiftKey && e.target.tagName === 'TEXTAREA') { e.preventDefault(); submit(); } } },
    replyTo && h('div', { className: 'mm-reply-bar' },
      h('div', { className: 'mm-grow' }, h('b', null, `Reply to ${nameOf(replyTo.from)}`), h('div', { className: 'mm-muted', style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, previewOf(replyTo))),
      h(IconButton, { variant: 'ghost', size: 'sm', label: 'Cancel reply', icon: h(I.XClose), onClick: () => setReplyTo(null) })),
    lastIncoming && empty && !replyTo && h('div', { className: 'mm-quick' }, QUICK.map((q) => h(Button, { key: q, size: 'sm', variant: 'secondary', shape: 'circle', onClick: () => onSend({ text: q }) }, q))),
    h('div', { className: 'mm-composer__row' },
      h(Popover, { open: attach, onOpenChange: setAttach, placement: 'top-start', label: 'Attach', trigger: (p) => h(IconButton, { ...p, variant: 'secondary', size: 'lg', label: 'Attach', icon: h(I.Plus) }) },
        h(List, { size: 'sm', 'aria-label': 'Attach' },
          h(ListItem, { icon: h(I.Image01), onClick: () => { setAttach(false); onAttach('photo'); } }, 'Photo'),
          h(ListItem, { icon: h(I.File06), onClick: () => { setAttach(false); onAttach('file'); } }, 'Document'),
          h(ListItem, { icon: h(I.MarkerPin01), onClick: () => { setAttach(false); onAttach('location'); } }, 'Location'))),
      h('div', { className: 'mm-composer__field' }, h(TextField, {
        label: 'Message', floatingLabel: false, multiline: true, minRows: 1, maxRows: 5, size: 'md', value: draft, onChange: (e) => setDraft(e.target.value),
        startIcon: undefined, trailing: h(Popover, { open: emoji, onOpenChange: setEmoji, placement: 'top-end', label: 'Emoji', trigger: (p) => h(IconButton, { ...p, variant: 'ghost', size: 'sm', label: 'Emoji', icon: h(I.FaceSmile), tooltip: false }) },
          h('div', { className: 'mm-emoji' }, EMOJI.map((e) => h('button', { key: e, type: 'button', 'aria-label': e, onClick: () => { setDraft(draft + e); setEmoji(false); } }, e)))),
      })),
      !empty && h(IconButton, { variant: 'secondary', size: 'lg', label: 'Schedule message', icon: h(I.Clock), onClick: onSchedule }),
      h(IconButton, { variant: 'primary', size: 'lg', label: empty ? 'Record voice message' : 'Send', icon: empty ? h(I.Microphone01) : h(I.Send01), onClick: () => (empty ? onAttach('voice') : submit()) })));
}

function ScheduleModal({ open, onClose, draft, onConfirm }) {
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState('09:00');
  const times = ['08:00', '09:00', '12:00', '18:00', '21:00'].map((t) => ({ value: t, label: t }));
  return h(Modal, {
    open, onOpenChange: (o) => !o && onClose(), title: 'Schedule message', subtitle: 'It will be sent at the chosen time',
    primaryAction: h(Button, { variant: 'primary', onClick: () => onConfirm(date, time) }, 'Schedule'),
    secondaryAction: h(Button, { variant: 'secondary', onClick: onClose }, 'Cancel'),
  }, h('div', { className: 'mm-stack' },
    h(Card, { padding: 12 }, draft || 'Your message'),
    h(DatePicker, { label: 'Date', value: date, onValueChange: setDate, min: new Date().toISOString().slice(0, 10), weekStartsOn: 1, locale: 'en-US' }),
    h(Select, { label: 'Time', options: times, value: time, onValueChange: setTime })));
}

/** The open chat: a navbar, the messages and the composer. */
export function ChatView({ chat, typing, isMobile, onBack, onSend, onReact, onDelete, settings, infoOpen, setInfoOpen, toast, onCall }) {
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [schedule, setSchedule] = useState(false);
  const scroller = useRef(null);
  const [composerH, setComposerH] = useState(88);
  const group = chat.type === 'group';
  const contact = group ? null : contactOf(chat.with);

  useEffect(() => { setDraft(''); setReplyTo(null); }, [chat.id]);
  useEffect(() => { const el = scroller.current; if (el) el.scrollTo({ top: el.scrollHeight }); }, [chat.id, chat.messages.length, typing, composerH]);
  const composerRef = useRef(null);
  useLayoutEffect(() => {
    const el = composerRef.current?.querySelector('.mm-composer');
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setComposerH(el.offsetHeight));
    ro.observe(el); setComposerH(el.offsetHeight);
    return () => ro.disconnect();
  }, [chat.id]);

  const byId = useMemo(() => Object.fromEntries(chat.messages.map((m) => [m.id, m])), [chat.messages]);
  const rows = [];
  let prev = null;
  chat.messages.forEach((m) => {
    if (!prev || dayKey(prev.time) !== dayKey(m.time)) rows.push({ day: m.time, key: `d${dayKey(m.time)}` });
    const first = !prev || prev.from !== m.from || m.time - prev.time > 5 * 60 * 1000 || dayKey(prev.time) !== dayKey(m.time);
    rows.push({ msg: m, first, key: m.id });
    prev = m;
  });

  const act = (what, msg) => {
    if (what === 'reply') setReplyTo(msg);
    else if (what === 'copy') { try { navigator.clipboard?.writeText(msg.text); } catch { /* clipboard unavailable */ } toast({ message: 'Text copied', status: 'success', duration: 2500 }); }
    else if (what === 'forward') toast({ message: 'Forwarding is not part of this demo', status: 'info' });
    else if (what === 'download') toast({ message: `Downloading ${msg.file.name}…`, status: 'info', duration: 2500 });
    else if (what === 'delete') onDelete(msg);
  };
  const send = (payload) => { onSend(chat.id, { ...payload, replyTo: replyTo?.id ?? null }); setDraft(''); setReplyTo(null); };
  const attach = (kind) => {
    if (kind === 'photo') send({ kind: 'image', caption: 'Photo', hue: Math.floor(Math.random() * 300) });
    else if (kind === 'file') send({ kind: 'file', file: { name: 'Document.pdf', size: '1.1 MB' } });
    else if (kind === 'voice') send({ kind: 'voice', duration: 8 + Math.floor(Math.random() * 20) });
    else send({ text: '📍 Shared location: Dolores Park, San Francisco' });
  };
  const last = chat.messages[chat.messages.length - 1];

  return h('div', { className: 'mm-chat' },
    h('div', { className: 'mm-chat__col mm-wallpaper' },
      h('div', { className: 'mm-pane__top' }, h(Navbar, {
        title: chatTitle(chat), subtitle: chatSubtitle(chat, typing), showBack: isMobile, onBack, backLabel: 'Chats',
        actions: [
          { icon: h(I.Phone, { size: 24 }), label: 'Call', onClick: () => onCall(chat) },
          { icon: infoOpen && !isMobile ? h(S.InfoCircle, { size: 24 }) : h(I.InfoCircle, { size: 24 }), label: 'Chat info', onClick: () => setInfoOpen(!infoOpen) },
        ],
      })),
      h('div', { className: 'mm-messages', ref: scroller, style: { '--mm-composer-h': `${composerH + 8}px` }, role: 'log', 'aria-label': `Messages with ${chatTitle(chat)}` },
        rows.map((r) => r.day
          ? h('div', { key: r.key, className: 'mm-day' }, h(Divider, { label: dayLabel(r.day) }))
          : h(Bubble, { key: r.key, msg: r.msg, own: r.msg.from === 'me', first: r.first, group, showAvatars: settings.groupAvatars, chat, onAction: act, onReact, replied: r.msg.replyTo ? byId[r.msg.replyTo] : null })),
        typing && h('div', { className: 'mm-msg', 'data-first': true }, h('div', { className: 'mm-bubble' }, h('span', { className: 'mm-typing', 'aria-label': 'typing' }, h('i'), h('i'), h('i'))))),
      h('div', { ref: composerRef },
        h(Composer, { chat, draft, setDraft, replyTo, setReplyTo, onSend: send, onAttach: attach, onSchedule: () => setSchedule(true), lastIncoming: last && last.from !== 'me' })),
      h(ScheduleModal, { open: schedule, onClose: () => setSchedule(false), draft, onConfirm: (date, time) => {
        setSchedule(false); toast({ message: `Message scheduled for ${date} at ${time}`, status: 'success', action: { label: 'Undo' } }); setDraft('');
      } })));
}

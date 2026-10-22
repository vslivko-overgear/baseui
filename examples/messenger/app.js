import { t as initDom, r as renderInto } from '../../lib/react-18-D4o7zN8K.js';
import { h, cx, useState, useEffect, useRef, useCallback } from '../../src/react.js';
import { ToastProvider, useToast } from '../../src/components/Toast.js';
import { Banner } from '../../src/components/Banner.js';
import { Navbar } from '../../src/components/MobileNavigation.js';
import { Button } from '../../src/components/Button.js';
import { Avatar } from '../../src/components/Avatar.js';
import { Status } from '../../src/components/Status.js';
import { Card } from '../../src/components/Card.js';
import { Badge } from '../../src/components/Badge.js';
import { AlertDialog } from '../../src/components/AlertDialog.js';
import { startTheme } from '../../site/theme.js';
import { I } from './icons.js';
import { CONTACTS, contactOf, makeChats, nextId, REPLIES } from './data.js';
import { useMedia, useSettings } from './util.js';
import { ChatView, PersonAvatar, previewOf, chatTitle } from './chat.js';
import { InfoContent, InfoSheet, CallModal, NewChatModal } from './dialogs.js';
import { ChatsSection, CallsSection, ContactsSection, SettingsSection, Sidebar } from './lists.js';
import { SettingsPage } from './settings.js';

startTheme();

function ContactPane({ id, isMobile, onBack, onMessage, onCall }) {
  const c = contactOf(id);
  return h('div', { className: 'mm-pane' },
    h('div', { className: 'mm-pane__top' }, h(Navbar, { title: c.name, subtitle: c.seen, showBack: isMobile, onBack, backLabel: 'Contacts' })),
    h('div', { className: 'mm-scroll' }, h('div', { className: 'mm-page' },
      h(Card, { padding: 24 }, h('div', { className: 'mm-center' },
        h(PersonAvatar, { id, size: 'xl' }), h('div', { className: 'mm-center__name' }, h('h2', null, c.name), h('span', { className: 'mm-muted' }, c.bio)),
        h(Badge, { variant: c.status === 'success' ? 'success' : c.status === 'error' ? 'error' : 'secondary', label: c.status === 'success' ? 'Online' : c.status === 'error' ? 'Busy' : 'Offline' }),
        h('div', { className: 'mm-row', style: { marginTop: 8 } },
          h(Button, { variant: 'primary', icon: h(I.MessageChatCircle), onClick: () => onMessage(id) }, 'Message'),
          h(Button, { variant: 'secondary', icon: h(I.Phone), onClick: () => onCall({ id, name: c.name }) }, 'Call')))))));
}

function Messenger() {
  const { toast } = useToast();
  const [settings, update] = useSettings();
  const [chats, setChats] = useState(makeChats);
  const [section, setSection] = useState('chats');
  const [pane, setPane] = useState(null); // { type: 'chat' | 'settings' | 'contact', id }
  const [typing, setTyping] = useState({});
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);
  const [call, setCall] = useState(null);
  const [newChat, setNewChat] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [infoMobile, setInfoMobile] = useState(false);
  const isMobile = useMedia('(max-width: 859px)');
  const isWide = useMedia('(min-width: 1180px)');
  const paneRef = useRef(pane);
  paneRef.current = pane;

  useEffect(() => { setInfoMobile(false); }, [pane?.id]);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);
  useEffect(() => { document.documentElement.style.setProperty('--mm-scale', settings.textSize / 100); }, [settings.textSize]);
  useEffect(() => { document.documentElement.dataset.density = settings.density; }, [settings.density]);

  const unread = chats.reduce((a, c) => a + (c.muted ? 0 : c.unread), 0);
  const patchChat = useCallback((id, fn) => setChats((cs) => cs.map((c) => (c.id === id ? fn(c) : c))), []);
  const active = pane?.type === 'chat' ? chats.find((c) => c.id === pane.id) : null;

  const openChat = (id) => { setPane({ type: 'chat', id }); patchChat(id, (c) => ({ ...c, unread: 0 })); };
  // messages that arrive while the chat is on screen are read at once
  useEffect(() => { if (active && active.unread) patchChat(active.id, (c) => ({ ...c, unread: 0, messages: c.messages.map((m) => (m.from === 'me' ? { ...m, status: 'read' } : m)) })); }, [active?.id, active?.messages.length]);

  const receive = useCallback((chatId, from, text) => {
    const msg = { id: nextId(), from, text, time: Date.now(), status: 'read' };
    patchChat(chatId, (c) => {
      const open = paneRef.current?.type === 'chat' && paneRef.current.id === chatId;
      return { ...c, unread: open ? 0 : c.unread + 1, messages: [...c.messages.map((m) => (m.from === 'me' ? { ...m, status: 'read' } : m)), msg] };
    });
    return msg;
  }, [patchChat]);

  const send = (chatId, payload) => {
    const msg = { id: nextId(), from: 'me', time: Date.now(), status: 'sent', ...payload };
    patchChat(chatId, (c) => ({ ...c, messages: [...c.messages, msg] }));
    setTimeout(() => patchChat(chatId, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === msg.id ? { ...m, status: 'delivered' } : m)) })), 600);
    if (settings.offline) return;
    setTimeout(() => setTyping((t) => ({ ...t, [chatId]: true })), 1000);
    setTimeout(() => {
      setTyping((t) => ({ ...t, [chatId]: false }));
      const chat = chatsRef.current.find((c) => c.id === chatId);
      const from = chat.type === 'group' ? chat.members[Math.floor(Math.random() * chat.members.length)] : chat.with;
      receive(chatId, from, REPLIES[Math.floor(Math.random() * REPLIES.length)]);
    }, 2800);
  };
  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  // someone writes from time to time, so the unread counters and the notifications are alive
  useEffect(() => {
    if (settings.offline) return undefined;
    const t = setInterval(() => {
      const open = paneRef.current?.type === 'chat' ? paneRef.current.id : null;
      const pool = chatsRef.current.filter((c) => c.id !== open);
      const chat = pool[Math.floor(Math.random() * pool.length)];
      if (!chat) return;
      const from = chat.type === 'group' ? chat.members[Math.floor(Math.random() * chat.members.length)] : chat.with;
      const text = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      receive(chat.id, from, text);
      const allowed = chat.type === 'group' ? settings.notifyGroups : settings.notifyMessages;
      if (allowed && !chat.muted) toast({ message: h('span', null, h('b', null, contactOf(from).name), settings.preview ? `: ${text}` : ' sent a message'), action: { label: 'Open', onClick: () => { setSection('chats'); openChat(chat.id); } }, duration: 4500 });
    }, 45000);
    return () => clearInterval(t);
  }, [settings.offline, settings.notifyGroups, settings.notifyMessages, settings.preview]);

  const openDirect = (contactId) => {
    let chat = chatsRef.current.find((c) => c.type === 'direct' && c.with === contactId);
    if (!chat) {
      chat = { id: `c-${contactId}`, type: 'direct', with: contactId, pinned: false, muted: false, unread: 0, messages: [{ id: nextId(), from: 'me', text: 'Hi! 👋', time: Date.now(), status: 'sent' }] };
      setChats((cs) => [...cs, chat]);
    }
    setSection('chats'); openChat(chat.id);
  };
  const createChat = (picked, name) => {
    setNewChat(false);
    if (picked.length === 1) return openDirect(picked[0]);
    const chat = { id: `g-${nextId()}`, type: 'group', name, members: picked, pinned: false, muted: false, unread: 0, messages: [{ id: nextId(), from: 'me', text: `Created the group “${name}”`, time: Date.now(), status: 'read' }] };
    setChats((cs) => [...cs, chat]); setSection('chats'); openChat(chat.id);
    toast({ message: `Group “${name}” created`, status: 'success' });
  };
  const react = (chatId) => (msg, emoji) => patchChat(chatId, (c) => ({ ...c, messages: c.messages.map((m) => {
    if (m.id !== msg.id) return m;
    const mine = m.mine || [];
    const on = mine.includes(emoji);
    const reactions = { ...(m.reactions || {}) };
    reactions[emoji] = (reactions[emoji] || 0) + (on ? -1 : 1);
    if (reactions[emoji] <= 0) delete reactions[emoji];
    return { ...m, reactions, mine: on ? mine.filter((x) => x !== emoji) : [...mine, emoji] };
  }) }));
  const toggle = (chat) => (key) => { patchChat(chat.id, (c) => ({ ...c, [key]: !c[key] })); toast({ message: key === 'muted' ? (chat.muted ? 'Chat unmuted' : 'Chat muted') : (chat.pinned ? 'Chat unpinned' : 'Chat pinned'), status: 'neutral', duration: 2200 }); };
  const deleteChat = (id) => {
    const removed = chatsRef.current.find((c) => c.id === id);
    setChats((cs) => cs.filter((c) => c.id !== id)); setPane(null);
    toast({ message: 'Chat deleted', action: { label: 'Undo', onClick: () => setChats((cs) => [...cs, removed]) } });
  };
  const startCall = (c) => setCall(c.type ? { id: c.with ?? c.id, name: chatTitle(c), group: c.type === 'group' } : c);

  const go = (s) => { setSection(s); if (isMobile) setPane(null); };
  const mobileOpen = !!pane;
  const missed = 2;

  let main;
  if (pane?.type === 'chat' && active) {
    main = h('div', { className: 'mm-chat', key: active.id },
      h(ChatView, {
        chat: active, typing: typing[active.id], isMobile, onBack: () => setPane(null), onSend: send, onReact: react(active.id), onDelete: setDeleteMsg, settings, toast, onCall: startCall,
        infoOpen: isMobile ? infoMobile : infoOpen, setInfoOpen: isMobile ? setInfoMobile : setInfoOpen,
      }),
      !isMobile && infoOpen && h('aside', { className: 'mm-info', 'aria-label': 'Chat info' }, h(InfoContent, { chat: active, onToggle: toggle(active), onDelete: deleteChat, onCall: startCall, toast })),
    );
  } else if (pane?.type === 'settings') main = h(SettingsPage, { pageKey: pane.id, isMobile, onBack: () => setPane(null), settings, update, toast });
  else if (pane?.type === 'contact') main = h(ContactPane, { id: pane.id, isMobile, onBack: () => setPane(null), onMessage: openDirect, onCall: setCall });
  else main = h('div', { className: 'mm-empty' }, h(Status, { status: 'accent', icon: h(I.MessageChatCircle, { size: 32 }), title: 'Select a chat', description: 'Pick a conversation on the left or start a new one.', actionLabel: 'New chat', onAction: () => setNewChat(true) }));

  const sideContent = section === 'chats' ? h(ChatsSection, { chats, typing, activeId: pane?.type === 'chat' ? pane.id : null, onOpen: openChat, onNew: () => setNewChat(true), loading, unread,
    onReadAll: () => { setChats((cs) => cs.map((c) => ({ ...c, unread: 0 }))); toast({ message: 'All chats marked as read', status: 'success', duration: 2200 }); } })
    : section === 'calls' ? h(CallsSection, { onCall: setCall })
      : section === 'contacts' ? h(ContactsSection, { onOpenContact: (id) => setPane({ type: 'contact', id }), onMessage: openDirect, onNew: () => setNewChat(true) })
        : h(SettingsSection, { page: pane?.type === 'settings' ? pane.id : null, onOpen: (k) => setPane({ type: 'settings', id: k }), profile: settings.profile });

  return h('div', { className: cx('mm', mobileOpen && 'mm--open'), 'data-wallpaper': settings.wallpaper },
    settings.offline && h('div', { className: 'mm-banner' }, h(Banner, { status: 'warning', title: 'You are offline', onClose: () => update({ offline: false }) }, 'Messages are kept on this device and replies are paused.')),
    h(Sidebar, { section, setSection: go, unread, missed }, sideContent),
    h('main', { className: 'mm-main' }, main),
    h(InfoSheet, { open: isMobile && infoMobile && !!active, onClose: () => setInfoMobile(false), chat: active, onToggle: active && toggle(active), onDelete: (id) => { setInfoMobile(false); deleteChat(id); }, onCall: startCall, toast }),
    h(CallModal, { call, onClose: () => setCall(null), toast }),
    h(NewChatModal, { open: newChat, onClose: () => setNewChat(false), onCreate: createChat }),
    h(AlertDialog, { open: !!deleteMsg, onOpenChange: (o) => !o && setDeleteMsg(null), destructive: true, title: 'Delete this message?', description: 'It will be removed from this device.', confirmLabel: 'Delete',
      onConfirm: () => { const m = deleteMsg; setDeleteMsg(null); setChats((cs) => cs.map((c) => ({ ...c, messages: c.messages.filter((x) => x.id !== m.id) }))); toast({ message: 'Message deleted', status: 'neutral', duration: 2500 }); } }));
}

function App() {
  return h(ToastProvider, { placement: 'top-center' }, h(Messenger));
}

await initDom();
renderInto(h(App), document.getElementById('root'));

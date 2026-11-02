// AI Chat templates: a conversation and the empty landing that precedes it.
import { useState } from '../react.js';
import { Stack } from '../components/Layout.jsx';
import { Button } from '../components/Button.jsx';
import { IconButton } from '../components/Button.jsx';
import { TextInput } from '../components/TextInput.jsx';
import { Token } from '../components/Token.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Icon } from '../components/Icon.jsx';
import { Page } from './_kit.jsx';

const Composer = ({ onSend }) => {
  const [text, setText] = useState('');
  return (
    <form className="tpl-composer" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend && onSend(text); setText(''); } }}>
      <TextInput label="Message" value={text} onChange={(e) => setText(e.target.value)} action={<IconButton icon={<Icon name="Send01" size={20} />} label="Send" variant="primary" size="sm" onClick={() => { if (text.trim()) { onSend && onSend(text); setText(''); } }} />} />
    </form>
  );
};

export function AiChatConversation() {
  const [turns, setTurns] = useState([
    { me: true, text: 'Summarise the feedback from last week’s interviews' },
    { me: false, text: 'Five people mentioned that setup takes too long. Three asked for saved views, and two liked the new dashboard. I can group these into themes if you like' },
  ]);
  return (
    <Page width={760} padding={4}>
      <div className="tpl-chat" role="log" aria-label="Conversation">
        {turns.map((t, i) => (
          <div key={i} className={`tpl-bubble${t.me ? ' tpl-bubble--me' : ''}`}>{t.text}</div>
        ))}
      </div>
      <Composer onSend={(text) => setTurns((c) => [...c, { me: true, text }, { me: false, text: 'Looking into it. Here is what I found so far' }])} />
    </Page>
  );
}

export function AiChatLanding() {
  const [picked, setPicked] = useState(null);
  return (
    <Page width={720}>
      <div className="tpl-hero">
        <Avatar alt="Assistant" size="lg" />
        <Stack gap={4} align="center">
        <h1>What can I help with?</h1>
        <Stack direction="row" gap={2} justify="center" wrap>
          {['Plan my week', 'Draft an email', 'Explain a metric', 'Review my copy'].map((s) => <Token key={s} pressed={picked === s} onPressedChange={() => setPicked(s)}>{s}</Token>)}
        </Stack>
        </Stack>
      </div>
      <Composer />
    </Page>
  );
}

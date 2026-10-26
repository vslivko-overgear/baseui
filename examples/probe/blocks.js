import { h, useState, useEffect, useRef } from '../../src/react.js';
import { Button } from '../../src/components/Button.js';
import { Rating } from '../../src/components/Rating.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { ProgressBar } from '../../src/components/ProgressBar.js';
import { Status } from '../../src/components/Status.js';
import { Badge } from '../../src/components/Badge.js';
import { RadioGroup, Checkbox } from '../../src/components/Checks.js';
import { TextField } from '../../src/base.js';
import { Screen } from './screens.js';
import { I } from './icons.js';
import { BLOCK_TYPES } from './data.js';
import { duration } from './util.js';

const Head = ({ block, step }) => h('div', { className: 'pb-qhead' },
  step && h('span', { className: 'pb-eyebrow' }, step),
  h('h2', { className: 'pb-q' }, block.title || 'Untitled question'),
  block.desc && h('p', { className: 'pb-qdesc' }, block.desc));

/** One step of a study as a participant sees it. The same component draws the preview in the builder and the real test. */
export function BlockView({ block, answer, onAnswer, onNext, step, preview }) {
  const t = block.type;
  if (t === 'welcome' || t === 'thanks') {
    return h('div', { className: 'pb-center' },
      h(Status, { status: t === 'thanks' ? 'success' : 'accent', icon: h(t === 'thanks' ? I.CheckCircle : I.Flag01, { size: 32 }), title: block.title || 'Untitled', description: block.desc,
        actionLabel: t === 'welcome' ? 'Start' : undefined, onAction: t === 'welcome' && !preview ? onNext : undefined }));
  }
  if (t === 'scale') {
    const values = block.max === 10 ? Array.from({ length: 11 }, (_, i) => i) : Array.from({ length: block.max }, (_, i) => i + 1);
    return h('div', { className: 'pb-block' }, h(Head, { block, step }),
      block.max === 5
        ? h('div', { className: 'pb-scale' }, h(Rating, { label: block.title, value: answer || 0, onValueChange: onAnswer, size: 'lg', max: 5 }), h('div', { className: 'pb-scale__ends' }, h('span', null, block.low), h('span', null, block.high)))
        : h('div', { className: 'pb-scale' },
          h(SegmentedControl, { label: block.title, fullWidth: true, size: 'md', value: answer === undefined ? undefined : String(answer), onValueChange: (v) => onAnswer(Number(v)), items: values.map((v) => ({ value: String(v), label: String(v) })) }),
          h('div', { className: 'pb-scale__ends' }, h('span', null, block.low), h('span', null, block.high))));
  }
  if (t === 'choice') {
    const options = (block.options || []).map((o) => ({ value: o.id, label: o.label }));
    const picked = answer || [];
    return h('div', { className: 'pb-block' }, h(Head, { block, step }),
      block.multiple
        ? h('div', { className: 'pb-options' }, options.map((o) => h(Checkbox, { key: o.value, label: o.label, checked: picked.includes(o.value), onCheckedChange: (c) => onAnswer(c ? [...picked, o.value] : picked.filter((x) => x !== o.value)) })))
        : h(RadioGroup, { title: undefined, value: picked[0] ?? null, onValueChange: (v) => onAnswer([v]), options, 'aria-label': block.title }),
      block.multiple && h('span', { className: 'pb-hint' }, 'Select all that apply'));
  }
  if (t === 'yesno') {
    return h('div', { className: 'pb-block' }, h(Head, { block, step }),
      h('div', { className: 'pb-yesno' },
        h(Button, { variant: answer === true ? 'primary' : 'secondary', size: 'lg', icon: h(I.Check), onClick: () => onAnswer(true), 'aria-pressed': answer === true }, 'Yes'),
        h(Button, { variant: answer === false ? 'primary' : 'secondary', size: 'lg', icon: h(I.XClose), onClick: () => onAnswer(false), 'aria-pressed': answer === false }, 'No')));
  }
  if (t === 'text') {
    return h('div', { className: 'pb-block' }, h(Head, { block, step }), h(TextField, { label: 'Your answer', multiline: true, minRows: 3, maxRows: 8, value: answer || '', onChange: (e) => onAnswer(e.target.value) }));
  }
  if (t === 'task') return h(TaskBlock, { block, onAnswer, onNext, step, preview });
  if (t === 'fivesec') return h(FiveSecond, { block, answer, onAnswer, step, preview });
  return null;
}

/** A prototype task: the first click on the target ends it; a click elsewhere is a miss. */
function TaskBlock({ block, onAnswer, onNext, step, preview }) {
  const [clicks, setClicks] = useState([]);
  const [done, setDone] = useState(null);
  const start = useRef(Date.now());
  useEffect(() => { setClicks([]); setDone(null); start.current = Date.now(); }, [block.id, block.screen]);
  const finish = (success, all) => {
    const result = { success, secs: Math.max(1, Math.round((Date.now() - start.current) / 1000)), misses: all.filter((c) => !c.hit).length, clicks: all };
    setDone(result); onAnswer(result);
  };
  const click = ({ x, y, target }) => {
    if (done) return;
    const hit = !!target && (block.targets || []).includes(target);
    const next = [...clicks, { x, y, hit }];
    setClicks(next);
    if (hit) finish(true, next);
  };
  return h('div', { className: 'pb-block pb-block--wide' }, h(Head, { block, step }),
    h('div', { className: 'pb-proto' }, h(Screen, { screen: block.screen, onClick: click, clicks: done ? clicks : undefined, label: 'Prototype' })),
    h('div', { className: 'pb-row' },
      done
        ? h(Badge, { variant: done.success ? 'success' : 'warning', size: 'md', label: done.success ? `Done in ${duration(done.secs)}` : 'Skipped' })
        : h('span', { className: 'pb-hint' }, clicks.length ? `${clicks.length} ${clicks.length === 1 ? 'click' : 'clicks'}, keep looking` : 'Click on the prototype to try'),
      !done && h(Button, { variant: 'ghost', size: 'sm', onClick: () => finish(false, clicks) }, 'I can’t find it'),
      ));
}

/** A screen is shown for five seconds, then it hides and the next questions follow. */
function FiveSecond({ block, answer, onAnswer, step, preview }) {
  const [phase, setPhase] = useState('ready');
  const [left, setLeft] = useState(5);
  useEffect(() => { setPhase('ready'); setLeft(5); }, [block.id]);
  useEffect(() => {
    if (phase !== 'show') return undefined;
    if (left <= 0) { setPhase('done'); onAnswer({ seen: true }); return undefined; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left]);
  return h('div', { className: 'pb-block pb-block--wide' }, h(Head, { block, step }),
    h('div', { className: 'pb-proto' },
      h(Screen, { screen: block.screen, hide: phase !== 'show' }),
      phase === 'ready' && h('div', { className: 'pb-cover' }, h(Button, { variant: 'primary', icon: h(I.Play), onClick: () => setPhase('show') }, 'Show the screen')),
      phase === 'done' && h('div', { className: 'pb-cover' }, h('span', { className: 'pb-muted' }, 'The screen is hidden')),
      phase === 'show' && h('div', { className: 'pb-timer' }, h(ProgressBar, { value: (left / 5) * 100, size: 'sm', 'aria-label': 'Time left' }), h('span', null, `${left}s`))));
}

export const blockLabel = (b) => BLOCK_TYPES[b.type].label;
/** Is the step answered enough to go on? */
export const isAnswered = (block, answer) => {
  if (!block.required || block.type === 'welcome' || block.type === 'thanks') return true;
  if (block.type === 'choice') return Array.isArray(answer) && answer.length > 0;
  if (block.type === 'text') return !!(answer && answer.trim());
  if (block.type === 'task' || block.type === 'fivesec') return !!answer;
  return answer !== undefined && answer !== null;
};

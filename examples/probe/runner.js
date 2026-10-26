import { h, useState, useEffect, useRef } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.js';
import { ProgressBar } from '../../src/components/ProgressBar.js';
import { Status } from '../../src/components/Status.js';
import { Banner } from '../../src/components/Banner.js';
import { useToast } from '../../src/components/Toast.js';
import { BlockView, isAnswered } from './blocks.js';
import { I } from './icons.js';
import { useStore } from './store.js';
import { go, useMedia } from './util.js';
import { ME } from './data.js';

/**
 * The study as a participant takes it. From the builder it is a preview (nothing is saved);
 * from the scenarios menu it is the real thing: the answers become a response in the results.
 */
export function Runner({ id, preview }) {
  const store = useStore();
  const { toast } = useToast();
  const study = store.study(id);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const started = useRef(Date.now());
  const saved = useRef(false);
  const isMobile = useMedia('(max-width: 859px)');
  const back = preview ? `/study/${id}/build` : `/study/${id}/results`;

  const blocks = study?.blocks || [];
  const block = blocks[i];
  const last = i === blocks.length - 1;
  const steps = blocks.filter((b) => !['welcome', 'thanks'].includes(b.type));
  const stepNo = block && steps.indexOf(block) + 1;
  const ok = block && isAnswered(block, answers[block.id]);

  useEffect(() => {
    if (!study || !last || preview || saved.current) return;
    saved.current = true;
    const device = isMobile ? 'mobile' : 'desktop';
    store.addResponse(id, { id: `me-${Date.now()}`, who: `${ME.name} (you)`, device, country: 'United States', at: Date.now(), secs: Math.round((Date.now() - started.current) / 1000), done: true, answers, score: null, mine: true });
    toast({ message: 'Your response was added to the results', status: 'success', action: { label: 'See results', onClick: () => go(`/study/${id}/results`) } });
  }, [last]);

  useEffect(() => {
    const key = (e) => { if (e.key === 'Enter' && ok && !last && !['TEXTAREA', 'BUTTON', 'A'].includes(document.activeElement?.tagName) && block.type !== 'welcome') { setI((x) => x + 1); } };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [ok, last, block]);

  if (!study) return h('div', { className: 'pb-run' }, h(Status, { status: 'neutral', title: 'Study not found', description: 'It may have been deleted.', actionLabel: 'Back to studies', onAction: () => go('/') }));
  if (!blocks.length) return h('div', { className: 'pb-run' }, h(Status, { status: 'neutral', title: 'This study is empty', description: 'Add a few blocks in the builder first.', actionLabel: 'Open the builder', onAction: () => go(back) }));

  const set = (v) => setAnswers((a) => ({ ...a, [block.id]: v }));
  const replay = () => { setI(0); setAnswers({}); started.current = Date.now(); saved.current = false; };

  return h('div', { className: 'pb-run', 'data-slot': 'runner' },
    preview && h(Banner, { status: 'info', title: 'Preview', onClose: undefined }, 'This is what participants see. Nothing you answer here is saved.'),
    h('header', { className: 'pb-run__bar' },
      h(IconButton, { variant: 'ghost', size: 'md', label: preview ? 'Close the preview' : 'Leave the test', icon: h(I.XClose), onClick: () => go(back) }),
      h(ProgressBar, { value: (i / (blocks.length - 1)) * 100, size: 'sm', 'aria-label': 'Progress' }),
      h('span', { className: 'pb-muted pb-run__count' }, `${i + 1} / ${blocks.length}`)),
    h('main', { className: 'pb-run__main' },
      h('div', { className: 'pb-run__card', key: block.id },
        h(BlockView, { block, answer: answers[block.id], onAnswer: set, onNext: () => setI(i + 1), step: stepNo > 0 ? `Question ${stepNo} of ${steps.length}` : undefined, preview: false }),
        last && h('div', { className: 'pb-row pb-row--center' },
          h(Button, { variant: 'secondary', icon: h(I.ClockRewind), onClick: replay }, 'Take it again'),
          h(Button, { variant: 'primary', onClick: () => go(back) }, preview ? 'Back to the builder' : 'See the results')))),
    block.type !== 'welcome' && !last && h('footer', { className: 'pb-run__foot' },
      h(Button, { variant: 'ghost', disabled: i === 0, icon: h(I.ArrowLeft), onClick: () => setI(i - 1) }, 'Back'),
      h(Button, { variant: 'primary', disabled: !ok, onClick: () => setI(i + 1) }, 'Continue')));
}

import { h, useState, useMemo } from '../../src/react.js';
import { Card } from '../../src/components/Card.js';
import { Badge } from '../../src/components/Badge.js';
import { Button } from '../../src/components/Button.js';
import { ProgressBar } from '../../src/components/ProgressBar.js';
import { SegmentedControl } from '../../src/components/SegmentedControl.js';
import { Tabs, TabList, Tab, TabPanel } from '../../src/components/Tabs.js';
import { Table, proportional, pixel } from '../../src/components/Table.js';
import { CollapsibleGroup } from '../../src/components/Collapsible.js';
import { Status } from '../../src/components/Status.js';
import { Grid } from '../../src/components/Layout.js';
import { Avatar } from '../../src/components/Avatar.js';
import { List, ListItem } from '../../src/components/List.js';
import { Modal } from '../../src/base.js';
import { useToast } from '../../src/components/Toast.js';
import { Screen } from './screens.js';
import { I } from './icons.js';
import { BLOCK_TYPES, DEVICES, screenLabel } from './data.js';
import { blockLabel } from './blocks.js';
import { avg, duration, pct, plural, ago, go } from './util.js';
import { useStore } from './store.js';

const answered = (r, b) => r.answers[b.id] !== undefined;
const questionsOf = (study) => study.blocks.filter((b) => !['welcome', 'thanks'].includes(b.type));

function Metric({ label, value, note, children }) {
  return h(Card, { padding: 16, variant: 'muted' }, h('div', { className: 'pb-metric' },
    h('span', { className: 'pb-muted' }, label), h('b', { className: 'pb-metric__value' }, value), note && h('span', { className: 'pb-muted pb-metric__note' }, note), children));
}
const Bar = ({ label, value, total, detail }) => h('div', { className: 'pb-bar' },
  h('div', { className: 'pb-bar__top' }, h('span', null, label), h('span', { className: 'pb-muted' }, detail ?? `${pct(value, total)}% · ${value}`)),
  h(ProgressBar, { value: pct(value, total), size: 'sm', 'aria-label': label }));

function ScaleResult({ block, list }) {
  const values = list.map((r) => r.answers[block.id]).filter((v) => v !== undefined);
  const range = block.max === 10 ? Array.from({ length: 11 }, (_, i) => i) : Array.from({ length: block.max }, (_, i) => i + 1);
  const mean = avg(values);
  const nps = block.max === 10 ? Math.round(((values.filter((v) => v >= 9).length - values.filter((v) => v <= 6).length) / Math.max(1, values.length)) * 100) : null;
  return h('div', { className: 'pb-stack' },
    h('div', { className: 'pb-row' }, h(Badge, { variant: 'primary', size: 'md', label: `Average ${mean.toFixed(1)} / ${block.max}` }), nps !== null && h(Badge, { variant: nps >= 0 ? 'success' : 'error', size: 'md', label: `NPS ${nps}` }), h('span', { className: 'pb-muted' }, plural(values.length, 'answer'))),
    range.map((v) => h(Bar, { key: v, label: String(v), value: values.filter((x) => x === v).length, total: values.length })));
}
function ChoiceResult({ block, list }) {
  const values = list.map((r) => r.answers[block.id]).filter(Boolean);
  return h('div', { className: 'pb-stack' }, (block.options || []).map((o) => h(Bar, { key: o.id, label: o.label, value: values.filter((v) => v.includes(o.id)).length, total: values.length })));
}
function YesNoResult({ block, list }) {
  const values = list.map((r) => r.answers[block.id]).filter((v) => v !== undefined);
  return h('div', { className: 'pb-stack' }, h(Bar, { label: 'Yes', value: values.filter(Boolean).length, total: values.length }), h(Bar, { label: 'No', value: values.filter((v) => !v).length, total: values.length }));
}
function TextResult({ block, list }) {
  const [all, setAll] = useState(false);
  const rows = list.filter((r) => typeof r.answers[block.id] === 'string');
  if (!rows.length) return h(Status, { status: 'neutral', title: 'No answers yet', description: 'Answers will appear here as people respond.' });
  return h('div', { className: 'pb-stack' },
    h(List, { size: 'md', spacing: 'sm', 'aria-label': 'Answers' }, rows.slice(0, all ? 40 : 5).map((r) => h(ListItem, { key: r.id, avatar: h(Avatar, { name: r.who.replace('(you)', '').trim(), size: 'sm', tooltip: false }), subtitle: `${r.who} · ${ago(r.at)}` }, r.answers[block.id]))),
    rows.length > 5 && h(Button, { variant: 'secondary', size: 'sm', onClick: () => setAll(!all) }, all ? 'Show less' : `Show all ${rows.length}`));
}
function TaskResult({ block, list }) {
  const values = list.map((r) => r.answers[block.id]).filter((v) => v && v.clicks);
  const ok = values.filter((v) => v.success);
  const clicks = values.flatMap((v) => v.clicks);
  return h('div', { className: 'pb-stack' },
    h(Grid, { columns: 3, gap: 12 },
      h(Metric, { label: 'Success', value: `${pct(ok.length, values.length)}%`, note: `${ok.length} of ${values.length}` }),
      h(Metric, { label: 'Avg. time', value: duration(avg(ok.map((v) => v.secs))) }),
      h(Metric, { label: 'Misclicks', value: avg(values.map((v) => v.misses)).toFixed(1), note: 'per person' })),
    h('div', { className: 'pb-proto pb-proto--map' }, h(Screen, { screen: block.screen, clicks: clicks.slice(0, 400), label: `Click map: ${screenLabel(block.screen)}` })),
    h('div', { className: 'pb-row' }, h('span', { className: 'pb-legend pb-legend--hit' }, 'Hit the target'), h('span', { className: 'pb-legend' }, 'Missed')));
}
function FiveSecResult({ block, list }) {
  const seen = list.filter((r) => r.answers[block.id]?.seen).length;
  return h('div', { className: 'pb-stack' },
    h('div', { className: 'pb-row' }, h(Badge, { variant: 'primary', size: 'md', label: `${plural(seen, 'person', 'people')} saw it for 5 seconds` }), h('span', { className: 'pb-muted' }, 'What they remembered is in the next question.')),
    h('div', { className: 'pb-proto pb-proto--map' }, h(Screen, { screen: block.screen, label: screenLabel(block.screen) })));
}
const RESULT = { scale: ScaleResult, choice: ChoiceResult, yesno: YesNoResult, text: TextResult, fivesec: FiveSecResult, task: TaskResult };

function ResponseModal({ response, study, onClose }) {
  const questions = questionsOf(study);
  const show = (b, v) => {
    if (v === undefined) return h('span', { className: 'pb-muted' }, 'Skipped');
    if (b.type === 'choice') return (v || []).map((id) => b.options.find((o) => o.id === id)?.label).filter(Boolean).join(', ');
    if (b.type === 'yesno') return v ? 'Yes' : 'No';
    if (b.type === 'task') return v.success ? `Succeeded in ${duration(v.secs)}, ${plural(v.misses, 'misclick')}` : `Gave up after ${plural(v.clicks.length, 'click')}`;
    if (b.type === 'scale') return `${v} / ${b.max}`;
    if (b.type === 'fivesec' && typeof v === 'object') return 'Saw the screen';
    return String(v);
  };
  return h(Modal, { open: !!response, onOpenChange: (o) => !o && onClose(), title: response?.who || '', subtitle: response ? `${DEVICES[response.device]} · ${response.country} · ${ago(response.at)}` : undefined, primaryAction: h(Button, { variant: 'primary', onClick: onClose }, 'Close') },
    response && h('div', { className: 'pb-stack' },
      h('div', { className: 'pb-row' }, h(Badge, { variant: response.done ? 'success' : 'warning', size: 'md', label: response.done ? 'Completed' : 'Left early' }), h(Badge, { variant: 'secondary', size: 'md', label: duration(response.secs) }), response.score !== null && h(Badge, { variant: 'primary', size: 'md', label: `Score ${response.score}` })),
      questions.map((b) => h('div', { key: b.id, className: 'pb-answer' }, h('span', { className: 'pb-muted' }, b.title), h('div', null, show(b, response.answers[b.id]))))));
}

export function Results({ study }) {
  const store = useStore();
  const { toast } = useToast();
  const [device, setDevice] = useState('all');
  const [tab, setTab] = useState('overview');
  const [open, setOpen] = useState(null);
  const all = store.responsesOf(study);
  const list = useMemo(() => all.filter((r) => device === 'all' || r.device === device), [all, device]);
  const questions = questionsOf(study);
  const done = list.filter((r) => r.done);
  const scores = list.map((r) => r.score).filter((s) => s !== null);
  const total = store.countOf(study);

  if (!all.length) {
    return h(Status, { status: 'neutral', icon: h(I.BarChart01, { size: 32 }), title: 'No responses yet', description: study.status === 'draft' ? 'Publish the study and share the link: results appear here as people respond.' : 'Share the link or recruit participants from the panel.', actionLabel: study.status === 'draft' ? 'Open the builder' : 'Share the study', onAction: () => go(study.status === 'draft' ? `/study/${study.id}/build` : `/study/${study.id}/build?share=1`) });
  }

  const exportCsv = () => {
    const rows = [['participant', 'device', 'country', 'completed', 'seconds', 'score'], ...list.map((r) => [r.who, r.device, r.country, r.done, r.secs, r.score ?? ''])];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${study.name}.csv` });
    a.click(); URL.revokeObjectURL(url);
    toast({ message: `Exported ${plural(list.length, 'response')} to CSV`, status: 'success', duration: 3000 });
  };

  const columns = [
    { key: 'who', header: 'Participant', width: proportional(3), sortable: true, renderCell: (r) => h('span', { className: 'pb-who' }, h(Avatar, { name: r.who.replace('(you)', '').trim(), size: 'xsm', tooltip: false }), r.who) },
    { key: 'device', header: 'Device', width: pixel(104), sortable: true, renderCell: (r) => DEVICES[r.device] },
    { key: 'country', header: 'Country', width: proportional(2), sortable: true, renderCell: (r) => r.country },
    { key: 'secs', header: 'Time', width: pixel(88), align: 'end', sortable: true, renderCell: (r) => duration(r.secs) },
    { key: 'score', header: 'Score', width: pixel(80), align: 'end', sortable: true, renderCell: (r) => (r.score === null ? '–' : r.score) },
    { key: 'done', header: 'Status', width: pixel(120), renderCell: (r) => h(Badge, { variant: r.done ? 'success' : 'warning', size: 'sm', label: r.done ? 'Completed' : 'Left early' }) },
    { key: 'at', header: 'When', width: pixel(110), align: 'end', sortable: { sortKey: 'at' }, renderCell: (r) => ago(r.at) },
  ];

  const worst = [...questions.filter((b) => b.type === 'scale')].map((b) => ({ b, m: avg(list.map((r) => r.answers[b.id]).filter((v) => v !== undefined)) / b.max })).sort((a, b) => a.m - b.m)[0];
  const task = questions.find((b) => b.type === 'task');
  const taskVals = task ? list.map((r) => r.answers[task.id]).filter((v) => v?.clicks) : [];

  return h('div', { className: 'pb-stack pb-stack--lg' },
    h('div', { className: 'pb-toolbar' },
      h(SegmentedControl, { label: 'Device', size: 'md', value: device, onValueChange: setDevice, items: [{ value: 'all', label: 'All devices' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }] }),
      h('span', { className: 'pb-grow' }),
      h(Button, { variant: 'secondary', icon: h(I.Download01), onClick: exportCsv }, 'Export CSV')),
    h(Tabs, { value: tab, onValueChange: setTab },
      h(TabList, { label: 'Results', size: 'md' }, h(Tab, { value: 'overview', icon: h(I.PieChart01) }, 'Overview'), h(Tab, { value: 'questions', icon: h(I.Rows01), counter: questions.length }, 'Questions'), h(Tab, { value: 'responses', icon: h(I.Users01), counter: list.length }, 'Responses')),
      h(TabPanel, { value: 'overview' }, h('div', { className: 'pb-stack pb-stack--lg' },
        h(Grid, { columns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 },
          h(Metric, { label: 'Responses', value: String(list.length), note: `Goal ${study.goal}` }, h(ProgressBar, { value: Math.min(100, pct(total, study.goal)), size: 'sm', 'aria-label': 'Progress to goal' })),
          h(Metric, { label: 'Completion rate', value: `${pct(done.length, list.length)}%`, note: `${done.length} finished` }),
          h(Metric, { label: 'Avg. duration', value: duration(avg(done.map((r) => r.secs))) }),
          h(Metric, { label: 'Usability score', value: scores.length ? String(Math.round(avg(scores))) : '–', note: scores.length ? 'out of 100' : 'No scale questions' })),
        h(Card, { padding: 16 }, h('div', { className: 'pb-stack' },
          h('b', null, 'Where people drop off'),
          questions.map((b, i) => h(Bar, { key: b.id, label: `${i + 1}. ${b.title}`, value: list.filter((r) => answered(r, b)).length, total: list.length })))),
        h(Card, { padding: 16, variant: 'blue' }, h('div', { className: 'pb-stack' },
          h('div', { className: 'pb-row' }, h(I.Stars01, { size: 20 }), h('b', null, 'Highlights')),
          h('ul', { className: 'pb-list' },
            task && taskVals.length > 0 && h('li', null, `${pct(taskVals.filter((v) => v.success).length, taskVals.length)}% completed “${task.title}”, ${avg(taskVals.map((v) => v.misses)).toFixed(1)} misclicks on average.`),
            worst && h('li', null, `“${worst.b.title}” is the lowest rated question (${Math.round(worst.m * 100)}% of the maximum).`),
            h('li', null, `${pct(done.length, list.length)}% finished the study; the median takes ${duration(avg(done.map((r) => r.secs)))}.`)))))),
      h(TabPanel, { value: 'questions' }, h('div', { style: { marginTop: 8 } }, h(CollapsibleGroup, { multiple: true, defaultValue: [questions[0]?.id], items: questions.map((b, i) => {
        const Part = RESULT[b.type];
        return { value: b.id, title: h('span', { className: 'pb-row' }, h('span', { className: 'pb-muted' }, `${i + 1}.`), b.title, h(Badge, { variant: 'secondary', size: 'sm', label: blockLabel(b) })), content: h(Part, { block: b, list }) };
      }) }))),
      h(TabPanel, { value: 'responses' }, h('div', { style: { marginTop: 8 } }, h(Table, { data: list, columns, caption: 'Responses', density: 'balanced', hoverable: true, defaultSort: { key: 'at', direction: 'desc' }, onRowClick: setOpen, maxHeight: 520, stickyHeader: true })))),
    h(ResponseModal, { response: open, study, onClose: () => setOpen(null) }));
}

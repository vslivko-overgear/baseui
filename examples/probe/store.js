import { h, createContext, useContext, useMemo, useCallback } from '../../src/react.js';
import { useStored } from './util.js';
import { seedStudies, newBlock, makeResponses, uid, TEMPLATES, NOW } from './data.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const KEY = 'baseui-probe';
const initial = () => ({ studies: seedStudies(), extra: {}, invites: [], empty: false, prefs: { emailNew: true, emailDigest: true, slack: false, anonymize: true, language: 'en', timezone: 'utc' } });

/** The workspace: studies, the responses people leave while testing, invitations. It lives in localStorage of this browser. */
export function StoreProvider({ children }) {
  const [state, setState] = useStored(KEY, initial);
  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [setState]);
  const generated = useMemo(() => new Map(), []);

  const api = useMemo(() => ({
    studies: state.empty ? [] : state.studies,
    allStudies: state.studies,
    empty: state.empty,
    prefs: state.prefs,
    invites: state.invites,
    study: (id) => state.studies.find((s) => s.id === id),
    responsesOf: (study) => {
      const key = `${study.id}:${study.n}:${study.blocks.map((b) => b.id + (b.options ? b.options.length : '')).join('')}`;
      if (!generated.has(key)) generated.set(key, makeResponses(study));
      return [...(state.extra[study.id] || []), ...generated.get(key)];
    },
    countOf: (study) => study.n + (state.extra[study.id]?.length || 0),
    createBlank: () => {
      const s = { id: uid('s'), name: 'Untitled study', status: 'draft', owner: 'alex', created: Date.now(), n: 0, goal: 50, minutes: 3, tags: [], blocks: [newBlock('welcome'), newBlock('text'), newBlock('thanks')] };
      patch((st) => ({ studies: [s, ...st.studies], empty: false }));
      return s;
    },
    createFromTemplate: (tplId, name) => {
      const tpl = TEMPLATES.find((t) => t.id === tplId);
      const s = { id: uid('s'), name: name || tpl.name, status: 'draft', owner: 'alex', created: Date.now(), n: 0, goal: 50, minutes: tpl.minutes, tags: [tpl.category], blocks: tpl.blocks.map(newBlock) };
      patch((st) => ({ studies: [s, ...st.studies], empty: false }));
      return s;
    },
    update: (id, fn) => patch((st) => ({ studies: st.studies.map((s) => (s.id === id ? { ...s, ...(typeof fn === 'function' ? fn(s) : fn) } : s)) })),
    remove: (id) => patch((st) => ({ studies: st.studies.filter((s) => s.id !== id) })),
    restore: (study) => patch((st) => ({ studies: [study, ...st.studies] })),
    duplicate: (id) => {
      const src = state.studies.find((s) => s.id === id);
      const copy = { ...src, id: uid('s'), name: `${src.name} (copy)`, status: 'draft', n: 0, created: Date.now(), blocks: src.blocks.map((b) => ({ ...b, options: b.options && b.options.map((o) => ({ ...o })) })) };
      patch((st) => ({ studies: [copy, ...st.studies] }));
      return copy;
    },
    addResponse: (id, response) => patch((st) => ({ extra: { ...st.extra, [id]: [response, ...(st.extra[id] || [])] } })),
    invite: (ids, studyId) => patch((st) => ({ invites: [...st.invites.filter((i) => !(ids.includes(i.person) && i.study === studyId)), ...ids.map((person) => ({ person, study: studyId, at: Date.now() }))] })),
    setEmpty: (empty) => patch(() => ({ empty })),
    setPrefs: (p) => patch((st) => ({ prefs: { ...st.prefs, ...p } })),
    reset: () => setState(initial()),
  }), [state, patch, generated, setState]);

  return h(Ctx.Provider, { value: api }, children);
}
export { NOW };

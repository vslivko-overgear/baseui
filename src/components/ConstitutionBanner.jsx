import { cx, useEffect, useId, useState } from '../react.js';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { describe } from '../doc.js';
import { dontBody, RULES } from '../constitution/rules.js';
import { auditConstitution } from '../constitution/audit.js';

export const CONSTITUTION_URL = 'https://baseuikit.vercel.app/#/foundations/constitution';

const normalize = (violations) => violations.map((v) => (typeof v === 'string' ? { id: v } : v));

/** The audit of the rendered page, repeated when the page changes (debounced). */
function useAudit(enabled) {
  const [found, setFound] = useState([]);
  useEffect(() => {
    if (!enabled) return undefined;
    let timer;
    const run = () => setFound(auditConstitution().map(({ id, note }) => ({ id, note })));
    const schedule = () => { clearTimeout(timer); timer = setTimeout(run, 400); };
    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    window.addEventListener('resize', schedule);
    return () => { clearTimeout(timer); observer.disconnect(); window.removeEventListener('resize', schedule); };
  }, [enabled]);
  return found;
}

/**
 * A strip across the top of a prototype that warns it breaks the design constitution. It lists the broken rules by id
 * and title, and opens to show what each rule asks for and what was done instead. It cannot be closed: it stays while a rule is broken.
 */
export function ConstitutionBanner({ violations = [], audit = false, href = CONSTITUTION_URL, defaultOpen = false, sticky = true, rules = RULES, className, ...rest }) {
  const [open, setOpen] = useState(defaultOpen);
  const listId = useId();
  const audited = useAudit(audit);
  const merged = new Map();
  // what the author declared comes first; the audit adds what it finds beyond that
  for (const v of [...normalize(violations), ...audited]) if (!merged.has(v.id)) merged.set(v.id, v);
  const byId = new Map(rules.map((r) => [r.id, r]));
  const items = [...merged.values()].map((v) => {
    const found = byId.get(v.id);
    if (!found) throw new Error(`Unknown constitution rule "${v.id}"`);
    return { ...v, rule: found };
  }).sort((a, b) => a.rule.id.localeCompare(b.rule.id, 'en', { numeric: true }));
  if (!items.length) return null;
  const musts = items.filter((i) => i.rule.level === 'must').length;
  return (
    <section
      aria-label="Design constitution warning"
      data-slot="constitution-banner"
      data-constitution-banner=""
      data-sticky={sticky || undefined}
      className={cx('bui-constitution', className)}
      {...rest}
    >
      <div data-slot="constitution-bar" className="bui-constitution__bar">
        <BuiltinIcon name="warning" size={24} className="bui-constitution__icon" />
        <p className="bui-constitution__summary">
          <strong>{items.length === 1 ? '1 rule of the design constitution is broken' : `${items.length} rules of the design constitution are broken`}</strong>
          <span className="bui-constitution__ids">
            {' '}
            {items.map((i) => i.rule.id).join(' · ')}
            {musts < items.length ? ` (${musts} must)` : ''}
          </span>
        </p>
        <a className="bui-constitution__link" href={href} target="_blank" rel="noreferrer">
          Read the constitution
        </a>
        <button type="button" className="bui-constitution__toggle" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
          {open ? 'Hide details' : 'Details'}
        </button>
      </div>
      {open && (
        <ul id={listId} data-slot="constitution-list" className="bui-constitution__list">
          {items.map(({ id, note, rule: r }) => (
            <li key={id} data-slot="constitution-item" data-level={r.level}>
              <strong>
                {r.id} · {r.title}
              </strong>
              <span className="bui-constitution__level">{r.level === 'must' ? 'must' : 'should'}</span>
              {note && <span className="bui-constitution__note">{note}</span>}
              <span className="bui-constitution__rule">
                <b>Do:</b> {r.do}
              </span>
              <span className="bui-constitution__rule">
                <b>Don&apos;t:</b> {dontBody(r)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
describe(
  ConstitutionBanner,
  'A strip across the top of a prototype that warns it breaks the design constitution: which rules, where, and what each one asks for. It is not dismissible',
  {
    violations: ["Array<string | { id: string; note?: string }>", '[]', 'The broken rules by id (`H2`), each with an optional note on where it is broken. With none (and no audit) nothing renders'],
    audit: ['boolean', 'false', 'Also run auditConstitution() on the page and add what it finds; repeats when the page changes'],
    rules: ["Array<{ id: string; title: string; level: 'must' | 'should'; do: string; dont: string }>", 'baseui rules', 'Definitions used to resolve violations; a product supplies its shared and local rules together'],
    href: ['string', 'the Constitution page', 'Where "Read the constitution" leads'],
    defaultOpen: ['boolean', 'false', 'Show the details of every rule at first'],
    sticky: ['boolean', 'true', 'Stay at the top of the screen while the page scrolls'],
    className: ['string', null, 'Extra class'],
  },
);

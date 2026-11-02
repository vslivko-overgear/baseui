// Pages of the Templates and Themes sections of the documentation site: the gallery of templates, one template, one theme.
// A template is shown in an iframe (templates/frame/), so its media queries answer to the width of the frame, not of this page.
import { React } from '../src/react.js';
import { Button } from '../src/components/Button.jsx';
import { Token } from '../src/components/Token.jsx';
import { TokenGroup } from '../src/components/TokenGroup.jsx';
import { BuiltinIcon } from '../src/builtin-icons.jsx';
import { TEMPLATES, TEMPLATES_BY_ID, TEMPLATE_CATEGORIES } from '../src/templates/registry.js';

const { useState, useEffect, useRef, createContext, useContext } = React;

export const AppContext = createContext({ theme: 'light', viewport: 'desktop', setTheme: () => {} });

const frameSrc = (id, theme) => `templates/frame/?t=${id}&theme=${theme}`;

// names of the components in the registry -> the titles of their pages
const PAGE_TITLE = { Dialog: 'Dialog', Selector: 'Selector', Typeahead: 'Typeahead', TextInput: 'Text Input', Token: 'Token', TokenGroup: 'Token Group', RadioGroup: 'Radio', CheckboxGroup: 'Checkbox', CollapsibleGroup: 'Collapsible', Status: 'Status', ClickableCard: 'Clickable Card', Dropdown: 'Dropdown' };
const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** A live frame whose height follows its content. */
function Frame({ id, theme, title, width = '100%', minHeight = 480 }) {
  const [height, setHeight] = useState(minHeight);
  const ref = useRef(null);
  useEffect(() => {
    const on = (e) => {
      if (e.data && e.data.type === 'baseui-frame-height' && e.data.id === id && e.source === ref.current?.contentWindow) setHeight(Math.max(minHeight, e.data.height));
    };
    window.addEventListener('message', on);
    return () => window.removeEventListener('message', on);
  }, [id, minHeight]);
  return <iframe ref={ref} className="tpl-frame" title={title} src={frameSrc(id, theme)} style={{ width, height }} />;
}

/** A small, lazy, non-interactive preview of a template at a desktop width. */
function Thumb({ id, theme, title }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.24);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1280));
    ro.observe(el);
    setScale(el.clientWidth / 1280);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="tpl-thumb" ref={box}>
      <iframe title={`Preview of ${title}`} src={frameSrc(id, theme)} loading="lazy" tabIndex={-1} aria-hidden="true" style={{ transform: `scale(${scale})` }} />
    </div>
  );
}

export function TemplatesGallery({ routeOf, find }) {
  const { theme } = useContext(AppContext);
  const [category, setCategory] = useState('All');
  const shown = TEMPLATES.filter((t) => category === 'All' || t.category === category);
  return (
    <>
      <section className="section" id="templates" data-anchor="Templates">
        <h2>Templates</h2>
        <p className="doc-p">Ready pages built from the components of the system, with mock data. Each one is a starting point: open it, look at the components it uses and copy what you need</p>
        <TokenGroup
          size="sm"
          title="Category"
          value={[category]}
          onValueChange={(v) => v.length && setCategory(v[v.length - 1])}
          options={['All', ...TEMPLATE_CATEGORIES].map((c) => ({ value: c, label: c === 'All' ? `All ${TEMPLATES.length}` : c }))}
        />
        <div className="tpl-grid">
          {shown.map((t) => {
            const page = find(t.id);
            return (
              <a className="tpl-card" key={t.id} href={page ? routeOf(page) : '#/'}>
                <Thumb id={t.id} theme={theme} title={t.title} />
                <span className="tpl-card__meta">
                  <span className="tpl-card__title">{t.title}</span>
                  <span className="tpl-card__cat">{t.category}</span>
                </span>
                <span className="tpl-card__text">{t.description}</span>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}

export function TemplatePage({ entry, routeOf, pages }) {
  const { theme, viewport } = useContext(AppContext);
  const t = TEMPLATES_BY_ID[entry.template];
  const link = (name) => {
    const title = PAGE_TITLE[name] || name;
    const page = pages.find((p) => p.section === 'Components' && (p.title === title || kebab(p.title) === kebab(title)));
    return page ? (
      <a key={name} className="tpl-use" href={routeOf(page)}>
        {name}
      </a>
    ) : (
      <span key={name} className="tpl-use">
        {name}
      </span>
    );
  };
  const mobile = viewport === 'mobile';
  return (
    <article className="page page--template">
      <div className="eyebrow">{`Templates · ${t.category}`}</div>
      <h1>{t.title}</h1>
      <p className="prose lead">{t.description}</p>
      <section className="section" id="preview" data-anchor="Preview">
        <div className="tpl-toolbar">
          <span className="tpl-toolbar__hint">{mobile ? 'Mobile width, 390px' : 'Desktop width'}</span>
          <Button variant="secondary" size="sm" href={frameSrc(t.id, theme)} icon={<BuiltinIcon name="chevronRight" size={20} />}>
            Open in a new tab
          </Button>
        </div>
        <div className={`tpl-stage${mobile ? ' tpl-stage--mobile' : ''}`}>
          <Frame id={t.id} theme={theme} title={`${t.title} template`} width={mobile ? 390 : '100%'} />
        </div>
      </section>
      <section className="section" id="components" data-anchor="Components">
        <h2>Components</h2>
        <p className="doc-p">What this template is made of</p>
        <div className="tpl-uses">{t.uses.map(link)}</div>
      </section>
      <section className="section" id="source" data-anchor="Source">
        <h2>Source</h2>
        <p className="doc-p">
          <code>{`src/templates/${t.category.toLowerCase().replace(/[^a-z]+/g, '-')}.jsx`}</code>
          {', or install it with the shadcn CLI: '}
          <code>{`npx shadcn@latest add https://baseuikit.vercel.app/r/template-${t.id}.json`}</code>
        </p>
      </section>
    </article>
  );
}

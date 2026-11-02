import { USAGE } from './usage.js';

// Documentation of the components: the description, the props table and the usage (do and don't) of each page.
// props: { name: ['type', 'default' | null, 'description'] }

const docProps = (props) => Object.fromEntries(Object.entries(props).map(([name, [type, def, text]]) => [name, {
  required: false,
  tsType: { name: type, raw: type },
  ...(def != null && { defaultValue: { value: def, computed: false } }),
  description: text,
}]));

/** Attaches a description, its props and its usage guidance (src/usage.js, by the name of the component) to a component. */
export function describe(component, description, props) {
  const usage = USAGE[component.displayName || component.name];
  component.__docgenInfo = { description, props: docProps(props), ...(usage && { usage }) };
  return component;
}

/** Documents a component of the system that wraps a compiled one: the props of the compiled one, plus (or replaced by) its own. */
export function describeWrapper(component, base, props, description) {
  const doc = base.__docgenInfo || { description: '', props: {} };
  const usage = USAGE[component.displayName || component.name] || doc.usage;
  component.__docgenInfo = { ...doc, description: description ?? doc.description, props: { ...doc.props, ...docProps(props) }, ...(usage && { usage }) };
  return component;
}

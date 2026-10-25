// Documentation of the components: the description and the props table of each page.
// props: { name: ['type', 'default' | null, 'description'] }

const docProps = (props) => Object.fromEntries(Object.entries(props).map(([name, [type, def, text]]) => [name, {
  required: false,
  tsType: { name: type, raw: type },
  ...(def != null && { defaultValue: { value: def, computed: false } }),
  description: text,
}]));

/** Attaches a description and its props to a component. */
export function describe(component, description, props) {
  component.__docgenInfo = { description, props: docProps(props) };
  return component;
}

/** Documents a component of the system that wraps a compiled one: the props of the compiled one, plus (or replaced by) its own. */
export function describeWrapper(component, base, props, description) {
  const doc = base.__docgenInfo || { description: '', props: {} };
  component.__docgenInfo = { ...doc, description: description ?? doc.description, props: { ...doc.props, ...docProps(props) } };
  return component;
}

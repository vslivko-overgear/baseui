// Every Settings control must have a row in the Props table: those without one get it from the control itself.
export function documentControls(meta) {
  const c = meta?.component;
  if (!c?.__docgenInfo) return;
  const props = c.__docgenInfo.props || (c.__docgenInfo.props = {});
  for (const [name, spec] of Object.entries(meta.argTypes || {})) {
    if (!spec.control || props[name]) continue;
    const type = typeof spec.control === 'string' ? spec.control : spec.control.type;
    const tsType = spec.options ? spec.options.map((o) => (typeof o === 'number' ? o : `'${o}'`)).join(' | ') : type === 'text' ? 'string' : type === 'range' ? 'number' : type;
    const def = meta.args?.[name];
    props[name] = { required: false, tsType: { name: tsType, raw: tsType }, ...(def !== undefined && typeof def !== 'object' && { defaultValue: { value: typeof def === 'string' ? `'${def}'` : String(def), computed: false } }), description: spec.description || '' };
  }
}

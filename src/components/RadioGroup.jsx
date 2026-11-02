import { cx, useId } from '../react.js';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Radio } from './Radio.jsx';
import { SIZE_DOC, MOTION_DOC } from './Checkbox.jsx';
import { describe } from '../doc.js';

/** A group of radio buttons on top of the Base UI RadioGroup: the value is the `value` of the selected option. */
export function RadioGroup({ title, options, caption, error, size = 'md', motion, className, ref, value, defaultValue, onValueChange, ...rest }) {
  const titleId = useId();
  return (
    <div className={cx('bui-radio-group__field', size === 'sm' && 'bui-check--sm', className)}>
      {title && (
        <div id={titleId} className="bui-radio-group__title">
          {title}
        </div>
      )}
      <BaseRadioGroup
        ref={ref}
        data-size={size}
        data-motion={motion}
        className="bui-radio-group__list"
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => onValueChange?.(v)}
        aria-labelledby={title ? titleId : undefined}
        {...rest}
      >
        {options.map((o) => (
          <Radio key={o.value} value={o.value} label={o.label} disabled={o.disabled} size={size} motion={motion} />
        ))}
      </BaseRadioGroup>
      {error ? (
        <span className="bui-radio-group__error" data-test="inputError">
          {error}
        </span>
      ) : (
        caption && <span className="bui-radio-group__caption">{caption}</span>
      )}
    </div>
  );
}
describe(
  RadioGroup,
  'A group of radio buttons: the value is the `value` of the selected option. The error is a message under the group; the circles do not turn red',
  {
    title: ['ReactNode', null, 'Group title'],
    options: ['Array<{ value: string; label: ReactNode; disabled?: boolean }>', null, 'The radio buttons of the group'],
    value: ['string | null', null, 'Selected value (controlled); null means nothing is selected'],
    defaultValue: ['string', null, 'Initial value (uncontrolled)'],
    onValueChange: ['(value: string) => void', null, 'Called with the value of the selected option'],
    caption: ['ReactNode', null, 'Caption under the group'],
    error: ['ReactNode', null, 'Error text under the group (replaces the caption). The circles do not turn red: only the message'],
    size: ["'sm' | 'md'", "'md'", SIZE_DOC],
    motion: ["'off' | 'basic' | 'enhanced'", 'theme', MOTION_DOC],
    disabled: ['boolean', 'false', 'Disables every radio of the group'],
    className: ['string', null, 'Extra class on the wrapper (merged)'],
    ref: ['Ref<HTMLDivElement>', null, 'Ref to the group (`<div role="radiogroup">`)'],
  },
);

// Behaviour of the main components: what a user does and what the component reports.
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { Breadcrumbs, Badge, Button, useFieldErrors, ChoiceSheet, Hint, Typeahead, Card, ProductCard, Stack, ButtonGroup, Form, FormRow, FormSection, IconButton, ControlRow, Checkbox, Dialog, OtpInput, Pagination, ProgressBar, Slider, Rating, Selector, Dropdown, Switch, Tabs, TextInput } from '../src/index.jsx';

describe('Switch', () => {
  test('toggles and reports', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });
  test('disabled does not toggle', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Off" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
  test('controlled state follows checked', () => {
    const { rerender } = render(<Switch aria-label="x" checked={false} onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch aria-label="x" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
  test('size and shape are data attributes', () => {
    render(<Switch aria-label="x" size="lg" shape="circle" />);
    const sw = screen.getByRole('switch');
    expect(sw.closest('[data-size]')).toHaveAttribute('data-size', 'lg');
  });
});

describe('Checkbox', () => {
  test('checks by the label', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText('Accept'));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Button', () => {
  test('click calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button label="Save" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test('loading blocks the click', async () => {
    const onClick = vi.fn();
    render(<Button label="Save" loading onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
  test('clickAction shows loading until it settles', async () => {
    let done;
    render(<Button label="Go" clickAction={() => new Promise((r) => { done = r; })} />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-loading'));
    done();
    await waitFor(() => expect(screen.getByRole('button')).not.toHaveAttribute('data-loading'));
  });
  test('href renders a link', () => {
    render(<Button label="Docs" href="/docs" />);
    expect(screen.getByText('Docs').closest('a')).toHaveAttribute('href', '/docs');
  });
});

describe('Tabs', () => {
  const tabs = (props) => (
    <Tabs label="Demo" defaultValue="a" items={[{ value: 'a', label: 'First', content: 'First panel' }, { value: 'b', label: 'Second', content: 'Second panel' }]} {...props} />
  );
  test('selecting a tab shows its panel', async () => {
    render(tabs());
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Second panel')).toBeVisible();
  });
  test('onValueChange reports the tab', async () => {
    const onValueChange = vi.fn();
    render(tabs({ onValueChange }));
    await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
  test('the panel is labelled by the selected tab, and children fill it for tabs without content', async () => {
    render(<Tabs label="Demo" items={[{ value: 'a', label: 'First' }, { value: 'b', label: 'Second' }]}>{(v) => `panel of ${v}`}</Tabs>);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('panel of a');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', screen.getByRole('tab', { name: 'First' }).id);
    await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('panel of b');
  });
  test('tabs without a panel render no tabpanel', () => {
    render(<Tabs label="Nav" items={[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }]} />);
    expect(screen.queryByRole('tabpanel')).toBeNull();
    expect(screen.getByRole('tab', { name: 'One' })).not.toHaveAttribute('aria-controls');
  });
  test('arrow keys move between tabs', async () => {
    render(tabs());
    screen.getByRole('tab', { name: 'First' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
  });
});

describe('Dialog', () => {
  test('opens, shows content, closes on Escape', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog open title="Rename" onOpenChange={onOpenChange}>Body text</Dialog>);
    expect(await screen.findByRole('dialog', { name: /Rename/ })).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
  test('the close button asks to close', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog open title="T" onOpenChange={onOpenChange}>x</Dialog>);
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
  test('actions are rendered', async () => {
    render(<Dialog open title="T" primaryAction={<Button label="Confirm" variant="primary" />} secondaryAction={<Button label="Cancel" />}>x</Dialog>);
    expect(await screen.findByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});

describe('Selector', () => {
  const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
  test('picks an option', async () => {
    const onValueChange = vi.fn();
    render(<Selector label="Letter" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
  test('shows the chosen label', () => {
    render(<Selector label="Letter" options={options} defaultValue="a" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Alpha');
  });
  test('disabled does not open', async () => {
    render(<Selector label="Letter" options={options} disabled />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('option')).toBeNull();
  });
});

describe('TextInput', () => {
  test('types and reports the value', async () => {
    const onChange = vi.fn();
    render(<TextInput label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Name'), 'Ann');
    expect(screen.getByLabelText('Name')).toHaveValue('Ann');
    expect(onChange).toHaveBeenCalled();
  });
  test('status error marks the input invalid and shows the caption', () => {
    render(<TextInput label="Email" status="error" caption="Wrong address" />);
    expect(screen.getByLabelText('Email')).toBeInvalid();
    expect(screen.getByText('Wrong address')).toBeInTheDocument();
  });
});

describe('OtpInput', () => {
  test('fills cells and completes', async () => {
    const onComplete = vi.fn();
    render(<OtpInput length={4} label="Code" onComplete={onComplete} />);
    const first = screen.getAllByRole('textbox')[0];
    first.focus();
    await userEvent.keyboard('1234');
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith('1234'));
  });
  test('rejects letters in numeric mode', async () => {
    const onValueChange = vi.fn();
    render(<OtpInput length={4} label="Code" onValueChange={onValueChange} />);
    screen.getAllByRole('textbox')[0].focus();
    await userEvent.keyboard('ab');
    expect(onValueChange).not.toHaveBeenCalledWith('a');
  });
});

describe('Pagination', () => {
  test('next page', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} total={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: /3/ }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});

describe('Rating', () => {
  test('choosing a star reports its number', async () => {
    const onValueChange = vi.fn();
    render(<Rating label="Rate" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Rate' })).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button')[3]);
    expect(onValueChange).toHaveBeenCalledWith(4);
  });
});

describe('Breadcrumbs', () => {
  const items = [{ label: 'Home', href: '/' }, { label: 'Catalog', href: '/c' }, { label: 'Item' }];
  test('marks the last item as the current page', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Item')).toHaveAttribute('aria-current', 'page');
  });
  test('showCurrent=false ends the trail at the parent, which stays a link', () => {
    render(<Breadcrumbs items={items} showCurrent={false} />);
    expect(screen.queryByText('Item')).toBeNull();
    expect(screen.getByText('Catalog').closest('a')).toHaveAttribute('href', '/c');
    expect(document.querySelector('[aria-current]')).toBeNull();
  });
});

describe('Slider range', () => {
  test('two thumbs with names; keyboard moves one bound', async () => {
    const onValueChange = vi.fn();
    render(<Slider range label="Price" defaultValue={[20, 60]} step={5} onValueChange={onValueChange} showValue />);
    const [lo, hi] = screen.getAllByRole('slider');
    expect(lo).toHaveAccessibleName('Minimum');
    expect(hi).toHaveAccessibleName('Maximum');
    expect(screen.getByText('20 – 60')).toBeInTheDocument();
    lo.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange.mock.calls.at(-1)[0]).toEqual([25, 60]);
  });
  test('the thumbs cannot cross', async () => {
    const onValueChange = vi.fn();
    render(<Slider range defaultValue={[50, 55]} step={5} onValueChange={onValueChange} />);
    const [lo] = screen.getAllByRole('slider');
    lo.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    const last = onValueChange.mock.calls.at(-1)[0];
    expect(last[0]).toBeLessThanOrEqual(last[1]);
  });
});

describe('ProgressBar', () => {
  test('sections: the value fills them one after another', () => {
    const { container } = render(<ProgressBar value={50} sections={4} label="Steps" />);
    const fills = [...container.querySelectorAll('.bui-progress__fill')].map((f) => f.style.width);
    expect(fills).toEqual(['100%', '100%', '0%', '0%']);
  });
  test('a part of a section is a part of its fill', () => {
    const { container } = render(<ProgressBar value={30} sections={4} />);
    expect([...container.querySelectorAll('.bui-progress__fill')].map((f) => f.style.width)).toEqual(['100%', '20%', '0%', '0%']);
  });
  test('sections are limited to 8', () => {
    const { container } = render(<ProgressBar value={10} sections={20} />);
    expect(container.querySelectorAll('.bui-progress__section')).toHaveLength(8);
  });
  test('color is a data attribute; the bar stays one progressbar', () => {
    render(<ProgressBar value={40} color="success" sections={2} label="Upload" />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('aria-valuenow', '40');
    expect(document.querySelector('.bui-progress')).toHaveAttribute('data-color', 'success');
  });
});

describe('TextInput type="search"', () => {
  test('is a placeholder-style field with the search icon and a clear button', async () => {
    const { TextInput: TextInput } = await import('../src/components/TextInput.jsx');
    const { container } = render(<TextInput type="search" defaultValue="abc" />);
    const field = container.querySelector('[data-slot="textinput"]');
    expect(field.getAttribute('data-float')).not.toBe('floating');
    expect(container.querySelector('[data-slot="textinput-label"]').textContent).toBe('Search');
    expect(container.querySelector('[aria-label="Clear search"]')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

describe('Button text size', () => {
  test('is its own choice inside the size, and falls back to the default of the size', () => {
    const text = (props) => render(<Button label="x" {...props} />).container.querySelector('button').getAttribute('data-text');
    expect(text({ size: 'xsm' })).toBe('12');
    expect(text({ size: 'xsm', textSize: 20 })).toBe('12');
    expect(text({ size: 'sm' })).toBe('14');
    expect(text({ size: 'sm', textSize: 12 })).toBe('12');
    expect(text({ size: 'md' })).toBe('16');
    expect(text({ size: 'md', textSize: 14 })).toBe('14');
    expect(text({ size: 'lg', textSize: 20 })).toBe('20');
  });
});

describe('ControlRow', () => {
  test('gives its controls one tier', () => {
    const { container } = render(
      <ControlRow size="md">
        <TextInput label="Promo code" />
        <Button label="Apply" />
        <IconButton label="Sort" icon={<span />} />
      </ControlRow>,
    );
    expect(container.querySelector('[data-slot="control-row"]')).toHaveAttribute('data-control-row', 'md');
    expect(container.querySelector('.bui-field')).toHaveAttribute('data-size', 'sm');   // the 48px field is the md tier
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveAttribute('data-size', 'md');
    expect(screen.getByRole('button', { name: 'Sort' })).toHaveAttribute('data-size', 'md');
  });
  test('a lg row takes the 56px field, and a size of the control itself wins', () => {
    const { container } = render(
      <ControlRow size="lg">
        <TextInput label="Email" />
        <Button label="Go" size="sm" />
      </ControlRow>,
    );
    expect(container.querySelector('.bui-field')).toHaveAttribute('data-size', 'md');
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('data-size', 'sm');
  });
  test('outside a row the defaults are as before', () => {
    render(<Button label="Alone" />);
    expect(screen.getByRole('button', { name: 'Alone' })).toHaveAttribute('data-size', 'md');
  });
});

describe('ButtonGroup', () => {
  test('is a labelled group, horizontal by default', () => {
    render(<ButtonGroup label="Actions"><Button label="One" /><Button label="Two" /></ButtonGroup>);
    const group = screen.getByRole('group', { name: 'Actions' });
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
    expect(group).not.toHaveAttribute('data-stack');
    expect(group.children).toHaveLength(2);
  });
  test('vertical and stack on mobile are data attributes the CSS reads', () => {
    render(<ButtonGroup orientation="vertical" data-testid="v"><Button label="One" /></ButtonGroup>);
    expect(screen.getByTestId('v')).toHaveAttribute('data-orientation', 'vertical');
    render(<ButtonGroup stackOnMobile data-testid="m"><Button label="One" /></ButtonGroup>);
    expect(screen.getByTestId('m')).toHaveAttribute('data-stack', 'mobile');
  });
  test('justify applies to a row only, and a size is given to the buttons', () => {
    render(<ButtonGroup justify="end" size="sm" data-testid="h"><Button label="One" /></ButtonGroup>);
    expect(screen.getByTestId('h').style.justifyContent).toBe('flex-end');
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('data-size', 'sm');
    render(<ButtonGroup orientation="vertical" justify="end" data-testid="v2"><Button label="Two" /></ButtonGroup>);
    expect(screen.getByTestId('v2').style.justifyContent).toBe('');
  });
});

describe('Form', () => {
  test('is a form with one gap variable, and a row takes its columns from the fields or a ratio', () => {
    render(<Form data-testid="f"><FormRow data-testid="r"><input aria-label="a" /><input aria-label="b" /></FormRow><FormRow columns={[2, 1]} data-testid="q"><input aria-label="c" /><input aria-label="d" /></FormRow></Form>);
    expect(screen.getByTestId('f').tagName).toBe('FORM');
    expect(screen.getByTestId('r').style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    expect(screen.getByTestId('q').style.gridTemplateColumns).toBe('minmax(0, 2fr) minmax(0, 1fr)');
  });
  test('a section has a heading and holds the fields; stack never is a data attribute', () => {
    render(<Form as="div"><FormSection title="Payment"><FormRow stack="never" data-testid="n"><input aria-label="x" /></FormRow></FormSection></Form>);
    expect(screen.getByRole('heading', { name: 'Payment' })).toBeInTheDocument();
    expect(screen.getByTestId('n')).toHaveAttribute('data-stack', 'never');
  });
});

describe('Dialog: data-dialog-close', () => {
  test('a control marked data-dialog-close closes its own dialog and not the one around it', async () => {
    const outer = vi.fn(); const inner = vi.fn();
    render(
      <Dialog open title="Outer" onOpenChange={outer}>
        <Dialog open title="Inner" onOpenChange={inner} primaryAction={<Button label="Done" data-dialog-close />} />
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(inner).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'close-press' }));
    expect(outer).not.toHaveBeenCalled();
  });
});
describe('Selector on a phone', () => {
  test('a single choice closes the sheet by itself; a multiple one waits for Apply', async () => {
    const original = window.matchMedia;
    window.matchMedia = (q) => ({ matches: q.includes('767'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    const opts = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
    const { unmount } = render(<Selector label="Pick" options={opts} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: 'Beta' }));
    await waitFor(() => expect(screen.queryByRole('option', { name: 'Beta' })).toBeNull());
    unmount();
    render(<Selector label="Pick" multiple options={opts} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: 'Alpha' }));
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(screen.queryByRole('option', { name: 'Alpha' })).toBeNull());
    window.matchMedia = original;
  });
});

describe('Dropdown (rule M4: a list of options is a sheet on a phone)', () => {
  const opts = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
  const phone = () => {
    const original = window.matchMedia;
    window.matchMedia = (q) => ({ matches: q.includes('767'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    return () => { window.matchMedia = original; };
  };

  test('on a desktop it is a menu over the page, not a dialog', async () => {
    render(<Dropdown label="Sort" options={opts} trigger={<Button label="Open" />} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('listbox', { name: 'Sort' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('on a phone it is a bottom sheet (a dialog) with the same options, and a single choice closes it', async () => {
    const restore = phone();
    const onValueChange = vi.fn();
    render(<Dropdown label="Sort" options={opts} onValueChange={onValueChange} trigger={<Button label="Open" />} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(document.querySelector('.bui-dropdown')).toBeNull();
    await userEvent.click(await screen.findByRole('option', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    restore();
  });

  test('a multiple choice waits for Apply on a phone', async () => {
    const restore = phone();
    const onValueChange = vi.fn();
    render(<Dropdown label="Sort" multiple options={opts} onValueChange={onValueChange} trigger={<Button label="Open" />} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Alpha' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
    restore();
  });

  test('sheet={false} keeps the menu on a phone', async () => {
    const restore = phone();
    render(<Dropdown label="Sort" sheet={false} options={opts} trigger={<Button label="Open" />} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('listbox', { name: 'Sort' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
    restore();
  });
});

describe('Card padding and Stack relation', () => {
  test('padding="list" gives the vertical 16 and the side 4 of a list card, and sets the nested padding', () => {
    const { container } = render(<Card padding="list">x</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card.style.padding).toBe('var(--bui-spacing-4) var(--bui-spacing-1)');
    expect(card.style.getPropertyValue('--bui-card-pad')).toBe('var(--bui-spacing-1)');
  });
  test('a numeric padding is the nested padding too', () => {
    const { container } = render(<Card padding={3}>x</Card>);
    expect(container.querySelector('[data-slot="card"]').style.getPropertyValue('--bui-card-pad')).toBe('var(--bui-spacing-3)');
  });
  test('Stack relation="pair" has no gap', () => {
    const { container } = render(<Stack relation="pair"><span>a</span><span>b</span></Stack>);
    expect(container.firstChild.style.gap).toBe('var(--bui-rel-pair)');
  });
});

describe('ProductCard points', () => {
  test('the points are lines under the title, each with a check', () => {
    const { container } = render(<ProductCard title="Gift" price="$5" points={['Fast', 'Safe']} />);
    const points = [...container.querySelectorAll('.bui-product-card__point')];
    expect(points.map((p) => p.textContent)).toEqual(['Fast', 'Safe']);
    for (const point of points) expect(point.querySelector('svg')).not.toBeNull();
    const body = container.querySelector('.bui-product-card__body').children;
    expect([...body].findIndex((c) => c.className.includes('__points'))).toBe([...body].findIndex((c) => c.className.includes('__title')) + 1);
  });
  test('without points there is no list', () => {
    const { container } = render(<ProductCard title="Gift" price="$5" />);
    expect(container.querySelector('.bui-product-card__points')).toBeNull();
  });
});

describe('ChoiceSheet option pictures', () => {
  test('an option shows its icon or its avatar before the label', () => {
    render(<ChoiceSheet open title="Language" onOpenChange={() => {}} options={[{ value: 'a', label: 'Alpha', icon: <svg data-testid="i" /> }, { value: 'b', label: 'Beta', avatar: 'flag.svg' }, { value: 'c', label: 'Gamma' }]} />);
    const options = screen.getAllByRole('option');
    expect(options[0].querySelector('[data-slot="choice-icon"] [data-testid="i"]')).not.toBeNull();
    expect(options[1].querySelector('img[data-slot="choice-avatar"]')?.getAttribute('src')).toBe('flag.svg');
    expect(options[2].querySelector('[data-slot="choice-icon"], [data-slot="choice-avatar"]')).toBeNull();
  });
});

describe('Dialog actions', () => {
  test('the buttons of the actions are large unless one says otherwise', () => {
    render(<Dialog open title="T" onOpenChange={() => {}} primaryAction={<Button variant="primary">Yes</Button>} secondaryAction={<Button size="sm">No</Button>} />);
    expect(screen.getByRole('button', { name: 'Yes' }).getAttribute('data-size')).toBe('lg');
    expect(screen.getByRole('button', { name: 'No' }).getAttribute('data-size')).toBe('sm');
  });
});

describe('TextInput clear button by default', () => {
  const has = (ui) => render(ui).container.querySelector('.bui-input__clear-btn') !== null;
  test('a text field has it', () => { expect(has(<TextInput label="Name" defaultValue="a" />)).toBe(true); });
  test('not with another action at the end, with several lines, read-only or with clearable off', () => {
    expect(has(<TextInput label="Name" defaultValue="a" action={<button type="button">x</button>} />)).toBe(false);
    expect(has(<TextInput label="Name" type="password" defaultValue="a" />)).toBe(false);
    expect(has(<TextInput label="Name" multiline defaultValue="a" />)).toBe(false);
    expect(has(<TextInput label="Name" readOnly defaultValue="a" />)).toBe(false);
    expect(has(<TextInput label="Name" defaultValue="a" clearable={false} />)).toBe(false);
  });
  test('it is named for a screen reader', () => {
    render(<TextInput label="Name" defaultValue="a" />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });
});

// What tools/check/dialog-focus.mjs, hint.mjs and sheets.mjs used to check in a browser: the components decide it themselves, so it is tested here.
const media = (match) => {
  const original = window.matchMedia;
  window.matchMedia = (q) => ({ matches: match(q), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  return () => { window.matchMedia = original; };
};

describe('Dialog focus (rule A5): the ring is for the keyboard', () => {
  function Opener() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>Open</button>
        <Dialog open={open} onOpenChange={setOpen} title="Cart" primaryAction={<Button variant="primary">Pay</Button>}><p>Lines</p></Dialog>
      </>
    );
  }
  const onControlInside = () => { const d = document.querySelector('[role="dialog"]'); const a = document.activeElement; return !!d && d.contains(a) && a !== d && a.matches('button, input, a, [tabindex]:not([tabindex="-1"])'); };

  test('opened with a finger or a mouse, the focus is not put on a control of the dialog', async () => {
    render(<Opener />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await waitFor(() => expect(onControlInside()).toBe(false));
  });
  test('opened with the keyboard, the focus goes into the dialog', async () => {
    render(<Opener />);
    screen.getByRole('button', { name: 'Open' }).focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog');
    await waitFor(() => expect(onControlInside()).toBe(true));
  });
});

describe('Hint (rule U10): a dialog where there is no hover, a tooltip with a mouse', () => {
  test('on a phone a tap opens a dialog with the text, no header and a Close button that closes it', async () => {
    const restore = media((q) => q.includes('767'));
    render(<Hint content="Cashback is credited later" label="About the bonus" />);
    await userEvent.click(screen.getByRole('button', { name: 'About the bonus' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('Cashback is credited later');
    expect(dialog.querySelector('.bui-dialog__header')).toBeNull();
    await userEvent.click(screen.getAllByRole('button', { name: 'Close' }).at(-1));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    restore();
  });
  test('with a mouse it opens no dialog: it is a tooltip', async () => {
    const restore = media(() => false);
    render(<Hint content="Cashback is credited later" label="About the bonus" />);
    const trigger = screen.getByRole('button', { name: 'About the bonus' });
    expect(trigger.getAttribute('aria-haspopup')).toBeNull();
    await userEvent.click(trigger);
    expect(screen.queryByRole('dialog')).toBeNull();
    restore();
  });
});

describe('Typeahead (rule M4): a sheet on a phone', () => {
  test('on a phone the list opens in a dialog', async () => {
    const restore = media((q) => q.includes('767'));
    render(<Typeahead label="Game" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />);
    await userEvent.click(screen.getByRole('combobox'));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.querySelector('[role="listbox"], [role="option"]')).not.toBeNull();
    restore();
  });
});

describe('useFieldErrors', () => {
  function Form({ valid = false }) {
    const [v, setV] = useState({ a: '', b: '' });
    const errors = { a: v.a ? '' : 'Fill A', b: v.b.length >= 3 ? '' : 'B is short' };
    const form = useFieldErrors(errors);
    return (
      <form onSubmit={(e) => { e.preventDefault(); form.reveal(); }}>
        <TextInput label="A" value={v.a} {...form.field('a', { caption: 'hint A', onChange: (e) => setV({ ...v, a: e.target.value }) })} />
        <TextInput label="B" value={v.b} {...form.field('b', { onChange: (e) => setV({ ...v, b: e.target.value }) })} />
        <button type="submit">Send</button>
        <button type="button" onClick={form.reset}>Reset</button>
      </form>
    );
  }
  const errorsOnScreen = () => [...document.querySelectorAll('.bui-field')].filter((f) => f.getAttribute('data-status') === 'error').length;

  test('nothing is red before Submit; Submit shows the errors of the wrong fields', async () => {
    render(<Form />);
    expect(errorsOnScreen()).toBe(0);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(errorsOnScreen()).toBe(2);
    expect(screen.getByText('Fill A')).toBeInTheDocument();
  });
  test('focusing a field does not clear its error: only a changed or typed character does', async () => {
    render(<Form />);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await userEvent.click(screen.getByLabelText('B'));
    await userEvent.click(screen.getByLabelText('A'));
    expect(errorsOnScreen()).toBe(2);
    await userEvent.keyboard('x');
    expect(errorsOnScreen()).toBe(1);
    expect(screen.queryByText('Fill A')).toBeNull();
    expect(screen.getByText('hint A')).toBeInTheDocument();
    expect(screen.getByText('B is short')).toBeInTheDocument();
  });
  test('an error goes at the first typed character, and comes back with the next Submit if the field is still wrong', async () => {
    render(<Form />);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await userEvent.type(screen.getByLabelText('B'), 'x');
    expect(screen.queryByText('B is short')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('B is short')).toBeInTheDocument();
  });
  test('Submit puts the focus on the first wrong field and keeps its error until the first typed character', async () => {
    render(<Form />);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByLabelText('A')).toHaveFocus();
    expect(screen.getByText('Fill A')).toBeInTheDocument();
    await userEvent.keyboard('x');
    expect(screen.queryByText('Fill A')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByLabelText('B')).toHaveFocus();
  });
  test('reset hides every error', async () => {
    render(<Form />);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(errorsOnScreen()).toBe(0);
  });
});

describe('an error goes at the first change of the value, in any field (no help from the form)', () => {
  const state = (label) => screen.getByLabelText(label).closest('.bui-field');
  test('a text field with an error keeps it until the first typed character, and the error comes back with the next submit', async () => {
    render(<form onSubmit={(e) => e.preventDefault()}><TextInput label="Code" status="error" caption="This code does not work" /><button type="submit">Go</button></form>);
    expect(state('Code').getAttribute('data-status')).toBe('error');
    await userEvent.click(screen.getByLabelText('Code'));
    expect(state('Code').getAttribute('data-status')).toBe('error');
    await userEvent.keyboard('a');
    expect(state('Code').getAttribute('data-status')).toBeNull();
    expect(screen.queryByText('This code does not work')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(state('Code').getAttribute('data-status')).toBe('error');
    expect(screen.getByText('This code does not work')).toBeInTheDocument();
  });
  test('a new error text brings the error back at once', async () => {
    const { rerender } = render(<TextInput label="Code" status="error" caption="one" />);
    await userEvent.type(screen.getByLabelText('Code'), 'a');
    expect(screen.queryByText('one')).toBeNull();
    rerender(<TextInput label="Code" status="error" caption="two" />);
    expect(screen.getByText('two')).toBeInTheDocument();
  });
  test('a selector drops its error when another option is chosen', async () => {
    render(<Selector label="Letter" status="error" caption="Pick one" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: 'Beta' }));
    expect(screen.queryByText('Pick one')).toBeNull();
  });
});

describe('Badge light', () => {
  test('a -light variant adds the light class to a label and to a dot, and keeps the color of the variant', () => {
    const { container } = render(<><Badge variant="success-light" label="Done" /><Badge variant="critical-light" type="dot" label="Failed" /><Badge variant="success" label="Plain" /></>);
    const [a, b, c] = [...container.querySelectorAll('[data-slot="badge"]')];
    expect(a.className).toContain('bui-badge--success');
    expect(a.className).toContain('bui-badge--light');
    expect(b.className).toContain('bui-badge--light');
    expect(c.className).not.toContain('bui-badge--light');
  });
  test('every color (accent, success, warning, critical) has a light version in the styles', async () => {
    const { readFileSync } = await import('node:fs');
    const css = readFileSync('src/components.css', 'utf8');
    for (const v of ['accent', 'success', 'warning', 'critical']) expect(css, v).toMatch(new RegExp(`\\.bui-badge--light\\.bui-badge--${v}[ ,{]`));
  });
});

describe('Tooltip leaves as it comes', () => {
  test('the bubble stays drawn with data-closing while it plays out, then goes', async () => {
    vi.useFakeTimers();
    try {
      const { Tooltip } = await import('../src/components/Tooltip.jsx');
      render(<Tooltip content="Tip" delay={0}><button type="button">Trigger</button></Tooltip>);
      fireEvent.mouseEnter(screen.getByRole('button'));
      await act(async () => { vi.advanceTimersByTime(10); });
      const bubble = screen.getByRole('tooltip');
      expect(bubble).not.toHaveAttribute('data-closing');
      fireEvent.mouseLeave(screen.getByRole('button'));
      expect(screen.getByRole('tooltip')).toHaveAttribute('data-closing');
      await act(async () => { vi.advanceTimersByTime(250); });
      expect(screen.queryByRole('tooltip')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

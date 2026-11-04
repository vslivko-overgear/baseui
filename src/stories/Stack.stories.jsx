import { Stack, HStack, VStack, Group, Bleed } from '../components/Layout.jsx';
import { Token } from '../components/Token.jsx';
import { meta, playground, example, Box } from './_helpers.jsx';

export default meta({
  title: 'Components/Stack',
  component: Stack,
  args: { direction: 'column', gap: 3, align: undefined, justify: undefined, wrap: false },
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    gap: { control: 'inline-radio', options: [0, 1, 2, 3, 4, 6, 8] },
    align: { control: 'inline-radio', options: [undefined, 'start', 'center', 'end', 'stretch'] },
    justify: { control: 'inline-radio', options: [undefined, 'start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
  },
});
const items = ['One', 'Two', 'Three'].map((t) => <Box key={t}>{t}</Box>);
export const Playground = {
  ...playground({ source: '{}' }),
  render: (args) => (
    <div style={{ width: 420, maxWidth: '100%' }}>
      <Stack {...args}>{items}</Stack>
    </div>
  ),
};
export const HorizontalStack = example({
  name: 'H Stack',
  render: () => <HStack gap={3}>{items}</HStack>,
  source: `<HStack gap={3}>…</HStack>`,
});
export const VerticalStack = example({
  name: 'V Stack',
  render: () => (
    <div style={{ width: 240 }}>
      <VStack gap={2}>{items}</VStack>
    </div>
  ),
  source: `<VStack gap={2}>…</VStack>`,
});
export const Relation = example({
  name: 'Relation',
  description: 'The gap is chosen by how closely the blocks belong together: tight 8, related 16, group 24, section 40. The heading of a Group sits tight to its content, and the Stack around it keeps the distance between groups',
  render: () => (
    <div style={{ width: 360, maxWidth: '100%' }}>
      <Stack relation="section">
        <Group title="Popular">
          <Stack relation="related">
            <Box>Tile</Box>
            <Box>Tile</Box>
          </Stack>
        </Group>
        <Group title="How it works">
          <Stack relation="related">
            <Box>Step</Box>
          </Stack>
        </Group>
      </Stack>
    </div>
  ),
  source: `<Stack relation="section">
  <Group title="Popular"><Stack relation="related">…</Stack></Group>
  <Group title="How it works">…</Group>
</Stack>`,
});
export const BleedRow = example({
  name: 'Bleed',
  description: 'A row that scrolls out to the screen edges: it reaches past the page padding and keeps the padding inside, so the first chip stands on the edge of the text',
  render: () => (
    <div style={{ width: 360, padding: '0 var(--bui-spacing-4)', overflow: 'hidden', boxSizing: 'border-box' }}>
      <Bleed scroll>
        <HStack gap={2} wrap={false}>
          {['All games', 'World of Warcraft', 'Action RPG', 'MMO', 'Shooters'].map((t) => <Token key={t} size="sm">{t}</Token>)}
        </HStack>
      </Bleed>
    </div>
  ),
  source: `<Bleed scroll><HStack gap={2}>{chips}</HStack></Bleed>`,
});
export const __namedExportsOrder = ['Playground', 'HorizontalStack', 'VerticalStack', 'Relation', 'BleedRow'];

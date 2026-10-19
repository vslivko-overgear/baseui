import TFM from"./TextField.stories-JboKGoC9.js";import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./SearchLg-BL46VJpk.js";import{n as i,t as a}from"./Select-DnSjfD80.js";var o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),i(),o=t(),s=[{value:`design`,label:`Design`,},{value:`engineering`,label:`Engineering`,},{value:`marketing`,label:`Marketing`,},{value:`product`,label:`Product`,},{value:`sales`,label:`Sales`,},{value:`support`,label:`Support`,}],c={title:`Components/Select`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`Select on top of Base UI Select.Root. Supports single/multiple, validation, keyboard navigation and Portal.`}}},args:{label:`Team`,options:s,floatingLabel:!0,disabled:!1},argTypes:{label:{control:`text`},placeholder:{control:`text`},floatingLabel:{control:`boolean`},loading:{control:`boolean`,description:`Loading skeleton`},caption:{control:`text`},status:{control:`inline-radio`,options:[`none`,`error`,`warning`,`success`],mapping:{none:void 0}},disabled:{control:`boolean`},options:{control:!1},mobileModalProps:{control:!1,description:`Modal options for the sheet on viewports up to 1200px inclusive`}},decorators:[e=>(0,o.jsx)(`div`,{style:{width:360},children:(0,o.jsx)(e,{})})]},l={},u={parameters:{controls:{disable:!0}},decorators:[e=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-12)`,width:360},children:(0,o.jsx)(e,{})})],render:()=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a,{label:`Team`,options:s}),(0,o.jsx)(a,{label:`Team`,options:s,defaultValue:`design`}),(0,o.jsx)(a,{multiple:!0,selectAll:!0,label:`Team`,options:s,defaultValue:[`design`,`engineering`]}),(0,o.jsx)(a,{label:`Team`,options:s,disabled:!0}),(0,o.jsx)(a,{label:`Team`,options:s,defaultValue:`design`,status:`error`,caption:`Choose a team`}),(0,o.jsx)(a,{label:`Team`,options:s,defaultValue:`design`,status:`warning`,caption:`Check your choice`}),(0,o.jsx)(a,{label:`Team`,options:s,defaultValue:`design`,status:`success`,caption:`Team is available`})]})},d={parameters:{controls:{disable:!0}},decorators:[e=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,width:360},children:(0,o.jsx)(e,{})})],render:()=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a,{label:`Team`,options:s,startIcon:(0,o.jsx)(r,{size:24})}),(0,o.jsx)(a,{label:`Team`,options:s,startIcon:(0,o.jsx)(r,{size:24}),defaultValue:`design`}),(0,o.jsx)(a,{label:`Team`,options:s,loading:!0}),(0,o.jsx)(a,{label:`Amount`,options:s,prefix:`$`,suffix:`₽`,defaultValue:`design`})]})},f={parameters:{controls:{disable:!0}},render:()=>(0,o.jsx)(a,{multiple:!0,selectAll:!0,label:`Teams`,options:s,defaultValue:[`design`,`engineering`]})},p={parameters:{controls:{disable:!0}},render:()=>(0,o.jsx)(a,{label:`Team`,floatingLabel:!1,options:s,defaultValue:`design`})},m={parameters:{controls:{disable:!0}},render:()=>(0,o.jsx)(a,{label:`Team`,options:s,defaultOpen:!0})},h={parameters:{controls:{disable:!0},viewport:{defaultViewport:`mobile1`}},render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-12)`},children:[(0,o.jsx)(a,{label:`Team`,options:s}),(0,o.jsx)(a,{multiple:!0,label:`Teams`,options:s,defaultValue:[`design`]})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  decorators: [Story => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--baseui-spacing-12)',
    width: 360
  }}>
        <Story />
      </div>],
  render: () => <>
      <Select label="Team" options={OPTIONS} />
      <Select label="Team" options={OPTIONS} defaultValue="design" />
      <Select multiple label="Team" options={OPTIONS} defaultValue={['design', 'engineering']} />
      <Select label="Team" options={OPTIONS} disabled />
      <Select label="Team" options={OPTIONS} defaultValue="design" status="error" caption="Choose a team" />
      <Select label="Team" options={OPTIONS} defaultValue="design" status="warning" caption="Check your choice" />
      <Select label="Team" options={OPTIONS} defaultValue="design" status="success" caption="Team is available" />
    </>
}`,...u.parameters?.docs?.source},description:{story:`Empty, filled (single), multiselect, disabled and validation from Figma.
Single-filled has no outline; multiselect with a selection has the “selected” dark outline.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  decorators: [Story => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 360
  }}>
        <Story />
      </div>],
  render: () => <>
      <Select label="Team" options={OPTIONS} startIcon={<SearchLg size={24} />} />
      <Select label="Team" options={OPTIONS} startIcon={<SearchLg size={24} />} defaultValue="design" />
      <Select label="Team" options={OPTIONS} loading />
      <Select label="Amount" options={OPTIONS} prefix="$" suffix="₽" defaultValue="design" />
    </>
}`,...d.parameters?.docs?.source},description:{story:`startIcon and loading: shared chrome from FieldShell (same as TextField).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <Select multiple label="Teams" options={OPTIONS} defaultValue={['design', 'engineering']} />
}`,...f.parameters?.docs?.source},description:{story:`Selecting several values.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <Select label="Team" floatingLabel={false} options={OPTIONS} defaultValue="design" />
}`,...p.parameters?.docs?.source},description:{story:`Label Off from Figma: the selected value stays centered.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <Select label="Team" options={OPTIONS} defaultOpen />
}`,...m.parameters?.docs?.source},description:{story:`The menu is open right away.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--baseui-spacing-12)'
  }}>
      <Select label="Team" options={OPTIONS} />
      <Select multiple label="Teams" options={OPTIONS} defaultValue={['design']} />
    </div>
}`,...h.parameters?.docs?.source},description:{story:`On viewports up to 1200px the dropdown is replaced by a Modal bottom sheet.`,...h.parameters?.docs?.description}}},g=[`Playground`,`States`,`IconAndLoading`,`Multiple`,`WithoutFloatingLabel`,`Opened`,`MobileSheet`]})))()}_();{const T=TFM.argTypes,shared=[`variant`,`size`,`floatingLabel`,`caption`,`status`,`disabled`,`loading`,`prefix`,`suffix`],own=c.argTypes,rest=Object.fromEntries(Object.entries(own).filter(([k])=>k!==`label`&&!shared.includes(k)));
c.argTypes={label:T.label,...Object.fromEntries(shared.map(k=>[k,T[k]])),...rest};
c.args={...c.args,variant:`filled`,size:`md`,loading:!1};
const tp=TFM.component.__docgenInfo.props,hp=c.component.__docgenInfo.props;for(const k of shared)tp[k]&&(hp[k]={...hp[k],...tp[k]});
c.component.__docgenInfo.description+=`\n\nThe field (label, size, variant, status, caption, prefix/suffix, loading) is Text Input's own shell, so those settings and their docs come from Text Input. The list is the shared Dropdown.`};{const DET=[`Core`,`Core`,`Growth`,`Core`,`Growth`,`Operations`];c.argTypes.showDetails={control:`boolean`,description:`Details on the right of every option`};c.args.showDetails=!1;l.render=({showDetails:sd,...r})=>(0,o.jsx)(a,{...r,options:sd?s.map((x,i)=>({...x,details:DET[i]})):s})};export{d as IconAndLoading,h as MobileSheet,f as Multiple,m as Opened,l as Playground,u as States,p as WithoutFloatingLabel,g as __namedExportsOrder,c as default};
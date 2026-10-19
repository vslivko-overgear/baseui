import TFM from"./TextField.stories-JboKGoC9.js";import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./SearchLg-BL46VJpk.js";import{n as i,t as a}from"./Autocomplete-Cg967IeK.js";function o(e){return(0,s.jsx)(a,{...e})}var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),i(),s=t(),c=[{value:`design`,label:`Design`,},{value:`engineering`,label:`Engineering`,},{value:`marketing`,label:`Marketing`,},{value:`product`,label:`Product`,},{value:`sales`,label:`Sales`,},{value:`support`,label:`Support`,}],l={title:`Components/Autocomplete`,component:o,tags:[`autodocs`],parameters:{docs:{description:{component:`Autocomplete on top of Base UI Combobox.Root. Filters options by label/textValue and supports single/multiple with chips or a counter.`}}},args:{label:`Team`,options:c,floatingLabel:!0,emptyText:`Nothing found`,disabled:!1},argTypes:{label:{control:`text`},placeholder:{control:`text`},floatingLabel:{control:`boolean`},caption:{control:`text`},status:{control:`inline-radio`,options:[`none`,`error`,`warning`,`success`],mapping:{none:void 0}},emptyText:{control:`text`},disabled:{control:`boolean`},mobileSearchPlaceholder:{control:`text`,description:`Placeholder of the search input inside the mobile sheet`},mobileModalProps:{control:!1,description:`Modal options for the sheet on viewports up to 1200px inclusive`},options:{control:!1}},decorators:[e=>(0,s.jsx)(`div`,{style:{width:360},children:(0,s.jsx)(e,{})})]},u={},d={parameters:{controls:{disable:!0}},decorators:[e=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-12)`,width:360},children:(0,s.jsx)(e,{})})],render:()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a,{label:`Team`,options:c}),(0,s.jsx)(a,{label:`Team`,options:c,defaultValue:`design`}),(0,s.jsx)(a,{label:`Team`,options:c,disabled:!0}),(0,s.jsx)(a,{label:`Team`,options:c,defaultValue:`design`,status:`error`,caption:`Choose a team`}),(0,s.jsx)(a,{label:`Team`,options:c,defaultValue:`design`,status:`warning`,caption:`Check your choice`}),(0,s.jsx)(a,{label:`Team`,options:c,defaultValue:`design`,status:`success`,caption:`Team is available`})]})},f={parameters:{controls:{disable:!0}},decorators:[e=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,width:360},children:(0,s.jsx)(e,{})})],render:()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a,{label:`Team`,options:c,startIcon:(0,s.jsx)(r,{size:24})}),(0,s.jsx)(a,{label:`Team`,options:c,startIcon:(0,s.jsx)(r,{size:24}),defaultValue:`design`}),(0,s.jsx)(a,{label:`Team`,options:c,loading:!0}),(0,s.jsx)(a,{label:`Amount`,options:c,prefix:`$`,suffix:`₽`,defaultValue:`design`})]})},p={parameters:{controls:{disable:!0}},render:()=>(0,s.jsx)(a,{label:`Team`,options:c,defaultOpen:!0})},m={parameters:{controls:{disable:!0}},render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-12)`},children:[(0,s.jsx)(a,{multiple:!0,label:`Teams`,options:c,defaultValue:[`design`]}),(0,s.jsx)(a,{multiple:!0,label:`Teams`,options:c,defaultValue:[`design`,`engineering`]}),(0,s.jsx)(a,{multiple:!0,label:`Teams`,options:c,multipleDisplay:`counter`,defaultValue:c.map(e=>e.value)}),(0,s.jsx)(a,{multiple:!0,label:`Teams`,options:c,defaultValue:c.map(e=>e.value)})]})},h={parameters:{controls:{disable:!0},viewport:{defaultViewport:`mobile1`}},render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-12)`},children:[(0,s.jsx)(a,{label:`Team`,options:c}),(0,s.jsx)(a,{multiple:!0,label:`Teams`,options:c,defaultValue:[`design`]})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
      <Autocomplete label="Team" options={OPTIONS} />
      <Autocomplete label="Team" options={OPTIONS} defaultValue="design" />
      <Autocomplete label="Team" options={OPTIONS} disabled />
      <Autocomplete label="Team" options={OPTIONS} defaultValue="design" status="error" caption="Choose a team" />
      <Autocomplete label="Team" options={OPTIONS} defaultValue="design" status="warning" caption="Check your choice" />
      <Autocomplete label="Team" options={OPTIONS} defaultValue="design" status="success" caption="Team is available" />
    </>
}`,...d.parameters?.docs?.source},description:{story:`Empty, filled, disabled and validation from Figma 890:3325.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
      <Autocomplete label="Team" options={OPTIONS} startIcon={<SearchLg size={24} />} />
      <Autocomplete label="Team" options={OPTIONS} startIcon={<SearchLg size={24} />} defaultValue="design" />
      <Autocomplete label="Team" options={OPTIONS} loading />
      <Autocomplete label="Amount" options={OPTIONS} prefix="$" suffix="₽" defaultValue="design" />
    </>
}`,...f.parameters?.docs?.source},description:{story:`startIcon and loading: shared chrome from FieldShell (same as TextField).`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <Autocomplete label="Team" options={OPTIONS} defaultOpen />
}`,...p.parameters?.docs?.source},description:{story:`The input filters options by label/textValue.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--baseui-spacing-12)'
  }}>
      <Autocomplete multiple label="Teams" options={OPTIONS} defaultValue={['design']} />
      <Autocomplete multiple label="Teams" options={OPTIONS} defaultValue={['design', 'engineering']} />
      <Autocomplete multiple label="Teams" options={OPTIONS} multipleDisplay="counter" defaultValue={OPTIONS.map(option => option.value)} />
      <Autocomplete multiple label="Teams" options={OPTIONS} defaultValue={OPTIONS.map(option => option.value)} />
    </div>
}`,...m.parameters?.docs?.source},description:{story:`One, few, counter and flexible from Figma 890:11858.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
      <Autocomplete label="Team" options={OPTIONS} />
      <Autocomplete multiple label="Teams" options={OPTIONS} defaultValue={['design']} />
    </div>
}`,...h.parameters?.docs?.source},description:{story:`On viewports up to 1200px search moves to a separate input inside a Modal bottom sheet.`,...h.parameters?.docs?.description}}},g=[`Playground`,`States`,`IconAndLoading`,`Opened`,`Multiple`,`MobileSheet`]})))()}_();l.component.__docgenInfo||(l.component.__docgenInfo=a.__docgenInfo);{const T=TFM.argTypes,shared=[`variant`,`size`,`floatingLabel`,`caption`,`status`,`disabled`,`loading`,`prefix`,`suffix`],own=l.argTypes,rest=Object.fromEntries(Object.entries(own).filter(([k])=>k!==`label`&&!shared.includes(k)));
l.argTypes={label:T.label,...Object.fromEntries(shared.map(k=>[k,T[k]])),...rest};
l.args={...l.args,variant:`filled`,size:`md`,loading:!1};
const tp=TFM.component.__docgenInfo.props,hp=(l.component.__docgenInfo||a.__docgenInfo||{}).props||{};for(const k of shared)tp[k]&&(hp[k]={...hp[k],...tp[k]});
(l.component.__docgenInfo||a.__docgenInfo).description+=`\n\nThe field (label, size, variant, status, caption, prefix/suffix, loading) is Text Input's own shell, so those settings and their docs come from Text Input. The list is the shared Dropdown.`};{const DET=[`Core`,`Core`,`Growth`,`Core`,`Growth`,`Operations`];l.argTypes.showDetails={control:`boolean`,description:`Details on the right of every option`};l.args.showDetails=!1;u.render=({showDetails:sd,...r})=>(0,s.jsx)(a,{...r,options:sd?c.map((x,i)=>({...x,details:DET[i]})):c})};export{f as IconAndLoading,h as MobileSheet,m as Multiple,p as Opened,u as Playground,d as States,g as __namedExportsOrder,l as default};
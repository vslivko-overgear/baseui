import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./clsx-CTwy9ux-.js";import{n as a,t as o}from"./Button-D0wLm9ra.js";import{n as s,t as c}from"./Star01-DjlfnUbY.js";var l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{l=`bui-rating`,u=`bui-rating__star-button`,d=`bui-rating__large`,f=`bui-rating__label`,p=`bui-rating__caption`,m=`bui-rating__star-slot`,h=`bui-rating__medium`,g=`bui-rating__small`,_=`bui-rating__accent`,v=`bui-rating__warning`,y=`bui-rating__stars`,b=`bui-rating__star`,x=`bui-rating__star-fill`,S={rating:l,starButton:u,lg:d,label:f,caption:p,starSlot:m,md:h,sm:g,accent:_,warning:v,stars:y,star:b,starFill:x}})))()}function w(e,t,n=!0){let r=Math.min(Math.max(e,0),t);return n?r===t?t:Math.floor(r*2)/2:r}function T(e,t,n,r=!0){let i=w(e,n,r);return Math.min(Math.max(i-(t-1),0),1)}function E(e){return e===1?`1 star`:`${e} stars`}function D(e,t,n,r){if(r===1)return e;let{left:i,width:a}=n.getBoundingClientRect();return t-i<a/2?Math.max(e-.5,.5):e}function O({fill:e}){return(0,j.jsxs)(`span`,{className:S.star,"aria-hidden":`true`,children:[(0,j.jsx)(s,{}),e>0&&(0,j.jsx)(`span`,{className:S.starFill,style:e<1?{clipPath:`inset(0 ${(1-e)*100}% 0 0)`}:void 0,children:(0,j.jsx)(s,{})})]})}function k({value:e=0,max:t=5,size:n=`lg`,color:r=`accent`,disabled:a=!1,readOnly:s=!1,label:c,caption:l,precision:u=1,round:d=!0,onChange:f,className:p,name:m,"aria-label":h,ref:g}){let _=(0,A.useId)(),[v,y]=(0,A.useState)(null),b=(0,A.useRef)(!1),x=!a&&!s&&!!f,C={"--baseui-rating-max":t},w=v??e,k=(e,t)=>{!x||!f||f(D(e,t.clientX,t.currentTarget,u))},M=(e,t)=>{y(D(e,t.clientX,t.currentTarget,u))},N=()=>y(null),P=(0,j.jsx)(`div`,{"data-slot":`rating-stars`,className:S.stars,style:C,children:Array.from({length:t},(n,r)=>{let i=r+1,s=T(w,i,t,d);return x?(0,j.jsx)(o,{type:`button`,name:m,disabled:a,className:S.starButton,"aria-label":E(i),"aria-pressed":e>=i,onMouseEnter:e=>M(i,e),onMouseMove:e=>M(i,e),onPointerDown:()=>{b.current=!0},onFocus:()=>{b.current||y(i),b.current=!1},onClick:e=>k(i,e),children:(0,j.jsx)(O,{fill:s})},i):(0,j.jsx)(`span`,{className:S.starSlot,children:(0,j.jsx)(O,{fill:s})},i)})});return x?(0,j.jsxs)(`div`,{ref:g,"data-slot":`rating`,"data-size":n,className:i(S.rating,S[n],S[r],p),role:`radiogroup`,"aria-label":h,"aria-labelledby":c?_:void 0,"data-disabled":a||void 0,onMouseLeave:N,onBlur:e=>{e.currentTarget.contains(e.relatedTarget)||N()},children:[c&&(0,j.jsx)(`span`,{id:_,"data-slot":`rating-label`,className:S.label,children:c}),P,l&&(0,j.jsx)(`span`,{"data-slot":`rating-caption`,className:S.caption,children:l})]}):(0,j.jsxs)(`div`,{ref:g,"data-slot":`rating`,"data-size":n,className:i(S.rating,S[n],S[r],p),role:`img`,"aria-label":h,"aria-labelledby":c?_:void 0,"data-disabled":a||void 0,children:[c&&(0,j.jsx)(`span`,{id:_,"data-slot":`rating-label`,className:S.label,children:c}),P,l&&(0,j.jsx)(`span`,{"data-slot":`rating-caption`,className:S.caption,children:l})]})}var A,j;function M(){return(M=e((()=>{a(),c(),r(),A=t(),C(),j=n(),k.__docgenInfo={description:"A rating on top of the headless Base UI Button for interactive stars.\nDisplay 0–max with optional rounding (`round`) and selection step (`precision`).\nStyles use semantic `--baseui-*` tokens (theme via `data-theme`).\n\nIf `label` is not set, pass the accessible name through `aria-label`,\notherwise the rating stays unnamed for screen readers.",methods:[],displayName:`Rating`,props:{value:{required:!1,tsType:{name:`number`},description:`Current value (0 … max). Display is controlled by the round prop. @default 0`,defaultValue:{value:`0`,computed:!1}},max:{required:!1,tsType:{name:`number`},description:`Number of stars in the group. @default 5`,defaultValue:{value:`5`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`'lg' | 'md' | 'sm'`,elements:[{name:`literal`,value:`'lg'`},{name:`literal`,value:`'md'`},{name:`literal`,value:`'sm'`}]},description:`Size. @default 'lg'`,defaultValue:{value:`'lg'`,computed:!1}},color:{required:!1,tsType:{name:`union`,raw:`'accent' | 'warning'`,elements:[{name:`literal`,value:`'accent'`},{name:`literal`,value:`'warning'`}]},description:`Color theme of the stars. @default 'accent'`,defaultValue:{value:`'accent'`,computed:!1}},disabled:{required:!1,tsType:{name:`boolean`},description:`Locked after input: gray stars, no interaction.`,defaultValue:{value:`false`,computed:!1}},readOnly:{required:!1,tsType:{name:`boolean`},description:`Display only, no selection.`,defaultValue:{value:`false`,computed:!1}},label:{required:!1,tsType:{name:`ReactNode`},description:`Label above the stars.`},caption:{required:!1,tsType:{name:`ReactNode`},description:`Caption under the stars (a hint or validation).`},precision:{required:!1,tsType:{name:`union`,raw:`0.5 | 1`,elements:[{name:`literal`,value:`0.5`},{name:`literal`,value:`1`}]},description:`Step on click (1 is whole stars; 0.5 is the left/right half of a star). @default 1`,defaultValue:{value:`1`,computed:!1}},round:{required:!1,tsType:{name:`boolean`},description:`Rounding of the displayed value: true rounds down to 0.5; false is a proportional fill. @default true`,defaultValue:{value:`true`,computed:!1}},onChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => void`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`void`}}},description:`Callback when the value changes.`},className:{required:!1,tsType:{name:`string`},description:`Consumer extra class (merged). The Base UI function form is not supported.`},name:{required:!1,tsType:{name:`string`},description:`Group name for the form (radiogroup).`},"aria-label":{required:!1,tsType:{name:`string`},description:`Accessible name when there is no visible label.`},ref:{required:!1,tsType:{name:`Ref`,elements:[{name:`HTMLDivElement`}],raw:`Ref<HTMLDivElement>`},description:`Ref to the root element (React 19: a regular prop, no forwardRef).`}}}})))()}var N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{N=t(),M(),P=n(),F=[`lg`,`md`,`sm`],I=[`accent`,`warning`],L=({children:e})=>(0,P.jsx)(`div`,{style:{display:`flex`,gap:`var(--baseui-spacing-16)`,alignItems:`center`,flexWrap:`wrap`},children:e}),R=({title:e,children:t})=>(0,P.jsxs)(`section`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-12)`},children:[(0,P.jsx)(`h3`,{style:{margin:0,font:`var(--baseui-Typography-Text-14-Semi-Bold)`,opacity:.6},children:e}),t]}),z={title:`Components/Rating`,component:k,parameters:{docs:{description:{component:"A rating on top of the headless Base UI Button for interactive stars. Display 0–max with rounding (`round`) and selection (`precision`). Styles use `--baseui-*` tokens, the theme switches with the `data-theme` attribute."}}},args:{value:2.5,max:5,size:`lg`,color:`accent`,disabled:!1,readOnly:!1,label:`Label`,caption:`Caption`,precision:1,round:!0},argTypes:{label:{control:`text`,description:`Label above the stars`},caption:{control:`text`,description:`Caption under the stars`},value:{control:{type:`number`,min:0,max:10,step:.1},description:`Value 0–max`},max:{control:{type:`number`,min:1,max:10,step:1},description:`Number of stars in the group`},size:{control:`inline-radio`,options:F,description:`Size`,table:{type:{summary:F.map(e=>`'${e}'`).join(` | `)}}},color:{control:`inline-radio`,options:I,description:`Color theme`,table:{type:{summary:I.map(e=>`'${e}'`).join(` | `)}}},disabled:{control:`boolean`,description:`Locked (disabled)`},readOnly:{control:`boolean`,description:`Display only`},precision:{control:`inline-radio`,options:[1,.5],description:`Selection step (1 = whole star, 0.5 = half)`},round:{control:`boolean`,description:`Rounding: true rounds down to 0.5; false is proportional`}}},B={},V={parameters:{controls:{disable:!0}},render:()=>(0,P.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-32)`},children:[(0,P.jsx)(R,{title:`Sizes`,children:(0,P.jsx)(L,{children:F.map(e=>(0,P.jsx)(k,{value:2.5,size:e,readOnly:!0,"aria-label":e},e))})}),(0,P.jsx)(R,{title:`Color themes`,children:(0,P.jsx)(L,{children:I.map(e=>(0,P.jsx)(k,{value:3.5,color:e,size:`md`,readOnly:!0,"aria-label":e},e))})}),(0,P.jsx)(R,{title:`States (enabled · disabled)`,children:(0,P.jsxs)(L,{children:[(0,P.jsx)(k,{value:3.5,size:`md`,readOnly:!0,"aria-label":`enabled`}),(0,P.jsx)(k,{value:3.5,size:`md`,disabled:!0,"aria-label":`disabled`})]})}),(0,P.jsx)(R,{title:`Star values (empty · half · filled)`,children:(0,P.jsxs)(L,{children:[(0,P.jsx)(k,{value:0,max:3,size:`lg`,readOnly:!0,"aria-label":`empty`}),(0,P.jsx)(k,{value:.5,max:3,size:`lg`,readOnly:!0,"aria-label":`half`}),(0,P.jsx)(k,{value:1,max:3,size:`lg`,readOnly:!0,"aria-label":`filled`})]})}),(0,P.jsx)(R,{title:`Group (max)`,children:(0,P.jsxs)(L,{children:[(0,P.jsx)(k,{value:1,max:3,size:`md`,readOnly:!0,"aria-label":`3 stars`}),(0,P.jsx)(k,{value:2.5,max:5,size:`md`,readOnly:!0,"aria-label":`5 stars`}),(0,P.jsx)(k,{value:7,max:10,size:`md`,readOnly:!0,"aria-label":`10 stars`})]})}),(0,P.jsx)(R,{title:`Label / caption`,children:(0,P.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--baseui-spacing-12)`,maxWidth:280},children:[(0,P.jsx)(k,{value:4,label:`Label`,caption:`Caption`,readOnly:!0}),(0,P.jsx)(k,{value:4,"aria-label":`without label`,readOnly:!0})]})}),(0,P.jsx)(R,{title:`round rounding at value=3.3`,children:(0,P.jsxs)(L,{children:[(0,P.jsx)(k,{value:3.3,size:`md`,round:!0,readOnly:!0,"aria-label":`round true`}),(0,P.jsx)(k,{value:3.3,size:`md`,round:!1,readOnly:!0,"aria-label":`round false`})]})})]})},H={parameters:{controls:{disable:!0}},render:function(){let[e,t]=(0,N.useState)(0);return(0,P.jsx)(k,{value:e,onChange:t,label:`Rate this product`,caption:`Click a star to rate`,precision:.5})}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{}`,...B.parameters?.docs?.source},description:{story:`Interactive playground.`,...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--baseui-spacing-32)'
  }}>
      <Section title="Sizes">
        <Row>
          {SIZES.map(size => <Rating key={size} value={2.5} size={size} readOnly aria-label={size} />)}
        </Row>
      </Section>

      <Section title="Color themes">
        <Row>
          {COLORS.map(color => <Rating key={color} value={3.5} color={color} size="md" readOnly aria-label={color} />)}
        </Row>
      </Section>

      <Section title="States (enabled · disabled)">
        <Row>
          <Rating value={3.5} size="md" readOnly aria-label="enabled" />
          <Rating value={3.5} size="md" disabled aria-label="disabled" />
        </Row>
      </Section>

      <Section title="Star values (empty · half · filled)">
        <Row>
          <Rating value={0} max={3} size="lg" readOnly aria-label="empty" />
          <Rating value={0.5} max={3} size="lg" readOnly aria-label="half" />
          <Rating value={1} max={3} size="lg" readOnly aria-label="filled" />
        </Row>
      </Section>

      <Section title="Group (max)">
        <Row>
          <Rating value={1} max={3} size="md" readOnly aria-label="3 stars" />
          <Rating value={2.5} max={5} size="md" readOnly aria-label="5 stars" />
          <Rating value={7} max={10} size="md" readOnly aria-label="10 stars" />
        </Row>
      </Section>

      <Section title="Label / caption">
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--baseui-spacing-12)',
        maxWidth: 280
      }}>
          <Rating value={4} label="Label" caption="Caption" readOnly />
          <Rating value={4} aria-label="without label" readOnly />
        </div>
      </Section>

      <Section title="round rounding at value=3.3">
        <Row>
          <Rating value={3.3} size="md" round readOnly aria-label="round true" />
          <Rating value={3.3} size="md" round={false} readOnly aria-label="round false" />
        </Row>
      </Section>
    </div>
}`,...V.parameters?.docs?.source},description:{story:`A static showcase of sizes, colors, states and groups —
the whole surface of the component on one screen (no controls to operate).`,...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: function Render() {
    const [value, setValue] = useState(0);
    return <Rating value={value} onChange={setValue} label="Rate this product" caption="Click a star to rate" precision={0.5} />;
  }
}`,...H.parameters?.docs?.source},description:{story:`Interactive selection with precision=0.5.`,...H.parameters?.docs?.description}}},U=[`Playground`,`Overview`,`Interactive`]})))()}W();export{H as Interactive,V as Overview,B as Playground,U as __namedExportsOrder,z as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";var r;function i(){return(i=e((()=>{r=`/*
 * baseui typography: type styles.
 * Concatenated with tokens.css into dist/styles.css at build time; consumers include
 * everything with one file: \`import '@baseui/ui/styles.css'\`.
 *
 * Usage: font: var(--baseui-Typography-Text-16-Regular);
 * the font shorthand sets weight, size/line-height and family at once. The family is repeated
 * in every token by necessity (a shorthand without a family is invalid): there is one source, see below.
 *
 * Two sets of styles: header styles and text styles. The font family is a theme setting
 * (--baseui-Typography-Headline-Font-Family and --baseui-Typography-Font-Family).
 * letter-spacing is 0 (the default) for all styles and is not set separately.
 */

:root {
  /*
   * The font family of the text styles; a system font is the fallback.
   */
  --baseui-Typography-Font-Family:
    var(--font-geist, "Geist"), system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Headers */
  --baseui-Typography-Header-48: 700 48px / 64px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Header-40: 700 40px / 52px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Header-32: 700 32px / 40px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Header-28: 700 28px / 34px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Header-24: 700 24px / 32px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Header-20: 700 20px / 24px var(--baseui-Typography-Font-Family);

  /* Text */
  --baseui-Typography-Text-20-Semi-Bold: 600 20px / 26px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-20-Regular: 400 20px / 26px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-16-Bold: 700 16px / 22px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-16-Semi-Bold: 600 16px / 22px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-16-Regular: 400 16px / 22px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-14-Bold: 700 14px / 20px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-14-Semi-Bold: 600 14px / 20px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-14-Regular: 400 14px / 20px var(--baseui-Typography-Font-Family);
  --baseui-Typography-Text-12-Regular: 400 12px / 16px var(--baseui-Typography-Font-Family);
}
`})))()}var a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{a=`bui-typography__page`,o=`bui-typography__section`,s=`bui-typography__section-title`,c=`bui-typography__list`,l=`bui-typography__row`,u=`bui-typography__sample`,d=`bui-typography__meta`,f=`bui-typography__name`,p=`bui-typography__value`,m=`bui-typography__value-copied bui-typography__value`,h=`bui-typography__sr-only`,g={page:a,section:o,sectionTitle:s,list:c,row:l,sample:u,meta:d,name:f,value:p,valueCopied:m,srOnly:h}})))()}function v(e,t){let n=e.indexOf(t),r=e.indexOf(`{`,n),i=e.indexOf(`
}`,r);return e.slice(r+1,i)}function y(e){let t=[],n=null;for(let r of e.split(`
`)){let e=r.match(/^\s*\/\*\s*(.+?)\s*\*\/\s*$/);if(e){n={title:e[1],tokens:[]},t.push(n);continue}let i=r.match(/--(baseui-Typography-[\w-]+):\s*([^;]+);/);if(!i||!n)continue;let a=i[1],o=a.replace(/^baseui-Typography-/,``);n.tokens.push({name:o,varName:a,value:i[2].trim()})}return t}function b(e){let t=e.match(/^(\d+)\s+(\d+)px\s*\/\s*(\d+)px/);if(!t)return e;let[,n,r,i]=t;return`${n} · ${r}/${i}`}function x(){let[e,t]=(0,S.useState)(``);(0,S.useEffect)(()=>{if(!e)return;let n=window.setTimeout(()=>t(``),1500);return()=>clearTimeout(n)},[e]);let n=(0,S.useCallback)(e=>{let n=`var(--${e})`,r=()=>{let r=document.activeElement,i=document.createElement(`textarea`);i.value=n,i.setAttribute(`readonly`,``),i.style.cssText=`position:fixed;top:0;left:0;opacity:0`,document.body.append(i),i.select();let a=document.execCommand(`copy`);i.remove(),r instanceof HTMLElement&&r.focus(),a&&t(e)};navigator.clipboard?navigator.clipboard.writeText(n).then(()=>t(e)).catch(r):r()},[]);return(0,C.jsxs)(`div`,{className:g.page,children:[w.map(t=>(0,C.jsxs)(`section`,{className:g.section,children:[(0,C.jsx)(`h3`,{className:g.sectionTitle,children:t.title}),(0,C.jsx)(`div`,{className:g.list,children:t.tokens.map(t=>(0,C.jsxs)(`button`,{type:`button`,className:g.row,title:`var(--${t.varName}): ${t.value}`,onClick:()=>n(t.varName),children:[(0,C.jsx)(`span`,{className:g.sample,style:{font:`var(--${t.varName})`},children:t.name.replace(/-/g,` `)}),(0,C.jsxs)(`span`,{className:g.meta,children:[(0,C.jsx)(`span`,{className:g.name,children:t.name}),(0,C.jsx)(`span`,{className:e===t.varName?g.valueCopied:g.value,children:e===t.varName?`Copied`:b(t.value)})]})]},t.varName))})]},t.title)),(0,C.jsx)(`span`,{className:g.srOnly,role:`status`,children:e&&`Copied var(--${e})`})]})}var S,C,w,T,E,D;function O(){return(O=e((()=>{S=t(),i(),_(),C=n(),w=y(v(r,`:root`)),T={title:`Foundations/Typography`,tags:[`!autodocs`],parameters:{controls:{disable:!0}}},E={render:()=>(0,C.jsx)(x,{})},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <Typography />
}`,...E.parameters?.docs?.source},description:{story:"Type styles `--baseui-Typography-*` from typography.css, grouped by the file\nsections (a section title is the comment above a block of tokens). Clicking a row copies\n`var(--baseui-...)`.",...E.parameters?.docs?.description}}},D=[`Scale`]})))()}O();export{E as Scale,D as __namedExportsOrder,T as default};
// Dropdown parts shared by the standalone Dropdown, Selector and Typeahead: the item markup, groups, dividers and the select-all row,
// plus the adapter that draws them with the Base UI parts of a Select or a Combobox. Specs follow the Figma "Menu" and "Menu Item".
import{t as reactFactory}from"./react-BZJXY1be.js";
import{t as jsxFactory}from"./jsx-runtime-DeHZSEgm.js";
import{n as initCheck,t as Check}from"./Check-C6Isogov.js";
import{d as initStyles,s as optionLabel,u as styles}from"./useMediaLg-a1QeSKgZ.js";

initCheck();
initStyles();
const React=reactFactory();
const{jsx,jsxs}=jsxFactory();

/** Entries of `options`: an option `{ value, label, details?, icon?, avatar?, subitem?, disabled? }`, a group title `{ type: 'group', label }` or a divider `{ type: 'divider' }`. */
export const isOption=(o)=>o&&o.type!=="group"&&o.type!=="divider";

/** The inside of an item: icon or avatar, label, details and a check mark for the selected one. */
export function DropdownItemContent({option:o,ids={},check}){
  return jsxs(React.Fragment,{children:[
    o.avatar&&jsx("img",{className:"bui-dropdown__avatar",src:o.avatar,alt:"","aria-hidden":"true"}),
    !o.avatar&&o.icon&&jsx("span",{className:"bui-dropdown__icon","aria-hidden":"true",children:o.icon}),
    jsx("span",{id:ids.label,className:"bui-dropdown__label",children:o.label}),
    o.details&&jsx("span",{id:ids.details,className:"bui-dropdown__details",children:o.details}),
    check]});
}
export const itemClass=(o)=>"bui-dropdown__item"+(o.subitem?" bui-dropdown__item--subitem":"");
export function DropdownGroup({label}){return jsx("div",{className:"bui-dropdown__group",role:"presentation",children:label})}
export function DropdownDivider(){return jsx("div",{className:"bui-dropdown__divider",role:"separator"})}
/** "Select all" / "Remove all" row of a multiple dropdown. */
export function DropdownSelectAll({label,onClick}){return jsx("div",{className:"bui-dropdown__item bui-dropdown__select-all",role:"button",tabIndex:-1,onClick,onKeyDown:(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onClick()}},children:jsx("span",{className:"bui-dropdown__label",children:label})})}
export const CheckMark=()=>jsx(Check,{"aria-hidden":"true"});

/**
 * Ref for the panel of any dropdown (standalone, Selector, Typeahead): keeps `data-was` on the items that were selected before the panel started closing,
 * so a menu that plays out after a choice does not show the new check mark on a fading panel (see the menu CSS).
 */
export function trackSelection(panel){
  if(!panel||panel.__track)return;
  const closing=()=>panel.hasAttribute("data-closing")||panel.hasAttribute("data-ending-style");
  const take=()=>{
    if(closing())return;
    panel.querySelectorAll(".bui-dropdown__item").forEach(it=>{
      const on=it.getAttribute("aria-selected")==="true"||it.hasAttribute("data-selected");
      if(on)it.setAttribute("data-was","");else it.removeAttribute("data-was");
    });
  };
  // a choice and the closing come in separate commits, so the snapshot waits a moment and is dropped if the panel starts closing
  let timer=0;
  const snap=()=>{clearTimeout(timer);if(!closing())timer=setTimeout(take,80)};
  const ob=new MutationObserver(snap);
  ob.observe(panel,{subtree:true,childList:true,attributes:true,attributeFilter:["aria-selected","data-selected","data-closing","data-ending-style"]});
  panel.__track=ob;take();
}

/**
 * Draws the list of a Selector or a Typeahead.
 * @param parts   Base UI parts of the host: `{ Portal, Positioner, Popup, List, Item, Indicator, ItemText?, Empty? }`.
 * @param mode    `select` renders the options as children (groups, dividers and select-all supported), `combobox` as a render function (filtered list and empty state).
 * @param selectAll `{ label, onClick }` shows the select-all row above the list.
 */
export function DropdownList({parts,mode="select",positionerRef,anchor,menu=false,options,idBase,testIdPrefix,emptyText,selectAll}){
  const{Portal,Positioner,Popup,List,Item,ItemText,Indicator,Empty}=parts;
  const real=React.useMemo(()=>options.filter(isOption),[options]);
  const byValue=React.useMemo(()=>new Map(real.map(o=>[o.value,o])),[real]);
  const option=(o,index)=>{
    const labelId=`${idBase}-${index}-label`,detailsId=`${idBase}-${index}-details`;
    const common={className:itemClass(o),value:o.value,disabled:o.disabled,"data-testid":`${testIdPrefix}-${o.value}`,"aria-labelledby":labelId,"aria-describedby":o.details?detailsId:void 0};
    const check=jsx(Indicator,{className:"bui-dropdown__check",keepMounted:true,children:jsx(Check,{"aria-hidden":"true"})});
    // The Select item text is its own Base UI part, so the label is drawn here instead of by DropdownItemContent.
    if(mode==="select"){
      return jsxs(Item,{...common,label:optionLabel(o,o.value),children:[
        o.avatar&&jsx("img",{className:"bui-dropdown__avatar",src:o.avatar,alt:"","aria-hidden":"true"}),
        !o.avatar&&o.icon&&jsx("span",{className:"bui-dropdown__icon","aria-hidden":"true",children:o.icon}),
        jsx(ItemText,{id:labelId,className:"bui-dropdown__label",children:o.label}),
        o.details&&jsx("span",{id:detailsId,className:"bui-dropdown__details",children:o.details}),check]},o.value);
    }
    return jsx(Item,{...common,index,children:jsx(DropdownItemContent,{option:o,ids:{label:labelId,details:detailsId},check})},o.value);
  };
  let n=-1;
  const selectOptions=options.map((o,i)=>o.type==="group"?jsx(DropdownGroup,{label:o.label},`g${i}`):o.type==="divider"?jsx(DropdownDivider,{},`d${i}`):option(o,++n));
  return jsx(Portal,{children:jsx(Positioner,{ref:positionerRef,className:styles.positioner+(menu?" bui-select-menu":""),anchor:menu?void 0:anchor,sideOffset:8,align:"start",...(mode==="select"?{alignItemWithTrigger:false}:{}),collisionPadding:8,
    children:jsxs(Popup,{ref:trackSelection,className:styles.popup+" bui-dropdown"+(menu?" bui-select-menu__popup":""),children:[
      selectAll&&jsx(DropdownSelectAll,{...selectAll}),
      mode==="select"
        ?jsx(List,{className:"bui-dropdown__list",children:selectOptions})
        :jsxs(React.Fragment,{children:[jsx(List,{className:"bui-dropdown__list",children:(value,index)=>{const o=byValue.get(value);return o?option(o,index):null}}),jsx(Empty,{className:styles.empty,children:emptyText})]})]})})});
}
DropdownList.__docgenInfo={description:"The list part of Selector and Typeahead: it draws the dropdown items (icon or avatar, label, details, check), groups, dividers and the select-all row with the Base UI parts of its host.",methods:[],displayName:"DropdownList",props:{}};

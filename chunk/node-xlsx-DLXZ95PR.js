var v=Object.defineProperty;var j=(e,t,s)=>t in e?v(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var S=(e,t,s)=>(j(e,typeof t!="symbol"?t+"":t,s),s);import{r as b,a as _,u as d,w as B,s as N}from"./xlsx-BSlZAFvl.js";const m={},$=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"}));N($);var w=e=>typeof e=="string",T=class{constructor(){S(this,"Sheets",{});S(this,"SheetNames",[])}},D=(e,t={})=>{const{dateNF:s,header:n=1,range:r,blankrows:p,defval:i,raw:a=!0,rawNumbers:h,...c}=t,u=w(e)?b(e,{dateNF:s,raw:a,...c}):_(e,{dateNF:s,raw:a,...c});return Object.keys(u.Sheets).map(o=>{const l=u.Sheets[o];return{name:o,data:d.sheet_to_json(l,{dateNF:s,header:n,range:typeof r=="function"?r(l):r,blankrows:p,defval:i,raw:a,rawNumbers:h})}})},M=(e,t={})=>{const s=w(e)?b(e,t):_(e,t);return Object.keys(s.Sheets).map(n=>{const r=s.Sheets[n];return{name:n,data:r["!ref"]?d.decode_range(r["!ref"]):null}})},W=(e,{parseOptions:t={},writeOptions:s={},sheetOptions:n={},...r}={})=>{const{bookType:p="xlsx",bookSST:i=!1,type:a="buffer",...h}=s,c=Object.keys(r).filter(o=>["!cols","!rows","!merges","!protect","!autofilter"].includes(o)?(console.debug(`Deprecated options['${o}'], please use options.sheetOptions['${o}'] instead.`),!0):(console.debug(`Unknown options['${o}'], please use options.parseOptions / options.writeOptions`),!1)),u=e.reduce((o,{name:l,data:g,options:k={}},O)=>{const f=l||`Sheet_${O}`,y=d.aoa_to_sheet(g,t);return o.SheetNames.push(f),o.Sheets[f]=y,Object.assign(o.Sheets[f],c,n,k),o},new T);return B(u,{bookType:p,bookSST:i,type:a,...h})},P={parse:D,parseMetadata:M,build:W};export{P as s};
const __vite__fileDeps=["chunk/Home-Cser4NP0.js","chunk/vue-router-2q5u608f.js","chunk/@vue-vfydSGcF.js","chunk/ant-design-vue-BzNP172m.js","chunk/@babel-D6Xak2o6.js","chunk/@ant-design-DvXUoR2B.js","chunk/@ctrl-DOFZgDuz.js","chunk/dayjs-DfUUTG6R.js","chunk/copy-to-clipboard-gvHgSpPc.js","chunk/toggle-selection-BHUZwh74.js","chunk/lodash-es-Bd9XdmsI.js","chunk/resize-observer-polyfill-B1PUzC5B.js","chunk/async-validator-DKvM95Vc.js","chunk/scroll-into-view-if-needed-SxpMpKWN.js","chunk/compute-scroll-into-view-1gs_hJI2.js","chunk/throttle-debounce-CUWDS_la.js","chunk/dom-align-CRCehRfe.js","chunk/@emotion-BtrR-yrm.js","chunk/stylis-DsJDcYJc.js","chunk/vue-types-C5fUfLeo.js","css/Home-CQP9yr_H.css","chunk/NormalAnalyze-CaNmZgxC.js","chunk/node-xlsx-DLXZ95PR.js","chunk/xlsx-BSlZAFvl.js","chunk/PinYin-B-alTXLf.js","chunk/pinyin-pro-DNksu4Sv.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{O as y,P as v,Q as g,R as m,c as u,u as E,S as P}from"../chunk/@vue-vfydSGcF.js";import{A as L,C as O,l as w}from"../chunk/ant-design-vue-BzNP172m.js";import{d as A}from"../chunk/dayjs-DfUUTG6R.js";import{c as b,a as C}from"../chunk/vue-router-2q5u608f.js";import"../chunk/@babel-D6Xak2o6.js";import"../chunk/@ant-design-DvXUoR2B.js";import"../chunk/@ctrl-DOFZgDuz.js";import"../chunk/lodash-es-Bd9XdmsI.js";import"../chunk/resize-observer-polyfill-B1PUzC5B.js";import"../chunk/async-validator-DKvM95Vc.js";import"../chunk/scroll-into-view-if-needed-SxpMpKWN.js";import"../chunk/compute-scroll-into-view-1gs_hJI2.js";import"../chunk/throttle-debounce-CUWDS_la.js";import"../chunk/dom-align-CRCehRfe.js";import"../chunk/@emotion-BtrR-yrm.js";import"../chunk/stylis-DsJDcYJc.js";import"../chunk/vue-types-C5fUfLeo.js";import"../chunk/copy-to-clipboard-gvHgSpPc.js";import"../chunk/toggle-selection-BHUZwh74.js";(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function s(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function c(t){if(t.ep)return;t.ep=!0;const e=s(t);fetch(t.href,e)}})();const R={__name:"App",setup(a){return A.locale("zh-cn"),(i,s)=>{const c=y("router-view"),t=L,e=O;return v(),g(e,{locale:E(w)},{default:m(()=>[u(t,null,{default:m(()=>[u(c)]),_:1})]),_:1},8,["locale"])}}},S="modulepreload",V=function(a){return"/"+a},d={},p=function(i,s,c){let t=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),r=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));t=Promise.all(s.map(o=>{if(o=V(o),o in d)return;d[o]=!0;const l=o.endsWith(".css"),f=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${f}`))return;const n=document.createElement("link");if(n.rel=l?"stylesheet":S,l||(n.as="script",n.crossOrigin=""),n.href=o,r&&n.setAttribute("nonce",r),document.head.appendChild(n),l)return new Promise((_,h)=>{n.addEventListener("load",_),n.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${o}`)))})}))}return t.then(()=>i()).catch(e=>{const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=e,window.dispatchEvent(r),!r.defaultPrevented)throw e})},I=[{path:"/",name:"home",component:()=>p(()=>import("../chunk/Home-Cser4NP0.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])),children:[{path:"/analyze",name:"analyze",component:()=>p(()=>import("../chunk/NormalAnalyze-CaNmZgxC.js"),__vite__mapDeps([21,22,23,3,4,2,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]))},{path:"/pinyin",name:"pinyin",component:()=>p(()=>import("../chunk/PinYin-B-alTXLf.js"),__vite__mapDeps([24,8,9,25,3,4,2,5,6,7,10,11,12,13,14,15,16,17,18,19]))}]}],T=b({history:C("/"),routes:I});P(R).use(T).mount("#app");
if(!self.define){let e,c={};const i=(i,n)=>(i=new URL(i+".js",n).href,c[i]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=c,document.head.appendChild(e)}else e=i,importScripts(i),c()})).then((()=>{let e=c[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(c[s])return;let a={};const d=e=>i(e,s),f={module:{uri:s},exports:a,require:d};c[s]=Promise.all(n.map((e=>f[e]||d(e)))).then((e=>(r(...e),a)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"10b5f88323fdad31bf50c90668d3e84a"},{url:"chunk/@ant-design-DvXUoR2B.js",revision:"4f3f1ada6d6087a9c3602ed02be3664f"},{url:"chunk/@babel-D6Xak2o6.js",revision:"6b7b3d00441193b8ceab6825f62fc2bf"},{url:"chunk/@ctrl-DOFZgDuz.js",revision:"3560136a593388d744f3ec3390490de0"},{url:"chunk/@emotion-BtrR-yrm.js",revision:"2245a7d6907b32207d9d4662e891c1d9"},{url:"chunk/@vue-vfydSGcF.js",revision:"db0d60520bcb17df562cb161860b8478"},{url:"chunk/ant-design-vue-BzNP172m.js",revision:"17a1b76da631a50757862f9dfd94f8bc"},{url:"chunk/async-validator-DKvM95Vc.js",revision:"71d81aab391cb6139d1aaed538ee5fa2"},{url:"chunk/compute-scroll-into-view-1gs_hJI2.js",revision:"f0cd10c055af230d7bb85c6e5c5320c5"},{url:"chunk/copy-to-clipboard-gvHgSpPc.js",revision:"29b28c8c09e8a099c9be4de65e413ddb"},{url:"chunk/dayjs-DfUUTG6R.js",revision:"1cad1b78cfd66f84b8dde55ca0657370"},{url:"chunk/dom-align-CRCehRfe.js",revision:"a495881fdf92f31821ea350600e1d8b7"},{url:"chunk/Home-Cser4NP0.js",revision:"aaba44ae71744be49535c53f01881309"},{url:"chunk/lodash-es-Bd9XdmsI.js",revision:"f7f45673fc0f23fba5a9c948a7d3146f"},{url:"chunk/node-xlsx-DLXZ95PR.js",revision:"caa5bfb8ff851b5af2e153bcf4bf5940"},{url:"chunk/NormalAnalyze-CaNmZgxC.js",revision:"ffe627fa5d896ae85a33ded0066441c4"},{url:"chunk/PinYin-B-alTXLf.js",revision:"275a83c246b6c4dd276e9f6465a2a2d3"},{url:"chunk/pinyin-pro-DNksu4Sv.js",revision:"27f484d57d03d651fc0cf7d3002b6f39"},{url:"chunk/resize-observer-polyfill-B1PUzC5B.js",revision:"5cc012c609879e25a2af3c27f3cb954f"},{url:"chunk/scroll-into-view-if-needed-SxpMpKWN.js",revision:"73e03ae58ccc9ff4720ee6aa93cc63f4"},{url:"chunk/stylis-DsJDcYJc.js",revision:"ab7b43b13a29be2901fd44115810f5af"},{url:"chunk/throttle-debounce-CUWDS_la.js",revision:"aa6224d3bb8766e035e02711f9966b9c"},{url:"chunk/toggle-selection-BHUZwh74.js",revision:"b48eb30a513c2653a987dccb8e5017db"},{url:"chunk/vue-l0sNRNKZ.js",revision:"68b329da9893e34099c7d8ad5cb9c940"},{url:"chunk/vue-router-2q5u608f.js",revision:"0054f6e8f21891220e183e86181b689c"},{url:"chunk/vue-types-C5fUfLeo.js",revision:"a34c986aeeaed25021125e00869bf3b0"},{url:"chunk/xlsx-BSlZAFvl.js",revision:"7041f471b98ac29d7216b20e3ae68d91"},{url:"css/Home-CQP9yr_H.css",revision:"752fe582406a05d5ab0d8b18922a82e7"},{url:"entry/index-DEbFzKSy.js",revision:"e5d743caca76ed51b558ca0d6a052870"},{url:"favicon.ico",revision:"89099cfae0775e3e086613bca3190493"},{url:"favicon.svg",revision:"71dcfd191507c31dc79efe3341dfa3b9"},{url:"index.html",revision:"93a05fea4fd8600fa197d7b4eb156ee0"},{url:"maskable-icon-512x512.png",revision:"126c55dc030a58db716758479c41c570"},{url:"pwa-192x192.png",revision:"14a23cc23a2f5a3157ac52e78135346c"},{url:"pwa-512x512.png",revision:"5a051418936d2f633fc164f78b1662e1"},{url:"pwa-64x64.png",revision:"3cce535eec4a1c5ce2a2c060fc6323ab"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"manifest.webmanifest",revision:"128832f3b76c7f9bd374f01497f8fa7a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

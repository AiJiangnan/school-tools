if(!self.define){let e,c={};const i=(i,n)=>(i=new URL(i+".js",n).href,c[i]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=c,document.head.appendChild(e)}else e=i,importScripts(i),c()})).then((()=>{let e=c[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(c[s])return;let a={};const f=e=>i(e,s),d={module:{uri:s},exports:a,require:f};c[s]=Promise.all(n.map((e=>d[e]||f(e)))).then((e=>(r(...e),a)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"1.png",revision:"0847f852cb2ecc2f9023cf7d81675da1"},{url:"2.png",revision:"73f5b4462dbd10e96980be0be19bfe4a"},{url:"3.png",revision:"810ae3035594c3b80a3e9b330b6e167c"},{url:"apple-touch-icon-180x180.png",revision:"10b5f88323fdad31bf50c90668d3e84a"},{url:"chunk/@ant-design-BZl7eYef.js",revision:"249acbacfa8ec534a4fd76d6d2256d8a"},{url:"chunk/@babel-BiFW4_mA.js",revision:"c5873049f2bd8d6645a0745f08ca1063"},{url:"chunk/@ctrl-DOFZgDuz.js",revision:"3560136a593388d744f3ec3390490de0"},{url:"chunk/@emotion-BtrR-yrm.js",revision:"2245a7d6907b32207d9d4662e891c1d9"},{url:"chunk/@vue-BC2K3yCp.js",revision:"d11bc685192ab8f1e33ef0fe73f035f6"},{url:"chunk/ant-design-vue-DPrabZFW.js",revision:"0e597fec214720aeb479c0e07b11cadb"},{url:"chunk/async-validator-DKvM95Vc.js",revision:"71d81aab391cb6139d1aaed538ee5fa2"},{url:"chunk/compute-scroll-into-view-1gs_hJI2.js",revision:"f0cd10c055af230d7bb85c6e5c5320c5"},{url:"chunk/copy-to-clipboard-gvHgSpPc.js",revision:"29b28c8c09e8a099c9be4de65e413ddb"},{url:"chunk/dayjs-DfUUTG6R.js",revision:"1cad1b78cfd66f84b8dde55ca0657370"},{url:"chunk/dom-align-CRCehRfe.js",revision:"a495881fdf92f31821ea350600e1d8b7"},{url:"chunk/Home-DGiiuak-.js",revision:"8e4ac29ff5fe672823dd997bc8e34691"},{url:"chunk/lodash-es-BdFaghAI.js",revision:"5df7c96d7826d3877491f8415ae2a63a"},{url:"chunk/NormalAnalyze-BUzobD7H.js",revision:"0766b3c5ca919d7325ecd9f11acfa40f"},{url:"chunk/PinYin-D4R7I2rv.js",revision:"e94a8c997c2767b1f18ec57612afd5b7"},{url:"chunk/pinyin-pro-CEBjnoJ7.js",revision:"7be20fff30232bbe3d13fb1559f1a95f"},{url:"chunk/resize-observer-polyfill-B1PUzC5B.js",revision:"5cc012c609879e25a2af3c27f3cb954f"},{url:"chunk/scroll-into-view-if-needed-SxpMpKWN.js",revision:"73e03ae58ccc9ff4720ee6aa93cc63f4"},{url:"chunk/stylis-DsJDcYJc.js",revision:"ab7b43b13a29be2901fd44115810f5af"},{url:"chunk/throttle-debounce-CUWDS_la.js",revision:"aa6224d3bb8766e035e02711f9966b9c"},{url:"chunk/toggle-selection-BHUZwh74.js",revision:"b48eb30a513c2653a987dccb8e5017db"},{url:"chunk/vue-l0sNRNKZ.js",revision:"68b329da9893e34099c7d8ad5cb9c940"},{url:"chunk/vue-router-BVajwUmn.js",revision:"404df157db2ffad1c181b93d60823cf4"},{url:"chunk/vue-types-C5fUfLeo.js",revision:"a34c986aeeaed25021125e00869bf3b0"},{url:"chunk/xlsx-DZ7xr1Uj.js",revision:"39f052d7b782509b419f6d46421a1158"},{url:"css/Home-CQP9yr_H.css",revision:"752fe582406a05d5ab0d8b18922a82e7"},{url:"entry/index-BnqBW3lg.js",revision:"e0751865f1e59411f4104c2f585db575"},{url:"favicon.ico",revision:"89099cfae0775e3e086613bca3190493"},{url:"favicon.svg",revision:"71dcfd191507c31dc79efe3341dfa3b9"},{url:"index.html",revision:"d82717ecedef01d4402550f10eee4be6"},{url:"maskable-icon-512x512.png",revision:"126c55dc030a58db716758479c41c570"},{url:"pwa-192x192.png",revision:"14a23cc23a2f5a3157ac52e78135346c"},{url:"pwa-512x512.png",revision:"5a051418936d2f633fc164f78b1662e1"},{url:"pwa-64x64.png",revision:"3cce535eec4a1c5ce2a2c060fc6323ab"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"manifest.webmanifest",revision:"128832f3b76c7f9bd374f01497f8fa7a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
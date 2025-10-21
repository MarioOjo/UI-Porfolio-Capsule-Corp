function Xi(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Bt={exports:{}},Ht={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var as;function Zi(){return as||(as=1,(function(t){function e(f,S){var E=f.length;f.push(S);e:for(;0<E;){var D=E-1>>>1,F=f[D];if(0<r(F,S))f[D]=S,f[E]=F,E=D;else break e}}function n(f){return f.length===0?null:f[0]}function s(f){if(f.length===0)return null;var S=f[0],E=f.pop();if(E!==S){f[0]=E;e:for(var D=0,F=f.length,ot=F>>>1;D<ot;){var ct=2*(D+1)-1,Vt=f[ct],de=ct+1,ut=f[de];if(0>r(Vt,E))de<F&&0>r(ut,Vt)?(f[D]=ut,f[de]=E,D=de):(f[D]=Vt,f[ct]=E,D=ct);else if(de<F&&0>r(ut,E))f[D]=ut,f[de]=E,D=de;else break e}}return S}function r(f,S){var E=f.sortIndex-S.sortIndex;return E!==0?E:f.id-S.id}if(t.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var i=performance;t.unstable_now=function(){return i.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var c=[],u=[],h=1,d=null,l=3,m=!1,g=!1,p=!1,_=!1,w=typeof setTimeout=="function"?setTimeout:null,R=typeof clearTimeout=="function"?clearTimeout:null,I=typeof setImmediate<"u"?setImmediate:null;function C(f){for(var S=n(u);S!==null;){if(S.callback===null)s(u);else if(S.startTime<=f)s(u),S.sortIndex=S.expirationTime,e(c,S);else break;S=n(u)}}function b(f){if(p=!1,C(f),!g)if(n(c)!==null)g=!0,P||(P=!0,Te());else{var S=n(u);S!==null&&Ut(b,S.startTime-f)}}var P=!1,A=-1,y=5,N=-1;function L(){return _?!0:!(t.unstable_now()-N<y)}function Q(){if(_=!1,P){var f=t.unstable_now();N=f;var S=!0;try{e:{g=!1,p&&(p=!1,R(A),A=-1),m=!0;var E=l;try{t:{for(C(f),d=n(c);d!==null&&!(d.expirationTime>f&&L());){var D=d.callback;if(typeof D=="function"){d.callback=null,l=d.priorityLevel;var F=D(d.expirationTime<=f);if(f=t.unstable_now(),typeof F=="function"){d.callback=F,C(f),S=!0;break t}d===n(c)&&s(c),C(f)}else s(c);d=n(c)}if(d!==null)S=!0;else{var ot=n(u);ot!==null&&Ut(b,ot.startTime-f),S=!1}}break e}finally{d=null,l=E,m=!1}S=void 0}}finally{S?Te():P=!1}}}var Te;if(typeof I=="function")Te=function(){I(Q)};else if(typeof MessageChannel<"u"){var is=new MessageChannel,Ji=is.port2;is.port1.onmessage=Q,Te=function(){Ji.postMessage(null)}}else Te=function(){w(Q,0)};function Ut(f,S){A=w(function(){f(t.unstable_now())},S)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(f){f.callback=null},t.unstable_forceFrameRate=function(f){0>f||125<f?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):y=0<f?Math.floor(1e3/f):5},t.unstable_getCurrentPriorityLevel=function(){return l},t.unstable_next=function(f){switch(l){case 1:case 2:case 3:var S=3;break;default:S=l}var E=l;l=S;try{return f()}finally{l=E}},t.unstable_requestPaint=function(){_=!0},t.unstable_runWithPriority=function(f,S){switch(f){case 1:case 2:case 3:case 4:case 5:break;default:f=3}var E=l;l=f;try{return S()}finally{l=E}},t.unstable_scheduleCallback=function(f,S,E){var D=t.unstable_now();switch(typeof E=="object"&&E!==null?(E=E.delay,E=typeof E=="number"&&0<E?D+E:D):E=D,f){case 1:var F=-1;break;case 2:F=250;break;case 5:F=1073741823;break;case 4:F=1e4;break;default:F=5e3}return F=E+F,f={id:h++,callback:S,priorityLevel:f,startTime:E,expirationTime:F,sortIndex:-1},E>D?(f.sortIndex=E,e(u,f),n(c)===null&&f===n(u)&&(p?(R(A),A=-1):p=!0,Ut(b,E-D))):(f.sortIndex=F,e(c,f),g||m||(g=!0,P||(P=!0,Te()))),f},t.unstable_shouldYield=L,t.unstable_wrapCallback=function(f){var S=l;return function(){var E=l;l=S;try{return f.apply(this,arguments)}finally{l=E}}}})(Ht)),Ht}var os;function dd(){return os||(os=1,Bt.exports=Zi()),Bt.exports}var Je=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},ea={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},ta=class{#e=ea;#t=!1;setTimeoutProvider(t){this.#e=t}setTimeout(t,e){return this.#e.setTimeout(t,e)}clearTimeout(t){this.#e.clearTimeout(t)}setInterval(t,e){return this.#e.setInterval(t,e)}clearInterval(t){this.#e.clearInterval(t)}},pe=new ta;function na(t){setTimeout(t,0)}var Re=typeof window>"u"||"Deno"in globalThis;function V(){}function sa(t,e){return typeof t=="function"?t(e):t}function sn(t){return typeof t=="number"&&t>=0&&t!==1/0}function mr(t,e){return Math.max(t+(e||0)-Date.now(),0)}function ae(t,e){return typeof t=="function"?t(e):t}function B(t,e){return typeof t=="function"?t(e):t}function cs(t,e){const{type:n="all",exact:s,fetchStatus:r,predicate:i,queryKey:a,stale:o}=t;if(a){if(s){if(e.queryHash!==kn(a,e.options))return!1}else if(!We(e.queryKey,a))return!1}if(n!=="all"){const c=e.isActive();if(n==="active"&&!c||n==="inactive"&&c)return!1}return!(typeof o=="boolean"&&e.isStale()!==o||r&&r!==e.state.fetchStatus||i&&!i(e))}function us(t,e){const{exact:n,status:s,predicate:r,mutationKey:i}=t;if(i){if(!e.options.mutationKey)return!1;if(n){if(je(e.options.mutationKey)!==je(i))return!1}else if(!We(e.options.mutationKey,i))return!1}return!(s&&e.state.status!==s||r&&!r(e))}function kn(t,e){return(e?.queryKeyHashFn||je)(t)}function je(t){return JSON.stringify(t,(e,n)=>an(n)?Object.keys(n).sort().reduce((s,r)=>(s[r]=n[r],s),{}):n)}function We(t,e){return t===e?!0:typeof t!=typeof e?!1:t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(e).every(n=>We(t[n],e[n])):!1}var ra=Object.prototype.hasOwnProperty;function gr(t,e){if(t===e)return t;const n=ls(t)&&ls(e);if(!n&&!(an(t)&&an(e)))return e;const r=(n?t:Object.keys(t)).length,i=n?e:Object.keys(e),a=i.length,o=n?new Array(a):{};let c=0;for(let u=0;u<a;u++){const h=n?u:i[u],d=t[h],l=e[h];if(d===l){o[h]=d,(n?u<r:ra.call(t,h))&&c++;continue}if(d===null||l===null||typeof d!="object"||typeof l!="object"){o[h]=l;continue}const m=gr(d,l);o[h]=m,m===d&&c++}return r===a&&c===r?t:o}function rn(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(t[n]!==e[n])return!1;return!0}function ls(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function an(t){if(!hs(t))return!1;const e=t.constructor;if(e===void 0)return!0;const n=e.prototype;return!(!hs(n)||!n.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(t)!==Object.prototype)}function hs(t){return Object.prototype.toString.call(t)==="[object Object]"}function ia(t){return new Promise(e=>{pe.setTimeout(e,t)})}function on(t,e,n){return typeof n.structuralSharing=="function"?n.structuralSharing(t,e):n.structuralSharing!==!1?gr(t,e):e}function aa(t,e,n=0){const s=[...t,e];return n&&s.length>n?s.slice(1):s}function oa(t,e,n=0){const s=[e,...t];return n&&s.length>n?s.slice(0,-1):s}var On=Symbol();function yr(t,e){return!t.queryFn&&e?.initialPromise?()=>e.initialPromise:!t.queryFn||t.queryFn===On?()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)):t.queryFn}function fd(t,e){return typeof t=="function"?t(...e):!!t}var ca=class extends Je{#e;#t;#n;constructor(){super(),this.#n=t=>{if(!Re&&window.addEventListener){const e=()=>t();return window.addEventListener("visibilitychange",e,!1),()=>{window.removeEventListener("visibilitychange",e)}}}}onSubscribe(){this.#t||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#t?.(),this.#t=void 0)}setEventListener(t){this.#n=t,this.#t?.(),this.#t=t(e=>{typeof e=="boolean"?this.setFocused(e):this.onFocus()})}setFocused(t){this.#e!==t&&(this.#e=t,this.onFocus())}onFocus(){const t=this.isFocused();this.listeners.forEach(e=>{e(t)})}isFocused(){return typeof this.#e=="boolean"?this.#e:globalThis.document?.visibilityState!=="hidden"}},Dn=new ca;function cn(){let t,e;const n=new Promise((r,i)=>{t=r,e=i});n.status="pending",n.catch(()=>{});function s(r){Object.assign(n,r),delete n.resolve,delete n.reject}return n.resolve=r=>{s({status:"fulfilled",value:r}),t(r)},n.reject=r=>{s({status:"rejected",reason:r}),e(r)},n}var ua=na;function la(){let t=[],e=0,n=o=>{o()},s=o=>{o()},r=ua;const i=o=>{e?t.push(o):r(()=>{n(o)})},a=()=>{const o=t;t=[],o.length&&r(()=>{s(()=>{o.forEach(c=>{n(c)})})})};return{batch:o=>{let c;e++;try{c=o()}finally{e--,e||a()}return c},batchCalls:o=>(...c)=>{i(()=>{o(...c)})},schedule:i,setNotifyFunction:o=>{n=o},setBatchNotifyFunction:o=>{s=o},setScheduler:o=>{r=o}}}var x=la(),ha=class extends Je{#e=!0;#t;#n;constructor(){super(),this.#n=t=>{if(!Re&&window.addEventListener){const e=()=>t(!0),n=()=>t(!1);return window.addEventListener("online",e,!1),window.addEventListener("offline",n,!1),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",n)}}}}onSubscribe(){this.#t||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#t?.(),this.#t=void 0)}setEventListener(t){this.#n=t,this.#t?.(),this.#t=t(this.setOnline.bind(this))}setOnline(t){this.#e!==t&&(this.#e=t,this.listeners.forEach(n=>{n(t)}))}isOnline(){return this.#e}},_t=new ha;function da(t){return Math.min(1e3*2**t,3e4)}function br(t){return(t??"online")==="online"?_t.isOnline():!0}var un=class extends Error{constructor(t){super("CancelledError"),this.revert=t?.revert,this.silent=t?.silent}};function vr(t){let e=!1,n=0,s;const r=cn(),i=()=>r.status!=="pending",a=p=>{if(!i()){const _=new un(p);l(_),t.onCancel?.(_)}},o=()=>{e=!0},c=()=>{e=!1},u=()=>Dn.isFocused()&&(t.networkMode==="always"||_t.isOnline())&&t.canRun(),h=()=>br(t.networkMode)&&t.canRun(),d=p=>{i()||(s?.(),r.resolve(p))},l=p=>{i()||(s?.(),r.reject(p))},m=()=>new Promise(p=>{s=_=>{(i()||u())&&p(_)},t.onPause?.()}).then(()=>{s=void 0,i()||t.onContinue?.()}),g=()=>{if(i())return;let p;const _=n===0?t.initialPromise:void 0;try{p=_??t.fn()}catch(w){p=Promise.reject(w)}Promise.resolve(p).then(d).catch(w=>{if(i())return;const R=t.retry??(Re?0:3),I=t.retryDelay??da,C=typeof I=="function"?I(n,w):I,b=R===!0||typeof R=="number"&&n<R||typeof R=="function"&&R(n,w);if(e||!b){l(w);return}n++,t.onFail?.(n,w),ia(C).then(()=>u()?void 0:m()).then(()=>{e?l(w):g()})})};return{promise:r,status:()=>r.status,cancel:a,continue:()=>(s?.(),r),cancelRetry:o,continueRetry:c,canStart:h,start:()=>(h()?g():m().then(g),r)}}var _r=class{#e;destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),sn(this.gcTime)&&(this.#e=pe.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(Re?1/0:300*1e3))}clearGcTimeout(){this.#e&&(pe.clearTimeout(this.#e),this.#e=void 0)}},fa=class extends _r{#e;#t;#n;#r;#s;#o;#a;constructor(t){super(),this.#a=!1,this.#o=t.defaultOptions,this.setOptions(t.options),this.observers=[],this.#r=t.client,this.#n=this.#r.getQueryCache(),this.queryKey=t.queryKey,this.queryHash=t.queryHash,this.#e=ds(this.options),this.state=t.state??this.#e,this.scheduleGc()}get meta(){return this.options.meta}get promise(){return this.#s?.promise}setOptions(t){if(this.options={...this.#o,...t},this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const e=ds(this.options);e.data!==void 0&&(this.setData(e.data,{updatedAt:e.dataUpdatedAt,manual:!0}),this.#e=e)}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&this.#n.remove(this)}setData(t,e){const n=on(this.state.data,t,this.options);return this.#i({data:n,type:"success",dataUpdatedAt:e?.updatedAt,manual:e?.manual}),n}setState(t,e){this.#i({type:"setState",state:t,setStateOptions:e})}cancel(t){const e=this.#s?.promise;return this.#s?.cancel(t),e?e.then(V).catch(V):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(this.#e)}isActive(){return this.observers.some(t=>B(t.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===On||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(t=>ae(t.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(t=>t.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(t=0){return this.state.data===void 0?!0:t==="static"?!1:this.state.isInvalidated?!0:!mr(this.state.dataUpdatedAt,t)}onFocus(){this.observers.find(e=>e.shouldFetchOnWindowFocus())?.refetch({cancelRefetch:!1}),this.#s?.continue()}onOnline(){this.observers.find(e=>e.shouldFetchOnReconnect())?.refetch({cancelRefetch:!1}),this.#s?.continue()}addObserver(t){this.observers.includes(t)||(this.observers.push(t),this.clearGcTimeout(),this.#n.notify({type:"observerAdded",query:this,observer:t}))}removeObserver(t){this.observers.includes(t)&&(this.observers=this.observers.filter(e=>e!==t),this.observers.length||(this.#s&&(this.#a?this.#s.cancel({revert:!0}):this.#s.cancelRetry()),this.scheduleGc()),this.#n.notify({type:"observerRemoved",query:this,observer:t}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||this.#i({type:"invalidate"})}async fetch(t,e){if(this.state.fetchStatus!=="idle"&&this.#s?.status()!=="rejected"){if(this.state.data!==void 0&&e?.cancelRefetch)this.cancel({silent:!0});else if(this.#s)return this.#s.continueRetry(),this.#s.promise}if(t&&this.setOptions(t),!this.options.queryFn){const o=this.observers.find(c=>c.options.queryFn);o&&this.setOptions(o.options)}const n=new AbortController,s=o=>{Object.defineProperty(o,"signal",{enumerable:!0,get:()=>(this.#a=!0,n.signal)})},r=()=>{const o=yr(this.options,e),u=(()=>{const h={client:this.#r,queryKey:this.queryKey,meta:this.meta};return s(h),h})();return this.#a=!1,this.options.persister?this.options.persister(o,u,this):o(u)},a=(()=>{const o={fetchOptions:e,options:this.options,queryKey:this.queryKey,client:this.#r,state:this.state,fetchFn:r};return s(o),o})();this.options.behavior?.onFetch(a,this),this.#t=this.state,(this.state.fetchStatus==="idle"||this.state.fetchMeta!==a.fetchOptions?.meta)&&this.#i({type:"fetch",meta:a.fetchOptions?.meta}),this.#s=vr({initialPromise:e?.initialPromise,fn:a.fetchFn,onCancel:o=>{o instanceof un&&o.revert&&this.setState({...this.#t,fetchStatus:"idle"}),n.abort()},onFail:(o,c)=>{this.#i({type:"failed",failureCount:o,error:c})},onPause:()=>{this.#i({type:"pause"})},onContinue:()=>{this.#i({type:"continue"})},retry:a.options.retry,retryDelay:a.options.retryDelay,networkMode:a.options.networkMode,canRun:()=>!0});try{const o=await this.#s.start();if(o===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(o),this.#n.config.onSuccess?.(o,this),this.#n.config.onSettled?.(o,this.state.error,this),o}catch(o){if(o instanceof un){if(o.silent)return this.#s.promise;if(o.revert){if(this.state.data===void 0)throw o;return this.state.data}}throw this.#i({type:"error",error:o}),this.#n.config.onError?.(o,this),this.#n.config.onSettled?.(this.state.data,o,this),o}finally{this.scheduleGc()}}#i(t){const e=n=>{switch(t.type){case"failed":return{...n,fetchFailureCount:t.failureCount,fetchFailureReason:t.error};case"pause":return{...n,fetchStatus:"paused"};case"continue":return{...n,fetchStatus:"fetching"};case"fetch":return{...n,...wr(n.data,this.options),fetchMeta:t.meta??null};case"success":const s={...n,data:t.data,dataUpdateCount:n.dataUpdateCount+1,dataUpdatedAt:t.dataUpdatedAt??Date.now(),error:null,isInvalidated:!1,status:"success",...!t.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return this.#t=t.manual?s:void 0,s;case"error":const r=t.error;return{...n,error:r,errorUpdateCount:n.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:n.fetchFailureCount+1,fetchFailureReason:r,fetchStatus:"idle",status:"error"};case"invalidate":return{...n,isInvalidated:!0};case"setState":return{...n,...t.state}}};this.state=e(this.state),x.batch(()=>{this.observers.forEach(n=>{n.onQueryUpdate()}),this.#n.notify({query:this,type:"updated",action:t})})}};function wr(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:br(e.networkMode)?"fetching":"paused",...t===void 0&&{error:null,status:"pending"}}}function ds(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,n=e!==void 0,s=n?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:n?s??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:n?"success":"pending",fetchStatus:"idle"}}var pd=class extends Je{constructor(t,e){super(),this.options=e,this.#e=t,this.#i=null,this.#a=cn(),this.bindMethods(),this.setOptions(e)}#e;#t=void 0;#n=void 0;#r=void 0;#s;#o;#a;#i;#m;#d;#f;#u;#l;#c;#p=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(this.#t.addObserver(this),fs(this.#t,this.options)?this.#h():this.updateResult(),this.#v())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return ln(this.#t,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return ln(this.#t,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#_(),this.#w(),this.#t.removeObserver(this)}setOptions(t){const e=this.options,n=this.#t;if(this.options=this.#e.defaultQueryOptions(t),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof B(this.options.enabled,this.#t)!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#T(),this.#t.setOptions(this.options),e._defaulted&&!rn(this.options,e)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#t,observer:this});const s=this.hasListeners();s&&ps(this.#t,n,this.options,e)&&this.#h(),this.updateResult(),s&&(this.#t!==n||B(this.options.enabled,this.#t)!==B(e.enabled,this.#t)||ae(this.options.staleTime,this.#t)!==ae(e.staleTime,this.#t))&&this.#g();const r=this.#y();s&&(this.#t!==n||B(this.options.enabled,this.#t)!==B(e.enabled,this.#t)||r!==this.#c)&&this.#b(r)}getOptimisticResult(t){const e=this.#e.getQueryCache().build(this.#e,t),n=this.createResult(e,t);return ma(this,n)&&(this.#r=n,this.#o=this.options,this.#s=this.#t.state),n}getCurrentResult(){return this.#r}trackResult(t,e){return new Proxy(t,{get:(n,s)=>(this.trackProp(s),e?.(s),s==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&this.#a.status==="pending"&&this.#a.reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(n,s))})}trackProp(t){this.#p.add(t)}getCurrentQuery(){return this.#t}refetch({...t}={}){return this.fetch({...t})}fetchOptimistic(t){const e=this.#e.defaultQueryOptions(t),n=this.#e.getQueryCache().build(this.#e,e);return n.fetch().then(()=>this.createResult(n,e))}fetch(t){return this.#h({...t,cancelRefetch:t.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#r))}#h(t){this.#T();let e=this.#t.fetch(this.options,t);return t?.throwOnError||(e=e.catch(V)),e}#g(){this.#_();const t=ae(this.options.staleTime,this.#t);if(Re||this.#r.isStale||!sn(t))return;const n=mr(this.#r.dataUpdatedAt,t)+1;this.#u=pe.setTimeout(()=>{this.#r.isStale||this.updateResult()},n)}#y(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(this.#t):this.options.refetchInterval)??!1}#b(t){this.#w(),this.#c=t,!(Re||B(this.options.enabled,this.#t)===!1||!sn(this.#c)||this.#c===0)&&(this.#l=pe.setInterval(()=>{(this.options.refetchIntervalInBackground||Dn.isFocused())&&this.#h()},this.#c))}#v(){this.#g(),this.#b(this.#y())}#_(){this.#u&&(pe.clearTimeout(this.#u),this.#u=void 0)}#w(){this.#l&&(pe.clearInterval(this.#l),this.#l=void 0)}createResult(t,e){const n=this.#t,s=this.options,r=this.#r,i=this.#s,a=this.#o,c=t!==n?t.state:this.#n,{state:u}=t;let h={...u},d=!1,l;if(e._optimisticResults){const y=this.hasListeners(),N=!y&&fs(t,e),L=y&&ps(t,n,e,s);(N||L)&&(h={...h,...wr(u.data,t.options)}),e._optimisticResults==="isRestoring"&&(h.fetchStatus="idle")}let{error:m,errorUpdatedAt:g,status:p}=h;l=h.data;let _=!1;if(e.placeholderData!==void 0&&l===void 0&&p==="pending"){let y;r?.isPlaceholderData&&e.placeholderData===a?.placeholderData?(y=r.data,_=!0):y=typeof e.placeholderData=="function"?e.placeholderData(this.#f?.state.data,this.#f):e.placeholderData,y!==void 0&&(p="success",l=on(r?.data,y,e),d=!0)}if(e.select&&l!==void 0&&!_)if(r&&l===i?.data&&e.select===this.#m)l=this.#d;else try{this.#m=e.select,l=e.select(l),l=on(r?.data,l,e),this.#d=l,this.#i=null}catch(y){this.#i=y}this.#i&&(m=this.#i,l=this.#d,g=Date.now(),p="error");const w=h.fetchStatus==="fetching",R=p==="pending",I=p==="error",C=R&&w,b=l!==void 0,A={status:p,fetchStatus:h.fetchStatus,isPending:R,isSuccess:p==="success",isError:I,isInitialLoading:C,isLoading:C,data:l,dataUpdatedAt:h.dataUpdatedAt,error:m,errorUpdatedAt:g,failureCount:h.fetchFailureCount,failureReason:h.fetchFailureReason,errorUpdateCount:h.errorUpdateCount,isFetched:h.dataUpdateCount>0||h.errorUpdateCount>0,isFetchedAfterMount:h.dataUpdateCount>c.dataUpdateCount||h.errorUpdateCount>c.errorUpdateCount,isFetching:w,isRefetching:w&&!R,isLoadingError:I&&!b,isPaused:h.fetchStatus==="paused",isPlaceholderData:d,isRefetchError:I&&b,isStale:Mn(t,e),refetch:this.refetch,promise:this.#a,isEnabled:B(e.enabled,t)!==!1};if(this.options.experimental_prefetchInRender){const y=Q=>{A.status==="error"?Q.reject(A.error):A.data!==void 0&&Q.resolve(A.data)},N=()=>{const Q=this.#a=A.promise=cn();y(Q)},L=this.#a;switch(L.status){case"pending":t.queryHash===n.queryHash&&y(L);break;case"fulfilled":(A.status==="error"||A.data!==L.value)&&N();break;case"rejected":(A.status!=="error"||A.error!==L.reason)&&N();break}}return A}updateResult(){const t=this.#r,e=this.createResult(this.#t,this.options);if(this.#s=this.#t.state,this.#o=this.options,this.#s.data!==void 0&&(this.#f=this.#t),rn(e,t))return;this.#r=e;const n=()=>{if(!t)return!0;const{notifyOnChangeProps:s}=this.options,r=typeof s=="function"?s():s;if(r==="all"||!r&&!this.#p.size)return!0;const i=new Set(r??this.#p);return this.options.throwOnError&&i.add("error"),Object.keys(this.#r).some(a=>{const o=a;return this.#r[o]!==t[o]&&i.has(o)})};this.#I({listeners:n()})}#T(){const t=this.#e.getQueryCache().build(this.#e,this.options);if(t===this.#t)return;const e=this.#t;this.#t=t,this.#n=t.state,this.hasListeners()&&(e?.removeObserver(this),t.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#v()}#I(t){x.batch(()=>{t.listeners&&this.listeners.forEach(e=>{e(this.#r)}),this.#e.getQueryCache().notify({query:this.#t,type:"observerResultsUpdated"})})}};function pa(t,e){return B(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function fs(t,e){return pa(t,e)||t.state.data!==void 0&&ln(t,e,e.refetchOnMount)}function ln(t,e,n){if(B(e.enabled,t)!==!1&&ae(e.staleTime,t)!=="static"){const s=typeof n=="function"?n(t):n;return s==="always"||s!==!1&&Mn(t,e)}return!1}function ps(t,e,n,s){return(t!==e||B(s.enabled,t)===!1)&&(!n.suspense||t.state.status!=="error")&&Mn(t,n)}function Mn(t,e){return B(e.enabled,t)!==!1&&t.isStaleByTime(ae(e.staleTime,t))}function ma(t,e){return!rn(t.getCurrentResult(),e)}function ms(t){return{onFetch:(e,n)=>{const s=e.options,r=e.fetchOptions?.meta?.fetchMore?.direction,i=e.state.data?.pages||[],a=e.state.data?.pageParams||[];let o={pages:[],pageParams:[]},c=0;const u=async()=>{let h=!1;const d=g=>{Object.defineProperty(g,"signal",{enumerable:!0,get:()=>(e.signal.aborted?h=!0:e.signal.addEventListener("abort",()=>{h=!0}),e.signal)})},l=yr(e.options,e.fetchOptions),m=async(g,p,_)=>{if(h)return Promise.reject();if(p==null&&g.pages.length)return Promise.resolve(g);const R=(()=>{const P={client:e.client,queryKey:e.queryKey,pageParam:p,direction:_?"backward":"forward",meta:e.options.meta};return d(P),P})(),I=await l(R),{maxPages:C}=e.options,b=_?oa:aa;return{pages:b(g.pages,I,C),pageParams:b(g.pageParams,p,C)}};if(r&&i.length){const g=r==="backward",p=g?ga:gs,_={pages:i,pageParams:a},w=p(s,_);o=await m(_,w,g)}else{const g=t??i.length;do{const p=c===0?a[0]??s.initialPageParam:gs(s,o);if(c>0&&p==null)break;o=await m(o,p),c++}while(c<g)}return o};e.options.persister?e.fetchFn=()=>e.options.persister?.(u,{client:e.client,queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},n):e.fetchFn=u}}}function gs(t,{pages:e,pageParams:n}){const s=e.length-1;return e.length>0?t.getNextPageParam(e[s],e,n[s],n):void 0}function ga(t,{pages:e,pageParams:n}){return e.length>0?t.getPreviousPageParam?.(e[0],e,n[0],n):void 0}var ya=class extends _r{#e;#t;#n;#r;constructor(t){super(),this.#e=t.client,this.mutationId=t.mutationId,this.#n=t.mutationCache,this.#t=[],this.state=t.state||ba(),this.setOptions(t.options),this.scheduleGc()}setOptions(t){this.options=t,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(t){this.#t.includes(t)||(this.#t.push(t),this.clearGcTimeout(),this.#n.notify({type:"observerAdded",mutation:this,observer:t}))}removeObserver(t){this.#t=this.#t.filter(e=>e!==t),this.scheduleGc(),this.#n.notify({type:"observerRemoved",mutation:this,observer:t})}optionalRemove(){this.#t.length||(this.state.status==="pending"?this.scheduleGc():this.#n.remove(this))}continue(){return this.#r?.continue()??this.execute(this.state.variables)}async execute(t){const e=()=>{this.#s({type:"continue"})},n={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};this.#r=vr({fn:()=>this.options.mutationFn?this.options.mutationFn(t,n):Promise.reject(new Error("No mutationFn found")),onFail:(i,a)=>{this.#s({type:"failed",failureCount:i,error:a})},onPause:()=>{this.#s({type:"pause"})},onContinue:e,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>this.#n.canRun(this)});const s=this.state.status==="pending",r=!this.#r.canStart();try{if(s)e();else{this.#s({type:"pending",variables:t,isPaused:r}),await this.#n.config.onMutate?.(t,this,n);const a=await this.options.onMutate?.(t,n);a!==this.state.context&&this.#s({type:"pending",context:a,variables:t,isPaused:r})}const i=await this.#r.start();return await this.#n.config.onSuccess?.(i,t,this.state.context,this,n),await this.options.onSuccess?.(i,t,this.state.context,n),await this.#n.config.onSettled?.(i,null,this.state.variables,this.state.context,this,n),await this.options.onSettled?.(i,null,t,this.state.context,n),this.#s({type:"success",data:i}),i}catch(i){try{throw await this.#n.config.onError?.(i,t,this.state.context,this,n),await this.options.onError?.(i,t,this.state.context,n),await this.#n.config.onSettled?.(void 0,i,this.state.variables,this.state.context,this,n),await this.options.onSettled?.(void 0,i,t,this.state.context,n),i}finally{this.#s({type:"error",error:i})}}finally{this.#n.runNext(this)}}#s(t){const e=n=>{switch(t.type){case"failed":return{...n,failureCount:t.failureCount,failureReason:t.error};case"pause":return{...n,isPaused:!0};case"continue":return{...n,isPaused:!1};case"pending":return{...n,context:t.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:t.isPaused,status:"pending",variables:t.variables,submittedAt:Date.now()};case"success":return{...n,data:t.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...n,data:void 0,error:t.error,failureCount:n.failureCount+1,failureReason:t.error,isPaused:!1,status:"error"}}};this.state=e(this.state),x.batch(()=>{this.#t.forEach(n=>{n.onMutationUpdate(t)}),this.#n.notify({mutation:this,type:"updated",action:t})})}};function ba(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}var va=class extends Je{constructor(t={}){super(),this.config=t,this.#e=new Set,this.#t=new Map,this.#n=0}#e;#t;#n;build(t,e,n){const s=new ya({client:t,mutationCache:this,mutationId:++this.#n,options:t.defaultMutationOptions(e),state:n});return this.add(s),s}add(t){this.#e.add(t);const e=lt(t);if(typeof e=="string"){const n=this.#t.get(e);n?n.push(t):this.#t.set(e,[t])}this.notify({type:"added",mutation:t})}remove(t){if(this.#e.delete(t)){const e=lt(t);if(typeof e=="string"){const n=this.#t.get(e);if(n)if(n.length>1){const s=n.indexOf(t);s!==-1&&n.splice(s,1)}else n[0]===t&&this.#t.delete(e)}}this.notify({type:"removed",mutation:t})}canRun(t){const e=lt(t);if(typeof e=="string"){const s=this.#t.get(e)?.find(r=>r.state.status==="pending");return!s||s===t}else return!0}runNext(t){const e=lt(t);return typeof e=="string"?this.#t.get(e)?.find(s=>s!==t&&s.state.isPaused)?.continue()??Promise.resolve():Promise.resolve()}clear(){x.batch(()=>{this.#e.forEach(t=>{this.notify({type:"removed",mutation:t})}),this.#e.clear(),this.#t.clear()})}getAll(){return Array.from(this.#e)}find(t){const e={exact:!0,...t};return this.getAll().find(n=>us(e,n))}findAll(t={}){return this.getAll().filter(e=>us(t,e))}notify(t){x.batch(()=>{this.listeners.forEach(e=>{e(t)})})}resumePausedMutations(){const t=this.getAll().filter(e=>e.state.isPaused);return x.batch(()=>Promise.all(t.map(e=>e.continue().catch(V))))}};function lt(t){return t.options.scope?.id}var _a=class extends Je{constructor(t={}){super(),this.config=t,this.#e=new Map}#e;build(t,e,n){const s=e.queryKey,r=e.queryHash??kn(s,e);let i=this.get(r);return i||(i=new fa({client:t,queryKey:s,queryHash:r,options:t.defaultQueryOptions(e),state:n,defaultOptions:t.getQueryDefaults(s)}),this.add(i)),i}add(t){this.#e.has(t.queryHash)||(this.#e.set(t.queryHash,t),this.notify({type:"added",query:t}))}remove(t){const e=this.#e.get(t.queryHash);e&&(t.destroy(),e===t&&this.#e.delete(t.queryHash),this.notify({type:"removed",query:t}))}clear(){x.batch(()=>{this.getAll().forEach(t=>{this.remove(t)})})}get(t){return this.#e.get(t)}getAll(){return[...this.#e.values()]}find(t){const e={exact:!0,...t};return this.getAll().find(n=>cs(e,n))}findAll(t={}){const e=this.getAll();return Object.keys(t).length>0?e.filter(n=>cs(t,n)):e}notify(t){x.batch(()=>{this.listeners.forEach(e=>{e(t)})})}onFocus(){x.batch(()=>{this.getAll().forEach(t=>{t.onFocus()})})}onOnline(){x.batch(()=>{this.getAll().forEach(t=>{t.onOnline()})})}},md=class{#e;#t;#n;#r;#s;#o;#a;#i;constructor(t={}){this.#e=t.queryCache||new _a,this.#t=t.mutationCache||new va,this.#n=t.defaultOptions||{},this.#r=new Map,this.#s=new Map,this.#o=0}mount(){this.#o++,this.#o===1&&(this.#a=Dn.subscribe(async t=>{t&&(await this.resumePausedMutations(),this.#e.onFocus())}),this.#i=_t.subscribe(async t=>{t&&(await this.resumePausedMutations(),this.#e.onOnline())}))}unmount(){this.#o--,this.#o===0&&(this.#a?.(),this.#a=void 0,this.#i?.(),this.#i=void 0)}isFetching(t){return this.#e.findAll({...t,fetchStatus:"fetching"}).length}isMutating(t){return this.#t.findAll({...t,status:"pending"}).length}getQueryData(t){const e=this.defaultQueryOptions({queryKey:t});return this.#e.get(e.queryHash)?.state.data}ensureQueryData(t){const e=this.defaultQueryOptions(t),n=this.#e.build(this,e),s=n.state.data;return s===void 0?this.fetchQuery(t):(t.revalidateIfStale&&n.isStaleByTime(ae(e.staleTime,n))&&this.prefetchQuery(e),Promise.resolve(s))}getQueriesData(t){return this.#e.findAll(t).map(({queryKey:e,state:n})=>{const s=n.data;return[e,s]})}setQueryData(t,e,n){const s=this.defaultQueryOptions({queryKey:t}),i=this.#e.get(s.queryHash)?.state.data,a=sa(e,i);if(a!==void 0)return this.#e.build(this,s).setData(a,{...n,manual:!0})}setQueriesData(t,e,n){return x.batch(()=>this.#e.findAll(t).map(({queryKey:s})=>[s,this.setQueryData(s,e,n)]))}getQueryState(t){const e=this.defaultQueryOptions({queryKey:t});return this.#e.get(e.queryHash)?.state}removeQueries(t){const e=this.#e;x.batch(()=>{e.findAll(t).forEach(n=>{e.remove(n)})})}resetQueries(t,e){const n=this.#e;return x.batch(()=>(n.findAll(t).forEach(s=>{s.reset()}),this.refetchQueries({type:"active",...t},e)))}cancelQueries(t,e={}){const n={revert:!0,...e},s=x.batch(()=>this.#e.findAll(t).map(r=>r.cancel(n)));return Promise.all(s).then(V).catch(V)}invalidateQueries(t,e={}){return x.batch(()=>(this.#e.findAll(t).forEach(n=>{n.invalidate()}),t?.refetchType==="none"?Promise.resolve():this.refetchQueries({...t,type:t?.refetchType??t?.type??"active"},e)))}refetchQueries(t,e={}){const n={...e,cancelRefetch:e.cancelRefetch??!0},s=x.batch(()=>this.#e.findAll(t).filter(r=>!r.isDisabled()&&!r.isStatic()).map(r=>{let i=r.fetch(void 0,n);return n.throwOnError||(i=i.catch(V)),r.state.fetchStatus==="paused"?Promise.resolve():i}));return Promise.all(s).then(V)}fetchQuery(t){const e=this.defaultQueryOptions(t);e.retry===void 0&&(e.retry=!1);const n=this.#e.build(this,e);return n.isStaleByTime(ae(e.staleTime,n))?n.fetch(e):Promise.resolve(n.state.data)}prefetchQuery(t){return this.fetchQuery(t).then(V).catch(V)}fetchInfiniteQuery(t){return t.behavior=ms(t.pages),this.fetchQuery(t)}prefetchInfiniteQuery(t){return this.fetchInfiniteQuery(t).then(V).catch(V)}ensureInfiniteQueryData(t){return t.behavior=ms(t.pages),this.ensureQueryData(t)}resumePausedMutations(){return _t.isOnline()?this.#t.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#e}getMutationCache(){return this.#t}getDefaultOptions(){return this.#n}setDefaultOptions(t){this.#n=t}setQueryDefaults(t,e){this.#r.set(je(t),{queryKey:t,defaultOptions:e})}getQueryDefaults(t){const e=[...this.#r.values()],n={};return e.forEach(s=>{We(t,s.queryKey)&&Object.assign(n,s.defaultOptions)}),n}setMutationDefaults(t,e){this.#s.set(je(t),{mutationKey:t,defaultOptions:e})}getMutationDefaults(t){const e=[...this.#s.values()],n={};return e.forEach(s=>{We(t,s.mutationKey)&&Object.assign(n,s.defaultOptions)}),n}defaultQueryOptions(t){if(t._defaulted)return t;const e={...this.#n.queries,...this.getQueryDefaults(t.queryKey),...t,_defaulted:!0};return e.queryHash||(e.queryHash=kn(e.queryKey,e)),e.refetchOnReconnect===void 0&&(e.refetchOnReconnect=e.networkMode!=="always"),e.throwOnError===void 0&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.queryFn===On&&(e.enabled=!1),e}defaultMutationOptions(t){return t?._defaulted?t:{...this.#n.mutations,...t?.mutationKey&&this.getMutationDefaults(t.mutationKey),...t,_defaulted:!0}}clear(){this.#e.clear(),this.#t.clear()}};const wa="modulepreload",Ta=function(t){return"/"+t},ys={},gd=function(e,n,s){let r=Promise.resolve();if(n&&n.length>0){let c=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=a?.nonce||a?.getAttribute("nonce");r=c(n.map(u=>{if(u=Ta(u),u in ys)return;ys[u]=!0;const h=u.endsWith(".css"),d=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const l=document.createElement("link");if(l.rel=h?"stylesheet":wa,h||(l.as="script"),l.crossOrigin="",l.href=u,o&&l.setAttribute("nonce",o),document.head.appendChild(l),h)return new Promise((m,g)=>{l.addEventListener("load",m),l.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&i(o.reason);return e().catch(i)})},Ia=()=>{};var bs={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tr=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},Ea=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],a=t[n++],o=t[n++],c=((r&7)<<18|(i&63)<<12|(a&63)<<6|o&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const i=t[n++],a=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Ir={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],a=r+1<t.length,o=a?t[r+1]:0,c=r+2<t.length,u=c?t[r+2]:0,h=i>>2,d=(i&3)<<4|o>>4;let l=(o&15)<<2|u>>6,m=u&63;c||(m=64,a||(l=64)),s.push(n[h],n[d],n[l],n[m])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Tr(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Ea(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],o=r<t.length?n[t.charAt(r)]:0;++r;const u=r<t.length?n[t.charAt(r)]:64;++r;const d=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||o==null||u==null||d==null)throw new Sa;const l=i<<2|o>>4;if(s.push(l),u!==64){const m=o<<4&240|u>>2;if(s.push(m),d!==64){const g=u<<6&192|d;s.push(g)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Sa extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ca=function(t){const e=Tr(t);return Ir.encodeByteArray(e,!0)},Er=function(t){return Ca(t).replace(/\./g,"")},Sr=function(t){try{return Ir.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pa=()=>Aa().__FIREBASE_DEFAULTS__,Ra=()=>{if(typeof process>"u"||typeof bs>"u")return;const t=bs.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ka=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Sr(t[1]);return e&&JSON.parse(e)},Nn=()=>{try{return Ia()||Pa()||Ra()||ka()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Oa=t=>Nn()?.emulatorHosts?.[t],Cr=()=>Nn()?.config,Ar=t=>Nn()?.[`_${t}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Da{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ma(t){return(await fetch(t,{credentials:"include"})).ok}const Ve={};function Na(){const t={prod:[],emulator:[]};for(const e of Object.keys(Ve))Ve[e]?t.emulator.push(e):t.prod.push(e);return t}function La(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let vs=!1;function Fa(t,e){if(typeof window>"u"||typeof document>"u"||!Mt(window.location.host)||Ve[t]===e||Ve[t]||vs)return;Ve[t]=e;function n(l){return`__firebase__banner__${l}`}const s="__firebase__banner",i=Na().prod.length>0;function a(){const l=document.getElementById(s);l&&l.remove()}function o(l){l.style.display="flex",l.style.background="#7faaf0",l.style.position="fixed",l.style.bottom="5px",l.style.left="5px",l.style.padding=".5em",l.style.borderRadius="5px",l.style.alignItems="center"}function c(l,m){l.setAttribute("width","24"),l.setAttribute("id",m),l.setAttribute("height","24"),l.setAttribute("viewBox","0 0 24 24"),l.setAttribute("fill","none"),l.style.marginLeft="-6px"}function u(){const l=document.createElement("span");return l.style.cursor="pointer",l.style.marginLeft="16px",l.style.fontSize="24px",l.innerHTML=" &times;",l.onclick=()=>{vs=!0,a()},l}function h(l,m){l.setAttribute("id",m),l.innerText="Learn more",l.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",l.setAttribute("target","__blank"),l.style.paddingLeft="5px",l.style.textDecoration="underline"}function d(){const l=La(s),m=n("text"),g=document.getElementById(m)||document.createElement("span"),p=n("learnmore"),_=document.getElementById(p)||document.createElement("a"),w=n("preprendIcon"),R=document.getElementById(w)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(l.created){const I=l.element;o(I),h(_,p);const C=u();c(R,w),I.append(R,g,_,C),document.body.appendChild(I)}i?(g.innerText="Preview backend disconnected.",R.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(R.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,g.innerText="Preview backend running in this workspace."),g.setAttribute("id",m)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",d):d()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function xa(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(U())}function Ua(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Va(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Ba(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ha(){const t=U();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function $a(){try{return typeof indexedDB=="object"}catch{return!1}}function ja(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{e(r.error?.message||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wa="FirebaseError";class le extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Wa,Object.setPrototypeOf(this,le.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Xe.prototype.create)}}class Xe{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?Ka(i,s):"Error",o=`${this.serviceName}: ${a} (${r}).`;return new le(r,o,s)}}function Ka(t,e){return t.replace(qa,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const qa=/\{\$([^}]+)}/g;function za(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ke(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],a=e[r];if(_s(i)&&_s(a)){if(!ke(i,a))return!1}else if(i!==a)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function _s(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ze(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Ga(t,e){const n=new Qa(t,e);return n.subscribe.bind(n)}class Qa{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");Ya(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=$t),r.error===void 0&&(r.error=$t),r.complete===void 0&&(r.complete=$t);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ya(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function $t(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(t){return t&&t._delegate?t._delegate:t}class Oe{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fe="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ja{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new Da;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e?.identifier),s=e?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Za(e))try{this.getOrInitializeService({instanceIdentifier:fe})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=fe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=fe){return this.instances.has(e)}getOptions(e=fe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(i);s===o&&a.resolve(r)}return r}onInit(e,n){const s=this.normalizeInstanceIdentifier(n),r=this.onInitCallbacks.get(s)??new Set;r.add(e),this.onInitCallbacks.set(s,r);const i=this.instances.get(s);return i&&e(i,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Xa(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=fe){return this.component?this.component.multipleInstances?e:fe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Xa(t){return t===fe?void 0:t}function Za(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ja(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var k;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(k||(k={}));const to={debug:k.DEBUG,verbose:k.VERBOSE,info:k.INFO,warn:k.WARN,error:k.ERROR,silent:k.SILENT},no=k.INFO,so={[k.DEBUG]:"log",[k.VERBOSE]:"log",[k.INFO]:"info",[k.WARN]:"warn",[k.ERROR]:"error"},ro=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=so[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Pr{constructor(e){this.name=e,this._logLevel=no,this._logHandler=ro,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in k))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?to[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,k.DEBUG,...e),this._logHandler(this,k.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,k.VERBOSE,...e),this._logHandler(this,k.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,k.INFO,...e),this._logHandler(this,k.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,k.WARN,...e),this._logHandler(this,k.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,k.ERROR,...e),this._logHandler(this,k.ERROR,...e)}}const io=(t,e)=>e.some(n=>t instanceof n);let ws,Ts;function ao(){return ws||(ws=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function oo(){return Ts||(Ts=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Rr=new WeakMap,hn=new WeakMap,kr=new WeakMap,jt=new WeakMap,Ln=new WeakMap;function co(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",a)},i=()=>{n(oe(t.result)),r()},a=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Rr.set(n,t)}).catch(()=>{}),Ln.set(e,t),e}function uo(t){if(hn.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",a),t.removeEventListener("abort",a)},i=()=>{n(),r()},a=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",a),t.addEventListener("abort",a)});hn.set(t,e)}let dn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return hn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||kr.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return oe(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function lo(t){dn=t(dn)}function ho(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Wt(this),e,...n);return kr.set(s,e.sort?e.sort():[e]),oe(s)}:oo().includes(t)?function(...e){return t.apply(Wt(this),e),oe(Rr.get(this))}:function(...e){return oe(t.apply(Wt(this),e))}}function fo(t){return typeof t=="function"?ho(t):(t instanceof IDBTransaction&&uo(t),io(t,ao())?new Proxy(t,dn):t)}function oe(t){if(t instanceof IDBRequest)return co(t);if(jt.has(t))return jt.get(t);const e=fo(t);return e!==t&&(jt.set(t,e),Ln.set(e,t)),e}const Wt=t=>Ln.get(t);function po(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const a=indexedDB.open(t,e),o=oe(a);return s&&a.addEventListener("upgradeneeded",c=>{s(oe(a.result),c.oldVersion,c.newVersion,oe(a.transaction),c)}),n&&a.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),o.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),o}const mo=["get","getKey","getAll","getAllKeys","count"],go=["put","add","delete","clear"],Kt=new Map;function Is(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Kt.get(e))return Kt.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=go.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||mo.includes(n)))return;const i=async function(a,...o){const c=this.transaction(a,r?"readwrite":"readonly");let u=c.store;return s&&(u=u.index(o.shift())),(await Promise.all([u[n](...o),r&&c.done]))[0]};return Kt.set(e,i),i}lo(t=>({...t,get:(e,n,s)=>Is(e,n)||t.get(e,n,s),has:(e,n)=>!!Is(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(bo(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function bo(t){return t.getComponent()?.type==="VERSION"}const fn="@firebase/app",Es="0.14.4";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X=new Pr("@firebase/app"),vo="@firebase/app-compat",_o="@firebase/analytics-compat",wo="@firebase/analytics",To="@firebase/app-check-compat",Io="@firebase/app-check",Eo="@firebase/auth",So="@firebase/auth-compat",Co="@firebase/database",Ao="@firebase/data-connect",Po="@firebase/database-compat",Ro="@firebase/functions",ko="@firebase/functions-compat",Oo="@firebase/installations",Do="@firebase/installations-compat",Mo="@firebase/messaging",No="@firebase/messaging-compat",Lo="@firebase/performance",Fo="@firebase/performance-compat",xo="@firebase/remote-config",Uo="@firebase/remote-config-compat",Vo="@firebase/storage",Bo="@firebase/storage-compat",Ho="@firebase/firestore",$o="@firebase/ai",jo="@firebase/firestore-compat",Wo="firebase",Ko="12.4.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pn="[DEFAULT]",qo={[fn]:"fire-core",[vo]:"fire-core-compat",[wo]:"fire-analytics",[_o]:"fire-analytics-compat",[Io]:"fire-app-check",[To]:"fire-app-check-compat",[Eo]:"fire-auth",[So]:"fire-auth-compat",[Co]:"fire-rtdb",[Ao]:"fire-data-connect",[Po]:"fire-rtdb-compat",[Ro]:"fire-fn",[ko]:"fire-fn-compat",[Oo]:"fire-iid",[Do]:"fire-iid-compat",[Mo]:"fire-fcm",[No]:"fire-fcm-compat",[Lo]:"fire-perf",[Fo]:"fire-perf-compat",[xo]:"fire-rc",[Uo]:"fire-rc-compat",[Vo]:"fire-gcs",[Bo]:"fire-gcs-compat",[Ho]:"fire-fst",[jo]:"fire-fst-compat",[$o]:"fire-vertex","fire-js":"fire-js",[Wo]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wt=new Map,zo=new Map,mn=new Map;function Ss(t,e){try{t.container.addComponent(e)}catch(n){X.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ke(t){const e=t.name;if(mn.has(e))return X.debug(`There were multiple attempts to register component ${e}.`),!1;mn.set(e,t);for(const n of wt.values())Ss(n,t);for(const n of zo.values())Ss(n,t);return!0}function Or(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function $(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Go={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ce=new Xe("app","Firebase",Go);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qo{constructor(e,n,s){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Oe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ce.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et=Ko;function Yo(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s={name:pn,automaticDataCollectionEnabled:!0,...e},r=s.name;if(typeof r!="string"||!r)throw ce.create("bad-app-name",{appName:String(r)});if(n||(n=Cr()),!n)throw ce.create("no-options");const i=wt.get(r);if(i){if(ke(n,i.options)&&ke(s,i.config))return i;throw ce.create("duplicate-app",{appName:r})}const a=new eo(r);for(const c of mn.values())a.addComponent(c);const o=new Qo(n,s,a);return wt.set(r,o),o}function Jo(t=pn){const e=wt.get(t);if(!e&&t===pn&&Cr())return Yo();if(!e)throw ce.create("no-app",{appName:t});return e}function Ee(t,e,n){let s=qo[t]??t;n&&(s+=`-${n}`);const r=s.match(/\s|\//),i=e.match(/\s|\//);if(r||i){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&i&&a.push("and"),i&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),X.warn(a.join(" "));return}Ke(new Oe(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo="firebase-heartbeat-database",Zo=1,qe="firebase-heartbeat-store";let qt=null;function Dr(){return qt||(qt=po(Xo,Zo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(qe)}catch(n){console.warn(n)}}}}).catch(t=>{throw ce.create("idb-open",{originalErrorMessage:t.message})})),qt}async function ec(t){try{const n=(await Dr()).transaction(qe),s=await n.objectStore(qe).get(Mr(t));return await n.done,s}catch(e){if(e instanceof le)X.warn(e.message);else{const n=ce.create("idb-get",{originalErrorMessage:e?.message});X.warn(n.message)}}}async function Cs(t,e){try{const s=(await Dr()).transaction(qe,"readwrite");await s.objectStore(qe).put(e,Mr(t)),await s.done}catch(n){if(n instanceof le)X.warn(n.message);else{const s=ce.create("idb-set",{originalErrorMessage:n?.message});X.warn(s.message)}}}function Mr(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc=1024,nc=30;class sc{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ic(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=As();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(r=>r.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:n}),this._heartbeatsCache.heartbeats.length>nc){const r=ac(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(r,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){X.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=As(),{heartbeatsToSend:n,unsentEntries:s}=rc(this._heartbeatsCache.heartbeats),r=Er(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return X.warn(e),""}}}function As(){return new Date().toISOString().substring(0,10)}function rc(t,e=tc){const n=[];let s=t.slice();for(const r of t){const i=n.find(a=>a.agent===r.agent);if(i){if(i.dates.push(r.date),Ps(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Ps(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class ic{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return $a()?ja().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ec(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Cs(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Cs(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Ps(t){return Er(JSON.stringify({version:2,heartbeats:t})).length}function ac(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oc(t){Ke(new Oe("platform-logger",e=>new yo(e),"PRIVATE")),Ke(new Oe("heartbeat",e=>new sc(e),"PRIVATE")),Ee(fn,Es,t),Ee(fn,Es,"esm2020"),Ee("fire-js","")}oc("");function Nr(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const cc=Nr,Lr=new Xe("auth","Firebase",Nr());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt=new Pr("@firebase/auth");function uc(t,...e){Tt.logLevel<=k.WARN&&Tt.warn(`Auth (${et}): ${t}`,...e)}function pt(t,...e){Tt.logLevel<=k.ERROR&&Tt.error(`Auth (${et}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(t,...e){throw xn(t,...e)}function q(t,...e){return xn(t,...e)}function Fn(t,e,n){const s={...cc(),[e]:n};return new Xe("auth","Firebase",s).create(e,{appName:t.name})}function ue(t){return Fn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fr(t,e,n){const s=n;if(!(e instanceof s))throw s.name!==e.constructor.name&&G(t,"argument-error"),Fn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function xn(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return Lr.create(t,...e)}function v(t,e,...n){if(!t)throw xn(e,...n)}function Y(t){const e="INTERNAL ASSERTION FAILED: "+t;throw pt(e),new Error(e)}function Z(t,e){t||Y(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gn(){return typeof self<"u"&&self.location?.href||""}function lc(){return Rs()==="http:"||Rs()==="https:"}function Rs(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hc(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(lc()||Va()||"connection"in navigator)?navigator.onLine:!0}function dc(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,n){this.shortDelay=e,this.longDelay=n,Z(n>e,"Short delay should be less than long delay!"),this.isMobile=xa()||Ba()}get(){return hc()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Un(t,e){Z(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xr{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Y("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Y("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Y("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pc=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],mc=new tt(3e4,6e4);function Vn(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function Me(t,e,n,s,r={}){return Ur(t,r,async()=>{let i={},a={};s&&(e==="GET"?a=s:i={body:JSON.stringify(s)});const o=Ze({key:t.config.apiKey,...a}).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const u={method:e,headers:c,...i};return Ua()||(u.referrerPolicy="no-referrer"),t.emulatorConfig&&Mt(t.emulatorConfig.host)&&(u.credentials="include"),xr.fetch()(await Vr(t,t.config.apiHost,n,o),u)})}async function Ur(t,e,n){t._canInitEmulator=!1;const s={...fc,...e};try{const r=new yc(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw ht(t,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const o=i.ok?a.errorMessage:a.error.message,[c,u]=o.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw ht(t,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw ht(t,"email-already-in-use",a);if(c==="USER_DISABLED")throw ht(t,"user-disabled",a);const h=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Fn(t,h,u);G(t,h)}}catch(r){if(r instanceof le)throw r;G(t,"network-request-failed",{message:String(r)})}}async function gc(t,e,n,s,r={}){const i=await Me(t,e,n,s,r);return"mfaPendingCredential"in i&&G(t,"multi-factor-auth-required",{_serverResponse:i}),i}async function Vr(t,e,n,s){const r=`${e}${n}?${s}`,i=t,a=i.config.emulator?Un(t.config,r):`${t.config.apiScheme}://${r}`;return pc.includes(n)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(a).toString():a}class yc{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(q(this.auth,"network-request-failed")),mc.get())})}}function ht(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=q(t,e,s);return r.customData._tokenResponse=n,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bc(t,e){return Me(t,"POST","/v1/accounts:delete",e)}async function It(t,e){return Me(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Be(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function vc(t,e=!1){const n=he(t),s=await n.getIdToken(e),r=Bn(s);v(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,a=i?.sign_in_provider;return{claims:r,token:s,authTime:Be(zt(r.auth_time)),issuedAtTime:Be(zt(r.iat)),expirationTime:Be(zt(r.exp)),signInProvider:a||null,signInSecondFactor:i?.sign_in_second_factor||null}}function zt(t){return Number(t)*1e3}function Bn(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return pt("JWT malformed, contained fewer than 3 sections"),null;try{const r=Sr(n);return r?JSON.parse(r):(pt("Failed to decode base64 JWT payload"),null)}catch(r){return pt("Caught error parsing JWT payload as JSON",r?.toString()),null}}function ks(t){const e=Bn(t);return v(e,"internal-error"),v(typeof e.exp<"u","internal-error"),v(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ze(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof le&&_c(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function _c({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wc{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Be(this.lastLoginAt),this.creationTime=Be(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Et(t){const e=t.auth,n=await t.getIdToken(),s=await ze(t,It(e,{idToken:n}));v(s?.users.length,e,"internal-error");const r=s.users[0];t._notifyReloadListener(r);const i=r.providerUserInfo?.length?Br(r.providerUserInfo):[],a=Ic(t.providerData,i),o=t.isAnonymous,c=!(t.email&&r.passwordHash)&&!a?.length,u=o?c:!1,h={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new yn(r.createdAt,r.lastLoginAt),isAnonymous:u};Object.assign(t,h)}async function Tc(t){const e=he(t);await Et(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ic(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Br(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ec(t,e){const n=await Ur(t,{},async()=>{const s=Ze({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,a=await Vr(t,r,"/v1/token",`key=${i}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:o,body:s};return t.emulatorConfig&&Mt(t.emulatorConfig.host)&&(c.credentials="include"),xr.fetch()(a,c)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Sc(t,e){return Me(t,"POST","/v2/accounts:revokeToken",Vn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){v(e.idToken,"internal-error"),v(typeof e.idToken<"u","internal-error"),v(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ks(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){v(e.length!==0,"internal-error");const n=ks(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(v(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await Ec(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,a=new Se;return s&&(v(typeof s=="string","internal-error",{appName:e}),a.refreshToken=s),r&&(v(typeof r=="string","internal-error",{appName:e}),a.accessToken=r),i&&(v(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Se,this.toJSON())}_performRefresh(){return Y("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ee(t,e){v(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class j{constructor({uid:e,auth:n,stsTokenManager:s,...r}){this.providerId="firebase",this.proactiveRefresh=new wc(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new yn(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const n=await ze(this,this.stsTokenManager.getToken(this.auth,e));return v(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return vc(this,e)}reload(){return Tc(this)}_assign(e){this!==e&&(v(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new j({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){v(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await Et(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if($(this.auth.app))return Promise.reject(ue(this.auth));const e=await this.getIdToken();return await ze(this,bc(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const s=n.displayName??void 0,r=n.email??void 0,i=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,c=n._redirectEventId??void 0,u=n.createdAt??void 0,h=n.lastLoginAt??void 0,{uid:d,emailVerified:l,isAnonymous:m,providerData:g,stsTokenManager:p}=n;v(d&&p,e,"internal-error");const _=Se.fromJSON(this.name,p);v(typeof d=="string",e,"internal-error"),ee(s,e.name),ee(r,e.name),v(typeof l=="boolean",e,"internal-error"),v(typeof m=="boolean",e,"internal-error"),ee(i,e.name),ee(a,e.name),ee(o,e.name),ee(c,e.name),ee(u,e.name),ee(h,e.name);const w=new j({uid:d,auth:e,email:r,emailVerified:l,displayName:s,isAnonymous:m,photoURL:a,phoneNumber:i,tenantId:o,stsTokenManager:_,createdAt:u,lastLoginAt:h});return g&&Array.isArray(g)&&(w.providerData=g.map(R=>({...R}))),c&&(w._redirectEventId=c),w}static async _fromIdTokenResponse(e,n,s=!1){const r=new Se;r.updateFromServerResponse(n);const i=new j({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await Et(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];v(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Br(r.providerUserInfo):[],a=!(r.email&&r.passwordHash)&&!i?.length,o=new Se;o.updateFromIdToken(s);const c=new j({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:a}),u={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new yn(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!i?.length};return Object.assign(c,u),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Os=new Map;function J(t){Z(t instanceof Function,"Expected a class definition");let e=Os.get(t);return e?(Z(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Os.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Hr.type="NONE";const Ds=Hr;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(t,e,n){return`firebase:${t}:${e}:${n}`}class Ce{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=mt(this.userKey,r.apiKey,i),this.fullPersistenceKey=mt("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await It(this.auth,{idToken:e}).catch(()=>{});return n?j._fromGetAccountInfoResponse(this.auth,n,e):null}return j._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new Ce(J(Ds),e,s);const r=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let i=r[0]||J(Ds);const a=mt(s,e.config.apiKey,e.name);let o=null;for(const u of n)try{const h=await u._get(a);if(h){let d;if(typeof h=="string"){const l=await It(e,{idToken:h}).catch(()=>{});if(!l)break;d=await j._fromGetAccountInfoResponse(e,l,h)}else d=j._fromJSON(e,h);u!==i&&(o=d),i=u;break}}catch{}const c=r.filter(u=>u._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Ce(i,e,s):(i=c[0],o&&await i._set(a,o.toJSON()),await Promise.all(n.map(async u=>{if(u!==i)try{await u._remove(a)}catch{}})),new Ce(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ms(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Kr(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if($r(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(zr(e))return"Blackberry";if(Gr(e))return"Webos";if(jr(e))return"Safari";if((e.includes("chrome/")||Wr(e))&&!e.includes("edge/"))return"Chrome";if(qr(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if(s?.length===2)return s[1]}return"Other"}function $r(t=U()){return/firefox\//i.test(t)}function jr(t=U()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Wr(t=U()){return/crios\//i.test(t)}function Kr(t=U()){return/iemobile/i.test(t)}function qr(t=U()){return/android/i.test(t)}function zr(t=U()){return/blackberry/i.test(t)}function Gr(t=U()){return/webos/i.test(t)}function Hn(t=U()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Cc(t=U()){return Hn(t)&&!!window.navigator?.standalone}function Ac(){return Ha()&&document.documentMode===10}function Qr(t=U()){return Hn(t)||qr(t)||Gr(t)||zr(t)||/windows phone/i.test(t)||Kr(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yr(t,e=[]){let n;switch(t){case"Browser":n=Ms(U());break;case"Worker":n=`${Ms(U())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${et}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((a,o)=>{try{const c=e(i);a(c)}catch(c){o(c)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rc(t,e={}){return Me(t,"GET","/v2/passwordPolicy",Vn(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kc=6;class Oc{constructor(e){const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??kc,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ns(this),this.idTokenSubscription=new Ns(this),this.beforeStateQueue=new Pc(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Lr,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=J(n)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await Ce.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await It(this,{idToken:e}),s=await j._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if($(this.app)){const i=this.app.settings.authIdToken;return i?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(i).then(a,a))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let s=n,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const i=this.redirectUser?._redirectEventId,a=s?._redirectEventId,o=await this.tryRedirectSignIn(e);(!i||i===a)&&o?.user&&(s=o.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(i){s=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return v(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Et(e)}catch(n){if(n?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=dc()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if($(this.app))return Promise.reject(ue(this));const n=e?he(e):null;return n&&v(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&v(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return $(this.app)?Promise.reject(ue(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return $(this.app)?Promise.reject(ue(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(J(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Rc(this),n=new Oc(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Xe("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await Sc(this,s)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&J(e)||this._popupRedirectResolver;v(n,this,"argument-error"),this.redirectPersistenceManager=await Ce.create(this,[J(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(v(o,this,"internal-error"),o.then(()=>{a||i(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,s,r);return()=>{a=!0,c()}}else{const c=e.addObserver(n);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return v(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Yr(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();n&&(e["X-Firebase-Client"]=n);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){if($(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&uc(`Error while retrieving App Check token: ${e.error}`),e?.token}}function Ne(t){return he(t)}class Ns{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ga(n=>this.observer=n)}get next(){return v(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $n={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Mc(t){$n=t}function Nc(t){return $n.loadJS(t)}function Lc(){return $n.gapiScript}function Fc(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xc(t,e){const n=Or(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(ke(i,e??{}))return r;G(r,"already-initialized")}return n.initialize({options:e})}function Uc(t,e){const n=e?.persistence||[],s=(Array.isArray(n)?n:[n]).map(J);e?.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e?.popupRedirectResolver)}function Vc(t,e,n){const s=Ne(t);v(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=Jr(e),{host:a,port:o}=Bc(e),c=o===null?"":`:${o}`,u={url:`${i}//${a}${c}/`},h=Object.freeze({host:a,port:o,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!s._canInitEmulator){v(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),v(ke(u,s.config.emulator)&&ke(h,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=u,s.emulatorConfig=h,s.settings.appVerificationDisabledForTesting=!0,Mt(a)?(Ma(`${i}//${a}${c}`),Fa("Auth",!0)):Hc()}function Jr(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Bc(t){const e=Jr(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:Ls(s.substr(i.length+1))}}else{const[i,a]=s.split(":");return{host:i,port:Ls(a)}}}function Ls(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Hc(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xr{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Y("not implemented")}_getIdTokenResponse(e){return Y("not implemented")}_linkToIdToken(e,n){return Y("not implemented")}_getReauthenticationResolver(e){return Y("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ae(t,e){return gc(t,"POST","/v1/accounts:signInWithIdp",Vn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $c="http://localhost";class _e extends Xr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new _e(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):G("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r,...i}=n;if(!s||!r)return null;const a=new _e(s,r);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return Ae(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,Ae(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ae(e,n)}buildRequest(){const e={requestUri:$c,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ze(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt extends Nt{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne extends nt{constructor(){super("facebook.com")}static credential(e){return _e._fromParams({providerId:ne.PROVIDER_ID,signInMethod:ne.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ne.credentialFromTaggedObject(e)}static credentialFromError(e){return ne.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ne.credential(e.oauthAccessToken)}catch{return null}}}ne.FACEBOOK_SIGN_IN_METHOD="facebook.com";ne.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se extends nt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return _e._fromParams({providerId:se.PROVIDER_ID,signInMethod:se.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return se.credentialFromTaggedObject(e)}static credentialFromError(e){return se.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return se.credential(n,s)}catch{return null}}}se.GOOGLE_SIGN_IN_METHOD="google.com";se.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re extends nt{constructor(){super("github.com")}static credential(e){return _e._fromParams({providerId:re.PROVIDER_ID,signInMethod:re.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return re.credentialFromTaggedObject(e)}static credentialFromError(e){return re.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return re.credential(e.oauthAccessToken)}catch{return null}}}re.GITHUB_SIGN_IN_METHOD="github.com";re.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie extends nt{constructor(){super("twitter.com")}static credential(e,n){return _e._fromParams({providerId:ie.PROVIDER_ID,signInMethod:ie.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ie.credentialFromTaggedObject(e)}static credentialFromError(e){return ie.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return ie.credential(n,s)}catch{return null}}}ie.TWITTER_SIGN_IN_METHOD="twitter.com";ie.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await j._fromIdTokenResponse(e,s,r),a=Fs(s);return new De({user:i,providerId:a,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=Fs(s);return new De({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function Fs(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St extends le{constructor(e,n,s,r){super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,St.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new St(e,n,s,r)}}function Zr(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?St._fromErrorAndOperation(t,i,e,s):i})}async function jc(t,e,n=!1){const s=await ze(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return De._forOperation(t,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wc(t,e,n=!1){const{auth:s}=t;if($(s.app))return Promise.reject(ue(s));const r="reauthenticate";try{const i=await ze(t,Zr(s,r,e,t),n);v(i.idToken,s,"internal-error");const a=Bn(i.idToken);v(a,s,"internal-error");const{sub:o}=a;return v(t.uid===o,s,"user-mismatch"),De._forOperation(t,r,i)}catch(i){throw i?.code==="auth/user-not-found"&&G(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kc(t,e,n=!1){if($(t.app))return Promise.reject(ue(t));const s="signIn",r=await Zr(t,s,e),i=await De._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}function qc(t,e,n,s){return he(t).onIdTokenChanged(e,n,s)}function zc(t,e,n){return he(t).beforeAuthStateChanged(e,n)}function yd(t,e,n,s){return he(t).onAuthStateChanged(e,n,s)}function bd(t){return he(t).signOut()}const Ct="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Ct,"1"),this.storage.removeItem(Ct),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gc=1e3,Qc=10;class ti extends ei{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qr(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,c)=>{this.notifyListeners(a,c)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const a=this.storage.getItem(s);!n&&this.localCache[s]===a||this.notifyListeners(s,a)},i=this.storage.getItem(s);Ac()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Qc):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},Gc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}ti.type="LOCAL";const Yc=ti;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni extends ei{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ni.type="SESSION";const si=ni;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jc(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new Lt(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,a=this.handlersMap[r];if(!a?.size)return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const o=Array.from(a).map(async u=>u(n.origin,i)),c=await Jc(o);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Lt.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jn(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xc{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,a;return new Promise((o,c)=>{const u=jn("",20);r.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},s);a={messageChannel:r,onMessage(d){const l=d;if(l.data.eventId===u)switch(l.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),o(l.data.response);break;default:clearTimeout(h),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),r.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[r.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(){return window}function Zc(t){z().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ri(){return typeof z().WorkerGlobalScope<"u"&&typeof z().importScripts=="function"}async function eu(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function tu(){return navigator?.serviceWorker?.controller||null}function nu(){return ri()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ii="firebaseLocalStorageDb",su=1,At="firebaseLocalStorage",ai="fbase_key";class st{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Ft(t,e){return t.transaction([At],e?"readwrite":"readonly").objectStore(At)}function ru(){const t=indexedDB.deleteDatabase(ii);return new st(t).toPromise()}function bn(){const t=indexedDB.open(ii,su);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(At,{keyPath:ai})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(At)?e(s):(s.close(),await ru(),e(await bn()))})})}async function xs(t,e,n){const s=Ft(t,!0).put({[ai]:e,value:n});return new st(s).toPromise()}async function iu(t,e){const n=Ft(t,!1).get(e),s=await new st(n).toPromise();return s===void 0?null:s.value}function Us(t,e){const n=Ft(t,!0).delete(e);return new st(n).toPromise()}const au=800,ou=3;class oi{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await bn(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>ou)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ri()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Lt._getInstance(nu()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await eu(),!this.activeServiceWorker)return;this.sender=new Xc(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||tu()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await bn();return await xs(e,Ct,"1"),await Us(e,Ct),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>xs(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>iu(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Us(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=Ft(r,!1).getAll();return new st(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),au)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}oi.type="LOCAL";const cu=oi;new tt(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wn(t,e){return e?J(e):(v(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn extends Xr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ae(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ae(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ae(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function uu(t){return Kc(t.auth,new Kn(t),t.bypassAuthState)}function lu(t){const{auth:e,user:n}=t;return v(n,e,"internal-error"),Wc(n,new Kn(t),t.bypassAuthState)}async function hu(t){const{auth:e,user:n}=t;return v(n,e,"internal-error"),jc(n,new Kn(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:a,type:o}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return uu;case"linkViaPopup":case"linkViaRedirect":return hu;case"reauthViaPopup":case"reauthViaRedirect":return lu;default:G(this.auth,"internal-error")}}resolve(e){Z(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Z(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const du=new tt(2e3,1e4);async function vd(t,e,n){if($(t.app))return Promise.reject(q(t,"operation-not-supported-in-this-environment"));const s=Ne(t);Fr(t,e,Nt);const r=Wn(s,n);return new me(s,"signInViaPopup",e,r).executeNotNull()}class me extends ci{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,me.currentPopupAction&&me.currentPopupAction.cancel(),me.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return v(e,this.auth,"internal-error"),e}async onExecution(){Z(this.filter.length===1,"Popup operations only handle one event");const e=jn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(q(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(q(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,me.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(q(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,du.get())};e()}}me.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu="pendingRedirect",gt=new Map;class pu extends ci{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=gt.get(this.auth._key());if(!e){try{const s=await mu(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}gt.set(this.auth._key(),e)}return this.bypassAuthState||gt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function mu(t,e){const n=li(e),s=ui(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}async function gu(t,e){return ui(t)._set(li(e),"true")}function yu(t,e){gt.set(t._key(),e)}function ui(t){return J(t._redirectPersistence)}function li(t){return mt(fu,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _d(t,e,n){return bu(t,e,n)}async function bu(t,e,n){if($(t.app))return Promise.reject(ue(t));const s=Ne(t);Fr(t,e,Nt),await s._initializationPromise;const r=Wn(s,n);return await gu(r,s),r._openRedirect(s,e,"signInViaRedirect")}async function wd(t,e){return await Ne(t)._initializationPromise,hi(t,e,!1)}async function hi(t,e,n=!1){if($(t.app))return Promise.reject(ue(t));const s=Ne(t),r=Wn(s,e),a=await new pu(s,r,n).execute();return a&&!n&&(delete a.user._redirectEventId,await s._persistUserIfCurrent(a.user),await s._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vu=600*1e3;class _u{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!wu(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){if(e.error&&!di(e)){const s=e.error.code?.split("auth/")[1]||"internal-error";n.onError(q(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=vu&&this.cachedEventUids.clear(),this.cachedEventUids.has(Vs(e))}saveEventToCache(e){this.cachedEventUids.add(Vs(e)),this.lastProcessedEventTime=Date.now()}}function Vs(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function di({type:t,error:e}){return t==="unknown"&&e?.code==="auth/no-auth-event"}function wu(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return di(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tu(t,e={}){return Me(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iu=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Eu=/^https?/;async function Su(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Tu(t);for(const n of e)try{if(Cu(n))return}catch{}G(t,"unauthorized-domain")}function Cu(t){const e=gn(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===s}if(!Eu.test(n))return!1;if(Iu.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Au=new tt(3e4,6e4);function Bs(){const t=z().___jsl;if(t?.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Pu(t){return new Promise((e,n)=>{function s(){Bs(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Bs(),n(q(t,"network-request-failed"))},timeout:Au.get()})}if(z().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(z().gapi?.load)s();else{const r=Fc("iframefcb");return z()[r]=()=>{gapi.load?s():n(q(t,"network-request-failed"))},Nc(`${Lc()}?onload=${r}`).catch(i=>n(i))}}).catch(e=>{throw yt=null,e})}let yt=null;function Ru(t){return yt=yt||Pu(t),yt}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ku=new tt(5e3,15e3),Ou="__/auth/iframe",Du="emulator/auth/iframe",Mu={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Nu=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Lu(t){const e=t.config;v(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Un(e,Du):`https://${t.config.authDomain}/${Ou}`,s={apiKey:e.apiKey,appName:t.name,v:et},r=Nu.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${Ze(s).slice(1)}`}async function Fu(t){const e=await Ru(t),n=z().gapi;return v(n,t,"internal-error"),e.open({where:document.body,url:Lu(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Mu,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const a=q(t,"network-request-failed"),o=z().setTimeout(()=>{i(a)},ku.get());function c(){z().clearTimeout(o),r(s)}s.ping(c).then(c,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xu={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Uu=500,Vu=600,Bu="_blank",Hu="http://localhost";class Hs{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function $u(t,e,n,s=Uu,r=Vu){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),a=Math.max((window.screen.availWidth-s)/2,0).toString();let o="";const c={...xu,width:s.toString(),height:r.toString(),top:i,left:a},u=U().toLowerCase();n&&(o=Wr(u)?Bu:n),$r(u)&&(e=e||Hu,c.scrollbars="yes");const h=Object.entries(c).reduce((l,[m,g])=>`${l}${m}=${g},`,"");if(Cc(u)&&o!=="_self")return ju(e||"",o),new Hs(null);const d=window.open(e||"",o,h);v(d,t,"popup-blocked");try{d.focus()}catch{}return new Hs(d)}function ju(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wu="__/auth/handler",Ku="emulator/auth/handler",qu=encodeURIComponent("fac");async function $s(t,e,n,s,r,i){v(t.config.authDomain,t,"auth-domain-config-required"),v(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:et,eventId:r};if(e instanceof Nt){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",za(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,d]of Object.entries({}))a[h]=d}if(e instanceof nt){const h=e.getScopes().filter(d=>d!=="");h.length>0&&(a.scopes=h.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const h of Object.keys(o))o[h]===void 0&&delete o[h];const c=await t._getAppCheckToken(),u=c?`#${qu}=${encodeURIComponent(c)}`:"";return`${zu(t)}?${Ze(o).slice(1)}${u}`}function zu({config:t}){return t.emulator?Un(t,Ku):`https://${t.authDomain}/${Wu}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt="webStorageSupport";class Gu{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=si,this._completeRedirectFn=hi,this._overrideRedirectResult=yu}async _openPopup(e,n,s,r){Z(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const i=await $s(e,n,s,gn(),r);return $u(e,i,jn())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await $s(e,n,s,gn(),r);return Zc(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(Z(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await Fu(e),s=new _u(e);return n.register("authEvent",r=>(v(r?.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Gt,{type:Gt},r=>{const i=r?.[0]?.[Gt];i!==void 0&&n(!!i),G(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Su(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Qr()||jr()||Hn()}}const Qu=Gu;var js="@firebase/auth",Ws="1.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e(s?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){v(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ju(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Xu(t){Ke(new Oe("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=s.options;v(a&&!a.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Yr(t)},u=new Dc(s,r,i,c);return Uc(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Ke(new Oe("auth-internal",e=>{const n=Ne(e.getProvider("auth").getImmediate());return(s=>new Yu(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ee(js,Ws,Ju(t)),Ee(js,Ws,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zu=300,el=Ar("authIdTokenMaxAge")||Zu;let Ks=null;const tl=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>el)return;const r=n?.token;Ks!==r&&(Ks=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function Td(t=Jo()){const e=Or(t,"auth");if(e.isInitialized())return e.getImmediate();const n=xc(t,{popupRedirectResolver:Qu,persistence:[cu,Yc,si]}),s=Ar("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const a=tl(i.toString());zc(n,a,()=>a(n.currentUser)),qc(n,o=>a(o))}}const r=Oa("auth");return r&&Vc(n,`http://${r}`),n}function nl(){return document.getElementsByTagName("head")?.[0]??document}Mc({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=q("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",nl().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Xu("Browser");var sl="firebase",rl="12.4.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ee(sl,rl,"app");var Qt={exports:{}},Yt,qs;function il(){if(qs)return Yt;qs=1;var t="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return Yt=t,Yt}var Jt,zs;function al(){if(zs)return Jt;zs=1;var t=il();function e(){}function n(){}return n.resetWarningCache=e,Jt=function(){function s(a,o,c,u,h,d){if(d!==t){var l=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw l.name="Invariant Violation",l}}s.isRequired=s;function r(){return s}var i={array:s,bigint:s,bool:s,func:s,number:s,object:s,string:s,symbol:s,any:s,arrayOf:r,element:s,elementType:s,instanceOf:r,node:s,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r,checkPropTypes:n,resetWarningCache:e};return i.PropTypes=i,i},Jt}var Gs;function ol(){return Gs||(Gs=1,Qt.exports=al()()),Qt.exports}var cl=ol();const Id=Xi(cl);function ul(t,e){t.indexOf(e)===-1&&t.push(e)}function ll(t,e){const n=t.indexOf(e);n>-1&&t.splice(n,1)}const we=(t,e,n)=>n>e?e:n<t?t:n;let qn=()=>{};const Ge={},hl=t=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);function fi(t){return typeof t=="object"&&t!==null}const dl=t=>/^0[^.\s]+$/u.test(t);function zn(t){let e;return()=>(e===void 0&&(e=t()),e)}const Le=t=>t,fl=(t,e)=>n=>e(t(n)),Gn=(...t)=>t.reduce(fl),pi=(t,e,n)=>{const s=e-t;return s===0?1:(n-t)/s};class pl{constructor(){this.subscriptions=[]}add(e){return ul(this.subscriptions,e),()=>ll(this.subscriptions,e)}notify(e,n,s){const r=this.subscriptions.length;if(r)if(r===1)this.subscriptions[0](e,n,s);else for(let i=0;i<r;i++){const a=this.subscriptions[i];a&&a(e,n,s)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Fe=t=>t*1e3,W=t=>t/1e3;function mi(t,e){return e?t*(1e3/e):0}const gi=(t,e,n)=>(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t,ml=1e-7,gl=12;function yl(t,e,n,s,r){let i,a,o=0;do a=e+(n-e)/2,i=gi(a,s,r)-t,i>0?n=a:e=a;while(Math.abs(i)>ml&&++o<gl);return a}function rt(t,e,n,s){if(t===e&&n===s)return Le;const r=i=>yl(i,0,1,t,n);return i=>i===0||i===1?i:gi(r(i),e,s)}const yi=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,bi=t=>e=>1-t(1-e),vi=rt(.33,1.53,.69,.99),Qn=bi(vi),_i=yi(Qn),wi=t=>(t*=2)<1?.5*Qn(t):.5*(2-Math.pow(2,-10*(t-1))),Yn=t=>1-Math.sin(Math.acos(t)),bl=bi(Yn),Ti=yi(Yn),vl=rt(.42,0,1,1),_l=rt(0,0,.58,1),Ii=rt(.42,0,.58,1),wl=t=>Array.isArray(t)&&typeof t[0]!="number",Ei=t=>Array.isArray(t)&&typeof t[0]=="number",Tl={linear:Le,easeIn:vl,easeInOut:Ii,easeOut:_l,circIn:Yn,circInOut:Ti,circOut:bl,backIn:Qn,backInOut:_i,backOut:vi,anticipate:wi},Il=t=>typeof t=="string",Qs=t=>{if(Ei(t)){qn(t.length===4);const[e,n,s,r]=t;return rt(e,n,s,r)}else if(Il(t))return Tl[t];return t},dt=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function El(t,e){let n=new Set,s=new Set,r=!1,i=!1;const a=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function c(h){a.has(h)&&(u.schedule(h),t()),h(o)}const u={schedule:(h,d=!1,l=!1)=>{const g=l&&r?n:s;return d&&a.add(h),g.has(h)||g.add(h),h},cancel:h=>{s.delete(h),a.delete(h)},process:h=>{if(o=h,r){i=!0;return}r=!0,[n,s]=[s,n],n.forEach(c),n.clear(),r=!1,i&&(i=!1,u.process(h))}};return u}const Sl=40;function Si(t,e){let n=!1,s=!0;const r={delta:0,timestamp:0,isProcessing:!1},i=()=>n=!0,a=dt.reduce((I,C)=>(I[C]=El(i),I),{}),{setup:o,read:c,resolveKeyframes:u,preUpdate:h,update:d,preRender:l,render:m,postRender:g}=a,p=()=>{const I=Ge.useManualTiming?r.timestamp:performance.now();n=!1,Ge.useManualTiming||(r.delta=s?1e3/60:Math.max(Math.min(I-r.timestamp,Sl),1)),r.timestamp=I,r.isProcessing=!0,o.process(r),c.process(r),u.process(r),h.process(r),d.process(r),l.process(r),m.process(r),g.process(r),r.isProcessing=!1,n&&e&&(s=!1,t(p))},_=()=>{n=!0,s=!0,r.isProcessing||t(p)};return{schedule:dt.reduce((I,C)=>{const b=a[C];return I[C]=(P,A=!1,y=!1)=>(n||_(),b.schedule(P,A,y)),I},{}),cancel:I=>{for(let C=0;C<dt.length;C++)a[dt[C]].cancel(I)},state:r,steps:a}}const{schedule:Pt,cancel:Cl,state:Rt,steps:Ed}=Si(typeof requestAnimationFrame<"u"?requestAnimationFrame:Le,!0);let bt;function Al(){bt=void 0}const K={now:()=>(bt===void 0&&K.set(Rt.isProcessing||Ge.useManualTiming?Rt.timestamp:performance.now()),bt),set:t=>{bt=t,queueMicrotask(Al)}},Ci=t=>e=>typeof e=="string"&&e.startsWith(t),Sd=Ci("--"),Pl=Ci("var(--"),Jn=t=>Pl(t)?Rl.test(t.split("/*")[0].trim()):!1,Rl=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,xe={test:t=>typeof t=="number",parse:parseFloat,transform:t=>t},Qe={...xe,transform:t=>we(0,1,t)},ft={...xe,default:1},He=t=>Math.round(t*1e5)/1e5,Xn=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function kl(t){return t==null}const Ol=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,Zn=(t,e)=>n=>!!(typeof n=="string"&&Ol.test(n)&&n.startsWith(t)||e&&!kl(n)&&Object.prototype.hasOwnProperty.call(n,e)),Ai=(t,e,n)=>s=>{if(typeof s!="string")return s;const[r,i,a,o]=s.match(Xn);return{[t]:parseFloat(r),[e]:parseFloat(i),[n]:parseFloat(a),alpha:o!==void 0?parseFloat(o):1}},Dl=t=>we(0,255,t),Xt={...xe,transform:t=>Math.round(Dl(t))},ge={test:Zn("rgb","red"),parse:Ai("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:s=1})=>"rgba("+Xt.transform(t)+", "+Xt.transform(e)+", "+Xt.transform(n)+", "+He(Qe.transform(s))+")"};function Ml(t){let e="",n="",s="",r="";return t.length>5?(e=t.substring(1,3),n=t.substring(3,5),s=t.substring(5,7),r=t.substring(7,9)):(e=t.substring(1,2),n=t.substring(2,3),s=t.substring(3,4),r=t.substring(4,5),e+=e,n+=n,s+=s,r+=r),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(s,16),alpha:r?parseInt(r,16)/255:1}}const vn={test:Zn("#"),parse:Ml,transform:ge.transform},it=t=>({test:e=>typeof e=="string"&&e.endsWith(t)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${t}`}),te=it("deg"),Pe=it("%"),T=it("px"),Nl=it("vh"),Ll=it("vw"),Ys={...Pe,parse:t=>Pe.parse(t)/100,transform:t=>Pe.transform(t*100)},Ie={test:Zn("hsl","hue"),parse:Ai("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:s=1})=>"hsla("+Math.round(t)+", "+Pe.transform(He(e))+", "+Pe.transform(He(n))+", "+He(Qe.transform(s))+")"},M={test:t=>ge.test(t)||vn.test(t)||Ie.test(t),parse:t=>ge.test(t)?ge.parse(t):Ie.test(t)?Ie.parse(t):vn.parse(t),transform:t=>typeof t=="string"?t:t.hasOwnProperty("red")?ge.transform(t):Ie.transform(t),getAnimatableNone:t=>{const e=M.parse(t);return e.alpha=0,M.transform(e)}},Fl=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function xl(t){return isNaN(t)&&typeof t=="string"&&(t.match(Xn)?.length||0)+(t.match(Fl)?.length||0)>0}const Pi="number",Ri="color",Ul="var",Vl="var(",Js="${}",Bl=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function Ye(t){const e=t.toString(),n=[],s={color:[],number:[],var:[]},r=[];let i=0;const o=e.replace(Bl,c=>(M.test(c)?(s.color.push(i),r.push(Ri),n.push(M.parse(c))):c.startsWith(Vl)?(s.var.push(i),r.push(Ul),n.push(c)):(s.number.push(i),r.push(Pi),n.push(parseFloat(c))),++i,Js)).split(Js);return{values:n,split:o,indexes:s,types:r}}function ki(t){return Ye(t).values}function Oi(t){const{split:e,types:n}=Ye(t),s=e.length;return r=>{let i="";for(let a=0;a<s;a++)if(i+=e[a],r[a]!==void 0){const o=n[a];o===Pi?i+=He(r[a]):o===Ri?i+=M.transform(r[a]):i+=r[a]}return i}}const Hl=t=>typeof t=="number"?0:M.test(t)?M.getAnimatableNone(t):t;function $l(t){const e=ki(t);return Oi(t)(e.map(Hl))}const at={test:xl,parse:ki,createTransformer:Oi,getAnimatableNone:$l};function Zt(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function jl({hue:t,saturation:e,lightness:n,alpha:s}){t/=360,e/=100,n/=100;let r=0,i=0,a=0;if(!e)r=i=a=n;else{const o=n<.5?n*(1+e):n+e-n*e,c=2*n-o;r=Zt(c,o,t+1/3),i=Zt(c,o,t),a=Zt(c,o,t-1/3)}return{red:Math.round(r*255),green:Math.round(i*255),blue:Math.round(a*255),alpha:s}}function kt(t,e){return n=>n>0?e:t}const xt=(t,e,n)=>t+(e-t)*n,en=(t,e,n)=>{const s=t*t,r=n*(e*e-s)+s;return r<0?0:Math.sqrt(r)},Wl=[vn,ge,Ie],Kl=t=>Wl.find(e=>e.test(t));function Xs(t){const e=Kl(t);if(!e)return!1;let n=e.parse(t);return e===Ie&&(n=jl(n)),n}const Zs=(t,e)=>{const n=Xs(t),s=Xs(e);if(!n||!s)return kt(t,e);const r={...n};return i=>(r.red=en(n.red,s.red,i),r.green=en(n.green,s.green,i),r.blue=en(n.blue,s.blue,i),r.alpha=xt(n.alpha,s.alpha,i),ge.transform(r))},_n=new Set(["none","hidden"]);function ql(t,e){return _n.has(t)?n=>n<=0?t:e:n=>n>=1?e:t}function zl(t,e){return n=>xt(t,e,n)}function es(t){return typeof t=="number"?zl:typeof t=="string"?Jn(t)?kt:M.test(t)?Zs:Yl:Array.isArray(t)?Di:typeof t=="object"?M.test(t)?Zs:Gl:kt}function Di(t,e){const n=[...t],s=n.length,r=t.map((i,a)=>es(i)(i,e[a]));return i=>{for(let a=0;a<s;a++)n[a]=r[a](i);return n}}function Gl(t,e){const n={...t,...e},s={};for(const r in n)t[r]!==void 0&&e[r]!==void 0&&(s[r]=es(t[r])(t[r],e[r]));return r=>{for(const i in s)n[i]=s[i](r);return n}}function Ql(t,e){const n=[],s={color:0,var:0,number:0};for(let r=0;r<e.values.length;r++){const i=e.types[r],a=t.indexes[i][s[i]],o=t.values[a]??0;n[r]=o,s[i]++}return n}const Yl=(t,e)=>{const n=at.createTransformer(e),s=Ye(t),r=Ye(e);return s.indexes.var.length===r.indexes.var.length&&s.indexes.color.length===r.indexes.color.length&&s.indexes.number.length>=r.indexes.number.length?_n.has(t)&&!r.values.length||_n.has(e)&&!s.values.length?ql(t,e):Gn(Di(Ql(s,r),r.values),n):kt(t,e)};function Mi(t,e,n){return typeof t=="number"&&typeof e=="number"&&typeof n=="number"?xt(t,e,n):es(t)(t,e)}const Jl=t=>{const e=({timestamp:n})=>t(n);return{start:(n=!0)=>Pt.update(e,n),stop:()=>Cl(e),now:()=>Rt.isProcessing?Rt.timestamp:K.now()}},Ni=(t,e,n=10)=>{let s="";const r=Math.max(Math.round(e/n),2);for(let i=0;i<r;i++)s+=Math.round(t(i/(r-1))*1e4)/1e4+", ";return`linear(${s.substring(0,s.length-2)})`},Ot=2e4;function ts(t){let e=0;const n=50;let s=t.next(e);for(;!s.done&&e<Ot;)e+=n,s=t.next(e);return e>=Ot?1/0:e}function Xl(t,e=100,n){const s=n({...t,keyframes:[0,e]}),r=Math.min(ts(s),Ot);return{type:"keyframes",ease:i=>s.next(r*i).value/e,duration:W(r)}}const Zl=5;function Li(t,e,n){const s=Math.max(e-Zl,0);return mi(n-t(s),e-s)}const O={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1},tn=.001;function eh({duration:t=O.duration,bounce:e=O.bounce,velocity:n=O.velocity,mass:s=O.mass}){let r,i,a=1-e;a=we(O.minDamping,O.maxDamping,a),t=we(O.minDuration,O.maxDuration,W(t)),a<1?(r=u=>{const h=u*a,d=h*t,l=h-n,m=wn(u,a),g=Math.exp(-d);return tn-l/m*g},i=u=>{const d=u*a*t,l=d*n+n,m=Math.pow(a,2)*Math.pow(u,2)*t,g=Math.exp(-d),p=wn(Math.pow(u,2),a);return(-r(u)+tn>0?-1:1)*((l-m)*g)/p}):(r=u=>{const h=Math.exp(-u*t),d=(u-n)*t+1;return-tn+h*d},i=u=>{const h=Math.exp(-u*t),d=(n-u)*(t*t);return h*d});const o=5/t,c=nh(r,i,o);if(t=Fe(t),isNaN(c))return{stiffness:O.stiffness,damping:O.damping,duration:t};{const u=Math.pow(c,2)*s;return{stiffness:u,damping:a*2*Math.sqrt(s*u),duration:t}}}const th=12;function nh(t,e,n){let s=n;for(let r=1;r<th;r++)s=s-t(s)/e(s);return s}function wn(t,e){return t*Math.sqrt(1-e*e)}const sh=["duration","bounce"],rh=["stiffness","damping","mass"];function er(t,e){return e.some(n=>t[n]!==void 0)}function ih(t){let e={velocity:O.velocity,stiffness:O.stiffness,damping:O.damping,mass:O.mass,isResolvedFromDuration:!1,...t};if(!er(t,rh)&&er(t,sh))if(t.visualDuration){const n=t.visualDuration,s=2*Math.PI/(n*1.2),r=s*s,i=2*we(.05,1,1-(t.bounce||0))*Math.sqrt(r);e={...e,mass:O.mass,stiffness:r,damping:i}}else{const n=eh(t);e={...e,...n,mass:O.mass},e.isResolvedFromDuration=!0}return e}function Dt(t=O.visualDuration,e=O.bounce){const n=typeof t!="object"?{visualDuration:t,keyframes:[0,1],bounce:e}:t;let{restSpeed:s,restDelta:r}=n;const i=n.keyframes[0],a=n.keyframes[n.keyframes.length-1],o={done:!1,value:i},{stiffness:c,damping:u,mass:h,duration:d,velocity:l,isResolvedFromDuration:m}=ih({...n,velocity:-W(n.velocity||0)}),g=l||0,p=u/(2*Math.sqrt(c*h)),_=a-i,w=W(Math.sqrt(c/h)),R=Math.abs(_)<5;s||(s=R?O.restSpeed.granular:O.restSpeed.default),r||(r=R?O.restDelta.granular:O.restDelta.default);let I;if(p<1){const b=wn(w,p);I=P=>{const A=Math.exp(-p*w*P);return a-A*((g+p*w*_)/b*Math.sin(b*P)+_*Math.cos(b*P))}}else if(p===1)I=b=>a-Math.exp(-w*b)*(_+(g+w*_)*b);else{const b=w*Math.sqrt(p*p-1);I=P=>{const A=Math.exp(-p*w*P),y=Math.min(b*P,300);return a-A*((g+p*w*_)*Math.sinh(y)+b*_*Math.cosh(y))/b}}const C={calculatedDuration:m&&d||null,next:b=>{const P=I(b);if(m)o.done=b>=d;else{let A=b===0?g:0;p<1&&(A=b===0?Fe(g):Li(I,b,P));const y=Math.abs(A)<=s,N=Math.abs(a-P)<=r;o.done=y&&N}return o.value=o.done?a:P,o},toString:()=>{const b=Math.min(ts(C),Ot),P=Ni(A=>C.next(b*A).value,b,30);return b+"ms "+P},toTransition:()=>{}};return C}Dt.applyToOptions=t=>{const e=Xl(t,100,Dt);return t.ease=e.ease,t.duration=Fe(e.duration),t.type="keyframes",t};function Tn({keyframes:t,velocity:e=0,power:n=.8,timeConstant:s=325,bounceDamping:r=10,bounceStiffness:i=500,modifyTarget:a,min:o,max:c,restDelta:u=.5,restSpeed:h}){const d=t[0],l={done:!1,value:d},m=y=>o!==void 0&&y<o||c!==void 0&&y>c,g=y=>o===void 0?c:c===void 0||Math.abs(o-y)<Math.abs(c-y)?o:c;let p=n*e;const _=d+p,w=a===void 0?_:a(_);w!==_&&(p=w-d);const R=y=>-p*Math.exp(-y/s),I=y=>w+R(y),C=y=>{const N=R(y),L=I(y);l.done=Math.abs(N)<=u,l.value=l.done?w:L};let b,P;const A=y=>{m(l.value)&&(b=y,P=Dt({keyframes:[l.value,g(l.value)],velocity:Li(I,y,l.value),damping:r,stiffness:i,restDelta:u,restSpeed:h}))};return A(0),{calculatedDuration:null,next:y=>{let N=!1;return!P&&b===void 0&&(N=!0,C(y),A(y)),b!==void 0&&y>=b?P.next(y-b):(!N&&C(y),l)}}}function ah(t,e,n){const s=[],r=n||Ge.mix||Mi,i=t.length-1;for(let a=0;a<i;a++){let o=r(t[a],t[a+1]);if(e){const c=Array.isArray(e)?e[a]||Le:e;o=Gn(c,o)}s.push(o)}return s}function oh(t,e,{clamp:n=!0,ease:s,mixer:r}={}){const i=t.length;if(qn(i===e.length),i===1)return()=>e[0];if(i===2&&e[0]===e[1])return()=>e[1];const a=t[0]===t[1];t[0]>t[i-1]&&(t=[...t].reverse(),e=[...e].reverse());const o=ah(e,s,r),c=o.length,u=h=>{if(a&&h<t[0])return e[0];let d=0;if(c>1)for(;d<t.length-2&&!(h<t[d+1]);d++);const l=pi(t[d],t[d+1],h);return o[d](l)};return n?h=>u(we(t[0],t[i-1],h)):u}function ch(t,e){const n=t[t.length-1];for(let s=1;s<=e;s++){const r=pi(0,e,s);t.push(xt(n,1,r))}}function uh(t){const e=[0];return ch(e,t.length-1),e}function lh(t,e){return t.map(n=>n*e)}function hh(t,e){return t.map(()=>e||Ii).splice(0,t.length-1)}function $e({duration:t=300,keyframes:e,times:n,ease:s="easeInOut"}){const r=wl(s)?s.map(Qs):Qs(s),i={done:!1,value:e[0]},a=lh(n&&n.length===e.length?n:uh(e),t),o=oh(a,e,{ease:Array.isArray(r)?r:hh(e,r)});return{calculatedDuration:t,next:c=>(i.value=o(c),i.done=c>=t,i)}}const dh=t=>t!==null;function ns(t,{repeat:e,repeatType:n="loop"},s,r=1){const i=t.filter(dh),o=r<0||e&&n!=="loop"&&e%2===1?0:i.length-1;return!o||s===void 0?i[o]:s}const fh={decay:Tn,inertia:Tn,tween:$e,keyframes:$e,spring:Dt};function Fi(t){typeof t.type=="string"&&(t.type=fh[t.type])}class ss{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(e=>{this.resolve=e})}notifyFinished(){this.resolve()}then(e,n){return this.finished.then(e,n)}}const ph=t=>t/100;class xi extends ss{constructor(e){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==K.now()&&this.tick(K.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=e,this.initAnimation(),this.play(),e.autoplay===!1&&this.pause()}initAnimation(){const{options:e}=this;Fi(e);const{type:n=$e,repeat:s=0,repeatDelay:r=0,repeatType:i,velocity:a=0}=e;let{keyframes:o}=e;const c=n||$e;c!==$e&&typeof o[0]!="number"&&(this.mixKeyframes=Gn(ph,Mi(o[0],o[1])),o=[0,100]);const u=c({...e,keyframes:o});i==="mirror"&&(this.mirroredGenerator=c({...e,keyframes:[...o].reverse(),velocity:-a})),u.calculatedDuration===null&&(u.calculatedDuration=ts(u));const{calculatedDuration:h}=u;this.calculatedDuration=h,this.resolvedDuration=h+r,this.totalDuration=this.resolvedDuration*(s+1)-r,this.generator=u}updateTime(e){const n=Math.round(e-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(e,n=!1){const{generator:s,totalDuration:r,mixKeyframes:i,mirroredGenerator:a,resolvedDuration:o,calculatedDuration:c}=this;if(this.startTime===null)return s.next(0);const{delay:u=0,keyframes:h,repeat:d,repeatType:l,repeatDelay:m,type:g,onUpdate:p,finalKeyframe:_}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-r/this.speed,this.startTime)),n?this.currentTime=e:this.updateTime(e);const w=this.currentTime-u*(this.playbackSpeed>=0?1:-1),R=this.playbackSpeed>=0?w<0:w>r;this.currentTime=Math.max(w,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=r);let I=this.currentTime,C=s;if(d){const y=Math.min(this.currentTime,r)/o;let N=Math.floor(y),L=y%1;!L&&y>=1&&(L=1),L===1&&N--,N=Math.min(N,d+1),!!(N%2)&&(l==="reverse"?(L=1-L,m&&(L-=m/o)):l==="mirror"&&(C=a)),I=we(0,1,L)*o}const b=R?{done:!1,value:h[0]}:C.next(I);i&&(b.value=i(b.value));let{done:P}=b;!R&&c!==null&&(P=this.playbackSpeed>=0?this.currentTime>=r:this.currentTime<=0);const A=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&P);return A&&g!==Tn&&(b.value=ns(h,this.options,_,this.speed)),p&&p(b.value),A&&this.finish(),b}then(e,n){return this.finished.then(e,n)}get duration(){return W(this.calculatedDuration)}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+W(e)}get time(){return W(this.currentTime)}set time(e){e=Fe(e),this.currentTime=e,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.playbackSpeed),this.driver?.start(!1)}get speed(){return this.playbackSpeed}set speed(e){this.updateTime(K.now());const n=this.playbackSpeed!==e;this.playbackSpeed=e,n&&(this.time=W(this.currentTime))}play(){if(this.isStopped)return;const{driver:e=Jl,startTime:n}=this.options;this.driver||(this.driver=e(r=>this.tick(r))),this.options.onPlay?.();const s=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=s):this.holdTime!==null?this.startTime=s-this.holdTime:this.startTime||(this.startTime=n??s),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(K.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}attachTimeline(e){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),e.observe(this)}}function mh(t){for(let e=1;e<t.length;e++)t[e]??(t[e]=t[e-1])}const ye=t=>t*180/Math.PI,In=t=>{const e=ye(Math.atan2(t[1],t[0]));return En(e)},gh={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:t=>(Math.abs(t[0])+Math.abs(t[3]))/2,rotate:In,rotateZ:In,skewX:t=>ye(Math.atan(t[1])),skewY:t=>ye(Math.atan(t[2])),skew:t=>(Math.abs(t[1])+Math.abs(t[2]))/2},En=t=>(t=t%360,t<0&&(t+=360),t),tr=In,nr=t=>Math.sqrt(t[0]*t[0]+t[1]*t[1]),sr=t=>Math.sqrt(t[4]*t[4]+t[5]*t[5]),yh={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:nr,scaleY:sr,scale:t=>(nr(t)+sr(t))/2,rotateX:t=>En(ye(Math.atan2(t[6],t[5]))),rotateY:t=>En(ye(Math.atan2(-t[2],t[0]))),rotateZ:tr,rotate:tr,skewX:t=>ye(Math.atan(t[4])),skewY:t=>ye(Math.atan(t[1])),skew:t=>(Math.abs(t[1])+Math.abs(t[4]))/2};function rr(t){return t.includes("scale")?1:0}function Sn(t,e){if(!t||t==="none")return rr(e);const n=t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let s,r;if(n)s=yh,r=n;else{const o=t.match(/^matrix\(([-\d.e\s,]+)\)$/u);s=gh,r=o}if(!r)return rr(e);const i=s[e],a=r[1].split(",").map(bh);return typeof i=="function"?i(a):a[i]}const Cd=(t,e)=>{const{transform:n="none"}=getComputedStyle(t);return Sn(n,e)};function bh(t){return parseFloat(t.trim())}const rs=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Ad=new Set(rs),ir=t=>t===xe||t===T,vh=new Set(["x","y","z"]),_h=rs.filter(t=>!vh.has(t));function wh(t){const e=[];return _h.forEach(n=>{const s=t.getValue(n);s!==void 0&&(e.push([n,s.get()]),s.set(n.startsWith("scale")?1:0))}),e}const be={width:({x:t},{paddingLeft:e="0",paddingRight:n="0"})=>t.max-t.min-parseFloat(e)-parseFloat(n),height:({y:t},{paddingTop:e="0",paddingBottom:n="0"})=>t.max-t.min-parseFloat(e)-parseFloat(n),top:(t,{top:e})=>parseFloat(e),left:(t,{left:e})=>parseFloat(e),bottom:({y:t},{top:e})=>parseFloat(e)+(t.max-t.min),right:({x:t},{left:e})=>parseFloat(e)+(t.max-t.min),x:(t,{transform:e})=>Sn(e,"x"),y:(t,{transform:e})=>Sn(e,"y")};be.translateX=be.x;be.translateY=be.y;const ve=new Set;let Cn=!1,An=!1,Pn=!1;function Ui(){if(An){const t=Array.from(ve).filter(s=>s.needsMeasurement),e=new Set(t.map(s=>s.element)),n=new Map;e.forEach(s=>{const r=wh(s);r.length&&(n.set(s,r),s.render())}),t.forEach(s=>s.measureInitialState()),e.forEach(s=>{s.render();const r=n.get(s);r&&r.forEach(([i,a])=>{s.getValue(i)?.set(a)})}),t.forEach(s=>s.measureEndState()),t.forEach(s=>{s.suspendedScrollY!==void 0&&window.scrollTo(0,s.suspendedScrollY)})}An=!1,Cn=!1,ve.forEach(t=>t.complete(Pn)),ve.clear()}function Vi(){ve.forEach(t=>{t.readKeyframes(),t.needsMeasurement&&(An=!0)})}function Th(){Pn=!0,Vi(),Ui(),Pn=!1}class Bi{constructor(e,n,s,r,i,a=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...e],this.onComplete=n,this.name=s,this.motionValue=r,this.element=i,this.isAsync=a}scheduleResolve(){this.state="scheduled",this.isAsync?(ve.add(this),Cn||(Cn=!0,Pt.read(Vi),Pt.resolveKeyframes(Ui))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:n,element:s,motionValue:r}=this;if(e[0]===null){const i=r?.get(),a=e[e.length-1];if(i!==void 0)e[0]=i;else if(s&&n){const o=s.readValue(n,a);o!=null&&(e[0]=o)}e[0]===void 0&&(e[0]=a),r&&i===void 0&&r.set(e[0])}mh(e)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(e=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,e),ve.delete(this)}cancel(){this.state==="scheduled"&&(ve.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Ih=t=>t.startsWith("--");function Eh(t,e,n){Ih(e)?t.style.setProperty(e,n):t.style[e]=n}const Sh=zn(()=>window.ScrollTimeline!==void 0),Ch={};function Ah(t,e){const n=zn(t);return()=>Ch[e]??n()}const Hi=Ah(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Ue=([t,e,n,s])=>`cubic-bezier(${t}, ${e}, ${n}, ${s})`,ar={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Ue([0,.65,.55,1]),circOut:Ue([.55,0,1,.45]),backIn:Ue([.31,.01,.66,-.59]),backOut:Ue([.33,1.53,.69,.99])};function $i(t,e){if(t)return typeof t=="function"?Hi()?Ni(t,e):"ease-out":Ei(t)?Ue(t):Array.isArray(t)?t.map(n=>$i(n,e)||ar.easeOut):ar[t]}function Ph(t,e,n,{delay:s=0,duration:r=300,repeat:i=0,repeatType:a="loop",ease:o="easeOut",times:c}={},u=void 0){const h={[e]:n};c&&(h.offset=c);const d=$i(o,r);Array.isArray(d)&&(h.easing=d);const l={delay:s,duration:r,easing:Array.isArray(d)?"linear":d,fill:"both",iterations:i+1,direction:a==="reverse"?"alternate":"normal"};return u&&(l.pseudoElement=u),t.animate(h,l)}function ji(t){return typeof t=="function"&&"applyToOptions"in t}function Rh({type:t,...e}){return ji(t)&&Hi()?t.applyToOptions(e):(e.duration??(e.duration=300),e.ease??(e.ease="easeOut"),e)}class kh extends ss{constructor(e){if(super(),this.finishedTime=null,this.isStopped=!1,!e)return;const{element:n,name:s,keyframes:r,pseudoElement:i,allowFlatten:a=!1,finalKeyframe:o,onComplete:c}=e;this.isPseudoElement=!!i,this.allowFlatten=a,this.options=e,qn(typeof e.type!="string");const u=Rh(e);this.animation=Ph(n,s,r,u,i),u.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!i){const h=ns(r,this.options,o,this.speed);this.updateMotionValue?this.updateMotionValue(h):Eh(n,s,h),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:e}=this;e==="idle"||e==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){this.isPseudoElement||this.animation.commitStyles?.()}get duration(){const e=this.animation.effect?.getComputedTiming?.().duration||0;return W(Number(e))}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+W(e)}get time(){return W(Number(this.animation.currentTime)||0)}set time(e){this.finishedTime=null,this.animation.currentTime=Fe(e)}get speed(){return this.animation.playbackRate}set speed(e){e<0&&(this.finishedTime=null),this.animation.playbackRate=e}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return Number(this.animation.startTime)}set startTime(e){this.animation.startTime=e}attachTimeline({timeline:e,observe:n}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,e&&Sh()?(this.animation.timeline=e,Le):n(this)}}const Wi={anticipate:wi,backInOut:_i,circInOut:Ti};function Oh(t){return t in Wi}function Dh(t){typeof t.ease=="string"&&Oh(t.ease)&&(t.ease=Wi[t.ease])}const or=10;class Mh extends kh{constructor(e){Dh(e),Fi(e),super(e),e.startTime&&(this.startTime=e.startTime),this.options=e}updateMotionValue(e){const{motionValue:n,onUpdate:s,onComplete:r,element:i,...a}=this.options;if(!n)return;if(e!==void 0){n.set(e);return}const o=new xi({...a,autoplay:!1}),c=Fe(this.finishedTime??this.time);n.setWithVelocity(o.sample(c-or).value,o.sample(c).value,or),o.stop()}}const cr=(t,e)=>e==="zIndex"?!1:!!(typeof t=="number"||Array.isArray(t)||typeof t=="string"&&(at.test(t)||t==="0")&&!t.startsWith("url("));function Nh(t){const e=t[0];if(t.length===1)return!0;for(let n=0;n<t.length;n++)if(t[n]!==e)return!0}function Lh(t,e,n,s){const r=t[0];if(r===null)return!1;if(e==="display"||e==="visibility")return!0;const i=t[t.length-1],a=cr(r,e),o=cr(i,e);return!a||!o?!1:Nh(t)||(n==="spring"||ji(n))&&s}function Fh(t){t.duration=0,t.type="keyframes"}const xh=new Set(["opacity","clipPath","filter","transform"]),Uh=zn(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function Vh(t){const{motionValue:e,name:n,repeatDelay:s,repeatType:r,damping:i,type:a}=t;if(!(e?.owner?.current instanceof HTMLElement))return!1;const{onUpdate:c,transformTemplate:u}=e.owner.getProps();return Uh()&&n&&xh.has(n)&&(n!=="transform"||!u)&&!c&&!s&&r!=="mirror"&&i!==0&&a!=="inertia"}const Bh=40;class Pd extends ss{constructor({autoplay:e=!0,delay:n=0,type:s="keyframes",repeat:r=0,repeatDelay:i=0,repeatType:a="loop",keyframes:o,name:c,motionValue:u,element:h,...d}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=K.now();const l={autoplay:e,delay:n,type:s,repeat:r,repeatDelay:i,repeatType:a,name:c,motionValue:u,element:h,...d},m=h?.KeyframeResolver||Bi;this.keyframeResolver=new m(o,(g,p,_)=>this.onKeyframesResolved(g,p,l,!_),c,u,h),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(e,n,s,r){this.keyframeResolver=void 0;const{name:i,type:a,velocity:o,delay:c,isHandoff:u,onUpdate:h}=s;this.resolvedAt=K.now(),Lh(e,i,a,o)||((Ge.instantAnimations||!c)&&h?.(ns(e,s,n)),e[0]=e[e.length-1],Fh(s),s.repeat=0);const l={startTime:r?this.resolvedAt?this.resolvedAt-this.createdAt>Bh?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...s,keyframes:e},m=!u&&Vh(l)?new Mh({...l,element:l.motionValue.owner.current}):new xi(l);m.finished.then(()=>this.notifyFinished()).catch(Le),this.pendingTimeline&&(this.stopTimeline=m.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(e,n){return this.finished.finally(e).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),Th()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(e){this.animation.time=e}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(e){this.animation.speed=e}get startTime(){return this.animation.startTime}attachTimeline(e){return this._animation?this.stopTimeline=this.animation.attachTimeline(e):this.pendingTimeline=e,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}const Hh=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function $h(t){const e=Hh.exec(t);if(!e)return[,];const[,n,s,r]=e;return[`--${n??s}`,r]}function Ki(t,e,n=1){const[s,r]=$h(t);if(!s)return;const i=window.getComputedStyle(e).getPropertyValue(s);if(i){const a=i.trim();return hl(a)?parseFloat(a):a}return Jn(r)?Ki(r,e,n+1):r}function Rd(t,e){return t?.[e]??t?.default??t}const jh=new Set(["width","height","top","left","right","bottom",...rs]),Wh={test:t=>t==="auto",parse:t=>t},qi=t=>e=>e.test(t),zi=[xe,T,Pe,te,Ll,Nl,Wh],ur=t=>zi.find(qi(t));function Kh(t){return typeof t=="number"?t===0:t!==null?t==="none"||t==="0"||dl(t):!0}const qh=new Set(["brightness","contrast","saturate","opacity"]);function zh(t){const[e,n]=t.slice(0,-1).split("(");if(e==="drop-shadow")return t;const[s]=n.match(Xn)||[];if(!s)return t;const r=n.replace(s,"");let i=qh.has(e)?1:0;return s!==n&&(i*=100),e+"("+i+r+")"}const Gh=/\b([a-z-]*)\(.*?\)/gu,Rn={...at,getAnimatableNone:t=>{const e=t.match(Gh);return e?e.map(zh).join(" "):t}},lr={...xe,transform:Math.round},Qh={rotate:te,rotateX:te,rotateY:te,rotateZ:te,scale:ft,scaleX:ft,scaleY:ft,scaleZ:ft,skew:te,skewX:te,skewY:te,distance:T,translateX:T,translateY:T,translateZ:T,x:T,y:T,z:T,perspective:T,transformPerspective:T,opacity:Qe,originX:Ys,originY:Ys,originZ:T},Yh={borderWidth:T,borderTopWidth:T,borderRightWidth:T,borderBottomWidth:T,borderLeftWidth:T,borderRadius:T,radius:T,borderTopLeftRadius:T,borderTopRightRadius:T,borderBottomRightRadius:T,borderBottomLeftRadius:T,width:T,maxWidth:T,height:T,maxHeight:T,top:T,right:T,bottom:T,left:T,padding:T,paddingTop:T,paddingRight:T,paddingBottom:T,paddingLeft:T,margin:T,marginTop:T,marginRight:T,marginBottom:T,marginLeft:T,backgroundPositionX:T,backgroundPositionY:T,...Qh,zIndex:lr,fillOpacity:Qe,strokeOpacity:Qe,numOctaves:lr},Jh={...Yh,color:M,backgroundColor:M,outlineColor:M,fill:M,stroke:M,borderColor:M,borderTopColor:M,borderRightColor:M,borderBottomColor:M,borderLeftColor:M,filter:Rn,WebkitFilter:Rn},Xh=t=>Jh[t];function Zh(t,e){let n=Xh(t);return n!==Rn&&(n=at),n.getAnimatableNone?n.getAnimatableNone(e):void 0}const ed=new Set(["auto","none","0"]);function td(t,e,n){let s=0,r;for(;s<t.length&&!r;){const i=t[s];typeof i=="string"&&!ed.has(i)&&Ye(i).values.length&&(r=t[s]),s++}if(r&&n)for(const i of e)t[i]=Zh(n,r)}class kd extends Bi{constructor(e,n,s,r,i){super(e,n,s,r,i,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:n,name:s}=this;if(!n||!n.current)return;super.readKeyframes();for(let c=0;c<e.length;c++){let u=e[c];if(typeof u=="string"&&(u=u.trim(),Jn(u))){const h=Ki(u,n.current);h!==void 0&&(e[c]=h),c===e.length-1&&(this.finalKeyframe=u)}}if(this.resolveNoneKeyframes(),!jh.has(s)||e.length!==2)return;const[r,i]=e,a=ur(r),o=ur(i);if(a!==o)if(ir(a)&&ir(o))for(let c=0;c<e.length;c++){const u=e[c];typeof u=="string"&&(e[c]=parseFloat(u))}else be[s]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:n}=this,s=[];for(let r=0;r<e.length;r++)(e[r]===null||Kh(e[r]))&&s.push(r);s.length&&td(e,s,n)}measureInitialState(){const{element:e,unresolvedKeyframes:n,name:s}=this;if(!e||!e.current)return;s==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=be[s](e.measureViewportBox(),window.getComputedStyle(e.current)),n[0]=this.measuredOrigin;const r=n[n.length-1];r!==void 0&&e.getValue(s,r).jump(r,!1)}measureEndState(){const{element:e,name:n,unresolvedKeyframes:s}=this;if(!e||!e.current)return;const r=e.getValue(n);r&&r.jump(this.measuredOrigin,!1);const i=s.length-1,a=s[i];s[i]=be[n](e.measureViewportBox(),window.getComputedStyle(e.current)),a!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=a),this.removedTransforms?.length&&this.removedTransforms.forEach(([o,c])=>{e.getValue(o).set(c)}),this.resolveNoneKeyframes()}}function nd(t,e,n){if(t instanceof EventTarget)return[t];if(typeof t=="string"){let s=document;const r=n?.[t]??s.querySelectorAll(t);return r?Array.from(r):[]}return Array.from(t)}const Od=(t,e)=>e&&typeof t=="number"?e.transform(t):t;function sd(t){return fi(t)&&"offsetHeight"in t}const hr=30,rd=t=>!isNaN(parseFloat(t));class id{constructor(e,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=s=>{const r=K.now();if(this.updatedAt!==r&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(s),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const i of this.dependents)i.dirty()},this.hasAnimated=!1,this.setCurrent(e),this.owner=n.owner}setCurrent(e){this.current=e,this.updatedAt=K.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=rd(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,n){this.events[e]||(this.events[e]=new pl);const s=this.events[e].add(n);return e==="change"?()=>{s(),Pt.read(()=>{this.events.change.getSize()||this.stop()})}:s}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,n){this.passiveEffect=e,this.stopPassiveEffect=n}set(e){this.passiveEffect?this.passiveEffect(e,this.updateAndNotify):this.updateAndNotify(e)}setWithVelocity(e,n,s){this.set(n),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-s}jump(e,n=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(e){this.dependents||(this.dependents=new Set),this.dependents.add(e)}removeDependent(e){this.dependents&&this.dependents.delete(e)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const e=K.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>hr)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,hr);return mi(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(e){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=e(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Dd(t,e){return new id(t,e)}const{schedule:Md}=Si(queueMicrotask,!1),H={x:!1,y:!1};function Gi(){return H.x||H.y}function Nd(t){return t==="x"||t==="y"?H[t]?null:(H[t]=!0,()=>{H[t]=!1}):H.x||H.y?null:(H.x=H.y=!0,()=>{H.x=H.y=!1})}function Qi(t,e){const n=nd(t),s=new AbortController,r={passive:!0,...e,signal:s.signal};return[n,r,()=>s.abort()]}function dr(t){return!(t.pointerType==="touch"||Gi())}function Ld(t,e,n={}){const[s,r,i]=Qi(t,n),a=o=>{if(!dr(o))return;const{target:c}=o,u=e(c,o);if(typeof u!="function"||!c)return;const h=d=>{dr(d)&&(u(d),c.removeEventListener("pointerleave",h))};c.addEventListener("pointerleave",h,r)};return s.forEach(o=>{o.addEventListener("pointerenter",a,r)}),i}const Yi=(t,e)=>e?t===e?!0:Yi(t,e.parentElement):!1,ad=t=>t.pointerType==="mouse"?typeof t.button!="number"||t.button<=0:t.isPrimary!==!1,od=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function cd(t){return od.has(t.tagName)||t.tabIndex!==-1}const vt=new WeakSet;function fr(t){return e=>{e.key==="Enter"&&t(e)}}function nn(t,e){t.dispatchEvent(new PointerEvent("pointer"+e,{isPrimary:!0,bubbles:!0}))}const ud=(t,e)=>{const n=t.currentTarget;if(!n)return;const s=fr(()=>{if(vt.has(n))return;nn(n,"down");const r=fr(()=>{nn(n,"up")}),i=()=>nn(n,"cancel");n.addEventListener("keyup",r,e),n.addEventListener("blur",i,e)});n.addEventListener("keydown",s,e),n.addEventListener("blur",()=>n.removeEventListener("keydown",s),e)};function pr(t){return ad(t)&&!Gi()}function Fd(t,e,n={}){const[s,r,i]=Qi(t,n),a=o=>{const c=o.currentTarget;if(!pr(o))return;vt.add(c);const u=e(c,o),h=(m,g)=>{window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",l),vt.has(c)&&vt.delete(c),pr(m)&&typeof u=="function"&&u(m,{success:g})},d=m=>{h(m,c===window||c===document||n.useGlobalTarget||Yi(c,m.target))},l=m=>{h(m,!1)};window.addEventListener("pointerup",d,r),window.addEventListener("pointercancel",l,r)};return s.forEach(o=>{(n.useGlobalTarget?window:o).addEventListener("pointerdown",a,r),sd(o)&&(o.addEventListener("focus",u=>ud(u,r)),!cd(o)&&!o.hasAttribute("tabindex")&&(o.tabIndex=0))}),i}function ld(t){return fi(t)&&"ownerSVGElement"in t}function xd(t){return ld(t)&&t.tagName==="svg"}const Ud=t=>!!(t&&t.getVelocity),hd=[...zi,M,at],Vd=t=>hd.find(qi(t));export{Fd as $,Fe as A,Fh as B,Pd as C,kd as D,jh as E,ad as F,se as G,Rt as H,Gn as I,xi as J,Bi as K,W as L,Ge as M,pi as N,we as O,Id as P,Nd as Q,Pe as R,pl as S,Le as T,ul as U,ll as V,bl as W,ld as X,xd as Y,Ed as Z,Ld as _,Sd as a,Xi as a0,dd as a1,fd as a2,x as a3,V as a4,Re as a5,pd as a6,md as a7,wd as a8,_d as a9,vd as aa,gd as ab,rs as b,Od as c,Ud as d,Dd as e,K as f,Td as g,Pt as h,Yo as i,Cl as j,hl as k,dl as l,xt as m,Yh as n,yd as o,T as p,Vd as q,at as r,bd as s,Ad as t,Zh as u,Md as v,rr as w,Cd as x,Xh as y,Rd as z};

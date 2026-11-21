/* Many Ways Math offline helper. Change VERSION when you want every device to drop its old copy. */
const VERSION='mwm-v2';
const SHELL=['./','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const keep=(key,res)=>{if(res&&res.ok&&!res.redirected){const c=res.clone();caches.open(VERSION).then(x=>x.put(key,c))}return res};
// Try the network, but if it is slow or missing, use the saved copy (weak Wi-Fi should not leave a blank screen).
const netFirst=(req,key,ms)=>new Promise(done=>{let settled=false;const useCache=()=>caches.match(key,{ignoreSearch:true}).then(c=>{if(c&&!settled){settled=true;done(c)}return c});
  const t=setTimeout(useCache,ms);
  fetch(req).then(r=>{clearTimeout(t);keep(key,r);if(!settled){settled=true;done(r)}}).catch(()=>{clearTimeout(t);useCache().then(c=>{if(!settled){settled=true;done(c||Response.error())}})})});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.hostname.endsWith('supabase.co')||u.hostname.endsWith('supabase.in'))return; // account data is never cached
  if(req.mode==='navigate'){e.respondWith(netFirst(req,'./',3000));return}
  if(u.origin===location.origin){
    if(/\.(png|svg|ico|webmanifest)$/.test(u.pathname)){e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>keep(req,r))));return}
    e.respondWith(netFirst(req,req,3000));return}
  if(u.hostname==='fonts.gstatic.com'){e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>keep(req,r))));return}
  if(u.hostname==='fonts.googleapis.com'){e.respondWith(caches.match(req).then(c=>{const f=fetch(req).then(r=>keep(req,r)).catch(()=>c);return c||f}))}
});

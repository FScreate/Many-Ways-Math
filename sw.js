/* Many Ways Math offline helper. Change VERSION when you want every phone to drop its old copy. */
const VERSION='mwm-v1';
const SHELL=['./','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const keep=(req,res)=>{if(res&&res.ok&&!res.redirected){const c=res.clone();caches.open(VERSION).then(x=>x.put(req,c))}return res};
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.hostname.endsWith('supabase.co')||u.hostname.endsWith('supabase.in'))return; // account data is never cached
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>keep(new Request('./'),r)).catch(()=>caches.match('./')));return}
  if(u.origin===location.origin){
    if(/\.(png|svg|ico|webmanifest)$/.test(u.pathname)){e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>keep(req,r))));return}
    e.respondWith(fetch(req).then(r=>keep(req,r)).catch(()=>caches.match(req)));return}
  if(u.hostname==='esm.sh'||u.hostname==='fonts.gstatic.com'){e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>keep(req,r))));return}
  if(u.hostname==='fonts.googleapis.com'){e.respondWith(caches.match(req).then(c=>{const f=fetch(req).then(r=>keep(req,r)).catch(()=>c);return c||f}))}
});

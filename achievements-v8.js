(function(){
const symbols={
doc1:'<circle cx="25" cy="25" r="12"/><path d="m35 35 14 14M21 21h7"/>',
doc5:'<path d="M8 22h19l6 5h23v25H8zM8 22v-8h22l5 6h21v7M20 37h26M20 44h16"/>',
doc13:'<rect x="15" y="9" width="33" height="44" rx="3"/><path d="M22 19h18M22 27h18M22 35h11m4 6 5 5 11-14"/>',
mini6:'<path d="M34 5 14 35h16l-4 24 25-35H35z"/>',
mini12:'<rect x="13" y="13" width="38" height="38" rx="6"/><rect x="24" y="24" width="16" height="16" rx="2"/><path d="M29 6v7m10-7v7M29 51v7m10-7v7M6 29h7m-7 10h7m38-10h7m-7 10h7"/>',
mini24:'<path d="M21 11h22v15c0 9-5 14-11 14s-11-5-11-14zM21 18h-9v7c0 6 5 10 12 10m19-17h9v7c0 6-5 10-12 10M32 40v9m-12 5h24"/><path d="m32 17 3 6 6 .8-4.5 4.4 1 6-5.5-3-5.5 3 1-6-4.5-4.4 6-.8z"/>',
r10:'<path d="M17 9h24l7 8v37H17zM41 9v10h7M24 28h15m-15 8h10m-7 15 14-16 6 5-14 16-9 3z"/>',
r27:'<circle cx="32" cy="24" r="14"/><path d="m32 15 3 6 6.5 1-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.5-1zM22 37l-6 20 16-8 16 8-6-20"/>'
};
const limits={doc1:1,doc5:5,doc13:13,mini6:6,mini12:12,mini24:24,r10:10,r27:27};
function count(id){return id.startsWith('doc')?v2.opened.length:id.startsWith('mini')?miniWon():progress()}
function emblem(id,on){return '<svg viewBox="0 0 64 64" fill="none" stroke="'+(on?'#ffdb8a':'#9cb3c2')+'" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(symbols[id]||symbols.doc1)+'</svg>'}
rewardPanel=function(){return '<section class="reward-panel"><div class="reward-top"><div><span class="eyebrow">COLLECTION DE SUCCÈS</span><h2>✦ '+esc(grade())+'</h2></div><div class="xp-number">'+scoreXP()+' <small>XP</small></div></div><p class="reward-explain">Gagnez les emblèmes de l’enquête en consultant les pièces et en réussissant les défis. Les XP sont indépendants de la note sur 20.</p><div class="badge-grid">'+badgeDefs.map(b=>{let on=b.ok(),n=Math.min(count(b.id),limits[b.id]),pct=n/limits[b.id]*100;return '<article class="reward-badge '+(on?'unlocked':'locked')+'" data-badge="'+b.id+'">'+(on?'<span class="achievement-ribbon">SUCCÈS</span>':'')+'<div class="achievement-emblem">'+emblem(b.id,on)+'</div><b class="achievement-title">'+esc(b.name)+'</b><p class="achievement-description">'+esc(b.desc)+'</p><div class="achievement-status">'+(on?'✦ DÉBLOQUÉ':'◇ À GAGNER')+'</div>'+(!on?'<div class="achievement-progress"><small>'+n+' / '+limits[b.id]+'</small><div class="achievement-meter"><span style="width:'+pct+'%"></span></div></div>':'')+'</article>'}).join('')+'</div></section>'};
let previous=null,hideTimer;
const originalRender=render;
render=function(){originalRender();const now=new Set(badgeDefs.filter(b=>b.ok()).map(b=>b.id));if(previous!==null){const newly=badgeDefs.find(b=>now.has(b.id)&&!previous.has(b.id));if(newly){const el=document.querySelector('[data-badge="'+newly.id+'"]');el?.classList.add('achievement-new');let toast=document.getElementById('achievement-toast');if(!toast){toast=document.createElement('div');toast.id='achievement-toast';toast.setAttribute('role','status');document.body.appendChild(toast)}toast.innerHTML='<span class="toast-star">✦</span><div><small>SUCCÈS DÉBLOQUÉ</small><strong>'+esc(newly.name)+'</strong><p>'+esc(newly.desc)+'</p></div>';toast.classList.add('show');clearTimeout(hideTimer);hideTimer=setTimeout(()=>toast.classList.remove('show'),4200)}}previous=now};
render();
})();
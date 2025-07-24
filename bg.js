<script>
(() => {
  const BG_KEY = 'bgIndex';
  const MAX_INDEX = 20;
  let BACKGROUNDS = [];

  // Make BACKGROUNDS discoverable from any page
  discover().then(() => {
    const stored = +localStorage.getItem(BG_KEY) || 0;
    const safeIdx = (stored >= 0 && stored < BACKGROUNDS.length) ? stored : 0;
    apply(safeIdx);
    // expose a function globally if index.html needs cycling
    window.__cycleBg = () => {
      if(!BACKGROUNDS.length) return;
      const next = ( ( +localStorage.getItem(BG_KEY) || 0 ) + 1 ) % BACKGROUNDS.length;
      preloadAndSet(next);
    };
  });

  function discover(){
    const probes = [];
    for(let i=1;i<=MAX_INDEX;i++){
      probes.push(test(`assets/view${i}.jpg`, i));
    }
    return Promise.all(probes).then(r=>{
      BACKGROUNDS = r.filter(x=>x.ok).sort((a,b)=>a.num-b.num).map(x=>x.url);
      if(!BACKGROUNDS.length) BACKGROUNDS = ['assets/view1.jpg'];
    });
  }
  function test(url,num){
    return new Promise(res=>{
      const img = new Image();
      img.onload = ()=>res({ok:true,url,num});
      img.onerror = ()=>res({ok:false,url,num});
      img.src = url;
    });
  }
  function apply(i){
    document.body.style.setProperty('--bg-img', `url('${BACKGROUNDS[i]}')`);
    localStorage.setItem(BG_KEY, String(i));
  }
  function preloadAndSet(next){
    const img = new Image();
    img.onload = ()=>apply(next);
    img.onerror = ()=>{}; // ignore bad
    img.src = BACKGROUNDS[next];
  }
})();
</script>
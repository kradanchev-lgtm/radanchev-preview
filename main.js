(function(){
  var d=document,root=d.documentElement,calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s){return d.querySelector(s)},$$=function(s){return [].slice.call(d.querySelectorAll(s))};
  var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
  var pb=$('#pb'),pd=$('#pd'),dock=$('#dock'),stage=$('#stage'),rail=$('.rail'),stops=$$('.stop'),spans=$$('.rail span');
  var contact=$('#kontakt'),links=$$('.pill nav a'),secs=links.map(function(a){return $(a.getAttribute('href'))});
  if(!calm&&'IntersectionObserver' in window)root.classList.add('js');

  var words=[],lit=$('#lit');
  if(root.classList.contains('js')&&lit){
    lit.setAttribute('aria-label',lit.textContent);
    lit.innerHTML=lit.textContent.split(' ').map(function(w){return '<span class="w" aria-hidden="true">'+w+'</span>'}).join(' ');
    words=[].slice.call(lit.children);
  }
  function frame(){
    var vh=innerHeight,m=root.scrollHeight-vh,y=scrollY,p=m>0?clamp(y/m,0,1):0,v=(p*100).toFixed(2)+'%';
    pb.style.width=v;pd.style.left=v;
    var inContact=contact.getBoundingClientRect().top<vh*.72;
    dock.classList.toggle('show',y>vh*.55&&!inContact);
    if(!calm&&stage)stage.style.setProperty('--p',clamp(y/vh,0,1).toFixed(3));
    links.forEach(function(a,i){var r=secs[i].getBoundingClientRect();a.classList.toggle('on',r.top<vh*.4&&r.bottom>vh*.4)});
    if(root.classList.contains('js')&&stops.length&&innerWidth>980){
      var best=0,bd=1e9;
      stops.forEach(function(s,i){var r=s.getBoundingClientRect(),c=Math.abs(r.top+r.height/2-vh*.5);if(c<bd){bd=c;best=i}});
      stops.forEach(function(s,i){s.classList.toggle('on',i===best)});
      spans.forEach(function(s,i){s.classList.toggle('on',i<=best)});
      var a=stops[0].getBoundingClientRect(),b=stops[stops.length-1].getBoundingClientRect();
      var q=clamp((vh*.5-(a.top+a.height/2))/((b.top+b.height/2)-(a.top+a.height/2)),0,1);
      rail.style.setProperty('--w',(q*100).toFixed(1)+'%');
    }
    if(words.length){
      var r=lit.getBoundingClientRect(),t=clamp((vh*.86-r.top)/(r.height+vh*.34),0,1),n=Math.round(t*words.length);
      words.forEach(function(w,i){w.classList.toggle('on',i<n)});
    }
  }
  var tick=false;function req(){if(!tick){tick=true;requestAnimationFrame(function(){tick=false;frame()})}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();

  function count(el){
    var to=+el.dataset.count,pre=el.dataset.pre||'',suf=el.dataset.suf||'',t0=null;
    var final=pre+to+suf,done=false;
    function s(t){if(done)return;t0=t0||t;var k=clamp((t-t0)/1300,0,1),e=1-Math.pow(1-k,3);el.textContent=pre+Math.round(to*e)+suf;if(k<1)requestAnimationFrame(s);else done=true}
    requestAnimationFrame(s);
    setTimeout(function(){done=true;el.textContent=final},1500);
  }
  if(root.classList.contains('js')){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('on');io.unobserve(e.target)})},{rootMargin:'0px 0px -7% 0px'});
    $$('.r').forEach(function(n){io.observe(n)});
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;count(e.target);cio.unobserve(e.target)})},{threshold:.6});
    $$('[data-count]').forEach(function(n){cio.observe(n)});
  }
  if(matchMedia('(hover:hover)').matches&&!calm){
    $$('.stop,.st-chip,.panel,.pill').forEach(function(n){
      n.classList.add('spec');
      n.addEventListener('pointermove',function(e){var r=n.getBoundingClientRect();n.style.setProperty('--mx',(e.clientX-r.left)+'px');n.style.setProperty('--my',(e.clientY-r.top)+'px')});
    });
  }
  var toast=$('#toast'),tt,copy=$('#copy');
  function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},2200)}
  copy.addEventListener('click',function(){
    var v=copy.dataset.v;
    if(navigator.clipboard&&isSecureContext){navigator.clipboard.writeText(v).then(function(){say('Имейлът е копиран')},function(){location.href='mailto:'+v})}
    else location.href='mailto:'+v;
  });
})();

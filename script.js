(function(){
'use strict';
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var touch=window.matchMedia('(hover: none)').matches;
var $=window.jQuery, WA='917522902308', MAIL='sachinchouvhan49@gmail.com';
function $q(s){return document.querySelector(s)}

/* AOS */
if(window.AOS){AOS.init({duration:reduce?0:800,once:true,offset:60})}

/* hero heading: character reveal */
var title=$q('#heroTitle');
if(title){
  var txt=title.textContent;title.setAttribute('aria-label',txt);title.textContent='';
  txt.split(' ').forEach(function(w,wi,arr){
    var word=document.createElement('span');word.style.display='inline-block';word.setAttribute('aria-hidden','true');
    w.split('').forEach(function(c){var s=document.createElement('span');s.className='ch';s.textContent=c;word.appendChild(s)});
    title.appendChild(word);if(wi<arr.length-1)title.appendChild(document.createTextNode(' '));
  });
  var chars=title.querySelectorAll('.ch');
  if(window.gsap&&!reduce){gsap.to(chars,{opacity:1,y:0,duration:.7,stagger:.03,ease:'power3.out',delay:.3})}
  else{chars.forEach(function(c){c.style.opacity=1;c.style.transform='none'})}
}

/* floating particles */
var pc=$q('#particles');
if(pc&&!reduce){
  var n=window.innerWidth<768?10:22;
  for(var i=0;i<n;i++){var p=document.createElement('i');
    p.style.left=Math.random()*100+'%';p.style.width=p.style.height=(5+Math.random()*9)+'px';
    p.style.animationDuration=(8+Math.random()*10)+'s';p.style.animationDelay=(-Math.random()*12)+'s';pc.appendChild(p)}
}

/* navbar solid on scroll */
function navState(){$q('#nav').classList.toggle('solid',window.scrollY>60)}

/* scroll: progress, hero parallax, expanding image */
var heroBg=$q('#heroBg'),exp=$q('#expandImg'),ticking=false;
function onScroll(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  $q('#progress').style.width=(h>0?window.scrollY/h*100:0)+'%';
  navState();
  if(heroBg&&!reduce&&window.scrollY<window.innerHeight){heroBg.style.transform='translateY('+(window.scrollY*.25)+'px)'}
  if(exp){
    var r=exp.parentElement.getBoundingClientRect(),vh=window.innerHeight;
    var t=Math.min(1,Math.max(0,(vh-r.top)/(vh*0.9)));
    var mobile=window.innerWidth<576, from=mobile?240:350, to=mobile?420:Math.min(650,Math.round(vh*.8));
    exp.style.height=(from+(to-from)*t)+'px';
    exp.style.borderRadius=(60-40*t)+'px';
  }
  ticking=false;
}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
window.addEventListener('resize',onScroll);onScroll();

/* counters */
var counters=document.querySelectorAll('.count');
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;io.unobserve(e.target);
  var el=e.target,to=+el.dataset.to,sep=el.dataset.sep!=='0';
  if(reduce){el.textContent=sep?to.toLocaleString():to;return}
  var t0=performance.now();(function step(t){var k=Math.min(1,(t-t0)/1600),v=Math.round(to*(1-Math.pow(1-k,3)));
    el.textContent=sep?v.toLocaleString():v;if(k<1)requestAnimationFrame(step)})(t0);
})},{threshold:.5});
counters.forEach(function(c){io.observe(c)});

/* pack image clip reveal via ScrollTrigger */
if(window.gsap&&window.ScrollTrigger&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo('#packImg',{clipPath:'inset(18% 12% 18% 12% round 40px)',scale:1.15},{clipPath:'inset(0% 0% 0% 0% round 22px)',scale:1,ease:'none',scrollTrigger:{trigger:'#packImg',start:'top 90%',end:'top 35%',scrub:true}});
}

/* desktop pointer effects */
if(!touch&&!reduce){
  var cur=$q('#cursor'),glow=$q('#heroGlow');
  document.addEventListener('mousemove',function(e){
    cur.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';
    if(glow){var r=glow.parentElement.getBoundingClientRect();glow.style.left=(e.clientX-r.left)+'px';glow.style.top=(e.clientY-r.top)+'px'}
  });
  document.querySelectorAll('a,button,.fcard,.stat').forEach(function(el){
    el.addEventListener('mouseenter',function(){cur.classList.add('big')});el.addEventListener('mouseleave',function(){cur.classList.remove('big')})});
  document.querySelectorAll('.magnetic').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.2)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)'});
    b.addEventListener('mouseleave',function(){b.style.transform=''})});
  document.querySelectorAll('.tilt').forEach(function(c){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='perspective(900px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg)'});
    c.addEventListener('mouseleave',function(){c.style.transform=''})});
}

/* close mobile menu after link tap */
if($){$('#menu .nav-link:not(.dropdown-toggle), #menu .dropdown-item, #menu .btn').on('click',function(){
  var m=document.getElementById('menu');if(m.classList.contains('show')&&window.bootstrap){bootstrap.Collapse.getOrCreateInstance(m).hide()}});}

/* product quote button prefill */
document.querySelectorAll('[data-product]').forEach(function(b){b.addEventListener('click',function(){$q('#fProduct').value=b.dataset.product})});

/* form: validation + WhatsApp / email */
function collect(){
  var v=function(id){return $q(id).value.trim()};
  var f={name:v('#fName'),company:v('#fCompany'),email:v('#fEmail'),phone:v('#fPhone'),country:v('#fCountry'),product:v('#fProduct'),qty:v('#fQty'),msg:v('#fMsg')};
  var bad=[];['#fName','#fEmail','#fPhone','#fCountry'].forEach(function(id){$q(id).classList.remove('bad')});
  if(!f.name)bad.push('#fName');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))bad.push('#fEmail');
  if(!/^[+\d][\d\s\-()]{6,}$/.test(f.phone))bad.push('#fPhone');
  if(!f.country)bad.push('#fCountry');
  bad.forEach(function(id){$q(id).classList.add('bad')});
  $q('#formErr').textContent=bad.length?'Please complete the highlighted fields with valid details.':'';
  return bad.length?null:f;
}
function body(f){return 'Hello Agro Haldi India,\n\nName: '+f.name+'\nCompany: '+(f.company||'-')+'\nEmail: '+f.email+'\nMobile: '+f.phone+'\nCountry: '+f.country+'\nProduct: '+(f.product||'-')+'\nQuantity: '+(f.qty||'-')+'\nMessage: '+(f.msg||'-')}
$q('#sendWA').addEventListener('click',function(){var f=collect();if(f)window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(body(f)),'_blank','noopener')});
$q('#sendMail').addEventListener('click',function(){var f=collect();if(f)window.location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Turmeric inquiry from '+f.name)+'&body='+encodeURIComponent(body(f))});
})();

(() => {
'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = $('.motion-toggle');
let manuallyReduced = null;
try { const stored = localStorage.getItem('robin-motion'); if (stored !== null) manuallyReduced = stored === 'reduce'; } catch (_) { /* Private mode: use system preference. */ }
let reduce = preference.matches || manuallyReduced === true;
function applyMotion() {
 reduce = preference.matches || manuallyReduced === true;
 document.body.classList.toggle('reduce-motion', reduce);
 motionButton.setAttribute('aria-pressed', String(reduce));
 motionButton.setAttribute('aria-label', preference.matches ? '系统已设置减少动态效果' : (reduce ? '启用动态效果' : '减少动态效果'));
 $('.motion-label').textContent = reduce ? '动效关' : '动效开';
 motionButton.disabled = preference.matches;
 if (reduce) { $$('.reveal').forEach(el => el.classList.remove('pending')); $('.landscape img').style.transform = ''; }
}
motionButton.hidden = false;
motionButton.addEventListener('click', () => { manuallyReduced = !reduce; try { localStorage.setItem('robin-motion', manuallyReduced ? 'reduce' : 'full'); } catch (_) {} applyMotion(); });
preference.addEventListener('change', applyMotion); applyMotion();
document.body.classList.add('js-ready');

// Tabs are progressive enhancement: all three stories remain readable without JS.
const tabs = $$('[role="tab"]'), projects = $$('.project');
function selectProject(tab, focus = false, remember = false) {
 tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
 projects.forEach(p => { const on = p.id === tab.getAttribute('aria-controls'); p.hidden = !on; p.classList.toggle('is-entering', on); });
 if (focus) tab.focus();
 if (remember) {
  const hash = '#' + tab.getAttribute('aria-controls');
  if (location.hash !== hash) history.pushState(null, '', hash);
 }
 document.dispatchEvent(new Event('contentchange'));
}
projects.forEach((p,i) => { p.setAttribute('role','tabpanel'); p.setAttribute('aria-labelledby', tabs[i].id); p.tabIndex = 0; });
$('.project-tabs').hidden = false;
function projectFromHash() { return tabs.find(t => '#' + t.getAttribute('aria-controls') === location.hash); }
selectProject(projectFromHash() || tabs[0]);
function restoreProject() {
 const target = projectFromHash();
 if (target) {
  selectProject(target);
  requestAnimationFrame(() => document.getElementById(target.getAttribute('aria-controls')).scrollIntoView({behavior:'instant',block:'start'}));
 } else if (['', '#work', '#top', '#main'].includes(location.hash)) {
  // The ordinary work anchor always represents its initial, first story.
  selectProject(tabs[0]);
 }
}
addEventListener('hashchange', restoreProject);
addEventListener('popstate', restoreProject);
if (projectFromHash()) requestAnimationFrame(restoreProject);
tabs.forEach((tab,index) => {
 tab.addEventListener('click', () => selectProject(tab, false, true));
 tab.addEventListener('keydown', e => { let next; if (e.key === 'ArrowRight') next = (index+1)%tabs.length; else if (e.key === 'ArrowLeft') next = (index-1+tabs.length)%tabs.length; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = tabs.length-1; if (next !== undefined) { e.preventDefault(); selectProject(tabs[next], true, true); } });
});

if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => { if (isIntersecting) { target.classList.remove('pending'); observer.unobserve(target); } }), { threshold:.08 });
 $$('.reveal').forEach(el => { if (!reduce && el.getBoundingClientRect().top > innerHeight) el.classList.add('pending'); observer.observe(el); });
}

const topics = {
 'AI 与业务': ['有一道重复的工作流程，想聊聊 AI 能不能帮上忙。', '我想聊聊 AI 与业务', 'Robin，你好！\n\n我所在的行业是：\n目前反复遇到的问题是：\n希望与你聊聊：\n'],
 '黑客松与合作': ['想一起办一场活动，或让合适的创造者认识彼此。', '想聊聊黑客松与合作', 'Robin，你好！\n\n我们正在做的活动或项目是：\n希望一起尝试的是：\n'],
 '认识一下': ['不必先有完整的方案，从一个共同感兴趣的问题开始。', '你好 Robin，想认识一下', 'Robin，你好！\n\n我是：\n在你的主页上看到：\n想和你交流：\n']
};
function chooseTopic(button) { const [hint,subject,body] = topics[button.dataset.topic]; $$('[data-topic]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); $('#contact-hint').textContent = hint; $('#email-link').href = `mailto:weiyangfang950@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }
$('.contact-options').hidden = false;
$$('[data-topic]').forEach(b => b.addEventListener('click', () => chooseTopic(b))); chooseTopic($('[data-topic]'));
let statusTimer, copyAttempt = 0;
$$('[data-copy]').forEach(button => {
 button.hidden = false;
 const originalLabel = button.textContent;
 let labelTimer;
 button.addEventListener('click', async () => {
  const attempt = ++copyAttempt;
  const text = button.dataset.copy;
  const status = $('.copy-status');
  clearTimeout(statusTimer); clearTimeout(labelTimer);
  button.textContent = originalLabel;
  try {
   if (!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
   await navigator.clipboard.writeText(text);
   if (attempt !== copyAttempt) return;
   button.textContent = '已复制 ✓'; status.textContent = `${text} 已复制`;
  } catch (_) {
   if (attempt !== copyAttempt) return;
   status.textContent = '未能自动复制，请选择上方文字手动复制。';
  }
  labelTimer = setTimeout(() => { button.textContent = originalLabel; }, 2600);
  statusTimer = setTimeout(() => { status.textContent = ''; }, 5000);
 });
});

// Real project photos; native dialog supplies the modal focus boundary and Escape behavior.
const photoDialog = $('.photo-dialog');
let photoOpener = null;
if (photoDialog && typeof photoDialog.showModal === 'function') {
 $$('[data-photo]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault(); photoOpener = link;
  const img = $('img', photoDialog);
  img.src = link.href; img.alt = $('img', link).alt;
  $('#photo-title').textContent = link.dataset.photo === '交流' ? '坐下来，认识一个正在做事的人。' : link.dataset.photo === '分享' ? '把自己的问题，放到桌上聊。' : link.dataset.photo;
  $('.photo-credit').textContent = link.dataset.credit || 'Linkathon《第一场线下交流会》活动照片';
  photoDialog.showModal(); document.body.classList.add('photo-open');
 }));
 $('.photo-close').addEventListener('click', () => photoDialog.close());
 photoDialog.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
   const controls = $$('button, a[href], [tabindex="0"]', photoDialog);
   const first = controls[0], last = controls[controls.length - 1];
   if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
   else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
 });
 photoDialog.addEventListener('click', e => {
  if (e.target !== photoDialog) return;
  const r = photoDialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) photoDialog.close();
 });
 photoDialog.addEventListener('close', () => { document.body.classList.remove('photo-open'); photoOpener?.focus({preventScroll:true}); });
}

// Native scroll, one frame at a time. No scroll trapping or endless animation loop.
const hero = $('.hero'), landscape = $('.landscape img'), progress = $('.reading-progress span');
let scheduled = false;
function updateScroll() { scheduled = false; document.body.classList.toggle('has-scrolled',scrollY > 70); const range = document.documentElement.scrollHeight-innerHeight; progress.style.transform = `scaleX(${range > 0 ? Math.min(1,Math.max(0,scrollY/range)) : 0})`; if (!reduce && innerWidth>760 && scrollY<hero.offsetHeight) landscape.style.transform = `translateY(${Math.min(scrollY*.1,70)}px) scale(1.02)`; }
function scheduleScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }
addEventListener('scroll', scheduleScroll, {passive:true});
document.addEventListener('contentchange', scheduleScroll);
document.addEventListener('toggle', scheduleScroll, true);
if ('ResizeObserver' in window) new ResizeObserver(scheduleScroll).observe(document.body);
addEventListener('resize', () => { if (innerWidth<=760) landscape.style.transform=''; updateScroll(); }, {passive:true}); updateScroll();

// Brief ink ripples respond to the visitor; the canvas rests when there is no input.
const canvas = $('#ink-water'), ctx = canvas.getContext('2d');
if (!ctx) return;
let ripples = [], frame = 0, last = 0, width = 0, height = 0;
function sizeCanvas() { width = hero.clientWidth; height = hero.clientHeight; const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width=width*ratio; canvas.height=height*ratio; ctx.setTransform(ratio,0,0,ratio,0,0); }
sizeCanvas(); addEventListener('resize',sizeCanvas,{passive:true});
function draw(time) {
 frame=0; ctx.clearRect(0,0,width,height);
 if (reduce || document.hidden || scrollY>height) { ripples=[]; return; }
 ripples = ripples.filter(r => time-r.time < 1600);
 ripples.forEach(r => { const t=(time-r.time)/1600; ctx.strokeStyle=`rgba(47,108,109,${(1-t)*.2})`; ctx.lineWidth=.7; ctx.beginPath(); ctx.ellipse(r.x,r.y,8+t*64,3+t*20,0,0,Math.PI*2); ctx.stroke(); });
 if (ripples.length) frame=requestAnimationFrame(draw);
}
function ripple(e) { if (reduce || e.target.closest('a,button')) return; const now=performance.now(); if (now-last<160) return; last=now; const rect=hero.getBoundingClientRect(); ripples.push({x:e.clientX-rect.left,y:e.clientY-rect.top,time:now}); if(ripples.length>12) ripples.shift(); if (!frame) frame=requestAnimationFrame(draw); }
hero.addEventListener('pointermove', e => { if(e.pointerType === 'mouse') ripple(e); },{passive:true});
hero.addEventListener('pointerdown',ripple,{passive:true});
document.addEventListener('visibilitychange', () => { if(document.hidden) { cancelAnimationFrame(frame); frame=0; ripples=[]; ctx.clearRect(0,0,width,height); } });
})();

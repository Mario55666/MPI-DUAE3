/* app.js — Lógica de interacción IDC 2026
   Bloques: (1) núcleo de navegación/UI, (2) mini-app VR autofinanciada + WGEN,
   (3) modo páginas (pestañas). Requiere assets/wgen-templates.js cargado antes. */

/* =============================================
   LOGO BASE64 INJECTION
============================================= */
/* Logo servido desde assets/logo-idc.jpg; con fallback SVG si no carga */
const logoSrc = 'assets/logo-idc.jpg';
['heroLogo','navLogo','footerLogo'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.src = logoSrc;
    el.onerror = function() {
      /* Fallback: render text logo if image not found */
      var _id=this.id, _foot=_id==='footerLogo', _big=_id==='heroLogo';
      var blue=_foot?'#ffffff':'#0072b9', gray=_foot?'#ffffff':'#545452', sub=_foot?'rgba(255,255,255,.85)':'#8a8a8a', dot=_foot?'#ffffff':'#f3a100';
      var hh=_big?72:(_foot?52:30);
      var wrap=document.createElement('div');
      wrap.style.cssText=(_big||_foot)?('display:block;text-align:center;margin:0 auto '+(_big?'1.5rem':'1rem')+';'):'display:inline-block;margin-right:.5rem;vertical-align:middle;';
      wrap.innerHTML='<svg height="'+hh+'" viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IDC Diseño y Comunicación"><circle cx="38" cy="44" r="26" fill="'+dot+'"/><text x="0" y="170" font-family="Nunito,sans-serif" font-weight="900" font-size="150" fill="'+blue+'" letter-spacing="-4">idc</text><text x="300" y="86" font-family="Nunito,sans-serif" font-weight="800" font-size="56" fill="'+gray+'">diseño &amp;</text><text x="300" y="146" font-family="Nunito,sans-serif" font-weight="800" font-size="56" fill="'+gray+'">comunicación</text><text x="2" y="196" font-family="Nunito,sans-serif" font-weight="400" font-size="29" fill="'+sub+'" letter-spacing="1">Instituto de Educación Superior Público</text></svg>';
      this.replaceWith(wrap);
    };
  }
});

/* =============================================
   AREA DATA
============================================= */
const areaData = {
  int: { label:"Diseño de Interiores",     accent:"#0072b9",
    lines:["Sostenibilidad en el diseño de interiores","Diseño de interiores para espacios reducidos","Tecnología y domótica en el diseño","Diseño inclusivo y accesible","Bienestar y ergonomía en espacios comerciales"] },
  pub: { label:"Diseño Publicitario",       accent:"#f3a100",
    lines:["Estrategias de publicidad digital","Psicología del color en Publicidad","Publicidad sostenible","Innovación en publicidad interactiva","Identidad corporativa y branding"] },
  mod: { label:"Diseño de Modas",           accent:"#00a0c6",
    lines:["Moda sostenible y reciclaje textil","Innovación textil","Diseño de moda inclusivo","Tendencias y consumo responsable","Tecnología en la Moda"] },
  cav: { label:"Comunicación Audiovisual",  accent:"#2ecc71",
    lines:["Narrativas digitales y transmedia","Cine y documental social","Innovación en técnicas de postproducción","Producción audiovisual de bajo presupuesto","Producción audiovisual en plataformas digitales"] }
};

/* =============================================
   CRITERIA FOR INNOVATION PROJECTS
============================================= */
const criteriaData = [
  { area:"Diseño de Interiores", color:"#0072b9", icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M2 8h14M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    items:["Innovación incremental: actualizar materiales con tecnología BIM y sensores IoT para domótica","Innovación disruptiva: integrar gemelos digitales para simular espacios antes de construir","Indicador ROAS: evaluar retorno de campañas digitales de firmas de diseño de interiores","Criterio LTV: medir la relación cliente-estudio a lo largo de múltiples proyectos","Sostenibilidad medible con métricas de eficiencia energética (ISO 50001)"] },
  { area:"Diseño Publicitario", color:"#f3a100", icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 7h2.5l7.5-4v12l-7.5-4H2.5a.8.8 0 01-.8-.8v-2.4a.8.8 0 01.8-.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M5 13v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M12 6.5c1.2.4 1.7 1.2 1.7 2.5s-.5 2-1.7 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    items:["Medir ROAS en campañas digitales: objetivo mínimo ROAS 3:1 para validar inversión tecnológica","Optimizar CAC mediante automatización con IA (chatbots, segmentación predictiva)","Innovación incremental: A/B testing de creatividades con herramientas de IA generativa","Innovación disruptiva: publicidad interactiva con AR/VR y experiencias inmersivas","Indicador de branding: Net Promoter Score (NPS) como medida de valor de identidad corporativa"] },
  { area:"Diseño de Modas", color:"#00a0c6", icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 2.5l-2.5 3 5 1.5 5-1.5L12 2.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M4.5 5.5l-2.5 10h16l-2.5-10" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 7v6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    items:["LTV como criterio de sostenibilidad: fidelización de cliente en moda circular y slow fashion","CAC en e-commerce de moda: optimizar embudo digital con prueba virtual de prendas (AR)","Innovación radical: integrar textiles inteligentes con sensores biométricos y wearables","Criterio de impacto ambiental: huella de carbono por colección como KPI de innovación","Plataformas digitales: evaluar conversión y retorno en marketplaces de moda sostenible"] },
  { area:"Comunicación Audiovisual", color:"#2ecc71", icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="4.5" width="15" height="10.5" rx="1.5" stroke="currentColor" stroke-width="1.4"/><circle cx="9" cy="9.75" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M6.5 4.5V3.5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v1" stroke="currentColor" stroke-width="1.2"/><circle cx="13.5" cy="7" r=".75" fill="currentColor"/></svg>',
    items:["ROAS en producción audiovisual: medir retorno de contenido digital por plataforma (YouTube, TikTok, Spotify)","Innovación incremental: adoptar IA para edición automatizada, subtitulación y colorización","Innovación disruptiva: producción transmedia con experiencias multi-plataforma integradas","LTV de audiencia: tasa de retención y engagement sostenido en canales propios o branded content","Indicador de producción eficiente: reducción del 30-40% en costos con herramientas de postproducción basadas en IA (cf. Gu et al., 2023)"] }
];

(function buildCriteria() {
  const grid = document.getElementById('criteriaGrid');
  criteriaData.forEach(c => {
    const el = document.createElement('div');
    el.className = 'criteria-card reveal';
    el.style.setProperty('--crit-color', c.color);
    el.innerHTML = `
      <div class="crit-header">
        <div class="crit-icon">${c.icon}</div>
        <div>
          <div class="crit-area">${c.area}</div>
          <div class="crit-title">Criterios de Innovación</div>
        </div>
      </div>
      <ul class="crit-list">${c.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
    grid.appendChild(el);
  });
})();

/* =============================================
   BAR CHART
============================================= */
(function buildBarChart() {
  const areas = [
    {name:"Diseño Interiores", val:5, max:6, color:"#0072b9"},
    {name:"Diseño Publicitario", val:5, max:6, color:"#f3a100"},
    {name:"Diseño de Modas", val:5, max:6, color:"#00a0c6"},
    {name:"Com. Audiovisual", val:5, max:6, color:"#2ecc71"},
    {name:"Transversales", val:6, max:6, color:"#8e44ad"}
  ];
  const chart = document.getElementById('barChart');
  areas.forEach(a => {
    const row = document.createElement('div'); row.className='bar-row';
    row.innerHTML = `<div class="bar-label"><strong>${a.name}</strong><span>${a.val} líneas</span></div>
      <div class="bar-track"><div class="bar-fill" data-target="${Math.round(a.val/a.max*100)}" style="background:${a.color}"></div></div>`;
    chart.appendChild(row);
  });
})();

/* =============================================
   BIBLIOGRAPHY DATA
============================================= */
const bibData = [
  { cat:"Innovación Tecnológica y Crecimiento Económico", items:[
    { cite:"Koç, Ş. (2025).", text:"The impact of innovation on economic growth: A dynamic panel data analysis.", journal:"Journal of Innovation and Entrepreneurship, ScienceDirect.", url:"https://doi.org/10.1016/j.joitmc.2025.000463" },
    { cite:"UNCTAD (2025).", text:"Technology and Innovation Report 2025.", journal:"United Nations Conference on Trade and Development.", url:"https://unctad.org/system/files/official-document/tir2025_en.pdf" },
    { cite:"Quispe, R. (2024).", text:"Innovación tecnológica: factor clave para el éxito empresarial.", journal:"SCIÉNDO, Revista de Investigación Científica, UNITRU.", url:"https://revistas.unitru.edu.pe/index.php/SCIENDO/article/view/6061" },
    { cite:"OCDE (2009).", text:"Innovación y crecimiento. Perspectivas institucionales.", journal:"OECD Publishing.", url:"https://www.oecd.org/content/dam/oecd/es/publications/reports/2009/11/innovation-and-growth_g1ghb67b/9789264208339-es.pdf" }
  ]},
  { cat:"Tipos de Innovación: Incremental, Disruptiva y Radical", items:[
    { cite:"RIIIT (2022).", text:"Innovación tecnológica en pequeñas y medianas empresas: análisis bibliométrico (1,906 artículos Scopus).", journal:"Revista Internacional de Investigación e Innovación Tecnológica.", url:"https://riiit.com.mx/apps/site/files_v2450/innovacin_pue._3_riiit_div_nov-dic_2022.pdf" },
    { cite:"Park, M. et al. (2026).", text:"Is innovation becoming less disruptive? An inventory of evidence.", journal:"arXiv:2602.05140.", url:"https://arxiv.org/html/2602.05140v1" },
    { cite:"OCDE/Eurostat (2018).", text:"Manual de Oslo: Guía para la recogida, notificación y uso de datos sobre innovación (4.ª ed.).", journal:"OECD Publishing." }
  ]},
  { cat:"IA, Economía Digital e Innovación Empresarial", items:[
    { cite:"Babina, T. et al. (2024).", text:"Artificial intelligence, firm growth, and product innovation.", journal:"Journal of Financial Economics, 151. (+1,489 citas Scopus).", url:"https://doi.org/10.1016/j.jfinec.2023.01.001" },
    { cite:"Stanford HAI (2025).", text:"Artificial Intelligence Index Report 2025. El 78% de organizaciones usan IA; inversión EE.UU. USD 109.1 mil millones.", journal:"Stanford University.", url:"https://hai-production.s3.amazonaws.com/files/hai_ai_index_report_2025.pdf" },
    { cite:"Costa, C. J. (2025).", text:"Exploring the societal and economic impacts of artificial intelligence.", journal:"arXiv:2504.01992.", url:"https://arxiv.org/abs/2504.01992" },
    { cite:"Villalba, R. et al. (2025).", text:"Impacto de la inteligencia artificial en la innovación empresarial en PYMES.", journal:"Revista INVECOM." }
  ]},
  { cat:"Innovación Aplicada al Diseño y Comunicación Visual", items:[
    { cite:"Gu, Z. et al. (2023).", text:"Creative Blends: An AI-assisted design system for visual concept combination. Estudio N=24.", journal:"arXiv:2502.16062.", url:"https://arxiv.org/html/2502.16062v1" },
    { cite:"Medina, Y. O. (2023).", text:"El sonido como elemento clave en prácticas de realidad virtual.", journal:"arXiv:2305.13340.", url:"https://arxiv.org/pdf/2305.13340.pdf" },
    { cite:"Palermo, U. (s.f.).", text:"Diseño de tecnologías en comunicación.", journal:"Actas de Diseño, Universidad de Palermo.", url:"https://dspace.palermo.edu/ojs/index.php/actas/article/view/2870/4524" },
    { cite:"Cisneros, D. et al. (2025).", text:"El impacto de la inteligencia artificial en la sociedad: una revisión sistemática.", journal:"Ciencia Latina.", url:"https://ciencialatina.org/index.php/cienciala/article/view/16468" }
  ]},
  { cat:"Gemelos Digitales en la Industria", items:[
    { cite:"Chiquito, M. V. et al. (2020).", text:"Gemelos digitales y su evolución en la industria.", journal:"RECIMUNDO, 4(4). Indexado Scopus y Dialnet.", url:"https://dialnet.unirioja.es/descarga/articulo/7999264.pdf" },
    { cite:"Su, C. et al. (2025).", text:"Digital twin system for manufacturing processes based on a multi-layer knowledge graph.", journal:"Scientific Reports (Nature).", url:"https://doi.org/10.1038/s41598-024-85053-0" },
    { cite:"Tumbaco, A. (2024).", text:"Innovación tecnológica y su aporte al crecimiento económico de las microempresas.", journal:"Dialnet.", url:"https://dialnet.unirioja.es/descarga/articulo/9642444.pdf" }
  ]}
];

(function buildBib() {
  const grid = document.getElementById('bibGrid');
  bibData.forEach(cat => {
    const catEl = document.createElement('div');
    catEl.className = 'bib-category'; catEl.textContent = cat.cat;
    grid.appendChild(catEl);
    cat.items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'bib-item reveal';
      el.innerHTML = `<cite>${item.cite}</cite> ${item.text} <em>${item.journal}</em>${item.url ? ` <a href="${item.url}" target="_blank" rel="noopener noreferrer">Ver fuente →</a>` : ''}`;
      grid.appendChild(el);
    });
  });
})();

/* =============================================
   DETAIL PANEL
============================================= */
function openPanel(key) {
  const data = areaData[key]; if(!data) return;
  document.getElementById('panelAccentBar').style.background = `linear-gradient(90deg,${data.accent},transparent)`;
  document.getElementById('panelLabel').textContent = 'Líneas de Investigación';
  document.getElementById('panelTitle').textContent = data.label;
  const list = document.getElementById('panelLines');
  list.innerHTML = '';
  list.style.setProperty('--panel-accent', data.accent);
  data.lines.forEach((line, i) => {
    const li = document.createElement('li'); li.className='panel-line';
    li.style.setProperty('--panel-accent', data.accent);
    li.style.animationDelay = `${i*0.06}s`;
    li.innerHTML = `<span class="panel-line-num">0${i+1}</span><span>${line}</span>`;
    list.appendChild(li);
  });
  document.getElementById('detailPanel').classList.add('open');
  document.getElementById('detailOverlay').classList.add('open');
  document.getElementById('detailPanel').focus();
  document.body.style.overflow='hidden';
  showToast('Explorando: ' + data.label);
}
function closePanel() {
  document.getElementById('detailPanel').classList.remove('open');
  document.getElementById('detailOverlay').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('detailPanel').addEventListener('keydown', e => { if(e.key==='Escape') closePanel(); });

/* =============================================
   TOAST
============================================= */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* =============================================
   SCROLL PROGRESS
============================================= */
const progressBar = document.getElementById('scrollProgress');
function onScroll() {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const total = doc.scrollHeight - doc.clientHeight;
  const pct = total>0 ? Math.round((scrolled/total)*100) : 0;
  progressBar.style.width = pct+'%';
  progressBar.setAttribute('aria-valuenow', pct);
}
window.addEventListener('scroll', onScroll, { passive:true });

/* =============================================
   INTERSECTION OBSERVER — reveal + bar animate
============================================= */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.bar-fill,.impact-bar-fill').forEach(fill => {
        const t = fill.getAttribute('data-target');
        if(t) fill.style.width = Math.min(parseFloat(t),100)+'%';
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold:0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* =============================================
   SEARCH / FILTER
============================================= */
/* search: replaced by tab+accordion system */

/* =============================================
   NAV KEYBOARD
============================================= */
document.querySelectorAll('.nav-btn').forEach((btn,i,all) => {
  btn.addEventListener('keydown', e => {
    if(e.key==='ArrowRight') all[(i+1)%all.length].focus();
    if(e.key==='ArrowLeft')  all[(i-1+all.length)%all.length].focus();
  });
});

function scrollToSection(id, btn) {
  /* En modo páginas la sección destino está oculta: cambiar de página en lugar de hacer scroll */
  if (document.body.classList.contains('pg-mode') && window.pgShow && window.pgShow(id)) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    return;
  }
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

/* =============================================
   MEJORAS USABILIDAD: Dropdown nav + Indicador de sección
============================================= */
function toggleNavDropdown(id, triggerBtn) {
  const wrap = document.getElementById(id);
  const menu = wrap.querySelector('.nav-dropdown-menu');
  const hint = document.getElementById('navMarcoHint');
  const isOpen = wrap.classList.contains('open');
  // Cierra todos primero
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.nav-dropdown-trigger').forEach(b => b.setAttribute('aria-expanded','false'));
  if (hint) hint.hidden = true;
  if (!isOpen) {
    // Posicionar el menu con fixed usando getBoundingClientRect (evita clipping del nav)
    const rect = triggerBtn.getBoundingClientRect();
    menu.style.top = (rect.bottom + 6) + 'px';
    // Ajustar si se sale por la derecha de la pantalla
    const menuW = 220;
    const left = rect.left + menuW > window.innerWidth ? window.innerWidth - menuW - 8 : rect.left;
    menu.style.left = left + 'px';
    wrap.classList.add('open');
    triggerBtn.setAttribute('aria-expanded','true');
    // Mostrar hint debajo del menu
    if (hint) {
      hint.style.top = (rect.bottom + 6 + 220) + 'px'; // aprox bajo el menu (fallback)
      hint.style.left = left + 'px';
      hint.hidden = false;
    }
  }
}
function closeNavDropdown() {
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.nav-dropdown-trigger').forEach(b => b.setAttribute('aria-expanded','false'));
  const hint = document.getElementById('navMarcoHint');
  if (hint) hint.hidden = true;
}

/* --- Tutorial modal --- */
function openTutorial() {
  const o = document.getElementById('tutorialOverlay');
  if (o) { o.classList.add('open'); document.body.style.overflow = 'hidden'; }
  // Pre-fill tutorial date from cronograma if set
  const s = document.getElementById('af-start');
  if (s && s.value) { const ti = document.getElementById('tut-start'); if(ti&&!ti.value) ti.value = s.value; tutCalcDates(); }
}
function closeTutorial() {
  const o = document.getElementById('tutorialOverlay');
  if (o) { o.classList.remove('open'); document.body.style.overflow = ''; }
}

/* Tutorial date calculator — 12 semanas, 4 fases */
const TUT_PHASES = [
  { n:'01', t:'Briefing y Diagnóstico', c:'#0072b9', w:2 },
  { n:'02', t:'Prototipado y Validación', c:'#f3a100', w:3 },
  { n:'03', t:'Ejecución y Monitoreo', c:'#2ecc71', w:5 },
  { n:'04', t:'Análisis y Socialización', c:'#8e44ad', w:2 }
];
function tutCalcDates(){
  const sv = document.getElementById('tut-start').value;
  const res = document.getElementById('tut-date-result');
  const rows = document.getElementById('tut-date-rows');
  if(!sv||!res||!rows){ if(res) res.style.display='none'; return; }
  const start = new Date(sv+'T00:00:00');
  const fmtD = d => String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
  let cursor = new Date(start);
  rows.innerHTML = TUT_PHASES.map(p=>{
    const phStart = new Date(cursor);
    const phEnd = new Date(cursor.getTime() + p.w*7*864e5 - 864e5);
    cursor = new Date(phEnd.getTime() + 864e5);
    return `<div style="display:flex;align-items:center;gap:.6rem;font-size:.82rem">
      <span style="width:22px;height:22px;border-radius:50%;background:${p.c};color:#fff;font-weight:800;font-size:.68rem;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">${p.n}</span>
      <span style="font-weight:600;color:${p.c};min-width:200px">${p.t}</span>
      <span style="color:var(--c-text-soft)">${fmtD(phStart)} → ${fmtD(phEnd)}</span>
      <span style="color:var(--c-text-soft);font-size:.76rem">(${p.w} sem.)</span>
    </div>`;
  }).join('');
  res.style.display = 'block';
}
function tutSyncDates(){
  const sv = document.getElementById('tut-start').value;
  if(!sv) return;
  const afStart = document.getElementById('af-start');
  const afEnd = document.getElementById('af-end');
  if(afStart) afStart.value = sv;
  if(afEnd){
    const end = new Date(new Date(sv+'T00:00:00').getTime() + 12*7*864e5);
    afEnd.value = end.toISOString().slice(0,10);
  }
  if(window.VR && typeof VR.schedule === 'function') VR.schedule();
  else if(typeof schedule === 'function') schedule();
}
// Cerrar con click en overlay
document.getElementById('tutorialOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeTutorial();
});
// Cerrar con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeTutorial();
});
// Cierra dropdown al hacer clic fuera
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-dropdown')) closeNavDropdown();
});
// Cierra dropdown con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNavDropdown();
});

/* --- Indicador de sección activa (ACT-R: memory decay anchor) --- */
const sectionMap = [
  { id: 'areas-section',       name: 'Líneas de Investigación por Área' },
  { id: 'area-int',            name: 'Diseño de Interiores' },
  { id: 'area-pub',            name: 'Diseño Publicitario' },
  { id: 'area-mod',            name: 'Diseño de Modas' },
  { id: 'area-cav',            name: 'Comunicación Audiovisual' },
  { id: 'trans-section',       name: 'Líneas Transversales' },
  { id: 'conv-section',        name: 'Mapa de Convergencia' },
  { id: 'invest-section',      name: 'Métricas ROI' },
  { id: 'methodology-section', name: 'Metodología ABPP' },
  { id: 'rubric-section',      name: 'Evaluación y Rúbrica' },
  { id: 'autofin-section',     name: 'Proyecto Autofinanciado' },
  { id: 'bib-section',         name: 'Bibliografía' },
];
const secIndicator = document.getElementById('section-indicator');
const siName = document.getElementById('si-name');
const backToTopBtn = document.getElementById('backToTopBtn');

function updateSectionIndicator() {
  const scrollY = window.scrollY;
  // Mostrar indicador y boton solo si no estamos al inicio
  const showUI = scrollY > 300;
  if (secIndicator) secIndicator.hidden = !showUI;
  if (backToTopBtn) backToTopBtn.classList.toggle('visible', showUI);

  if (!showUI) return;
  // Encontrar la sección actual
  let current = null;
  for (const s of sectionMap) {
    const el = document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top <= 120) current = s;
  }
  if (current && siName) siName.textContent = current.name;
}
window.addEventListener('scroll', updateSectionIndicator, { passive: true });
updateSectionIndicator();

onScroll();

/* =============================================
   ACCORDION DATA — all 4 areas
============================================= */
const accData = {
  int: {
    color: '#0072b9', label: 'Diseño de Interiores',
    lines: [
      { title: 'Sostenibilidad en el diseño de interiores',
        temas: ['Materiales eco-friendly y certificaciones LEED/BREEAM','Diseño bioclimático y eficiencia energética','Economía circular aplicada al interiorismo','Jardines verticales e integración de biofilia'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Revit + Insight (análisis energético)','ChatGPT para investigación de materiales','Midjourney para exploración conceptual'] },
      { title: 'Diseño de interiores para espacios reducidos',
        temas: ['Micro-apartamentos y tiny houses urbanas','Mobiliario multifuncional y transformable','Optimización de planta y percepción espacial','Tipologías de vivienda económica accesible'],
        contextos: ['incremental'],
        herramientas: ['SketchUp Pro + Enscape','Space planning software (RoomSketcher)','Looker Studio para análisis de satisfacción'] },
      { title: 'Tecnología y domótica en el diseño de interiores',
        temas: ['Sistemas IoT para el hogar inteligente','Automatización de iluminación y clima','Realidad aumentada para visualización de espacios','Gemelos digitales aplicados a proyectos residenciales'],
        contextos: ['disruptiva','radical'],
        herramientas: ['Crestron / KNX para domótica','Enscape AR + Meta Quest','SketchUp + plugin IoT Simulator'] },
      { title: 'Diseño inclusivo y accesible',
        temas: ['Accesibilidad universal (Norma A.120 Perú / ADA)','Diseño para adultos mayores y movilidad reducida','Señalética sensorial y orientación espacial','Espacios neuroamigables para neurodiversidad'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['AutoCAD con biblioteca de accesibilidad','Checklist WCAG adaptado a espacios físicos','Encuestas de usabilidad (Google Forms + Looker)'] },
      { title: 'Bienestar y ergonomía en espacios comerciales',
        temas: ['Neuroarquitectura y psicología del espacio','Iluminación circadiana en retail y oficinas','Retail design phygital (físico + digital)','NPS y métricas de experiencia de cliente en tienda'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Hotjar Heatmaps (adaptado a planos)','Encuesta NPS post-experiencia','Midjourney + SketchUp para propuestas rápidas'] }
    ]
  },
  pub: {
    color: '#f3a100', label: 'Diseño Publicitario',
    lines: [
      { title: 'Estrategias de publicidad digital',
        temas: ['Performance marketing: ROAS, CAC y optimización de conversión','Programmatic advertising y segmentación algorítmica','SEO/SEM y marketing de contenidos para PYMES','Dashboards de campaña en tiempo real (Looker Studio)'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Meta Ads Manager + Google Ads','Looker Studio (Data Studio)','ChatGPT para generación de copys A/B'] },
      { title: 'Psicología del color en publicidad',
        temas: ['Semiótica del color y connotaciones culturales','Impacto del color en tasas de conversión digital','Color branding y percepción de valor de marca','Contraste y legibilidad en UX/UI publicitario'],
        contextos: ['incremental'],
        herramientas: ['Adobe Color + Coolors','Eye-tracking con herramientas de UX (Hotjar)','A/B testing de paletas en Meta Ads'] },
      { title: 'Publicidad sostenible',
        temas: ['Green marketing y comunicación de impacto ambiental','Greenwashing: identificación y buenas prácticas','Publicidad con propósito (Cause Marketing)','Certificaciones B-Corp y comunicación ESG'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Canvas de sostenibilidad de marca','ChatGPT para análisis de discurso ambiental','Google Trends para monitoreo de tendencias verdes'] },
      { title: 'Innovación en publicidad interactiva',
        temas: ['Publicidad en AR/VR: filtros Spark AR y WebXR','Gamificación en campañas de fidelización','Publicidad generativa con IA (texto + imagen + video)','Formatos inmersivos en metaverso y experiencias 360°'],
        contextos: ['disruptiva','radical'],
        herramientas: ['Spark AR Studio (Meta)','Midjourney + DALL-E para assets generativos','Unity para experiencias inmersivas básicas'] },
      { title: 'Identidad corporativa y branding',
        temas: ['Sistemas de identidad visual adaptativos multiplataforma','Brand equity y métricas de valor de marca','Brandtech: identidad visual en entornos digitales y AR','Tono de voz y copywriting de marca con IA'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Adobe Illustrator + Firefly','Canva AI para sistemas de templates','Brand24 para monitoreo de reputación online'] }
    ]
  },
  mod: {
    color: '#00a0c6', label: 'Diseño de Modas',
    lines: [
      { title: 'Moda sostenible y reciclaje textil',
        temas: ['Upcycling y diseño circular: cero desperdicio textil','Certificaciones GOTS, OEKO-TEX y comunicación sostenible','Slow fashion vs. fast fashion: análisis de mercado peruano','Cadena de valor transparente y trazabilidad con blockchain'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Clo3D para reducir muestreo físico','Shopify con integraciones de sostenibilidad','ChatGPT para storytelling de marca sostenible'] },
      { title: 'Innovación textil',
        temas: ['Textiles inteligentes: fibras conductoras y sensores integrados','Nanomateriales y acabados funcionales (antimicrobiano, termorregulador)','Impresión 3D en moda: prototipos y producción limitada','Biotextiles: cuero vegetal, mycelium y fibras de origen orgánico'],
        contextos: ['disruptiva','radical'],
        herramientas: ['Clo3D + Browzwear para simulación de tela','Impresoras 3D FDM/SLA para prototipos','Laboratorio textil + análisis de resistencia'] },
      { title: 'Diseño de moda inclusivo',
        temas: ['Moda adaptativa para personas con discapacidad','Diseño para diversidad corporal: tallas extendidas y system sizing','Moda de género neutro y fluido','Colecciones para adultos mayores con funcionalidad integrada'],
        contextos: ['incremental'],
        herramientas: ['Clo3D con avatares de diversidad corporal','Encuestas de usabilidad con grupos focales','Análisis de mercado: tendencias de inclusión en plataformas globales'] },
      { title: 'Tendencias y consumo responsable',
        temas: ['Análisis de tendencias con IA: WGSN digital y Google Trends','Comportamiento del consumidor post-COVID en moda peruana','Economía de segunda mano: Depop, Vinted y mercado local','LTV del cliente en moda sostenible: fidelización y recompra'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['WGSN (acceso educativo)','Google Trends + TrendHunter','Shopify Analytics para LTV y tasa de recompra'] },
      { title: 'Tecnología en la moda',
        temas: ['Probador virtual con AR: integración en e-commerce de moda','NFT fashion y activos digitales en el metaverso','Digital fashion: prendas exclusivas para avatares y redes sociales','IA generativa para diseño de colecciones y moodboards automáticos'],
        contextos: ['disruptiva','radical'],
        herramientas: ['Clo3D para prendas digitales','Midjourney para exploración creativa de colecciones','Shopify + apps AR (Threekit, Zakeke)'] }
    ]
  },
  cav: {
    color: '#2ecc71', label: 'Comunicación Audiovisual',
    lines: [
      { title: 'Narrativas digitales y transmedia',
        temas: ['Storytelling multiplataforma: YouTube + Podcast + Instagram + TikTok','Branded content y estrategia de contenidos para marcas','Webdoc interactivo y periodismo de datos visual','Economía de la atención: métricas de retención y engagement'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Notion para arquitectura narrativa transmedia','Canva Pro + Adobe Express para multiplataforma','Google Analytics 4 para métricas de contenido'] },
      { title: 'Cine y documental social',
        temas: ['Producción documental de bajo presupuesto con smartphone','Distribución en plataformas OTT y festivales online','Impacto social medible: indicadores cualitativos y cuantitativos','Crowdfunding para proyectos documentales (Kickstarter, Verkami)'],
        contextos: ['incremental'],
        herramientas: ['DaVinci Resolve (gratuito) para postproducción','Frame.io para revisión colaborativa','Descript para transcripción y edición basada en texto'] },
      { title: 'Innovación en técnicas de postproducción',
        temas: ['Edición automática con IA: Descript, Captions, AutoCut','Color grading inteligente: DaVinci Neural Engine','VFX accesibles con Runway Gen-3 y Adobe Firefly Video','IA para rotoscopia, eliminación de fondos y síntesis de voz'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['Runway Gen-3 Alpha','DaVinci Resolve + Magic Mask','ElevenLabs para locuciones sintéticas de alta calidad'] },
      { title: 'Producción audiovisual de bajo presupuesto',
        temas: ['Cine de guerrilla: storytelling con recursos mínimos','Smartphone filmmaking: técnica y narrativa con iPhone/Android','Optimización de recursos: iluminación natural y sonido directo','Crowdfunding creativo y preventa de contenido digital'],
        contextos: ['incremental'],
        herramientas: ['Filmic Pro + DJI OM para móvil','OBS Studio para streaming y grabación','Trello / Notion para gestión ágil de producción'] },
      { title: 'Producción audiovisual en plataformas digitales',
        temas: ['Algoritmos de YouTube, TikTok e Instagram Reels: optimización orgánica','CPV (costo por visualización) y monetización de canales','Content as a Service: modelo de negocio para creadores y agencias','Live streaming y producción de eventos digitales en tiempo real'],
        contextos: ['incremental','disruptiva'],
        herramientas: ['TubeBuddy / VidIQ para SEO en YouTube','Meta Business Suite para analítica de reels','Looker Studio para dashboard de CPV y engagement'] }
    ]
  }
};

/* Build accordion for each area */
Object.entries(accData).forEach(([areaKey, area]) => {
  const container = document.getElementById('acc-' + areaKey);
  if (!container) return;
  area.lines.forEach((line, i) => {
    const itemId = 'acc-' + areaKey + '-' + i;
    const item = document.createElement('div');
    item.className = 'acc-item';
    item.style.setProperty('--acc-color', area.color);
    item.setAttribute('role', 'group');
    item.setAttribute('aria-label', line.title);

    const ctxHTML = line.contextos.map(c => `<span class="ctx-tag ctx-${c}">${c === 'incremental' ? '↗ Incremental' : c === 'disruptiva' ? '⚡ Disruptiva' : '🚀 Radical'}</span>`).join('');
    const toolsHTML = line.herramientas.map(t => `<div class="tool-item">${t}</div>`).join('');
    const temasHTML = line.temas.map(t => `<div class="acc-chip">${t}</div>`).join('');

    item.innerHTML = `
      <button class="acc-trigger" aria-expanded="false" aria-controls="${itemId}-body" onclick="toggleAcc(this)">
        <span class="acc-num">${String(i+1).padStart(2,'0')}</span>
        <span class="acc-label">${line.title}</span>
        <svg class="acc-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="acc-body" id="${itemId}-body">
        <div class="acc-inner">
          <div class="acc-content">
            <div class="acc-col">
              <div class="acc-col-title">📌 Temas de Investigación Propuestos</div>
              <div class="acc-chip-list">${temasHTML}</div>
            </div>
            <div class="acc-col">
              <div class="acc-col-title">🔬 Contexto de Innovación</div>
              <div class="ctx-tags" style="margin-bottom:.6rem">${ctxHTML}</div>
              <div class="acc-col-title" style="margin-top:.5rem">⚙ Herramientas Tecnológicas</div>
              <div class="tool-list">${toolsHTML}</div>
            </div>
          </div>
        </div>
      </div>`;
    container.appendChild(item);
  });
});

function toggleAcc(btn) {
  const item = btn.closest('.acc-item');
  const isOpen = item.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
  showToast(isOpen ? 'Expandiendo: ' + btn.querySelector('.acc-label').textContent.substring(0,35) + '…' : 'Sección cerrada');
}

function switchTab(key, btn) {
  /* Scope to #areas-section to avoid colliding with theme tabs */
  const section = document.getElementById('areas-section');
  if (!section) return;
  section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  section.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected','false');
  });
  const pane = document.getElementById('tab-' + key);
  if (pane) pane.classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  showToast('Área: ' + btn.textContent.trim());
}

/* =============================================
   GANTT DATA
============================================= */
const ganttData = [
  { label:'Capacitación docente', sub:'Marzo 2026 · 1 mes', start:0, span:1, color:'#0072b9',
    tooltip:{
      periodo:'Marzo 2026',
      duracion:'4 semanas',
      descripcion:'Formación de docentes de las 4 carreras en métricas de rentabilidad (ROAS, CAC, LTV) y herramientas de IA generativa aplicadas a cada especialidad.',
      responsable:'Unidad de Investigación + Especialistas externos',
      entregable:'Docentes certificados en uso de IA y métricas financieras creativas'
    }},
  { label:'Alianzas estratégicas', sub:'Abril 2026 · 1 mes', start:1, span:1, color:'#f3a100',
    tooltip:{
      periodo:'Abril 2026',
      duracion:'4 semanas',
      descripcion:'Identificación y firma de convenios con 20 PYMES, emprendimientos de egresados y ONGs del sector creativo limeño. Co-diseño de briefings reales con empresarios.',
      responsable:'Dirección Académica + Área de Empleabilidad IDC',
      entregable:'20 convenios firmados · 10 briefings validados'
    }},
  { label:'Lanzamiento piloto', sub:'Mayo–Jun 2026 · 2 meses', start:2, span:2, color:'#00a0c6',
    tooltip:{
      periodo:'Mayo–Junio 2026',
      duracion:'8 semanas',
      descripcion:'Selección de 10 proyectos piloto (2–3 por carrera). Asignación de presupuesto semilla (S/ 10 000 total) y equipos estudiantiles. Ejecución de Fases 1 y 2 del modelo ABPP.',
      responsable:'Docentes de taller + Estudiantes seleccionados',
      entregable:'10 proyectos activos con estrategia creativa y prototipo validado'
    }},
  { label:'↳ Fase 1: Briefing', sub:'Semanas 1–2 · Estrategia creativa', start:2, span:1, color:'#0072b9', sub2:true,
    tooltip:{
      periodo:'Semana 1–2 de cada proyecto',
      duracion:'2 semanas',
      descripcion:'Reunión con cliente real. Investigación de mercado, análisis de competencia y definición de hipótesis medible: ROAS objetivo, CAC máximo aceptable, LTV esperado.',
      responsable:'Equipo estudiantil + Docente asesor',
      entregable:'Documento de estrategia creativa con KPIs específicos'
    }},
  { label:'↳ Fase 2: Prototipado IA', sub:'Semanas 3–5 · Validación A/B', start:3, span:1, color:'#f3a100', sub2:true,
    tooltip:{
      periodo:'Semanas 3–5 de cada proyecto',
      duracion:'3 semanas',
      descripcion:'Creación de 3–5 variantes creativas con herramientas IA (Midjourney, Runway, Clo3D). Pruebas A/B con audiencias reales o focus groups. Selección del prototipo ganador por datos.',
      responsable:'Equipo estudiantil',
      entregable:'Portafolio de variantes + reporte de validación A/B'
    }},
  { label:'Ejecución y monitoreo', sub:'Jul–Ago 2026 · Fase 3 ABPP', start:4, span:2, color:'#2ecc71',
    tooltip:{
      periodo:'Julio–Agosto 2026',
      duracion:'8 semanas (sprints semanales)',
      descripcion:'Lanzamiento real de campañas, colecciones, rediseños o producciones audiovisuales. Monitoreo diario con dashboards ROAS/CAC/LTV en Looker Studio. Ajustes tácticos basados en datos.',
      responsable:'Equipos estudiantiles con asesoría docente semanal',
      entregable:'Dashboard en vivo con métricas actualizadas diariamente'
    }},
  { label:'Análisis y Socialización', sub:'Sep 2026 · Fase 4 ABPP', start:6, span:1, color:'#8e44ad',
    tooltip:{
      periodo:'Septiembre 2026',
      duracion:'4 semanas',
      descripcion:'Cierre de proyectos. Cálculo definitivo de ROAS/CAC/LTV. Análisis post-mortem crítico. Presentación pública ante clientes, docentes y pares. Publicación en portafolio digital IDC.',
      responsable:'Equipos estudiantiles + Unidad de Investigación',
      entregable:'Informe de Rentabilidad Creativa (activo de portafolio profesional)'
    }},
  { label:'Evaluación y Escalamiento', sub:'Oct–Dic 2026 · Institucionalización', start:7, span:3, color:'#545452',
    tooltip:{
      periodo:'Octubre–Diciembre 2026',
      duracion:'12 semanas',
      descripcion:'Análisis de lecciones aprendidas. Ajuste del modelo para institucionalización. Incorporación al currículo formal de las 4 carreras. Preparación del plan 2027 con 80% de financiamiento externo.',
      responsable:'Comisión Curricular + Unidad de Investigación + Dirección',
      entregable:'Modelo ABPP institucionalizado · Plan 2027 aprobado'
    }},
];

/* Gantt tooltip instance */
/* -- GANTT TOOLTIP ---------------------------------------------------------
   Bug fix: never cache the element at parse-time (it lives after the closing script tag).
   Always look it up lazily inside each function. Also guard against focus
   events that have no clientX/clientY.
─────────────────────────────────────────────────────────────────────────── */
function _gt() { return document.getElementById('gTooltip'); }

function showGTooltip(e, row) {
  const tip = _gt(); if (!tip) return;
  const t = row.tooltip || {};
  tip.style.setProperty('--g-color', row.color);
  tip.innerHTML =
    '<div class="g-tooltip-title">' + (row.label || '').replace(/↳\s*/,'') + '</div>' +
    '<div class="g-tooltip-sub">' + (row.sub || '') + '</div>' +
    '<div class="g-tooltip-rows">' +
    '<div class="g-tooltip-row"><span class="g-tooltip-label">Período</span><span class="g-tooltip-val">'    + (t.periodo     || '—') + '</span></div>' +
    '<div class="g-tooltip-row"><span class="g-tooltip-label">Duración</span><span class="g-tooltip-val">'   + (t.duracion    || '—') + '</span></div>' +
    '<div class="g-tooltip-row"><span class="g-tooltip-label">Actividad</span><span class="g-tooltip-val">'  + (t.descripcion || '—') + '</span></div>' +
    '<div class="g-tooltip-row"><span class="g-tooltip-label">Responsable</span><span class="g-tooltip-val">'+ (t.responsable || '—') + '</span></div>' +
    '<div class="g-tooltip-row"><span class="g-tooltip-label">Entregable</span><span class="g-tooltip-val">' + (t.entregable  || '—') + '</span></div>' +
    '</div>';
  positionTooltip(e);
  tip.classList.add('show');
}
function positionTooltip(e) {
  const tip = _gt(); if (!tip) return;
  /* Focus events have no clientX — fall back to centre of screen */
  const cx = (typeof e.clientX === 'number') ? e.clientX : window.innerWidth  / 2;
  const cy = (typeof e.clientY === 'number') ? e.clientY : window.innerHeight / 2;
  const tw = 340, th = 220;
  let x = cx + 14, y = cy + 14;
  if (x + tw > window.innerWidth)  x = cx - tw - 8;
  if (y + th > window.innerHeight) y = cy - th - 8;
  if (x < 8) x = 8;
  if (y < 8) y = 8;
  tip.style.left = x + 'px';
  tip.style.top  = y + 'px';
}
function hideGTooltip() { const tip = _gt(); if (tip) tip.classList.remove('show'); }

(function buildGantt() {
  const container = document.getElementById('ganttRows');
  if (!container) return;
  const totalCols = 10;
  ganttData.forEach(row => {
    const el = document.createElement('div');
    el.className = 'gantt-row reveal';
    const leftPct  = (row.start / totalCols * 100).toFixed(1);
    const widthPct = (row.span  / totalCols * 100).toFixed(1);
    const labelText = row.sub2 ? row.label : row.label;
    const labelHTML = '<div class="gantt-label">' + labelText + '<span>' + row.sub + '</span></div>';
    const barText = row.span >= 2 ? (row.sub2 ? '' : row.label) : '';
    el.innerHTML = labelHTML +
      '<div class="gantt-track">' +
        '<button class="gantt-bar" style="left:' + leftPct + '%;width:' + widthPct + '%;background:' + row.color + ';border:none;cursor:pointer;"' +
          ' aria-label="Ver detalle: ' + row.label + '">' +
          barText +
        '</button>' +
      '</div>';
    /* Tooltip events on the button */
    const btn = el.querySelector('.gantt-bar');
    btn.addEventListener('mouseenter', e => showGTooltip(e, row));
    btn.addEventListener('mousemove',  e => positionTooltip(e));
    btn.addEventListener('mouseleave', hideGTooltip);
    btn.addEventListener('focus',      e => showGTooltip(e, row));
    btn.addEventListener('blur',       hideGTooltip);
    btn.addEventListener('click',      e => { showGTooltip(e, row); e.stopPropagation(); });
    container.appendChild(el);
    observer.observe(el);
  });
  document.addEventListener('click', hideGTooltip);
})();

/* =============================================
   PROPOSED THEMES DATA
============================================= */
const themesData = [
  // INTERIORES
  { area:'int', color:'#0072b9', lineRef:'Sostenibilidad · Interiores',
    title:'Impacto de materiales reciclados en la percepción de calidad en espacios residenciales',
    desc:'Evaluar si el uso de materiales eco-certificados (LEED) altera la percepción de valor y confort del usuario en proyectos de vivienda media.',
    tags:['Sostenibilidad','LEED','Experiencia de usuario','Economía circular'] },
  { area:'int', color:'#0072b9', lineRef:'Domótica · Interiores',
    title:'Gemelos digitales como herramienta de preventa en estudios de diseño de interiores',
    desc:'Medir la reducción de correcciones en obra y aumento de satisfacción del cliente al implementar visualización BIM + AR antes de la ejecución.',
    tags:['Gemelo digital','BIM','AR','ROI del cliente'] },
  { area:'int', color:'#0072b9', lineRef:'Bienestar · Interiores',
    title:'Neuroarquitectura en espacios de retail: correlación entre diseño sensorial y conversión de ventas',
    desc:'Comparar métricas de ventas antes/después de rediseños basados en principios de neuroarquitectura (iluminación, temperatura, scent marketing).',
    tags:['Neuroarquitectura','Retail','NPS','Performance comercial'] },
  // PUBLICITARIO
  { area:'pub', color:'#f3a100', lineRef:'Publicidad digital · Publicitario',
    title:'Optimización de ROAS en PYMES limeñas mediante segmentación con IA generativa',
    desc:'Comparar campañas con creatividades estándar vs. creatividades generadas con IA (Midjourney + ChatGPT) en términos de CTR, CAC y ROAS.',
    tags:['ROAS','CAC','IA generativa','Performance marketing'] },
  { area:'pub', color:'#f3a100', lineRef:'Psicología del color · Publicitario',
    title:'Efecto del color en tasas de conversión en anuncios de Instagram Reels para marcas de moda',
    desc:'A/B test sistemático de paletas de color en anuncios de video corto para determinar el impacto cromático en CPV y tasa de conversión.',
    tags:['Psicología del color','A/B testing','CPV','Instagram Reels'] },
  { area:'pub', color:'#f3a100', lineRef:'Branding · Publicitario',
    title:'Sistemas de identidad visual adaptativa para startups del ecosistema creativo peruano',
    desc:'Diseñar y evaluar un framework de identidad visual que funcione desde mobile-first hasta entornos AR, midiendo reconocimiento de marca en 90 días.',
    tags:['Branding','Identidad adaptativa','AR','Startup creativa'] },
  // MODAS
  { area:'mod', color:'#00a0c6', lineRef:'Moda sostenible · Modas',
    title:'Viabilidad económica de colecciones cápsula con textiles reciclados en el mercado limeño',
    desc:'Ejecutar una mini-colección upcycling y medir margen de contribución, LTV y tasa de recompra a 6 meses en canal online (Shopify/Instagram).',
    tags:['Upcycling','LTV','Margen de contribución','E-commerce moda'] },
  { area:'mod', color:'#00a0c6', lineRef:'Innovación textil · Modas',
    title:'Prototipado de prendas con impresión 3D para moda de nicho: costo vs. valor percibido',
    desc:'Comparar el costo de producción y disposición a pagar de consumidores por prendas con componentes impresos en 3D vs. producción textil tradicional.',
    tags:['Impresión 3D','Innovación textil','Disposición a pagar','Nicho premium'] },
  { area:'mod', color:'#00a0c6', lineRef:'Tecnología · Modas',
    title:'Adopción de probadores virtuales AR en plataformas de e-commerce de moda peruana',
    desc:'Medir el impacto de la tecnología de prueba virtual (AR fitting rooms) en tasa de conversión, devoluciones y satisfacción en tiendas online.',
    tags:['Realidad Aumentada','E-commerce','Tasa de conversión','Experiencia digital'] },
  // AUDIOVISUAL
  { area:'cav', color:'#2ecc71', lineRef:'Narrativas transmedia · Audiovisual',
    title:'Estrategia transmedia para marcas emergentes peruanas: alcance y engagement multiplataforma',
    desc:'Diseñar y ejecutar una campaña transmedia (video + podcast + social) para una marca real, midiendo alcance cross-platform y costo por impacto.',
    tags:['Transmedia','Branded content','Engagement','Multiplataforma'] },
  { area:'cav', color:'#2ecc71', lineRef:'Postproducción IA · Audiovisual',
    title:'IA en postproducción: reducción de tiempos y costos en producción audiovisual universitaria',
    desc:'Comparar flujos de trabajo tradicionales vs. flujos aumentados con IA (Descript, Runway, ElevenLabs) en tiempo, costo y calidad percibida por el cliente.',
    tags:['IA en edición','Runway','ElevenLabs','Eficiencia productiva'] },
  { area:'cav', color:'#2ecc71', lineRef:'Plataformas digitales · Audiovisual',
    title:'Optimización algorítmica de Reels: variables de diseño que maximizan retención y CPV',
    desc:'Analizar qué variables de diseño audiovisual (duración, hook, música, subtítulos, CTA) correlacionan con mayor retención y menor costo por visualización.',
    tags:['Instagram Reels','Algoritmo','CPV','Retención de audiencia'] },
];

(function buildThemes() {
  const allPane = document.getElementById('theme-all');

  themesData.forEach(theme => {
    const card = document.createElement('div');
    card.className = 'theme-card';
    card.style.setProperty('--tc-color', theme.color);
    card.innerHTML = `
      <div class="theme-line-ref">${theme.lineRef}</div>
      <h3 class="theme-title">${theme.title}</h3>
      <p class="theme-desc">${theme.desc}</p>
      <div class="theme-tags">${theme.tags.map(t=>`<span class="theme-tag">${t}</span>`).join('')}</div>`;

    // clone for area-specific pane
    const clone = card.cloneNode(true);
    const areaPaneId = 'theme-' + theme.area;
    const areaPane = document.getElementById(areaPaneId);
    if (areaPane) areaPane.appendChild(clone);
    allPane.appendChild(card);
  });
})();

function switchTheme(key, btn) {
  document.querySelectorAll('.theme-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.theme-tab-btn').forEach(b => b.classList.remove('active'));
  const pane = document.getElementById('theme-' + key);
  if (pane) pane.classList.add('active');
  btn.classList.add('active');
}


/* =============================================
   TRANSVERSAL LINES DATA
============================================= */
const ltData = [
  { id:'LT-01', color:'#27ae60', name:'Sostenibilidad Ambiental y Cambio Climático',
    metrica:'LTV sostenible · Margen circular · Reducción de huella de carbono',
    icon:'<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 11c1-2.5 3.5-3 5.5-2s3 3 2 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    desc:'Crisis climática articulada desde Modas (textil sostenible), Interiores (bioclimático), Publicidad (comunicación ambiental) y Audiovisual (documental de impacto). La más urgente y subatendida desde el diseño peruano.',
    topics:[
      {n:'01',title:'Huella de carbono de la producción creativa digital en Lima',sub:'Consumo energético del uso intensivo de IA generativa en estudios de diseño',carreras:['all'],tipo:'Cuantitativa aplicada',innov:'incremental',metrica:'Índice kg CO₂ / proyecto',tools:'Google Sustainability · Carbon Trust · ChatGPT para cálculo de huella'},
      {n:'02',title:'Diseño de envases biodegradables para marcas emergentes de alimentación saludable',sub:'Viabilidad técnica, económica y percepción del consumidor',carreras:['pub','mod'],tipo:'Investigación proyectual',innov:'disruptiva',metrica:'CAC + Margen de contribución por envase',tools:'Midjourney para exploración conceptual · SolidWorks para prototipo · Shopify para validación de demanda'},
      {n:'03',title:'Comunicación de campañas de reciclaje textil en Lima Metropolitana',sub:'Eficacia de estrategias visuales y audiovisuales en cambio de comportamiento (18-35 años)',carreras:['pub','cav'],tipo:'Cuasi-experimental',innov:'incremental',metrica:'ROAS social + Tasa de cambio de comportamiento',tools:'Meta Ads Manager · Looker Studio · Encuesta pre/post digital'},
      {n:'04',title:'Diseño bioclimático en viviendas de interés social en Lima',sub:'Reducción del consumo energético mediante estrategias pasivas de ventilación e iluminación',carreras:['int'],tipo:'Investigación proyectual',innov:'incremental',metrica:'ROI energético (kWh ahorrado / S/ invertido)',tools:'Revit + Insight energético · Enscape para simulación térmica · ChatGPT para análisis normativo'},
      {n:'05',title:'Reciclaje textil como materia prima creativa',sub:'Colecciones de moda y accesorios a partir de residuos industriales en Lima',carreras:['mod'],tipo:'Investigación-acción productiva',innov:'disruptiva',metrica:'LTV + Margen de contribución por colección',tools:'Clo3D para modelado sin muestreo físico · Shopify Analytics · Encuesta de disposición a pagar'},
      {n:'06',title:'Documental de impacto: narrativa audiovisual frente al cambio climático',sub:'Sensibilización en comunidades costeras del Perú con metodología transmedia',carreras:['cav'],tipo:'Proyectual mixta',innov:'disruptiva',metrica:'CPV + Alcance cross-plataforma + Acciones sociales generadas',tools:'DaVinci Resolve · Descript · YouTube Analytics + Spotify for Podcasters'},
      {n:'07',title:'Identidad visual para marcas de economía circular peruana',sub:'Branding que comunica sostenibilidad sin incurrir en greenwashing',carreras:['pub'],tipo:'Cualitativa aplicada',innov:'incremental',metrica:'Brand Equity score + NPS de marca sostenible',tools:'Adobe Illustrator + Firefly · Brand24 para monitoreo · ChatGPT para análisis de discurso ESG'},
      {n:'08',title:'Tecnologías IoT de monitoreo ambiental en espacios de trabajo creativos',sub:'Impacto en calidad del aire y productividad del diseñador',carreras:['int'],tipo:'Cuasi-experimental',innov:'radical',metrica:'ROI en productividad (output creativo / costo IoT)',tools:'Sensores CO₂/TVOC Arduino · Home Assistant · Looker Studio para dashboard ambiental'}
    ]},
  { id:'LT-02', color:'#0072b9', name:'Transformación Digital e Innovación Tecnológica',
    metrica:'ROAS + CAC + Productividad digital · ROI de adopción tecnológica',
    icon:'<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 10l2 1.5-2 1.5M12 13h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    desc:'La línea más activa en bibliografía académica. Ninguna carrera puede ejercerse competitivamente en 2026 sin dominar las herramientas digitales de su campo. Urgencia máxima para el IDC (Quispe et al., 2024).',
    topics:[
      {n:'01',title:'Adopción de IA generativa en profesionales creativos de Lima',sub:'Factores determinantes, barreras de acceso y diferencias por sector',carreras:['all'],tipo:'Encuesta cuantitativa',innov:'disruptiva',metrica:'Índice de madurez digital · ROI de adopción tecnológica',tools:'Google Forms + SPSS · Perplexity para revisión de literatura · Looker Studio para visualización'},
      {n:'02',title:'Transformación digital de MIPYMES creativas en Lima',sub:'Diagnóstico de madurez digital y hoja de ruta para estudios de diseño y comunicación',carreras:['all'],tipo:'Investigación-acción',innov:'incremental',metrica:'ROAS antes/después de digitalización · Reducción de CAC',tools:'Digital Maturity Model (Google) · ChatGPT para análisis de brechas · Trello para roadmap'},
      {n:'03',title:'Automatización de flujos creativos con IA: impacto en producción y costos',sub:'Análisis comparativo en agencias digitales de Lima',carreras:['pub','cav'],tipo:'Comparativo cuantitativo',innov:'disruptiva',metrica:'Costo por entrega (CPD) · Tiempo de ciclo · ROAS de campañas automatizadas',tools:'Zapier + Make para automatización · Descript + Runway · Looker Studio para métricas'},
      {n:'04',title:'Brecha de competencias digitales en egresados de diseño y comunicación peruanos',sub:'Demanda del mercado laboral vs. oferta formativa del IDC',carreras:['all'],tipo:'Mixto descriptivo',innov:'incremental',metrica:'Índice de empleabilidad · Brecha de habilidades cuantificada',tools:'LinkedIn Talent Insights · Encuesta a empleadores · SPSS para análisis estadístico'},
      {n:'05',title:'Innovación tecnológica en el sector textil-moda peruano',sub:'Adopción de CAD/CAM, impresión 3D y patronaje digital en talleres de Lima',carreras:['mod'],tipo:'Investigación aplicada',innov:'disruptiva',metrica:'Reducción de costos de muestreo · Margen de contribución por prenda',tools:'Clo3D + Browzwear · Encuesta a talleres · Análisis de ROI vs. método tradicional'},
      {n:'06',title:'El metaverso como espacio de diseño de interiores',sub:'Viabilidad comercial de servicios de decoración virtual inmersiva en Lima',carreras:['int'],tipo:'Exploratorio mixto',innov:'radical',metrica:'Disposición a pagar por servicio virtual · CAC en canal digital',tools:'Spatial.io / Decentraland · SketchUp + Enscape XR · Encuesta de disposición a pagar'},
      {n:'07',title:'Plataformas digitales y modelo de negocio para creativos independientes',sub:'Behance, Instagram, TikTok y marketplaces como canales de monetización en Perú',carreras:['all'],tipo:'Investigación cualitativa',innov:'incremental',metrica:'LTV por plataforma · CAC orgánico vs. pagado',tools:'Meta Business Suite · TubeBuddy · Google Analytics 4 para análisis de conversión'},
      {n:'08',title:'IA en la enseñanza del diseño: impacto en creatividad y autonomía del estudiante',sub:'Estudio cuasi-experimental en institutos superiores de Lima',carreras:['all'],tipo:'Cuasi-experimental educativo',innov:'disruptiva',metrica:'Índice de creatividad (escala Torrance) · Tiempos de entrega · Satisfacción docente-estudiante',tools:'ChatGPT + Claude para asistencia · Midjourney para exploración · Escala de medición de creatividad validada'}
    ]},
  { id:'LT-03', color:'#e74c3c', name:'Identidad Cultural e Interculturalidad',
    metrica:'Brand equity cultural · LTV de marca-origen · Alcance de narrativa',
    icon:'<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 9h16M3 13h16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="11" cy="11" rx="4" ry="8.5" stroke="currentColor" stroke-width="1.2"/></svg>',
    desc:'Perú posee una de las mayores diversidades culturales del planeta. Esta línea ofrece a los estudiantes del IDC una ventaja comparativa única frente a egresados de otros países latinoamericanos (OCDE, 2012).',
    topics:[
      {n:'01',title:'Identidad visual de Lima como ciudad creativa',sub:'Señalética e imagen urbana para el Centro Histórico basada en patrimonio andino y republicano',carreras:['pub','int'],tipo:'Investigación proyectual',innov:'incremental',metrica:'NPS ciudadano · Percepción de identidad antes/después',tools:'Adobe Illustrator · Encuesta NPS digital · Midjourney para exploración tipográfica'},
      {n:'02',title:'Diseño editorial y tipográfico inspirado en patrones textiles andinos',sub:'Sistema de identidad visual para marcas de exportación peruana',carreras:['pub'],tipo:'Investigación proyectual',innov:'disruptiva',metrica:'Brand premium percibido · Incremento de precio aceptado por mercado exportador',tools:'Glyphs / FontForge para tipografía · Adobe CC · Encuesta de valoración de precio'},
      {n:'03',title:'Representación de la diversidad étnica peruana en publicidad digital',sub:'Análisis de campañas 2022-2025 y percepciones de comunidades indígenas y afroperuanas',carreras:['pub'],tipo:'Cualitativa crítica',innov:'incremental',metrica:'Índice de representación · Engagement rate campañas inclusivas vs. estándar',tools:'Meta Ad Library · NVivo para análisis cualitativo · Grupos focales grabados'},
      {n:'04',title:'Moda y textilería andina como industria cultural',sub:'Valorización, propiedad intelectual colectiva y distribución equitativa en Puno y Cusco',carreras:['mod'],tipo:'Etnográfica aplicada',innov:'disruptiva',metrica:'LTV de comunidad artesana · Precio premium logrado en mercado internacional',tools:'Entrevistas en profundidad · Análisis de plataformas Etsy/WGSN · Clo3D para digitalización de patrones'},
      {n:'05',title:'Diseño de espacios de encuentro intercultural en Lima Metropolitana',sub:'Análisis de centros comunitarios y propuesta de mobiliario y programa espacial inclusivo',carreras:['int'],tipo:'Investigación proyectual',innov:'incremental',metrica:'NPS de usuarios · Tasa de ocupación del espacio · ROI social',tools:'SketchUp + Enscape · Encuesta de satisfacción · Hotjar para análisis de flujo en espacio'},
      {n:'06',title:'Documental como memoria viva: saberes artesanales en riesgo',sub:'Narrativas audiovisuales en comunidades altoandinas del Perú',carreras:['cav'],tipo:'Proyectual social',innov:'incremental',metrica:'CPV + Alcance geográfico + Acciones de preservación generadas',tools:'DJI para grabación en campo · DaVinci Resolve · YouTube Analytics + Meta para distribución'},
      {n:'07',title:'Cine peruano de autor como diplomacia cultural',sub:'Recepción internacional de producciones 2018-2025 e impacto en la imagen-país',carreras:['cav'],tipo:'Estudio de caso múltiple',innov:'incremental',metrica:'ROI cultural (premios + distribución) · Índice de imagen-país',tools:'Base de datos Festival de Cannes/Sundance · Análisis de prensa internacional · Google Trends por región'},
      {n:'08',title:'Interculturalidad en la comunicación de salud pública',sub:'Eficacia de materiales visuales adaptados culturalmente vs. estándar en Lima periurbana',carreras:['pub','cav'],tipo:'Experimental',innov:'incremental',metrica:'Tasa de comprensión · Tasa de adopción de comportamiento saludable',tools:'Adobe Premiere + Illustrator · Encuesta validada (escala Likert) · SPSS para análisis estadístico'}
    ]},
  { id:'LT-04', color:'#f3a100', name:'Emprendimiento y Gestión de Proyectos Creativos',
    metrica:'ROAS + CAC + LTV · ROI del emprendimiento creativo · Tasa de supervivencia',
    icon:'<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l2.5 5 5.5.8-4 3.9.9 5.5L11 14.5l-4.9 2.7.9-5.5L3 7.8l5.5-.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    desc:'Alta tasa de creación de negocios creativos en Perú, pero baja supervivencia más allá del tercer año. Esta línea conecta directamente con la empleabilidad de los egresados del IDC (Revista 360, 2023).',
    topics:[
      {n:'01',title:'Factores de éxito y fracaso en emprendimientos creativos de Lima (2021-2025)',sub:'Análisis de estudios de diseño, agencias publicitarias y productoras audiovisuales',carreras:['all'],tipo:'Investigación cualitativa',innov:'incremental',metrica:'Tasa de supervivencia a 3 años · CAC de captación de clientes · LTV promedio',tools:'Entrevistas a fundadores · NVivo para análisis temático · Infocorp/SUNAT para datos'},
      {n:'02',title:'Modelos de negocio para creativos independientes en Perú',sub:'Freelancing, estudio boutique y agencia digital: rentabilidad y sostenibilidad comparadas',carreras:['all'],tipo:'Estudio de caso múltiple',innov:'incremental',metrica:'ROAS por modelo · Margen neto · LTV promedio de cliente',tools:'Business Model Canvas digital · Entrevistas estructuradas · Análisis financiero en Sheets'},
      {n:'03',title:'Financiamiento de emprendimientos creativos en Perú',sub:'FONDECYT, STARTUP PERÚ, Ministerio de Cultura vs. financiamiento privado',carreras:['all'],tipo:'Cuantitativa',innov:'incremental',metrica:'ROI del fondo concursable · CAC de captación de fondos · Tiempo de retorno',tools:'Bases de datos FONDECYT · Análisis de convocatorias · Encuesta a beneficiarios'},
      {n:'04',title:'Gestión ágil con Scrum y Design Sprint en estudios creativos de Lima',sub:'Impacto en tiempos de entrega y satisfacción del cliente',carreras:['all'],tipo:'Investigación-acción',innov:'incremental',metrica:'Reducción de tiempo de ciclo · NPS de cliente · ROAS por sprint',tools:'Jira / Trello para gestión ágil · Encuesta NPS automatizada · Looker Studio'},
      {n:'05',title:'Marca personal del diseñador: posicionamiento digital e ingresos',sub:'Correlación entre estrategia digital y calidad de cartera en Lima Metropolitana',carreras:['pub'],tipo:'Correlacional cuantitativo',innov:'incremental',metrica:'Ingresos promedio · CAC de auto-promoción · LTV de cliente recurrente',tools:'LinkedIn Analytics · Encuesta de ingresos (anónima) · SPSS para correlación'},
      {n:'06',title:'Economía creativa circular para diseñadores de moda',sub:'Modelos de negocio que integran residuos textiles como materia prima principal',carreras:['mod'],tipo:'Investigación proyectual',innov:'disruptiva',metrica:'Margen de contribución · LTV en modelo circular · Reducción de costo de materia prima',tools:'Clo3D · Shopify para ventas online · Análisis de costo-beneficio vs. moda convencional'},
      {n:'07',title:'Propiedad intelectual en la economía creativa peruana',sub:'Nivel de conocimiento de diseñadores sobre derechos de autor, marcas y patentes',carreras:['all'],tipo:'Encuesta descriptiva',innov:'incremental',metrica:'Índice de conocimiento IP · ROI de registro de marca',tools:'Encuesta Google Forms · INDECOPI para datos de registro · SPSS para análisis'},
      {n:'08',title:'Hubs creativos y ecosistemas de emprendimiento en Lima',sub:'Contribución de espacios de coworking creativo al desarrollo de proyectos colaborativos',carreras:['all'],tipo:'Mixto',innov:'incremental',metrica:'ROI del coworking (proyectos generados / costo mensual) · NPS de miembros',tools:'Entrevistas a operadores · Encuesta NPS · Análisis de casos Lima Hub, Impact Hub Lima'}
    ]},
  { id:'LT-05', color:'#8e44ad', name:'Educación, Comunicación y Cambio Social',
    metrica:'CPV educativo · Alcance de impacto social · Tasa de cambio de comportamiento',
    icon:'<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 17l8-12 8 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 17h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="11" cy="8" r="1.5" fill="currentColor"/></svg>',
    desc:'Mayor potencial de impacto social directo para el IDC como institución. La comunicación visual y audiovisual son instrumentos privilegiados de participación social y cambio cultural (Vélasquez y Vélasquez, 2023).',
    topics:[
      {n:'01',title:'Alfabetización visual en adolescentes de Lima',sub:'Comprensión crítica de imágenes digitales y publicidad en redes sociales en secundaria',carreras:['pub','cav'],tipo:'Cuantitativo descriptivo',innov:'incremental',metrica:'Índice de pensamiento crítico visual · Antes/después de intervención pedagógica',tools:'Encuesta validada · Canva para materiales educativos · Google Classroom'},
      {n:'02',title:'Comunicación visual accesible en campañas de salud pública del MINSA (2022-2025)',sub:'Análisis y propuesta de rediseño con enfoque inclusivo',carreras:['pub'],tipo:'Investigación proyectual',innov:'incremental',metrica:'Tasa de comprensión del mensaje · NPS del ciudadano',tools:'Adobe Illustrator + XD · Test de comprensión (5 segundos) · Grupos focales'},
      {n:'03',title:'Diseño instruccional visual para la educación técnica',sub:'Infografías interactivas vs. texto plano: comprensión y retención de procedimientos',carreras:['pub','cav'],tipo:'Cuasi-experimental',innov:'disruptiva',metrica:'Tasa de retención de conocimiento · Tiempo de comprensión',tools:'Canva + Genially para infografías interactivas · Quizziz para medición · ChatGPT para generación de contenido'},
      {n:'04',title:'Contenido audiovisual educativo en YouTube para jóvenes peruanos',sub:'Factores que determinan efectividad pedagógica y nivel de retención',carreras:['cav'],tipo:'Mixto',innov:'incremental',metrica:'CPV educativo · Tasa de retención de video · Engagement rate',tools:'YouTube Studio Analytics · VidIQ · DaVinci Resolve para producción'},
      {n:'05',title:'Campañas para la prevención de violencia de género en Lima',sub:'Eficacia comparativa de diferentes formatos visuales y canales de difusión',carreras:['pub','cav'],tipo:'Investigación-acción participativa',innov:'disruptiva',metrica:'ROAS social · Tasa de denuncia antes/después · Alcance segmentado',tools:'Meta Ads Manager · Encuesta de percepción · Grupos focales con beneficiarias'},
      {n:'06',title:'El podcast como herramienta de comunicación comunitaria',sub:'Iniciativas peruanas de podcast local e impacto en cohesión social de barrios periurbanos',carreras:['cav'],tipo:'Estudio de caso múltiple',innov:'incremental',metrica:'CPV (costo por oyente) · Índice de cohesión social · Tasa de retención de audiencia',tools:'Spotify for Podcasters · Anchor/Buzzsprout · Encuesta de impacto comunitario'},
      {n:'07',title:'Formación docente en herramientas digitales en institutos superiores de Lima',sub:'Diagnóstico de brechas y propuesta de programa de actualización continua',carreras:['all'],tipo:'Investigación-acción educativa',innov:'incremental',metrica:'Índice de competencia digital docente · ROI de la capacitación (output estudiantil)',tools:'Google Workspace for Education · Encuesta de diagnóstico · Looker Studio para seguimiento'},
      {n:'08',title:'Comunicación de ciencia y tecnología al público no especializado en Perú',sub:'Estrategias visuales y audiovisuales de divulgación científica (2022-2025)',carreras:['pub','cav'],tipo:'Revisión sistemática',innov:'incremental',metrica:'Alcance de contenido científico · Engagement rate en divulgación',tools:'Scopus + Google Scholar · NVivo para análisis de contenido · Adobe Premiere para producción'}
    ]},
  { id:'LT-06', color:'#16a085', name:'Inclusión, Accesibilidad y Bienestar Social',
    metrica:'ROI social · NPS de accesibilidad · Impacto en LTV de cliente con necesidades especiales',
    icon:'<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M7 10h8l-1.2 5L11 19l-2.8-4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8.5 12l-2.5 5M13.5 12l2.5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    desc:'El diseño inclusivo es obligación ética y oportunidad de mercado subatendida en Perú. El IDC puede posicionarse como referente regional a través de proyectos que sean portafolio profesional de sus estudiantes (Callupe Pérez et al., 2023).',
    topics:[
      {n:'01',title:'Diseño universal en espacios públicos de Lima',sub:'Auditoría de accesibilidad en 5 distritos y propuesta de intervención de bajo costo',carreras:['int','pub'],tipo:'Investigación proyectual',innov:'incremental',metrica:'ROI social (personas beneficiadas / S/ invertido) · NPS ciudadano',tools:'SketchUp para propuesta · Checklist WCAG adaptado a espacios físicos · Google Maps para geolocalización'},
      {n:'02',title:'Señalética multisensorial para el transporte público de Lima',sub:'Sistema visual + táctil + auditivo para personas con discapacidad visual',carreras:['pub'],tipo:'Investigación proyectual',innov:'disruptiva',metrica:'NPS de usuarios con discapacidad · Tasa de orientación correcta (usabilidad)',tools:'Adobe Illustrator · Impresión en braille · Test con usuarios (protocolo de pensamiento en voz alta)'},
      {n:'03',title:'Moda adaptativa para adultos mayores en Lima',sub:'Colección con principios ergonómicos, facilidad de uso y dignidad estética',carreras:['mod'],tipo:'Investigación proyectual',innov:'disruptiva',metrica:'LTV en nicho de adultos mayores · Disposición a pagar premium por adaptabilidad',tools:'Clo3D para simulación de prendas · Protocolo de usabilidad con usuarios reales · Shopify para ventas piloto'},
      {n:'04',title:'Audiodescripción y subtitulado en producciones audiovisuales peruanas',sub:'Cumplimiento de la Ley N° 29973 y protocolo de producción accesible',carreras:['cav'],tipo:'Aplicada normativa',innov:'incremental',metrica:'% de cumplimiento normativo · CAC de adaptación accesible por minuto de video',tools:'ElevenLabs para audiodescripción con IA · Subtitle Edit · DaVinci Resolve para integración'},
      {n:'05',title:'Bienestar psicológico y diseño del entorno en trabajadores creativos de Lima',sub:'Relación entre espacio de trabajo, burnout y satisfacción laboral',carreras:['int'],tipo:'Correlacional cuantitativo',innov:'incremental',metrica:'Índice de burnout (MBI) · ROI de rediseño (productividad antes/después)',tools:'SketchUp para propuesta de rediseño · Escala Maslach de burnout · Looker Studio para correlaciones'},
      {n:'06',title:'Publicidad con representación real de la diversidad corporal en Perú',sub:'Campañas body-positive e impacto en autoestima y comportamiento de compra (mujeres 18-35)',carreras:['pub'],tipo:'Experimental',innov:'disruptiva',metrica:'ROAS de campaña inclusiva vs. convencional · Índice de autoestima (escala Rosenberg)',tools:'Meta Ads Manager para A/B test · Encuesta de autoestima validada · ChatGPT para análisis de sesgo visual'},
      {n:'07',title:'Espacios seguros de aprendizaje para personas con TEA en formación superior',sub:'Propuesta de diseño sensorial para aulas del IDC',carreras:['int'],tipo:'Investigación proyectual',innov:'incremental',metrica:'NPS de estudiantes TEA · Reducción de incidentes de sobrecarga sensorial',tools:'SketchUp + Enscape · Consulta con especialistas en TEA · Protocolo observacional de comportamiento'},
      {n:'08',title:'Contenido audiovisual en lenguas originarias del Perú',sub:'Ecosistema de producción en quechua y aymara y modelo sostenible para el IDC',carreras:['cav'],tipo:'Investigación cualitativa',innov:'radical',metrica:'CPV en audiencias originarias · Alcance en comunidades · LTV de audiencia fiel',tools:'DaVinci Resolve · ElevenLabs para síntesis de voz en quechua · Spotify for Podcasters para distribución'}
    ]}
];

/* Career label lookup — required by buildLtSystem */
const careerLabels = {
  all:{ label:'Todas las carreras', cls:'all' },
  pub:{ label:'D. Publicitario',    cls:'pub' },
  mod:{ label:'D. Modas',           cls:'mod' },
  int:{ label:'D. Interiores',      cls:'int' },
  cav:{ label:'C. Audiovisual',     cls:'cav' }
};

(function buildLtSystem() {
  const overview   = document.getElementById('ltOverview');
  const container  = document.getElementById('ltDetailContainer');
  if (!overview || !container) return;

  ltData.forEach((lt, idx) => {
    // Overview card
    const card = document.createElement('div');
    card.className = 'lt-card' + (idx === 0 ? ' active' : '');
    card.style.setProperty('--lt-color', lt.color);
    card.setAttribute('role','button'); card.setAttribute('tabindex','0');
    card.setAttribute('aria-label','Ver ' + lt.name);
    card.innerHTML = '<div class="lt-code">' + lt.id + '</div><div class="lt-name">' + lt.name + '</div><div class="lt-count">8 temas de investigación</div>';
    card.addEventListener('click', () => selectLt(lt.id));
    card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') selectLt(lt.id); });
    overview.appendChild(card);

    // Detail panel
    const detail = document.createElement('div');
    detail.className = 'lt-detail-wrap' + (idx === 0 ? ' active' : '');
    detail.id = 'lt-detail-' + lt.id.replace('-','');
    detail.style.setProperty('--lt-color', lt.color);

    const innovLabel = {incremental:'↗ Incremental', disruptiva:'⚡ Disruptiva', radical:'🚀 Radical'};
    const innovCls   = {incremental:'innov-inc', disruptiva:'innov-dis', radical:'innov-rad'};

    const rows = lt.topics.map(t => {
      const pills = t.carreras.map(c => '<span class="career-pill ' + careerLabels[c].cls + '">' + careerLabels[c].label + '</span>').join('');
      const innovBadge = t.innov ? '<span class="lt-innov-badge ' + innovCls[t.innov] + '">' + innovLabel[t.innov] + '</span>' : '';
      const metricaHTML = t.metrica ? '<div class="lt-metrica-row"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 8l2.5-3 2 1.5 3-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' + t.metrica + '</div>' : '';
      const toolsHTML = t.tools ? '<div class="lt-tools-row"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" stroke-width="1.1"/><path d="M4 5.5l1 1 2-2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>' + t.tools + '</div>' : '';
      return '<div class="lt-topic-row" role="row">' +
        '<div class="lt-topic-num" role="cell">' + t.n + '</div>' +
        '<div role="cell"><span class="lt-topic-title">' + t.title + '<small>' + t.sub + '</small></span>' +
        '<div class="lt-innov-strip">' + innovBadge + '</div>' +
        metricaHTML + toolsHTML + '</div>' +
        '<div class="lt-topic-career" role="cell">' + pills + '</div>' +
        '<div role="cell"><span class="lt-tipo-badge">' + t.tipo + '</span></div></div>';
    }).join('');

    const metChips = lt.metrica ? lt.metrica.split('·').map(m => '<span class="lt-met-chip">' + m.trim() + '</span>').join('') : '';

    detail.innerHTML = '<div class="lt-detail-header"><div class="lt-detail-icon">' + lt.icon + '</div>' +
      '<div class="lt-detail-meta"><div class="lt-detail-code">' + lt.id + '</div>' +
      '<div class="lt-detail-title">' + lt.name + '</div>' +
      '<p class="lt-detail-desc">' + lt.desc + '</p>' +
      '<div class="lt-metrica-header">' + metChips + '</div></div></div>' +
      '<div class="lt-topics-wrap"><div class="lt-topics-head" role="row">' +
      '<div role="columnheader">N°</div>' +
      '<div role="columnheader">Tema · Innovación · Métricas · Herramientas</div>' +
      '<div role="columnheader">Carrera(s)</div><div role="columnheader">Tipo</div></div>' +
      rows + '</div>';
    container.appendChild(detail);
  });
})();


/* =============================================
   BUDGET BREAKDOWN DATA
============================================= */
const bexpData = [
  {
    color:'#0072b9', area:'Diseño Publicitario',
    proyectos:4, monto:800, total:3200,
    icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 8.5h2.5l8-4.5v12l-8-4.5H2.5a.8.8 0 01-.8-.8V9.3a.8.8 0 01.8-.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M5 14v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    rationale:'El Diseño Publicitario es la carrera con mayor número de proyectos piloto (4) porque es la que tiene el ciclo de validación más corto: una campaña digital puede lanzarse, monitorearse y optimizarse en 4–6 semanas con presupuesto mínimo. El monto de <strong>S/ 800 por proyecto</strong> refleja el presupuesto mínimo viable para generar datos estadísticamente significativos de ROAS y CAC en plataformas digitales peruanas. Por debajo de S/ 500, el alcance es tan bajo que los resultados no son representativos del comportamiento real del mercado.',
    items:[
      {concepto:'Pauta digital (Meta Ads o Google Ads)', detalle:'Presupuesto de anuncios para campaña real en plataforma. Distribuido en 3–4 semanas de campaña activa.', monto:'S/ 500', pct:'62.5%'},
      {concepto:'Diseño de assets creativos (IA + producción)', detalle:'Créditos de Midjourney/DALL-E para generación de imágenes, más tiempo de edición en Adobe Firefly. Cubre 5–10 variantes de anuncio para A/B testing.', monto:'S/ 120', pct:'15%'},
      {concepto:'Herramientas de análisis y dashboard', detalle:'Suscripción mensual a SimilarWeb o Semrush para análisis de competencia. Looker Studio es gratuito. Google Analytics 4 es gratuito.', monto:'S/ 80', pct:'10%'},
      {concepto:'Contingencia operativa', detalle:'Costo de reuniones con cliente (movilidad), impresiones de briefing, materiales de presentación final.', monto:'S/ 100', pct:'12.5%'},
    ],
    roiItems:[
      {label:'ROAS objetivo mínimo', val:'150%'},
      {label:'CAC máximo aceptable', val:'30% del ticket'},
      {label:'Casos documentados', val:'4 fichas'},
    ]
  },
  {
    color:'#00a0c6', area:'Diseño de Modas',
    proyectos:3, monto:1200, total:3600,
    icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 2.5l-2.5 3 5 1.5 5-1.5L12 2.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M4.5 5.5l-2.5 10h16l-2.5-10" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    rationale:'Diseño de Modas tiene el presupuesto unitario más alto (S/ 1 200) porque involucra producción física real: telas, materiales, etiquetas, fotografía de producto y costos de e-commerce. A diferencia de las campañas digitales, una prenda tiene un costo de materiales irreducible. Se eligieron <strong>3 proyectos</strong> (en lugar de 4) porque cada colección cápsula requiere más tiempo de producción y validación (6–8 semanas de venta para calcular LTV y tasa de recompra). El presupuesto está diseñado para una micro-colección de 5–8 prendas que pueda venderse en canal online.',
    items:[
      {concepto:'Materiales e insumos textiles', detalle:'Telas (mínimo 5–8 metros por prenda), hilos, cierres, botones. Incluye margen para errores de corte en primeras unidades. Prioriza textiles reciclados o eco-certificados alineados a la línea de sostenibilidad.', monto:'S/ 450', pct:'37.5%'},
      {concepto:'Producción / confección', detalle:'Pago a taller de confección externo (costo por prenda: S/ 30–60 según complejidad). Para 8 prendas: S/ 240–480. Se usa taller aliado del IDC a tarifa preferencial para reducir costos.', monto:'S/ 280', pct:'23.3%'},
      {concepto:'Fotografía de producto', detalle:'Sesión fotográfica de producto para e-commerce (modelos, fondo blanco o editorial). Puede ser con smartphone profesional de los estudiantes + estudio básico del IDC, o sesión externa económica.', monto:'S/ 200', pct:'16.7%'},
      {concepto:'E-commerce y marketing digital', detalle:'Shopify plan básico (S/ 45/mes × 2 meses) + pauta en Instagram Shopping (S/ 100) para las primeras ventas. Fotografías optimizadas para Instagram/TikTok.', monto:'S/ 190', pct:'15.8%'},
      {concepto:'Etiquetas, empaques y envíos piloto', detalle:'Hangtags personalizadas, bolsas de empaque sostenible, costo de envíos de prueba para los primeros 10–15 pedidos online.', monto:'S/ 80', pct:'6.7%'},
    ],
    roiItems:[
      {label:'Margen mínimo esperado', val:'25%'},
      {label:'Tasa de recompra objetivo', val:'≥ 15%'},
      {label:'LTV estimado (6 meses)', val:'S/ 300+'},
    ]
  },
  {
    color:'#f3a100', area:'Diseño de Interiores',
    proyectos:2, monto:1000, total:2000,
    icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M2 8h14M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    rationale:'Diseño de Interiores tiene el menor número de proyectos piloto (2) porque cada rediseño de espacio comercial requiere mayor tiempo de diagnóstico, propuesta y ejecución (8–10 semanas). El costo unitario de <strong>S/ 1 000 por proyecto</strong> NO cubre la ejecución completa del rediseño (eso lo financia el cliente-negocio), sino los materiales de diagnóstico, la propuesta visual profesional, los elementos de intervención puntual (señalética, iluminación de prueba, mobiliario menor) que el equipo instala como demostración del impacto. El cliente valida el resultado con datos de ventas reales antes de decidir invertir en la remodelación completa.',
    items:[
      {concepto:'Renders y visualizaciones profesionales', detalle:'Créditos de Enscape o renders externos para presentar la propuesta de rediseño de forma que el cliente propietario pueda tomar decisiones. Sin visualizaciones creíbles, los dueños de PYMES no invierten. Es el activo de venta del proyecto.', monto:'S/ 250', pct:'25%'},
      {concepto:'Elementos de intervención demostrativa', detalle:'Pequeñas intervenciones físicas de alto impacto visual y bajo costo: repintado de acento (pintura), señalética impresa, cambio de distribución de mobiliario existente. Demuestra el concepto antes de la inversión mayor del cliente.', monto:'S/ 380', pct:'38%'},
      {concepto:'Diagnóstico y levantamiento técnico', detalle:'Materiales de medición, documentación fotográfica profesional (antes/después), planos de planta. El levantamiento técnico es el punto de partida que justifica la propuesta de diseño.', monto:'S/ 180', pct:'18%'},
      {concepto:'Encuesta NPS y medición de impacto', detalle:'Diseño e impresión de encuesta de satisfacción para clientes del negocio rediseñado. Tablet o dispositivo para encuesta digital. Cálculo de NPS pre y post intervención.', monto:'S/ 120', pct:'12%'},
      {concepto:'Contingencia y transporte', detalle:'Movilidad del equipo al lugar del proyecto (puede estar fuera de Lima Cercado), gastos menores de herramientas y materiales auxiliares.', monto:'S/ 70', pct:'7%'},
    ],
    roiItems:[
      {label:'Incremento de ventas objetivo', val:'+15% en 2 meses'},
      {label:'NPS mínimo esperado', val:'50 puntos'},
      {label:'ROI del cliente', val:'<12 meses'},
    ]
  },
  {
    color:'#2ecc71', area:'Comunicación Audiovisual',
    proyectos:1, monto:1200, total:1200,
    icon:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="4.5" width="15" height="10.5" rx="1.5" stroke="currentColor" stroke-width="1.4"/><circle cx="9" cy="9.75" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M7 4.5V3a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0112 3v1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="13.5" cy="7" r=".7" fill="currentColor"/></svg>',
    rationale:'Comunicación Audiovisual tiene <strong>solo 1 proyecto piloto</strong> en el fondo semilla porque el ecosistema Adobe Creative Cloud ya instalado en el IDC cubre la mayor parte de la producción (Premiere, After Effects, Audition). El proyecto piloto busca validar el modelo de "Content as a Service" para una marca real: producción de 8–12 piezas audiovisuales (reels, videos cortos) con medición de CPV y engagement. El presupuesto de S/ 1 200 cubre exclusivamente el <strong>costo de distribución y pauta</strong>, ya que la producción la ejecutan los estudiantes con el equipamiento institucional. Los proyectos adicionales de esta carrera se autofinancian con el cobro al cliente desde la segunda semana.',
    items:[
      {concepto:'Pauta de distribución de contenido', detalle:'Presupuesto de promoción de los reels/videos producidos en Meta (Instagram + Facebook) o TikTok Ads. Sin pauta, el contenido orgánico no genera datos de CPV confiables para el informe de rentabilidad.', monto:'S/ 600', pct:'50%'},
      {concepto:'Alquiler o contratación de extras / locaciones', detalle:'Costo de locaciones especiales si el cliente necesita filmaciones fuera de las instalaciones del IDC, o pago a personas que participan como personajes/modelos en el contenido.', monto:'S/ 250', pct:'20.8%'},
      {concepto:'Recursos de postproducción IA (Runway, ElevenLabs)', detalle:'Créditos adicionales de Runway Gen-3 para B-roll generativo y ElevenLabs para locuciones. Este es el componente de innovación tecnológica: reemplaza horas de filmación costosas con IA generativa.', monto:'S/ 200', pct:'16.7%'},
      {concepto:'Distribución multiplataforma y herramientas de análisis', detalle:'Hootsuite o Buffer (plan básico) para programación y análisis cross-platform. Permite medir engagement rate, CPV y alcance comparando YouTube, Instagram y TikTok simultáneamente.', monto:'S/ 100', pct:'8.3%'},
      {concepto:'Contingencia y materiales de producción', detalle:'Props, materiales de arte para set, baterías adicionales, tarjetas de memoria, transporte de equipo técnico.', monto:'S/ 50', pct:'4.2%'},
    ],
    roiItems:[
      {label:'Engagement rate objetivo', val:'≥ 5%'},
      {label:'CPV máximo aceptable', val:'< S/ 0.01'},
      {label:'Conversiones rastreables', val:'10+ por proyecto'},
    ]
  }
];

(function buildBexpCards() {
  const list = document.getElementById('bexpList');
  if (!list) return;

  bexpData.forEach((d, idx) => {
    const card = document.createElement('div');
    card.className = 'bexp-card reveal';
    card.style.setProperty('--be-color', d.color);

    const itemsRows = d.items.map(item =>
      '<tr><td>' + item.concepto + '</td><td>' + item.detalle + '</td><td>' + item.monto + '</td><td>' + item.pct + ' del total</td></tr>'
    ).join('') +
    '<tr class="bexp-total-row"><td colspan="2"><strong>TOTAL por proyecto</strong></td><td>S/ ' + d.monto + '</td><td>' + d.proyectos + ' proyectos = <strong>S/ ' + d.total.toLocaleString() + '</strong></td></tr>';

    const roiHTML = d.roiItems.map(r =>
      '<div class="bexp-roi-item"><div class="bexp-roi-label">' + r.label + '</div><div class="bexp-roi-val">' + r.val + '</div></div>'
    ).join('');

    card.innerHTML = '<button class="bexp-trigger" aria-expanded="false" onclick="toggleBexp(this)">' +
      '<div class="bexp-icon">' + d.icon + '</div>' +
      '<div class="bexp-meta">' +
        '<div class="bexp-area">' + d.area + ' · ' + d.proyectos + ' proyecto' + (d.proyectos>1?'s':'') + ' × S/ ' + d.monto + '</div>' +
        '<div class="bexp-title">¿En qué se gasta exactamente el presupuesto?</div>' +
      '</div>' +
      '<div class="bexp-amount">S/ ' + d.total.toLocaleString() + '</div>' +
      '<svg class="bexp-chevron" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 7l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button>' +
    '<div class="bexp-body"><div class="bexp-inner"><div class="bexp-content">' +
      '<div class="bexp-rationale">' + d.rationale + '</div>' +
      '<table class="bexp-items" aria-label="Desglose de costos ' + d.area + '"><thead><tr><th>Concepto</th><th>¿Qué cubre exactamente?</th><th>Monto</th><th>% del presupuesto</th></tr></thead><tbody>' + itemsRows + '</tbody></table>' +
      '<div style="font-size:.72rem;font-weight:800;color:var(--c-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem;margin-top:.3rem;">Indicadores de éxito esperados por proyecto</div>' +
      '<div class="bexp-roi">' + roiHTML + '</div>' +
    '</div></div></div>';

    list.appendChild(card);
    observer.observe(card);
  });
})();

function toggleBexp(btn) {
  const card = btn.closest('.bexp-card');
  const isOpen = card.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
}

function selectLt(id) {
  document.querySelectorAll('.lt-card').forEach((c, i) => c.classList.toggle('active', ltData[i].id === id));
  document.querySelectorAll('.lt-detail-wrap').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('lt-detail-' + id.replace('-',''));
  if (panel) { panel.classList.add('active'); setTimeout(() => panel.scrollIntoView({behavior:'smooth',block:'nearest'}), 50); }
}

/* =============================================
   CONVERGENCE MAP
============================================= */
const convData = [
  {lt:'LT-01 · Sostenibilidad',         pub:'Alta',     mod:'Muy alta', int:'Alta',     cav:'Media'},
  {lt:'LT-02 · Transform. digital',     pub:'Muy alta', mod:'Alta',    int:'Media',    cav:'Muy alta'},
  {lt:'LT-03 · Identidad cultural',     pub:'Alta',     mod:'Muy alta', int:'Media',    cav:'Alta'},
  {lt:'LT-04 · Emprendimiento',         pub:'Alta',     mod:'Alta',    int:'Media',    cav:'Alta'},
  {lt:'LT-05 · Educación social',       pub:'Alta',     mod:'Baja',    int:'Baja',     cav:'Muy alta'},
  {lt:'LT-06 · Inclusión',              pub:'Alta',     mod:'Alta',    int:'Muy alta', cav:'Alta'}
];
(function buildConvMap() {
  const container = document.getElementById('convRows'); if (!container) return;
  const cls = {'Muy alta':'conv-muy-alta','Alta':'conv-alta','Media':'conv-media','Baja':'conv-baja'};
  convData.forEach(row => {
    const el = document.createElement('div');
    el.className = 'conv-row reveal'; el.setAttribute('role','row');
    el.innerHTML = '<div class="conv-row-label" role="cell">' + row.lt + '</div>' +
      ['pub','mod','int','cav'].map(k => '<div class="conv-cell" role="cell"><span class="conv-badge ' + cls[row[k]] + '">' + row[k] + '</span></div>').join('');
    container.appendChild(el);
    observer.observe(el);
  });
})();


    /* ── Scroll to area and activate tab ── */
    function scrollToArea(area) {
      // Close any open panel
      const overlay = document.getElementById('detailOverlay');
      const panel = document.getElementById('detailPanel');
      if (overlay) overlay.classList.remove('open');
      if (panel) panel.classList.remove('open');

      // En modo páginas: activar la página de áreas antes de seleccionar la pestaña
      if (document.body.classList.contains('pg-mode') && window.pgShow) {
        window.pgShow('areas-section');
      } else {
        // Scroll to areas section
        const section = document.getElementById('areas-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // Activate corresponding tab after scroll
      setTimeout(function() {
        const section = document.getElementById('areas-section');
        if (!section) return;
        const tabBtn = section.querySelector('.tab-btn[data-area="' + area + '"]');
        if (tabBtn) {
          tabBtn.click();
          // Also activate nav button if exists
          const navBtn = document.querySelector('.nav-btn[data-area="' + area + '"]');
          if (navBtn) navBtn.classList.add('active');
        }
      }, 500);

      // Show toast
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      if (toast && toastMsg) {
        toastMsg.textContent = 'Mostrando: ' + area.toUpperCase();
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
      }
    }

    /* ── Scroll to nav section with offset for sticky nav ── */
    function scrollToNavSection() {
      /* En modo páginas, «Menú de secciones» abre la página del menú */
      if (document.body.classList.contains('pg-mode') && window.pgShow && window.pgShow('main-nav-section')) return;
      const nav = document.getElementById('main-nav');
      const section = document.getElementById('main-nav-section');
      if (nav && section) {
        const navHeight = nav.offsetHeight;
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: sectionTop - navHeight - 10,
          behavior: 'smooth'
        });
      }
    }

/* ================================================================== */
/* ===================================================================
   PROYECTO AUTOFINANCIADO — Mini-app por pantallas (window.VR)
   =================================================================== */
window.VR = (function () {
  const $ = id => document.getElementById(id);

  /* Logo IDC (SVG, siempre visible; reemplazable por el oficial) */
  function idcLogo(){
    return `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IDC Diseño y Comunicación">
      <circle cx="38" cy="44" r="26" fill="#f3a100"/>
      <text x="0" y="170" font-family="Nunito,sans-serif" font-weight="900" font-size="150" fill="#0072b9" letter-spacing="-4">idc</text>
      <text x="300" y="86" font-family="Nunito,sans-serif" font-weight="800" font-size="56" fill="#545452">diseño &amp;</text>
      <text x="300" y="146" font-family="Nunito,sans-serif" font-weight="800" font-size="56" fill="#545452">comunicación</text>
      <text x="2" y="196" font-family="Nunito,sans-serif" font-weight="400" font-size="29" fill="#8a8a8a" letter-spacing="1">Instituto de Educación Superior Público</text>
    </svg>`;
  }

  /* ABPP */
  const ABPP = [
    { n:'01', c:'#0072b9', w:2, per:'Sem. 1–2 · Mayo', t:'Briefing y Diagnóstico Estratégico', d:'Reunión con cliente/stakeholder real, investigación de mercado, análisis de competencia y objetivos medibles con hipótesis de impacto.', out:'Estrategia creativa con hipótesis ROAS/CAC objetivo' },
    { n:'02', c:'#f3a100', w:3, per:'Sem. 3–5 · May–Jun', t:'Prototipado Rápido y Validación con IA', d:'3–5 variantes con IA generativa, pruebas A/B con públicos reales e iteración basada en datos.', out:'Portafolio de variantes + reporte de validación A/B' },
    { n:'03', c:'#00a0c6', w:5, per:'Sem. 6–10 · Jun–Ago', t:'Ejecución y Monitoreo en Tiempo Real', d:'Lanzamiento de campaña/colección/espacio/contenido, monitoreo diario con dashboards y sprints de optimización semanal.', out:'Dashboard automatizado con métricas en vivo' },
    { n:'04', c:'#2ecc71', w:2, per:'Sem. 11–12 · Septiembre', t:'Análisis de Resultados y Socialización', d:'Cierre, métricas definitivas, post-mortem crítico, presentación pública y publicación en el portafolio digital IDC.', out:'Informe de Rentabilidad Creativa (activo de portafolio)' }
  ];

  /* Pantallas (botones de navegación) */
  const SCREENS = [
    { id:'generales',  ico:'📋', label:'Generales',     color:'#0072b9' },
    { id:'presupuesto',ico:'💰', label:'Presupuesto',   color:'#f3a100' },
    { id:'int',        ico:'🛋️', label:'Interiores',    color:'#0072b9' },
    { id:'pub',        ico:'📣', label:'Publicitario',  color:'#f3a100' },
    { id:'mod',        ico:'👗', label:'Modas',         color:'#00a0c6' },
    { id:'cav',        ico:'🎬', label:'Audiovisual',   color:'#F3A20B' },
    { id:'cronograma', ico:'🗓️', label:'Cronograma',    color:'#8e44ad' },
    { id:'inscripcion',ico:'📄', label:'Inscripción',   color:'#0072b9' }
  ];
  let mIdx = 0;

  /* Líneas de investigación por especialidad (del documento IDC) */
  const RLINES = {
    int:['Sostenibilidad en el diseño de interiores','Diseño de interiores para espacios reducidos','Tecnología y domótica en el diseño','Diseño inclusivo y accesible','Bienestar y ergonomía en espacios comerciales'],
    pub:['Estrategias de publicidad digital','Psicología del color en Publicidad','Publicidad sostenible','Innovación en publicidad interactiva','Identidad corporativa y branding'],
    mod:['Moda sostenible y reciclaje textil','Innovación textil','Diseño de moda inclusivo','Tendencias y consumo responsable','Tecnología en la Moda'],
    cav:['Narrativas digitales y transmedia','Cine y documental social','Innovación en técnicas de postproducción','Producción audiovisual de bajo presupuesto','Producción audiovisual en plataformas digitales']
  };
  /* 6 líneas transversales que cruzan todas las carreras */
  const TLINES = [
    '🤖 IA generativa y automatización creativa',
    '♻️ Sostenibilidad y economía circular',
    '💡 Emprendimiento e innovación tecnológica',
    '♿ Inclusión, accesibilidad y diversidad',
    '🌐 Cultura digital y ciudadanía creativa',
    '🤝 Convergencia interdisciplinaria'
  ];

  /* 4 CARRERAS */
    /* ===== PLANTILLAS WORD INSTITUCIONALES (base64 embebido) ===== */
  /* DOCX_TEMPLATES se carga desde assets/wgen-templates.js (global) */

  function downloadTemplate(id) {
    const t = DOCX_TEMPLATES[id];
    if (!t) { alert('Plantilla no disponible para esta especialidad.'); return; }
    try {
      const bin = atob(t.b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = t.fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      const toast = document.getElementById('toast');
      if (toast) {
        const msg = document.getElementById('toastMsg');
        if (msg) msg.textContent = '📄 Plantilla Word descargada';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }
    } catch(e) { alert('Error al descargar: ' + e.message); }
  }
const CAREERS = [
    { id:'int', name:'Diseño de Interiores', short:'Interiores', color:'#009C9D', ico:'🛋️',
      focus:'Espacios habitables, mobiliario, materiales sostenibles y ergonomía.',
      reqs:['Planos técnicos y render 3D del espacio u objeto','Prototipo o maqueta a escala del mobiliario','Memoria de materiales y sostenibilidad','Estudio ergonómico y de uso real'],
      tech:['SketchUp / AutoCAD / Revit','Impresión 3D y corte láser','Render (Enscape / V-Ray)','Materiales reciclados / biomateriales'],
      budget:[['Materiales y acabados','40%'],['Impresión 3D / maqueta','25%'],['Software y licencias','15%'],['Documentación y montaje','20%']],
      ex:{title:'Mobiliario modular impreso en 3D con material reciclado',req:6000,innovType:'Disruptiva',creativa:85,financiera:74,proceso:80},
      kpis:[{v:'ROI ≥20%',l:'Retorno sobre inversión',c:'#0072b9',h:'(Ganancia − Inversión) / Inversión × 100. Mide si el proyecto recuperó su costo.'},
            {v:'NPS ≥60',l:'Satisfacción de usuario',c:'#f3a100',h:'Net Promoter Score: % promotores − % detractores. Encuesta post-entrega.'},
            {v:'≥2',l:'Proyectos documentados',c:'#2ecc71',h:'Casos con planos, renders y memoria de materiales entregados al cliente.'},
            {v:'≥1',l:'Emprendimiento formal',c:'#8e44ad',h:'Empresa, RUC o propuesta de negocio validada con el proyecto.'}],
      glossary:[['ROI','Return on Investment: ganancia neta dividida entre la inversión. Si inviertes S/ 1 000 y ganas S/ 1 200, ROI = 20%.'],['NPS','Net Promoter Score: mide lealtad de clientes con una sola pregunta "¿Recomendarías este proyecto?" (0–10). Puntaje ≥ 60 es excelente.'],['BIM','Building Information Modeling: modelado 3D inteligente (Revit/ArchiCAD) donde cada elemento tiene datos de materiales, costos y especificaciones.'],['Render','Imagen fotorrealista generada por software a partir del modelo 3D. Muestra al cliente cómo quedará el espacio antes de construirlo.'],['Prototipo a escala','Maqueta física (1:20, 1:50, etc.) que permite evaluar proporciones, materiales y ergonomía antes de la producción final.']] },
    { id:'pub', name:'Diseño Publicitario', short:'Publicitario', color:'#009AD3', ico:'📣',
      focus:'Campañas, branding, comunicación persuasiva y experiencias de realidad aumentada.',
      reqs:['Concepto creativo y estrategia de campaña','Sistema gráfico / identidad visual','Pieza interactiva o AR funcional','Test de recordación / engagement con métricas'],
      tech:['Adobe Creative Cloud','AR: Meta Spark / 8thWall','IA generativa de imagen','Analítica de campaña'],
      budget:[['Producción de piezas','35%'],['Licencias y software IA','25%'],['Test / focus group','20%'],['Impresión y difusión','20%']],
      ex:{title:'Campaña de realidad aumentada para causas sociales',req:5000,innovType:'Incremental',creativa:80,financiera:84,proceso:78},
      kpis:[{v:'ROAS ≥2×',l:'Retorno publicitario',c:'#f3a100',h:'Revenue / Ad Spend. Si inviertes S/ 500 y generas S/ 1 000, ROAS = 2×. Meta mínima: recuperar la inversión.'},
            {v:'CAC bajo',l:'Costo de adquisición',c:'#0072b9',h:'Cuánto cuesta conseguir un nuevo cliente. Menor CAC = campaña más eficiente.'},
            {v:'CTR ≥3%',l:'Tasa de clic',c:'#2ecc71',h:'Click-Through Rate: clics / impresiones × 100. Indica si el anuncio capta atención.'},
            {v:'NPS ≥60',l:'Recordación de marca',c:'#8e44ad',h:'Encuesta a la audiencia: ¿recomendarías esta marca? Mide impacto real de la campaña.'}],
      glossary:[['ROAS','Return On Ad Spend: ingresos generados divididos entre el gasto en publicidad. ROAS = 2× significa que por cada S/ 1 invertido, recibes S/ 2.'],['CAC','Customer Acquisition Cost: gasto total en marketing / número de nuevos clientes. Si gastas S/ 1 000 y consigues 10 clientes, CAC = S/ 100.'],['LTV','Lifetime Value: ingresos totales que un cliente genera durante toda su relación con la marca. Útil para justificar un CAC alto.'],['CTR','Click-Through Rate: % de personas que hacen clic en un anuncio. CTR = clics / impresiones × 100.'],['CPM','Costo Por Mil impresiones. Métrica estándar para comparar precios de pauta entre plataformas.'],['A/B Test','Experimento en que se muestran dos versiones de una pieza a diferentes grupos y se comparan resultados para quedarse con la más efectiva.']] },
    { id:'mod', name:'Diseño de Modas', short:'Modas', color:'#E8308A', ico:'👗',
      focus:'Indumentaria, textiles técnicos, wearables e inclusión.',
      reqs:['Colección o prototipo de prenda','Ficha técnica y patronaje digital','Textil inteligente / wearable funcional','Validación con usuarios + lookbook'],
      tech:['CLO3D / patronaje digital','Wearables: Arduino / sensores','Textiles técnicos','Fotografía de producto'],
      budget:[['Telas y materiales','35%'],['Sensores / electrónica','25%'],['Confección','20%'],['Fotografía y lookbook','20%']],
      ex:{title:'Textil inteligente con sensores para accesibilidad',req:5000,innovType:'Radical',creativa:86,financiera:66,proceso:82},
      kpis:[{v:'Margen ≥35%',l:'Margen bruto',c:'#00a0c6',h:'(Precio venta − Costo producción) / Precio venta × 100. Mide la rentabilidad real de cada prenda.'},
            {v:'≥5 prendas',l:'Colección documentada',c:'#f3a100',h:'Número mínimo de piezas con ficha técnica, patronaje y fotografía editorial completa.'},
            {v:'Recompra ≥30%',l:'Tasa de recompra',c:'#2ecc71',h:'% de clientes que vuelven a comprar. Indica fidelización y calidad percibida del producto.'},
            {v:'Lookbook',l:'Activo de portafolio',c:'#8e44ad',h:'Fotografía editorial de la colección: es la carta de presentación ante marcas, concursos y potenciales empleadores.'}],
      glossary:[['Margen bruto','(Precio de venta − Costo de producción) / Precio de venta × 100. Ejemplo: prenda que cuesta S/ 60 y se vende a S/ 100 tiene margen de 40%.'],['Ficha técnica','Documento que describe materiales, tallas, costuras, acabados y costos de una prenda. Es el "plano" de la moda.'],['Patronaje digital','Diseño del molde de la prenda en software (CLO3D, Optitex). Permite simular la caída del tejido antes de cortar tela real.'],['Lookbook','Sesión fotográfica editorial que muestra la colección en contexto. Equivale al portafolio visual del diseñador.'],['Wearable','Prenda con tecnología integrada: sensores, LEDs, micrófonos, etc. que amplían la función de la ropa.'],['Tasa de recompra','% de clientes que vuelven a comprar. Se calcula: clientes que repitieron / total de clientes × 100.']] },
    { id:'cav', name:'Comunicación Audiovisual', short:'Audiovisual', color:'#F3A20B', ico:'🎬',
      focus:'Documental, narrativa inmersiva, contenido interactivo y video.',
      reqs:['Guion y tratamiento narrativo','Pieza audiovisual o documental','Versión interactiva o web inmersiva','Plan de difusión + alianzas culturales'],
      tech:['Cámara / drones','Premiere / DaVinci Resolve','Web interactiva (H5P / Three.js)','Sonido y motion graphics'],
      budget:[['Producción y rodaje','40%'],['Equipo y alquiler','20%'],['Postproducción','20%'],['Web / hosting / difusión','20%']],
      ex:{title:'Documental interactivo sobre patrimonio local',req:6000,innovType:'Disruptiva',creativa:82,financiera:78,proceso:80},
      kpis:[{v:'5K+ vistas',l:'Alcance orgánico',c:'#2ecc71',h:'Reproducciones totales en plataformas (YouTube, Vimeo, redes). Meta mínima del proyecto.'},
            {v:'CPV &lt; S/0.05',l:'Costo por vista',c:'#0072b9',h:'Gasto total / número de vistas. Mide eficiencia si hay pauta pagada en el lanzamiento.'},
            {v:'Eng. ≥5%',l:'Tasa de engagement',c:'#f3a100',h:'(Likes + comentarios + compartidos) / reproducciones × 100. Indica si el contenido genera reacción real.'},
            {v:'≥3 alianzas',l:'Colaboraciones',c:'#8e44ad',h:'Acuerdos con organizaciones, museos, municipios u otras entidades que amplifiquen la difusión del proyecto.'}],
      glossary:[['CPV','Cost Per View: gasto de difusión / número de reproducciones. Un CPV bajo indica que el contenido se difunde con poco presupuesto.'],['CTR','Click-Through Rate: si el video tiene enlace, % de espectadores que hacen clic. Mide el poder de conversión del contenido.'],['Engagement rate','Tasa de interacción: (reacciones + comentarios + compartidos) / reproducciones × 100. Mide si la audiencia participa activamente.'],['Tratamiento narrativo','Documento que describe la estructura dramática del audiovisual: personajes, conflicto, resolución, tono y estética visual.'],['Motion graphics','Animación de gráficos, textos y elementos visuales para reforzar el mensaje. Se produce en After Effects o DaVinci Fusion.'],['Postproducción','Fase de edición, corrección de color, mezcla de audio y efectos visuales que ocurre después del rodaje.']] }
  ];
  /* Rúbrica OFICIAL IDC: 40 / 35 / 25 */
  const CRITS = [
    ['creativa','Calidad Creativa y Técnica',.40,'Originalidad conceptual · dominio de herramientas · coherencia estética · calidad de ejecución. Criterio nuclear.'],
    ['financiera','Desempeño Financiero y Estratégico',.35,'Cumplimiento de ROAS/CAC/LTV · eficiencia del presupuesto · decisiones basadas en datos · iteración.'],
    ['proceso','Proceso de Trabajo e Innovación',.25,'Gestión y plazos · integración de IA y automatización · documentación · reflexión crítica.']
  ];
  const INNOV = ['Incremental','Disruptiva','Radical'];

  const ST = {};
  CAREERS.forEach(c => { ST[c.id] = { title:c.ex.title, req:c.ex.req, innovType:c.ex.innovType, creativa:c.ex.creativa, financiera:c.ex.financiera, proceso:c.ex.proceso, lines:[] }; });
  let RATE = { buy:3.740, sell:3.760, date:'referencial', source:'manual' };

  const fmt = n => Math.round(n).toLocaleString('es-PE');
  const fmt2 = n => (Math.round(n*100)/100).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});
  const score = s => CRITS.reduce((a,[k,,w]) => a + w*(+s[k]||0), 0);
  const usd = soles => RATE.sell>0 ? soles/RATE.sell : 0;

  /* ===== PANTALLAS ===== */
  function buildScreensNav(){
    const nav=$('af-screens-nav'); nav.innerHTML='';
    SCREENS.forEach((s,i)=>{
      const b=document.createElement('button');
      b.className='af-screen-btn'+(i===0?' active':''); b.style.setProperty('--sc',s.color); b.dataset.screen=s.id;
      const amt = ['int','pub','mod','cav'].includes(s.id) ? `<span id="af-navamt-${s.id}" style="opacity:.75;font-weight:700"></span>` : '';
      b.innerHTML=`${s.ico} ${s.label} ${amt}`;
      b.onclick=()=>showScreen(s.id);
      nav.appendChild(b);
    });
  }
  function showScreen(id){
    document.querySelectorAll('#autofin-section .af-screen').forEach(s=>s.classList.toggle('active',s.id==='af-screen-'+id));
    document.querySelectorAll('#af-screens-nav .af-screen-btn').forEach(b=>b.classList.toggle('active',b.dataset.screen===id));
    const nav=$('af-screens-nav'); if(nav&&nav.scrollIntoView) nav.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderPhases(){
    $('af-phases').innerHTML = ABPP.map(p => `
      <div class="af-phase" style="--ph:${p.c}">
        <div class="af-phase-n">${p.n}</div>
        <div class="af-phase-b">
          <div class="af-phase-per">${p.per}</div>
          <div class="af-phase-tt">${p.t}</div>
          <div class="af-phase-dd">${p.d}</div>
          <div class="af-phase-out"><b>Entregable:</b> ${p.out}</div>
        </div>
      </div>`).join('');
  }

  /* ===== CRONOGRAMA ===== */
  function fmtDate(d){ return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear(); }
  function schedule(){
    const sV=$('af-start').value, eV=$('af-end').value, hours=+$('af-hours').value||0;
    const warn=$('af-sched-warn'), body=$('af-sched-body'), sum=$('af-sched-summary');
    const start=sV?new Date(sV+'T00:00:00'):null, end=eV?new Date(eV+'T00:00:00'):null;
    if(!start||!end||isNaN(start)||isNaN(end)||end<=start){
      warn.innerHTML='<div class="af-sched-warn">⚑ Ingresa una fecha de inicio y una de término válidas (término posterior al inicio).</div>';
      body.innerHTML=''; sum.innerHTML=''; return;
    }
    warn.innerHTML='';
    const totalDays=(end-start)/864e5, weeks=totalDays/7, totalW=ABPP.reduce((a,p)=>a+p.w,0);
    let cursor=new Date(start);
    body.innerHTML=ABPP.map(p=>{
      const phStart=new Date(cursor), phDays=totalDays*p.w/totalW, phEnd=new Date(phStart.getTime()+phDays*864e5); cursor=phEnd;
      const phHours=hours*p.w/totalW;
      return `<tr><td><span class="ph-dot" style="background:${p.c}"></span><b>Fase ${p.n}</b> · ${p.t}</td>
        <td>${fmtDate(phStart)} – ${fmtDate(phEnd)}</td><td class="num">${(phDays/7).toFixed(1)}</td>
        <td class="num">${Math.round(phHours)} h</td><td>${p.out}</td></tr>`;
    }).join('');
    const hpw=weeks>0?hours/weeks:0;
    sum.innerHTML=[['#8e44ad',(Math.round(weeks*10)/10),'Semanas'],['#0072b9',(Math.round(hpw*10)/10)+' h','Horas/semana'],
      ['#f3a100',hours+' h','Horas totales'],['#2ecc71',$('af-sem').value,'Semestre']]
      .map(([c,n,l])=>`<div class="af-succ-i"><div class="af-succ-n" style="color:${c}">${n}</div><div class="af-succ-l">${l}</div></div>`).join('');
  }

  /* EFSRT: créditos × horas/crédito = horas totales (sustento de las 200 h) */
  function efsrt(){
    const cred=+$('af-cred').value||0, hc=+$('af-hcred').value||0, tot=cred*hc;
    $('af-hours').value=tot;
    const eq=$('af-efsrt-eq'); if(eq) eq.textContent=`${cred} × ${hc} = ${tot} horas`;
    schedule();
  }

  /* ===== BCRP ===== */
  function saveProxy(){ try{ localStorage.setItem('bcrpProxy', ($('af-proxyUrl').value||'').trim()); }catch(e){} }
  async function fetchBCRP(){
    const st=$('af-fxStatus'); st.className='af-fx-status loading'; st.textContent='Conectando con el BCRP…';
    const proxy=(($('af-proxyUrl').value)||'').trim().replace(/\/+$/,'');
    try{
      const end=new Date(), start=new Date(Date.now()-25*864e5);
      const f=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      const series='PD04639PD-PD04640PD';
      const direct=`https://estadisticas.bcrp.gob.pe/estadisticas/series/api/${series}/json/${f(start)}/${f(end)}/esp`;
      const url=proxy?`${proxy}/?series=${series}&start=${f(start)}&end=${f(end)}`:direct;
      const ctrl=new AbortController(), to=setTimeout(()=>ctrl.abort(),10000);
      const res=await fetch(url,{signal:ctrl.signal,headers:{'Accept':'application/json'}}); clearTimeout(to);
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json(); let buy,sell,date;
      if(data.latest && data.latest.values){ buy=data.latest.values[0]; sell=data.latest.values[1]; date=data.latest.date; }
      else{ const ok=(data.periods||[]).filter(p=>p.values.some(v=>v&&v!=='n.d.')); if(!ok.length) throw new Error('sin datos');
        const last=ok[ok.length-1]; buy=parseFloat(last.values[0]); sell=parseFloat(last.values[1]); date=last.name; }
      if(isNaN(sell)) throw new Error('sin venta');
      RATE={ buy:isNaN(buy)?sell:buy, sell, date, source:proxy?'BCRP (proxy)':'BCRP directo' };
      $('af-rateBuy').value=RATE.buy.toFixed(3); $('af-rateSell').value=RATE.sell.toFixed(3);
      st.className='af-fx-status ok'; st.textContent='✔ Actualizado · '+RATE.source+' · '+date;
      applyRate();
    }catch(e){
      st.className='af-fx-status warn';
      st.textContent=proxy?'⚠ El proxy no respondió — usa valores manuales':'⚠ Sin conexión directa al BCRP (CORS) — usa el proxy o edita manual';
    }
  }
  function manualRate(){
    RATE.buy=parseFloat($('af-rateBuy').value)||RATE.buy; RATE.sell=parseFloat($('af-rateSell').value)||RATE.sell;
    RATE.source='manual'; RATE.date='manual';
    const st=$('af-fxStatus'); st.className='af-fx-status warn'; st.textContent='✎ Tipo de cambio manual';
    applyRate();
  }
  function applyRate(){ $('af-rateUsed').textContent=RATE.sell.toFixed(3); $('af-rateDate').textContent=RATE.date; conv('sol'); recalc(); }
  function conv(from){
    if(from==='sol'){ const s=parseFloat($('af-convSol').value)||0; $('af-convUsd').value=fmt2(usd(s)); }
    else{ const u=parseFloat($('af-convUsd').value)||0; $('af-convSol').value=fmt2(u*RATE.sell); }
  }

  /* ===== ESPECIALIDADES ===== */
  function buildSpecialties(){
    CAREERS.forEach(c=>{ $('af-screen-'+c.id).innerHTML=paneHTML(c); $('af-screen-'+c.id).style.setProperty('--acc',c.color); });
    CAREERS.forEach(c=>{
      const s=ST[c.id];
      $('af-'+c.id+'-title').oninput=e=>{ s.title=e.target.value; };
      $('af-'+c.id+'-req').oninput=e=>{ s.req=+e.target.value||0; recalc(); };
      $('af-'+c.id+'-innovType').onchange=e=>{ s.innovType=e.target.value; recalc(); };
      CRITS.forEach(([k])=>{ $('af-'+c.id+'-'+k).oninput=e=>{ s[k]=+e.target.value; $('af-'+c.id+'-'+k+'-v').textContent=e.target.value; recalc(); }; });
      renderChips(c.id);
    });
    recalc();
  }
  function paneHTML(c){
    const s=ST[c.id];
    return `
    <div class="af-card af-card-accent" style="--acc:${c.color}">
      <div class="af-kicker">${c.name}</div>
      <h2 class="af-acc">${c.ico} Requerimientos del proyecto</h2>
      <p class="af-sub">${c.focus}</p>
      <div class="af-two-col">
        <div><div class="af-mini-h">Entregables exigidos</div>
          <ul class="af-req-list">${c.reqs.map(r=>`<li>${r}</li>`).join('')}</ul></div>
        <div><div class="af-mini-h">Tecnologías sugeridas</div>
          <div class="af-tagrow">${c.tech.map(t=>`<span class="af-tg">${t}</span>`).join('')}</div>
          <div class="af-mini-h" style="margin-top:1rem">Estructura de presupuesto sugerida</div>
          <ul class="af-req-list">${c.budget.map(([b,p])=>`<li><b>${p}</b>&nbsp;${b}</li>`).join('')}</ul></div>
      </div>
    </div>

    <div class="af-card af-card-accent" style="--acc:${c.color}">
      <h2 class="af-acc">🔬 Líneas de investigación</h2>
      <p class="af-sub">Marca las que aplican a tu proyecto. Se añaden a los atributos y al prompt de IA.</p>
      <div class="af-mini-h" style="--acc:${c.color};margin-bottom:.4rem">Líneas propias de ${c.short}</div>
      <div class="af-rl">
        ${RLINES[c.id].map((l,i)=>`<label class="af-rl-item" id="af-rlitem-${c.id}-${i}" style="--acc:${c.color}"><input type="checkbox" onchange="VR.toggleLine('${c.id}',${i},this.checked)"><span>${l}</span></label>`).join('')}
      </div>
      <div class="af-mini-h" style="--acc:#8e44ad;margin-top:.9rem;margin-bottom:.4rem">🔀 Líneas transversales (cruzan todas las carreras)</div>
      <div class="af-rl">
        ${TLINES.map((l,i)=>`<label class="af-rl-item" id="af-rlitem-${c.id}-t${i}" style="--acc:#8e44ad"><input type="checkbox" onchange="VR.toggleTLine('${c.id}',${i},this.checked)"><span>${l}</span></label>`).join('')}
      </div>
      <div class="af-chips" id="af-chips-${c.id}"></div>
    </div>

    <div class="af-card af-card-accent" style="--acc:${c.color}">
      <h2 class="af-acc">🎛️ Simulador de evaluación (rúbrica 40/35/25)</h2>
      <p class="af-sub">Puntúa los 3 criterios (0–100). El reparto del presupuesto se recalcula en vivo.</p>
      <div class="af-sim-grid">
        <div><label>Título del proyecto</label><input id="af-${c.id}-title" value="${s.title}"><div class="af-help">Nombre claro y específico.</div></div>
        <div><label>Presupuesto solicitado (S/)</label><input id="af-${c.id}-req" type="number" value="${s.req}" min="0" step="500"><div class="af-help">Cuánto pides del fondo común.</div></div>
      </div>
      <div style="margin:.3rem 0 .8rem"><label>Tipo de innovación</label>
        <select id="af-${c.id}-innovType">${INNOV.map(t=>`<option ${t===s.innovType?'selected':''}>${t}</option>`).join('')}</select>
        <div class="af-help">Incremental = mejora · Disruptiva = nuevo modelo · Radical = inédito (exige prototipo).</div></div>
      ${CRITS.map(([k,lbl,w,hlp])=>`
        <div class="af-crit"><div class="af-crit-top"><b>${lbl} <span class="w">(peso ${Math.round(w*100)}%)</span></b><span class="sv" id="af-${c.id}-${k}-v">${s[k]}</span></div>
          <div class="af-crit-help">${hlp}</div>
          <input type="range" id="af-${c.id}-${k}" min="0" max="100" value="${s[k]}" style="--thumb:${c.color}"></div>`).join('')}
      <div class="af-result">
        <div class="af-result-header">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M7 6v4M7 4.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Resultado del simulador de reparto presupuestal
        </div>
        <p class="af-result-header-desc">Estos valores se recalculan en tiempo real según los puntajes de los 3 criterios. El presupuesto asignado depende tanto del puntaje de mérito de tu carrera como del fondo total disponible.</p>
        <div class="af-result-grid" style="margin-top:.7rem">
          <div class="af-rv">
            <div class="af-rv-num" id="af-${c.id}-score">0</div>
            <div class="af-rv-lbl">Puntaje S</div>
            <div class="af-rv-hint">Nota ponderada 0–100 calculada con los 3 sliders. A mayor puntaje, mayor presupuesto por mérito.</div>
          </div>
          <div class="af-rv">
            <div class="af-rv-num" id="af-${c.id}-alloc">—</div>
            <div class="af-rv-sub" id="af-${c.id}-allocUsd"></div>
            <div class="af-rv-lbl">Asignado</div>
            <div class="af-rv-hint">Monto en soles que te correspondería del fondo según la fórmula de reparto (parte igualitaria + parte por mérito).</div>
          </div>
          <div class="af-rv">
            <div class="af-rv-num" id="af-${c.id}-pct">0%</div>
            <div class="af-rv-lbl">% del fondo</div>
            <div class="af-rv-hint">Porcentaje del fondo total que concentraría tu carrera. El 100% se reparte entre las 4 carreras.</div>
          </div>
          <div class="af-rv">
            <div class="af-rv-num" id="af-${c.id}-var">—</div>
            <div class="af-rv-lbl">vs solicitado</div>
            <div class="af-rv-hint">Diferencia entre lo asignado y lo que pediste. Negativo (−) significa que recibirías menos de lo solicitado; debes reducir el alcance o mejorar el puntaje.</div>
          </div>
        </div>
        <div class="af-flags" id="af-${c.id}-flags"></div>
      </div>
    </div>

    <div class="af-card af-card-accent" style="--acc:${c.color}">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.6rem;margin-bottom:.6rem">
        <h2 class="af-acc" style="margin:0">💰 Tu presupuesto asignado — ${c.short}</h2>
        <button class="af-btn" style="font-size:.78rem;padding:.35rem .9rem" onclick="VR.showScreen('presupuesto')">Ver reparto completo →</button>
      </div>
      <p class="af-sub" style="margin-bottom:.7rem">Monto que te corresponde del fondo común según tu puntaje de mérito. Se actualiza con los sliders de arriba.</p>
      <div class="af-result-grid">
        <div class="af-rv"><div class="af-rv-num" id="af-${c.id}-balloc">—</div><div class="af-rv-sub" id="af-${c.id}-ballocUsd"></div><div class="af-rv-lbl">Asignado (S/)</div><div class="af-rv-hint">Soles que recibirías del fondo según la fórmula de mérito.</div></div>
        <div class="af-rv"><div class="af-rv-num" id="af-${c.id}-bpct">0%</div><div class="af-rv-lbl">% del fondo</div><div class="af-rv-hint">Tu carrera concentraría este porcentaje del total disponible.</div></div>
        <div class="af-rv"><div class="af-rv-num" id="af-${c.id}-bvar">—</div><div class="af-rv-lbl">vs solicitado</div><div class="af-rv-hint">Positivo ✔ = recibes más de lo pedido. Negativo ✖ = ajusta el alcance o sube tu puntaje.</div></div>
        <div class="af-rv"><div class="af-rv-num" id="af-${c.id}-breq">—</div><div class="af-rv-lbl">Solicitado (S/)</div><div class="af-rv-hint">Monto que ingresaste en "Presupuesto solicitado" arriba.</div></div>
      </div>
      <div class="af-flags" id="af-${c.id}-bflags"></div>
    </div>

    <div class="af-card af-card-accent" style="--acc:${c.color}">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.6rem;margin-bottom:.2rem">
        <h2 class="af-acc" style="margin:0">📊 Indicadores de éxito — ${c.short} 2026</h2>
        <button class="af-btn" style="font-size:.78rem;padding:.35rem .9rem" onclick="VR.openGlossary('${c.id}')">📖 Glosario de términos</button>
      </div>
      <p class="af-sub">Metas mínimas que debe alcanzar tu proyecto para ser aprobado por el comité evaluador del IDC.</p>
      <div class="af-succ">
        ${c.kpis.map(k=>`<div class="af-succ-i" title="${k.h}"><div class="af-succ-n" style="color:${k.c}">${k.v}</div><div class="af-succ-l">${k.l}</div><div class="af-rv-hint" style="font-size:.7rem;margin-top:.2rem">${k.h}</div></div>`).join('')}
      </div>
    </div>

    <!-- Glosario modal por especialidad -->
    <div class="tutorial-overlay" id="glossary-${c.id}" role="dialog" aria-modal="true" aria-label="Glosario ${c.name}" style="z-index:1100">
      <div class="tutorial-modal" style="max-width:560px">
        <div class="tutorial-header" style="background:${c.color}">
          <div><h2 style="color:#fff;margin:0">📖 Glosario — ${c.name}</h2><p style="color:rgba(255,255,255,.85);margin:.2rem 0 0">Términos clave para entender los indicadores y criterios de evaluación</p></div>
          <button class="tutorial-close" onclick="VR.closeGlossary('${c.id}')" aria-label="Cerrar glosario" style="color:#fff;border-color:rgba(255,255,255,.4)">&#x2715;</button>
        </div>
        <div class="tutorial-body" style="padding:1.2rem 1.5rem">
          ${c.glossary.map(([term,def])=>`<div style="margin-bottom:.9rem;padding-bottom:.9rem;border-bottom:1px solid var(--c-border)"><div style="font-weight:700;color:${c.color};margin-bottom:.2rem">${term}</div><div style="font-size:.88rem;color:var(--c-text-soft);line-height:1.55">${def}</div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="af-card af-card-accent" style="--acc:${c.color}">
      <h2 class="af-acc">⚡ Generador de prompt — ${c.short}</h2>
      <p class="af-sub">Genera un prompt para que Claude desarrolle el proyecto según la metodología ABPP.</p>
      <button class="af-btn primary full" onclick="VR.genPrompt('${c.id}')">Generar prompt de ${c.short}</button>
      <textarea class="af-promptBox" id="af-${c.id}-prompt" readonly></textarea>
      <div class="af-out-actions"><button class="af-btn" onclick="VR.copyP('${c.id}')">📋 Copiar prompt</button>
        <button class="af-btn" onclick="VR.dlP('${c.id}')">⬇ Descargar .txt</button></div>
    </div>

    <!-- Generador Word por especialidad -->
    <div class="af-card wgen-card" id="wgen-${c.id}" style="--wgen-color:${c.color};border:none;padding:0;overflow:visible;background:transparent;box-shadow:none">

      <!-- HEADER con liquid-morph -->
      <div class="wgen-header" style="background:${c.color}">
        <div>
          <div class="wgen-title-badge">DOCUMENTO OFICIAL IDC 2026</div>
          <h2 class="wgen-title">📄 Generar documento Word</h2>
          <p class="wgen-subtitle">${c.name} · ${c.short}</p>
        </div>
        <div style="display:flex;gap:.5rem;align-items:flex-start;flex-wrap:wrap">
          <button class="wgen-demo-btn" onclick="VR.demoPane('${c.id}')">▶ DEMO</button>
          <button class="wgen-clear-btn" onclick="VR.clearPane('${c.id}')">✕ Limpiar</button>
        </div>
      </div>

      <div style="padding:1.25rem;background:#fff;border:1px solid #e5e5e0;border-top:none;border-radius:0 0 12px 12px;box-shadow:0 4px 16px rgba(0,0,0,.07)">

        <!-- SELECTOR PLAN / INFORME — flip cards -->
        <p style="font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#999;margin:0 0 .6rem">Paso 1 — Tipo de documento</p>
        <div class="wgen-doc-grid">
          <label class="wgen-doc-card selected" id="wdc-plan-${c.id}" style="--bc:${c.color}">
            <input type="radio" name="af-wdt-${c.id}" value="plan" checked onchange="document.getElementById('wdc-plan-${c.id}').classList.add('selected');document.getElementById('wdc-inf-${c.id}').classList.remove('selected')" style="position:absolute;opacity:0">
            <div class="wgen-doc-front">
              <div class="wgen-doc-icon" style="background:${c.color}20;color:${c.color}">📋</div>
              <div class="wgen-doc-name" style="color:${c.color}">Plan PTIIT</div>
              <div class="wgen-doc-sub">11 secciones</div>
              <div class="wgen-doc-phase" style="background:${c.color}">INICIO · semanas 1–2</div>
            </div>
            <div class="wgen-doc-back" style="--bc:${c.color}">
              <div class="wgen-doc-back-title">¿Qué declara?</div>
              <ul class="wgen-doc-list">
                <li>📌 Equipo y título</li>
                <li>🔬 Líneas de investigación</li>
                <li>🎯 Objetivos y marco teórico</li>
                <li>⚙️ Metodología ABPP</li>
                <li>📅 Cronograma y presupuesto</li>
              </ul>
              <div class="wgen-doc-result">✅ El comité lo aprueba para que puedas iniciar</div>
            </div>
          </label>

          <label class="wgen-doc-card" id="wdc-inf-${c.id}">
            <input type="radio" name="af-wdt-${c.id}" value="informe" onchange="document.getElementById('wdc-inf-${c.id}').classList.add('selected');document.getElementById('wdc-plan-${c.id}').classList.remove('selected')" style="position:absolute;opacity:0">
            <div class="wgen-doc-front">
              <div class="wgen-doc-icon" style="background:#8e44ad20;color:#8e44ad">📄</div>
              <div class="wgen-doc-name" style="color:#8e44ad">Informe PTIIT</div>
              <div class="wgen-doc-sub">4 capítulos</div>
              <div class="wgen-doc-phase" style="background:#8e44ad">CIERRE · semana 12</div>
            </div>
            <div class="wgen-doc-back" style="--bc:#8e44ad">
              <div class="wgen-doc-back-title">¿Qué reporta?</div>
              <ul class="wgen-doc-list">
                <li>I. Planteamiento del problema</li>
                <li>II. Marco teórico</li>
                <li>III. Metodología ejecutada</li>
                <li>IV. Resultados y discusión</li>
              </ul>
              <div class="wgen-doc-result">🎓 Se sustenta ante el jurado evaluador</div>
            </div>
          </label>
        </div>
        <div class="wgen-tip" style="border-color:${c.color}">
          💡 <b>¿Cuál elegir?</b> Proyecto comenzando → <b>Plan PTIIT</b>. Ya terminaste y vas a sustentar → <b>Informe PTIIT</b>. <span style="color:#aaa">Hover sobre cada tarjeta para ver su contenido.</span>
        </div>

        <!-- CAMPOS DEL FORMULARIO -->
        <p style="font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#999;margin:1.1rem 0 .6rem">Paso 2 — Datos del equipo</p>
        <div class="wgen-form-grid">

          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Apellidos y nombres — Autor 1 *</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Escribe tus apellidos primero (ambos si los tienes), luego tu nombre. Ejemplo: «García López, Ana Sofía». Este nombre aparecerá en la portada y en la declaración de autoría del documento oficial.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-a1" placeholder="García López, Ana Sofía">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">DNI — Autor 1 *</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Ingresa tu número de DNI de 8 dígitos exactos, sin puntos ni espacios. Este dato se usa en la declaración de autoría y derechos de propiedad intelectual.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-d1" placeholder="12345678" maxlength="8">
          </div>

          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Apellidos y nombres — Autor 2</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Si tu equipo tiene un segundo integrante, escribe sus apellidos y nombre. El equipo puede tener hasta 4 estudiantes de 1.° a 5.° semestre. Deja vacío si eres el único integrante.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-a2" placeholder="Apellido Apellido, Nombre">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">DNI — Autor 2</label>
              <button class="wgen-help" onclick="wgenHelp(this,'DNI del segundo integrante. Deja vacío si no aplica.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-d2" placeholder="12345678" maxlength="8">
          </div>

          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Apellidos y nombres — Autor 3</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Tercer integrante del equipo. Recuerda que si algún miembro se retira, deberán firmar una Carta Poder notarial cediendo sus derechos al resto del equipo.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-a3" placeholder="Apellido Apellido, Nombre">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">DNI — Autor 3</label>
              <button class="wgen-help" onclick="wgenHelp(this,'DNI del tercer integrante.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-d3" placeholder="12345678" maxlength="8">
          </div>

          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Apellidos y nombres — Autor 4</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Cuarto y último integrante permitido. El máximo es 4 estudiantes por equipo según el Reglamento IDC 2026.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-a4" placeholder="Apellido Apellido, Nombre">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">DNI — Autor 4</label>
              <button class="wgen-help" onclick="wgenHelp(this,'DNI del cuarto integrante.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-d4" placeholder="12345678" maxlength="8">
          </div>

          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Asesor(a) *</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Escribe el nombre completo y grado del docente que asesora tu proyecto. Ejemplo: «Mg. Rodríguez Campos, Luis Alberto». Si aún no tienes asesor asignado, escribe «Por asignar».')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-asesor" placeholder="Mg. Rodríguez Campos, Luis Alberto">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Título del proyecto *</label>
              <button class="wgen-help" onclick="wgenHelp(this,'El título debe ser claro, específico y descriptivo. Fórmula útil: «[Acción] + [objeto] + [en/para] + [contexto/población/lugar]». Ejemplo: «Diseño de sistema de identidad visual para emprendimientos gastronómicos de Lima Norte usando IA generativa».')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-tit" placeholder="Diseño de sistema de identidad visual para emprendimientos gastronómicos de Lima Norte">
          </div>

          <div class="wgen-field" style="grid-column:1/-1">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Objetivo general *</label>
              <button class="wgen-help" onclick="wgenHelp(this,'El objetivo general describe el propósito central de tu proyecto. Usa un verbo en infinitivo (Diseñar, Desarrollar, Implementar, Analizar, Crear). Debe ser medible y alcanzable en 12 semanas. Ejemplo: «Diseñar una propuesta de branding integral para tres emprendimientos gastronómicos del distrito de Los Olivos que incremente su reconocimiento de marca en un 20% al finalizar el ciclo».')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-objg" placeholder="Diseñar una propuesta de branding integral para tres emprendimientos gastronómicos que incremente el reconocimiento de marca en 20%">
          </div>
          <div class="wgen-field" style="grid-column:1/-1">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Objetivo específico 1</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Los objetivos específicos descomponen el objetivo general en acciones concretas y verificables. Cada uno debe corresponder a una fase ABPP. Verbo + qué + cómo + para qué. Ejemplo: «Diagnosticar el estado actual del branding de los emprendimientos seleccionados mediante entrevistas y análisis FODA para identificar oportunidades de mejora en la fase de Briefing».')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-obje" placeholder="Diagnosticar el estado actual del branding mediante análisis FODA e identidad competitiva">
          </div>

          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Fecha de inicio *</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Fecha en que oficialmente comienza el proyecto (Phase 01 — Briefing). Normalmente coincide con el inicio del semestre o con la aprobación del Plan por parte del comité.')">?</button></div>
            <input type="date" class="af-in" id="af-wd-${c.id}-ini">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Fecha de fin *</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Fecha de cierre del proyecto (Phase 04 — Socialización). La duración total es de 12 semanas (84 días) desde el inicio. El sistema calculará automáticamente la fecha si usas el Tutorial.')">?</button></div>
            <input type="date" class="af-in" id="af-wd-${c.id}-fin">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Total de horas EFSRT</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Las horas EFSRT (Experiencias Formativas en Situaciones Reales de Trabajo) equivalen a créditos de práctica profesional según el numeral 20.3.3.1. El mínimo es 200 horas. Fórmula: créditos × horas por crédito. Si tienes dudas, mantén 200.')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-hrs" placeholder="200" value="200">
          </div>
          <div class="wgen-field">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Lugar de ejecución</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Indica el lugar principal donde se ejecutará el proyecto. Puede ser el IDC, un distrito específico, una empresa u organización, o un entorno virtual. Ejemplo: «Instituto IDC — Lima, San Isidro» o «Emprendimientos gastronómicos, Los Olivos, Lima».')">?</button></div>
            <input class="af-in" id="af-wd-${c.id}-lugar" placeholder="Instituto IDC — Lima, Perú">
          </div>

          <div class="wgen-field" style="grid-column:1/-1">
            <div class="wgen-lbl-row"><label class="af-lbl" style="margin:0">Descripción / resumen del proyecto</label>
              <button class="wgen-help" onclick="wgenHelp(this,'Redacta un resumen de 100 a 200 palabras que responda: ¿qué problema resuelves?, ¿a quién beneficia?, ¿qué solución propones?, ¿qué metodología usas? y ¿qué resultado esperas? Ejemplo: «El proyecto propone diseñar un sistema de identidad visual para tres emprendimientos gastronómicos de Lima Norte que carecen de branding coherente. Mediante la metodología ABPP y herramientas de IA generativa, se crearán logotipos, paletas de color y manuales de marca que eleven el reconocimiento de marca y la captación de clientes en un 20%».')">?</button></div>
            <textarea class="af-in" id="af-wd-${c.id}-desc" rows="3" placeholder="El proyecto propone... [problema que resuelves] ... mediante ... [metodología/herramientas] ... con el objetivo de ... [resultado esperado y a quién beneficia]." style="resize:vertical"></textarea>
          </div>

          <!-- Referencias con flip-card -->
          <div class="wgen-field" style="grid-column:1/-1">
            <div class="wgen-flip-wrap">
              <div class="wgen-flip-card" id="wfc-refs-${c.id}">
                <div class="wgen-flip-front">
                  <div class="wgen-lbl-row">
                    <label class="af-lbl" style="margin:0;color:#1a5e1a">📚 Referencias bibliográficas (APA 7) — una por línea</label>
                    <div style="display:flex;gap:.4rem">
                      <button class="wgen-help" onclick="wgenHelp(this,'Escribe cada referencia en una línea separada usando el formato APA 7.ª edición. Estructura para libro: Apellido, A. A. (año). Título del libro. Editorial. Para artículo: Apellido, A. A. (año). Título del artículo. Nombre de la revista, volumen(número), páginas. https://doi.org/... Mínimo 5 referencias académicas.')">?</button>
                      <button class="wgen-flip-btn" onclick="document.getElementById('wfc-refs-${c.id}').classList.toggle('flipped')" title="Ver guía APA 7">↻ Guía</button>
                    </div>
                  </div>
                  <textarea class="af-in" id="af-wd-${c.id}-refs" rows="5" placeholder="Brown, T. (2009). Change by design. HarperCollins.&#10;Osterwalder, A. y Pigneur, Y. (2010). Business model generation. Wiley.&#10;García, M. (2023). Identidad visual y branding digital. Revista Diseño, 4(2), 12–28. https://doi.org/10.xxxx" style="resize:vertical;font-size:.82rem;border-color:#2ecc71"></textarea>
                </div>
                <div class="wgen-flip-back" style="background:linear-gradient(135deg,#1a5e1a,#2ecc71)">
                  <div style="font-weight:800;font-size:.95rem;margin-bottom:.7rem">📖 Formato APA 7 — Referencia rápida</div>
                  <div class="wgen-apa-row"><span class="wgen-apa-tag">Libro</span><span>Apellido, A. (año). <i>Título</i>. Editorial.</span></div>
                  <div class="wgen-apa-row"><span class="wgen-apa-tag">Artículo</span><span>Apellido, A. (año). Título. <i>Revista, vol</i>(núm), pp. https://doi.org/…</span></div>
                  <div class="wgen-apa-row"><span class="wgen-apa-tag">Web</span><span>Autor/Org. (año). <i>Título</i>. Sitio. URL</span></div>
                  <div class="wgen-apa-row"><span class="wgen-apa-tag">Tesis</span><span>Apellido, A. (año). <i>Título</i> [Tesis de grado, Universidad]. Repositorio.</span></div>
                  <div style="margin-top:.8rem;font-size:.78rem;opacity:.85">Mínimo 5 referencias · Sangría francesa en el doc final</div>
                  <button class="wgen-flip-btn" style="margin-top:.7rem;background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.4);color:#fff" onclick="document.getElementById('wfc-refs-${c.id}').classList.toggle('flipped')">← Volver a escribir</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Declaración IA con flip-card -->
          <div class="wgen-field" style="grid-column:1/-1">
            <div class="wgen-flip-wrap">
              <div class="wgen-flip-card" id="wfc-ia-${c.id}">
                <div class="wgen-flip-front">
                  <div class="wgen-lbl-row">
                    <label class="af-lbl" style="margin:0;color:#0057a0">🤖 Declaración de uso de IA — herramientas e impacto</label>
                    <div style="display:flex;gap:.4rem;align-items:center">
                      <a href="https://mario55666.github.io/REGLA_IA_2026/" target="_blank" style="font-size:.72rem;color:#0072b9;text-decoration:none;border:1px solid #0072b9;padding:.2rem .5rem;border-radius:4px;white-space:nowrap;font-weight:600" title="Ver Reglamento IA IDC 2026">📋 Reglamento IA</a>
                      <button class="wgen-help" onclick="wgenHelp(this,'Indica qué herramientas de IA usaste, con qué propósito específico y cómo verificaste los resultados. Ejemplo: «Se utilizó Claude (Anthropic) para revisar la redacción del marco teórico y sugerir mejoras de coherencia. Midjourney v6 para generar referencias visuales de tendencias de diseño. Todos los contenidos fueron revisados, editados y validados por los autores. El trabajo intelectual creativo es de autoría propia». Si no usaste IA, decláralo: «Los autores declaran que no se utilizaron herramientas de inteligencia artificial en ninguna etapa del proyecto».')">?</button>
                      <button class="wgen-flip-btn" onclick="document.getElementById('wfc-ia-${c.id}').classList.toggle('flipped')" title="Ver ejemplos de declaración">↻ Ejemplos</button>
                    </div>
                  </div>
                  <textarea class="af-in" id="af-wd-${c.id}-ia" rows="3" placeholder="Se utilizó [herramienta] para [propósito concreto]. Los autores verificaron y validaron todos los contenidos generados. El trabajo creativo e intelectual es de autoría propia." style="resize:vertical;border-color:#0072b9"></textarea>
                </div>
                <div class="wgen-flip-back" style="background:linear-gradient(135deg,#003f7a,#0072b9)">
                  <div style="font-weight:800;font-size:.95rem;margin-bottom:.7rem">🤖 Ejemplos de declaración IA</div>
                  <div class="wgen-apa-row" style="flex-direction:column;gap:.15rem">
                    <span class="wgen-apa-tag" style="width:fit-content">Con IA</span>
                    <span style="font-size:.78rem;line-height:1.4;font-style:italic">«Se utilizó Claude para asistencia en redacción del marco teórico y Midjourney v6 para referencias visuales de tendencias. Todos los contenidos fueron revisados y validados por los autores. La autoría creativa es propia.»</span>
                  </div>
                  <div class="wgen-apa-row" style="flex-direction:column;gap:.15rem;margin-top:.6rem">
                    <span class="wgen-apa-tag" style="background:#2ecc71;width:fit-content">Sin IA</span>
                    <span style="font-size:.78rem;line-height:1.4;font-style:italic">«Los autores declaran que no se utilizaron herramientas de inteligencia artificial en ninguna etapa del proyecto. Todo el contenido es de autoría humana íntegra.»</span>
                  </div>
                  <div style="margin-top:.8rem;font-size:.75rem;opacity:.85">Ver Reglamento completo: <a href="https://mario55666.github.io/REGLA_IA_2026/" target="_blank" style="color:#90cdf4">mario55666.github.io/REGLA_IA_2026</a></div>
                  <button class="wgen-flip-btn" style="margin-top:.7rem;background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.4);color:#fff" onclick="document.getElementById('wfc-ia-${c.id}').classList.toggle('flipped')">← Volver a escribir</button>
                </div>
              </div>
            </div>
          </div>

        </div><!-- /wgen-form-grid -->

        <div style="display:flex;flex-direction:column;gap:.6rem;margin-top:1.1rem">
          <button class="wgen-gen-btn" style="--lm-color:${c.color};margin-top:0"
            onclick="VR.genPaneOficial('${c.id}')">
            <span>🧩 Plantilla oficial rellenada (.docx) — matriz del formulario</span>
          </button>
          <button style="display:block;width:100%;padding:.7rem 1rem;font-size:.85rem;font-weight:700;font-family:var(--font-body);color:${c.color};background:#fff;border:2px solid ${c.color};border-radius:10px;cursor:pointer;transition:background .2s,color .2s"
            onmouseover="this.style.background='${c.color}';this.style.color='#fff'"
            onmouseout="this.style.background='#fff';this.style.color='${c.color}'"
            onclick="VR.downloadTemplate('${c.id}')">
            📥 Descargar plantilla Word institucional en blanco — ${c.name}
          </button>
          <button style="display:block;width:100%;padding:.7rem 1rem;font-size:.85rem;font-weight:700;font-family:var(--font-body);color:${c.color};background:#fff;border:2px solid ${c.color};border-radius:10px;cursor:pointer;transition:background .2s,color .2s"
            onmouseover="this.style.background='${c.color}';this.style.color='#fff'"
            onmouseout="this.style.background='#fff';this.style.color='${c.color}'"
            onclick="VR.genWordPane('${c.id}')">
            ✏️ Generar documento Word personalizado (con formulario)
          </button>
        </div>

      </div><!-- /inner -->
    </div><!-- /wgen-card -->`;
  }
  function toggleLine(id,i,checked){
    const arr=ST[id].lines, line=RLINES[id][i];
    if(checked){ if(!arr.includes(line)) arr.push(line); } else { ST[id].lines=arr.filter(x=>x!==line); }
    const item=$('af-rlitem-'+id+'-'+i); if(item) item.classList.toggle('checked',checked);
    renderChips(id); recalc();
  }
  function toggleTLine(id,i,checked){
    const arr=ST[id].lines, line=TLINES[i];
    if(checked){ if(!arr.includes(line)) arr.push(line); } else { ST[id].lines=arr.filter(x=>x!==line); }
    const item=$('af-rlitem-'+id+'-t'+i); if(item) item.classList.toggle('checked',checked);
    renderChips(id); recalc();
  }
  function renderChips(id){
    const box=$('af-chips-'+id); if(!box) return;
    box.innerHTML = ST[id].lines.length
      ? ST[id].lines.map(l=>`<span class="af-chip">✓ ${l}</span>`).join('')
      : '<span class="af-help">Aún no seleccionas líneas de investigación.</span>';
  }
  function openGlossary(id){ const o=$('glossary-'+id); if(o){ o.classList.add('open'); document.body.style.overflow='hidden'; } }
  function closeGlossary(id){ const o=$('glossary-'+id); if(o){ o.classList.remove('open'); document.body.style.overflow=''; } }

  /* ===== REPARTO ===== */
  function compute(){
    const F=+$('af-fund').value||0, N=CAREERS.length, weq=(+$('af-weq').value)/100;
    const scores=CAREERS.map(c=>score(ST[c.id])), sumS=scores.reduce((a,b)=>a+b,0);
    const eq=weq*F/N, merPool=(1-weq)*F;
    return CAREERS.map((c,i)=>({ id:c.id, color:c.color, short:c.short, S:scores[i], alloc:eq+(sumS>0?merPool*scores[i]/sumS:merPool/N), req:ST[c.id].req }));
  }
  function recalc(){
    const F=+$('af-fund').value||0, weq=+$('af-weq').value, cap=+$('af-cap').value;
    $('af-weqLbl').textContent=weq+'%'; $('af-wmerLbl').textContent=(100-weq)+'%'; $('af-capLbl').textContent=cap+'%';
    const rows=compute(), maxAlloc=Math.max(...rows.map(r=>r.alloc),1); let total=0;
    const bars=$('af-distBars'); bars.innerHTML='';
    rows.forEach(r=>{
      total+=r.alloc; const pct=F>0?r.alloc/F*100:0, over=F>0&&pct>cap;
      const row=document.createElement('div'); row.className='af-dist-row'; row.style.setProperty('--bar',r.color);
      row.innerHTML=`<div class="af-dist-top">
        <span class="af-dist-name">${r.short}${over?` <span class="af-flagchip">⚑ &gt; cap ${cap}%</span>`:''}</span>
        <span><span class="af-dist-amt">S/ ${fmt(r.alloc)}</span><span class="af-dist-usd">≈ US$ ${fmt(usd(r.alloc))}</span><span class="af-dist-pct">${pct.toFixed(1)}%</span></span></div>
        <div class="af-dist-track"><div class="af-dist-fill" style="width:${F>0?(r.alloc/maxAlloc*100):0}%">${pct>=8?pct.toFixed(0)+'%':''}</div></div>`;
      bars.appendChild(row);
      const navAmt=$('af-navamt-'+r.id); if(navAmt) navAmt.textContent='· S/ '+fmt(r.alloc);
      $('af-'+r.id+'-score').textContent=r.S.toFixed(0);
      $('af-'+r.id+'-alloc').textContent=`S/ ${fmt(r.alloc)}`;
      $('af-'+r.id+'-allocUsd').textContent=`≈ US$ ${fmt(usd(r.alloc))}`;
      $('af-'+r.id+'-pct').textContent=pct.toFixed(1)+'%';
      const diff=r.alloc-r.req, vEl=$('af-'+r.id+'-var');
      vEl.textContent=(diff>=0?'+':'−')+'S/ '+fmt(Math.abs(diff)); vEl.style.color=diff>=0?'#1a8a4a':'#d9480f';
      /* mini-budget panel in each specialty screen */
      const bAlloc=$('af-'+r.id+'-balloc'), bPct=$('af-'+r.id+'-bpct'), bVar=$('af-'+r.id+'-bvar'), bReq=$('af-'+r.id+'-breq'), bUsd=$('af-'+r.id+'-ballocUsd'), bFlags=$('af-'+r.id+'-bflags');
      if(bAlloc){ bAlloc.textContent=`S/ ${fmt(r.alloc)}`; }
      if(bPct){ bPct.textContent=pct.toFixed(1)+'%'; }
      if(bUsd){ bUsd.textContent=`≈ US$ ${fmt(usd(r.alloc))}`; }
      if(bReq){ bReq.textContent=`S/ ${fmt(r.req)}`; }
      if(bVar){ bVar.textContent=(diff>=0?'✔ +':'✖ −')+'S/ '+fmt(Math.abs(diff)); bVar.style.color=diff>=0?'#1a8a4a':'#d9480f'; }
      if(bFlags){ bFlags.innerHTML=''; if(diff<0){ const d=document.createElement('div'); d.className='af-flag'; d.innerHTML=`⚑ Asignado menor en S/ ${fmt(Math.abs(diff))}. Reduce el alcance o mejora tu puntaje.`; bFlags.appendChild(d); } else if(r.S>0){ const d=document.createElement('div'); d.className='af-flag ok'; d.innerHTML=`✔ Puntaje suficiente para cubrir lo solicitado.`; bFlags.appendChild(d); } }
      renderFlags(r,cap,pct,diff);
    });
    $('af-distTotal').textContent=`S/ ${fmt(total)}`; $('af-distTotalUsd').textContent=`≈ US$ ${fmt(usd(total))}`; $('af-distFund').textContent=`S/ ${fmt(F)}`;
  }
  function renderFlags(r,cap,pct,diff){
    const s=ST[r.id], box=$('af-'+r.id+'-flags'); box.innerHTML='';
    const add=(t,ok)=>{ const d=document.createElement('div'); d.className='af-flag'+(ok?' ok':''); d.innerHTML=(ok?'✔ ':'⚑ ')+t; box.appendChild(d); };
    let any=false;
    if(pct>cap){ add(`Excede el cap de ${cap}% del fondo (${pct.toFixed(1)}%). Rebalancear o justificar.`); any=true; }
    if(s.creativa<60){ add('Calidad creativa baja (&lt;60): es el criterio nuclear (40%).'); any=true; }
    if(s.financiera<60){ add('Desempeño financiero bajo (&lt;60): define ROAS/CAC/LTV objetivo.'); any=true; }
    if(s.proceso<55){ add('Proceso e innovación bajo (&lt;55): documenta el uso de IA y la gestión.'); any=true; }
    if(s.innovType==='Radical' && s.financiera<60){ add('Innovación <b>Radical</b> con finanzas débiles: exige prototipo y plan de viabilidad.'); any=true; }
    if(!s.lines||!s.lines.length){ add('Sin líneas de investigación seleccionadas: marca al menos una.'); any=true; }
    if(diff<0){ add(`Asignado menor al solicitado en S/ ${fmt(Math.abs(diff))} (≈ US$ ${fmt(usd(Math.abs(diff)))}): ajusta el alcance o sube tu puntaje.`); any=true; }
    if(!any) add('Sin alertas: cumple los umbrales de la rúbrica.', true);
  }

  /* ===== PROMPT ===== */
  function genPrompt(id){
    const c=CAREERS.find(x=>x.id===id), s=ST[id], r=compute().find(x=>x.id===id);
    const F=+$('af-fund').value||0, pct=F>0?r.alloc/F*100:0, diff=r.alloc-s.req;
    const ownLines=(s.lines||[]).filter(l=>!TLINES.includes(l)), transLines=(s.lines||[]).filter(l=>TLINES.includes(l));
    const lines=(s.lines&&s.lines.length)
      ? [...ownLines.map(l=>'- '+l), ...(transLines.length?['### Transversales',...transLines.map(l=>'- '+l)]:[])] .join('\n')
      : '- (ninguna seleccionada)';
    const p = `# Proyecto autofinanciado de Investigación e Innovación — ${c.name} (IDC 2026)

Actúa como mentor y revisor de valoración (adaptado del agente "valuation-reviewer") para un trabajo de investigación e innovación tecnológica autogestionado por un estudiante del IDC, liderado por la carrera de ${c.name}. No inventes datos faltantes; la IA redacta y el comité firma.

## Proyecto
- Título: ${s.title||'[sin título]'}
- Carrera líder: ${c.name}
- Enfoque: ${c.focus}
- Tipo de innovación: ${s.innovType}

## Líneas de investigación seleccionadas
${lines}

## Evaluación — rúbrica oficial IDC (0–100)
${CRITS.map(([k,lbl,w])=>`- ${lbl} (peso ${Math.round(w*100)}%): ${s[k]}`).join('\n')}
- Puntaje ponderado S = ${r.S.toFixed(1)}/100

## Presupuesto autofinanciado (tipo de cambio BCRP)
- Tipo de cambio venta (S/ por US$): ${RATE.sell.toFixed(3)} — fuente: ${RATE.source} (${RATE.date})
- Fondo común del equipo: S/ ${fmt(F)} (≈ US$ ${fmt(usd(F))})
- Solicitado por este proyecto: S/ ${fmt(s.req)} (≈ US$ ${fmt(usd(s.req))})
- Asignado por la fórmula: S/ ${fmt(r.alloc)} (≈ US$ ${fmt(usd(r.alloc))}) = ${pct.toFixed(1)}% del fondo
- Diferencia vs solicitado: ${diff>=0?'+':'−'}S/ ${fmt(Math.abs(diff))}
- Estructura de gasto sugerida: ${c.budget.map(([b,pc])=>`${pc} ${b}`).join(' · ')}

## Marco y cronograma
- Modalidad: proyecto AUTOFINANCIADO por el estudiante.
- Categoría: extracurricular, equivalente a ${(+$('af-hours').value||200)} horas de práctica profesional.
- Ventana de presentación: ${$('af-sem')?$('af-sem').value:'1.°–5.°'} (válida del 1.° al 5.° semestre).
- Inicio: ${$('af-start')&&$('af-start').value?$('af-start').value:'[definir]'} · Término: ${$('af-end')&&$('af-end').value?$('af-end').value:'[definir]'}.

## Entregables exigidos para esta carrera
${c.reqs.map((x,i)=>`${i+1}. ${x}`).join('\n')}

## Metodología ABPP (4 fases · 12 semanas)
1. Briefing y diagnóstico estratégico → estrategia con hipótesis ROAS/CAC.
2. Prototipado rápido y validación con IA → portafolio de variantes + A/B.
3. Ejecución y monitoreo en tiempo real → dashboard de métricas en vivo.
4. Análisis y socialización → Informe de Rentabilidad Creativa.

## Lo que necesito de ti
1. Plan de desarrollo en las 4 fases ABPP, con hitos, entregables verificables y fechas.
2. Justificación del presupuesto: desglosa el monto asignado (S/ ${fmt(r.alloc)}) en partidas según la estructura sugerida; reporta cada partida en soles y dólares al TC venta ${RATE.sell.toFixed(3)}.
3. Metas financieras: define ROAS/CAC/LTV objetivo y cómo medirlos.
4. Plan de convergencia con al menos otra de las 4 carreras.
5. Checklist de evidencia para el sign-off del comité (ROAS positivo, NPS ≥60, casos documentados).
6. Flags de riesgo y cómo mitigarlos.

Entrega todo "staged" para revisión de la Unidad de Investigación del IDC; no des nada por aprobado.`;
    const box=$('af-'+id+'-prompt'); box.value=p; box.classList.add('show'); box.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function copyP(id){ const t=$('af-'+id+'-prompt'); t.select(); t.setSelectionRange(0,99999);
    navigator.clipboard.writeText(t.value).then(toast).catch(()=>{document.execCommand('copy');toast();}); }
  function dlP(id){ const c=CAREERS.find(x=>x.id===id); const blob=new Blob([$('af-'+id+'-prompt').value],{type:'text/plain'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='prompt-'+c.short.toLowerCase()+'-idc.txt'; a.click(); }
  function toast(){ const t=$('af-toast'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1600); }

  /* ===== INSCRIPCIÓN / FORMULARIO ===== */
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function memberHTML(n, grupal){
    return `<div class="af-member" id="af-mem-${n}">
      <div class="af-mtitle">Integrante ${n}</div>
      ${grupal?`<button type="button" class="rm" onclick="VR.removeMember(${n})">Quitar</button>`:''}
      <div class="af-form-grid">
        <div class="full"><label>Apellidos y nombres</label><input class="m-nombre" placeholder="Apellidos y nombres completos"></div>
        <div><label>N.° de matrícula</label><input class="m-mat" placeholder="N.° de matrícula"></div>
        <div><label>Semestre (1–5)</label><select class="m-sem"><option>1.°</option><option>2.°</option><option selected>3.°</option><option>4.°</option><option>5.°</option></select></div>
        <div><label>DNI</label><input class="m-dni" placeholder="DNI"></div>
        <div><label>Correo institucional</label><input class="m-correo" type="email" placeholder="correo@idc.edu.pe"></div>
        <div><label>Teléfono</label><input class="m-tel" placeholder="N.° celular"></div>
      </div>
    </div>`;
  }
  function isGrupal(){ const r=document.querySelector('input[name="af-modal"]:checked'); return r && r.value==='Grupal'; }
  function setModalidad(){
    const grupal=isGrupal(), box=$('af-members'), addBtn=$('af-addmember');
    box.innerHTML=''; mIdx=0;
    addBtn.style.display = grupal ? '' : 'none';
    addMember(); if(grupal) addMember(); // grupal arranca con 2
  }
  function addMember(){
    if(mIdx>=6){ return; }
    mIdx++;
    const grupal=isGrupal();
    box_append('af-members', memberHTML(mIdx, grupal));
  }
  function box_append(id,html){ const d=document.createElement('div'); d.innerHTML=html; $(id).appendChild(d.firstChild); }
  function removeMember(n){ const el=$('af-mem-'+n); if(el) el.remove(); }
  function readMembers(){
    return [...document.querySelectorAll('#af-members .af-member')].map(m=>({
      nombre:(m.querySelector('.m-nombre').value||'').trim(),
      mat:(m.querySelector('.m-mat').value||'').trim(),
      sem:m.querySelector('.m-sem').value,
      dni:(m.querySelector('.m-dni').value||'').trim(),
      correo:(m.querySelector('.m-correo').value||'').trim(),
      tel:(m.querySelector('.m-tel').value||'').trim()
    })).filter(x=>x.nombre||x.mat);
  }
  const LPREF = { int:'DI', pub:'DP', mod:'DM', cav:'CA' };
  const COORD_MAP = { int:'Dis. María Quintana Pérez Tudela', pub:'Dis. Javier Mendives Laura', mod:'Mg. Fany Picón Tejedo', cav:'Mg. Alejandro Seminario Campos' };
  function fillLineOptions(){
    const esp=$('af-f-esp').value, sel=$('af-f-linea'), pre=LPREF[esp]||'L';
    sel.innerHTML=(RLINES[esp]||[]).map((l,i)=>`<option>${pre}-L${i+1} — ${l}</option>`).join('');
    // Auto-completar coordinador según especialidad
    const coordF=$('af-f-coord'); if(coordF&&!coordF.dataset.edited) coordF.value=COORD_MAP[esp]||'';
    // Acento de la pantalla de Inscripción con el color corporativo de la especialidad
    const col=CCOL[esp]||'#0072b9', sc=$('af-screen-inscripcion');
    if(sc){
      const cards=sc.querySelectorAll('.af-card');
      if(cards[0]) cards[0].style.setProperty('--acc',col);
      if(cards[cards.length-1]) cards[cards.length-1].style.setProperty('--acc',col);
      const chip=$('af-insc-chip'); if(chip){ chip.style.setProperty('--acc',col); chip.textContent=ESPN[esp]||esp; }
    }
  }
  function importFromTool(){
    const esp=$('af-f-esp').value, s=ST[esp];
    if(s){ $('af-f-titulo').value=s.title||''; $('af-f-innov').value=s.innovType||'Incremental';
      $('af-f-presup').value=s.req||0;
      if(s.lines&&s.lines.length){ fillLineOptions();
        const opt=[...$('af-f-linea').options].find(o=>o.text.includes(s.lines[0])); if(opt) opt.selected=true; } }
    if($('af-start')&&$('af-start').value) $('af-f-inicio').value=$('af-start').value;
    if($('af-end')&&$('af-end').value) $('af-f-termino').value=$('af-end').value;
    if($('af-hours')) $('af-f-horas').value=$('af-hours').value;
    toast2('Datos importados de la herramienta');
  }
  // Filas del cronograma (8) a partir de fechas/horas del formulario
  function scheduleRows(startV, endV, hours){
    const start=startV?new Date(startV+'T00:00:00'):null, end=endV?new Date(endV+'T00:00:00'):null;
    if(!start||!end||isNaN(start)||isNaN(end)||end<=start) return null;
    const totalDays=(end-start)/864e5, totalW=ABPP.reduce((a,p)=>a+p.w,0); let cur=new Date(start);
    return ABPP.map(p=>{
      const ps=new Date(cur), pd=totalDays*p.w/totalW, pe=new Date(ps.getTime()+pd*864e5); cur=pe;
      return { fase:'Fase '+p.n, t:p.t, periodo:fmtDate(ps)+' – '+fmtDate(pe), semanas:(pd/7).toFixed(1), horas:Math.round(hours*p.w/totalW), out:p.out };
    });
  }
  function toast2(msg){ const t=$('af-toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>{t.classList.remove('show'); t.textContent='Copiado ✓';},1800); }

  const ESPN = { int:'Diseño de Interiores', pub:'Diseño Publicitario', mod:'Diseño de Modas', cav:'Comunicación Audiovisual' };
  function fdate(v){ if(!v) return '—'; const d=new Date(v+'T00:00:00'); return isNaN(d)?v:fmtDate(d); }

  const CCOL = { int:'#009C9D', pub:'#009AD3', mod:'#E8308A', cav:'#F3A20B' };
  function docType(){ const r=document.querySelector('input[name="af-doctype"]:checked'); return r?r.value:'plan'; }
  function downloadDoc(html, fname){
    const blob=new Blob(['﻿', html], {type:'application/msword'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=fname; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),3000);
  }
  function wordHead(col, titulo){
    const letterhead = `<table style="border-collapse:collapse;margin:0 auto 4pt"><tr>
        <td style="vertical-align:middle;padding-right:10px"><div style="width:30px;height:30px;border-radius:50%;background:#f3a100;font-size:1px">&nbsp;</div></td>
        <td style="vertical-align:middle"><span style="font-size:24pt;font-weight:bold;color:#0072b9">idc</span><span style="font-size:13pt;font-weight:bold;color:#545452">&nbsp;diseño &amp; comunicación</span><br><span style="font-size:9pt;color:#888888">Instituto de Educación Superior Público</span></td></tr></table>`;
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${titulo}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
@page Section1 { size:21.0cm 29.7cm; margin:2.54cm; }
div.Section1 { page:Section1; }
body { font-family:'Times New Roman',serif; font-size:12.0pt; line-height:200%; color:#000; }
p { margin:0 0 6pt 0; text-align:justify; }
.center { text-align:center; }
.h1 { font-size:12pt; font-weight:bold; text-align:center; color:${col}; margin:12pt 0 6pt; }
.h2 { font-size:12pt; font-weight:bold; color:${col}; border-bottom:2px solid ${col}; padding-bottom:2pt; margin:14pt 0 4pt; }
.h3 { font-size:12pt; font-weight:bold; font-style:italic; color:${col}; margin:8pt 0 2pt; }
.bar { border-top:6px solid ${col}; margin-bottom:6pt; }
table.data { border-collapse:collapse; width:100%; font-size:10pt; line-height:120%; margin:4pt 0; }
table.data td,table.data th { border:1px solid #555; padding:3pt 5pt; vertical-align:top; }
table.data th { background:${col}; color:#fff; font-weight:bold; }
.note { border:1px solid #888; background:#f4f4f4; padding:6pt 8pt; font-size:10pt; line-height:130%; margin:6pt 0; }
.ph { color:#666; }
.brk { page-break-before:always; }
.sigline { border-top:1px solid #000; width:80%; margin:0 auto 2pt; }
.sm { font-size:10pt; }
</style></head><body><div class="Section1"><div class="bar"></div>`;
  }

  function genWordInforme(){
    const esp=$('af-f-esp').value, espN=ESPN[esp]||esp, col=CCOL[esp]||'#0072b9';
    const v=id=>esc(($(id)&&$(id).value||'').trim());
    const members=readMembers();
    const titulo=v('af-f-titulo')||'[Ingrese el título del trabajo. Máx. 25 palabras: tema, especificidad, lugar y temporalidad.]';
    const linea=v('af-f-linea'), innov=v('af-f-innov');
    const asesor=v('af-f-asesor')||'________________________', asesordni=v('af-f-asesordni')||'__________';
    const coord=v('af-f-coord')||COORD_MAP[esp]||'________________________', jefe=v('af-f-jefe')||'Mg. Mario Quiroz Martínez';
    const lugarfecha=v('af-f-fecha')||'Lima, Perú — 2026';
    const resumen=v('af-f-resumen'), dedica=v('af-f-dedica'), agrade=v('af-f-agrade');
    const conclu=v('af-f-conclu'), recom=v('af-f-recom'), refs=v('af-f-refs');
    const objg=v('af-f-objgen'), obje=v('af-f-objesp'), pgen=v('af-f-pgen'), desctec=v('af-f-desctec');
    const comp=v('af-f-comp'), ud=v('af-f-ud'), horas=v('af-f-horas'), cred=v('af-cred'), hcred=v('af-hcred');
    const autoresTabla = (members.length?members:[{nombre:'[Apellidos y nombres completos]',correo:'[correo@idc.edu.pe]'}])
      .map(m=>`<tr><td>${esc(m.nombre)||'[Apellidos y nombres]'}</td><td>${esc(m.correo)||'[correo@idc.edu.pe]'}</td></tr>`).join('');
    const list=(txt,fb)=>txt?txt.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>`<p style="margin:0 0 6pt 1.27cm;text-indent:-.6cm">${esc(x)}</p>`).join(''):`<p class="ph">${fb}</p>`;
    const ph=t=>`<p class="ph">${t}</p>`;

    const html = wordHead(col, 'INFORME PTIIT — '+titulo) + `
  <div class="center">
    ${''}
    <table style="border-collapse:collapse;margin:0 auto 4pt"><tr><td style="vertical-align:middle;padding-right:10px"><div style="width:30px;height:30px;border-radius:50%;background:#f3a100;font-size:1px">&nbsp;</div></td><td style="vertical-align:middle"><span style="font-size:24pt;font-weight:bold;color:#0072b9">idc</span><span style="font-size:13pt;font-weight:bold;color:#545452">&nbsp;diseño &amp; comunicación</span><br><span style="font-size:9pt;color:#888">Instituto de Educación Superior Público</span></td></tr></table>
    <p style="font-weight:bold;font-size:11pt;color:${col}">INSTITUTO DE EDUCACIÓN SUPERIOR PÚBLICO «DISEÑO Y COMUNICACIÓN»</p>
    <p style="font-size:9pt;margin:0">LICENCIADO POR MINEDU - RVM N° 164 - 2025</p>
    <p style="line-height:150%">&nbsp;</p>
    <p style="font-weight:bold;font-size:13pt">INFORME DEL PLAN DEL TRABAJO DE INVESTIGACIÓN E INNOVACIÓN TECNOLÓGICA (PTIIT)</p>
    <p style="line-height:150%">&nbsp;</p>
    <p style="font-weight:bold">${titulo}</p>
    <p style="line-height:150%">&nbsp;</p>
    <p>Programa de Estudios: ${esc(espN)}</p>
    <p>Línea de investigación: ${esc(linea)}</p>
    <p style="line-height:150%">&nbsp;</p>
    <p style="font-weight:bold">Presentado por:</p>
    <table class="data" style="width:90%;margin:4pt auto"><tr><th>Autor(es)</th><th>Correo electrónico institucional</th></tr>${autoresTabla}</table>
    <p>ASESOR: ${asesor}</p>
    <p style="line-height:150%">&nbsp;</p>
    <p>${esc(lugarfecha)}</p>
  </div>

  <div class="brk"></div>
  <p class="h1">DEDICATORIA</p>
  ${dedica?`<p>${esc(dedica)}</p>`:ph('[Espacio para la redacción libre de la dedicatoria del autor, dirigida a las personas que han sido fuente de motivación e inspiración durante su formación profesional.]')}

  <div class="brk"></div>
  <p class="h1">AGRADECIMIENTO</p>
  ${agrade?`<p>${esc(agrade)}</p>`:ph('[Agradecimientos a instituciones, docentes, talleres, proveedores o empresas del sector que contribuyeron al desarrollo de la experiencia profesional y del presente informe.]')}

  <div class="brk"></div>
  <p class="h1">ÍNDICE O CONTENIDO</p>
  <table class="data"><tr><th>Sección</th><th>Página</th></tr>
    <tr><td>Dedicatoria</td><td>ii</td></tr><tr><td>Agradecimiento</td><td>iii</td></tr><tr><td>Índice o Contenido</td><td>iv</td></tr><tr><td>Resumen Ejecutivo</td><td>v</td></tr>
    <tr><td>Introducción</td><td>1</td></tr><tr><td>Capítulo 1: Marco Teórico</td><td>3</td></tr><tr><td>Capítulo 2: Contexto Laboral</td><td>7</td></tr>
    <tr><td>Capítulo 3: Descripción de la Actividad Profesional Realizada</td><td>11</td></tr><tr><td>Capítulo 4: Evaluación de la Propuesta y Plan de Mejora</td><td>18</td></tr>
    <tr><td>Conclusiones</td><td>24</td></tr><tr><td>Recomendaciones</td><td>25</td></tr><tr><td>Referencias Bibliográficas</td><td>26</td></tr><tr><td>Anexos o Apéndices</td><td>28</td></tr></table>

  <div class="brk"></div>
  <p class="h1">RESUMEN EJECUTIVO</p>
  ${resumen?`<p>${esc(resumen)}</p>`:ph('[Síntesis breve (máx. 250 palabras) de la experiencia/proyecto, el concepto desarrollado, los objetivos logrados y los principales resultados creativos o comerciales obtenidos.]')}
  <p><b>Palabras clave:</b> ${esc(linea)}, ${esc(innov)}, innovación tecnológica, EFSRT.</p>

  <div class="brk"></div>
  <p class="h2">INTRODUCCIÓN</p>
  ${desctec?`<p>${esc(desctec)}</p>`:ph('[Contextualización de la experiencia/proyecto en el sector y el mercado, y cómo se describirá a lo largo del informe.]')}
  <div class="note"><b>Nota institucional.</b> El Informe PTIIT constituye el examen escrito (30%) y es la base para la sustentación frente al Jurado Calificador (Examen Oral, 70%). Puede presentarse de manera individual o en equipo de hasta cuatro (4) estudiantes de 1.° a 5.° semestre. Al final deben constar las firmas (con DNI) de todos los autores y del asesor/tutor responsable.</div>
  <div class="note" style="border-color:#a05a00;background:#fff8e1"><b>&#9878; Autoría exclusiva y derechos de autor.</b> Los firmantes son declarados <b>autores exclusivos y excluyentes</b> de la obra conforme al <b>D. Leg. N.° 822 — Ley sobre el Derecho de Autor del Perú</b> y el Convenio de Berna (Art. 2). El retiro de un integrante debe formalizarse con <b>Carta Poder notarial</b> que ceda los derechos patrimoniales a los estudiantes que continúan, presentada ante la Coordinación del Programa y la Jefatura de Investigación antes de la sustentación.</div>

  <p class="h2">CAPÍTULO 1: MARCO TEÓRICO</p>
  <p class="h3">1.1 Bases Teóricas</p>
  ${ph('[Fundamentos teóricos que sustentan el proyecto. Cite autores y fuentes actualizadas (máx. 5 años). Mínimo 3 bases teóricas argumentadas.]')}
  <p class="h3">1.2 Antecedentes del Estudio</p>
  ${ph('[Investigaciones o proyectos previos —nacionales e internacionales— relacionados con el tema. Mínimo 2 nacionales y 2 internacionales.]')}
  <p class="h3">1.3 Marco Conceptual</p>
  ${ph('[Defina los conceptos clave utilizados en el informe, con fuentes APA 7.ª ed.]')}

  <p class="h2">CAPÍTULO 2: CONTEXTO LABORAL</p>
  <p class="h3">2.1 Descripción de la Organización</p>
  <p>El proyecto se desarrolla en el marco del Instituto de Educación Superior Público «Diseño y Comunicación» (IDC), en la modalidad de EFSRT — proyecto productivo de bienes y servicios del programa de ${esc(espN)}.</p>
  <p class="h3">2.2 Organigrama</p>
  ${ph('[Inserte el organigrama del área/taller/Unidad de Investigación. Ver anexo.]')}
  <p class="h3">2.3 Manual de Funciones del Autor</p>
  <table class="data"><tr><th>Cargo / Rol</th><th>Descripción de funciones</th><th>Período</th></tr>
    <tr><td>Estudiante autor del proyecto</td><td>${desctec?esc(desctec):'[Funciones principales en la planificación, ejecución y entrega del proyecto.]'}</td><td>${esc(horas)} horas (EFSRT)</td></tr></table>

  <p class="h2">CAPÍTULO 3: DESCRIPCIÓN DE LA ACTIVIDAD PROFESIONAL REALIZADA</p>
  <p><b>Problema que atiende.</b> ${esc(pgen)||'[Problema o necesidad del contexto.]'}</p>
  <p><b>Objetivo general.</b> ${esc(objg)||'[Objetivo general.]'}</p>
  <p><b>Objetivos específicos.</b></p>
  ${list(obje,'[OE1, OE2, OE3…]')}
  <p><b>Descripción técnica.</b> ${esc(desctec)||'[Metodología/proceso, materiales y tecnologías, fases y entregable final.]'}</p>
  <p><b>Metodología ABPP (4 fases · 12 semanas):</b> (1) Briefing y diagnóstico; (2) Prototipado y validación con IA; (3) Ejecución y monitoreo; (4) Análisis y socialización.</p>

  <p class="h2">CAPÍTULO 4: EVALUACIÓN DE LA PROPUESTA Y PLAN DE MEJORA</p>
  <p>La propuesta se evalúa con la rúbrica institucional: Calidad creativa y técnica (40%), Desempeño financiero y estratégico (35%) y Proceso de trabajo e innovación (25%).</p>
  <p><b>Vinculación EFSRT.</b> Conforme al numeral 20.3.3.1, «el valor de un crédito en las EFSRT equivale a horas prácticas»: ${esc(cred)} créditos × ${esc(hcred)} h = ${esc(horas)} horas prácticas. Competencias vinculadas: ${esc(comp)||'[competencias del programa]'}${ud?(' · UD: '+esc(ud)):''}.</p>
  ${ph('[Plan de mejora: ajustes, lecciones aprendidas y próximos pasos.]')}

  <p class="h2">CONCLUSIONES</p>
  ${list(conclu,'[Conclusión 1, 2, 3… coherentes con los objetivos.]')}

  <p class="h2">RECOMENDACIONES</p>
  ${list(recom,'[Recomendación 1, 2, 3…]')}

  <p class="h2">REFERENCIAS BIBLIOGRÁFICAS</p>
  ${refs?refs.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>`<p style="margin:0 0 6pt 1.27cm;text-indent:-1.27cm">${esc(x)}</p>`).join(''):ph('[Referencias en formato APA 7.ª ed., orden alfabético, sangría francesa.]')}

  <p class="h2">ANEXOS O APÉNDICES</p>
  ${ph('[Evidencias: bocetos, planos, fotografías, fichas técnicas, organigrama, capturas, etc.]')}

  <table style="width:100%;margin-top:30pt"><tr>
    <td style="text-align:center;padding:30pt 8pt 0"><div class="sigline"></div>${(members[0]&&esc(members[0].nombre))||'[Autor]'}<br><span class="sm">DNI: ${(members[0]&&esc(members[0].dni))||'__________'}</span></td>
    <td style="text-align:center;padding:30pt 8pt 0"><div class="sigline"></div>${asesor}<br><span class="sm">Asesor(a) — DNI: ${asesordni}</span></td>
  </tr><tr>
    <td style="text-align:center;padding:34pt 8pt 0"><div class="sigline"></div>${coord}<br><span class="sm">Coordinación del Programa de Estudios — ${esc(espN)}</span></td>
    <td style="text-align:center;padding:34pt 8pt 0"><div class="sigline"></div>${jefe}<br><span class="sm">Jefatura de la Unidad de Investigación</span></td>
  </tr></table>

  <p style="margin-top:16pt;font-size:9pt;color:#666">Documento en formato APA 7.ª ed. (Times New Roman 12, interlineado doble, márgenes 2,54 cm). Membrete institucional referencial — reemplazable por el logotipo oficial del IDC.</p>
  </div></body></html>`;

    const safe=(titulo||'informe-ptiit').replace(/[^\wÀ-ſ ]+/g,'').slice(0,40).trim().replace(/\s+/g,'-')||'informe-ptiit';
    downloadDoc(html, 'INFORME-PTIIT-IDC-'+safe+'.doc');
    toast2('Documento Word (Informe PTIIT) generado ✓');
  }

  function genWord(){
    if(docType()==='informe') return genWordInforme();
    const esp=$('af-f-esp').value, espN=ESPN[esp]||esp;
    const col=CCOL[esp]||'#0072b9';
    const modal=isGrupal()?'Grupal (2–4 integrantes)':'Individual';
    /* Coordinadores por especialidad */
    const COORD_MAP = { int:'Dis. María Quintana Pérez Tudela', pub:'Dis. Javier Mendives Laura', mod:'Mg. Fany Picón Tejedo', cav:'Mg. Alejandro Seminario Campos' };
    /* Auto-completar coordinador si está vacío */
    const coordField=$('af-f-coord'); if(coordField&&!coordField.value.trim()) coordField.value=COORD_MAP[esp]||'';
    const members=readMembers();
    const v=id=>esc(($(id)&&$(id).value||'').trim());
    const titulo=v('af-f-titulo')||'[Título del trabajo]';
    const linea=v('af-f-linea'), innov=v('af-f-innov'), semestre=v('af-f-semestre');
    const pgen=v('af-f-pgen'), pe=v('af-f-pe');
    const objg=v('af-f-objgen'), obje=v('af-f-objesp');
    const jt=v('af-f-jtrasc'), jm=v('af-f-jmagn'), jv=v('af-f-jvuln'), jf=v('af-f-jfact');
    const ud=v('af-f-ud'), comp=v('af-f-comp');
    const cred=v('af-cred'), hcred=v('af-hcred');
    const desctec=v('af-f-desctec'), presup=v('af-f-presup'), horas=v('af-f-horas');
    const inicioV=$('af-f-inicio').value, terminoV=$('af-f-termino').value;
    const inicio=fdate(inicioV), termino=fdate(terminoV);
    const asesor=v('af-f-asesor')||'________________________';
    const asesordni=v('af-f-asesordni')||'__________';
    const coord=v('af-f-coord')||COORD_MAP[esp]||'________________________';
    const jefe=v('af-f-jefe')||'Mg. Mario Quiroz Martínez';
    const lugarfecha=v('af-f-fecha')||'Lima, Perú — 2026';
    const autores = members.length ? members.map(m=>esc(m.nombre)).filter(Boolean).join('; ') : '[Apellidos y nombres]';

    const listFrom = (txt, fb) => txt ? txt.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>`<p style="margin:0 0 6pt 1.27cm;text-indent:-.6cm">${esc(x)}</p>`).join('') : `<p>${fb}</p>`;

    const memberRows = members.map((m,i)=>`<tr>
      <td style="text-align:center">${i+1}</td><td>${esc(m.mat)||'—'}</td><td>${esc(m.nombre)||'—'}</td><td style="text-align:center">${esc(m.sem)}</td><td>${esc(m.dni)||'—'}</td><td>${esc(m.tel)||'—'}</td><td>${esc(m.correo)||'—'}</td></tr>`).join('');

    const sched = scheduleRows(inicioV, terminoV, +horas||200);
    const schedRows = sched ? sched.map((r,i)=>`<tr><td style="text-align:center">${i+1}</td><td><b>${r.fase}</b> · ${esc(r.t)}</td><td>${r.periodo}</td><td style="text-align:center">${r.semanas}</td><td style="text-align:center">${r.horas} h</td><td>${esc(r.out)}</td></tr>`).join('')
      : '<tr><td colspan="6">[Defina las fechas de inicio y término para generar el cronograma]</td></tr>';

    const sigMembers = (members.length?members:[{nombre:'[Autor]',dni:'__________'}]).map(m=>
      `<td style="text-align:center;padding:30pt 8pt 0"><div class="sigline"></div>${esc(m.nombre)||'[Autor]'}<br><span class="sm">DNI: ${esc(m.dni)||'__________'}</span></td>`).join('');

    // Membrete recreado (reemplazable por el logo oficial).
    const letterhead = `
      <table style="border-collapse:collapse;margin:0 auto 4pt"><tr>
        <td style="vertical-align:middle;padding-right:10px"><div style="width:30px;height:30px;border-radius:50%;background:#f3a100;font-size:1px">&nbsp;</div></td>
        <td style="vertical-align:middle">
          <span style="font-size:24pt;font-weight:bold;color:#0072b9">idc</span>
          <span style="font-size:13pt;font-weight:bold;color:#545452">&nbsp;diseño &amp; comunicación</span><br>
          <span style="font-size:9pt;color:#888888">Instituto de Educación Superior Público</span>
        </td></tr></table>`;

    const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">
<title>PTIIT — ${titulo}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
@page Section1 { size:21.0cm 29.7cm; margin:2.54cm 2.54cm 2.54cm 2.54cm; }
div.Section1 { page:Section1; }
body { font-family:'Times New Roman',serif; font-size:12.0pt; line-height:200%; color:#000; }
p { margin:0 0 6pt 0; text-align:justify; }
.center { text-align:center; }
.h2 { font-size:12pt; font-weight:bold; color:${col}; border-bottom:2px solid ${col}; padding-bottom:2pt; margin:14pt 0 4pt 0; }
.h3 { font-size:12pt; font-weight:bold; font-style:italic; color:${col}; margin:8pt 0 2pt 0; }
.bar { border-top:6px solid ${col}; margin-bottom:6pt; }
table.data { border-collapse:collapse; width:100%; font-size:10pt; line-height:120%; margin:4pt 0; }
table.data td,table.data th { border:1px solid #555; padding:3pt 5pt; vertical-align:top; }
table.data th { background:${col}; color:#fff; font-weight:bold; }
.note { border:1px solid #888; background:#f4f4f4; padding:6pt 8pt; font-size:10pt; line-height:130%; margin:6pt 0; }
.brk { page-break-before:always; }
.sigline { border-top:1px solid #000; width:80%; margin:0 auto 2pt; }
.sm { font-size:10pt; }
</style></head>
<body><div class="Section1">
  <div class="bar"></div>
  <div class="center">
    ${letterhead}
    <p style="font-weight:bold;font-size:11pt;margin-top:6pt;color:${col}">INSTITUTO DE EDUCACIÓN SUPERIOR PÚBLICO «DISEÑO Y COMUNICACIÓN»</p>
    <p style="font-size:9pt;margin:0">LICENCIADO POR MINEDU - RVM N° 164 - 2025</p>
    <p style="line-height:150%">&nbsp;</p><p style="line-height:150%">&nbsp;</p>
    <p style="font-weight:bold;font-size:13pt">PLAN DEL TRABAJO DE INVESTIGACIÓN E INNOVACIÓN TECNOLÓGICA (PTIIT)</p>
    <p style="line-height:150%">&nbsp;</p>
    <p style="font-weight:bold">${titulo}</p>
    <p style="line-height:150%">&nbsp;</p>
    <p>Programa de Estudios: ${esc(espN)}</p>
    <p>Línea de investigación: ${esc(linea)}</p>
    <p style="line-height:150%">&nbsp;</p>
    <p>Autor(es): ${autores}</p>
    <p>Modalidad: ${modal}</p>
    <p>Asesor(a): ${asesor}</p>
    <p style="line-height:150%">&nbsp;</p>
    <p>${esc(lugarfecha)}</p>
  </div>

  <div class="brk"></div>

  <div class="note"><b>Nota institucional.</b> El Plan del Trabajo de Investigación e Innovación Tecnológica (PTIIT) sistematiza y sustenta la experiencia o proyecto. Constituye el examen escrito (30%) y es base para la sustentación frente al Jurado Calificador (Examen Oral, 70%). Los trabajos pueden presentarse de manera individual o por un máximo de cuatro (4) estudiantes de 1.° a 5.° semestre. Al final deben constar las firmas (con DNI) de todos los autores y del asesor/tutor responsable.</div>
  <div class="note" style="border-color:#a05a00;background:#fff8e1"><b>&#9878; Autoría exclusiva y derechos de autor.</b> Los firmantes del presente PTIIT son declarados <b>autores exclusivos y excluyentes</b> de la obra, conforme al <b>Decreto Legislativo N.° 822 — Ley sobre el Derecho de Autor del Perú</b> y el Convenio de Berna (Art. 2). La firma constituye prueba de autoría y cesión de derechos de uso institucional al IDC para fines educativos. <b>Retiro de integrantes:</b> el retiro voluntario o involuntario de un miembro del equipo debe formalizarse con una <b>Carta Poder notarial</b> en la que el estudiante que se retira cede sus derechos patrimoniales sobre el proyecto a los integrantes que continúan. Sin dicho documento el equipo restante no podrá sustentar ni publicar la obra. La Carta Poder debe presentarse ante la Coordinación del Programa de Estudios y la Jefatura de la Unidad de Investigación antes de la sustentación.</div>

  <p class="h2">1. Título del trabajo</p>
  <p>${esc(titulo)}</p>
  <p class="sm"><i>(Máximo 25 palabras: tema, especificidad, lugar y temporalidad.)</i></p>

  <p class="h2">2. Programa de estudios</p>
  <table class="data"><tr><th>Carrera / Programa de estudios</th><th>Semestre / Año</th></tr>
    <tr><td>${esc(espN)}</td><td>${esc(semestre)||'—'}</td></tr></table>
  <p>Línea de investigación: ${esc(linea)} · Tipo de innovación: ${esc(innov)}</p>

  <p class="h2">3. Integrantes</p>
  <table class="data"><tr><th>N°</th><th>N° matrícula</th><th>Apellidos y nombres</th><th>Sem.</th><th>DNI</th><th>Teléfono</th><th>Correo electrónico</th></tr>
  ${memberRows||'<tr><td colspan="7">[Registre los integrantes]</td></tr>'}</table>
  <p>Asesor / Tutor responsable: ${asesor} — DNI: ${asesordni}</p>

  <p class="h2">4. Formulación del problema</p>
  <p class="h3">4.1 Problema general</p>
  <p>${esc(pgen)||'[Pregunta central del proyecto.]'}</p>
  <p class="h3">4.2 Problemas específicos</p>
  ${listFrom(pe,'[PE1, PE2, PE3…]')}

  <p class="h2">5. Objetivos</p>
  <p class="h3">5.1 Objetivo general</p>
  <p>${esc(objg)||'[Objetivo general con verbo en infinitivo.]'}</p>
  <p class="h3">5.2 Objetivos específicos</p>
  ${listFrom(obje,'[OE1, OE2, OE3…]')}

  <p class="h2">6. Justificación</p>
  <p><b>Trascendencia.</b> ${esc(jt)||'—'}</p>
  <p><b>Magnitud.</b> ${esc(jm)||'—'}</p>
  <p><b>Vulnerabilidad.</b> ${esc(jv)||'—'}</p>
  <p><b>Factibilidad.</b> ${esc(jf)||'—'}</p>

  <p class="h2">7. Descripción técnica</p>
  <p>${esc(desctec)||'[Metodología/proceso, materiales y tecnologías, fases y entregable final. Máx. 300 palabras.]'}</p>
  <p class="sm"><b>Metodología ABPP (4 fases · 12 semanas):</b> (1) Briefing y diagnóstico estratégico; (2) Prototipado rápido y validación con IA; (3) Ejecución y monitoreo en tiempo real; (4) Análisis de resultados y socialización.</p>

  <p class="h2">8. Cronograma de actividades</p>
  <p>Inicio: ${inicio} · Término: ${termino} · Dedicación: ${esc(horas)} horas (extracurricular).</p>
  <table class="data"><tr><th>N°</th><th>Actividad / Fase</th><th>Periodo</th><th>Semanas</th><th>Horas</th><th>Entregable</th></tr>
  ${schedRows}</table>

  <p class="h2">9. Base normativa y sistema de horas (EFSRT)</p>
  <p class="h3">9.1 Definición</p>
  <p>El numeral <b>20.3.3</b> define las <b>Experiencias Formativas en Situaciones Reales de Trabajo (EFSRT)</b> como actividades en situaciones reales de trabajo orientadas a <b>consolidar, integrar o ampliar</b> conocimientos, habilidades y actitudes, con el objetivo de <b>mejorar la empleabilidad</b> del estudiante.</p>
  <p class="h3">9.2 Modalidad</p>
  <p>El subnumeral <b>20.3.3.1 «En el IES»</b> establece que las EFSRT pueden desarrollarse mediante <b>proyectos productivos de bienes y servicios</b>, actividades conexas a los procesos institucionales, proyección social, emprendimiento e iniciativas de negocio. El presente <b>proyecto de innovación tecnológica</b> se enmarca como <b>proyecto productivo de bienes y servicios</b>.</p>
  <p class="h3">9.3 Cumplimiento de requisitos</p>
  <table class="data"><tr><th>Requisito (20.3.3.1)</th><th>Cómo lo cumple el proyecto</th></tr>
    <tr><td>Relación directa con las competencias del programa de estudios</td><td>${esc(comp)||'[competencia(s) declarada(s)]'}${ud?(' · UD: '+esc(ud)):''}</td></tr>
    <tr><td>Responde a una necesidad/problemática de un contexto específico</td><td>${esc(pgen)||'[problema general declarado]'}</td></tr>
    <tr><td>Fases de planificación, ejecución y entrega, con seguimiento y evaluación mediante criterios e instrumentos</td><td>Metodología ABPP (4 fases: briefing, prototipado, ejecución y socialización), cronograma con hitos, y evaluación por rúbrica institucional (Calidad creativa 40% · Desempeño financiero 35% · Proceso e innovación 25%)</td></tr></table>
  <p class="h3">9.4 Equivalencia crédito–horas prácticas</p>
  <p>El 20.3.3.1 precisa que <b>«el valor de un crédito en las EFSRT equivale a horas prácticas»</b>. Por ello, la dedicación del proyecto se traduce en horas prácticas profesionales:</p>
  <table class="data"><tr><th>Concepto</th><th>Valor</th></tr>
    <tr><td>Créditos EFSRT del proyecto</td><td>${esc(cred)}</td></tr>
    <tr><td>Horas prácticas por crédito (20.3.3.1)</td><td>${esc(hcred)}</td></tr>
    <tr><td>Total de horas prácticas (créditos × horas/crédito)</td><td><b>${esc(horas)} horas</b></td></tr>
    <tr><td>Modalidad EFSRT</td><td>Proyecto productivo de bienes y servicios</td></tr>
    <tr><td>Carácter</td><td>Extracurricular · autofinanciado · 1.° a 5.° semestre</td></tr></table>
  <p class="h3">9.5 Conclusión</p>
  <p>Al estar <b>vinculado a las competencias del programa de estudios de ${esc(espN)}</b>, atender una <b>problemática real</b> y contar con <b>planificación, ejecución, entrega, seguimiento y evaluación</b>, el proyecto constituye una <b>EFSRT</b>; por tanto, sus <b>${esc(horas)} horas</b> se contabilizan como <b>horas prácticas profesionales</b> del componente de experiencias formativas, conforme a los numerales 20.3.3 y 20.3.3.1.</p>

  <p class="h2">10. Presupuesto y modalidad de financiamiento</p>
  <p>Presupuesto estimado: <b>S/ ${esc(presup)}</b>. Modalidad: <b>autofinanciado por el/los estudiante(s)</b>. Categoría: extracurricular equivalente a ${esc(horas)} horas de práctica profesional (EFSRT). Ventana de presentación: del 1.° al 5.° semestre.</p>

  <p class="h2">11. Aprobación</p>
  <p>El presente Plan se somete a revisión y aprobación de la Coordinación del Programa de Estudios de ${esc(espN)} y de la Jefatura de la Unidad de Investigación del IES «Diseño y Comunicación».</p>

  <table style="width:100%;margin-top:34pt"><tr>${sigMembers}
    <td style="text-align:center;padding:30pt 8pt 0"><div class="sigline"></div>${asesor}<br><span class="sm">Asesor(a) — DNI: ${asesordni}</span></td>
  </tr><tr>
    <td style="text-align:center;padding:34pt 8pt 0" colspan="${Math.max(1,members.length)}"><div class="sigline"></div>${coord}<br><span class="sm">Coordinación del Programa de Estudios — ${esc(espN)}</span></td>
    <td style="text-align:center;padding:34pt 8pt 0"><div class="sigline"></div>${jefe}<br><span class="sm">Jefatura de la Unidad de Investigación</span></td>
  </tr></table>

  <p style="margin-top:18pt;font-size:9pt;color:#666">Documento en formato APA 7.ª ed. (Times New Roman 12, interlineado doble, márgenes 2,54 cm). Membrete institucional referencial — reemplazable por el logotipo oficial del IDC.</p>

</div></body></html>`;

    const blob = new Blob(['﻿', doc], { type:'application/msword' });
    const a=document.createElement('a');
    const safe=(titulo||'ptiit').replace(/[^\wÀ-ſ ]+/g,'').slice(0,40).trim().replace(/\s+/g,'-')||'ptiit';
    a.href=URL.createObjectURL(blob); a.download='PTIIT-IDC-'+safe+'.doc'; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),3000);
    toast2('Documento Word (PTIIT) generado ✓');
  }

  /* ===== INIT ===== */
  function init(){
    if(!$('autofin-section')) return;
    const lg=$('af-logo'); if(lg) lg.innerHTML=idcLogo();
    renderPhases();
    buildSpecialties();
    buildScreensNav();
    try{ const sp=localStorage.getItem('bcrpProxy'); if(sp)$('af-proxyUrl').value=sp; }catch(e){}
    conv('sol');
    fetchBCRP();
    const iso=d=>d.toISOString().slice(0,10), t=new Date();
    if($('af-start')&&!$('af-start').value) $('af-start').value=iso(t);
    if($('af-end')&&!$('af-end').value) $('af-end').value=iso(new Date(t.getTime()+84*864e5));
    if($('af-cred')) efsrt(); else schedule();
    // Formulario de inscripción
    if($('af-members')){ fillLineOptions(); setModalidad();
      if($('af-f-inicio')&&!$('af-f-inicio').value) $('af-f-inicio').value=iso(t);
      if($('af-f-termino')&&!$('af-f-termino').value) $('af-f-termino').value=iso(new Date(t.getTime()+84*864e5));
      restoreDraft();
      initMatrix(); }
    showScreen('generales');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

  /* ===== HELPERS DE CAMPO ===== */
  function wgenHelp(btn,msg){
    let tip=btn._tip;
    if(!tip){
      tip=document.createElement('div'); tip.className='wgen-help-tip'; tip.textContent=msg;
      btn.style.position='relative'; btn.appendChild(tip); btn._tip=tip;
      document.addEventListener('click',function h(e){ if(!btn.contains(e.target)){ tip.classList.remove('show'); document.removeEventListener('click',h); } });
    }
    tip.classList.toggle('show');
  }
  window.wgenHelp = wgenHelp;

  /* ===== DEMO / CLEAR ===== */
  const DEMO_DATA = {
    int:{ a1:'Vargas Torres, Lucía Fernanda',d1:'75312890',a2:'Mendoza Ríos, Carlos Andrés',d2:'74890123',
          asesor:'Dis. María Quintana Pérez Tudela',
          tit:'Diseño de interiores sostenible para coworkings emergentes en Miraflores usando materiales reciclados',
          objg:'Diseñar tres propuestas de espacio de coworking con criterios de sostenibilidad y bienestar que reduzcan el consumo energético en un 30% respecto al diseño convencional',
          obje:'Diagnosticar los estándares de diseño bioclimático aplicables a espacios de trabajo colaborativo en Lima mediante revisión bibliográfica y visitas de campo',
          desc:'El proyecto propone el diseño de tres propuestas de interiores para coworkings emergentes en el distrito de Miraflores, incorporando principios de sostenibilidad, iluminación natural, materiales reciclados y gestión del ruido. La metodología ABPP guiará las cuatro fases: diagnóstico de usuarios (briefing), elaboración de planimetría y renders 3D (prototipado), validación con potenciales arrendatarios (ejecución) y presentación final ante inversionistas (socialización). El impacto esperado es reducir en 30% el consumo energético y aumentar el índice de bienestar percibido por los usuarios.',
          refs:'Neufert, E. (2013). Arte de proyectar en arquitectura (16.ª ed.). Gustavo Gili.\nDickson, T. (2018). Sustainable interior design. Laurence King.\nFernández, M. (2022). Biofilia y diseño de interiores en contexto urbano. Revista Diseño y Arquitectura, 8(1), 44–61. https://doi.org/10.xxxx\nGibson, C. (2021). Wellbeing at work: Interior design strategies. Routledge.\nONU Medio Ambiente (2020). Edificaciones y construcción: Hoja de ruta hacia edificios de carbono cero para 2050. UNEP. https://www.unep.org',
          ia:'Se utilizó AutoCAD para el modelado de planos y SketchUp con IA asistida para renders preliminares. Claude (Anthropic) fue empleado para revisar la coherencia del marco teórico y sugerir bibliografía. Todos los diseños, decisiones conceptuales y renders definitivos son de autoría propia.' },
    pub:{ a1:'Salinas Pacheco, Rodrigo Alonso',d1:'73456789',a2:'Torres Vega, Valeria Cristina',d2:'72345678',
          asesor:'Dis. Javier Mendives Laura',
          tit:'Estrategia de marketing digital con IA para emprendimientos de streetwear en Lima usando creación de contenido generativo',
          objg:'Desarrollar una estrategia de marketing digital con IA generativa para tres marcas de streetwear de Lima que eleve el CTR en un 3% y reduzca el CAC en un 20% en 12 semanas',
          obje:'Analizar el comportamiento del público objetivo (18–28 años) en redes sociales mediante herramientas de social listening y benchmarking competitivo',
          desc:'El proyecto diseña una estrategia de marketing digital para emprendimientos de streetwear peruano, integrando herramientas de IA para la generación de contenido visual y copy publicitario. Se utilizará metodología ABPP: diagnóstico de audiencias (briefing), prototipado de creatividades con Midjourney y Claude, lanzamiento de campañas A/B en Instagram y TikTok (ejecución) y análisis de métricas ROAS, CAC y CTR (socialización). El objetivo es demostrar que la IA puede democratizar el acceso a producción publicitaria de calidad para marcas emergentes con presupuesto limitado.',
          refs:'Kotler, P. y Keller, K. L. (2022). Marketing management (16.ª ed.). Pearson.\nRyan, D. (2021). Understanding digital marketing (5.ª ed.). Kogan Page.\nChaffey, D. y Ellis-Chadwick, F. (2022). Digital marketing: Strategy, implementation and practice (8.ª ed.). Pearson.\nGarcía, R. (2023). IA generativa y publicidad: impacto en creatividad y eficiencia. Revista Comunicación y Marketing, 5(2), 18–34.\nIAB Perú (2024). Reporte de marketing digital Perú 2024. IAB. https://iabperu.com',
          ia:'Se utilizó Midjourney v6 para generar referencias visuales de creatividades publicitarias y Claude para redacción de copy y análisis de audiencias. Meta Ads Manager con funciones de IA para optimización de campañas. Los autores revisaron y aprobaron todos los contenidos antes de su publicación.' },
    mod:{ a1:'Quispe Ramos, Adriana Belén',d1:'71234567',a2:'Huanca León, Fiorella Milagros',d2:'70123456',
          asesor:'Mg. Fany Picón Tejedo',
          tit:'Colección de moda circular para el mercado millennial de Lima integrando fibras recicladas y patronaje modular',
          objg:'Crear una colección de 8 prendas de moda circular usando fibras recicladas y patronaje modular que reduzca el desperdicio textil en un 40% respecto a la confección convencional',
          obje:'Identificar proveedores de fibras recicladas certificadas en Lima y evaluar sus propiedades técnicas (resistencia, caída, drapeado) para su uso en prendas casualwear',
          desc:'El proyecto desarrolla una colección de moda circular de 8 prendas casualwear dirigida al segmento millennial de Lima (25–35 años), usando fibras recicladas PET y algodón orgánico con técnicas de patronaje modular que minimizan el desperdicio de tela. La metodología ABPP estructura las fases: diagnóstico de tendencias y proveedores (briefing), diseño y prototipado de patrones (prototipado), confección y prueba de usuario (ejecución), y presentación de lookbook y análisis de viabilidad comercial (socialización). El impacto medido incluye reducción del desperdicio textil y margen bruto objetivo del 35%.',
          refs:'Fletcher, K. (2014). Sustainable fashion and textiles: Design journeys (2.ª ed.). Routledge.\nMcQuillan, H. y Rissanen, T. (2016). Zero waste fashion design. Fairchild Books.\nFundación Ellen MacArthur (2017). Un nuevo modelo textil. EMF. https://ellenmacarthurfoundation.org\nLópez, C. (2022). Economía circular en la industria textil peruana. Revista Moda y Sostenibilidad, 3(1), 7–22.\nGlobal Fashion Agenda (2023). Pulse of the fashion industry 2023. GFA. https://globalfashionagenda.org',
          ia:'Se utilizó CLO 3D para visualización de patronaje y simulación de caída de tela. Claude asistió en la redacción del marco teórico sobre economía circular. Pinterest Lens para análisis de tendencias visuales. Todos los diseños, patrones y decisiones de colección son de autoría propia.' },
    cav:{ a1:'Flores Castro, Diego Sebastián',d1:'69876543',a2:'Paredes Neyra, Camila Rosa',d2:'68765432',
          asesor:'Mg. Alejandro Seminario Campos',
          tit:'Producción de contenido audiovisual educativo sobre historia del diseño peruano para plataformas digitales usando motion graphics e IA',
          objg:'Producir una serie de 5 piezas audiovisuales educativas sobre historia del diseño gráfico peruano que alcancen 5,000 vistas orgánicas y una tasa de retención del 60% en YouTube en 12 semanas',
          obje:'Investigar y seleccionar los 5 hitos más influyentes del diseño gráfico peruano del siglo XX mediante revisión documental y entrevistas a diseñadores referentes',
          desc:'El proyecto produce una serie de 5 videos educativos de corta duración (3–5 min) sobre hitos del diseño gráfico peruano, destinados a YouTube e Instagram Reels. Cada pieza combina motion graphics, locución profesional y fotografía de archivo digitalizada. La metodología ABPP articula: investigación y guionización (briefing), animatic y storyboard (prototipado), producción, edición y postproducción con IA (ejecución), y lanzamiento, análisis de métricas y socialización académica (socialización). El impacto esperado incluye 5,000 vistas orgánicas, CPV < S/ 0.05 y tasa de engagement > 5%.',
          refs:'Barnwell, J. (2017). Fundamentos de la realización cinematográfica. Blume.\nKrasner, J. (2013). Motion graphic design: Applied history and aesthetics (3.ª ed.). Focal Press.\nMostafa, H. (2022). AI-assisted video production: Opportunities and ethical challenges. Journal of Media Technology, 9(3), 112–130.\nIPD (2020). Historia del diseño gráfico peruano. Instituto de Diseño Peruano.\nYouTube Creator Academy (2023). Guía de retención de audiencia. Google. https://creatoracademy.youtube.com',
          ia:'Se utilizó Runway ML para interpolación de movimiento en motion graphics y ElevenLabs para síntesis de locución de respaldo. Adobe Premiere con funciones de IA para edición automática de cortes. Claude asistió en la redacción de guiones. Los autores aprobaron y editaron todos los contenidos finales.' }
  };
  function demoPane(id){
    const d=DEMO_DATA[id]; if(!d) return;
    const s=n=>{ const el=document.getElementById('af-wd-'+id+'-'+n); if(el) el.value=d[n]||''; };
    ['a1','d1','a2','d2','a3','d3','a4','d4','asesor','tit','objg','obje','desc','refs','ia','hrs','lugar'].forEach(s);
    const el=document.getElementById('af-wd-'+id+'-hrs'); if(el&&!d.hrs) el.value='200';
    const lug=document.getElementById('af-wd-'+id+'-lugar'); if(lug&&!d.lugar) lug.value='Instituto IDC — Lima, Perú';
    const ini=document.getElementById('af-wd-'+id+'-ini'); if(ini&&!ini.value){ const t=new Date(); ini.value=t.toISOString().slice(0,10); }
    const fin=document.getElementById('af-wd-'+id+'-fin'); if(fin&&!fin.value){ const t=new Date(Date.now()+84*864e5); fin.value=t.toISOString().slice(0,10); }
    // mark plan selected visually
    const planCard=document.getElementById('wdc-plan-'+id), infCard=document.getElementById('wdc-inf-'+id);
    if(planCard){ planCard.classList.add('selected'); planCard.querySelector('input').checked=true; }
    if(infCard) infCard.classList.remove('selected');
    // scroll to first field
    const el2=document.getElementById('af-wd-'+id+'-a1'); if(el2) el2.scrollIntoView({behavior:'smooth',block:'center'});
    toast2('Datos de demo cargados — revisa y personaliza ✓');
  }
  function clearPane(id){
    ['a1','d1','a2','d2','a3','d3','a4','d4','asesor','tit','objg','obje','desc','refs','ia'].forEach(n=>{
      const el=document.getElementById('af-wd-'+id+'-'+n); if(el) el.value='';
    });
    const hrs=document.getElementById('af-wd-'+id+'-hrs'); if(hrs) hrs.value='200';
    const lug=document.getElementById('af-wd-'+id+'-lugar'); if(lug) lug.value='';
    toast2('Campos limpiados ✓');
  }

  /* ===== GENERADOR WORD POR ESPECIALIDAD ===== */
  const COORD_MAP_W = { int:'Dis. María Quintana Pérez Tudela', pub:'Dis. Javier Mendives Laura', mod:'Mg. Fany Picón Tejedo', cav:'Mg. Alejandro Seminario Campos' };
  function genWordPane(id){
    const c=CAREERS.find(x=>x.id===id);
    if(!c){ alert('Especialidad no encontrada.'); return; }
    const g=n=>{ const el=document.getElementById('af-wd-'+id+'-'+n); return el?(el.value||'').trim():''; };
    const a1=g('a1'),d1=g('d1');
    if(!a1||!d1){ alert('Completa al menos el Autor 1 y su DNI.'); return; }
    const tit=g('tit')||'[Sin título]', objg=g('objg')||'[Sin objetivo general]';
    const autores=[[g('a1'),g('d1')],[g('a2'),g('d2')],[g('a3'),g('d3')],[g('a4'),g('d4')]].filter(([a])=>a);
    const tipo=document.querySelector(`input[name="af-wdt-${id}"]:checked`);
    const isPlan=!tipo||tipo.value==='plan';
    const coord=COORD_MAP_W[id]||'[Coordinador]';
    const r=compute().find(x=>x.id===id)||{alloc:0,req:0};
    const ini=g('ini')||'[Fecha inicio]', fin=g('fin')||'[Fecha fin]';
    const hrs=g('hrs')||'200', lugar=g('lugar')||'Lima, Perú';
    const desc=g('desc')||'[Descripción del proyecto]', asesor=g('asesor')||'[Asesor]';
    const obje=g('obje')||'[Objetivo específico 1]';
    const refsRaw=g('refs'), iaDecl=g('ia');
    const refsList=refsRaw
      ? refsRaw.split('\n').filter(l=>l.trim()).map((l,i)=>`<p style="padding-left:2em;text-indent:-2em;margin:.35em 0">${i+1}. ${l.trim()}</p>`).join('')
      : '<p style="color:#888">[Agregar referencias en formato APA 7.ª edición — mínimo 5]</p>';
    const autoList=autores.map((a,i)=>`<tr><td style="padding:4px 8px;border:1px solid #ccc">${i+1}</td><td style="padding:4px 8px;border:1px solid #ccc">${a[0]}</td><td style="padding:4px 8px;border:1px solid #ccc">${a[1]}</td></tr>`).join('');
    const sigLines=autores.map(a=>`<td style="text-align:center;padding:32pt 8pt 0;width:${Math.round(80/autores.length)}%"><div style="border-top:1px solid #444;width:90%;margin:0 auto"></div><span style="font-size:10pt">${a[0]}<br>DNI: ${a[1]}</span></td>`).join('');
    const iaNota=iaDecl
      ? `<div style="background:#eaf4fb;border-left:4px solid #0072b9;padding:10px 16px;margin:14px 0;font-size:11pt"><b>🤖 Declaración de uso de Inteligencia Artificial</b><br>${iaDecl}<br><br><i>Los autores declaran que el uso de herramientas de IA fue supervisado, verificado y validado en su totalidad. La responsabilidad intelectual del contenido recae íntegramente en los autores firmantes, conforme al Reglamento de Uso Responsable de IA del IDC 2026.</i></div>`
      : `<div style="background:#eaf4fb;border-left:4px solid #0072b9;padding:10px 16px;margin:14px 0;font-size:11pt"><b>🤖 Declaración de uso de Inteligencia Artificial</b><br>[Indicar si se utilizaron herramientas de IA (ChatGPT, Claude, Midjourney, etc.), con qué propósito y cómo se verificó el resultado. Si no se usaron, declararlo expresamente.]<br><br><i>Los autores declaran que el uso de herramientas de IA fue supervisado, verificado y validado en su totalidad. La responsabilidad intelectual del contenido recae íntegramente en los autores firmantes, conforme al Reglamento de Uso Responsable de IA del IDC 2026.</i></div>`;
    const copyNote=`<div style="background:#fffbe6;border:2px solid #f3a100;border-radius:6px;padding:14px 18px;margin:18px 0;font-size:11pt;page-break-inside:avoid">
<b>📜 Declaración de autoría y derechos de propiedad intelectual</b><br>
<b>Base legal:</b> D. Leg. N.° 822 (Ley sobre el Derecho de Autor, Perú) · Convenio de Berna para la Protección de las Obras Literarias y Artísticas, Art. 2<br><br>
Los firmantes del presente proyecto son <b>autores originales, exclusivos y excluyentes</b> del trabajo de investigación e innovación tecnológica aquí descrito. En virtud del artículo 3 del D. Leg. N.° 822, la protección de los derechos de autor nace con la creación de la obra, sin que se requiera registro previo.<br><br>
Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otro acto de explotación total o parcial de este trabajo sin la autorización escrita de <b>todos</b> los autores.<br><br>
<b>⚠️ Retiro de integrante del equipo:</b> Si uno o más miembros del equipo deciden abandonar el proyecto en cualquier etapa, deberán suscribir ante Notario Público una <b>Carta Poder</b> que ceda expresamente sus <b>derechos patrimoniales</b> (reproducción, distribución, comunicación pública y transformación) a los estudiantes que continúen el proyecto. Sin dicha Carta Poder debidamente legalizada, el proyecto <u>no podrá ser inscrito, evaluado ni sustentado</u> ante el IDC. Los derechos morales (paternidad e integridad) permanecen inalienables conforme al Art. 21 del D. Leg. N.° 822.
<br><br>
<table style="border-collapse:collapse;width:100%;margin-top:8pt"><thead><tr style="background:#f3a100;color:#fff"><th style="padding:5px 8px;border:1px solid #e09200">Autor</th><th style="padding:5px 8px;border:1px solid #e09200">DNI</th><th style="padding:5px 8px;border:1px solid #e09200">Firma y fecha</th></tr></thead><tbody>
${autores.map(a=>`<tr><td style="padding:5px 8px;border:1px solid #ccc">${a[0]}</td><td style="padding:5px 8px;border:1px solid #ccc">${a[1]}</td><td style="padding:5px 8px;border:1px solid #ccc;height:32pt"></td></tr>`).join('')}
</tbody></table>
</div>`;

    let body='';
    if(isPlan){
      body=`<h1 style="color:${c.color};font-size:16pt;margin-bottom:4pt">Plan del Trabajo de Investigación e Innovación Tecnológica (PTIIT)</h1>
<h2 style="font-size:13pt;color:#333;margin:0 0 16pt">${tit}</h2>
<p><b>Especialidad:</b> ${c.name} &nbsp;|&nbsp; <b>Coordinador(a):</b> ${coord} &nbsp;|&nbsp; <b>Asesor(a):</b> ${asesor}</p>
<p><b>Jefatura:</b> Mg. Mario Quiroz Martínez &nbsp;|&nbsp; <b>Institución:</b> Instituto de Educación Superior Público Diseño &amp; Comunicación (IDC) &nbsp;|&nbsp; <b>Convocatoria:</b> 2026</p>
${copyNote}
<h3 style="color:${c.color}">1. Datos del equipo de investigación</h3>
<p>Máx. cuatro (4) estudiantes de 1.° a 5.° semestre</p>
<table style="border-collapse:collapse;width:100%;font-size:11pt"><thead><tr style="background:${c.color};color:#fff"><th style="padding:5px 8px;border:1px solid #ccc">#</th><th style="padding:5px 8px;border:1px solid #ccc">Apellidos y nombres</th><th style="padding:5px 8px;border:1px solid #ccc">DNI</th></tr></thead><tbody>${autoList}</tbody></table>
<h3 style="color:${c.color}">2. Título del proyecto</h3><p>${tit}</p>
<h3 style="color:${c.color}">3. Línea(s) de investigación</h3>
<p>Especialidad: ${(ST[id].lines||[]).filter(l=>!TLINES.includes(l)).join('; ')||'[No seleccionadas]'}</p>
<p>Transversales: ${(ST[id].lines||[]).filter(l=>TLINES.includes(l)).join('; ')||'Ninguna'}</p>
<h3 style="color:${c.color}">4. Descripción / resumen</h3><p>${desc}</p>
<h3 style="color:${c.color}">5. Objetivo general</h3><p>${objg}</p>
<h3 style="color:${c.color}">6. Objetivos específicos</h3><p>6.1. ${obje}</p>
<h3 style="color:${c.color}">7. Justificación</h3><p>[Redactar justificación del proyecto]</p>
<h3 style="color:${c.color}">8. Marco teórico / referencial</h3><p>[Desarrollar fundamentos teóricos — APA 7.ª edición]</p>
<h3 style="color:${c.color}">9. Metodología ABPP (12 semanas)</h3>
<table style="border-collapse:collapse;width:100%;font-size:11pt"><thead><tr style="background:${c.color};color:#fff"><th style="padding:5px 8px;border:1px solid #ccc">Fase</th><th style="padding:5px 8px;border:1px solid #ccc">Semanas</th><th style="padding:5px 8px;border:1px solid #ccc">Actividades principales</th></tr></thead><tbody>
<tr><td style="padding:4px 8px;border:1px solid #ccc">01 — Briefing y Diagnóstico</td><td style="padding:4px 8px;border:1px solid #ccc">1–2</td><td style="padding:4px 8px;border:1px solid #ccc">Análisis de contexto, benchmark, diagnóstico FODA</td></tr>
<tr><td style="padding:4px 8px;border:1px solid #ccc">02 — Prototipado y Validación</td><td style="padding:4px 8px;border:1px solid #ccc">3–5</td><td style="padding:4px 8px;border:1px solid #ccc">Diseño conceptual, prototipo, pruebas de usuario</td></tr>
<tr><td style="padding:4px 8px;border:1px solid #ccc">03 — Ejecución y Monitoreo</td><td style="padding:4px 8px;border:1px solid #ccc">6–10</td><td style="padding:4px 8px;border:1px solid #ccc">Desarrollo, implementación, KPIs, ajustes</td></tr>
<tr><td style="padding:4px 8px;border:1px solid #ccc">04 — Análisis y Socialización</td><td style="padding:4px 8px;border:1px solid #ccc">11–12</td><td style="padding:4px 8px;border:1px solid #ccc">Análisis de resultados, informe final, exposición</td></tr>
</tbody></table>
<h3 style="color:${c.color}">10. Presupuesto estimado (EFSRT — numeral 20.3.3.1)</h3>
<p>Horas EFSRT: <b>${hrs} h</b> &nbsp;|&nbsp; Lugar: <b>${lugar}</b> &nbsp;|&nbsp; Inicio: <b>${ini}</b> &nbsp;|&nbsp; Fin: <b>${fin}</b></p>
<p>Fondo asignado: <b>S/ ${fmt(r.alloc)}</b> &nbsp;|&nbsp; Monto solicitado: <b>S/ ${fmt(r.req)}</b></p>
<p>Materiales — ${c.reqs||'según especialidad'}: [desglosar ítems y costos unitarios]</p>
${iaNota}
<h3 style="color:${c.color}">11. Referencias bibliográficas (APA 7.ª edición)</h3>
${refsList}
<br>
<table style="width:100%;margin-top:36pt"><tr>${sigLines}
  <td style="text-align:center;padding:32pt 8pt 0;width:20%"><div style="border-top:1px solid #444;width:90%;margin:0 auto"></div><span style="font-size:10pt">${asesor}<br>Asesor(a)</span></td>
</tr><tr>
  <td colspan="${autores.length}" style="text-align:center;padding:32pt 8pt 0"><div style="border-top:1px solid #444;width:60%;margin:0 auto"></div><span style="font-size:10pt">${coord}<br>Coordinación — ${c.name}</span></td>
  <td style="text-align:center;padding:32pt 8pt 0"><div style="border-top:1px solid #444;width:90%;margin:0 auto"></div><span style="font-size:10pt">Mg. Mario Quiroz Martínez<br>Jefatura Unidad de Investigación</span></td>
</tr></table>
<p style="margin-top:18pt;font-size:9pt;color:#888;text-align:center">Documento IDC 2026 · Formato APA 7.ª ed. · Times New Roman 12pt · interlineado doble · márgenes 2,54 cm</p>`;
    } else {
      body=`<h1 style="color:${c.color};font-size:16pt;margin-bottom:4pt">Informe PTIIT — Trabajo de Investigación e Innovación Tecnológica</h1>
<h2 style="font-size:13pt;color:#333;margin:0 0 16pt">${tit}</h2>
<p><b>Especialidad:</b> ${c.name} &nbsp;|&nbsp; <b>Coordinador(a):</b> ${coord} &nbsp;|&nbsp; <b>Asesor(a):</b> ${asesor}</p>
<p><b>Jefatura:</b> Mg. Mario Quiroz Martínez &nbsp;|&nbsp; <b>Institución:</b> Instituto de Educación Superior Público Diseño &amp; Comunicación (IDC) &nbsp;|&nbsp; <b>Convocatoria:</b> 2026</p>
${copyNote}
<h3 style="color:${c.color}">Datos del equipo</h3>
<table style="border-collapse:collapse;width:100%;font-size:11pt"><thead><tr style="background:${c.color};color:#fff"><th style="padding:5px 8px;border:1px solid #ccc">#</th><th style="padding:5px 8px;border:1px solid #ccc">Apellidos y nombres</th><th style="padding:5px 8px;border:1px solid #ccc">DNI</th></tr></thead><tbody>${autoList}</tbody></table>
<hr style="border:1px solid ${c.color};margin:18pt 0">
<h2 style="color:${c.color}">Capítulo I — Planteamiento del problema</h2>
<p><b>1.1 Descripción del problema:</b> ${desc}</p>
<p><b>1.2 Formulación del problema:</b> ¿Cómo ${objg.toLowerCase()}?</p>
<p><b>1.3 Objetivos:</b></p><p>&nbsp;&nbsp;<b>General:</b> ${objg}</p><p>&nbsp;&nbsp;<b>Específico 1:</b> ${obje}</p>
<p><b>1.4 Justificación:</b> [Desarrollar importancia y relevancia del problema]</p>
<h2 style="color:${c.color}">Capítulo II — Marco teórico</h2>
<p><b>2.1 Antecedentes nacionales e internacionales:</b> [Citar estudios previos en APA 7]</p>
<p><b>2.2 Bases teóricas:</b> [Desarrollar fundamentos — mín. 5 fuentes]</p>
<p><b>2.3 Definición de términos:</b> ${c.glossary.map(([t,d])=>`<br><b>${t}:</b> ${d}`).join('')}</p>
<h2 style="color:${c.color}">Capítulo III — Metodología</h2>
<p><b>3.1 Tipo y diseño de investigación:</b> Aplicada / cuasi-experimental, enfoque mixto</p>
<p><b>3.2 Metodología ABPP — fases ejecutadas:</b> Briefing y Diagnóstico → Prototipado → Ejecución → Análisis y Socialización</p>
<p><b>3.3 Instrumentos:</b> [Encuestas, fichas de observación, protocolos de prueba]</p>
<p><b>3.4 Horas EFSRT:</b> ${hrs} h &nbsp;|&nbsp; Período: ${ini} — ${fin} &nbsp;|&nbsp; Lugar: ${lugar}</p>
<h2 style="color:${c.color}">Capítulo IV — Resultados y discusión</h2>
<p><b>4.1 Resultados por indicadores (KPIs):</b></p>
<ul>${c.kpis.map(k=>`<li><b>${k.l}:</b> Meta ${k.v} — ${k.h}</li>`).join('')}</ul>
<p><b>4.2 Discusión:</b> [Comparar con antecedentes y base teórica]</p>
<p><b>4.3 Conclusiones:</b> [Mín. 3 conclusiones alineadas a los objetivos]</p>
<p><b>4.4 Recomendaciones:</b> [Mín. 2 recomendaciones para futuros trabajos]</p>
<p><b>4.5 Presupuesto ejecutado:</b> S/ ${fmt(r.alloc)} asignado / S/ ${fmt(r.req)} solicitado</p>
${iaNota}
<h2 style="color:${c.color}">Referencias bibliográficas (APA 7.ª edición)</h2>
${refsList}
<br>
<table style="width:100%;margin-top:36pt"><tr>${sigLines}
  <td style="text-align:center;padding:32pt 8pt 0;width:20%"><div style="border-top:1px solid #444;width:90%;margin:0 auto"></div><span style="font-size:10pt">${asesor}<br>Asesor(a)</span></td>
</tr><tr>
  <td colspan="${autores.length}" style="text-align:center;padding:32pt 8pt 0"><div style="border-top:1px solid #444;width:60%;margin:0 auto"></div><span style="font-size:10pt">${coord}<br>Coordinación — ${c.name}</span></td>
  <td style="text-align:center;padding:32pt 8pt 0"><div style="border-top:1px solid #444;width:90%;margin:0 auto"></div><span style="font-size:10pt">Mg. Mario Quiroz Martínez<br>Jefatura Unidad de Investigación</span></td>
</tr></table>
<p style="margin-top:18pt;font-size:9pt;color:#888;text-align:center">Documento IDC 2026 · Formato APA 7.ª ed. · Times New Roman 12pt · interlineado doble · márgenes 2,54 cm</p>`;
    }

    const prefix=isPlan?'Plan-PTIIT':'Informe-PTIIT';
    const safe=tit.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g,'').replace(/\s+/g,'-').slice(0,40);
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:'Calibri',sans-serif;font-size:12pt;line-height:1.6;color:#222;max-width:800px;margin:40px auto;padding:20px}
h1,h2,h3{margin-top:18pt}table{width:100%}@page{margin:2.5cm}</style>
</head><body>${body}</body></html>`;
    const blob=new Blob([html],{type:'application/msword'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download=`${prefix}-${c.short}-IDC-${safe}.doc`; a.click(); URL.revokeObjectURL(a.href);
  }

  /* =====================================================================
     MOTOR DOCX OFICIAL — la plantilla Word institucional de cada
     especialidad actúa como MATRIZ DE RESULTADO del formulario: se
     descomprime el .docx embebido, se insertan los datos del formulario
     en word/document.xml y se vuelve a empaquetar. Sin librerías
     externas (usa DecompressionStream nativo del navegador).
  ===================================================================== */
  const CRC_T=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[n]=c;}return t;})();
  function crc32(u8){let c=0xFFFFFFFF;for(let i=0;i<u8.length;i++)c=CRC_T[(c^u8[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
  async function inflateRaw(u8){
    const st=new Blob([u8]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(st).arrayBuffer());
  }
  async function unzipDocx(u8){
    const dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength);
    let eocd=-1;
    for(let i=u8.length-22;i>=0;i--){ if(dv.getUint32(i,true)===0x06054B50){ eocd=i; break; } }
    if(eocd<0) throw new Error('ZIP inválido');
    const count=dv.getUint16(eocd+10,true);
    let off=dv.getUint32(eocd+16,true);
    const files=[];
    for(let n=0;n<count;n++){
      if(dv.getUint32(off,true)!==0x02014B50) throw new Error('Directorio central inválido');
      const method=dv.getUint16(off+10,true), csize=dv.getUint32(off+20,true),
            nlen=dv.getUint16(off+28,true), elen=dv.getUint16(off+30,true), clen=dv.getUint16(off+32,true),
            lho=dv.getUint32(off+42,true);
      const name=new TextDecoder().decode(u8.subarray(off+46,off+46+nlen));
      const lnlen=dv.getUint16(lho+26,true), lelen=dv.getUint16(lho+28,true);
      const ds=lho+30+lnlen+lelen;
      files.push({name, method, comp:u8.subarray(ds,ds+csize)});
      off+=46+nlen+elen+clen;
    }
    for(const f of files){ f.data=f.method===8?await inflateRaw(f.comp):f.comp.slice(); delete f.comp; delete f.method; }
    return files;
  }
  function zipStore(files){
    const enc=new TextEncoder(), parts=[], cdir=[]; let offset=0;
    for(const f of files){
      const nb=enc.encode(f.name), crc=crc32(f.data), n=f.data.length;
      const lh=new Uint8Array(30+nb.length), lv=new DataView(lh.buffer);
      lv.setUint32(0,0x04034B50,true); lv.setUint16(4,20,true); lv.setUint16(6,0x0800,true);
      lv.setUint32(14,crc,true); lv.setUint32(18,n,true); lv.setUint32(22,n,true);
      lv.setUint16(26,nb.length,true); lh.set(nb,30);
      parts.push(lh,f.data);
      const ch=new Uint8Array(46+nb.length), cv=new DataView(ch.buffer);
      cv.setUint32(0,0x02014B50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true); cv.setUint16(8,0x0800,true);
      cv.setUint32(16,crc,true); cv.setUint32(20,n,true); cv.setUint32(24,n,true);
      cv.setUint16(28,nb.length,true); cv.setUint32(42,offset,true); ch.set(nb,46);
      cdir.push(ch);
      offset+=lh.length+n;
    }
    const cdSize=cdir.reduce((a,c)=>a+c.length,0);
    const eocd=new Uint8Array(22), ev=new DataView(eocd.buffer);
    ev.setUint32(0,0x06054B50,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true);
    ev.setUint32(12,cdSize,true); ev.setUint32(16,offset,true);
    return new Blob([...parts,...cdir,eocd],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  }

  /* --- helpers de sustitución sobre word/document.xml --- */
  const escX=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const xText=s=>escX(String(s).trim()).replace(/\r?\n+/g,'</w:t><w:br/><w:t xml:space="preserve">');
  const xrAll=(x,a,b)=>x.split(a).join(b);
  function xrFirst(x,a,b){const i=x.indexOf(a);return i<0?x:x.slice(0,i)+b+x.slice(i+a.length);}
  function xrAfter(x,anchor,a,b){const p=x.indexOf(anchor);if(p<0)return x;const i=x.indexOf(a,p);return i<0?x:x.slice(0,i)+b+x.slice(i+a.length);}
  const TPL_UPPER={int:'DISEÑO DE INTERIORES',pub:'DISEÑO PUBLICITARIO',mod:'DISEÑO DE MODAS',cav:'COMUNICACIÓN AUDIOVISUAL'};
  const CRONO_ORIG=[
    {per:'26/06/2026 – 10/07/2026',sem:'2.0',hrs:'33 h'},
    {per:'10/07/2026 – 31/07/2026',sem:'3.0',hrs:'50 h'},
    {per:'31/07/2026 – 04/09/2026',sem:'5.0',hrs:'83 h'},
    {per:'04/09/2026 – 18/09/2026',sem:'2.0',hrs:'33 h'}
  ];
  /* La portada de algunas plantillas divide el nombre del programa en dos runs */
  function fixCoverPrograma(x, upper){
    if(x.includes('>DISEÑO DE INTERIORES</w:t>')) return xrFirst(x,'>DISEÑO DE INTERIORES</w:t>','>'+escX(upper)+'</w:t>');
    const m=x.match(/DISEÑO DE <\/w:t>([\s\S]{0,260}?<w:t[^>]*)>MODAS<\/w:t>/);
    if(m) return x.replace(m[0], escX(upper)+'</w:t>'+m[1]+'></w:t>');
    return x;
  }
  /* La línea de la portada puede venir en 1–5 runs (con corchetes sueltos) */
  function fixCoverLinea(x, linea){
    const a=x.indexOf('Línea de investigación: DI-L1');
    if(a<0) return x;
    const key='Sostenibilidad en el diseño de interiores';
    const b=x.indexOf(key,a);
    if(b<0||b-a>1600) return x;
    return x.slice(0,a)+'Línea de investigación: '+escX(linea)+x.slice(b+key.length);
  }
  function memberCellX(txt,center){
    return '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/><w:tcBorders>'
      +'<w:top w:val="single" w:sz="6" w:space="0" w:color="555555"/><w:left w:val="single" w:sz="6" w:space="0" w:color="555555"/>'
      +'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="555555"/><w:right w:val="single" w:sz="6" w:space="0" w:color="555555"/></w:tcBorders>'
      +'<w:tcMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar></w:tcPr>'
      +'<w:p><w:pPr><w:spacing w:before="80" w:after="80" w:line="288" w:lineRule="auto"/>'+(center?'<w:jc w:val="center"/>':'')
      +'<w:rPr><w:rFonts w:eastAsia="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:pPr>'
      +'<w:r><w:rPr><w:rFonts w:eastAsia="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
      +'<w:t xml:space="preserve">'+escX(txt||'—')+'</w:t></w:r></w:p></w:tc>';
  }
  async function fillOfficialDocx(esp, d){
    const t=DOCX_TEMPLATES[esp];
    if(!t) throw new Error('Plantilla no disponible para esta especialidad');
    if(typeof DecompressionStream==='undefined') throw new Error('unsupported');
    const bin=atob(t.b64), u8=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
    const files=await unzipDocx(u8);
    const doc=files.find(f=>f.name==='word/document.xml');
    if(!doc) throw new Error('document.xml no encontrado en la plantilla');
    let x=new TextDecoder().decode(doc.data);
    const espN=ESPN[esp]||esp;
    const set=v=>String(v==null?'':v).trim();

    /* Programa de estudios: portada + tabla sección 2 + 9.5 + 11 */
    x=fixCoverPrograma(x, TPL_UPPER[esp]||espN.toUpperCase());
    x=xrAll(x,'Diseño de Interiores',espN);

    /* Línea de investigación + tipo de innovación */
    const linea=set(d.linea), innov=set(d.innov)||'Incremental';
    if(linea){
      x=fixCoverLinea(x, linea);
      x=xrFirst(x,'>Línea de investigación: DI-L1 — Sostenibilidad en el diseño de interiores · Tipo de innovación: Incremental</w:t>',
        '>Línea de investigación: '+escX(linea)+' · Tipo de innovación: '+escX(innov)+'</w:t>');
      x=xrAll(x,'<w:t>[</w:t>','<w:t></w:t>');
      x=xrAll(x,'<w:t>]</w:t>','<w:t></w:t>');
    }

    /* Título (portada + sección 1) */
    if(set(d.titulo)) x=xrAll(x,'[Título del trabajo]',escX(set(d.titulo)));

    /* Portada: autores, modalidad, lugar/fecha · Sección 2: semestre */
    const autoresTxt=(d.autores||[]).map(a=>a.nombre).filter(Boolean).join('; ');
    if(autoresTxt) x=xrAll(x,'[Apellidos y nombres]',escX(autoresTxt));
    if(set(d.modalidad)) x=xrFirst(x,'>Modalidad: Individual</w:t>','>Modalidad: '+escX(set(d.modalidad))+'</w:t>');
    if(set(d.lugarfecha)) x=xrAll(x,'Lima, Perú — 2026',escX(set(d.lugarfecha)));
    if(set(d.semestre)) x=xrAll(x,'III Semestre — 2026',escX(set(d.semestre)));

    /* 3. Integrantes: filas reales en lugar de la fila marcadora */
    const mem=(d.autores||[]).filter(a=>a.nombre);
    if(mem.length){
      const ph=x.indexOf('[Registre los integrantes]');
      if(ph>-1){
        const trS=x.lastIndexOf('<w:tr',ph), trE=x.indexOf('</w:tr>',ph)+7;
        const rows=mem.map((m,i)=>'<w:tr>'+memberCellX(String(i+1),true)+memberCellX(m.mat)+memberCellX(m.nombre)
          +memberCellX(m.sem,true)+memberCellX(m.dni,true)+memberCellX(m.tel,true)+memberCellX(m.correo)+'</w:tr>').join('');
        x=x.slice(0,trS)+rows+x.slice(trE);
      }
      /* Firma del autor 1 en la hoja de aprobación (antes de tocar el resto de DNI) */
      if(set(mem[0].dni)) x=xrAfter(x,'[Autor]','DNI: __________','DNI: '+escX(set(mem[0].dni)));
      x=xrAll(x,'[Autor]',escX(mem[0].nombre));
    }

    /* Asesor(a) y su DNI (portada, sección 3 y aprobación) */
    if(set(d.asesor)) x=xrAll(x,'________________________',escX(set(d.asesor)));
    if(set(d.asesordni)) x=xrAll(x,'DNI: __________','DNI: '+escX(set(d.asesordni)));

    /* Jefatura de la Unidad de Investigación */
    if(set(d.jefe)&&set(d.jefe)!=='Mg. Mario Quiroz Martínez') x=xrAll(x,'Mg. Mario Quiroz Martínez',escX(set(d.jefe)));

    /* 4–7 y 9.3 */
    if(set(d.pgen)){ x=xrAll(x,'[Pregunta central del proyecto.]',xText(d.pgen)); x=xrAll(x,'[problema general declarado]',xText(d.pgen)); }
    if(set(d.pe)) x=xrAll(x,'[PE1, PE2, PE3…]',xText(d.pe));
    if(set(d.objg)) x=xrAll(x,'[Objetivo general con verbo en infinitivo.]',xText(d.objg));
    if(set(d.obje)) x=xrAll(x,'[OE1, OE2, OE3…]',xText(d.obje));
    if(set(d.desctec)) x=xrAll(x,'[Metodología/proceso, materiales y tecnologías, fases y entregable final. Máx. 300 palabras.]',xText(d.desctec));
    if(set(d.comp)) x=xrAll(x,'[competencia(s) declarada(s)]',xText(d.comp)+(set(d.ud)?escX(' · UD: '+set(d.ud)):''));

    /* 6. Justificación: rellena el «—» tras cada criterio redactado */
    [['Trascendencia',d.jt],['Magnitud',d.jm],['Vulnerabilidad',d.jv],['Factibilidad',d.jf]].forEach(([k,v])=>{
      if(set(v)) x=xrAfter(x,'<w:t>'+k+'.</w:t>','<w:t xml:space="preserve"> —</w:t>','<w:t xml:space="preserve"> '+xText(v)+'</w:t>');
    });

    /* 8. Cronograma: recalcula las 4 fases ABPP con las fechas del formulario */
    const sched=scheduleRows(d.inicioV,d.terminoV,+d.horas||200);
    if(sched){
      CRONO_ORIG.forEach((o,i)=>{ x=xrFirst(x,o.per,sched[i].periodo); });
      x=xrAll(x,'26/06/2026',fdate(d.inicioV)); x=xrAll(x,'18/09/2026',fdate(d.terminoV));
      CRONO_ORIG.forEach((o,i)=>{
        x=xrAfter(x,sched[i].periodo,'>'+o.sem+'</w:t>','>'+sched[i].semanas+'</w:t>');
        x=xrAfter(x,sched[i].periodo,'>'+o.hrs+'</w:t>','>'+sched[i].horas+' h</w:t>');
      });
    }

    /* 9.4 equivalencia crédito–horas · 10. presupuesto */
    if(set(d.cred)) x=xrAfter(x,'Créditos EFSRT del proyecto','>4</w:t>','>'+escX(set(d.cred))+'</w:t>');
    if(set(d.hcred)) x=xrAfter(x,'Horas prácticas por crédito','>50</w:t>','>'+escX(set(d.hcred))+'</w:t>');
    if(set(d.horas)) x=xrAll(x,'200 horas',escX(set(d.horas))+' horas');
    if(set(d.presup)) x=xrAll(x,'S/ 5000','S/ '+escX(set(d.presup)));

    doc.data=new TextEncoder().encode(x);
    return zipStore(files);
  }
  function dlBlob(blob,fname){
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=fname;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(a.href),3000);
  }
  const safeName=t=>(t||'ptiit').replace(/[^\wÀ-ſ ]+/g,'').slice(0,40).trim().replace(/\s+/g,'-')||'ptiit';

  /* Word oficial (.docx) rellenado desde el formulario de Inscripción */
  async function genWordOficial(){
    if(docType()==='informe'){
      toast2('El Informe PTIIT se genera en versión .doc (la plantilla oficial cubre el Plan, secciones 1–11)');
      genWordInforme(); return;
    }
    const esp=$('af-f-esp').value;
    const v=id=>($(id)&&$(id).value||'').trim();
    const d={
      titulo:v('af-f-titulo'), linea:v('af-f-linea'), innov:v('af-f-innov'), semestre:v('af-f-semestre'),
      modalidad:isGrupal()?'Grupal (2–4 integrantes)':'Individual',
      autores:readMembers(), asesor:v('af-f-asesor'), asesordni:v('af-f-asesordni'),
      jefe:v('af-f-jefe'), lugarfecha:v('af-f-fecha'),
      pgen:v('af-f-pgen'), pe:v('af-f-pe'), objg:v('af-f-objgen'), obje:v('af-f-objesp'),
      jt:v('af-f-jtrasc'), jm:v('af-f-jmagn'), jv:v('af-f-jvuln'), jf:v('af-f-jfact'),
      desctec:v('af-f-desctec'), comp:v('af-f-comp'), ud:v('af-f-ud'),
      cred:v('af-cred'), hcred:v('af-hcred'), horas:v('af-f-horas'), presup:v('af-f-presup'),
      inicioV:$('af-f-inicio')?$('af-f-inicio').value:'', terminoV:$('af-f-termino')?$('af-f-termino').value:''
    };
    try{
      const blob=await fillOfficialDocx(esp,d);
      dlBlob(blob,'PTIIT-IDC-OFICIAL-'+(ESPN[esp]||esp).replace(/\s+/g,'-')+'-'+safeName(d.titulo)+'.docx');
      toast2('Word oficial (.docx) rellenado con la matriz del formulario ✓');
    }catch(e){
      toast2(e.message==='unsupported'
        ?'Tu navegador no soporta el rellenado .docx — se genera la versión .doc'
        :'No se pudo rellenar el .docx — se genera la versión .doc');
      genWord();
    }
  }

  /* Plantilla oficial rellenada desde el mini-formulario de cada especialidad */
  async function genPaneOficial(id){
    const c=CAREERS.find(y=>y.id===id);
    if(!c){ alert('Especialidad no encontrada.'); return; }
    const g=n=>{ const el=document.getElementById('af-wd-'+id+'-'+n); return el?(el.value||'').trim():''; };
    if(!g('a1')||!g('d1')){ alert('Completa al menos el Autor 1 y su DNI.'); return; }
    const autores=[['a1','d1'],['a2','d2'],['a3','d3'],['a4','d4']]
      .map(([a,dn])=>({nombre:g(a),dni:g(dn),mat:'',sem:'',tel:'',correo:''})).filter(m=>m.nombre);
    const propias=(ST[id].lines||[]).filter(l=>!TLINES.includes(l));
    const li=propias.length?RLINES[id].indexOf(propias[0]):-1;
    const linea=li>-1?(LPREF[id]+'-L'+(li+1)+' — '+propias[0]):(LPREF[id]+'-L1 — '+RLINES[id][0]);
    const d={
      titulo:g('tit'), linea, innov:ST[id].innovType||'Incremental',
      modalidad:autores.length>1?'Grupal (2–4 integrantes)':'Individual',
      autores, asesor:g('asesor'), asesordni:'',
      objg:g('objg'), obje:g('obje'), desctec:g('desc'),
      horas:g('hrs')||'200', presup:String(ST[id].req||''),
      inicioV:g('ini'), terminoV:g('fin'),
      lugarfecha:g('lugar')?(g('lugar')+' — '+new Date().getFullYear()):''
    };
    try{
      const blob=await fillOfficialDocx(id,d);
      dlBlob(blob,'PTIIT-IDC-OFICIAL-'+c.short+'-'+safeName(d.titulo)+'.docx');
      toast2('Plantilla oficial '+c.short+' rellenada (.docx) ✓');
    }catch(e){
      toast2('No se pudo rellenar el .docx — descarga la plantilla en blanco o usa el Word personalizado');
    }
  }

  /* =====================================================================
     MATRIZ DE RESULTADO — vista viva formulario → secciones del Word
  ===================================================================== */
  const TPL_ICO={int:'🛋️',pub:'📣',mod:'👗',cav:'🎬'};
  function mval(id){ const el=$(id); return el?(el.value||'').trim():''; }
  function matrixRows(){
    const esp=$('af-f-esp')?$('af-f-esp').value:'int', espN=ESPN[esp]||esp;
    const mem=readMembers();
    const memOk=mem.filter(m=>m.nombre&&m.dni).length;
    const just=[mval('af-f-jtrasc'),mval('af-f-jmagn'),mval('af-f-jvuln'),mval('af-f-jfact')].filter(Boolean).length;
    const sched=scheduleRows($('af-f-inicio')?$('af-f-inicio').value:'', $('af-f-termino')?$('af-f-termino').value:'', +mval('af-f-horas')||200);
    return [
      { sec:'Portada', foco:'af-f-titulo',
        val:[mval('af-f-titulo'),espN,mval('af-f-linea'),mem.map(m=>m.nombre).filter(Boolean).join('; '),mval('af-f-asesor')].filter(Boolean).join(' · '),
        ok:!!(mval('af-f-titulo')&&mem.some(m=>m.nombre)), ph:'Título, programa, línea, autores y asesor(a)' },
      { sec:'1 · Título del trabajo', foco:'af-f-titulo', val:mval('af-f-titulo'), ok:!!mval('af-f-titulo'),
        ph:'[Título del trabajo] — máx. 25 palabras' },
      { sec:'2 · Programa de estudios', foco:'af-f-esp', auto:true, ok:true,
        val:espN+' · '+(mval('af-f-semestre')||'III Semestre — 2026')+' · '+mval('af-f-linea')+' · '+mval('af-f-innov') },
      { sec:'3 · Integrantes', foco:'af-members',
        val:mem.filter(m=>m.nombre).map((m,i)=>(i+1)+'. '+m.nombre+(m.dni?' (DNI '+m.dni+')':'')).join(' · ')
            +(mval('af-f-asesor')?' · Asesor(a): '+mval('af-f-asesor'):''),
        ok:memOk>0&&!!mval('af-f-asesor'), ph:'[Registre los integrantes] + asesor/tutor con DNI' },
      { sec:'4 · Formulación del problema', foco:'af-f-pgen',
        val:[mval('af-f-pgen'),mval('af-f-pe')].filter(Boolean).join(' · '), ok:!!mval('af-f-pgen'),
        ph:'[Pregunta central del proyecto] + PE1, PE2, PE3…' },
      { sec:'5 · Objetivos', foco:'af-f-objgen',
        val:[mval('af-f-objgen'),mval('af-f-objesp')].filter(Boolean).join(' · '), ok:!!mval('af-f-objgen'),
        ph:'[Objetivo general en infinitivo] + OE1, OE2, OE3…' },
      { sec:'6 · Justificación', foco:'af-f-jtrasc',
        val:just?just+'/4 criterios redactados (trascendencia, magnitud, vulnerabilidad, factibilidad)':'',
        ok:just===4, ph:'Trascendencia · Magnitud · Vulnerabilidad · Factibilidad' },
      { sec:'7 · Descripción técnica', foco:'af-f-desctec', val:mval('af-f-desctec'), ok:!!mval('af-f-desctec'),
        ph:'[Metodología, materiales, fases y entregable — máx. 300 palabras]' },
      { sec:'8 · Cronograma de actividades', foco:'af-f-inicio', auto:!!sched, ok:!!sched,
        val:sched?('4 fases ABPP · '+fdate($('af-f-inicio').value)+' → '+fdate($('af-f-termino').value)+' · '+(mval('af-f-horas')||'200')+' h'):'',
        ph:'Define fechas de inicio y término (se calculan las 4 fases)' },
      { sec:'9 · Base normativa EFSRT', foco:'af-f-comp',
        val:[mval('af-f-comp')&&('Competencias: '+mval('af-f-comp')),mval('af-f-ud')&&('UD: '+mval('af-f-ud'))].filter(Boolean).join(' · '),
        ok:!!mval('af-f-comp'), ph:'[competencia(s) declarada(s)] + unidad(es) didáctica(s)' },
      { sec:'10 · Presupuesto', foco:'af-f-presup', auto:true, ok:true,
        val:'S/ '+(mval('af-f-presup')||'5000')+' · autofinanciado · '+(mval('af-f-horas')||'200')+' h EFSRT' },
      { sec:'11 · Aprobación y firmas', foco:'af-f-asesor',
        val:[mem[0]&&mem[0].nombre,mval('af-f-asesor'),mval('af-f-coord'),mval('af-f-jefe')].filter(Boolean).join(' · '),
        ok:!!(mval('af-f-asesor')&&mval('af-f-asesordni')), ph:'Firmas de autores (DNI), asesor(a), coordinación y jefatura' }
    ];
  }
  function renderMatrix(){
    const body=$('rmx-body'); if(!body) return;
    const esp=$('af-f-esp')?$('af-f-esp').value:'int', col=CCOL[esp]||'#0072b9';
    const card=$('af-matrix-card'); if(card) card.style.setProperty('--acc',col);
    const tbl=$('rmx-table'); if(tbl) tbl.style.setProperty('--rmx-acc',col);
    const tp=$('rmx-tpls');
    if(tp&&!tp.dataset.built){
      tp.dataset.built='1';
      CAREERS.forEach(c=>{
        const b=document.createElement('button');
        b.type='button'; b.className='rmx-tpl'; b.id='rmx-tpl-'+c.id; b.style.setProperty('--tc',c.color);
        b.setAttribute('role','tab');
        b.innerHTML='<span class="rmx-tpl-ico">'+TPL_ICO[c.id]+'</span><span class="rmx-tpl-name">'+esc(c.name)+'</span>'
          +'<span class="rmx-tpl-file">'+esc(DOCX_TEMPLATES[c.id]?DOCX_TEMPLATES[c.id].fname:'')+'</span>';
        b.onclick=()=>{ $('af-f-esp').value=c.id; fillLineOptions(); renderMatrix(); saveDraft(); };
        tp.appendChild(b);
      });
    }
    document.querySelectorAll('#rmx-tpls .rmx-tpl').forEach(b=>b.classList.toggle('active',b.id==='rmx-tpl-'+esp));
    const rows=matrixRows();
    body.innerHTML=rows.map(r=>
      '<tr data-foco="'+r.foco+'"><td class="rmx-sec">'+r.sec+'</td>'
      +'<td>'+(r.val?'<span class="rmx-val">'+esc(r.val)+'</span>':'<span class="rmx-val ph">'+esc(r.ph||'—')+'</span>')+'</td>'
      +'<td>'+(r.ok?(r.auto?'<span class="rmx-chip auto">⚙ automático</span>':'<span class="rmx-chip ok">✓ completo</span>')
                   :'<span class="rmx-chip pend">⬜ pendiente</span>')+'</td></tr>'
    ).join('');
    body.querySelectorAll('tr').forEach(tr=>{
      tr.onclick=()=>{ const el=$(tr.dataset.foco); if(!el) return;
        el.scrollIntoView({behavior:'smooth',block:'center'});
        if(el.focus) setTimeout(()=>{ try{ el.focus({preventScroll:true}); }catch(e){} },450); };
    });
    const done=rows.filter(r=>r.ok).length, pct=Math.round(done/rows.length*100);
    const fill=$('rmx-fill'); if(fill) fill.style.width=pct+'%';
    const bar=$('rmx-bar'); if(bar) bar.setAttribute('aria-valuenow',pct);
    const p=$('rmx-pct'); if(p) p.textContent=pct+'% completado';
    const cn=$('rmx-count'); if(cn) cn.textContent=done+'/'+rows.length+' secciones del Word oficial';
  }

  /* ===== Borrador local del formulario (autoguardado) ===== */
  const DRAFT_KEY='ptiitDraftV2';
  const DRAFT_IDS=['af-f-titulo','af-f-esp','af-f-semestre','af-f-linea','af-f-innov','af-f-pgen','af-f-pe','af-f-objgen','af-f-objesp',
    'af-f-jtrasc','af-f-jmagn','af-f-jvuln','af-f-jfact','af-f-desctec','af-f-ud','af-f-comp','af-f-presup','af-f-horas',
    'af-f-inicio','af-f-termino','af-f-asesor','af-f-asesordni','af-f-coord','af-f-jefe','af-f-fecha',
    'af-f-resumen','af-f-dedica','af-f-agrade','af-f-conclu','af-f-recom','af-f-refs'];
  let draftT=null;
  function saveDraft(){
    clearTimeout(draftT);
    draftT=setTimeout(()=>{
      try{
        const o={f:{},mem:readMembers(),grupal:isGrupal(),doctype:docType()};
        DRAFT_IDS.forEach(id=>{ const el=$(id); if(el) o.f[id]=el.value; });
        localStorage.setItem(DRAFT_KEY,JSON.stringify(o));
        const s=$('rmx-save');
        if(s){ s.textContent='💾 borrador guardado ✓'; s.classList.add('on');
          setTimeout(()=>{ s.textContent='💾 borrador local'; s.classList.remove('on'); },1600); }
      }catch(e){}
    },350);
  }
  function restoreDraft(){
    let o=null; try{ o=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null'); }catch(e){}
    if(!o||!o.f) return;
    if(o.doctype){ const r=document.querySelector('input[name="af-doctype"][value="'+o.doctype+'"]'); if(r) r.checked=true; }
    if(o.grupal){ const r=document.querySelector('input[name="af-modal"][value="Grupal"]'); if(r){ r.checked=true; setModalidad(); } }
    if(o.f['af-f-esp']){ const e=$('af-f-esp'); if(e){ e.value=o.f['af-f-esp']; fillLineOptions(); } }
    DRAFT_IDS.forEach(id=>{ if(id==='af-f-esp') return; const el=$(id); if(el&&o.f[id]!=null&&o.f[id]!=='') el.value=o.f[id]; });
    if(Array.isArray(o.mem)&&o.mem.length){
      const cap=o.grupal?Math.min(o.mem.length,4):1;
      while(document.querySelectorAll('#af-members .af-member').length<cap) addMember();
      const nodes=document.querySelectorAll('#af-members .af-member');
      o.mem.forEach((m,i)=>{ const n=nodes[i]; if(!n) return;
        const put=(cls,v2)=>{ const el2=n.querySelector(cls); if(el2&&v2) el2.value=v2; };
        put('.m-nombre',m.nombre); put('.m-mat',m.mat); put('.m-sem',m.sem); put('.m-dni',m.dni); put('.m-correo',m.correo); put('.m-tel',m.tel); });
    }
  }
  function initMatrix(){
    const scr=$('af-screen-inscripcion'); if(!scr) return;
    ['input','change'].forEach(ev=>scr.addEventListener(ev,()=>{ renderMatrix(); saveDraft(); }));
    const box=$('af-members');
    if(box&&typeof MutationObserver!=='undefined') new MutationObserver(()=>renderMatrix()).observe(box,{childList:true});
    renderMatrix();
  }

  return { recalc, genPrompt, copyP, dlP, fetchBCRP, manualRate, conv, saveProxy, schedule, efsrt, toggleLine, toggleTLine, showScreen,
           setModalidad, addMember, removeMember, fillLineOptions, importFromTool, genWord, genWordPane, openGlossary, closeGlossary,
           demoPane, clearPane, downloadTemplate, genWordOficial, genPaneOficial };
})();

/* ================================================================== */
/* ===================================================================
   MODO PÁGINAS — convierte el menú superior en pestañas que muestran
   UNA pantalla a la vez (sin scroll largo). No depende del resto.
   =================================================================== */
(function () {
  function init() {
    const container = document.querySelector('#main-content .container');
    if (!container) return;
    const pages = [...container.children].filter(
      el => el.tagName === 'SECTION' || (el.tagName === 'HEADER' && el.classList.contains('hero'))
    );
    if (pages.length < 2) return;
    const home = pages.find(p => p.tagName === 'HEADER') || pages[0];

    document.body.classList.add('pg-mode');

    function reveal(page) {
      if (page.classList.contains('reveal')) page.classList.add('visible');
      page.querySelectorAll('.reveal').forEach(e => e.classList.add('visible'));
    }
    pages.forEach(reveal); // evita que el contenido quede en opacity:0

    function show(page, btn) {
      if (!page) return;
      pages.forEach(p => p.classList.toggle('pg-active', p === page));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function pageOf(id) {
      let el = document.getElementById(id);
      if (!el) return null;
      while (el && el.parentElement !== container) el = el.parentElement;
      return el;
    }

    /* API global: permite a botones/enlaces de toda la página cambiar de
       pestaña (scrollToSection, scrollToNavSection, scrollToArea, FAQ…). */
    window.pgShow = function (id, screen) {
      const pg = pageOf(id);
      if (!pg) return false;
      show(pg, null);
      /* si el destino es un elemento interno de la página, desplazarse hasta él */
      if (pg.id !== id) setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      if (screen && window.VR) { try { VR.showScreen(screen); } catch (e) {} }
      return true;
    };

    /* Enlaces internos (tarjetas del menú de secciones, FAQ, etc.):
       en modo páginas un ancla a una sección oculta no haría nada. */
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = (a.getAttribute('href') || '').slice(1);
      if (!id) { e.preventDefault(); show(home, homeBtn); return; }
      const pg = pageOf(id);
      if (!pg) return;
      e.preventDefault();
      show(pg, null);
      if (pg.id !== id) setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    });

    // Las 4 carreras (ids inexistentes en el doc) llevan a la herramienta,
    // a la PANTALLA de esa especialidad — así quedan separadas por pestaña.
    const careerMap = { 'area-int': 'int', 'area-pub': 'pub', 'area-mod': 'mod', 'area-cav': 'cav' };

    // Repuntar cada botón del MENÚ SUPERIOR a cambiar de pantalla (no hacer
    // scroll). Solo los del nav: otros .nav-btn (p. ej. «Comenzar» del
    // tutorial) conservan su onclick y pasan por scrollToSection, que ya
    // es consciente del modo páginas.
    document.querySelectorAll('#main-nav .nav-btn').forEach(btn => {
      const oc = btn.getAttribute('onclick') || '';
      const m = oc.match(/scrollToSection\('([^']+)'/);
      if (!m) return;
      const targetId = m[1];
      const career = careerMap[targetId];
      const goesAutofin = career || targetId === 'autofin-section';
      btn.removeAttribute('onclick');
      btn.addEventListener('click', function () {
        const pageId = goesAutofin ? 'autofin-section' : targetId;
        show(pageOf(pageId), btn);
        if (goesAutofin && window.VR) { try { VR.showScreen(career || 'generales'); } catch (e) {} }
      });
    });

    // Botón "Inicio" al inicio del menú
    const nav = document.querySelector('nav[aria-label="Áreas"]') || document.querySelector('nav');
    let homeBtn = null;
    if (nav) {
      homeBtn = document.createElement('button');
      homeBtn.className = 'nav-btn pg-home active';
      homeBtn.textContent = '🏠 Inicio';
      homeBtn.addEventListener('click', () => show(home, homeBtn));
      const label = nav.querySelector('.nav-label');
      if (label && label.nextSibling) nav.insertBefore(homeBtn, label.nextSibling);
      else if (label) nav.appendChild(homeBtn);
      else nav.insertBefore(homeBtn, nav.firstChild);
    }
    // Click en el logo del menú → Inicio
    const logo = document.getElementById('navLogo');
    if (logo) { logo.style.cursor = 'pointer'; logo.addEventListener('click', () => show(home, homeBtn)); }

    show(home, homeBtn);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

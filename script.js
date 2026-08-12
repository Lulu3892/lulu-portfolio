const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const printedRole = document.querySelector('.printed-role');
if (printedRole) {
  printedRole.style.setProperty('--printed-width', `${printedRole.scrollWidth}px`);
}

const projectNavLinks = [...document.querySelectorAll('.filters a')];
projectNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    projectNavLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});

document.querySelectorAll('.project-visual').forEach((visual) => {
  visual.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visual.style.setProperty('--tilt-x', `${-y * 2.5}deg`);
    visual.style.setProperty('--tilt-y', `${x * 2.5}deg`);
  });
  visual.addEventListener('pointerleave', () => {
    visual.style.setProperty('--tilt-x', '0deg');
    visual.style.setProperty('--tilt-y', '0deg');
  });
});

document.querySelectorAll('.case-toggle').forEach((button) => {
  const project = button.closest('.project');
  const mapPanel = project?.querySelector('.case-map-panel');
  const label = button.querySelector('.case-toggle-label');

  button.addEventListener('click', () => {
    const showingMap = project.classList.toggle('show-case-map');
    button.setAttribute('aria-expanded', String(showingMap));
    mapPanel?.setAttribute('aria-hidden', String(!showingMap));
    label.textContent = showingMap ? '返回产品界面' : '查看项目思考过程';
  });
});

document.querySelectorAll('.pet-carousel').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dots button')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
  }

  function startAutoplay() {
    clearInterval(timer);
    if (!reducedMotion) timer = setInterval(() => showSlide(current + 1), 4200);
  }

  function restartAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  carousel.querySelector('.carousel-prev').addEventListener('click', () => {
    showSlide(current - 1);
    restartAutoplay();
  });
  carousel.querySelector('.carousel-next').addEventListener('click', () => {
    showSlide(current + 1);
    restartAutoplay();
  });
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    restartAutoplay();
  }));
  carousel.addEventListener('pointerenter', () => clearInterval(timer));
  carousel.addEventListener('pointerleave', startAutoplay);
  carousel.addEventListener('focusin', () => clearInterval(timer));
  carousel.addEventListener('focusout', startAutoplay);
  startAutoplay();
});

// PetMind uses the same thinking-process interaction as Daily English while keeping its two-column layout.
const petmindProject = document.querySelector('#petmind');
const petmindInfo = petmindProject?.querySelector('.project-info');
const petmindCarousel = petmindProject?.querySelector('.pet-carousel');
if (petmindProject && petmindInfo && petmindCarousel) {
  const toggle = document.createElement('button');
  toggle.className = 'case-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span class="case-toggle-label">查看项目思考过程</span><span class="case-toggle-icon" aria-hidden="true">↘</span>';
  petmindInfo.insertBefore(toggle, petmindInfo.querySelector('h3'));

  const mapPanel = document.createElement('div');
  mapPanel.className = 'case-panel case-map-panel pet-map-panel';
  mapPanel.setAttribute('aria-hidden', 'true');
  mapPanel.innerHTML = `
    <div class="mind-map pet-mind-map" role="img" aria-label="PetMind 项目思考过程">
      <div class="mind-node node-problem"><b>01 三级风险分流</b><span>自然语言输入 → 信息提取 → 危险检测 → 追问 → 绿黄红结果</span></div>
      <div class="mind-node node-research"><b>02 产品行动</b><span>绿：居家观察；黄：当天联系医院；红：立即就医</span></div>
      <div class="mind-node node-priority"><b>03 危险信号兜底</b><span>AI 信息提取＋本地规则独立检测；危险信号优先，模型异常时降级至规则问答</span></div>
      <div class="mind-center"><small>PETMIND</small><b>宠物健康风险分流</b><span>提供健康信息与就医行动建议，不提供诊断或处方</span></div>
      <div class="mind-node node-flow"><b>04 测试集构成</b><span>规则路径 40 条；自然语言 20 条，其中危险样本 10 条；内部测试全部通过</span></div>
      <div class="mind-node node-ai"><b>05 失败案例迭代</b><span>首次测试发现“黑色柏油样便”“抽搐”可识别为危险信号但无法正确归类；补充症状映射及否定样本后完成回归测试</span></div>
      <div class="mind-node node-test"><b>06 产品边界</b><span>结果仅来自自建内部测试集，未经过真实用户盲测、执业兽医审核或临床验证</span></div>
      <p class="mind-next">AI 负责信息提取，本地规则负责安全兜底；红色结果仅提供就医行动建议，不输出确定性诊断、处方或药物剂量。</p>
    </div>`;
  petmindCarousel.appendChild(mapPanel);
  const petmindMapText = {
    '.node-problem b': '01 用户问题',
    '.node-problem span': '用户能描述症状，但难以判断是否需要立即就医',
    '.node-research b': '02 方案选择',
    '.node-research span': '不做疾病诊断，聚焦信息整理、风险分流与行动建议',
    '.node-priority b': '03 功能优先级',
    '.node-priority span': 'P0：危险识别与分级\nP1：结构化追问与记录\n暂缓：线上诊断',
    '.node-flow b': '04 核心流程',
    '.node-flow span': '描述症状 → 补充追问 → 风险结果 → 保存记录',
    '.node-ai b': '05 失败案例迭代',
    '.node-ai span': '补充黑便、抽搐等症状映射，并加入否定表达回归样本',
    '.node-test b': '06 下一步',
    '.node-test span': '扩大真实表达覆盖，邀请专业人员审核风险话术',
    '.mind-center span': '从模糊症状描述\n到清晰行动路径',
    '.mind-next': '下一步：扩充真实表达样本，并验证用户能否理解分级结果与行动建议'
  };
  Object.entries(petmindMapText).forEach(([selector, text]) => {
    const node = mapPanel.querySelector(selector);
    if (node) node.textContent = text;
  });

  toggle.addEventListener('click', () => {
    const showingMap = petmindProject.classList.toggle('show-case-map');
    toggle.setAttribute('aria-expanded', String(showingMap));
    mapPanel.setAttribute('aria-hidden', String(!showingMap));
    toggle.querySelector('.case-toggle-label').textContent = showingMap ? '返回产品界面' : '查看项目思考过程';
  });
}

document.querySelectorAll('#daily-english, #petmind').forEach((project) => {
  const info = project.querySelector('.project-info');
  const thinkingButton = info?.querySelector('.case-toggle');
  const deepDiveButton = info?.querySelector('.deep-dive-trigger');
  if (!info || !thinkingButton || !deepDiveButton) return;

  const actions = document.createElement('div');
  actions.className = 'project-actions';
  actions.append(thinkingButton, deepDiveButton);
  const nextContent = info.querySelector('.project-links, .case-note');
  info.insertBefore(actions, nextContent);
});

document.querySelectorAll('.tarot-card').forEach((card) => {
  const dialog = document.querySelector(`#${card.dataset.extra}`);
  card.addEventListener('click', () => dialog.showModal());
});

document.querySelectorAll('.deep-dive-trigger').forEach((button) => {
  const dialog = document.querySelector(`#${button.dataset.dialog}`);
  if (dialog) button.addEventListener('click', () => dialog.showModal());
});

document.querySelectorAll('.extra-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });
});

const sopDialog = document.querySelector('#magic-sop-dialog');
const sopPreview = document.querySelector('.experience-proof');
if (sopDialog && sopPreview) {
  sopPreview.addEventListener('click', () => sopDialog.showModal());
}

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const opening = document.querySelector('.opening');
  const hero = document.querySelector('.hero');
  const heroTitle = document.querySelector('#hero-title');
  const work = document.querySelector('#work');
  const projectList = document.querySelector('.project-list');
  let scrollFrame = 0;
  let pointerFrame = 0;
  let pointer = { x: 0.5, y: 0.5 };
  let smoothPointer = { x: 0.5, y: 0.5 };
  const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 || navigator.connection?.saveData;
  const field = { canvas: document.querySelector('.signal-field'), ctx: null, width: 0, height: 0, dpr: 1, time: 0, energy: 0, pointer: { x: .5, y: .5 }, smooth: { x: .5, y: .5 }, nextSignal: 9000 + Math.random() * 9000, signal: 0 };
  let visualFrame = 0;

  const fitCanvas = (canvas, context) => {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
    canvas.width = Math.max(1, Math.floor(bounds.width * dpr));
    canvas.height = Math.max(1, Math.floor(bounds.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width: bounds.width, height: bounds.height, dpr };
  };

  const drawSignalField = (elapsed) => {
    if (!field.ctx || reducedMotion) return;
    field.time += elapsed * .001;
    field.smooth.x += (field.pointer.x - field.smooth.x) * .025;
    field.smooth.y += (field.pointer.y - field.smooth.y) * .025;
    field.energy *= .94;
    field.signal = Math.max(0, field.signal - elapsed * .0012);
    const { ctx, width, height, time, smooth } = field;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = .7;
    for (let row = -1; row < height / 58 + 2; row += 1) {
      const base = row * 58;
      ctx.beginPath();
      for (let x = -30; x <= width + 30; x += 26) {
        const wave = Math.sin(x * .006 + time * .18 + row * .7) * 10 + Math.sin(x * .014 - time * .12) * 4;
        const dx = x - smooth.x * width;
        const dy = base - smooth.y * height;
        const radius = Math.max(80, width * .24);
        const influence = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius);
        const y = base + wave + influence * Math.sin(x * .03 + time) * 18 * (1 + field.energy * 2);
        if (x === -30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(17,17,17,${.045 + field.energy * .035})`;
      ctx.stroke();
    }
    if (field.signal > 0) {
      const signalY = (Math.sin(time * 1.5) * .35 + .5) * height;
      ctx.beginPath(); ctx.moveTo(0, signalY); ctx.lineTo(width, signalY - 12);
      ctx.strokeStyle = `rgba(36,87,255,${Math.min(.45, field.signal * .3)})`; ctx.stroke();
    }
  };

  const drawCrop = (canvas, time) => {
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    const points = 22;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = .8;
    for (let index = 0; index < points; index += 1) {
      const x = width * (.08 + index / points * .84);
      const y = height * (.48 + Math.sin(index * 1.8 + time * .001) * .22 + Math.sin(index * .34) * .1);
      ctx.fillStyle = index % 5 === 0 ? '#2457FF' : 'rgba(17,17,17,.42)';
      ctx.fillRect(x, y, 2.2, 2.2);
      if (index) { ctx.beginPath(); ctx.moveTo(x - width / points, y); ctx.lineTo(x, y); ctx.strokeStyle = 'rgba(17,17,17,.18)'; ctx.stroke(); }
    }
    ctx.beginPath(); ctx.moveTo(width * .08, height * .76); ctx.bezierCurveTo(width * .32, height * .35, width * .58, height * .72, width * .92, height * .2); ctx.strokeStyle = 'rgba(36,87,255,.5)'; ctx.stroke();
  };

  const drawVoid = (canvas, time, target) => {
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height); ctx.fillStyle = 'rgba(244,244,241,.65)'; ctx.font = '10px monospace';
    for (let index = 0; index < (lowPower ? 12 : 24); index += 1) {
      const x = ((index * 73 + time * (.012 + index * .0003)) % (width + 30)) - 15;
      const y = (index * 47) % height;
      ctx.fillText(index % 3 ? '·' : '010', x, y);
    }
    const shipX = target.x * width; const shipY = target.y * height;
    ctx.fillStyle = '#FF3B30'; ctx.fillRect(shipX - 2, shipY - 2, 4, 4);
    ctx.fillStyle = 'rgba(36,87,255,.7)'; ctx.fillText('VOID / ACTIVE', 12, height - 14);
  };

  const initVisuals = () => {
    if (field.canvas && !reducedMotion) {
      field.ctx = field.canvas.getContext('2d', { alpha: true });
      const resize = () => { const size = fitCanvas(field.canvas, field.ctx); field.width = size.width; field.height = size.height; field.dpr = size.dpr; };
      resize(); window.addEventListener('resize', resize, { passive: true });
    }
    const cropCanvas = document.querySelector('.crop-canvas');
    const voidCanvas = document.querySelector('.void-canvas');
    const cropCtx = cropCanvas?.getContext('2d');
    const voidCtx = voidCanvas?.getContext('2d');
    const cropResize = () => { if (cropCanvas && cropCtx) fitCanvas(cropCanvas, cropCtx); if (voidCanvas && voidCtx) fitCanvas(voidCanvas, voidCtx); };
    cropResize(); window.addEventListener('resize', cropResize, { passive: true });
    const voidTarget = { x: .5, y: .5 };
    voidCanvas?.addEventListener('pointermove', (event) => { const bounds = voidCanvas.getBoundingClientRect(); voidTarget.x = (event.clientX - bounds.left) / bounds.width; voidTarget.y = (event.clientY - bounds.top) / bounds.height; });
    const render = (time) => {
      visualFrame = 0;
      drawSignalField(time - (field.last || time)); field.last = time;
      if (cropCanvas && cropCtx && document.querySelector('.project-crop')?.classList.contains('is-visible')) drawCrop(cropCanvas, time);
      if (voidCanvas && voidCtx && document.querySelector('.project-void')?.classList.contains('is-visible')) drawVoid(voidCanvas, time, voidTarget);
      if (!reducedMotion) visualFrame = requestAnimationFrame(render);
    };
    if (!reducedMotion) visualFrame = requestAnimationFrame(render);
  };

  initVisuals();

  const setOpeningStage = (stage) => {
    if (opening) opening.dataset.stage = stage;
  };

  const playIntro = () => {
    if (!opening || reducedMotion) {
      opening?.classList.add('is-complete');
      body.classList.add('intro-complete');
      return;
    }
    opening.classList.remove('is-complete');
    body.classList.add('intro-running');
    setOpeningStage('empty');
    requestAnimationFrame(() => setOpeningStage('line'));
    window.setTimeout(() => setOpeningStage('fragments'), 650);
    window.setTimeout(() => setOpeningStage('assemble'), 1500);
    window.setTimeout(() => {
      setOpeningStage('glitch');
      triggerGlitch(360);
    }, 2700);
    window.setTimeout(() => setOpeningStage('clean'), 3150);
    window.setTimeout(() => {
      opening.classList.add('is-complete');
      body.classList.remove('intro-running');
      body.classList.add('intro-complete');
      sessionStorage.setItem('signal-intro-seen', 'true');
    }, 3900);
  };

  const triggerGlitch = (duration = 280) => {
    if (reducedMotion || !heroTitle) return;
    field.energy = 1;
    heroTitle.classList.remove('glitch-active');
    void heroTitle.offsetWidth;
    heroTitle.classList.add('glitch-active');
    window.setTimeout(() => heroTitle.classList.remove('glitch-active'), duration);
  };

  window.playIntro = playIntro;
  if (sessionStorage.getItem('signal-intro-seen') || reducedMotion) {
    opening?.classList.add('is-complete');
    body.classList.add('intro-complete');
  } else {
    playIntro();
  }

  document.querySelector('.site-footer a')?.addEventListener('click', (event) => {
    event.preventDefault();
    sessionStorage.removeItem('signal-intro-seen');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    playIntro();
  });

  const updateScroll = () => {
    scrollFrame = 0;
    const viewport = window.innerHeight;
    const heroProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, viewport * 0.9)));
    document.documentElement.style.setProperty('--scroll-progress', heroProgress.toFixed(3));
    if (work && projectList && window.innerWidth > 800 && !reducedMotion) {
      const bounds = work.getBoundingClientRect();
      const travel = Math.max(1, work.offsetHeight - viewport);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      work.style.setProperty('--project-progress', progress.toFixed(3));
      projectList.style.setProperty('--project-shift', `${(progress * 75).toFixed(3)}%`);
    }
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame && !reducedMotion) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  updateScroll();

  if (!reducedMotion) {
    const signalEvent = () => {
      field.signal = 1;
      field.nextSignal = 12000 + Math.random() * 14000;
      window.setTimeout(signalEvent, field.nextSignal);
    };
    window.setTimeout(signalEvent, field.nextSignal);
  }

  if (hero && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const animateField = () => {
      pointerFrame = 0;
      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.08;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.08;
      hero.style.setProperty('--cursor-x', smoothPointer.x.toFixed(3));
      hero.style.setProperty('--cursor-y', smoothPointer.y.toFixed(3));
      if (Math.abs(pointer.x - smoothPointer.x) > 0.01) pointerFrame = requestAnimationFrame(animateField);
    };
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = (event.clientY - bounds.top) / bounds.height;
      field.pointer.x = pointer.x;
      field.pointer.y = pointer.y;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(animateField);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('project')) triggerGlitch(220);
      }
    });
  }, { threshold: 0.42 });
  document.querySelectorAll('.project, .portrait, .archive-piece').forEach((element) => observer.observe(element));

  const labStage = document.querySelector('.lab-stage');
  const labContent = {
    model: '<div class="lab-preview model-preview"><span>MODEL / TRAINING</span><i></i><b>VISUAL PREVIEW</b></div>',
    tic: '<div class="lab-preview tic-preview"><span>MINIMAX / YOUR MOVE</span><div class="tic-board" role="grid" aria-label="Tic-tac-toe board"></div><button class="lab-reset" type="button">RESET BOARD</button></div>',
    void: '<div class="lab-preview void-preview"><span>VOID WARS / SIGNAL TEST</span><div class="ascii-signal">/\\ 0101 \\//<br>-- VOID / ACTIVE --<br>\\// 0010 /\\</div></div>',
    drift: '<div class="lab-preview drift-preview"><span>CANVAS DRIFT / MOTION STUDY</span><i></i><button class="lab-reset" type="button">RESTART MOTION</button></div>'
  };
  document.querySelectorAll('[data-lab]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.lab;
    document.querySelectorAll('[data-lab]').forEach((item) => item.classList.toggle('active', item === button));
    if (labStage) {
      labStage.innerHTML = labContent[key];
      labStage.dataset.active = key;
      if (key === 'tic') initTicTacToe(labStage.querySelector('.tic-board'));
    }
  }));

  const initTicTacToe = (board) => {
    const cells = Array(9).fill('');
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const winner = (state) => wins.find(([a,b,c]) => state[a] && state[a] === state[b] && state[a] === state[c]);
    const render = () => {
      board.innerHTML = '';
      cells.forEach((value, index) => {
        const cell = document.createElement('button');
        cell.type = 'button'; cell.className = 'tic-cell'; cell.textContent = value; cell.setAttribute('aria-label', `Cell ${index + 1}`);
        cell.addEventListener('click', () => {
          if (cells[index] || winner(cells)) return;
          cells[index] = 'X';
          if (!winner(cells) && cells.some((item) => !item)) {
            const move = bestMove(cells);
            if (move > -1) cells[move] = 'O';
          }
          render();
        });
        board.append(cell);
      });
    };
    const bestMove = (state) => {
      const open = state.map((value, index) => value ? -1 : index).filter((index) => index > -1);
      return open.includes(4) ? 4 : (open[0] ?? -1);
    };
    render();
  };

  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    form.querySelectorAll('.invalid').forEach((field) => field.classList.remove('invalid'));
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    let error = '';
    if (!name.value.trim()) { name.classList.add('invalid'); error = 'Please enter your name.'; }
    else if (!email.validity.valid) { email.classList.add('invalid'); error = 'Please enter a valid email.'; }
    else if (!message.value.trim()) { message.classList.add('invalid'); error = 'Please enter a message.'; }
    status.textContent = error || 'Signal received. The form is ready for a connected endpoint.';
    status.classList.toggle('is-error', Boolean(error));
    status.classList.toggle('is-success', !error);
  });
})();

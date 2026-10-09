/* Match-3 – Neon mücevherler, Canvas. 60 saniye + 15 hamle sınırı */
const Match3 = (() => {
  const N = 8, CS = 60, W = N * CS, HH = 64, H = W + HH;       // tahta 8x8, üstte HUD şeridi
  const MOVES = 15;            // en fazla 15 hamle
  const TIME = 60000;          // 60 saniye (ms)
  const INTRO = 2400;          // 3-2-1-BAŞLA geri sayımı (ms)
  const PTS_PER_WRGP = 120, MAX_REWARD = 15;
  const SP = CS * 1.5;         // sprite boyutu (parlama payı dahil)
  const GEMS = [
    { light: '#ffb3c6', base: '#ff2d63', dark: '#7a0525' },   // yakut (daire)
    { light: '#fff0a8', base: '#ffb800', dark: '#8a5200' },   // altın (elmas kesim)
    { light: '#b6ffd6', base: '#18e07a', dark: '#07613a' },   // zümrüt (sekizgen)
    { light: '#ffc9a0', base: '#ff7a1a', dark: '#8a3300' },   // kehribar (üçgen)
    { light: '#b8ecff', base: '#1ec8ff', dark: '#06578a' },   // safir (altıgen)
    { light: '#ecc4ff', base: '#b24dff', dark: '#4a1384' }    // ametist (yıldız)
  ];

  function poly(t, r) {
    const P = [];
    if (t === 0) { for (let i = 0; i < 16; i++) { const a = Math.PI * 2 * i / 16; P.push([Math.cos(a) * r, Math.sin(a) * r]); } }
    else if (t === 1) { [[-.55, -.9], [.55, -.9], [1, -.25], [0, 1.05], [-1, -.25]].forEach(p => P.push([p[0] * r, p[1] * r])); }
    else if (t === 2) { [[-.45, -.92], [.45, -.92], [.92, -.45], [.92, .45], [.45, .92], [-.45, .92], [-.92, .45], [-.92, -.45]].forEach(p => P.push([p[0] * r, p[1] * r])); }
    else if (t === 3) { [[0, -1.15], [1.05, .7], [-1.05, .7]].forEach(p => P.push([p[0] * r, p[1] * r])); }
    else if (t === 4) { for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i - Math.PI / 2; P.push([Math.cos(a) * r, Math.sin(a) * r]); } }
    else { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + Math.PI / 5 * i, rr = i % 2 ? r * .52 : r * 1.1; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); } }
    return P;
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  function start(cv, ui) {
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    const ctx = cv.getContext('2d');
    const modalEl = document.getElementById('modal');

    let grid = [], score = 0, disp = 0, moves = MOVES, timeLeft = TIME, intro = INTRO;
    let busy = false, over = false, alive = true, timeUp = false;
    let sel = null, drag = null, hint = null, lastAct = performance.now(), lastSec = 99;
    let parts = [], floats = [], rings = [], shake = 0, raf = 0, last = performance.now();
    const rnd = n => Math.floor(Math.random() * n);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const mk = (r, c, t, y) => ({ t, r, c, x: c * CS, y: y === undefined ? r * CS : y, s: 1, a: 1, dying: false, fall: false, vy: 0, sq: 0 });

    /* ---- Hazır görseller (sprite + arka plan) ---- */
    function makeSprite(t) {
      const c = document.createElement('canvas');
      c.width = c.height = Math.round(SP * DPR);
      const g = c.getContext('2d'); g.scale(DPR, DPR); g.translate(SP / 2, SP / 2);
      const G = GEMS[t], r = CS * .36, P = poly(t, r);
      const path = (pts, k) => { k = k || 1; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0] * k, p[1] * k) : g.moveTo(p[0] * k, p[1] * k)); g.closePath(); };
      g.lineJoin = 'round';
      g.shadowColor = G.base; g.shadowBlur = 14 * DPR;
      path(P);
      let gr = g.createLinearGradient(-r, -r, r, r);
      gr.addColorStop(0, G.light); gr.addColorStop(.45, G.base); gr.addColorStop(1, G.dark);
      g.fillStyle = gr; g.fill();
      g.shadowBlur = 0; g.shadowColor = 'transparent';
      g.lineWidth = 2.2; g.strokeStyle = G.light; path(P); g.stroke();
      const k = .55;
      g.lineWidth = 1.2; g.strokeStyle = 'rgba(255,255,255,.4)';
      P.forEach(p => { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] * k, p[1] * k); g.stroke(); });
      path(P, k);
      gr = g.createLinearGradient(-r * k, -r * k, r * k, r * k);
      gr.addColorStop(0, 'rgba(255,255,255,.65)'); gr.addColorStop(1, 'rgba(255,255,255,.05)');
      g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.stroke();
      g.beginPath(); g.ellipse(-r * .38, -r * .5, r * .3, r * .13, -.7, 0, 7); g.fillStyle = 'rgba(255,255,255,.85)'; g.fill();
      g.beginPath(); g.arc(r * .42, r * .45, r * .07, 0, 7); g.fillStyle = 'rgba(255,255,255,.6)'; g.fill();
      return c;
    }
    function makeBg() {
      const c = document.createElement('canvas'); c.width = Math.round(W * DPR); c.height = Math.round(H * DPR);
      const g = c.getContext('2d'); g.scale(DPR, DPR);
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#13214a'); bg.addColorStop(1, '#070b1a');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 45; i++) { g.fillStyle = 'rgba(160,210,255,' + (.08 + Math.random() * .25) + ')'; g.beginPath(); g.arc(Math.random() * W, Math.random() * H, .6 + Math.random() * 1.4, 0, 7); g.fill(); }
      rr(g, 8, 8, W - 16, HH - 14, 14); g.fillStyle = 'rgba(255,255,255,.05)'; g.fill(); g.strokeStyle = 'rgba(0,210,255,.4)'; g.lineWidth = 1.5; g.stroke();
      for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) {
        rr(g, q * CS + 2.5, HH + r * CS + 2.5, CS - 5, CS - 5, 11);
        g.fillStyle = (r + q) % 2 ? 'rgba(45,85,160,.38)' : 'rgba(18,36,84,.55)'; g.fill();
        g.strokeStyle = 'rgba(0,210,255,.14)'; g.lineWidth = 1; g.stroke();
      }
      return c;
    }
    const spr = GEMS.map((_, t) => makeSprite(t));
    const bgImg = makeBg();

    /* ---- Oyun mantığı ---- */
    function fill() {
      do {
        grid = [];
        for (let r = 0; r < N; r++) {
          grid[r] = [];
          for (let c = 0; c < N; c++) {
            let t;
            do { t = rnd(6); } while ((c > 1 && grid[r][c-1].t === t && grid[r][c-2].t === t) || (r > 1 && grid[r-1][c].t === t && grid[r-2][c].t === t));
            grid[r][c] = mk(r, c, t);
          }
        }
      } while (!findMove());
    }
    function sync() { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const g = grid[r][c]; if (g) { g.r = r; g.c = c; } } }
    function tSwap(r1, c1, r2, c2) { const t = grid[r1][c1]; grid[r1][c1] = grid[r2][c2]; grid[r2][c2] = t; }
    function matches() {
      const s = new Set();
      for (let r = 0; r < N; r++) {
        let run = 1;
        for (let c = 1; c <= N; c++) {
          if (c < N && grid[r][c].t === grid[r][c-1].t) run++;
          else { if (run >= 3) for (let k = 1; k <= run; k++) s.add(grid[r][c-k]); run = 1; }
        }
      }
      for (let c = 0; c < N; c++) {
        let run = 1;
        for (let r = 1; r <= N; r++) {
          if (r < N && grid[r][c].t === grid[r-1][c].t) run++;
          else { if (run >= 3) for (let k = 1; k <= run; k++) s.add(grid[r-k][c]); run = 1; }
        }
      }
      return s;
    }
    function findMove() {
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const r2 = r + dr, c2 = c + dc;
          if (r2 >= N || c2 >= N) continue;
          tSwap(r, c, r2, c2);
          const m = matches().size;
          tSwap(r, c, r2, c2);
          if (m) return [[r, c], [r2, c2]];
        }
      }
      return null;
    }
    async function reshuffle() {
      floats.push({ x: W / 2, y: W / 2, txt: 'Karıştırılıyor!', life: 1.6, size: 26 });
      let ok = false;
      while (!ok) {
        const ts = grid.flat().map(g => g.t);
        for (let i = ts.length - 1; i > 0; i--) { const j = rnd(i + 1); [ts[i], ts[j]] = [ts[j], ts[i]]; }
        let i = 0; grid.forEach(row => row.forEach(g => { g.t = ts[i++]; g.sq = .3; }));
        ok = matches().size === 0 && !!findMove();
      }
      await sleep(400);
    }
    function burst(g) {
      const col = GEMS[g.t].base, cx = g.x + CS / 2, cy = g.y + CS / 2;
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * 6.283, v = 1.5 + Math.random() * 5;
        parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, life: 1, col: i % 3 ? col : '#ffffff', sz: 2 + Math.random() * 4 });
      }
    }
    const hud = () => ui.hud(`Skor <b>${score}</b>`);

    async function resolve() {
      let combo = 0, m;
      while ((m = matches()).size) {
        combo++;
        const pts = m.size * 10 * combo + (m.size > 3 ? (m.size - 3) * 20 : 0);
        score += pts;
        let sx = 0, sy = 0;
        m.forEach(g => { g.dying = true; burst(g); sx += g.x; sy += g.y; });
        const mx = sx / m.size + CS / 2, my = sy / m.size + CS / 2;
        rings.push({ x: mx, y: my, r: 8, life: 1, col: GEMS[[...m][0].t].light });
        floats.push({ x: mx, y: my, txt: '+' + pts + (combo > 1 ? '  x' + combo + ' KOMBO!' : ''), life: 1, size: Math.min(36, 22 + combo * 3) });
        shake = Math.min(14, shake + 2 + combo * 2);
        haptic('light'); hud();
        await sleep(260); if (!alive) return;
        m.forEach(g => { grid[g.r][g.c] = null; });
        let maxCells = 1;
        for (let c = 0; c < N; c++) {
          let w = N - 1;
          for (let r = N - 1; r >= 0; r--) {
            if (grid[r][c]) { const g = grid[r][c]; grid[r][c] = null; grid[w][c] = g; if (w !== r) { g.fall = true; g.vy = 0; maxCells = Math.max(maxCells, w - r); } w--; }
          }
          let k = 0;
          for (let r = w; r >= 0; r--) { k++; const g = mk(r, c, rnd(6), -k * CS); g.fall = true; grid[r][c] = g; maxCells = Math.max(maxCells, r + k); }
        }
        sync();
        await sleep(Math.min(620, 250 + 50 * maxCells)); if (!alive) return;
      }
    }
    async function trySwap(r1, c1, r2, c2) {
      if (busy || over || timeUp || intro > 0) return;
      busy = true; hint = null; lastAct = performance.now();
      tSwap(r1, c1, r2, c2); sync();
      await sleep(190); if (!alive) return;
      if (matches().size === 0) {
        tSwap(r1, c1, r2, c2); sync();
        haptic('error');
        await sleep(190); if (!alive) return;
        busy = false; lastAct = performance.now(); return;
      }
      moves--; hud();
      await resolve(); if (!alive) return;
      if (moves <= 0) return finish('moves');
      if (!timeUp && !findMove()) await reshuffle();
      if (!alive) return;
      busy = false; lastAct = performance.now();
    }
    function finish(why) {
      if (!alive || over) return;
      over = true; busy = true; sel = null; hint = null;
      const reward = Math.min(MAX_REWARD, Math.floor(score / PTS_PER_WRGP));
      const used = MOVES - moves;
      ui.end({
        kind: 'm3', score, reward, win: reward > 0,
        title: why === 'time' ? '⏱ Süre Doldu!' : 'Hamlelerin Bitti!',
        lines: ['Skorun: <b>' + score + '</b>', 'Kullanılan hamle: ' + used + '/' + MOVES,
                'Ödül: ' + reward + ' WRGP (her ' + PTS_PER_WRGP + ' puan = 1 WRGP, en fazla ' + MAX_REWARD + ')']
      });
    }

    /* ---- Zaman ---- */
    function tick(dt, now) {
      if (over) return;
      if (intro > 0) { intro = Math.max(0, intro - dt); if (intro === 0) lastAct = now; return; }
      if (!modalEl.classList.contains('hidden')) return;          // çıkış onayı açıkken süre durur
      if (timeLeft > 0) {
        timeLeft = Math.max(0, timeLeft - dt);
        const sec = Math.ceil(timeLeft / 1000);
        if (sec !== lastSec) { lastSec = sec; if (sec <= 5 && sec > 0) haptic('medium'); }
      }
      if (timeLeft <= 0 && !timeUp) { timeUp = true; floats.push({ x: W / 2, y: W / 2, txt: 'SÜRE DOLDU!', life: 1.6, size: 34 }); }
      if (timeUp && !busy) { finish('time'); return; }
      if (!busy && !hint && now - lastAct > 5000) hint = findMove();
    }

    /* ---- Çizim ---- */
    function update() {
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const g = grid[r][c]; if (!g) continue;
        const tx = c * CS, ty = r * CS;
        if (g.fall) {
          g.vy = Math.min(34, g.vy + 2.6); g.y += g.vy; g.x += (tx - g.x) * .3;
          if (g.y >= ty) { g.y = ty; g.x = tx; if (g.vy > 8) g.sq = .22; g.vy = 0; g.fall = false; }
        } else {
          g.x += (tx - g.x) * .3; g.y += (ty - g.y) * .3;
          if (Math.abs(tx - g.x) < .5) g.x = tx;
          if (Math.abs(ty - g.y) < .5) g.y = ty;
        }
        if (g.sq > 0) g.sq = g.sq > .01 ? g.sq * .8 : 0;
        if (g.dying) { g.s += .05; g.a -= .09; }
      }
      parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .15; p.life -= .03; });
      parts = parts.filter(p => p.life > 0);
      rings.forEach(q => { q.r += 4.5; q.life -= .05; });
      rings = rings.filter(q => q.life > 0);
      floats.forEach(f => { f.y -= .8; f.life -= .018; });
      floats = floats.filter(f => f.life > 0);
      shake *= .85; if (shake < .4) shake = 0;
    }
    function drawGem(g, now) {
      if (g.a <= 0) return;
      let sx = g.s, sy = g.s;
      if (g.sq > .01) { sy = g.s * (1 - g.sq); sx = g.s * (1 + g.sq * .6); }
      if (sel && sel.r === g.r && sel.c === g.c) { const p = 1 + .07 * Math.sin(now / 110); sx *= p; sy *= p; }
      const cx = g.x + CS / 2, cy = g.y + CS / 2 + g.sq * CS * .18;
      ctx.globalAlpha = Math.max(0, Math.min(1, g.a));
      ctx.drawImage(spr[g.t], cx - SP * sx / 2, cy - SP * sy / 2, SP * sx, SP * sy);
      ctx.globalAlpha = 1;
    }
    function drawHud() {
      disp += (score - disp) * .15; if (Math.abs(score - disp) < 1) disp = score;
      const secs = Math.ceil(timeLeft / 1000), low = timeLeft < 10000;
      const pulse = low && !over ? .6 + .4 * Math.sin(performance.now() / 120) : 1;
      ctx.textBaseline = 'alphabetic';
      ctx.font = '600 11px Segoe UI, sans-serif'; ctx.fillStyle = '#7fa6d6';
      ctx.textAlign = 'left'; ctx.fillText('SKOR', 26, 26);
      ctx.textAlign = 'center'; ctx.fillText('HAMLE', W / 2, 26);
      ctx.textAlign = 'right'; ctx.fillText('SÜRE', W - 26, 26);
      ctx.font = 'bold 24px Segoe UI, sans-serif';
      ctx.textAlign = 'left'; ctx.fillStyle = '#ffd700'; ctx.fillText(Math.round(disp), 26, 50);
      ctx.textAlign = 'center'; ctx.fillStyle = moves <= 3 ? '#ff5a7a' : '#ffffff'; ctx.fillText(moves + ' / ' + MOVES, W / 2, 50);
      ctx.textAlign = 'right'; ctx.globalAlpha = pulse;
      ctx.fillStyle = low ? '#ff5a7a' : (timeLeft < 20000 ? '#ffb347' : '#00d2ff');
      ctx.fillText(Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'), W - 26, 50);
      ctx.globalAlpha = 1;
      // süre çubuğu
      const f = Math.max(0, timeLeft / TIME);
      rr(ctx, 8, HH - 5, W - 16, 5, 2.5); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fill();
      if (f > 0) {
        const col = low ? '#ff5a7a' : (timeLeft < 20000 ? '#ffb347' : '#00d2ff');
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 8;
        rr(ctx, 8, HH - 5, Math.max(5, (W - 16) * f), 5, 2.5); ctx.fillStyle = col; ctx.fill(); ctx.restore();
      }
    }
    function draw(now) {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(bgImg, 0, 0, W, H);
      drawHud();
      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake);
      ctx.beginPath(); ctx.rect(0, HH, W, W); ctx.clip();
      ctx.translate(0, HH);
      if (hint && !busy) {
        const a = .35 + .4 * Math.sin(now / 200);
        ctx.strokeStyle = 'rgba(255,215,0,' + a + ')'; ctx.lineWidth = 3;
        hint.forEach(h => { rr(ctx, h[1] * CS + 4, h[0] * CS + 4, CS - 8, CS - 8, 10); ctx.stroke(); });
      }
      if (sel) {
        ctx.save(); ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 14; ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
        rr(ctx, sel.c * CS + 3, sel.r * CS + 3, CS - 6, CS - 6, 11); ctx.stroke(); ctx.restore();
      }
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c]) drawGem(grid[r][c], now);
      ctx.globalCompositeOperation = 'lighter';
      rings.forEach(q => { ctx.globalAlpha = Math.max(0, q.life); ctx.strokeStyle = q.col; ctx.lineWidth = 4 * q.life + 1; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 7); ctx.stroke(); });
      parts.forEach(p => { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.5, p.sz * p.life), 0, 7); ctx.fill(); });
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.restore();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      floats.forEach(f => {
        ctx.font = 'bold ' + (f.size || 22) + 'px Segoe UI, sans-serif';
        ctx.globalAlpha = Math.max(0, Math.min(1, f.life)); ctx.lineWidth = 5; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round';
        ctx.strokeText(f.txt, f.x, f.y + HH); ctx.fillStyle = '#ffd700'; ctx.fillText(f.txt, f.x, f.y + HH);
      });
      ctx.globalAlpha = 1;
      if (intro > 0) {
        ctx.fillStyle = 'rgba(4,8,20,.55)'; ctx.fillRect(0, HH, W, W);
        const el = INTRO - intro, step = Math.min(3, Math.floor(el / 600)), p = (el % 600) / 600;
        const txt = ['3', '2', '1', 'BAŞLA!'][step], sc = 1.5 - .5 * Math.min(1, p * 2);
        ctx.save(); ctx.translate(W / 2, HH + W / 2); ctx.scale(sc, sc);
        ctx.font = 'bold 84px Segoe UI, sans-serif'; ctx.shadowColor = '#00d2ff'; ctx.shadowBlur = 24;
        ctx.globalAlpha = 1 - Math.max(0, (p - .75) * 3);
        ctx.fillStyle = '#ffffff'; ctx.fillText(txt, 0, 0); ctx.restore();
        ctx.globalAlpha = 1;
      }
    }
    function loop(now) {
      if (!alive) return;
      now = now || performance.now();
      const dt = Math.min(100, now - last); last = now;
      tick(dt, now); update(); draw(now);
      raf = requestAnimationFrame(loop);
    }

    /* ---- Girdi ---- */
    function cell(e) {
      const b = cv.getBoundingClientRect();
      return [Math.floor(((e.clientY - b.top) * H / b.height - HH) / CS), Math.floor((e.clientX - b.left) * W / b.width / CS)];
    }
    const locked = () => busy || over || timeUp || intro > 0;
    cv.onpointerdown = e => {
      if (locked()) return;
      const [r, c] = cell(e);
      if (r < 0 || c < 0 || r >= N || c >= N) return;
      hint = null; lastAct = performance.now();
      if (sel && Math.abs(sel.r - r) + Math.abs(sel.c - c) === 1) { const s = sel; sel = null; drag = null; trySwap(s.r, s.c, r, c); return; }
      sel = { r, c }; drag = { x: e.clientX, y: e.clientY, r, c };
      try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    };
    cv.onpointermove = e => {
      if (!drag || locked()) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < cv.getBoundingClientRect().width / N * .35) return;
      let r = drag.r, c = drag.c;
      if (Math.abs(dx) > Math.abs(dy)) c += dx > 0 ? 1 : -1; else r += dy > 0 ? 1 : -1;
      const d = drag; drag = null; sel = null;
      if (r >= 0 && c >= 0 && r < N && c < N) trySwap(d.r, d.c, r, c);
    };
    cv.onpointerup = cv.onpointercancel = () => { drag = null; };

    fill(); hud();
    ui.hint('Taşa dokun, komşusuna sürükle • 3+ aynı taşı eşleştir • 15 hamle ve 60 saniyen var');
    raf = requestAnimationFrame(loop);
    return { stop() { alive = false; cancelAnimationFrame(raf); cv.onpointerdown = cv.onpointermove = cv.onpointerup = cv.onpointercancel = null; } };
  }
  return { start };
})();

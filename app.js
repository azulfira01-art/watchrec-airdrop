/* WatchRec Game Center – uygulama mantığı */
const BOT = 'WatchRecGameBot';
const ADSGRAM_BLOCK_ID = 'BURAYA_ADSGRAM_BLOCK_ID';   // adsgram.ai panelinden alacağın blok ID
const MAX_LIVES = 5, LIFE_REGEN_MS = 30 * 60 * 1000;   // 30 dk'da 1 can
const AD_WRGP = 9;                                    // can fullken reklam ödülü
const DAILY = [10, 15, 20, 30, 40, 60, 100];
const DAY = 86400000;
const MAX_WRGP = 999999999;                           // en fazla bakiye
// 1234567 -> 1.234.567 (3 basamakta bir nokta)
const fmt = n => String(Math.max(0, Math.floor(Number(n) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const clampW = n => Math.min(MAX_WRGP, Math.max(0, Math.floor(Number(n) || 0)));

const tg = window.Telegram && Telegram.WebApp;
if (tg) { try { tg.ready(); tg.expand(); tg.setHeaderColor('#080c16'); tg.setBackgroundColor('#04060d'); } catch (_) {} }
function haptic(t) {
  try {
    if (!tg || !tg.HapticFeedback) return;
    if (t === 'error') tg.HapticFeedback.notificationOccurred('error');
    else tg.HapticFeedback.impactOccurred(t || 'light');
  } catch (_) {}
}
const $ = s => document.querySelector(s);
const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || null;
const USER_ID = tgUser ? tgUser.id : 'demo';
const TG_NAME = tgUser ? (tgUser.first_name || tgUser.username || '') : '';
const getName = () => TG_NAME || tl('you_name');
const KEY = 'wrgp_state_' + USER_ID;

/* ---------- Durum (localStorage) ---------- */
const def = { wrgp: 100, lives: MAX_LIVES, lastRegen: Date.now(), streak: 0, lastClaim: 0, best: { m3: 0, vf: 0 }, invited: 0, refDone: false };
let S;
try { S = Object.assign({}, def, JSON.parse(localStorage.getItem(KEY) || '{}')); S.best = Object.assign({}, def.best, S.best); } catch (_) { S = Object.assign({}, def); }
S.wrgp = clampW(S.wrgp);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} };

function regen() {
  if (S.lives >= MAX_LIVES) { S.lastRegen = Date.now(); return; }
  const n = Math.floor((Date.now() - S.lastRegen) / LIFE_REGEN_MS);
  if (n > 0) { S.lives = Math.min(MAX_LIVES, S.lives + n); S.lastRegen = S.lives >= MAX_LIVES ? Date.now() : S.lastRegen + n * LIFE_REGEN_MS; save(); }
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
function render() {
  regen();
  $('#bal').textContent = fmt(S.wrgp);
  $('#lives').textContent = S.lives;
  $('#bestM3').textContent = S.best.m3;
  $('#bestVF').textContent = S.best.vf;
  $('#invCount').textContent = S.invited;
  const out = S.lives <= 0;
  document.querySelectorAll('[data-play]').forEach(b => b.disabled = out);
  const full = S.lives >= MAX_LIVES;
  $('#adBtn').disabled = full;
  $('#adWrgpBtn').disabled = !full;
  const left = LIFE_REGEN_MS - (Date.now() - S.lastRegen);
  $('#lifeTimer').textContent = S.lives >= MAX_LIVES ? tl('life_full') : tl('life_next', { m: Math.max(0, Math.floor(left / 60000)), s: Math.max(0, Math.floor(left / 1000) % 60) });
  renderDaily();
}
setInterval(render, 1000);

/* ---------- Sekmeler ---------- */
document.querySelectorAll('.nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + b.dataset.tab));
  if (b.dataset.tab === 'board') renderBoard();
  haptic('light');
});

/* ---------- Günlük ödül ---------- */
const dayNo = ts => Math.floor((ts - new Date(ts).getTimezoneOffset() * 60000) / DAY);
function dailyState() {
  const today = dayNo(Date.now());
  if (!S.lastClaim) return { next: 0, can: true };
  const diff = today - dayNo(S.lastClaim);
  if (diff === 0) return { next: S.streak % 7, can: false };
  if (diff === 1) return { next: S.streak % 7, can: true };
  return { next: 0, can: true };            // gün atlandı → seri sıfırlanır
}
function renderDaily() {
  const st = dailyState(), box = $('#streak');
  const doneCount = st.can ? st.next : (S.streak % 7 || 7);
  box.innerHTML = DAILY.map((v, i) => `<div class="day ${i < doneCount ? 'done' : (st.can && i === st.next ? 'now' : '')}">${tl('day', { n: i + 1 })}<b>+${v}</b></div>`).join('');
  const b = $('#claimBtn');
  b.disabled = !st.can;
  b.textContent = st.can ? tl('claim', { n: DAILY[st.next] }) : tl('come_back');
}
$('#claimBtn').onclick = () => {
  const st = dailyState(); if (!st.can) return;
  S.streak = st.next + 1; S.lastClaim = Date.now(); S.wrgp = clampW(S.wrgp + DAILY[st.next]); save();
  haptic('light'); render();
  modal(`<h2>${tl('daily_modal')}</h2><div class="reward">+${DAILY[st.next]} WRGP</div><p>${tl('streak_msg', { n: S.streak })}</p><button class="btn primary" onclick="closeModal()">${tl('great')}</button>`);
};

/* ---------- Davet ---------- */
const refLink = `https://t.me/${BOT}?start=ref_${USER_ID}`;
$('#refLink').textContent = refLink;
$('#copyBtn').onclick = async () => {
  try { await navigator.clipboard.writeText(refLink); } catch (_) {
    const r = document.createRange(); r.selectNode($('#refLink')); getSelection().removeAllRanges(); getSelection().addRange(r); try { document.execCommand('copy'); } catch (_) {}
  }
  toast(tl('copied'));
};
$('#shareBtn').onclick = () => {
  const url = 'https://t.me/share/url?url=' + encodeURIComponent(refLink) + '&text=' + encodeURIComponent(tl('share_text'));
  if (tg && tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
};
/* Yeni kullanıcı bir davet linkiyle geldiyse: SADECE BİLDİRİM. +50 ödülü sunucu tarafında verilmelidir. */
(function () {
  const sp = tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param;
  if (sp && sp.startsWith('ref_') && !S.refDone) { S.refDone = true; S.referrer = sp.slice(4); save(); /* TODO: fetch('/api/referral', {initData: tg.initData}) */ }
})();

/* ---------- Liderlik ---------- */
function renderBoard() {
  const bots = [['CryptoKral', 5230], ['AlpTekin', 3810], ['Selin_07', 2975], ['NeonWolf', 2140], ['BerkTR', 1620], ['Zeynep', 1180], ['GamerX', 790], ['Mert34', 455]];
  const list = bots.concat([[getName(), S.wrgp, true]]).sort((a, b) => b[1] - a[1]);
  const medal = ['🥇', '🥈', '🥉'];
  $('#boardList').innerHTML = list.map((p, i) => `<div class="lb ${p[2] ? 'me' : ''}"><span class="rk">${medal[i] || (i + 1)}</span><span class="nm">${esc(p[0])}${p[2] && TG_NAME ? ' ' + tl('you') : ''}</span><span class="sc">${fmt(p[1])}</span></div>`).join('')
    + '<p class="muted" style="margin-top:10px">' + tl('board_note') + '</p>';
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Modal ---------- */
function modal(html) { $('#modalBox').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); }
window.closeModal = closeModal;

/* ---------- Reklam (AdsGram) ---------- */
let adBusy = false;
async function watchAd(onDone) {
  if (adBusy) return;
  adBusy = true;
  try {
    if (!window.Adsgram || ADSGRAM_BLOCK_ID.startsWith('BURAYA')) throw new Error('no-ads');
    const ctl = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
    await ctl.show();               // reklam sonuna kadar izlenmezse hata fırlatır
    onDone();
  } catch (e) {
    toast(e && e.message === 'no-ads' ? tl('ad_none') : tl('ad_fail'));
  }
  adBusy = false;
}
/* Buton 1: can 5'ten azsa aktif → +1 can */
$('#adBtn').onclick = () => {
  if (S.lives >= MAX_LIVES) return;
  watchAd(() => { S.lives = Math.min(MAX_LIVES, S.lives + 1); save(); render(); toast(tl('got_life')); });
};
/* Buton 2: yalnızca can 5/5 iken aktif → +9 WRGP */
$('#adWrgpBtn').onclick = () => {
  if (S.lives < MAX_LIVES) return;
  watchAd(() => { S.wrgp = clampW(S.wrgp + AD_WRGP); save(); render(); toast(tl('got_wrgp', { n: AD_WRGP })); });
};

/* ---------- Oyun yöneticisi ---------- */
let cur = null;
const ui = {
  hud: h => { $('#gInfo').innerHTML = h; },
  hint: h => { $('#gHint').textContent = h; },
  end: r => {
    if (r.reward > 0) S.wrgp = clampW(S.wrgp + r.reward);
    if (r.score > S.best[r.kind]) S.best[r.kind] = r.score;
    save(); render();
    modal(`<h2>${r.title}</h2><p>${r.lines.join('<br>')}</p><div class="reward">+${r.reward} WRGP</div>
      <button class="btn primary" onclick="closeModal();startGame('${r.kind}')" ${S.lives <= 0 ? 'disabled' : ''}>${tl('again')}</button>
      <button class="btn" onclick="closeModal();quitGame()">${tl('to_menu')}</button>`);
  }
};
function fitCanvas() {
  const st = $('#gstage'), cv = $('#cv');
  const ar = cv.width / cv.height, aw = st.clientWidth - 16, ah = st.clientHeight - 16;
  let w = aw, h = w / ar; if (h > ah) { h = ah; w = h * ar; }
  cv.style.width = Math.floor(w) + 'px'; cv.style.height = Math.floor(h) + 'px';
}
window.startGame = function (kind) {
  regen();
  if (S.lives <= 0) { toast(tl('no_lives')); return; }
  quitGame(true);
  S.lives--; S.lastRegen = S.lives === MAX_LIVES - 1 ? Date.now() : S.lastRegen; save(); render();
  $('#game').classList.remove('hidden');
  $('#gTitle').textContent = kind === 'm3' ? '💎 Match-3' : '📐 Volfied';
  const cv = $('#cv');
  // yeni canvas (eski olay dinleyicileri temizlensin)
  const nc = cv.cloneNode(false); cv.parentNode.replaceChild(nc, cv);
  cur = (kind === 'm3' ? Match3 : Volfied).start(nc, ui);
  fitCanvas();
};
window.quitGame = function (silent) {
  if (cur) { cur.stop(); cur = null; }
  $('#game').classList.add('hidden');
};
$('#gQuit').onclick = () => {
  modal(`<h2>${tl('quit_title')}</h2><p>${tl('quit_msg')}</p>
    <button class="btn" onclick="closeModal()">${tl('keep')}</button>
    <button class="btn" style="border-color:#ff5a7a;color:#ff5a7a" onclick="closeModal();quitGame()">${tl('quit')}</button>`);
};
document.querySelectorAll('[data-play]').forEach(b => b.onclick = () => startGame(b.dataset.play));
window.addEventListener('resize', () => { if (cur) fitCanvas(); });

/* ---------- Dil seçici ---------- */
(function () {
  const sel = $('#langSel');
  sel.innerHTML = LANGS.map(l => `<option value="${l[0]}">${l[1]}</option>`).join('');
  sel.value = LANG;
  sel.onchange = () => {
    setLang(sel.value);
    render();
    if ($('#tab-board').classList.contains('active')) renderBoard();
    haptic('light');
  };
  applyI18n();
  render();
})();

/* WatchRec Game Center – uygulama mantığı */
const BOT = 'WatchRecGameBot';
const ADSGRAM_BLOCK_ID = 'BURAYA_ADSGRAM_BLOCK_ID';   // adsgram.ai panelinden alacağın blok ID

// --- SUPABASE VERİTABANI BAĞLANTISI ---
const SUPABASE_URL = "https://mwyywojglxrpnqqscumi.supabase.co";
const SUPABASE_KEY = "sb_publishable_L25Sbpm9k65CZFT_a9PdOQ_mcED2ENY"; // Supabase'den aldığın Publishable Key

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (e) {
    console.error("Supabase başlatılamadı:", e);
  }
}

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
const USER_ID = tgUser ? tgUser.id : ('demo_' + Math.floor(Math.random() * 100000));
const NAME = tgUser ? (tgUser.username ? `@${tgUser.username}` : (tgUser.first_name || 'Oyuncu')) : 'Oyuncu';
const KEY = 'wrgp_state_' + USER_ID;

/* ---------- Durum (localStorage) ---------- */
const def = { wrgp: 100, lives: MAX_LIVES, lastRegen: Date.now(), streak: 0, lastClaim: 0, best: { m3: 0, vf: 0 }, invited: 0, refDone: false };
let S;
try { S = Object.assign({}, def, JSON.parse(localStorage.getItem(KEY) || '{}')); S.best = Object.assign({}, def.best, S.best); } catch (_) { S = Object.assign({}, def); }
S.wrgp = clampW(S.wrgp);

const save = () => { 
  try { 
    localStorage.setItem(KEY, JSON.stringify(S)); 
    saveScoreToDatabase(S.wrgp);
  } catch (_) {} 
};

function regen() {
  if (S.lives >= MAX_LIVES) { S.lastRegen = Date.now(); return; }
  const n = Math.floor((Date.now() - S.lastRegen) / LIFE_REGEN_MS);
  if (n > 0) { S.lives = Math.min(MAX_LIVES, S.lives + n); S.lastRegen = S.lives >= MAX_LIVES ? Date.now() : S.lastRegen + n * LIFE_REGEN_MS; save(); }
}
function toast(msg) { const t = $('#toast'); if (t) { t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); } }

function render() {
  regen();
  if ($('#bal')) $('#bal').textContent = fmt(S.wrgp);
  if ($('#lives')) $('#lives').textContent = S.lives;
  if ($('#bestM3')) $('#bestM3').textContent = S.best.m3;
  if ($('#bestVF')) $('#bestVF').textContent = S.best.vf;
  if ($('#invCount')) $('#invCount').textContent = S.invited;
  const out = S.lives <= 0;
  document.querySelectorAll('[data-play]').forEach(b => b.disabled = out);
  const full = S.lives >= MAX_LIVES;
  if ($('#adBtn')) $('#adBtn').disabled = full;
  if ($('#adWrgpBtn')) $('#adWrgpBtn').disabled = !full;
  const left = LIFE_REGEN_MS - (Date.now() - S.lastRegen);
  if ($('#lifeTimer')) $('#lifeTimer').textContent = S.lives >= MAX_LIVES ? 'Canların dolu ✅' : `Sonraki can: ${Math.max(0, Math.floor(left / 60000))} dk ${Math.max(0, Math.floor(left / 1000) % 60)} sn`;
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
  return { next: 0, can: true };
}
function renderDaily() {
  const st = dailyState(), box = $('#streak');
  if (!box) return;
  const doneCount = st.can ? st.next : (S.streak % 7 || 7);
  box.innerHTML = DAILY.map((v, i) => `<div class="day ${i < doneCount ? 'done' : (st.can && i === st.next ? 'now' : '')}">G${i + 1}<b>+${v}</b></div>`).join('');
  const b = $('#claimBtn');
  if (b) {
    b.disabled = !st.can;
    b.textContent = st.can ? `Ödülü Al (+${DAILY[st.next]} WRGP)` : 'Yarın tekrar gel ⏳';
  }
}
if ($('#claimBtn')) {
  $('#claimBtn').onclick = () => {
    const st = dailyState(); if (!st.can) return;
    S.streak = st.next + 1; S.lastClaim = Date.now(); S.wrgp = clampW(S.wrgp + DAILY[st.next]); save();
    haptic('light'); render();
    modal(`<h2>🎁 Günlük Ödül</h2><div class="reward">+${DAILY[st.next]} WRGP</div><p>${S.streak}. gün serisi!</p><button class="btn primary" onclick="closeModal()">Harika</button>`);
  };
}

/* ---------- Davet ---------- */
const refLink = `https://t.me/${BOT}?start=ref_${USER_ID}`;
if ($('#refLink')) $('#refLink').textContent = refLink;
if ($('#copyBtn')) {
  $('#copyBtn').onclick = async () => {
    try { await navigator.clipboard.writeText(refLink); } catch (_) {
      const r = document.createRange(); r.selectNode($('#refLink')); getSelection().removeAllRanges(); getSelection().addRange(r); try { document.execCommand('copy'); } catch (_) {}
    }
    toast('Link kopyalandı ✅');
  };
}
if ($('#shareBtn')) {
  $('#shareBtn').onclick = () => {
    const url = 'https://t.me/share/url?url=' + encodeURIComponent(refLink) + '&text=' + encodeURIComponent('WatchRec oyunlarını oyna, WRGP kazan! 🎮');
    if (tg && tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
  };
}

(function () {
  const sp = tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param;
  if (sp && sp.startsWith('ref_') && !S.refDone) { S.refDone = true; S.referrer = sp.slice(4); save(); }
})();

/* ---------- Liderlik (Veritabanı Entegrasyonu) ---------- */
async function saveScoreToDatabase(score) {
  if (!supabaseClient) return;
  try {
    await supabaseClient
      .from('players')
      .upsert({
        telegram_id: typeof USER_ID === 'number' ? USER_ID : 999999,
        username: NAME,
        first_name: tgUser?.first_name || NAME,
        wrgp_score: score,
        updated_at: new Date()
      }, { onConflict: 'telegram_id' });
  } catch (err) {
    console.error("Veritabanı güncelleme hatası:", err);
  }
}

async function renderBoard() {
  const boardList = $('#boardList');
  if (!boardList) return;

  boardList.innerHTML = '<p class="muted">Sıralama yükleniyor...</p>';

  if (!supabaseClient) {
    boardList.innerHTML = '<p class="muted">Veritabanı bağlantısı yok.</p>';
    return;
  }

  try {
    // Veritabanından skora göre en yüksek 10 oyuncuyu çek
    const { data: players, error } = await supabaseClient
      .from('players')
      .select('username, wrgp_score, telegram_id')
      .order('wrgp_score', { ascending: false })
      .limit(10);

    if (error || !players || players.length === 0) {
      boardList.innerHTML = '<p class="muted">Henüz kayıtlı oyuncu yok.</p>';
      return;
    }

    const medal = ['🥇', '🥈', '🥉'];
    boardList.innerHTML = players.map((p, i) => {
      const isMe = (p.telegram_id === USER_ID || p.username === NAME);
      return `<div class="lb ${isMe ? 'me' : ''}">
        <span class="rk">${medal[i] || (i + 1)}</span>
        <span class="nm">${esc(p.username)}${isMe ? ' (sen)' : ''}</span>
        <span class="sc">${fmt(p.wrgp_score)}</span>
      </div>`;
    }).join('');

  } catch (err) {
    console.error("Sıralama yüklenemedi:", err);
    boardList.innerHTML = '<p class="muted">Sıralama yüklenirken bir hata oluştu.</p>';
  }
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
    await ctl.show();
    onDone();
  } catch (e) {
    toast(e && e.message === 'no-ads' ? 'Reklam henüz ayarlanmadı (Block ID gerekli)' : 'Reklam tamamlanmadı, ödül verilmedi');
  }
  adBusy = false;
}

if ($('#adBtn')) {
  $('#adBtn').onclick = () => {
    if (S.lives >= MAX_LIVES) return;
    watchAd(() => { S.lives = Math.min(MAX_LIVES, S.lives + 1); save(); render(); toast('+1 ❤️ kazandın!'); });
  };
}

if ($('#adWrgpBtn')) {
  $('#adWrgpBtn').onclick = () => {
    if (S.lives < MAX_LIVES) return;
    watchAd(() => { S.wrgp = clampW(S.wrgp + AD_WRGP); save(); render(); toast('+' + AD_WRGP + ' WRGP kazandın! 🪙'); });
  };
}

/* ---------- Oyun Yöneticisi ---------- */
let cur = null;
const ui = {
  hud: h => { if ($('#gInfo')) $('#gInfo').innerHTML = h; },
  hint: h => { if ($('#gHint')) $('#gHint').textContent = h; },
  end: r => {
    if (r.reward > 0) S.wrgp = clampW(S.wrgp + r.reward);
    if (r.score > S.best[r.kind]) S.best[r.kind] = r.score;
    save(); render();
    modal(`<h2>${r.title}</h2><p>${r.lines.join('<br>')}</p><div class="reward">+${r.reward} WRGP</div>
      <button class="btn primary" onclick="closeModal();startGame('${r.kind}')" ${S.lives <= 0 ? 'disabled' : ''}>Tekrar Oyna (1 ❤️)</button>
      <button class="btn" onclick="closeModal();quitGame()">Menüye Dön</button>`);
  }
};

function fitCanvas() {
  const st = $('#gstage'), cv = $('#cv');
  if (!st || !cv) return;
  const ar = cv.width / cv.height, aw = st.clientWidth - 16, ah = st.clientHeight - 16;
  let w = aw, h = w / ar; if (h > ah) { h = ah; w = h * ar; }
  cv.style.width = Math.floor(w) + 'px'; cv.style.height = Math.floor(h) + 'px';
}

window.startGame = function (kind) {
  regen();
  if (S.lives <= 0) { toast('Canın bitti! Reklam izle veya bekle.'); return; }
  quitGame(true);
  S.lives--; S.lastRegen = S.lives === MAX_LIVES - 1 ? Date.now() : S.lastRegen; save(); render();
  if ($('#game')) $('#game').classList.remove('hidden');
  if ($('#gTitle')) $('#gTitle').textContent = kind === 'm3' ? '💎 Match-3' : '📐 Volfied';
  const cv = $('#cv');
  if (cv) {
    const nc = cv.cloneNode(false); cv.parentNode.replaceChild(nc, cv);
    cur = (kind === 'm3' ? Match3 : Volfied).start(nc, ui);
    fitCanvas();
  }
};

window.quitGame = function (silent) {
  if (cur) { cur.stop(); cur = null; }
  if ($('#game')) $('#game').classList.add('hidden');
};

if ($('#gQuit')) {
  $('#gQuit').onclick = () => {
    modal(`<h2>Çıkılsın mı?</h2><p>Şimdi çıkarsan harcanan can ve ilerleme kaybolur.</p>
      <button class="btn" onclick="closeModal()">Devam Et</button>
      <button class="btn" style="border-color:#ff5a7a;color:#ff5a7a" onclick="closeModal();quitGame()">Çık</button>`);
  };
}

document.querySelectorAll('[data-play]').forEach(b => b.onclick = () => startGame(b.dataset.play));
window.addEventListener('resize', () => { if (cur) fitCanvas(); });

// Başlangıç çalıştırması
saveScoreToDatabase(S.wrgp);
render();

/* WatchRec – çoklu dil (i18n): en, tr, ru, zh, ko, es */
const LANGS = [['en', 'English'], ['tr', 'Türkçe'], ['ru', 'Русский'], ['zh', '中文'], ['ko', '한국어'], ['es', 'Español']];
const I18N = {};
I18N.en = {
  nav_games: 'Games', nav_daily: 'Daily', nav_invite: 'Invite', nav_board: 'Ranking',
  m3_title: '💎 Match-3 Duel',
  m3_desc: 'Drag gems to match 3 or more of the same shape. You have 60 seconds and 15 moves — get the highest score!',
  m3_meta: "Best: <b id='bestM3'>0</b> pts · Reward: up to 15 WRGP",
  vf_title: '📐 Volfied (Area Capture)',
  vf_desc: '10 space levels, each with creatures and a boss. Draw lines to claim territory; any creature trapped in a small area dies. Claim 70% of the map in 60 seconds!',
  vf_meta: "Best: <b id='bestVF'>0</b> pts · Reward: 2 WRGP per level, +10 for finishing all 10",
  play: 'PLAY · 1 ❤️',
  ad_life: '📺 Watch Ad (+1 Life)', ad_wrgp: '🪙 Lives Full! Watch Ad (+9 WRGP)',
  life_full: 'Lives full ✅', life_next: 'Next life: {m} min {s} sec',
  daily_title: '🎁 Daily Reward Streak', daily_desc: 'Log in every day to keep your streak. If you skip a day, it resets to day 1.',
  claim: 'Claim (+{n} WRGP)', come_back: 'Come back tomorrow ⏳', day: 'D{n}',
  daily_modal: '🎁 Daily Reward', streak_msg: 'Day {n} streak!', great: 'Awesome',
  inv_title: '👥 Invite & Earn', inv_desc: "You earn <b class='goldtxt'>+50 WRGP</b> for every friend you invite.",
  copy: '📋 Copy', share: '📤 Share', inv_count: "Friends invited: <b id='invCount'>0</b>",
  copied: 'Link copied ✅', share_text: 'Play WatchRec games and earn WRGP! 🎮',
  board_title: '🏆 Leaderboard', you: '(you)', you_name: 'You',
  board_note: 'Note: the other players are sample data. A real leaderboard needs a server (database).',
  ad_none: 'Ads are not set up yet (Block ID required)', ad_fail: 'Ad not completed, no reward given',
  got_life: '+1 ❤️ earned!', got_wrgp: '+{n} WRGP earned! 🪙',
  again: 'Play Again (1 ❤️)', to_menu: 'Back to Menu', no_lives: 'Out of lives! Watch an ad or wait.',
  quit_title: 'Quit?', quit_msg: 'If you quit now, the spent life and your progress are lost.', keep: 'Keep Playing', quit: 'Quit',
  lang_title: '🌐 Language',
  score_u: 'SCORE', moves_u: 'MOVES', time_u: 'TIME', score: 'Score', shuffling: 'Shuffling!', time_up_big: "TIME'S UP!",
  combo: 'x{n} COMBO!', go: 'GO!', time_up: "⏱ Time's Up!", moves_out: 'Out of Moves!',
  m3_l1: 'Your score: <b>{s}</b>', m3_l2: 'Moves used: {u}/{m}', m3_l3: 'Reward: {r} WRGP (every {p} points = 1 WRGP, max {x})',
  m3_hint: 'Tap a gem and drag it to a neighbor • match 3+ of the same gem • 15 moves and 60 seconds',
  boss_killed: 'BOSS DESTROYED!', killed: 'DESTROYED', level_of: 'LEVEL {a} / {b}', boss_lbl: '👹 Boss: {n}',
  goal: 'Claim 70% of the area in 60 seconds', level_done: 'LEVEL COMPLETE!', time_bonus: 'Time bonus +{b} · +1 ❤️', next: 'Next: {n}',
  vf_win: '🏆 All Levels Complete!', lives_out: 'Out of Lives!',
  vf_l1: 'Levels completed: <b>{c}/{n}</b>', vf_l2: 'Final area: <b>{p}%</b>', vf_l3: 'Score: <b>{s}</b>',
  vf_l4: 'Reward: {r} WRGP (2 per level{f})', vf_final: ' + 10 final bonus',
  vf_hint: 'Swipe (or arrow keys) • draw a line from the edge into open space • creatures trapped in a small area die • 60 sec per level'
};
I18N.tr = {
  nav_games: 'Oyunlar', nav_daily: 'Günlük', nav_invite: 'Davet', nav_board: 'Sıralama',
  m3_title: '💎 Match-3 Düello',
  m3_desc: 'Taşları sürükle, 3 veya daha fazla aynı şekli eşleştir. 60 saniye ve 15 hamlen var, en yüksek skoru yap!',
  m3_meta: "Rekor: <b id='bestM3'>0</b> puan · Ödül: en fazla 15 WRGP",
  vf_title: '📐 Volfied (Çizmeci)',
  vf_desc: "10 uzay bölümü, her bölümde yaratıklar ve bir canavar. Çizgi çekip alanı kapat; küçük alanda sıkışan yaratık ölür. 60 saniyede haritanın %70'ini kapat!",
  vf_meta: "Rekor: <b id='bestVF'>0</b> puan · Ödül: bölüm başı 2 WRGP, 10 bölüm bitince +10",
  play: 'OYNA · 1 ❤️',
  ad_life: '📺 Reklam İzle (+1 Can)', ad_wrgp: '🪙 Canın Full! Reklam İzle (+9 WRGP)',
  life_full: 'Canların dolu ✅', life_next: 'Sonraki can: {m} dk {s} sn',
  daily_title: '🎁 Günlük Ödül Serisi', daily_desc: 'Her gün gir, serini bozma. Bir gün atlarsan seri 1. güne döner.',
  claim: 'Ödülü Al (+{n} WRGP)', come_back: 'Yarın tekrar gel ⏳', day: 'G{n}',
  daily_modal: '🎁 Günlük Ödül', streak_msg: '{n}. gün serisi!', great: 'Harika',
  inv_title: '👥 Davet Et ve Kazan', inv_desc: "Davet ettiğin her arkadaş için <b class='goldtxt'>+50 WRGP</b>.",
  copy: '📋 Kopyala', share: '📤 Paylaş', inv_count: "Davet ettiklerin: <b id='invCount'>0</b>",
  copied: 'Link kopyalandı ✅', share_text: 'WatchRec oyunlarını oyna, WRGP kazan! 🎮',
  board_title: '🏆 Liderlik Sıralaması', you: '(sen)', you_name: 'Sen',
  board_note: 'Not: Diğer oyuncular örnek verisidir. Gerçek sıralama için sunucu (veritabanı) gerekir.',
  ad_none: 'Reklam henüz ayarlanmadı (Block ID gerekli)', ad_fail: 'Reklam tamamlanmadı, ödül verilmedi',
  got_life: '+1 ❤️ kazandın!', got_wrgp: '+{n} WRGP kazandın! 🪙',
  again: 'Tekrar Oyna (1 ❤️)', to_menu: 'Menüye Dön', no_lives: 'Canın bitti! Reklam izle veya bekle.',
  quit_title: 'Çıkılsın mı?', quit_msg: 'Şimdi çıkarsan harcanan can ve ilerleme kaybolur.', keep: 'Devam Et', quit: 'Çık',
  lang_title: '🌐 Dil',
  score_u: 'SKOR', moves_u: 'HAMLE', time_u: 'SÜRE', score: 'Skor', shuffling: 'Karıştırılıyor!', time_up_big: 'SÜRE DOLDU!',
  combo: 'x{n} KOMBO!', go: 'BAŞLA!', time_up: '⏱ Süre Doldu!', moves_out: 'Hamlelerin Bitti!',
  m3_l1: 'Skorun: <b>{s}</b>', m3_l2: 'Kullanılan hamle: {u}/{m}', m3_l3: 'Ödül: {r} WRGP (her {p} puan = 1 WRGP, en fazla {x})',
  m3_hint: 'Taşa dokun, komşusuna sürükle • 3+ aynı taşı eşleştir • 15 hamle ve 60 saniyen var',
  boss_killed: 'CANAVAR YOK EDİLDİ!', killed: 'YOK EDİLDİ', level_of: 'BÖLÜM {a} / {b}', boss_lbl: '👹 Canavar: {n}',
  goal: '60 saniyede %70 alanı kapat', level_done: 'BÖLÜM TAMAM!', time_bonus: 'Süre bonusu +{b} · +1 ❤️', next: 'Sıradaki: {n}',
  vf_win: '🏆 Tüm Bölümler Tamam!', lives_out: 'Canların Bitti!',
  vf_l1: 'Tamamlanan bölüm: <b>{c}/{n}</b>', vf_l2: 'Son alan: <b>%{p}</b>', vf_l3: 'Skor: <b>{s}</b>',
  vf_l4: 'Ödül: {r} WRGP (bölüm başı 2{f})', vf_final: ' + 10 final bonusu',
  vf_hint: 'Parmağını kaydır (veya ok tuşları) • Kenardan boşluğa çizgi çek • Küçük alanda sıkışan yaratık ölür • Her bölüm 60 sn'
};
I18N.ru = {
  nav_games: 'Игры', nav_daily: 'Награды', nav_invite: 'Друзья', nav_board: 'Рейтинг',
  m3_title: '💎 Три в ряд: Дуэль',
  m3_desc: 'Перетаскивай камни и собирай 3 и более одинаковых. У тебя 60 секунд и 15 ходов — набери максимум очков!',
  m3_meta: "Рекорд: <b id='bestM3'>0</b> очк. · Награда: до 15 WRGP",
  vf_title: '📐 Volfied (Захват территории)',
  vf_desc: '10 космических уровней, в каждом — существа и босс. Проводи линии и захватывай территорию; существо, запертое в небольшой области, погибает. Захвати 70% карты за 60 секунд!',
  vf_meta: "Рекорд: <b id='bestVF'>0</b> очк. · Награда: 2 WRGP за уровень, +10 за все 10",
  play: 'ИГРАТЬ · 1 ❤️',
  ad_life: '📺 Смотреть рекламу (+1 жизнь)', ad_wrgp: '🪙 Жизни полны! Смотреть рекламу (+9 WRGP)',
  life_full: 'Жизни полны ✅', life_next: 'Следующая жизнь: {m} мин {s} сек',
  daily_title: '🎁 Ежедневная награда', daily_desc: 'Заходи каждый день, чтобы не прерывать серию. Пропустишь день — серия начнётся с 1-го дня.',
  claim: 'Получить (+{n} WRGP)', come_back: 'Приходи завтра ⏳', day: 'Д{n}',
  daily_modal: '🎁 Ежедневная награда', streak_msg: 'Серия: {n} дн.!', great: 'Отлично',
  inv_title: '👥 Приглашай и зарабатывай', inv_desc: "За каждого приглашённого друга ты получаешь <b class='goldtxt'>+50 WRGP</b>.",
  copy: '📋 Копировать', share: '📤 Поделиться', inv_count: "Приглашено друзей: <b id='invCount'>0</b>",
  copied: 'Ссылка скопирована ✅', share_text: 'Играй в игры WatchRec и зарабатывай WRGP! 🎮',
  board_title: '🏆 Таблица лидеров', you: '(ты)', you_name: 'Ты',
  board_note: 'Примечание: остальные игроки — примерные данные. Для настоящего рейтинга нужен сервер (база данных).',
  ad_none: 'Реклама ещё не настроена (нужен Block ID)', ad_fail: 'Реклама не досмотрена, награда не выдана',
  got_life: '+1 ❤️ получено!', got_wrgp: '+{n} WRGP получено! 🪙',
  again: 'Играть снова (1 ❤️)', to_menu: 'В меню', no_lives: 'Жизни закончились! Посмотри рекламу или подожди.',
  quit_title: 'Выйти?', quit_msg: 'Если выйти сейчас, потраченная жизнь и прогресс пропадут.', keep: 'Продолжить', quit: 'Выйти',
  lang_title: '🌐 Язык',
  score_u: 'ОЧКИ', moves_u: 'ХОДЫ', time_u: 'ВРЕМЯ', score: 'Очки', shuffling: 'Перемешивание!', time_up_big: 'ВРЕМЯ ВЫШЛО!',
  combo: 'x{n} КОМБО!', go: 'СТАРТ!', time_up: '⏱ Время вышло!', moves_out: 'Ходы закончились!',
  m3_l1: 'Твой счёт: <b>{s}</b>', m3_l2: 'Использовано ходов: {u}/{m}', m3_l3: 'Награда: {r} WRGP (каждые {p} очков = 1 WRGP, максимум {x})',
  m3_hint: 'Коснись камня и перетащи к соседнему • собирай 3+ одинаковых • 15 ходов и 60 секунд',
  boss_killed: 'БОСС УНИЧТОЖЕН!', killed: 'УНИЧТОЖЕНО', level_of: 'УРОВЕНЬ {a} / {b}', boss_lbl: '👹 Босс: {n}',
  goal: 'Захвати 70% территории за 60 секунд', level_done: 'УРОВЕНЬ ПРОЙДЕН!', time_bonus: 'Бонус за время +{b} · +1 ❤️', next: 'Далее: {n}',
  vf_win: '🏆 Все уровни пройдены!', lives_out: 'Жизни закончились!',
  vf_l1: 'Пройдено уровней: <b>{c}/{n}</b>', vf_l2: 'Итоговая площадь: <b>{p}%</b>', vf_l3: 'Очки: <b>{s}</b>',
  vf_l4: 'Награда: {r} WRGP (2 за уровень{f})', vf_final: ' + 10 финальный бонус',
  vf_hint: 'Свайп (или стрелки) • проведи линию от края в свободное место • существа в небольшой области погибают • 60 сек на уровень'
};
I18N.zh = {
  nav_games: '游戏', nav_daily: '每日', nav_invite: '邀请', nav_board: '排行',
  m3_title: '💎 三消对决',
  m3_desc: '拖动宝石，连成3个或更多相同图形。你有60秒和15步，争取最高分！',
  m3_meta: "最高分：<b id='bestM3'>0</b> · 奖励：最多 15 WRGP",
  vf_title: '📐 Volfied（圈地）',
  vf_desc: '10个太空关卡，每关都有怪物和一只首领。画线圈地；被困在小区域内的怪物会死亡。在60秒内圈占地图的70%！',
  vf_meta: "最高分：<b id='bestVF'>0</b> · 奖励：每关 2 WRGP，通关全部10关再 +10",
  play: '开始 · 1 ❤️',
  ad_life: '📺 观看广告（+1 生命）', ad_wrgp: '🪙 生命已满！观看广告（+9 WRGP）',
  life_full: '生命已满 ✅', life_next: '下一条生命：{m}分{s}秒',
  daily_title: '🎁 每日奖励连续签到', daily_desc: '每天登录以保持连续签到。漏掉一天，将从第1天重新开始。',
  claim: '领取（+{n} WRGP）', come_back: '明天再来 ⏳', day: '第{n}天',
  daily_modal: '🎁 每日奖励', streak_msg: '连续签到第 {n} 天！', great: '太棒了',
  inv_title: '👥 邀请赚奖励', inv_desc: "每邀请一位好友，可获得 <b class='goldtxt'>+50 WRGP</b>。",
  copy: '📋 复制', share: '📤 分享', inv_count: "已邀请好友：<b id='invCount'>0</b>",
  copied: '链接已复制 ✅', share_text: '来玩 WatchRec 游戏，赚取 WRGP！🎮',
  board_title: '🏆 排行榜', you: '（你）', you_name: '你',
  board_note: '注意：其他玩家为示例数据。真实排行榜需要服务器（数据库）。',
  ad_none: '广告尚未设置（需要 Block ID）', ad_fail: '广告未看完，未发放奖励',
  got_life: '获得 +1 ❤️！', got_wrgp: '获得 +{n} WRGP！🪙',
  again: '再玩一次（1 ❤️）', to_menu: '返回菜单', no_lives: '生命用完了！请观看广告或等待。',
  quit_title: '要退出吗？', quit_msg: '现在退出，已消耗的生命和进度将会丢失。', keep: '继续游戏', quit: '退出',
  lang_title: '🌐 语言',
  score_u: '得分', moves_u: '步数', time_u: '时间', score: '得分', shuffling: '重新洗牌！', time_up_big: '时间到！',
  combo: 'x{n} 连击！', go: '开始！', time_up: '⏱ 时间到！', moves_out: '步数用完！',
  m3_l1: '你的得分：<b>{s}</b>', m3_l2: '已用步数：{u}/{m}', m3_l3: '奖励：{r} WRGP（每 {p} 分 = 1 WRGP，最多 {x}）',
  m3_hint: '点按宝石并拖向相邻位置 • 连成3个以上相同宝石 • 15步，60秒',
  boss_killed: '首领被消灭！', killed: '已消灭', level_of: '第 {a} / {b} 关', boss_lbl: '👹 首领：{n}',
  goal: '60秒内圈占70%的区域', level_done: '过关！', time_bonus: '时间奖励 +{b} · +1 ❤️', next: '下一关：{n}',
  vf_win: '🏆 全部通关！', lives_out: '生命用完了！',
  vf_l1: '已通关：<b>{c}/{n}</b>', vf_l2: '最终面积：<b>{p}%</b>', vf_l3: '得分：<b>{s}</b>',
  vf_l4: '奖励：{r} WRGP（每关 2{f}）', vf_final: ' + 10 通关奖励',
  vf_hint: '滑动屏幕（或方向键） • 从边缘向空地画线 • 被困在小区域的怪物会死亡 • 每关 60 秒'
};
I18N.ko = {
  nav_games: '게임', nav_daily: '일일', nav_invite: '초대', nav_board: '순위',
  m3_title: '💎 매치-3 듀얼',
  m3_desc: '보석을 드래그해 같은 모양 3개 이상을 맞추세요. 60초와 15번의 이동으로 최고 점수에 도전하세요!',
  m3_meta: "최고 기록: <b id='bestM3'>0</b>점 · 보상: 최대 15 WRGP",
  vf_title: '📐 Volfied (땅따먹기)',
  vf_desc: '10개의 우주 스테이지, 각 스테이지마다 크리처와 보스가 있습니다. 선을 그어 영역을 차지하세요. 좁은 영역에 갇힌 크리처는 죽습니다. 60초 안에 맵의 70%를 차지하세요!',
  vf_meta: "최고 기록: <b id='bestVF'>0</b>점 · 보상: 스테이지당 2 WRGP, 10개 모두 클리어 시 +10",
  play: '플레이 · 1 ❤️',
  ad_life: '📺 광고 보기 (+1 생명)', ad_wrgp: '🪙 생명 가득! 광고 보기 (+9 WRGP)',
  life_full: '생명이 가득 찼습니다 ✅', life_next: '다음 생명: {m}분 {s}초',
  daily_title: '🎁 일일 보상 연속 출석', daily_desc: '매일 접속해 연속 출석을 유지하세요. 하루를 건너뛰면 1일차부터 다시 시작합니다.',
  claim: '받기 (+{n} WRGP)', come_back: '내일 다시 오세요 ⏳', day: '{n}일',
  daily_modal: '🎁 일일 보상', streak_msg: '{n}일 연속 출석!', great: '좋아요',
  inv_title: '👥 초대하고 보상 받기', inv_desc: "친구를 초대할 때마다 <b class='goldtxt'>+50 WRGP</b>를 받습니다.",
  copy: '📋 복사', share: '📤 공유', inv_count: "초대한 친구: <b id='invCount'>0</b>",
  copied: '링크가 복사되었습니다 ✅', share_text: 'WatchRec 게임을 플레이하고 WRGP를 받으세요! 🎮',
  board_title: '🏆 리더보드', you: '(나)', you_name: '나',
  board_note: '참고: 다른 플레이어는 예시 데이터입니다. 실제 순위에는 서버(데이터베이스)가 필요합니다.',
  ad_none: '광고가 아직 설정되지 않았습니다 (Block ID 필요)', ad_fail: '광고를 끝까지 보지 않아 보상이 지급되지 않았습니다',
  got_life: '+1 ❤️ 획득!', got_wrgp: '+{n} WRGP 획득! 🪙',
  again: '다시 플레이 (1 ❤️)', to_menu: '메뉴로 돌아가기', no_lives: '생명이 없습니다! 광고를 보거나 기다리세요.',
  quit_title: '나가시겠어요?', quit_msg: '지금 나가면 사용한 생명과 진행 상황이 사라집니다.', keep: '계속하기', quit: '나가기',
  lang_title: '🌐 언어',
  score_u: '점수', moves_u: '이동', time_u: '시간', score: '점수', shuffling: '섞는 중!', time_up_big: '시간 종료!',
  combo: 'x{n} 콤보!', go: '시작!', time_up: '⏱ 시간 종료!', moves_out: '이동 횟수 소진!',
  m3_l1: '내 점수: <b>{s}</b>', m3_l2: '사용한 이동: {u}/{m}', m3_l3: '보상: {r} WRGP ({p}점마다 1 WRGP, 최대 {x})',
  m3_hint: '보석을 누르고 옆 칸으로 드래그 • 같은 보석 3개 이상 맞추기 • 15번 이동, 60초',
  boss_killed: '보스 처치!', killed: '처치', level_of: '스테이지 {a} / {b}', boss_lbl: '👹 보스: {n}',
  goal: '60초 안에 영역의 70% 차지하기', level_done: '스테이지 클리어!', time_bonus: '시간 보너스 +{b} · +1 ❤️', next: '다음: {n}',
  vf_win: '🏆 모든 스테이지 클리어!', lives_out: '생명이 모두 소진되었습니다!',
  vf_l1: '클리어한 스테이지: <b>{c}/{n}</b>', vf_l2: '최종 면적: <b>{p}%</b>', vf_l3: '점수: <b>{s}</b>',
  vf_l4: '보상: {r} WRGP (스테이지당 2{f})', vf_final: ' + 10 최종 보너스',
  vf_hint: '스와이프 (또는 방향키) • 가장자리에서 빈 공간으로 선 긋기 • 좁은 영역에 갇힌 크리처는 죽음 • 스테이지당 60초'
};
I18N.es = {
  nav_games: 'Juegos', nav_daily: 'Diario', nav_invite: 'Invitar', nav_board: 'Ranking',
  m3_title: '💎 Match-3 Duelo',
  m3_desc: 'Arrastra las gemas para unir 3 o más iguales. Tienes 60 segundos y 15 movimientos: ¡consigue la máxima puntuación!',
  m3_meta: "Récord: <b id='bestM3'>0</b> pts · Premio: hasta 15 WRGP",
  vf_title: '📐 Volfied (Captura de área)',
  vf_desc: '10 niveles espaciales, cada uno con criaturas y un jefe. Traza líneas para conquistar territorio; la criatura atrapada en un área pequeña muere. ¡Conquista el 70 % del mapa en 60 segundos!',
  vf_meta: "Récord: <b id='bestVF'>0</b> pts · Premio: 2 WRGP por nivel, +10 al completar los 10",
  play: 'JUGAR · 1 ❤️',
  ad_life: '📺 Ver anuncio (+1 vida)', ad_wrgp: '🪙 ¡Vidas llenas! Ver anuncio (+9 WRGP)',
  life_full: 'Vidas completas ✅', life_next: 'Próxima vida: {m} min {s} s',
  daily_title: '🎁 Racha de recompensa diaria', daily_desc: 'Entra cada día para mantener tu racha. Si te saltas un día, vuelve al día 1.',
  claim: 'Reclamar (+{n} WRGP)', come_back: 'Vuelve mañana ⏳', day: 'D{n}',
  daily_modal: '🎁 Recompensa diaria', streak_msg: '¡Racha de {n} días!', great: 'Genial',
  inv_title: '👥 Invita y gana', inv_desc: "Ganas <b class='goldtxt'>+50 WRGP</b> por cada amigo que invites.",
  copy: '📋 Copiar', share: '📤 Compartir', inv_count: "Amigos invitados: <b id='invCount'>0</b>",
  copied: 'Enlace copiado ✅', share_text: '¡Juega a los juegos de WatchRec y gana WRGP! 🎮',
  board_title: '🏆 Clasificación', you: '(tú)', you_name: 'Tú',
  board_note: 'Nota: los demás jugadores son datos de ejemplo. Una clasificación real necesita un servidor (base de datos).',
  ad_none: 'Los anuncios aún no están configurados (se necesita Block ID)', ad_fail: 'Anuncio no completado, no se dio recompensa',
  got_life: '¡+1 ❤️ conseguido!', got_wrgp: '¡+{n} WRGP conseguidos! 🪙',
  again: 'Jugar de nuevo (1 ❤️)', to_menu: 'Volver al menú', no_lives: '¡Sin vidas! Mira un anuncio o espera.',
  quit_title: '¿Salir?', quit_msg: 'Si sales ahora, perderás la vida gastada y tu progreso.', keep: 'Seguir jugando', quit: 'Salir',
  lang_title: '🌐 Idioma',
  score_u: 'PUNTOS', moves_u: 'MOVS.', time_u: 'TIEMPO', score: 'Puntos', shuffling: '¡Mezclando!', time_up_big: '¡TIEMPO!',
  combo: '¡COMBO x{n}!', go: '¡YA!', time_up: '⏱ ¡Se acabó el tiempo!', moves_out: '¡Sin movimientos!',
  m3_l1: 'Tu puntuación: <b>{s}</b>', m3_l2: 'Movimientos usados: {u}/{m}', m3_l3: 'Premio: {r} WRGP (cada {p} puntos = 1 WRGP, máximo {x})',
  m3_hint: 'Toca una gema y arrástrala a una vecina • une 3 o más iguales • 15 movimientos y 60 segundos',
  boss_killed: '¡JEFE DESTRUIDO!', killed: 'DESTRUIDO', level_of: 'NIVEL {a} / {b}', boss_lbl: '👹 Jefe: {n}',
  goal: 'Conquista el 70 % del área en 60 segundos', level_done: '¡NIVEL COMPLETADO!', time_bonus: 'Bonus de tiempo +{b} · +1 ❤️', next: 'Siguiente: {n}',
  vf_win: '🏆 ¡Todos los niveles completados!', lives_out: '¡Sin vidas!',
  vf_l1: 'Niveles completados: <b>{c}/{n}</b>', vf_l2: 'Área final: <b>{p}%</b>', vf_l3: 'Puntos: <b>{s}</b>',
  vf_l4: 'Premio: {r} WRGP (2 por nivel{f})', vf_final: ' + 10 de bonus final',
  vf_hint: 'Desliza (o usa las flechas) • traza una línea desde el borde hacia el espacio libre • las criaturas atrapadas en un área pequeña mueren • 60 s por nivel'
};
const LVN_DATA = {
  en: [['Earth Orbit', 'Orbit Guardian'], ['Lunar Surface', 'Craterus'], ['Martian Deserts', 'Red Sand Worm'], ['Asteroid Belt', 'Rockbreaker'], ['Jupiter Storm', 'Storm Giant Jovar'],
       ["Saturn's Rings", 'Ring Sovereign'], ['Milky Way Shore', 'Galaxy Devourer'], ['Orion Nebula', 'Nebula Wraith'], ['Zeta-9 Alien Planet', 'Zeta Mothership'], ['Black Hole', 'Event Horizon Beast']],
  tr: [['Dünya Yörüngesi', 'Yörünge Bekçisi'], ['Ay Yüzeyi', 'Kraterus'], ['Mars Çölleri', 'Kızıl Kum Solucanı'], ['Asteroit Kuşağı', 'Taşparçalayan'], ['Jüpiter Fırtınası', 'Fırtına Devi Jovar'],
       ['Satürn Halkaları', 'Halka Hükümdarı'], ['Samanyolu Kıyısı', 'Galaksi Yutan'], ['Orion Nebulası', 'Nebula Hortlağı'], ['Zeta-9 Yabancı Gezegen', 'Zeta Ana Gemisi'], ['Kara Delik', 'Olay Ufku Canavarı']],
  ru: [['Орбита Земли', 'Страж орбиты'], ['Поверхность Луны', 'Кратерус'], ['Пустыни Марса', 'Красный песчаный червь'], ['Пояс астероидов', 'Камнедробитель'], ['Буря на Юпитере', 'Гигант бурь Йовар'],
       ['Кольца Сатурна', 'Повелитель колец'], ['Берег Млечного Пути', 'Пожиратель галактик'], ['Туманность Ориона', 'Призрак туманности'], ['Чужая планета Зета-9', 'Корабль-матка Зета'], ['Чёрная дыра', 'Чудовище горизонта событий']],
  zh: [['地球轨道', '轨道守卫'], ['月球表面', '陨坑巨兽'], ['火星沙漠', '红沙巨虫'], ['小行星带', '碎石者'], ['木星风暴', '风暴巨人约瓦'],
       ['土星光环', '光环主宰'], ['银河之滨', '吞星者'], ['猎户座星云', '星云幽灵'], ['泽塔-9外星球', '泽塔母舰'], ['黑洞', '视界巨兽']],
  ko: [['지구 궤도', '궤도 수호자'], ['달 표면', '크레이터스'], ['화성 사막', '붉은 모래 벌레'], ['소행성대', '암석 파괴자'], ['목성 폭풍', '폭풍의 거인 조바르'],
       ['토성 고리', '고리의 군주'], ['은하수 해안', '은하 포식자'], ['오리온 성운', '성운 유령'], ['제타-9 외계 행성', '제타 모함'], ['블랙홀', '사건의 지평선 괴물']],
  es: [['Órbita terrestre', 'Guardián orbital'], ['Superficie lunar', 'Crateros'], ['Desiertos de Marte', 'Gusano de arena rojo'], ['Cinturón de asteroides', 'Rompepiedras'], ['Tormenta de Júpiter', 'Jovar, gigante de la tormenta'],
       ['Anillos de Saturno', 'Soberano de los anillos'], ['Costa de la Vía Láctea', 'Devorador de galaxias'], ['Nebulosa de Orión', 'Espectro de la nebulosa'], ['Planeta alienígena Zeta-9', 'Nave nodriza Zeta'], ['Agujero negro', 'Bestia del horizonte de sucesos']]
};

/* ---------- Dil seçimi ---------- */
const LANG_KEY = 'wrgp_lang';
function detectLang() {
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (_) {}
  if (saved && I18N[saved]) return saved;
  const u = window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user;
  const cand = String((u && u.language_code) || navigator.language || 'en').toLowerCase().slice(0, 2);
  return I18N[cand] ? cand : 'en';
}
let LANG = detectLang();

/* tl('anahtar', {n: 5}) → çeviri; eksikse İngilizceye, o da yoksa anahtara düşer */
function tl(key, vars) {
  let s = I18N[LANG] && I18N[LANG][key];
  if (s == null) s = I18N.en[key];
  if (s == null) return key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
function LVN(i) { return (LVN_DATA[LANG] || LVN_DATA.en)[i] || LVN_DATA.en[i]; }

function applyI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tl(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = tl(el.dataset.i18nHtml); });
}
function setLang(l) {
  if (!I18N[l]) return;
  LANG = l;
  try { localStorage.setItem(LANG_KEY, l); } catch (_) {}
  applyI18n();
}

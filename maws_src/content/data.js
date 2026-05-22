export const SAVE_KEY = 'maws_overhaul_save';
export const GAME_VERSION = '4.1-phaser-ui';

export const DOW = ['一', '二', '三', '四', '五', '六', '日'];

export const TABS = [
  { id: 'map', label: '地图', icon: '⌖', assetKey: 'icon.nav.map' },
  { id: 'profile', label: '人物', icon: '★', assetKey: 'icon.nav.profile' },
  { id: 'skills', label: '技能', icon: '拳', assetKey: 'icon.nav.skills' },
  { id: 'bag', label: '物品', icon: '包', assetKey: 'icon.nav.bag' },
  { id: 'shop', label: '商城', icon: '购', assetKey: 'icon.nav.shop' },
  { id: 'npc', label: '关系', icon: '友', assetKey: 'icon.nav.npc' },
  { id: 'log', label: '日志', icon: '记', assetKey: 'icon.nav.log' },
  { id: 'check', label: '自检', icon: '测', assetKey: 'icon.nav.check' }
];

export const STAT_KEYS = ['str', 'end', 'spd', 'rea', 'tec', 'tou', 'bal', 'jud'];

export const STAT_RULES = {
  str: { name: '力量', icon: '力', desc: '让拳头和抱摔更有交代，不再像把意见轻轻递到对面脸上。', formula: '伤害 +0.08/点；抓把、抱摔切入随力量上升，重击压制也更像真事。' },
  end: { name: '耐力', icon: '耐', desc: '决定你是能打三回合，还是第一回合就开始和肺部谈判。', formula: '体力上限 +1/点；生命上限 +0.35/点；回合恢复随耐力上升，疲劳压力更慢找上门。' },
  spd: { name: '速度', icon: '速', desc: '影响步法、踢法命中、闪避和撤离；慢不是错，慢到被读秒就是错。', formula: '速度越高，步法、踢法、后撤和街头脱身窗口越稳。' },
  rea: { name: '反应', icon: '反', desc: '看见对手起手后，身体能不能先于嘴硬做出正确选择。', formula: '命中 +0.2%/点；敌命中 -0.2%/点；高反应提高节奏和读招后的应对效率。' },
  tec: { name: '技巧', icon: '技', desc: '把“我会一点”磨成“这下真能用”，避免动作只在镜子前成立。', formula: '命中 +0.4%/点；伤害 +0.055/点；架势伤害和训练收益随技巧上升。' },
  tou: { name: '抗打', icon: '抗', desc: '不是鼓励挨揍，是让偶尔挨一下时不必当场写遗书。', formula: '生命上限 +0.9/点；新伤概率随抗打下降，重击后果更可控。' },
  bal: { name: '平衡', icon: '衡', desc: '脚下稳，嘴上才有资格说“问题不大”；防摔和地面脱身都靠它。', formula: '架势上限 +0.75/点；防摔、抱摔和地面判定随平衡上升。' },
  jud: { name: '判断', icon: '判', desc: '知道什么时候打、什么时候跑、什么时候闭嘴，都是硬实力。', formula: '判断越高，反制收益越强，街头撤离/降温更稳，重复出招惩罚更小。' }
};

export const RESOURCE_RULES = {
  money: { name: '现金', icon: '￥', desc: '训练、恢复、交通和装备的硬门槛。钱不会出拳，但没钱会让一切都先停在门口。' },
  fame: { name: '名声', icon: '星', desc: '公开评价和挑战吸引力。名声高了，机会会来，嘴硬的人也会来。' },
  auth: { name: '真实性', icon: '真', desc: '衡量训练到底能不能落地。真实性低时，动作看着像秘籍，用起来像请假条。' },
  heat: { name: '热度', icon: '热', desc: '决定你被看见的程度。热度越高，挑战、旧城风险和新伤压力越容易排队敲门。' },
  fitXp: { name: '体能沉淀', icon: '体', desc: '出行、打工和训练留下的长期底子。每 20 点形成 1 级派生加成，身体会记账。' }
};

export const STYLE_RULES = {
  boxing: { name: '拳击实用', icon: '拳', desc: '提高拳类伤害、抱架稳定和基础换拳效率。朴素，但朴素得很疼。' },
  mma: { name: 'MMA防摔', icon: '摔', desc: '提高防摔、抱摔、地面脱身和上位控制收益。别让对面把你当瑜伽垫。' },
  traditional: { name: '传统拆解', icon: '武', desc: '把好看的架子拆成能复现的短动作；能打的留下，摆拍的靠边站。' },
  street: { name: '街头判断', icon: '街', desc: '提高撤离、降温和风险胜利概率。真正的狠活，有时是让事别发生。' },
  sanda: { name: '散打实战', icon: '散', desc: '重视拳腿摔衔接和擂台距离感。打得不花，但每一步都在给下一下铺路。' },
  karate: { name: '空手道正拳', icon: '空', desc: '强调架势、直线爆发和收招纪律。动作干净，问题是对面也会看见空档。' },
  taekwondo: { name: '跆拳道腿法', icon: '跆', desc: '提高中远距离腿法节奏和反击威胁。腿能踢得高，也要记得落地。' }
};

export const MAW_RULES = {
  belief: { name: '祖传信念', icon: '祖', desc: '陆小闲对“茂家拳天下第一”的相信程度。前期撑心气，后期必须被真实训练重写。' },
  misread: { name: '误判值', icon: '误', desc: '把偶然胜利理解成神功的程度。Day 8 会被现实清账，不能当长期战力。' },
  fatherMemory: { name: '父亲记忆', icon: '父', desc: '不是战斗力，而是陆小闲为什么还能站起来。影响日记、夜谈和终战冷静。' },
  reforge: { name: '茂拳完成度', icon: '茂', desc: '把拳击、身体、传统拆解、地面和街头判断写回茂家拳谱的进度。' },
  modules: { name: '百家入茂', icon: '入', desc: '散打、空手道、跆拳道等训练不平行堆系统，而是汇入重铸模块。' },
  objectives: { name: '真东西目标', icon: '测', desc: 'Day 30 不只看 KO，而看能不能在压力里完成具体目标。' }
};

export const FATHER_DIARY = {
  title: '父亲日记',
  subtitle: '旧箱子里没有绝招，只有几页不太会说出口的话。',
  dialogue: [
    { speaker: '陆小闲', text: '箱子底下还有一本本子。封皮都起毛了。' },
    { speaker: '陆小闲', text: '字是爸的。比拳谱难认，但比拳谱像真话。' },
    { speaker: '父亲', text: '小闲，真要保护人，先学会别拿冲动当本事。' }
  ],
  entries: [
    { date: '给小闲', text: '我怕你把拳谱当护身符。真要保护人，先学会别乱争胜，别把每一次冲动都说成祖传。' },
    { date: '练拳记', text: '茂家拳如果还有用，不该是让人相信自己天下第一，而是把真正能用的东西一页页写回来。' },
    { date: '没说出口的话', text: '输不丢人。丢人的是明知道不懂，还拿别人的安全替自己的面子撑场。' }
  ],
  closing: '你合上日记。父亲没有否定茂家拳，他只是把“能用”两个字放在了最前面。'
};

export const MAW_FORMS = {
  kaishan: {
    name: '茂家开山拳',
    module: 'boxing',
    skill: 'straight',
    old: '父亲说这一拳能开山。小时候你信得很认真。',
    doubt: '开山存疑。直拳回收、护住下巴，这些才先能开门。',
    newNote: '新注：先用刺拳找路，再让直拳落在能回收的位置。'
  },
  tiebu: {
    name: '茂家铁布衫',
    module: 'body',
    skill: 'guard',
    old: '旧解说站稳就不怕打。现实会先问你的体能和抱架。',
    doubt: '铁布衫存疑。抗压不是硬挨，是让身体有余量。',
    newNote: '新注：耐力、核心和抱架一起算，能少挨一下就少挨一下。'
  },
  fenghou: {
    name: '茂家封喉手',
    module: 'traditional',
    skill: 'palm',
    old: '招名很凶，小时候听起来像能一招定胜负。',
    doubt: '封喉存疑。近身短打要看距离、重心和时机。',
    newNote: '新注：掌根短击只在近身成立，先破平衡，再谈落点。'
  },
  chuanbu: {
    name: '茂家穿云步',
    module: 'street',
    skill: 'retreat',
    old: '父亲说步法一开，人像从云里过。',
    doubt: '穿云存疑。街头先看出口、障碍和情绪。',
    newNote: '新注：能后撤、能降温、能不打，都是能用的步法。'
  },
  luodi: {
    name: '茂家落地根',
    module: 'grappling',
    skill: 'sprawl',
    old: '旧拳谱没写地面，只写“根在脚下”。',
    doubt: '落地根存疑。被抱住之后，脚下那点根不一定够。',
    newNote: '新注：防摔、脱身和重新站起，是现代茂家拳必须补的页。'
  }
};

export const ORIGINS = {
  worker: { name: '进城打工人', icon: '工', desc: '钱少但抗压，肩膀已经被生活预热过。便利店和工地收益高，恢复慢。', stats: { str: 48, end: 54, spd: 46, rea: 45, tec: 38, tou: 52, bal: 46, jud: 48 }, money: 360, trait: '打工收益+20%' },
  fan: { name: '短视频信徒', icon: '燃', desc: '士气很满，真实性很饿。适合开局冲劲，不适合把弹幕当教练。', stats: { str: 42, end: 43, spd: 44, rea: 45, tec: 36, tou: 42, bal: 42, jud: 35 }, money: 420, trait: '士气高，真实性低' },
  student: { name: '体育生旁听', icon: '生', desc: '基础体能好，现金紧。身体愿意努力，钱包表示需要战术暂停。', stats: { str: 45, end: 58, spd: 55, rea: 52, tec: 43, tou: 47, bal: 52, jud: 45 }, money: 300, trait: '训练体能压力低' }
};

export const LOCS = {
  home: { name: '出租屋', icon: '屋', open: [0, 1440], desc: '复盘、休息和网购的安全区。床很窄，但至少不会突然抱摔你。' },
  store: { name: '便利店', icon: '店', open: [420, 1380], desc: '补给、打工和小满事件。冰柜很冷，人情账很热。' },
  metro_station: { name: '地铁站', icon: '铁', open: [360, 1440], desc: '城市把人吞进去，再准点吐出来。这里有通勤、短视频、误会和下一站的线索。' },
  worksite: { name: '工地临工点', icon: '工', open: [480, 1140], desc: '短工累，但能把现金和体能沉淀一点点垫起来。砖不会骗人。' },
  park: { name: '公园', icon: '园', open: [360, 1260], desc: '低风险验货、围观和街头观察。大爷们嘴上养生，手上不一定。' },
  boxing: { name: '拳馆', icon: '拳', open: [540, 1320], desc: '拳击基础、陪练和教练反馈。这里的真话通常带着汗味。' },
  wuguan: { name: '武馆', icon: '武', open: [540, 1260], desc: '传统动作拆解和压力测试。好看可以加分，能用才算毕业。' },
  mma: { name: 'MMA馆', icon: '摔', open: [600, 1320], desc: '防摔、抱摔和地面课。你会学到地板其实很有存在感。' },
  sanda_gym: { name: '散打馆', icon: '散', open: [540, 1320], desc: '拳腿摔连在一起练，节奏硬，回合短。教练不爱玄学，只看你能不能站稳再出手。' },
  karate_dojo: { name: '空手道道场', icon: '空', open: [570, 1260], desc: '基本功、型和组手都讲规矩。地板擦得很亮，犯错时也很亮。' },
  taekwondo_club: { name: '跆拳道社', icon: '跆', open: [600, 1320], desc: '腿法、步伐和距离反击。踢得漂亮不算完，落回来还能防住才算数。' },
  gym: { name: '社区健身房', icon: '体', open: [540, 1320], desc: '基础体能馆，练力量、耐力、平衡和核心。镜子不计分，心率带计。' },
  physio: { name: '理疗店', icon: '疗', open: [600, 1320], desc: '恢复、降疲劳和处理小伤。花钱让身体停止投诉。' },
  street: { name: '旧城区', icon: '街', open: [900, 1430], desc: '线索、热度和高风险冲突。路灯不多，误会不少。' }
};

export const LOC_UNLOCKS = {
  home: { default: true, hint: '起点。' },
  store: { default: true, hint: 'Day 1 可以去，先把生活压力顶住。' },
  metro_station: { default: true, hint: '预留给地铁站内容接入。' },
  park: { day: 3, reason: '先在出租屋和便利店把城市摸清楚。', hint: 'Day 3 开放。' },
  worksite: { day: 4, reason: '刘胖子还没把日结活转给你。', hint: 'Day 4 开放。' },
  boxing: { day: 9, reason: '真正被一阵风打醒后，你才愿意听拳馆的真话。', hint: 'Day 9 开放。' },
  physio: { day: 9, reason: '身体还没开始正式投诉。', hint: 'Day 9 开放。' },
  gym: { day: 10, reason: '先确认身体到底差在哪里。', hint: 'Day 10 开放。' },
  wuguan: { day: 13, reason: '传统拆解还没到时候。', hint: 'Day 13 开放。' },
  mma: { day: 16, reason: '地面课不是第一天就能理解的东西。', hint: 'Day 16 开放。' },
  street: { day: 18, reason: '旧城区的风险还没把你点名。', hint: 'Day 18 开放。' },
  sanda_gym: { day: 20, reason: '拳腿摔组合需要一点基础。', hint: 'Day 20 开放。' },
  karate_dojo: { day: 22, reason: '先把直线和回收练明白。', hint: 'Day 22 开放。' },
  taekwondo_club: { day: 24, reason: '腿法漂亮之前，先学会落地。', hint: 'Day 24 开放。' }
};

export const INITIAL_SKILLS = ['wild_swing', 'push_away', 'mystic', 'guard', 'retreat', 'talkdown'];

export const LOC_POS = {
  home: [1, 6], park: [2, 3], store: [2, 5], metro_station: [3, 5], worksite: [4, 1], boxing: [4, 6],
  wuguan: [6, 4], mma: [5, 8], sanda_gym: [6, 6], karate_dojo: [7, 5], taekwondo_club: [7, 7],
  gym: [9, 6], physio: [8, 8], street: [9, 3]
};

export const TRAVEL_TUNING = {
  walk: { name: '散步', icon: '走', desc: '不花钱，慢一点，顺便给身体存点体能沉淀。适合钱包装死时。', time: [20, 40, 70], money: [0, 0, 0], sp: [5, 9, 16], fitXp: [2, 4, 7], fatigue: [0, 1, 3] },
  run: { name: '跑步', icon: '跑', desc: '省钱也练体能，代价是到场时先和大腿开个短会。', time: [13, 27, 48], money: [0, 0, 0], sp: [11, 18, 28], fitXp: [5, 8, 12], fatigue: [1, 2, 5] },
  bike: { name: '共享单车', icon: '车', desc: '便宜且快，少量消耗体力。刹车好不好，属于城市盲盒。', time: [11, 23, 40], money: [4, 8, 14], sp: [4, 8, 12], fitXp: [2, 3, 5], fatigue: [0, 1, 2] },
  bus: { name: '公交', icon: '巴', desc: '便宜稳定，跨区会被红绿灯和换乘拖慢。胜在不用和空气拼刺刀。', time: [18, 34, 55], money: [6, 12, 20], sp: [1, 1, 2], fitXp: [0, 0, 0], fatigue: [0, 0, 0] },
  metro: { name: '地铁', icon: '铁', desc: '跨区更稳，进出站和换线也要时间。城市把你吞进去，再准点吐出来。', time: [18, 28, 38], money: [8, 15, 24], sp: [1, 1, 1], fitXp: [0, 0, 0], fatigue: [0, 0, 0] },
  taxi: { name: '打车', icon: '的', desc: '最快，不耗体力，但跨区和夜间成本明显。钱包会替你挨这一下。', time: [10, 18, 32], money: [26, 48, 86], sp: [0, 0, 0], fitXp: [0, 0, 0], fatigue: [0, 0, 0] }
};

export const TIME_DOSAGE_OPTIONS = {
  short: { name: '短练 30m', minutes: 30, multiplier: 0.7, spMultiplier: 0.46, fatigueMultiplier: 0.34, costMultiplier: 0.55, opportunityPressure: 0, note: '低收益低消耗，适合塞进碎片时间；今天还留得下别的安排。' },
  standard: { name: '标准 60m', minutes: 60, multiplier: 1, spMultiplier: 1, fatigueMultiplier: 1, costMultiplier: 1, opportunityPressure: 0, note: '默认推荐，收益和身体压力最稳，不惩罚正常安排。' },
  deep: { name: '深练 90m', minutes: 90, multiplier: 1.18, spMultiplier: 1.42, fatigueMultiplier: 1.75, costMultiplier: 1.15, opportunityPressure: 1, note: '收益更清楚，但会占掉一段机会窗口；适合状态好时补短板。' },
  hard: { name: '硬练 120m', minutes: 120, multiplier: 1.25, spMultiplier: 1.95, fatigueMultiplier: 2.9, costMultiplier: 1.25, opportunityPressure: 2, injuryRisk: 0.34, note: '硬顶强度，收益递减且明显挤掉今天别的机会；小伤风险很高。' }
};

export const IDLE_EVENTS = [
  { id: 'father_memory', title: '父亲记忆', text: '你想起父亲说过，先把冲动放下，拳才有地方落。', gain: { calm: 1 }, maw: { fatherMemory: 1 } },
  { id: 'diary_self', title: '日记自省', text: '你在本子上写下今天最想硬撑的一刻，决定下次先看清楚。', gain: { calm: 1 } },
  { id: 'friend_message', title: '朋友消息', text: '刘胖子发来一句别练到报废。语气欠揍，但道理还行。', gain: { morale: 1 } }
];

export const SKILLS = {
  wild_swing: { name: '野路挥拳', icon: '挥', type: 'strike', dist: ['far', 'mid', 'close'], dmg: 10, post: 8, sp: 6, ap: 1, hit: 0.66, risk: 0.18, style: 'street', desc: '没练过系统拳路，但真急眼时能把人逼退。能打赢完全没练过的人，遇到正规拳距就会漏出回收问题。' },
  push_away: { name: '推搡', icon: '推', type: 'dirty', dist: ['mid', 'close'], dmg: 2, post: 12, sp: 6, ap: 1, hit: 0.74, risk: 0.10, style: 'street', desc: '用肩手把人顶开，抢一点喘气和距离。不是技术胜利，只是别让局面一下子贴死。' },
  jab: { name: '刺拳', icon: '拳', assetKey: 'skill.jab', type: 'strike', dist: ['far', 'mid'], dmg: 8, post: 7, sp: 5, ap: 1, hit: 0.84, risk: 0.06, style: 'boxing', desc: '探距离、打断前压。伤害不高，但能把对面节奏敲出一个小逗号。' },
  straight: { name: '直拳', icon: '直', assetKey: 'skill.straight', type: 'strike', dist: ['mid'], dmg: 18, post: 12, sp: 9, ap: 2, hit: 0.72, risk: 0.16, style: 'boxing', desc: '基础重击，打中了很有说法；回收慢，没打中就轮到对面写说法。' },
  guard: { name: '防守抱架', icon: '盾', assetKey: 'skill.guard', type: 'defense', dist: ['far', 'mid', 'close'], dmg: 0, post: 0, sp: 4, ap: 1, hit: 1, risk: 0.02, style: 'boxing', desc: '降低下一次受伤。不是怂，是把脸从公共资源改回个人财产。' },
  dodge: { name: '侧步闪避', icon: '闪', assetKey: 'skill.dodge', type: 'footwork', dist: ['far', 'mid', 'close'], dmg: 0, post: 0, sp: 8, ap: 1, hit: 1, risk: 0.08, style: 'boxing', desc: '离线闪避，制造角度。让对手把狠话打到空气里。' },
  advance: { name: '前压入身', icon: '进', type: 'footwork', dist: ['far', 'mid'], dmg: 0, post: 0, sp: 5, ap: 1, hit: 1, risk: 0.12, style: 'mma', desc: '推进距离，准备近身。等于是给下一步抱摔或短打递邀请函。' },
  retreat: { name: '后撤拉开', icon: '退', type: 'footwork', dist: ['mid', 'close', 'ground'], dmg: 0, post: 0, sp: 5, ap: 1, hit: 1, risk: 0.08, style: 'street', desc: '脱离近身或地面压力。活着退一步，不丢人，丢的是对面的剧本。' },
  lowkick: { name: '低扫', icon: '腿', assetKey: 'skill.lowkick', type: 'kick', dist: ['mid', 'close'], dmg: 12, post: 12, sp: 10, ap: 2, hit: 0.68, risk: 0.14, style: 'mma', desc: '打断前腿和节奏。对手会突然意识到膝盖也有意见。' },
  frontkick: { name: '前踢拒门', icon: '踢', type: 'kick', dist: ['mid'], dmg: 10, post: 10, sp: 9, ap: 1, hit: 0.72, risk: 0.10, style: 'mma', desc: '顶开前压，控住距离。礼貌地告诉对面：此门暂不营业。' },
  grip: { name: '抓把', icon: '抓', type: 'grapple', dist: ['close'], dmg: 2, post: 8, sp: 7, ap: 1, hit: 0.66, risk: 0.16, style: 'mma', desc: '提高后续抱摔成功率。先拿到控制权，再谈地心引力。' },
  takedown: { name: '抱摔', icon: '摔', assetKey: 'skill.takedown', type: 'grapple', dist: ['close'], dmg: 10, post: 18, sp: 15, ap: 2, hit: 0.56, risk: 0.24, style: 'mma', desc: '成功后进入地面上位。失败时也很有存在感，主要存在于你的体力条里。' },
  sprawl: { name: '防摔', icon: '防', assetKey: 'skill.sprawl', type: 'defense', dist: ['mid', 'close'], dmg: 0, post: 0, sp: 8, ap: 1, hit: 1, risk: 0.04, style: 'mma', desc: '克制抱摔切入。对方想带你见地板，你选择改签。' },
  sidecontrol: { name: '侧压控制', icon: '压', type: 'ground', dist: ['ground'], dmg: 8, post: 12, sp: 12, ap: 2, hit: 0.68, risk: 0.12, style: 'mma', desc: '上位消耗对手体力。把优势压实，让对方先学会后悔。' },
  escape: { name: '地面脱身', icon: '脱', type: 'ground', dist: ['ground'], dmg: 0, post: 0, sp: 11, ap: 1, hit: 0.66, risk: 0.10, style: 'mma', desc: '从下位回到站立。先从麻烦里出来，再讨论尊严。' },
  dirtyescape: { name: '夺路撤离', icon: '撤', assetKey: 'skill.dirtyescape', type: 'dirty', dist: ['far', 'mid', 'close'], dmg: 0, post: 0, sp: 8, ap: 1, hit: 0.78, risk: 0.08, style: 'street', desc: '街头冲突的风险胜利路线。赢法之一，是让账单别落到医院。' },
  talkdown: { name: '言语降温', icon: '谈', type: 'dirty', dist: ['far', 'mid', 'close'], dmg: 0, post: 0, sp: 6, ap: 1, hit: 0.58, risk: 0.05, style: 'street', desc: '降低敌意，避免硬拼。嘴不是武器，但有时能让武器先下班。' },
  palm: { name: '掌根短击', icon: '掌', assetKey: 'skill.palm', type: 'strike', dist: ['close'], dmg: 14, post: 14, sp: 9, ap: 1, hit: 0.66, risk: 0.14, style: 'traditional', desc: '把花架子拆成近身短打。动作不玄，落点很现实。' },
  offbalance: { name: '破平衡', icon: '破', type: 'grapple', dist: ['close'], dmg: 4, post: 20, sp: 10, ap: 1, hit: 0.62, risk: 0.16, style: 'traditional', desc: '扰乱重心，方便后续压制。先让对手站不明白，再让他输得明白。' },
  mystic: { name: '混元一气掌', icon: '玄', type: 'mystic', dist: ['mid', 'close'], dmg: 15, post: 6, sp: 18, ap: 2, hit: 0.42, risk: 0.28, style: 'traditional', desc: '观赏性高，压力下风险也高。能赢是绝活，打空就是现场气氛组。' },
  sanda_whip_kick: { name: '散打鞭腿', icon: '鞭', type: 'kick', dist: ['mid'], dmg: 14, post: 13, sp: 11, ap: 2, hit: 0.68, risk: 0.16, style: 'sanda', desc: '从拳距后面抽出来的中段鞭腿。打中不是花活，是让对面肋部重新认识呼吸。' },
  sanda_catch_throw: { name: '接腿摔', icon: '接', type: 'grapple', dist: ['mid', 'close'], dmg: 8, post: 18, sp: 13, ap: 2, hit: 0.58, risk: 0.22, style: 'sanda', desc: '抓住踢腿后的空档把人带倒。机会很短，犹豫一下就只剩尴尬。' },
  karate_reverse_punch: { name: '逆突', icon: '突', type: 'strike', dist: ['mid'], dmg: 17, post: 15, sp: 10, ap: 2, hit: 0.70, risk: 0.15, style: 'karate', desc: '后手直线贯出去，讲究启动、落点和回收。拳路越直，借口越少。' },
  karate_front_kick: { name: '前蹴', icon: '蹴', type: 'kick', dist: ['mid'], dmg: 11, post: 11, sp: 9, ap: 1, hit: 0.72, risk: 0.11, style: 'karate', desc: '用脚掌顶住中线，打断对手前压。不是踢远，是把门关上。' },
  tkd_roundhouse: { name: '横踢', icon: '横', type: 'kick', dist: ['far', 'mid'], dmg: 13, post: 12, sp: 10, ap: 2, hit: 0.69, risk: 0.15, style: 'taekwondo', desc: '靠步伐和转髋把腿送到侧面。腿影好看，落点必须清楚。' },
  tkd_back_kick: { name: '后踢', icon: '后', type: 'kick', dist: ['mid'], dmg: 20, post: 16, sp: 14, ap: 2, hit: 0.58, risk: 0.24, style: 'taekwondo', desc: '抓对手追进来的瞬间反打。打中像关门，打空像把后背递过去。' }
};

export const SKILL_UNLOCKS = {
  wild_swing: { skillId: 'wild_swing', initial: true, sourceSummary: '开局已会 · 茂家野路挥拳', openCondition: '开局自带。', unlockText: '你不懂刺拳和直拳，但知道人冲上来时不能只站着挨。' },
  push_away: { skillId: 'push_away', initial: true, sourceSummary: '开局已会 · 推搡抢距', openCondition: '开局自带。', unlockText: '你先学会把人顶开一点，给呼吸和后撤留个缝。' },
  mystic: { skillId: 'mystic', initial: true, sourceSummary: '开局已会 · 茂家旧招野生版', openCondition: '开局自带。', unlockText: '父亲留下的混元一气掌还在手上，只是现在更像没拆开的旧招。' },
  guard: { skillId: 'guard', initial: true, sourceSummary: '开局已会 · 野生抱架', openCondition: '开局自带。', unlockText: '你至少知道把手抬起来，脸不是公共靶位。' },
  retreat: { skillId: 'retreat', initial: true, sourceSummary: '开局已会 · 本能后撤', openCondition: '开局自带。', unlockText: '退一步不是认输，是先把自己从错误距离里救出来。' },
  talkdown: { skillId: 'talkdown', initial: true, sourceSummary: '开局已会 · 嘴上降温', openCondition: '开局自带。', unlockText: '不是每次冲突都值得打到底，嘴能省下不少医药费。' },
  dodge: { skillId: 'dodge', locationId: 'home', actionId: 'shadow', openCondition: '在出租屋完成影子拳节拍。', sourceSummary: '出租屋 · 影子拳节拍', unlockText: '你开始把身体挪出线外，而不是站在原地等答案。' },
  jab: { skillId: 'jab', locationId: 'boxing', actionId: 'bag', openCondition: '拳馆开放后，完成沙包连击。', sourceSummary: '拳馆 · 沙包连击', unlockText: '你开始用刺拳先碰距离，而不是一上来就把重心借出去。' },
  straight: { skillId: 'straight', locationId: 'boxing', actionId: 'bag', openCondition: '拳馆开放后，完成沙包连击。', sourceSummary: '拳馆 · 沙包连击', unlockText: '后手直拳有了中线和回收，终于不只是用力砸沙包。' },
  advance: { skillId: 'advance', source: 'planned', planned: true, sourceSummary: '后续由战斗手感组或系统组补真实来源', openCondition: '暂未接入真实训练来源。', unlockText: '待接入。' },
  lowkick: { skillId: 'lowkick', source: 'planned', planned: true, sourceSummary: '后续由战斗手感组或系统组补真实来源', openCondition: '暂未接入真实训练来源。', unlockText: '待接入。' },
  frontkick: { skillId: 'frontkick', source: 'planned', planned: true, sourceSummary: '后续由战斗手感组或系统组补真实来源', openCondition: '暂未接入真实训练来源。', unlockText: '待接入。' },
  palm: { skillId: 'palm', locationId: 'wuguan', actionId: 'pressure_test', openCondition: '武馆开放后，完成混元一气掌压力测试。', sourceSummary: '武馆 · 混元一气掌压力测试', unlockText: '掌根短击从招名里拆出来，变成近身时能落地的一下。' },
  offbalance: { skillId: 'offbalance', locationId: 'wuguan', actionId: 'pressure_test', openCondition: '武馆开放后，完成混元一气掌压力测试。', sourceSummary: '武馆 · 混元一气掌压力测试', unlockText: '你开始看见对方脚下的重心，而不是只盯着手上的动作。' },
  grip: { skillId: 'grip', locationId: 'mma', actionId: 'clinch_lab', openCondition: 'MMA 馆开放后，完成拳摔转换课。', sourceSummary: 'MMA 馆 · 拳摔转换课', unlockText: '你开始先拿到抓把，再谈把对方带到哪里。' },
  takedown: { skillId: 'takedown', locationId: 'mma', actionId: 'clinch_lab', openCondition: 'MMA 馆开放后，完成拳摔转换课。', sourceSummary: 'MMA 馆 · 拳摔转换课', unlockText: '抱摔不再只是冲进去撞运气，而是有入口和角度。' },
  sprawl: { skillId: 'sprawl', locationId: 'mma', actionId: 'sprawl_drill', openCondition: 'MMA 馆开放后，完成防摔判断课。', sourceSummary: 'MMA 馆 · 防摔判断课', unlockText: '对方降肩切入时，你知道先把髋收走。' },
  escape: { skillId: 'escape', locationId: 'mma', actionId: 'sprawl_drill', openCondition: 'MMA 馆开放后，完成防摔判断课。', sourceSummary: 'MMA 馆 · 防摔判断课', unlockText: '被压住不再只剩硬扛，你开始会找框架和出口。' },
  sidecontrol: { skillId: 'sidecontrol', source: 'planned', planned: true, sourceSummary: '后续由战斗手感组或系统组补真实来源', openCondition: '暂未接入真实训练来源。', unlockText: '待接入。' },
  dirtyescape: { skillId: 'dirtyescape', source: 'planned', planned: true, sourceSummary: '后续由战斗手感组或系统组补真实来源', openCondition: '暂未接入真实训练来源。', unlockText: '待接入。' },
  sanda_whip_kick: { skillId: 'sanda_whip_kick', locationId: 'sanda_gym', actionId: 'sanda_combo_drill', openCondition: 'Day 20 后散打馆开放，完成拳腿摔连贯课。', sourceSummary: '散打馆 · 拳腿摔连贯课', unlockText: '鞭腿接在拳距后面，不是单独摆一个好看的动作。' },
  sanda_catch_throw: { skillId: 'sanda_catch_throw', locationId: 'sanda_gym', actionId: 'sanda_combo_drill', openCondition: 'Day 20 后散打馆开放，完成拳腿摔连贯课。', sourceSummary: '散打馆 · 拳腿摔连贯课', unlockText: '对方回敬腿法时，你开始能把危险接成摔法机会。' },
  karate_reverse_punch: { skillId: 'karate_reverse_punch', locationId: 'karate_dojo', actionId: 'karate_kihon_drill', openCondition: 'Day 22 后空手道道场开放，完成基本功与组手线。', sourceSummary: '空手道道场 · 基本功与组手线', unlockText: '逆突有了启动、落点和收招，拳路越直，借口越少。' },
  karate_front_kick: { skillId: 'karate_front_kick', locationId: 'karate_dojo', actionId: 'karate_kihon_drill', openCondition: 'Day 22 后空手道道场开放，完成基本功与组手线。', sourceSummary: '空手道道场 · 基本功与组手线', unlockText: '前蹴开始像关门，不再只是把腿伸出去推远。' },
  tkd_roundhouse: { skillId: 'tkd_roundhouse', locationId: 'taekwondo_club', actionId: 'tkd_kick_line', openCondition: 'Day 24 后跆拳道社开放，完成腿法线训练。', sourceSummary: '跆拳道社 · 腿法线训练', unlockText: '横踢有了距离和落地，腿影不再只是好看。' },
  tkd_back_kick: { skillId: 'tkd_back_kick', locationId: 'taekwondo_club', actionId: 'tkd_kick_line', openCondition: 'Day 24 后跆拳道社开放，完成腿法线训练。', sourceSummary: '跆拳道社 · 腿法线训练', unlockText: '后踢从盲转变成反击，对方追进来时门会关上。' }
};

export const ITEMS = {
  rice: { name: '便利店饭团', icon: '饭', assetKey: 'item.rice', cat: '补给', price: 22, type: 'food', desc: '碳水，顶一阵。包装纸一撕，体力条暂时相信生活。', gain: { sp: 22, fatigue: -4 } },
  drink: { name: '运动饮料', icon: '饮', assetKey: 'item.drink', cat: '补给', price: 16, type: 'drink', desc: '糖和电解质，顺手给士气擦亮一点。不是神水，但比干扛强。', gain: { sp: 14, morale: 3 } },
  band: { name: '弹性绷带', icon: '绷', assetKey: 'item.band', cat: '补给', price: 45, type: 'medicine', desc: '临时压住小伤。它不治嘴硬，但能让关节少抱怨。', gain: { hp: 18, injury: -1 } },
  gloves: { name: '入门拳套', icon: '套', assetKey: 'item.gloves', cat: '正规装备', price: 220, type: 'equipment', slot: 'hand', desc: '拳类伤害更稳。至少让手知道自己今天上的是正经班。', eff: { strikeDmg: 0.08 } },
  shoes: { name: '防滑训练鞋', icon: '鞋', assetKey: 'item.shoes', cat: '正规装备', price: 260, type: 'equipment', slot: 'foot', desc: '步法和闪避更稳。脚底有数，撤退也有尊严。', eff: { spd: 2, dodge: 0.04 } },
  mouth: { name: '护齿', icon: '护', assetKey: 'item.mouth', cat: '正规装备', price: 160, type: 'equipment', slot: 'head', desc: '降低头部冲击后果。便宜的体面，贵的是牙医。', eff: { headRes: 0.08 } },
  notebook: { name: '训练笔记本', icon: '本', assetKey: 'item.notebook', cat: '训练工具', price: 90, type: 'equipment', slot: 'accessory', desc: '复盘更有条理。把挨过的打记下来，别让它白来。', eff: { jud: 2, auth: 2 } }
};

export const ENEMIES = {
  E01: { name: '半年拳击新人', icon: '拳', risk: '低', tags: ['正经训练', '拳距稳定', '基础可靠'], hp: 92, sp: 88, posture: 72, morale: 68, calm: 58, stats: { str: 42, end: 48, spd: 56, tec: 52, tou: 45, bal: 48, rea: 50, jud: 42 }, skills: ['jab', 'straight', 'guard', 'retreat'], ai: 'boxer', preferredRange: 'mid', aiProfile: { patience: 72, pressure: 32, grapple: 0, counter: 28, dirty: 0 }, reward: { money: 60, fame: 20 } },
  E02: { name: '公园推手大爷', icon: '掌', risk: '低', tags: ['近身控制', '平衡好', '速度偏低'], hp: 82, sp: 94, posture: 86, morale: 60, calm: 72, stats: { str: 38, end: 55, spd: 34, tec: 54, tou: 45, bal: 70, rea: 42, jud: 62 }, skills: ['advance', 'grip', 'offbalance', 'palm', 'guard'], ai: 'pushhand', preferredRange: 'close', aiProfile: { patience: 68, pressure: 56, grapple: 42, counter: 22, dirty: 0 }, reward: { money: 45, fame: 24 } },
  E03: { name: '流量大师学徒', icon: '玄', risk: '中', tags: ['外强中干', '话术高', '受击易崩'], hp: 76, sp: 78, posture: 62, morale: 88, calm: 48, stats: { str: 35, end: 38, spd: 42, tec: 40, tou: 35, bal: 38, rea: 39, jud: 45 }, skills: ['mystic', 'palm', 'talkdown', 'retreat'], ai: 'mystic', preferredRange: 'mid', aiProfile: { patience: 36, pressure: 42, grapple: 4, counter: 12, dirty: 18 }, reward: { money: 65, fame: 38 } },
  E04: { name: '健身硬汉挑战者', icon: '壮', risk: '中', tags: ['硬汉爆发', '体力衰退', '破绽大'], hp: 118, sp: 82, posture: 78, morale: 78, calm: 38, stats: { str: 64, end: 46, spd: 38, tec: 32, tou: 58, bal: 42, rea: 36, jud: 32 }, skills: ['straight', 'lowkick', 'advance', 'guard'], ai: 'brawler', preferredRange: 'close', aiProfile: { patience: 22, pressure: 78, grapple: 8, counter: 8, dirty: 12 }, reward: { money: 90, fame: 42 } },
  E05: { name: '拳馆陪练', icon: '练', risk: '中', tags: ['稳定陪练', '防守反击', '基础扎实'], hp: 110, sp: 105, posture: 88, morale: 68, calm: 72, stats: { str: 50, end: 58, spd: 52, tec: 60, tou: 54, bal: 55, rea: 57, jud: 58 }, skills: ['jab', 'straight', 'guard', 'dodge', 'lowkick'], ai: 'coach', preferredRange: 'mid', aiProfile: { patience: 75, pressure: 38, grapple: 4, counter: 58, dirty: 0 }, reward: { money: 105, fame: 48 } },
  E06: { name: 'MMA体验学员', icon: '摔', risk: '中', tags: ['拳摔转换', '抱摔威胁', '地面上位'], hp: 112, sp: 112, posture: 86, morale: 68, calm: 63, stats: { str: 52, end: 62, spd: 50, tec: 58, tou: 52, bal: 60, rea: 55, jud: 52 }, skills: ['advance', 'grip', 'takedown', 'sprawl', 'sidecontrol', 'escape', 'jab'], ai: 'grappler', preferredRange: 'close', aiProfile: { patience: 56, pressure: 64, grapple: 78, counter: 22, dirty: 0 }, reward: { money: 120, fame: 62 } },
  E07: { name: '木棍小混混', icon: '棍', risk: '高', tags: ['武器威胁', '街头不确定', '新伤风险'], hp: 90, sp: 82, posture: 70, morale: 80, calm: 58, stats: { str: 45, end: 42, spd: 46, tec: 28, tou: 42, bal: 40, rea: 43, jud: 30 }, skills: ['advance', 'dirtyescape', 'talkdown', 'straight'], ai: 'weapon', weapon: true, preferredRange: 'far', aiProfile: { patience: 28, pressure: 66, grapple: 0, counter: 6, dirty: 78 }, reward: { money: 35, fame: 72 } },
  E08: { name: '散打大学生', icon: '散', risk: '高', tags: ['远近转换', '低扫强', '冷静'], hp: 130, sp: 125, posture: 96, morale: 72, calm: 76, stats: { str: 58, end: 64, spd: 60, tec: 66, tou: 58, bal: 62, rea: 63, jud: 60 }, skills: ['jab', 'straight', 'lowkick', 'frontkick', 'sprawl', 'dodge'], ai: 'sanda', preferredRange: 'mid', aiProfile: { patience: 70, pressure: 58, grapple: 26, counter: 48, dirty: 0 }, reward: { money: 185, fame: 98 } },
  E09: { name: '地下赛试探者', icon: '黑', risk: '高', tags: ['街头不确定', '拳摔混合', '环境脏'], hp: 138, sp: 118, posture: 92, morale: 82, calm: 62, stats: { str: 62, end: 60, spd: 57, tec: 58, tou: 62, bal: 58, rea: 56, jud: 50 }, skills: ['straight', 'advance', 'grip', 'takedown', 'dirtyescape', 'lowkick'], ai: 'dirtymix', preferredRange: 'close', aiProfile: { patience: 44, pressure: 70, grapple: 62, counter: 20, dirty: 58 }, reward: { money: 260, fame: 125 } },
  E10: { name: '沉默拳击手', icon: '风', risk: '剧情', tags: ['真实拳距', '一阵风', '不配合演出'], hp: 100, sp: 100, posture: 90, morale: 70, calm: 85, stats: { str: 50, end: 55, spd: 62, tec: 62, tou: 52, bal: 55, rea: 64, jud: 60 }, skills: ['jab', 'straight', 'guard', 'retreat'], ai: 'boxer', preferredRange: 'mid', aiProfile: { patience: 78, pressure: 48, grapple: 0, counter: 68, dirty: 0 }, reward: { money: 0, fame: 0 }, script: 'first_wind' },
  E11: { name: '短视频挑战者阿豹', icon: '豹', risk: '中', tags: ['短视频信徒', '自信过量', '基础半桶水'], hp: 96, sp: 92, posture: 75, morale: 90, calm: 42, stats: { str: 45, end: 47, spd: 48, tec: 43, tou: 43, bal: 43, rea: 45, jud: 34 }, skills: ['straight', 'advance', 'mystic', 'retreat', 'talkdown'], ai: 'brawler', preferredRange: 'mid', aiProfile: { patience: 30, pressure: 72, grapple: 10, counter: 18, dirty: 8 }, reward: { money: 80, fame: 40 } },
  E18: { name: '陈见锋', icon: '陈', risk: '终局', tags: ['终局测试', '拳摔转换', '不吃嘴炮'], hp: 165, sp: 150, posture: 120, morale: 82, calm: 86, stats: { str: 68, end: 75, spd: 66, tec: 78, tou: 70, bal: 75, rea: 72, jud: 80 }, skills: ['jab', 'straight', 'frontkick', 'sprawl', 'advance', 'grip', 'takedown', 'guard', 'escape'], ai: 'boss', preferredRange: 'mid', aiProfile: { patience: 82, pressure: 64, grapple: 66, counter: 62, dirty: 0 }, reward: { money: 360, fame: 240 } },
  E19: { name: '散打馆新人王', icon: '散', risk: '中', tags: ['拳腿摔衔接', '节奏压迫', '接腿反制'], hp: 118, sp: 116, posture: 90, morale: 72, calm: 70, stats: { str: 54, end: 60, spd: 58, tec: 62, tou: 54, bal: 60, rea: 58, jud: 56 }, skills: ['jab', 'straight', 'sanda_whip_kick', 'sanda_catch_throw', 'sprawl', 'guard'], ai: 'sanda', preferredRange: 'mid', aiProfile: { patience: 62, pressure: 62, grapple: 34, counter: 46, dirty: 0 }, reward: { money: 135, fame: 66 } },
  E20: { name: '道场组手学员', icon: '空', risk: '中', tags: ['直线爆发', '收招规矩', '中线控制'], hp: 106, sp: 112, posture: 98, morale: 70, calm: 78, stats: { str: 50, end: 58, spd: 56, tec: 64, tou: 50, bal: 58, rea: 62, jud: 60 }, skills: ['karate_reverse_punch', 'karate_front_kick', 'guard', 'dodge', 'retreat'], ai: 'karate', preferredRange: 'mid', aiProfile: { patience: 76, pressure: 44, grapple: 4, counter: 62, dirty: 0 }, reward: { money: 125, fame: 62 } },
  E21: { name: '跆拳道校队替补', icon: '跆', risk: '中', tags: ['中远腿法', '反击后踢', '近身怕缠'], hp: 102, sp: 122, posture: 84, morale: 74, calm: 66, stats: { str: 48, end: 60, spd: 66, tec: 60, tou: 48, bal: 56, rea: 64, jud: 54 }, skills: ['tkd_roundhouse', 'tkd_back_kick', 'frontkick', 'dodge', 'retreat'], ai: 'taekwondo', preferredRange: 'far', aiProfile: { patience: 58, pressure: 50, grapple: 0, counter: 66, dirty: 0 }, reward: { money: 120, fame: 64 } }
};

export const ACTIONS = {
  home: [
    { id: 'fatty_review_together', name: '一起复盘', icon: '复', time: 25, sp: 0, desc: '刘胖子陪你把今天最容易上头的一拍讲清楚。话不长，能让脑子慢下来。', type: 'simple', npc: 'fatty', noDurationOptions: true, dailyGate: 'fatty_review', flags: { fatty_review_seen: true }, gain: { jud: 1, calm: 1, rel_fatty: 1 } },
    { id: 'fatty_today_advice', name: '问今日建议', icon: '问', time: 15, sp: 0, desc: '问刘胖子今天先别犯哪种蠢。建议很短，但够你少冲一次。', type: 'simple', npc: 'fatty', noDurationOptions: true, dailyGate: 'fatty_advice', flags: { fatty_advice_seen: true }, gain: { jud: 1, rel_fatty: 1 } },
    { id: 'father_incense', name: '给父亲上香', icon: '香', time: 20, sp: 0, desc: '把香插稳，不把今天的急劲带到父亲面前。', type: 'simple', npc: 'father', noDurationOptions: true, dailyGate: 'father_incense', flags: { father_incense_seen: true }, gain: { calm: 1 }, maw: { fatherMemory: 1 } },
    { id: 'father_self_check', name: '对父亲自省', icon: '省', time: 15, sp: 0, desc: '在旧照片前承认一句：有些动作不是勇，是莽。', type: 'simple', npc: 'father', noDurationOptions: true, dailyGate: 'father_self_check', flags: { father_self_check_seen: true }, gain: { jud: 1, calm: 1 }, maw: { fatherMemory: 1 } },
    { id: 'review', name: '视频复盘', icon: '复', time: 45, sp: 0, desc: '分析最近战斗，把“我刚才怎么飞出去的”整理成判断和技能细节。', type: 'simple', gain: { jud: 1, calm: 4, skill: 'jab', xp: 4 } },
    { id: 'shadow', name: '影子拳节拍', icon: '影', time: 50, sp: 12, desc: '轻训练，练直拳回收和步法节奏。影子不会还手，但它也不会夸你。', type: 'simple', gain: { skill: 'dodge', xp: 6, boxing: 4, fatigue: 6, fitXp: 2 } },
    { id: 'idle_blank', name: '发呆放空', icon: '空', time: 15, sp: 0, desc: '不刷视频，不加练，只让脑子从热度里退出来一点。可能想起父亲、写下几句日记，或收到朋友消息。', type: 'idle', noDurationOptions: true, gain: { calm: 1, fatigue: -1 } },
    { id: 'read_notes', name: '看训练笔记', icon: '本', time: 20, sp: 0, desc: '翻几页自己挨过的错，不把复盘变成新一轮硬练。笔记有用，但不能替你出汗。', type: 'idle', noDurationOptions: true, gain: { jud: 1, calm: 1 } },
    { id: 'scroll_short_video', name: '刷短视频', icon: '刷', time: 15, sp: 0, desc: '快速刷几条打假和训练片段，情绪会亮一点，判断也可能被带偏。适合消磨，不适合当训练。', type: 'idle', noDurationOptions: true, gain: { morale: 1, heat: 1, calm: -1 } },
    { id: 'message_friend', name: '给朋友发消息', icon: '讯', time: 20, sp: 0, desc: '给刘胖子或旧同学回几句，把今天说成人话。关系会暖一点，但不能靠连发消息刷进步。', type: 'idle', noDurationOptions: true, gain: { morale: 1, rel_fatty: 1 } },
    { id: 'simple_stretch', name: '简单拉伸', icon: '伸', time: 20, sp: 0, desc: '肩、髋、脚踝各活动一会。不是正式恢复，只是让下一件事别从僵硬开始。', type: 'idle', noDurationOptions: true, gain: { fatigue: -3, calm: 1 } },
    { id: 'online', name: '网上冲浪找资料', icon: '网', time: 35, sp: 3, desc: '刷新机会卡，提升真实性或发现迷货。信息海很大，别把泡沫当秘籍。', type: 'simple', gain: { auth: 2, heat: 1 } },
    { id: 'nap', name: '小睡恢复', icon: '睡', time: 60, sp: 0, desc: '恢复体力，降低疲劳。给身体一次不被打扰的停机维护。', type: 'simple', gain: { sp: 30, fatigue: -15 } },
    { id: 'sleep', name: '睡觉到明天', icon: '眠', time: 0, sp: 0, desc: '结束当天。太晚不睡，明天的身体会带着账本来找你。', type: 'sleep' }
  ],
  store: [
    { id: 'xiaoman_supply_hint', name: '听补给提醒', icon: '补', time: 10, sp: 0, desc: '小满扫一眼你包里的东西，提醒你别把补给当玄学。', type: 'simple', npc: 'xiaoman', noDurationOptions: true, dailyGate: 'xiaoman_supply_hint', flags: { xiaoman_supply_hint_seen: true }, gain: { jud: 1, rel_xiaoman: 1 } },
    { id: 'xiaoman_night_chat', name: '夜班短聊', icon: '夜', time: 20, sp: 0, desc: '夜班柜台前聊两句，把白天的硬撑放下一点。', type: 'simple', npc: 'xiaoman', noDurationOptions: true, dailyGate: 'xiaoman_night_chat', flags: { xiaoman_night_chat_seen: true }, gain: { calm: 1, fatigue: -2, rel_xiaoman: 1 } },
    { id: 'cashier', name: '便利店收银班', icon: '钱', time: 120, sp: 18, desc: '赚钱，遇到小满/刘胖子事件概率上升。扫码枪很轻，站两小时很重。', type: 'simple', gain: { money: 125, fatigue: 10, rel_xiaoman: 1 } },
    { id: 'carry', name: '搬货硬练', icon: '箱', time: 80, sp: 24, desc: '赚钱少一点，但力量、耐力和体能沉淀都会涨。纸箱沉默，收益诚实。', type: 'simple', gain: { money: 70, str: 1, end: 1, fitXp: 6, fatigue: 14 } },
    { id: 'chat_xiaoman', name: '和小满聊几句', icon: '聊', time: 25, sp: 0, desc: '分段对话。关系收益每日有限，别把聊天当连招搓。', type: 'dialog', npc: 'xiaoman' },
    { id: 'buy_local', name: '买便利店补给', icon: '购', time: 15, sp: 0, desc: '饭团、饮料、绷带。朴素三件套，专治“我还能撑”。', type: 'shop', cat: '补给' }
  ],
  metro_station: [
    { id: 'metro_observe', name: '观察通勤人流', icon: '看', time: 35, sp: 0, desc: '看距离、看动线、看冲突怎么在拥挤里发酵。人群不讲武德，但很讲空间。', type: 'simple', gain: { jud: 1, street: 4, calm: 2 } },
    { id: 'metro_short_video', name: '刷打假短视频', icon: '刷', time: 30, sp: 2, desc: '越刷越上头，越刷越想证明点什么。手机很亮，判断力会被照得有点虚。', type: 'simple', gain: { heat: 1, auth: -1, morale: 3 } },
    { id: 'metro_shadow_step', name: '站台步法小练', icon: '步', time: 25, sp: 6, desc: '不占人、不丢人，练一步进退。脚下能收住，心里才不容易乱冲。', type: 'simple', gain: { skill: 'retreat', xp: 4, jud: 1, fatigue: 3 } },
    { id: 'metro_breathe', name: '站边放空', icon: '空', time: 15, sp: 0, desc: '站到不挡路的边上，数几班车进站。城市还在推着人走，你先不跟它较劲。', type: 'idle', noDurationOptions: true, gain: { calm: 1, fatigue: -1 } },
    { id: 'metro_line_rumor', name: '听下一站线索', icon: '线', time: 40, sp: 0, desc: '听保安、学生和外卖骑手闲聊，城市的训练地点会先以传闻出现。线索不保证靠谱，但比硬闯强。', type: 'simple', gain: { auth: 2, fame: 4, rel_fatty: 1 } }
  ],
  worksite: [
    { id: 'brick_labor', name: '搬砖杂工', icon: '砖', time: 150, sp: 30, desc: '重活，钱多但疲劳重，体能沉淀扎实。砖块不会鼓掌，但会记重量。', type: 'simple', gain: { money: 180, str: 1, end: 1, tou: 1, fitXp: 10, fatigue: 26, heat: 1 } },
    { id: 'material_run', name: '运料短工', icon: '运', time: 100, sp: 24, desc: '来回搬运，耐力和速度都有一点。路线短，腿不这么觉得。', type: 'simple', gain: { money: 120, end: 1, spd: 1, fitXp: 8, fatigue: 18 } },
    { id: 'afterwork_mobility', name: '收工拉伸', icon: '松', time: 35, sp: 0, desc: '在工棚边活动肩髋，降低硬活后的僵硬。别让明天的你骂今天的你。', type: 'simple', gain: { fitXp: 2, fatigue: -8, calm: 3 } }
  ],
  park: [
    { id: 'spar_rookie', name: '开放验货局', icon: '验', time: 60, sp: 12, desc: '和拳击新人低风险切磋。适合确认动作能不能离开教程区。', type: 'battle', enemy: 'E01', risk: 1 },
    { id: 'observe_park', name: '围观不插手', icon: '看', time: 40, sp: 0, desc: '观察别人出招，提升判断。站远点也能学，前提是别站成裁判。', type: 'simple', gain: { jud: 1, calm: 3, auth: 1 } },
    { id: 'park_short_walk', name: '绕场短走', icon: '走', time: 20, sp: 0, desc: '不插手也不围上去，只绕着场边走一圈，把呼吸和脚步找回来。', type: 'idle', noDurationOptions: true, gain: { calm: 1, fatigue: -1 } },
    { id: 'poster', name: '帮拳馆贴海报', icon: '贴', time: 55, sp: 8, desc: '提升拳馆关系和名声。胶水味不浪漫，但名声会一点点粘上来。', type: 'simple', gain: { fame: 14, rel_coach: 1, money: 20 } },
    { id: 'push_old', name: '推手大爷交流', icon: '推', time: 55, sp: 10, desc: '低风险近身控制训练。大爷笑得慈祥，重心拆得很不慈祥。', type: 'battle', enemy: 'E02', risk: 1 }
  ],
  boxing: [
    { id: 'coach_one_correction', name: '一句纠错', icon: '纠', time: 20, sp: 0, desc: '梁教练只纠一处：打完别站着等夸。', type: 'simple', npc: 'coach', noDurationOptions: true, dailyGate: 'coach_one_correction', flags: { coach_one_correction_seen: true }, gain: { jud: 1, calm: 1, rel_coach: 1 } },
    { id: 'coach_gym_advice', name: '拳馆建议', icon: '议', time: 15, sp: 0, desc: '问梁教练今天该补哪一块。他没有长篇，只给你一个方向。', type: 'simple', npc: 'coach', noDurationOptions: true, dailyGate: 'coach_gym_advice', flags: { coach_gym_advice_seen: true }, gain: { jud: 1, rel_coach: 1 } },
    {
      id: 'bag',
      name: '沙包连击',
      icon: '沙',
      time: 75,
      sp: 22,
      cost: 18,
      desc: '完成连击，提升拳击技能。沙包不会躲，所以别因此产生天才错觉。',
      type: 'simple',
      minigame: {
        template: 'combo',
        prompt: '三轮沙包连击，重点不是打响，是让出拳、回收和脚步都在同一条线上。',
        rounds: [
          {
            cue: '沙包回摆到胸口高度，第一下要起手。',
            options: [
              { id: 'bag_range_jab', label: '半步找距再刺拳', text: '先让肩、髋和前脚对上，再把拳送出去。', score: 2, feedback: '距离找住了，刺拳不是伸手摸门铃。' },
              { id: 'bag_range_push', label: '原地直线推拳', text: '拳能碰到沙包，但身体没有跟上。', score: 1, feedback: '打中了，可重心还留在身后。' },
              { id: 'bag_range_swing', label: '抡肩抢第一响', text: '声音最大，回收最慢。', score: 0, feedback: '沙包响了，动作也散了。' }
            ]
          },
          {
            cue: '第二拍接直拳，沙包开始往右偏。',
            options: [
              { id: 'bag_cross_line', label: '后脚蹬地走中线', text: '让直拳穿过目标，不追沙包的外侧。', score: 2, feedback: '直拳走线干净，力量没有漏到肩膀外面。' },
              { id: 'bag_cross_follow', label: '跟着沙包补一拳', text: '能续上，但脚步被沙包牵着走。', score: 1, feedback: '节奏还在，方向感差一点。' },
              { id: 'bag_cross_chase', label: '探身追着砸', text: '身体先倒出去，拳才跟上。', score: 0, feedback: '这一拳像借出去的重心，很难收回来。' }
            ]
          },
          {
            cue: '组合结束，沙包反弹回来。',
            options: [
              { id: 'bag_exit_guard', label: '收拳退半步架住', text: '把结束动作也当成连击的一部分。', score: 2, feedback: '打完还能站住，这才像能拿去实战的组合。' },
              { id: 'bag_exit_reset', label: '原地抖肩重置', text: '能重新开始，但防守窗口偏大。', score: 1, feedback: '节奏回来了，防线还差半拍。' },
              { id: 'bag_exit_pose', label: '看一眼打得响不响', text: '确认成绩时，脸正好留在线上。', score: 0, feedback: '沙包不会还手，不代表对手也这么客气。' }
            ]
          }
        ]
      },
      gain: { skill: 'jab', xp: 8, skill2: 'straight', xp2: 6, boxing: 8, fatigue: 10, fitXp: 2 }
    },
    { id: 'coach_drill', name: '梁教练纠错', icon: '教', time: 80, sp: 18, cost: 35, desc: '指出技能配置和战斗问题。教练的嘴很硬，通常是因为他说得对。', type: 'dialog', npc: 'coach' },
    { id: 'heavybag', name: '重靶爆点', icon: '爆', time: 70, sp: 26, cost: 22, desc: '提升直拳和爆发，但疲劳高。打得越响，肩膀越会记仇。', type: 'simple', gain: { skill: 'straight', xp: 9, str: 1, fatigue: 16, fitXp: 3 } },
    { id: 'spar_partner', name: '拳馆陪练', icon: '练', time: 70, sp: 15, desc: '中风险实战。陪练会收力，但不会配合你演赢。', type: 'battle', enemy: 'E05', risk: 2 }
  ],
  wuguan: [
    { id: 'meet_master', name: '周青山拆招课', icon: '师', time: 60, sp: 8, desc: '传统不等于玄学，关键是压力测试。师傅不怕你问，就怕你只点头。', type: 'dialog', npc: 'master' },
    { id: 'pressure_test', name: '混元一气掌压力测试', icon: '压', time: 80, sp: 20, cost: 24, desc: '把花架子拆成可用动作。招名可以飞，落点必须落地。', type: 'simple', gain: { skill: 'palm', xp: 10, skill2: 'offbalance', xp2: 8, traditional: 10, auth: 2, fatigue: 10 } },
    { id: 'push_train', name: '近身推击训练', icon: '推', time: 70, sp: 19, cost: 18, desc: '提升掌根短击和破平衡。近身之后，浪漫会迅速让位给重心。', type: 'simple', gain: { skill: 'palm', xp: 8, traditional: 8, fatigue: 10 } },
    { id: 'old_spar', name: '武馆高徒轻对抗', icon: '切', time: 70, sp: 15, desc: '检验传统拆解是否可靠。讲理归讲理，手上也得交卷。', type: 'battle', enemy: 'E02', risk: 2 }
  ],
  mma: [
    {
      id: 'sprawl_drill',
      name: '防摔判断课',
      icon: '防',
      time: 70,
      sp: 20,
      cost: 28,
      desc: '根据对手动作选择防摔应对。膝盖落得快，尊严保得住。',
      type: 'simple',
      minigame: {
        template: 'read',
        prompt: '读对手重心，先守住髋，再决定下压、转角还是脱身。',
        rounds: [
          {
            cue: '对手肩线突然降低，前脚踩进来。',
            options: [
              { id: 'sprawl_read_hip', label: '先压头卡髋', text: '手先找到头和肩，髋往后撤。', score: 2, feedback: '第一拍挡在入口，对手很难吃到你的腿。' },
              { id: 'sprawl_read_step', label: '只往后跳一步', text: '距离拉开了，但手没有处理对方头位。', score: 1, feedback: '退得够快，可下一拍还得补手。' },
              { id: 'sprawl_read_punch', label: '低头挥拳截停', text: '眼睛丢了，髋也送上去了。', score: 0, feedback: '拳还没落，对方已经摸到腿了。' }
            ]
          },
          {
            cue: '对手抱住单腿，开始往内侧拧。',
            options: [
              { id: 'sprawl_single_whizzer', label: '沉髋做内夹和转角', text: '把腿变重，同时让身体转出正面线。', score: 2, feedback: '髋压住了，对方的角度被你抢回来。' },
              { id: 'sprawl_single_pull', label: '双手往上拔腿', text: '能争一点空间，但上身会被拉低。', score: 1, feedback: '暂时没倒，可你还在对方节奏里。' },
              { id: 'sprawl_single_hop', label: '单脚乱跳找平衡', text: '看起来顽强，其实每跳一下都更危险。', score: 0, feedback: '平衡被牵走，摔跤课变成跳房子。' }
            ]
          },
          {
            cue: '你把对手压到垫边，他开始换抱腰。',
            options: [
              { id: 'sprawl_wall_frame', label: '前臂架住转身离线', text: '先做框架，再把背从压力里转出去。', score: 2, feedback: '框架立住了，你不是靠蛮力逃出来的。' },
              { id: 'sprawl_wall_sprawl', label: '继续趴重压死', text: '能消耗对方，但自己也被钉在原地。', score: 1, feedback: '压得住一秒，下一秒还要会走。' },
              { id: 'sprawl_wall_push', label: '双手猛推胸口', text: '手伸直了，腰却暴露给对方。', score: 0, feedback: '这一推像邀请对方换抱腰。' }
            ]
          }
        ]
      },
      gain: { skill: 'sprawl', xp: 11, skill2: 'escape', xp2: 6, mma: 9, bal: 1, fatigue: 11, fitXp: 3 }
    },
    { id: 'ground_escape', name: '地面脱身课', icon: '脱', time: 80, sp: 24, cost: 34, desc: '提升脱身和地面冷静。被压住时，慌张通常是对手的第二个队友。', type: 'simple', gain: { skill: 'escape', xp: 10, mma: 9, bal: 1, fatigue: 14, fitXp: 3 } },
    { id: 'mma_spar', name: '开放垫子实战', icon: '垫', time: 75, sp: 16, desc: 'MMA 学员会主动抱摔。请提前和地面建立心理关系。', type: 'battle', enemy: 'E06', risk: 3 },
    { id: 'clinch_lab', name: '拳摔转换课', icon: '缠', time: 80, sp: 22, cost: 35, desc: '提升抓把、抱摔、前压。拳没打完，摔已经在路上。', type: 'simple', gain: { skill: 'grip', xp: 8, skill2: 'takedown', xp2: 6, mma: 10, fatigue: 15 } }
  ],
  sanda_gym: [
    { id: 'meet_coach_luo', name: '罗教练看你两眼', icon: '罗', time: 45, sp: 6, cost: 20, desc: '先看站架、距离和出手习惯。罗教练话不多，停顿通常比骂人还准。', type: 'dialog', npc: 'coach_luo' },
    {
      id: 'sanda_combo_drill',
      name: '拳腿摔连贯课',
      icon: '连',
      time: 80,
      sp: 24,
      cost: 36,
      desc: '刺拳逼反应，鞭腿打中段，接腿摔处理回敬。三段能连上，才算散打不是散着打。',
      type: 'simple',
      minigame: {
        template: 'combo',
        prompt: '把拳、腿、摔连成一条线。每一段都要给下一段留位置。',
        rounds: [
          {
            cue: '搭档抬手护头，你要用第一拍逼反应。',
            options: [
              { id: 'sanda_jab_draw', label: '刺拳点头线', text: '不求重，先让对方护手上来。', score: 2, feedback: '反应骗出来了，中段露出一条缝。' },
              { id: 'sanda_jab_power', label: '重拳直接压上', text: '有威胁，但后脚没准备起腿。', score: 1, feedback: '压力够了，转换慢了。' },
              { id: 'sanda_jab_wait', label: '等对面先动', text: '你把节奏交给了搭档。', score: 0, feedback: '散打不是站着等答案。' }
            ]
          },
          {
            cue: '中段露出来，搭档重心偏在前腿。',
            options: [
              { id: 'sanda_kick_body', label: '鞭腿打中段后落位', text: '踢完脚落在能接摔的位置。', score: 2, feedback: '腿法不是结尾，而是把对方送进下一步。' },
              { id: 'sanda_kick_low', label: '低扫前腿', text: '能破坏重心，但路线和本课目标有点散。', score: 1, feedback: '有效，但拳腿摔的链条短了一截。' },
              { id: 'sanda_kick_high', label: '高扫头部', text: '动作漂亮，回收风险也漂亮。', score: 0, feedback: '你把训练课踢成了集锦赌局。' }
            ]
          },
          {
            cue: '搭档抓住你的腿准备回敬。',
            options: [
              { id: 'sanda_catch_counter', label: '压肩转角接腿摔', text: '先破方向，再把对方带过中心线。', score: 2, feedback: '对方抓腿没变成机会，你把机会抢走了。' },
              { id: 'sanda_catch_pull', label: '硬把腿抽回来', text: '能脱出一点，但上身容易被追。', score: 1, feedback: '退出来了，主动权没完全回来。' },
              { id: 'sanda_catch_spin', label: '转身乱摆脱', text: '背先给出去，摔法课会很高兴。', score: 0, feedback: '这一转把危险写在背上。' }
            ]
          },
          {
            cue: '摔法完成后，你还站着，对方在垫上。',
            options: [
              { id: 'sanda_finish_guard', label: '退半步架住等口令', text: '完成技术后保留规则意识和距离。', score: 2, feedback: '收尾干净，训练像训练，实战也能迁移。' },
              { id: 'sanda_finish_touch', label: '伸手确认对方状态', text: '态度好，但距离管理松了。', score: 1, feedback: '安全意识有了，站位还要更职业。' },
              { id: 'sanda_finish_pose', label: '原地庆祝这一摔', text: '练成一段，丢掉下一段。', score: 0, feedback: '庆祝太早，坏习惯也会被练进去。' }
            ]
          }
        ]
      },
      gain: { skill: 'sanda_whip_kick', xp: 10, skill2: 'sanda_catch_throw', xp2: 7, sanda: 10, bal: 1, fatigue: 13, fitXp: 3 }
    },
    { id: 'sanda_ring_spar', name: '散打馆实战轮', icon: '擂', time: 75, sp: 16, desc: '新人王会用拳腿把你赶到合适位置，再找接腿和摔法。别只盯拳头，腿也会写计划。', type: 'battle', enemy: 'E19', risk: 2 }
  ],
  karate_dojo: [
    { id: 'meet_senpai_yan', name: '严前辈带入门礼', icon: '严', time: 40, sp: 4, cost: 18, desc: '从行礼、站距和第一拳开始。规矩不是摆样子，是让你知道哪里不能乱。', type: 'dialog', npc: 'senpai_yan' },
    {
      id: 'karate_kihon_drill',
      name: '基本功与组手线',
      icon: '线',
      time: 75,
      sp: 21,
      cost: 32,
      desc: '反复练前蹴和逆突，找中线、收髋和回手。道场里最吵的东西，往往是你的脚步。',
      type: 'simple',
      minigame: {
        template: 'read',
        prompt: '道场不只练动作形状。你要读中线、距离和收招，别把基本功练成摆拍。',
        rounds: [
          {
            cue: '对练者前手轻点，试探你的中线。',
            options: [
              { id: 'karate_line_cover', label: '小幅拨开守中线', text: '动作不大，但手还在回击路线上。', score: 2, feedback: '线守住了，下一拳才有资格谈速度。' },
              { id: 'karate_line_block', label: '大幅格挡到外侧', text: '挡得明显，回手路线也变长。', score: 1, feedback: '安全了半拍，反击慢了半拍。' },
              { id: 'karate_line_flinch', label: '闭眼后撤', text: '距离有了，判断没了。', score: 0, feedback: '你离开了拳，也离开了机会。' }
            ]
          },
          {
            cue: '教练喊前蹴，目标是对方腹线。',
            options: [
              { id: 'karate_kick_chamber', label: '提膝收髋再前蹴', text: '腿从身体中线出去，落地能继续打。', score: 2, feedback: '前蹴像尺子，不像踢门。' },
              { id: 'karate_kick_push', label: '脚掌直接推远', text: '能推开人，但髋和膝没有组织好。', score: 1, feedback: '距离做出来了，技术质量一般。' },
              { id: 'karate_kick_swing', label: '甩腿扫过去', text: '路线偏了，回收也慢。', score: 0, feedback: '这一脚像临时改行练腿法杂技。' }
            ]
          },
          {
            cue: '逆突命中后，教练盯着你的回手。',
            options: [
              { id: 'karate_punch_recover', label: '髋回正手回腮边', text: '把力量收回来，也把防线收回来。', score: 2, feedback: '收招利落，下一次启动才不会拖泥带水。' },
              { id: 'karate_punch_hold', label: '拳停在目标上确认', text: '命中感清楚，但停得太久。', score: 1, feedback: '知道打到了，还要知道什么时候走。' },
              { id: 'karate_punch_drop', label: '打完手自然垂下', text: '身体放松了，防线也放假了。', score: 0, feedback: '教练的沉默，比骂人还清楚。' }
            ]
          }
        ]
      },
      gain: { skill: 'karate_reverse_punch', xp: 10, skill2: 'karate_front_kick', xp2: 8, karate: 10, tec: 1, fatigue: 11, auth: 1 }
    },
    { id: 'karate_kumite', name: '道场组手', icon: '组', time: 70, sp: 15, desc: '中风险对抗，学会在规矩里抓时机。对方不会乱冲，但你乱冲会很快被纠正。', type: 'battle', enemy: 'E20', risk: 2 }
  ],
  taekwondo_club: [
    { id: 'meet_coach_min', name: '闵教练测腿距', icon: '闵', time: 45, sp: 6, cost: 20, desc: '先测柔韧、步伐和回收。腿抬得高只是门票，能安全落地才是课程。', type: 'dialog', npc: 'coach_min' },
    {
      id: 'tkd_kick_line',
      name: '腿法线训练',
      icon: '腿',
      time: 75,
      sp: 23,
      cost: 34,
      desc: '横踢打节奏，后踢抓追击。每一次转身都要知道对面在哪里，不然就是把背卖得很认真。',
      type: 'simple',
      minigame: {
        template: 'combo',
        prompt: '腿法线训练看的是起腿、落地和转身后的视线。踢得高不等于练得对。',
        rounds: [
          {
            cue: '靶手横移一步，把中段靶露出来。',
            options: [
              { id: 'tkd_round_step', label: '垫步横踢打中段', text: '先跟上距离，再让腿走弧线。', score: 2, feedback: '距离和节奏对上了，腿法不是伸长去够。' },
              { id: 'tkd_round_static', label: '原地抬腿够靶', text: '能碰到靶，但髋没完全送到。', score: 1, feedback: '打到了，身体没完全支持这一脚。' },
              { id: 'tkd_round_high', label: '强行改踢头靶', text: '目标变花，落地也乱。', score: 0, feedback: '这不是惊喜，是计划失踪。' }
            ]
          },
          {
            cue: '靶手突然前压，逼你后退。',
            options: [
              { id: 'tkd_back_check', label: '看肩线后踢截进身', text: '先确认对方进线，再用后踢打进路。', score: 2, feedback: '转身前有判断，背才不是白送。' },
              { id: 'tkd_back_space', label: '后撤再起腿', text: '安全但反击窗口变小。', score: 1, feedback: '你守住了距离，威胁少了一点。' },
              { id: 'tkd_back_blind', label: '盲转后踢赌一下', text: '帅气建立在没看见的风险上。', score: 0, feedback: '这一脚像把答案交给运气。' }
            ]
          },
          {
            cue: '连续两脚后，支撑脚开始发飘。',
            options: [
              { id: 'tkd_reset_guard', label: '落地架住小碎步重置', text: '让脚下重新有根，再进下一轮。', score: 2, feedback: '重置不丢人，乱踢才丢训练质量。' },
              { id: 'tkd_reset_skip', label: '小跳调整再踢', text: '能维持节奏，但稳定性一般。', score: 1, feedback: '节奏没断，脚底还没完全稳。' },
              { id: 'tkd_reset_chain', label: '硬接第三脚', text: '动作连上了，身体没跟上。', score: 0, feedback: '连续不是目的，可控才是。' }
            ]
          }
        ]
      },
      gain: { skill: 'tkd_roundhouse', xp: 10, skill2: 'tkd_back_kick', xp2: 7, taekwondo: 10, spd: 1, fatigue: 12, fitXp: 3 }
    },
    { id: 'tkd_club_spar', name: '跆拳道社实战', icon: '社', time: 70, sp: 15, desc: '中远距离腿法对抗。贴太近会乱，退太远会被横踢提醒。', type: 'battle', enemy: 'E21', risk: 2 }
  ],
  gym: [
    {
      id: 'gym_basic',
      name: '基础循环训练',
      icon: '循',
      time: 70,
      sp: 20,
      cost: 25,
      desc: '深蹲、推、拉、核心和跑台串成一轮。没花招，只有账单和心率。',
      type: 'simple',
      minigame: {
        template: 'pacing',
        prompt: '根据呼吸、动作质量和心率安排下一组。练得狠不等于练得明白。',
        rounds: [
          {
            cue: '深蹲组结束，腿还稳，呼吸有点急。',
            options: [
              { id: 'gym_squat_rotate', label: '换推的动作，降一点心率', text: '肌群轮换，训练密度还在。', score: 2, feedback: '节奏稳住了，身体有机会把质量做出来。' },
              { id: 'gym_squat_repeat', label: '原重量再蹲一组', text: '强度够，但动作质量开始吃紧。', score: 1, feedback: '能扛，但后半程可能变形。' },
              { id: 'gym_squat_max', label: '直接加重量冲一下', text: '热血很足，计划很少。', score: 0, feedback: '基础循环不是今天把自己拆开。' }
            ]
          },
          {
            cue: '推的动作后，肩膀发紧，核心还能撑住。',
            options: [
              { id: 'gym_push_pull', label: '转拉的动作平衡肩背', text: '用下一组把关节位置找回来。', score: 2, feedback: '推拉平衡，肩膀没有被情绪牵着走。' },
              { id: 'gym_push_core', label: '先做核心撑住', text: '稳妥，但上肢疲劳没有完全调开。', score: 1, feedback: '能过渡，效率一般。' },
              { id: 'gym_push_more', label: '继续推到力竭', text: '这会很有感觉，明天也会。', score: 0, feedback: '力竭不是不能练，是不能拿来当默认答案。' }
            ]
          },
          {
            cue: '跑台间歇前，心率已经偏高。',
            options: [
              { id: 'gym_run_interval', label: '缩短冲刺，保留走跑间歇', text: '让强度留在可控区间。', score: 2, feedback: '你把训练推到边缘，但没有推下去。' },
              { id: 'gym_run_walk', label: '改成轻跑收尾', text: '恢复更稳，刺激少一点。', score: 1, feedback: '保守但不坏，今天至少没有练崩。' },
              { id: 'gym_run_sprint', label: '照原计划全速冲', text: '计划没有听见身体报警。', score: 0, feedback: '跑台很诚实，你的呼吸也很诚实。' }
            ]
          }
        ]
      },
      gain: { str: 1, end: 1, bal: 1, fitXp: 10, fatigue: 12 }
    },
    { id: 'treadmill', name: '跑台间歇', icon: '跑', time: 50, sp: 16, cost: 15, desc: '按心率做间歇跑，提升耐力和速度。跑台不通向远方，但通向喘。', type: 'simple', gain: { end: 1, spd: 1, fitXp: 8, fatigue: 10 } },
    { id: 'core_balance', name: '核心稳定', icon: '核', time: 45, sp: 12, cost: 15, desc: '平板、抗旋转和单腿稳定。核心强了，被推时少一些即兴舞蹈。', type: 'simple', gain: { bal: 1, tou: 1, fitXp: 5, fatigue: 8 } },
    { id: 'mobility', name: '拉伸放松', icon: '松', time: 35, sp: 0, cost: 10, desc: '训练日收尾用，降低疲劳。动作轻，但明天会感谢你。', type: 'simple', gain: { fitXp: 2, fatigue: -10, calm: 4 } }
  ],
  street: [
    { id: 'investigate', name: '调查短视频大师', icon: '查', time: 70, sp: 10, desc: '推进真实性线索，但提高热度。真相会来，围观群众也会。', type: 'simple', gain: { auth: 4, heat: 2, fame: 10 }, risk: 1 },
    { id: 'oldtown_watch', name: '街头观察', icon: '眼', time: 45, sp: 0, desc: '练判断和撤离，不主动惹事。看懂路口，比看懂狠话更值钱。', type: 'simple', gain: { jud: 1, street: 8, calm: 2 } },
    { id: 'night_work', name: '夜间零工', icon: '夜', time: 100, sp: 22, desc: '赚钱但疲劳和风险高。夜里来钱快，第二天也很会追债。', type: 'simple', gain: { money: 155, fatigue: 24, heat: 1, fitXp: 4 }, risk: 2 },
    { id: 'weapon_event', name: '便利店外冲突', icon: '危', time: 60, sp: 10, desc: '高风险，可撤离或控制局面。木棍不是剧情道具，别把它当玩笑。', type: 'battle', enemy: 'E07', risk: 4 }
  ],
  physio: [
    { id: 'massage', name: '理疗恢复', icon: '疗', time: 70, sp: 0, cost: 75, desc: '花钱降低疲劳和伤病。师傅一按，身体开始供出问题。', type: 'simple', gain: { hp: 25, fatigue: -28, injury: -1 } },
    { id: 'ice', name: '冰敷拉伸', icon: '冰', time: 45, sp: 0, cost: 28, desc: '便宜恢复，效果温和。冷得清醒，疼得有分寸。', type: 'simple', gain: { hp: 12, fatigue: -15 } },
    { id: 'breath', name: '呼吸冷静训练', icon: '息', time: 40, sp: 0, cost: 12, desc: '冷静和士气恢复。先把气喘匀，再决定是不是继续嘴硬。', type: 'simple', gain: { calm: 10, morale: 5, fatigue: -5 } }
  ]
};

export const NPCS = {
  fatty: { name: '刘胖子', icon: '胖' },
  coach: { name: '梁教练', icon: '梁' },
  master: { name: '周青山', icon: '周' },
  xiaoman: { name: '小满', icon: '满' },
  chen: { name: '陈见锋', icon: '陈' },
  coach_luo: { name: '罗教练', icon: '罗' },
  senpai_yan: { name: '严前辈', icon: '严' },
  coach_min: { name: '闵教练', icon: '闵' },
  father: { name: '父亲', icon: '父', hidden: true },
  abao: { name: '阿豹', icon: '豹' },
  oldman: { name: '推手大爷', icon: '推' }
};

export const NPC_DIALOGUES = {
  fatty: [
    { speaker: '刘胖子', text: '别把名声当命。先看清对面是谁，再决定接不接。' },
    { speaker: '陆小闲', text: '你这是关心我，还是怕我倒了没人请你吃粉？' },
    { speaker: '刘胖子', text: '都怕。做人要全面。' }
  ],
  coach: [
    { speaker: '梁教练', text: '你最大的问题不是不会打。是打完停在原地等人点评。' },
    { speaker: '陆小闲', text: '我以为那叫气势。' },
    { speaker: '梁教练', text: '那叫给对面续杯。手回来，人也要能动。' }
  ],
  master: [
    { speaker: '周青山', text: '传统不是不能用，是不能只剩名字。' },
    { speaker: '陆小闲', text: '那茂家拳还剩什么？' },
    { speaker: '周青山', text: '放到压力里。剩下的，再谈传承。' }
  ],
  xiaoman: [
    { speaker: '小满', text: '真遇到麻烦，能走就走。便利店货架都懂这个道理。' },
    { speaker: '陆小闲', text: '货架懂什么？' },
    { speaker: '小满', text: '懂你上次那一掌，赔得不算贵。' }
  ],
  chen: [
    { speaker: '陈见锋', text: '第30天来拳馆。' },
    { speaker: '陆小闲', text: '提前透露考试范围吗？' },
    { speaker: '陈见锋', text: '范围很小。压力下，你到底会做什么。' }
  ],
  coach_luo: [
    { speaker: '罗教练', text: '散打不是散着打。拳、腿、摔要连成一句话。' },
    { speaker: '陆小闲', text: '中间断了呢？' },
    { speaker: '罗教练', text: '对面会替你补标点。通常是感叹号。' }
  ],
  senpai_yan: [
    { speaker: '严前辈', text: '规矩不是摆样子。站距、收手、停住，都算。' },
    { speaker: '陆小闲', text: '听起来比挨打还累。' },
    { speaker: '严前辈', text: '规矩里能收住，出了规矩才不容易乱。' }
  ],
  coach_min: [
    { speaker: '闵教练', text: '腿法的重点不是抬多高。' },
    { speaker: '陆小闲', text: '那短视频可能要失望。' },
    { speaker: '闵教练', text: '短视频不负责你落地。距离错了，漂亮没用。' }
  ],
  father: [
    { speaker: '父亲', text: '真要保护人，就去学真东西。' },
    { speaker: '父亲', text: '输了不丢人。乱欺负人才丢人。' }
  ],
  abao: [
    { speaker: '阿豹', text: '我刷到你了。你说祖传，我说秘传。' },
    { speaker: '陆小闲', text: '今天是传统文化交流？' },
    { speaker: '阿豹', text: '今天看看谁先露馅。' }
  ],
  oldman: [
    { speaker: '推手大爷', text: '推手不是把人推出去。' },
    { speaker: '陆小闲', text: '那是什么？' },
    { speaker: '推手大爷', text: '先把自己站明白。你现在像赶末班车。' }
  ]
};

export const MAIN_EVENTS = {
  1: {
    title: '给父亲上香',
    loc: 'home',
    npc: 'father',
    shortDesc: '香灰落下，你把父亲的话听歪了一点。',
    sceneSummary: '出租屋上香。父亲留下的是“不争强好胜”，你听见的却是“要证明茂家拳”。',
    hook: '今天先把香插正，再承认自己想赢。',
    desc: '出租屋窗台很窄，香灰很轻。你看着父亲的照片，忽然很想把“别争强”听成“别输”。',
    kind: 'dialog',
    dialogue: [
      { speaker: '陆小闲', text: '爸，香我上了。果盘也摆正了。' },
      { speaker: '父亲', text: '习武之人，绝不争强好胜。' },
      { speaker: '陆小闲', text: '我懂。就是……总不能让人觉得茂家拳没用吧？' },
      { speaker: '旁白', text: '香灰轻轻一落，你把遗训拐了个弯。' }
    ],
    eventNotebook: {
      reason: '出租屋上香',
      entry: '香灰落得很慢。你看着父亲牌位旁那句“习武之人，绝不争强好胜”，心里却还憋着一口想证明的气。',
      beats: [
        '你认真把香插正，动作像在做一件很大的事，虽然香炉其实是旧饭碗。',
        '父亲的话没有变，你的理解却偷偷拐了个弯。',
        '30天从这里开始。不是得到新招，而是先承认自己还想把这件事学明白。'
      ],
      actionLabel: '把香上完',
      actionText: '先别急着证明茂家拳，至少把香插直。',
      outcome: '你不是在求神，是在承认自己还想学明白。父亲的照片没有回答，但房间安静了一点。'
    },
    maw: { fatherMemory: 2, belief: 2, misread: 1 },
    choices: [
      { id: 'day1_incense_sincere', label: '认真上香', text: '你把香插正，把果盘摆稳。热血还在，但总算没有抢在父亲的话前面。', hint: '不解锁新技能，获得一点冷静和真实性。', gain: { calm: 2, auth: 1 }, flags: { flag_day1_incense: true, day1_incense_sincere: true }, log: '你认真给父亲上香。香灰很轻，但你第一次觉得这件事不只是热血开场。' },
      { id: 'day1_incense_promise', label: '把话说清楚', text: '你小声保证：不是去逞强，是想把茂家拳里真的东西找出来。说完你自己也觉得这话需要日后验货。', hint: '不解锁新技能，获得一点判断和真实性。', gain: { jud: 1, auth: 1 }, flags: { flag_day1_incense: true, day1_incense_promise: true }, log: '你在牌位前把话说清楚：先学明白，再谈证明。' },
      { id: 'day1_incense_showy', label: '补一个抱拳', text: '你对着牌位抱拳，动作很满，出租屋很小。父亲应该不会骂你，但大概率会让你先把椅子扶正。', hint: '不解锁新技能，获得一点热度，也留下误读的开端。', gain: { heat: 1, auth: 1 }, flags: { flag_day1_incense: true, day1_incense_showy: true }, log: '你把仪式做得很有气势。椅子差点被你碰倒，茂家拳的现实第一课来得很近。' }
    ]
  },
  2: {
    title: '地铁见义勇为',
    loc: 'metro_station',
    npc: 'fatty',
    shortDesc: '地铁不是擂台，重点是把事收住。',
    sceneSummary: '早高峰冲突被挤到你面前。你要做的不是赢谁，而是让车厢别变坏。',
    hook: '今天的目标：控制升级，不抢英雄镜头。',
    desc: '车门提示音响了三遍。没人真的想看擂台，只想这趟车别出事。',
    kind: 'dialog',
    dialogue: [
      { speaker: '陆小闲', text: '别推人，站稳说。' },
      { speaker: '刘胖子', text: '你先别把“站出来”和“冲上去”写成同一个词。' },
      { speaker: '旁白', text: '这里没有铃声。只有监控、人群，和一件需要收场的事。' }
    ],
    eventNotebook: {
      reason: '地铁站见义勇为',
      entry: '地铁车厢里人挤得像一口没换气的锅。有人争执，有人后退，你的肩膀很想先替脑子做决定。',
      beats: [
        '你站出去挡了一下，但没有把车厢当成擂台。',
        '站务、距离、退路和声音大小，全都比招名更具体。',
        '场面被压住了。里面有判断，也有一点运气。甜的是别人夸你，麻烦的是你差点也信了。'
      ],
      actionLabel: '听刘胖子复盘',
      actionText: '别急着把偶然当神功，先把“控制”和“收场”分清。',
      outcome: '见义勇为是真的，误判也是真的。你没有打倒谁，但地铁还像地铁，这已经比三秒钟的帅更值钱。'
    },
    maw: { belief: 1, misread: 2 },
    choices: [
      { id: 'day2_metro_control', label: '侧身挡住升级路线', text: '你站到侧面，给被推的人留退路，也把对方的前压路线卡住。动作不大，但人群终于有地方散开。', hint: '偏判断和冷静，少量真实性。', gain: { jud: 2, calm: 1, auth: 1 }, flags: { flag_day2_metro: true, day2_metro_control: true }, log: '你在地铁站先控距离，再控声音。事情没有变成打架，这次算处理得像回事。' },
      { id: 'day2_metro_staff', label: '先喊站务', text: '你没有抢着当主角，而是把站务和周围乘客都拉进来。对方发现自己不是在跟你单挑，火就短了一截。', hint: '偏冷静和判断，避免热度上升。', gain: { calm: 2, jud: 1, auth: 1 }, flags: { flag_day2_metro: true, day2_metro_staff: true }, log: '你先喊站务，把冲突从“谁更狠”拉回“怎么收场”。' },
      { id: 'day2_metro_loud', label: '嗓门压过去', text: '你吼了一句，车厢安静了半秒。有效，但有效得有点危险；监控和围观群众会替你剪出十二个版本。', hint: '获得一点名声，但热度上升。', gain: { fame: 1, heat: 1, jud: 1 }, flags: { flag_day2_metro: true, day2_metro_loud: true }, log: '你用嗓门把场面压住了。赢了三秒钟，也把自己送进了围观群众的素材库。' }
    ]
  },
  3: {
    title: '便利店货架事件',
    loc: 'store',
    npc: 'xiaoman',
    shortDesc: '你把泡面货架前的停顿看成了胜利。',
    sceneSummary: '便利店过道太窄，你误把一个普通动作读成威胁。小满看见了，也看穿了。',
    hook: '今天要分清保护和抢戏。',
    desc: '便利店的过道很窄。对方肩膀一沉，你以为是起手，三秒后发现他只是想绕开泡面货架。',
    kind: 'dialog',
    dialogue: [
      { speaker: '陆小闲', text: '我以为他要冲你来。' },
      { speaker: '小满', text: '他只是想拿泡面。你刚才像要替酸辣牛肉面出头。' },
      { speaker: '小满', text: '我知道。所以我才没笑太大声。' },
      { speaker: '旁白', text: '货架没倒，面子倒得很整齐。' }
    ],
    eventNotebook: {
      reason: '便利店货架误判',
      entry: '便利店货架窄得不适合英雄登场。你一掌拍下去，薯片袋震了三下，场面比伤害更响。',
      beats: [
        '你想把地铁那点误判延续下去，结果先让货架替现实开口。',
        '小满没有当众拆穿，只提醒你便利店不是擂台，货架也不是护具。',
        '你的脸有点热，手掌也有点疼。最疼的是，你刚才还觉得自己控住了场。'
      ],
      actionLabel: '把话听完',
      actionText: '先别解释“控场”，听小满把现实边界讲清楚。',
      outcome: '便利店没有给你擂台感，只给了你一个更具体的问题：保护别人之前，别先把现场搞乱。'
    },
    maw: { misread: 2 },
    choices: [
      { id: 'day3_store_ask_first', label: '先问一句', text: '你把手放低，先问对方是不是要过去。小满退到收银台后，泡面也保住了自己的清白。', hint: '关系提升，获得一点冷静和真实性。', gain: { calm: 1, auth: 1, rel_xiaoman: 1 }, flags: { flag_day3_store_shelf: true, day3_store_ask_first: true }, log: '你先问清楚，再让小满后退。便利店还像便利店，小满看你的眼神也没那么想报警。' },
      { id: 'day3_store_shelf_between', label: '挡住货架边线', text: '你没有抢着出手，只把自己放在货架外侧，给小满和对方都留出能走的路。', hint: '偏判断，关系小幅提升。', gain: { jud: 1, auth: 1, rel_xiaoman: 1 }, flags: { flag_day3_store_shelf: true, day3_store_shelf_between: true }, log: '你用位置而不是招式处理了便利店过道。没有赢谁，但事情没有乱起来。' },
      { id: 'day3_store_show_form', label: '摆出祖传架势', text: '你把架势摆满，对方愣住，薯片也愣住。三秒后，小满替你把“胜利”翻译成“别挡着补货”。', hint: '误判胜利发酵，热度上升。', gain: { heat: 1, rel_xiaoman: -1 }, flags: { flag_day3_store_shelf: true, day3_store_show_form: true }, log: '你误把愣住当成震慑。货架没倒，面子倒得很整齐，小满决定晚点再跟你算这笔现实账。' }
    ]
  },
  4: {
    title: '工棚里的第一拳',
    loc: 'worksite',
    npc: 'fatty',
    shortDesc: '有人看见你会拳，你也看见手腕在疼。',
    sceneSummary: '工棚玩笑点到茂家拳，你被“被看见”点燃，又被手腕的疼拉回现实。',
    hook: '今天的目标：别把兴奋打成事故。',
    desc: '工棚门口的铁皮被风吹得发响。有人拿一句玩笑试你的脾气，你的手腕先替你疼了一下。',
    kind: 'dialog',
    dialogue: [
      { speaker: '工友', text: '听说你会祖传拳？那砖头能不能少搬两趟？' },
      { speaker: '陆小闲', text: '我就是来干活的。' },
      { speaker: '刘胖子', text: '手腕疼就别装没事。饭碗比面子贵。' },
      { speaker: '旁白', text: '你被看见了，也被疼痛按住了。' }
    ],
    eventNotebook: {
      reason: '工棚里的第一拳',
      entry: '工棚里灰尘重，玩笑也重。你站在铁皮棚阴影下，感觉所有人都在等你证明点什么。',
      beats: [
        '有人拿茂家拳开玩笑，你先听见了面子受损，后听见了饭碗和工具都在旁边。',
        '第一拳真正难的地方，不是打得多重，而是知道它该不该出现。',
        '刘胖子没有夸你。他只是把手套扔过来，说活还没干完。'
      ],
      actionLabel: '把手套戴好',
      actionText: '先把火气放回袖口里，别让工棚替你的面子买单。',
      outcome: '你没有赢下什么场面，只是让一个本来会变坏的早晨继续像早晨。父亲那句“不争强好胜”突然具体了一点。'
    },
    maw: { fatherMemory: 1, misread: 1 },
    choices: [
      { id: 'day4_worksite_swallow_joke', label: '把玩笑咽下去', text: '你笑了一下，接过手套。那笑不算好看，但至少没有把工棚推成擂台。', hint: '偏冷静和父亲记忆，误判轻微沉淀。', gain: { calm: 1, jud: 1 }, flags: { flag_day4_worksite_first_punch: true, day4_worksite_swallow_joke: true }, log: '你在工棚里忍住了第一拳。手心很热，早晨没有变成事故。' },
      { id: 'day4_worksite_step_between', label: '站到工具架外侧', text: '你往旁边挪半步，先把工具架和人隔开。动作小得没人鼓掌，但冲突少了一个能砸响的理由。', hint: '偏判断和冷静，少量真实性。', gain: { jud: 1, calm: 1, auth: 1 }, flags: { flag_day4_worksite_first_punch: true, day4_worksite_step_between: true }, log: '你用站位处理了工棚里的火气。第一拳没有出现，第一课倒是出现了。' },
      { id: 'day4_worksite_show_knuckle', label: '攥拳吓回去', text: '你把拳头攥出来，对方安静了半秒。有效，但刘胖子看你的眼神像在估算医药费和误工费。', hint: '误判加深，获得一点名声但热度上升。', gain: { fame: 1, heat: 1 }, flags: { flag_day4_worksite_first_punch: true, day4_worksite_show_knuckle: true }, log: '你在工棚里用拳头换来半秒安静。那半秒很像胜利，也很像误会。' }
    ]
  },
  5: {
    title: '公园第一次验货',
    loc: 'park',
    enemy: 'E01',
    shortDesc: '公园验货，不是 KO，是看动作会不会散。',
    sceneSummary: '低风险切磋只验拳距、抱架和回收。对方不邪门，只是基础比嘴硬可靠。',
    hook: '今天别追 KO，先确认自己哪里漏风。',
    desc: '公园地砖有点潮。对方戴着旧拳套，站距比话更实在。',
    kind: 'battle',
    eventNotebook: {
      reason: '第一次实战验货',
      entry: '公园地砖有点潮，晨练的人把音箱声压得很低。对面的人戴着旧拳套，说话不重，站距却很实在。',
      beats: [
        '你先摸距离，不抢重拳；用刺拳试反应，再把抱架收紧。',
        '这不是英雄时刻，是把动作放进轻压里看看会不会散。',
        '基础不吵，但它会在每一次回收和换步里算账。'
      ],
      actionLabel: '进场验货',
      actionText: '先看拳距和抱架，不把低风险切磋打成逞强。',
      outcome: '你没有被打垮，但“我已经会了”的感觉被削掉一层。'
    },
    maw: { misread: 4 }
  },
  6: {
    title: '旧城区夜行',
    loc: 'metro_station',
    npc: 'fatty',
    shortDesc: '旧城区夜行，你在路灯下撞见父亲的痕迹。',
    sceneSummary: '夜路放大脚步声，也放大父亲留下的旧影子。你要学会看出口，而不是给影子配招。',
    hook: '今天的目标：沿着父亲的痕迹，少误读一点夜色。',
    desc: '夜里从地铁口出来，旧城区的路灯像没睡醒。你在一家关门的旧铺前，看见父亲名字的旧贴纸。',
    kind: 'dialog',
    dialogue: [
      { speaker: '陆小闲', text: '这张贴纸……我爸以前来过？' },
      { speaker: '刘胖子', text: '旧城区谁没来过。别盯人，先看路。' },
      { speaker: '陆小闲', text: '那边那两个人是不是在跟着我们？' },
      { speaker: '旁白', text: '夜色把父亲的痕迹和你的疑心揉在一起。' }
    ],
    eventNotebook: {
      reason: '旧城区夜行',
      entry: '地铁口外的风有点冷。你把拳谱里的英雄气概带进夜路，结果发现夜路最讨厌有人给它加戏。',
      beats: [
        '你开始看出口、灯光和人群密度，而不是只看谁像坏人。',
        '刘胖子把你从好几个“可能有事”的转角拽回来，语气很烦，判断很实用。',
        '旧城区没有给你奇遇，只给了你一张更清楚的风险地图。'
      ],
      actionLabel: '跟着路灯走',
      actionText: '别给夜路配招名，先确认出口、距离和身边的人。',
      outcome: '你没有遇到传说中的高手，也没有证明自己胆大。你只是学会在夜里少误读一点影子。'
    },
    maw: { misread: 2 },
    choices: [
      { id: 'day6_oldtown_lit_route', label: '走亮一点的路', text: '你放弃抄最短的巷子，绕到便利店和路灯更多的街边。时间多花了一点，心跳少编了几段剧情。', hint: '偏冷静和判断。', gain: { calm: 1, jud: 1 }, flags: { flag_day6_oldtown_nightwalk: true, day6_oldtown_lit_route: true }, log: '你在旧城区夜行时选择走亮路。没有奇遇，只有一次很实用的没出事。' },
      { id: 'day6_oldtown_read_exits', label: '先记出口', text: '你每过一个路口先看哪里能退，哪里有人，哪里有监控。祖传步法忽然从“飘逸”变成“别把自己堵死”。', hint: '偏判断，少量街头真实性。', gain: { jud: 1, auth: 1 }, flags: { flag_day6_oldtown_nightwalk: true, day6_oldtown_read_exits: true }, log: '你把旧城区夜路当成风险地图，而不是英雄舞台。出口比招名更可靠。' },
      { id: 'day6_oldtown_stare_back', label: '回头盯住对方', text: '你回头盯了两秒，对方也盯了两秒。刘胖子把你拉走，说你这叫给空气递挑战书。', hint: '误判发酵，热度小幅上升。', gain: { heat: 1, jud: 1 }, flags: { flag_day6_oldtown_nightwalk: true, day6_oldtown_stare_back: true }, log: '你在旧城区夜路上把影子看成对手。没有开打，但误判又长出一点边。' }
    ]
  },
  7: {
    title: '镜子里的人',
    loc: 'home',
    npc: 'father',
    shortDesc: '镜子不夸你，只把急着证明的人照出来。',
    sceneSummary: '七天之后，你对着裂镜慢练。真正刺眼的不是动作难看，是你还在把保护和证明混在一起。',
    hook: '今天的目标：看清自己为什么这么急。',
    desc: '出租屋的镜子有裂纹。动作越摆越满，镜子里的人越像一个急着证明自己的陌生人。',
    kind: 'dialog',
    dialogue: [
      { speaker: '父亲', text: '真要保护人，先看清自己。' },
      { speaker: '陆小闲', text: '爸，我现在像会保护人，还是像会惹事？' },
      { speaker: '旁白', text: '镜子没有回答，只把你的拳头和皱着的眉头分成两块。' }
    ],
    eventNotebook: {
      reason: '镜子里的自检',
      entry: '你在出租屋镜子前练到出汗。拳风没有传说，只有袖口刮过空气的声音，和一个越来越急的自己。',
      beats: [
        '你把招名念得很稳，身体却在每一次回收里露出慌。',
        '镜子提醒得很难听：你不是不会用力，你是不知道自己为什么这么急。',
        '父亲的记忆没有变成秘籍，只变成一句迟到的自检题。'
      ],
      actionLabel: '看完这一遍',
      actionText: '别急着把动作摆漂亮，先看清镜子里那个人在怕什么。',
      outcome: '你把拳头放低。今天没有新招，只有一个不太好听的答案：你想保护人，也想证明自己不是笑话。'
    },
    maw: { fatherMemory: 2, misread: 1 },
    choices: [
      { id: 'day7_mirror_lower_fist', label: '把拳头放低', text: '你收住最后一下，把下巴也收回来。动作少了点气势，但镜子里的人终于不那么像要冲出去。', hint: '偏冷静和父亲记忆。', gain: { calm: 1, jud: 1 }, flags: { flag_day7_mirror_person: true, day7_mirror_lower_fist: true }, log: '你在镜子前把拳头放低。父亲的话没有变轻，只是你第一次愿意照着它检查自己。' },
      { id: 'day7_mirror_repeat_slow', label: '慢慢重练一遍', text: '你把动作拆慢，看到肩膀先紧、脚先乱、眼神先急。难看，但难看得有用。', hint: '偏判断和真实性，轻量父亲记忆。', gain: { jud: 1, auth: 1 }, flags: { flag_day7_mirror_person: true, day7_mirror_repeat_slow: true }, log: '你在镜子前慢练一遍。招名还在，但你开始看见招名下面的毛病。' },
      { id: 'day7_mirror_full_pose', label: '把架势摆满', text: '你把最后一个定势摆得很满。镜子里的你确实像会武功，也确实像还没听懂父亲那句话。', hint: '误判继续沉淀，少量信念。', gain: { calm: 1 }, flags: { flag_day7_mirror_person: true, day7_mirror_full_pose: true }, log: '你在镜子前把架势摆满。那一刻很像答案，但镜子没有替你点头。' }
    ]
  },
  8: {
    title: '一阵风',
    loc: 'boxing',
    enemy: 'E10',
    desc: '你违背父亲遗训，第一次去证明茂家拳。现实没有配合演出。',
    kind: 'scriptedBattle',
    script: 'first_wind',
    eventNotebook: {
      reason: '现实清账',
      entry: '拳馆灯光很硬，擂台边没有家里的香灰味。你带着父亲那句遗训上去，却把它理解成了必须赢。',
      beats: [
        '你试图用茂家拳证明自己，对面没有配合你的节奏，也没有给招名留面子。',
        '每一次打空都比嘲笑更直白，每一次停在原地都像把答案交给对方。',
        '现实像一阵风，把你吹得站不稳。'
      ],
      actionLabel: '上台面对',
      actionText: '这次不靠气势解释，先让现实把问题指出来。',
      outcome: '输不只是比分，它让你第一次怀疑自己到底在练什么。'
    }
  },
  9: {
    title: '父亲日记',
    loc: 'home',
    npc: 'father',
    desc: '旧箱子里有一本日记。它没有绝招，但有父亲没有说出口的真话。',
    kind: 'diary',
    script: 'father_diary',
    eventNotebook: {
      reason: '父亲线揭示',
      entry: '旧箱子有潮味，父亲的日记压在最底下。封皮起了毛，字迹却比你记忆里的拳谱更直接。',
      beats: [
        '你一页一页读，不急着找绝招，只看父亲当年没说出口的担心。',
        '日记没有否定茂家拳，它只是把“能用”两个字放到了最前面。',
        '你第一次感觉父亲不是在拦你练武，而是在拦你拿冲动冒充本事。'
      ],
      actionLabel: '翻开日记',
      actionText: '别找秘籍，先读父亲到底怕你变成什么样。',
      outcome: '父亲留下的不是神功线索，而是一条底线：真要保护人，先别骗自己。'
    }
  },
  12: {
    title: '阿豹刷到你了',
    loc: 'park',
    enemy: 'E11',
    npc: 'abao',
    desc: '阿豹信短视频，你信祖传。你们都需要一场不那么体面的验货。',
    kind: 'battle',
    eventNotebook: {
      reason: '同类误判相撞',
      entry: '阿豹在公园刷到你的视频，手机屏幕亮得刺眼。他说秘传，你说祖传，听起来像两个不同包装的同一种自信。',
      beats: [
        '你接下这场不体面的验货，但这次不再只想着招名。',
        '你开始看对方重心、肩膀和出手前那点停顿。',
        '你们都露了一点馅。不同的是，你开始愿意承认馅在哪里。'
      ],
      actionLabel: '接下验货',
      actionText: '别跟短视频比嗓门，先看谁的动作更经得起压力。',
      outcome: '这场不是为了赢阿豹的嘴，而是为了确认自己有没有从“一阵风”里醒一点。'
    }
  },
  18: {
    title: '便利店门口的三个人',
    loc: 'store',
    npc: 'xiaoman',
    enemy: 'E07',
    desc: '持械风险事件。可撤离、降温、保护同伴或硬拼；别把热血当护甲。',
    kind: 'event',
    eventNotebook: {
      reason: '保护与风险选择',
      entry: '便利店门口真的站了三个人。拿棍的那只手不稳，围观的眼神却很稳，像都在等谁先犯错。',
      beats: [
        '你先看出口、看小满的位置、看对方手里东西，也看自己有没有被热血推着走。',
        '降温、保护、撤离、硬接都不是免费答案，每条路都会留下后果。',
        '今天决定的不只是输赢，而是你到底把“保护”理解成什么。'
      ],
      actionLabel: '判断现场',
      actionText: '别把热血当护甲，先决定怎样让事情不往最坏处走。',
      outcome: '便利店不是擂台。你越能把事情处理得具体，越像真的学过东西。'
    },
    choices: [
      { id: 'store_deescalate', label: '先降温', text: '站到门口侧面，把声音压低，先让对方看见退路。你不是认怂，是让事别变成伤。', hint: '不进入战斗，换冷静和真实性。', gain: { calm: 6, auth: 3, rel_xiaoman: 1, heat: -1 }, flags: { store_deescalated: true }, log: '你先降温，把便利店门口的火压了下去。' },
      { id: 'store_protect', label: '护住小满', text: '先把小满推到收银台后，再处理拿棍的人。这样做风险更高，但你知道自己为什么站出来。', hint: '进入持械战斗，关系收益更高。', gain: { auth: 2, rel_xiaoman: 2, heat: 1 }, flags: { store_protect_xiaoman: true }, enemy: 'E07', log: '你挡在小满前面，持械冲突已经避不开了。' },
      { id: 'store_exit', label: '带人撤出去', text: '不抢一句狠话，先带人从侧门撤。今天赢的不是面子，是没有人受伤。', hint: '避开战斗，降低热度，名声收益较少。', gain: { calm: 4, fame: 8, rel_xiaoman: 1, heat: -2 }, flags: { store_exited: true }, log: '你带小满从侧门撤走，没有给误会继续升级的空间。' }
    ]
  },
  20: {
    title: '散打馆的三段连击',
    loc: 'sanda_gym',
    npc: 'coach_luo',
    enemy: 'E19',
    desc: '罗教练让你把拳、腿、摔连成一口气。散打不靠吓人，靠每一下都能接到下一下。',
    kind: 'battle',
    eventNotebook: {
      reason: '拳腿摔模块入茂',
      entry: '散打馆的靶声一下一下砸在空气里。罗教练只看了你两眼，就把你放到拳、腿、摔的衔接线上。',
      beats: [
        '你先用刺拳逼反应，再接鞭腿，最后练对方前压时的接腿和换位。',
        '每一下都要给下一下留路；中间断了，对面会替你补标点。',
        '散打不散，乱的是人的脑子。'
      ],
      actionLabel: '上擂台连起来',
      actionText: '别把三下打成三件事，先把拳、腿、摔连成一句话。',
      outcome: '你第一次感觉到“连上”不是好看，而是对方没空插进来。'
    }
  },
  21: {
    title: '道场里的第一拳',
    loc: 'karate_dojo',
    npc: 'senpai_yan',
    enemy: 'E20',
    desc: '严前辈把你带到组手线前。规矩很安静，逆突落身上时一点也不安静。',
    kind: 'battle',
    eventNotebook: {
      reason: '规矩与收招',
      entry: '道场里的第一拳来得很安静，落到护具上却一点也不客气。严前辈站在线后，看你怎么处理急躁。',
      beats: [
        '你按规矩进入组手线，试图在限制里找时机。',
        '不能乱冲，也不能只等；线不是装饰，是压力里的边界。',
        '规矩没有保护你的面子，它只是让错误更清楚。'
      ],
      actionLabel: '按线进场',
      actionText: '在规矩里抓时机，别把急躁包装成积极。',
      outcome: '清楚，才有改的地方。你把“收住”也写进了能用的能力里。'
    }
  },
  22: {
    title: '跆拳道社的距离课',
    loc: 'taekwondo_club',
    npc: 'coach_min',
    enemy: 'E21',
    desc: '闵教练让你用腿法理解距离。踢得出去是能力，收得回来才是生存。',
    kind: 'battle',
    eventNotebook: {
      reason: '腿法距离模块',
      entry: '跆拳道社的护具挂成一排，脚靶被踢出闷响。闵教练让你先站远一点，再告诉你这不是安全，是距离作业。',
      beats: [
        '你练横踢进出、后踢抓追击，每次转身都要先确认对方在哪。',
        '腿出去之后，回来才算动作结束。',
        '高不高只是观众关心，回不回得来才是你关心。'
      ],
      actionLabel: '测腿法距离',
      actionText: '先确认距离和回收，再谈漂亮。',
      outcome: '你发现腿法不是越大越好，而是越清楚越安全。'
    }
  },
  24: {
    title: 'MMA开放垫子',
    loc: 'mma',
    enemy: 'E06',
    desc: '如果不会防摔和脱身，就会一直被压制。地面课不讲面子，只讲位置。',
    kind: 'battle',
    eventNotebook: {
      reason: '补上地面页',
      entry: 'MMA开放垫子这天，地面距离你特别近。你还没被摔，就已经知道自己以前漏了多大一块。',
      beats: [
        '你练防摔、脱身和重新站起，不再把倒地当成剧情结束。',
        '下巴收住，髋往后，手先找框架。',
        '地板没有恶意，但它很会讲道理。'
      ],
      actionLabel: '上垫处理',
      actionText: '先补防摔和脱身，别让面子替你在地上喘气。',
      outcome: '你给茂家拳补上了以前最不愿看的那一页：倒地以后，还得能回来。'
    }
  },
  29: {
    title: '烧烤摊夜谈',
    loc: 'street',
    npc: 'father',
    desc: '终战前一晚，你可以和一个人吃烧烤，也可以一个人把十串羊肉献给焦虑。父亲留下的不是神功，是别怕输。',
    kind: 'nightTalk',
    eventNotebook: {
      reason: '终战前收束',
      entry: '烧烤摊的烟把旧城夜色熏得发软。终战前一晚，你可以和一个人吃烧烤，也可以一个人把焦虑嚼完。',
      beats: [
        '你坐下来，听别人说一点不那么像训练的话。',
        '肉串烫嘴，心跳慢了一点。',
        '父亲留下的不是神功，是别怕输。你终于能把这句话听完整。'
      ],
      actionLabel: '坐下聊一会',
      actionText: '终战前不用再加戏，先把心跳和话都放慢一点。',
      outcome: '你没有得到最后一招，只得到一个更能站稳的理由。'
    },
    maw: { fatherMemory: 8 }
  },
  30: {
    title: '真东西测试',
    loc: 'boxing',
    enemy: 'E18',
    desc: '你不用证明茂家拳天下第一。你只要证明自己不再是一阵风。',
    kind: 'objectiveBattle',
    eventNotebook: {
      reason: '30天终局测试',
      entry: '拳馆灯光还是很硬，但你这次没有把它看成审判。护齿咬上去，呼吸短了一下，又被你拉回来。',
      beats: [
        '你不证明茂家拳天下第一，只证明自己能在压力里完成具体目标。',
        '看见、收住、调整、站回来；这些词没有招名响，但更像真东西。',
        '陈见锋不会吃嘴炮，系统也不会替你美化动作。'
      ],
      actionLabel: '开始测试',
      actionText: '别追传奇结论，先在压力下完成你写下来的具体目标。',
      outcome: '真东西测试不是给传奇盖章，而是给这30天一个交代。你不再是一阵风，至少不再只是一阵风。'
    },
    objectives: ['surviveWindow1', 'guardHeavy', 'landStraight', 'recoverFromHit', 'useReforgedSkill', 'keepCalm']
  }
};

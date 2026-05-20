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
  street: { name: '街头判断', icon: '街', desc: '提高撤离、降温和风险胜利概率。真正的狠活，有时是让事别发生。' }
};

export const ORIGINS = {
  worker: { name: '进城打工人', icon: '工', desc: '钱少但抗压，肩膀已经被生活预热过。便利店和工地收益高，恢复慢。', stats: { str: 48, end: 54, spd: 46, rea: 45, tec: 38, tou: 52, bal: 46, jud: 48 }, money: 360, trait: '打工收益+20%' },
  fan: { name: '短视频信徒', icon: '燃', desc: '士气很满，真实性很饿。适合开局冲劲，不适合把弹幕当教练。', stats: { str: 42, end: 43, spd: 44, rea: 45, tec: 36, tou: 42, bal: 42, jud: 35 }, money: 420, trait: '士气高，真实性低' },
  student: { name: '体育生旁听', icon: '生', desc: '基础体能好，现金紧。身体愿意努力，钱包表示需要战术暂停。', stats: { str: 45, end: 58, spd: 55, rea: 52, tec: 43, tou: 47, bal: 52, jud: 45 }, money: 300, trait: '训练体能压力低' }
};

export const LOCS = {
  home: { name: '出租屋', icon: '屋', open: [0, 1440], desc: '复盘、休息和网购的安全区。床很窄，但至少不会突然抱摔你。' },
  store: { name: '便利店', icon: '店', open: [420, 1380], desc: '补给、打工和小满事件。冰柜很冷，人情账很热。' },
  worksite: { name: '工地临工点', icon: '工', open: [480, 1140], desc: '短工累，但能把现金和体能沉淀一点点垫起来。砖不会骗人。' },
  park: { name: '公园', icon: '园', open: [360, 1260], desc: '低风险验货、围观和街头观察。大爷们嘴上养生，手上不一定。' },
  boxing: { name: '拳馆', icon: '拳', open: [540, 1320], desc: '拳击基础、陪练和教练反馈。这里的真话通常带着汗味。' },
  wuguan: { name: '武馆', icon: '武', open: [540, 1260], desc: '传统动作拆解和压力测试。好看可以加分，能用才算毕业。' },
  mma: { name: 'MMA馆', icon: '摔', open: [600, 1320], desc: '防摔、抱摔和地面课。你会学到地板其实很有存在感。' },
  gym: { name: '社区健身房', icon: '体', open: [540, 1320], desc: '基础体能馆，练力量、耐力、平衡和核心。镜子不计分，心率带计。' },
  physio: { name: '理疗店', icon: '疗', open: [600, 1320], desc: '恢复、降疲劳和处理小伤。花钱让身体停止投诉。' },
  street: { name: '旧城区', icon: '街', open: [900, 1430], desc: '线索、热度和高风险冲突。路灯不多，误会不少。' }
};

export const LOC_POS = {
  home: [1, 6], park: [2, 3], store: [2, 5], worksite: [4, 1], boxing: [4, 6],
  wuguan: [6, 4], mma: [5, 8], gym: [9, 6], physio: [8, 8], street: [9, 3]
};

export const TRAVEL_TUNING = {
  walk: { name: '散步', icon: '走', desc: '不花钱，慢一点，顺便给身体存点体能沉淀。适合钱包装死时。', time: [20, 40, 70], money: [0, 0, 0], sp: [5, 9, 16], fitXp: [2, 4, 7], fatigue: [0, 1, 3] },
  run: { name: '跑步', icon: '跑', desc: '省钱也练体能，代价是到场时先和大腿开个短会。', time: [13, 27, 48], money: [0, 0, 0], sp: [11, 18, 28], fitXp: [5, 8, 12], fatigue: [1, 2, 5] },
  bike: { name: '共享单车', icon: '车', desc: '便宜且快，少量消耗体力。刹车好不好，属于城市盲盒。', time: [11, 23, 40], money: [4, 8, 14], sp: [4, 8, 12], fitXp: [2, 3, 5], fatigue: [0, 1, 2] },
  bus: { name: '公交', icon: '巴', desc: '便宜稳定，跨区会被红绿灯和换乘拖慢。胜在不用和空气拼刺刀。', time: [18, 34, 55], money: [6, 12, 20], sp: [1, 1, 2], fitXp: [0, 0, 0], fatigue: [0, 0, 0] },
  metro: { name: '地铁', icon: '铁', desc: '跨区更稳，进出站和换线也要时间。城市把你吞进去，再准点吐出来。', time: [18, 28, 38], money: [8, 15, 24], sp: [1, 1, 1], fitXp: [0, 0, 0], fatigue: [0, 0, 0] },
  taxi: { name: '打车', icon: '的', desc: '最快，不耗体力，但跨区和夜间成本明显。钱包会替你挨这一下。', time: [10, 18, 32], money: [26, 48, 86], sp: [0, 0, 0], fitXp: [0, 0, 0], fatigue: [0, 0, 0] }
};

export const SKILLS = {
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
  mystic: { name: '混元一气掌', icon: '玄', type: 'mystic', dist: ['mid', 'close'], dmg: 15, post: 6, sp: 18, ap: 2, hit: 0.42, risk: 0.28, style: 'traditional', desc: '观赏性高，压力下风险也高。能赢是绝活，打空就是现场气氛组。' }
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
  E18: { name: '陈见锋', icon: '陈', risk: '终局', tags: ['终局测试', '拳摔转换', '不吃嘴炮'], hp: 165, sp: 150, posture: 120, morale: 82, calm: 86, stats: { str: 68, end: 75, spd: 66, tec: 78, tou: 70, bal: 75, rea: 72, jud: 80 }, skills: ['jab', 'straight', 'frontkick', 'sprawl', 'advance', 'grip', 'takedown', 'guard', 'escape'], ai: 'boss', preferredRange: 'mid', aiProfile: { patience: 82, pressure: 64, grapple: 66, counter: 62, dirty: 0 }, reward: { money: 360, fame: 240 } }
};

export const ACTIONS = {
  home: [
    { id: 'review', name: '视频复盘', icon: '复', time: 45, sp: 0, desc: '分析最近战斗，把“我刚才怎么飞出去的”整理成判断和技能细节。', type: 'simple', gain: { jud: 1, calm: 4, skill: 'jab', xp: 4 } },
    { id: 'shadow', name: '影子拳节拍', icon: '影', time: 50, sp: 12, desc: '轻训练，练直拳回收和步法节奏。影子不会还手，但它也不会夸你。', type: 'simple', gain: { skill: 'dodge', xp: 6, boxing: 4, fatigue: 6, fitXp: 2 } },
    { id: 'online', name: '网上冲浪找资料', icon: '网', time: 35, sp: 3, desc: '刷新机会卡，提升真实性或发现迷货。信息海很大，别把泡沫当秘籍。', type: 'simple', gain: { auth: 2, heat: 1 } },
    { id: 'nap', name: '小睡恢复', icon: '睡', time: 60, sp: 0, desc: '恢复体力，降低疲劳。给身体一次不被打扰的停机维护。', type: 'simple', gain: { sp: 30, fatigue: -15 } },
    { id: 'sleep', name: '睡觉到明天', icon: '眠', time: 0, sp: 0, desc: '结束当天。太晚不睡，明天的身体会带着账本来找你。', type: 'sleep' }
  ],
  store: [
    { id: 'cashier', name: '便利店收银班', icon: '钱', time: 120, sp: 18, desc: '赚钱，遇到小满/刘胖子事件概率上升。扫码枪很轻，站两小时很重。', type: 'simple', gain: { money: 125, fatigue: 10, rel_xiaoman: 1 } },
    { id: 'carry', name: '搬货硬练', icon: '箱', time: 80, sp: 24, desc: '赚钱少一点，但力量、耐力和体能沉淀都会涨。纸箱沉默，收益诚实。', type: 'simple', gain: { money: 70, str: 1, end: 1, fitXp: 6, fatigue: 14 } },
    { id: 'chat_xiaoman', name: '和小满聊几句', icon: '聊', time: 25, sp: 0, desc: '分段对话。关系收益每日有限，别把聊天当连招搓。', type: 'dialog', npc: 'xiaoman' },
    { id: 'buy_local', name: '买便利店补给', icon: '购', time: 15, sp: 0, desc: '饭团、饮料、绷带。朴素三件套，专治“我还能撑”。', type: 'shop', cat: '补给' }
  ],
  worksite: [
    { id: 'brick_labor', name: '搬砖杂工', icon: '砖', time: 150, sp: 30, desc: '重活，钱多但疲劳重，体能沉淀扎实。砖块不会鼓掌，但会记重量。', type: 'simple', gain: { money: 180, str: 1, end: 1, tou: 1, fitXp: 10, fatigue: 26, heat: 1 } },
    { id: 'material_run', name: '运料短工', icon: '运', time: 100, sp: 24, desc: '来回搬运，耐力和速度都有一点。路线短，腿不这么觉得。', type: 'simple', gain: { money: 120, end: 1, spd: 1, fitXp: 8, fatigue: 18 } },
    { id: 'afterwork_mobility', name: '收工拉伸', icon: '松', time: 35, sp: 0, desc: '在工棚边活动肩髋，降低硬活后的僵硬。别让明天的你骂今天的你。', type: 'simple', gain: { fitXp: 2, fatigue: -8, calm: 3 } }
  ],
  park: [
    { id: 'spar_rookie', name: '开放验货局', icon: '验', time: 60, sp: 12, desc: '和拳击新人低风险切磋。适合确认动作能不能离开教程区。', type: 'battle', enemy: 'E01', risk: 1 },
    { id: 'observe_park', name: '围观不插手', icon: '看', time: 40, sp: 0, desc: '观察别人出招，提升判断。站远点也能学，前提是别站成裁判。', type: 'simple', gain: { jud: 1, calm: 3, auth: 1 } },
    { id: 'poster', name: '帮拳馆贴海报', icon: '贴', time: 55, sp: 8, desc: '提升拳馆关系和名声。胶水味不浪漫，但名声会一点点粘上来。', type: 'simple', gain: { fame: 14, rel_coach: 1, money: 20 } },
    { id: 'push_old', name: '推手大爷交流', icon: '推', time: 55, sp: 10, desc: '低风险近身控制训练。大爷笑得慈祥，重心拆得很不慈祥。', type: 'battle', enemy: 'E02', risk: 1 }
  ],
  boxing: [
    { id: 'bag', name: '沙包连击', icon: '沙', time: 75, sp: 22, cost: 18, desc: '完成连击，提升拳击技能。沙包不会躲，所以别因此产生天才错觉。', type: 'simple', minigame: { template: 'rhythm', prompt: '看准节拍，别只追求把沙包打响。' }, gain: { skill: 'jab', xp: 8, skill2: 'straight', xp2: 6, boxing: 8, fatigue: 10, fitXp: 2 } },
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
    { id: 'sprawl_drill', name: '防摔判断课', icon: '防', time: 70, sp: 20, cost: 28, desc: '根据对手动作选择防摔应对。膝盖落得快，尊严保得住。', type: 'simple', gain: { skill: 'sprawl', xp: 11, skill2: 'escape', xp2: 6, mma: 9, bal: 1, fatigue: 11, fitXp: 3 } },
    { id: 'ground_escape', name: '地面脱身课', icon: '脱', time: 80, sp: 24, cost: 34, desc: '提升脱身和地面冷静。被压住时，慌张通常是对手的第二个队友。', type: 'simple', gain: { skill: 'escape', xp: 10, mma: 9, bal: 1, fatigue: 14, fitXp: 3 } },
    { id: 'mma_spar', name: '开放垫子实战', icon: '垫', time: 75, sp: 16, desc: 'MMA 学员会主动抱摔。请提前和地面建立心理关系。', type: 'battle', enemy: 'E06', risk: 3 },
    { id: 'clinch_lab', name: '拳摔转换课', icon: '缠', time: 80, sp: 22, cost: 35, desc: '提升抓把、抱摔、前压。拳没打完，摔已经在路上。', type: 'simple', gain: { skill: 'grip', xp: 8, skill2: 'takedown', xp2: 6, mma: 10, fatigue: 15 } }
  ],
  gym: [
    { id: 'gym_basic', name: '基础循环训练', icon: '循', time: 70, sp: 20, cost: 25, desc: '深蹲、推、拉、核心和跑台串成一轮。没花招，只有账单和心率。', type: 'simple', minigame: { template: 'judgement', prompt: '根据身体反馈选择下一组，别把训练做成自毁。' }, gain: { str: 1, end: 1, bal: 1, fitXp: 10, fatigue: 12 } },
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
  chen: { name: '陈见锋', icon: '陈' }
};

export const MAIN_EVENTS = {
  1: { title: '祖师爷给你点了赞', loc: 'home', npc: 'fatty', desc: '短视频里的神功把你点燃了。火很旺，真实性还没交电费，先验货再上头。', kind: 'dialog' },
  5: { title: '公园第一次验货', loc: 'park', enemy: 'E01', desc: '低风险切磋，测试拳距和抱架。对方不邪门，只是基础比嘴硬可靠。', kind: 'battle' },
  12: { title: '流量大师学徒', loc: 'park', enemy: 'E03', desc: '观赏性拉满，受击反应可能露馅。灯光之外，拳头会负责验收。', kind: 'battle' },
  18: { title: '便利店门口的三个人', loc: 'store', npc: 'xiaoman', enemy: 'E07', desc: '持械风险事件。可撤离、降温、保护同伴或硬拼；别把热血当护甲。', kind: 'event' },
  24: { title: 'MMA开放垫子', loc: 'mma', enemy: 'E06', desc: '如果不会防摔和脱身，就会一直被压制。地面课不讲面子，只讲位置。', kind: 'battle' },
  30: { title: '真东西测试', loc: 'boxing', enemy: 'E18', desc: '30天公开测试。路线、技能、判断和伤病都会被检验；观众看热闹，系统看账本。', kind: 'battle' }
};

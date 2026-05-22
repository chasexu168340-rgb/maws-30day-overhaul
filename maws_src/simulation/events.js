import { ENEMIES } from '../content/data.js';

const FACTOR_LABELS = Object.freeze({
  heat: '热度',
  fame: '名声',
  lowFame: '低名声',
  auth: '真实性',
  lowAuth: '低真实性',
  fatigue: '疲劳',
  lowFatigue: '体力余裕',
  injuries: '伤病',
  fights: '战斗次数',
  wins: '胜场',
  losses: '败场',
  riskWins: '风险处理',
  combatMemory: '战斗记忆',
  mawMisread: '误判值',
  fatherMemory: '父亲记忆',
  mawReforge: '茂拳完成度',
  currentLoc: '当前位置',
  recoveryNeed: '恢复需求',
  hardFightStress: '硬战压力',
  highHeatChallenge: '热度挑战',
  earlyDay: '早期引导',
  homeIdle: '宅家提醒',
  jabNeed: '刺拳基础缺口'
});

const RISK_LABEL_TO_LEVEL = Object.freeze({
  低: 1,
  中: 2,
  高: 4,
  剧情: 5,
  终局: 5
});

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function clamp(value, min, max) {
  const n = Number.isFinite(Number(value)) ? Number(value) : 0;
  return Math.max(min, Math.min(max, n));
}

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function playerOf(state = {}) {
  return state.player && typeof state.player === 'object' ? state.player : state;
}

function combatMemoryOf(state = {}, player = {}) {
  return state.combatMemory || player.combatMemory || {};
}

function hasSkill(state = {}, skillId) {
  if (!skillId) return false;
  return Boolean(state.skillState?.[skillId] || state.unlocked?.[skillId]);
}

export const EVENT_RULES = deepFreeze([
  {
    id: 'coach_correction',
    title: '梁教练暂停你的玄学发挥',
    loc: 'boxing',
    desc: '他看了你上一场录像，准确指出一个让你沉默的问题。适合把挨打经验翻译成稳定训练。',
    eventNotebook: {
      reason: '上一场问题还在发酵',
      entry: '拳馆的风扇把汗味吹得很均匀。梁教练把手机架在护栏上，屏幕停在你上一场最难看的那一秒：手还在外面，人已经在原地等反馈。',
      beats: [
        '你没有急着解释，把护齿盒合上，重新站进胶带贴出的中线。',
        '梁教练只让你做一件事：打完一拳，手回来，人也要能走。',
        '这次复盘不像表扬，也不像羞辱，更像把挨过的打拆成能保存的零件。'
      ],
      actionLabel: '接受复盘',
      actionText: '花一点时间和面子，把上一场最丑的地方拆成下一次能用的训练。',
      outcome: '你记住了一个问题：气势不能替你防反击。'
    },
    npc: 'coach',
    kind: 'dialog',
    base: 46,
    tags: ['录像复盘', '技术补课'],
    weights: { combatMemory: 2.4, losses: 5, lowAuth: 0.7, fatigue: -0.5 }
  },
  {
    id: 'park_light_spar',
    title: '公园有人约一局不嘴硬的',
    loc: 'park',
    desc: '低风险验货，适合测试新装备和基础技能；疲劳太高就别硬接，身体不是一次性道具。',
    eventNotebook: {
      reason: '低风险验货机会',
      entry: '公园地砖有点潮，晨练的人把音箱声压得很低。对面的人戴着旧拳套，说话不重，站距却很实在。',
      beats: [
        '你先摸距离，不抢重拳；用刺拳试对方反应，再把抱架收紧。',
        '这不是英雄时刻，是看看自己的动作会不会在轻压下散掉。',
        '基础不吵，但它会在每一次回收和换步里算账。'
      ],
      actionLabel: '接下轻切磋',
      actionText: '状态够就进场验货；疲劳高就别把小问题打成新伤。',
      outcome: '你用一场不嘴硬的轻切磋，给基础动作交了一次现场作业。'
    },
    enemy: 'E01',
    kind: 'battle',
    base: 42,
    tags: ['低风险', '实战验货'],
    weights: { fame: 1.2, heat: 0.9, lowFatigue: 1.1, injuries: -3.5 }
  },
  {
    id: 'online_discount',
    title: '网购页面开始对你眨眼',
    loc: 'home',
    desc: '训练工具在打折，但刷太久会长疲劳，也容易被直播间迷货带偏。便宜不等于有用，主播的嗓门也不等于科学。',
    eventNotebook: {
      reason: '装备诱惑',
      entry: '出租屋里只亮着手机屏。购物页面把训练器械排得像门派秘宝，价格后面的倒计时比教练还会催人。',
      beats: [
        '你没有立刻付款，先翻差评、看尺寸、对照自己现在真正缺的东西。',
        '便宜是一种诱惑，不是训练计划。',
        '购物车删到只剩能用的以后，房间忽然安静得像在等你明天真的练。'
      ],
      actionLabel: '去看补给',
      actionText: '把价格、用途和今天的训练计划对一遍，不把冲动消费当进步。',
      outcome: '你把“想买”压成“需要”，至少这次没有让直播间替你排训练课。'
    },
    shop: true,
    kind: 'shop',
    base: 36,
    tags: ['补给', '装备诱惑'],
    weights: { lowAuth: 1.6, heat: 0.6, fatigue: 0.4, lowFame: 0.5 }
  },
  {
    id: 'early_video_review',
    title: '复盘录像先别快进',
    loc: 'home',
    desc: '低压复盘机会：不急着证明，也不急着约架。把今天看见的动作停住，先分清距离、回收和自己哪里想太快。',
    eventNotebook: {
      reason: '早期低压复盘',
      entry: '出租屋里手机支在水杯旁。短视频里的拳很快，但暂停键比拳更诚实：每一帧都能看见站距、下巴和手有没有回来。',
      beats: [
        '你没有把复盘剪成爽点，只把动作停在出问题前一秒。',
        '刘胖子在消息里发了个“别又看成神功”的表情。',
        '这次没有输赢，只有一个更具体的问题：下一次手能不能收回来。'
      ],
      actionLabel: '做低压复盘',
      actionText: '先看录像，不急着把今天安排成战斗。',
      outcome: '复盘没有立刻让你变强，但让你少了一点把热闹当训练的冲动。'
    },
    npc: 'fatty',
    kind: 'dialog',
    base: 47,
    tags: ['复盘录像', '低压推荐'],
    when: { minDay: 1, maxDay: 7 },
    weights: { earlyDay: 5, lowAuth: 0.8, homeIdle: 2.8, combatMemory: 0.5 }
  },
  {
    id: 'early_boxing_visit',
    title: '去拳馆看看，先不急着上台',
    loc: 'metro_station',
    desc: '低压路线建议：先把拳馆路线、开放时间和沙包声音记下来。今天可以只是看看，不需要把自己交给擂台。',
    eventNotebook: {
      reason: '拳馆路线预热',
      entry: '地铁站广告牌旁边贴着拳馆传单，角落写着体验课时间。你看了很久，最后先把地址存进手机。',
      beats: [
        '你把“去看看”和“必须打一场”拆开。',
        '真正的拳馆不靠弹幕开门，也不会因为你今天不打就消失。',
        '先认路，先听靶声，先知道自己还没准备好哪里。'
      ],
      actionLabel: '把路线存好',
      actionText: '先把拳馆当成训练方向，不把它变成证明自己的现场。',
      outcome: '拳馆离你近了一点，但还没有变成压力。'
    },
    npc: 'coach',
    kind: 'dialog',
    base: 44,
    tags: ['拳馆看看', '低压推荐'],
    when: { minDay: 1, maxDay: 7 },
    weights: { earlyDay: 4.4, lowAuth: 1.0, homeIdle: 1.6, fatigue: -0.4 }
  },
  {
    id: 'early_metro_observe',
    title: '地铁站观察一会儿',
    loc: 'metro_station',
    desc: '低压观察机会：看人群、出口、站务和情绪变化。不是每个冲突都需要你出手，很多时候先看清楚才是本事。',
    eventNotebook: {
      reason: '城市观察练习',
      entry: '地铁站的人流像一条被闸机切开的河。有人赶路，有人争执，也有人把手机举得太快。',
      beats: [
        '你先找出口、站务位置和人群散开的方向。',
        '刘胖子的语音从耳机里冒出来：别把“看见”自动翻译成“冲上去”。',
        '你发现站稳和不添乱，有时比摆架势更难。'
      ],
      actionLabel: '观察现场',
      actionText: '练判断，不练上头；先看清楚再决定要不要介入。',
      outcome: '你没有打任何人，但对“现场”两个字更有概念了。'
    },
    npc: 'fatty',
    kind: 'dialog',
    base: 45,
    tags: ['地铁站观察', '低压推荐'],
    when: { minDay: 1, maxDay: 7 },
    weights: { earlyDay: 4.6, lowFame: 0.7, homeIdle: 1.4, heat: -0.2 }
  },
  {
    id: 'early_store_supply_xiaoman',
    title: '便利店补给，小满顺手提醒',
    loc: 'store',
    desc: '低压补给机会：买不买都行，先检查水、饭团和今天的体力。小满提醒你别把饿、累、上头混成勇气。',
    eventNotebook: {
      reason: '便利店补给提醒',
      entry: '便利店冰柜很亮，小满把临期饭团往外挪，顺手看了你一眼：你今天像是想靠热血省饭钱。',
      beats: [
        '你先看水和饭团，再看自己还剩多少体力。',
        '小满没有劝你放弃，只提醒你别空着肚子去证明什么。',
        '补给不是变强，它只是让你别把小问题拖成大问题。'
      ],
      actionLabel: '检查补给',
      actionText: '把水、吃的和今天状态对一遍，不把冲动当计划。',
      outcome: '你把今天的安排压低了一点，也现实了一点。'
    },
    npc: 'xiaoman',
    kind: 'shop',
    shop: true,
    base: 46,
    tags: ['便利店补给', '小满提醒', '低压推荐'],
    when: { minDay: 1, maxDay: 7 },
    weights: { earlyDay: 4.8, lowFatigue: 0.5, fatigue: 0.6, homeIdle: 1.8 }
  },
  {
    id: 'home_idle_fatty_ping',
    title: '刘胖子发来一句别憋屋里',
    loc: 'home',
    desc: '连续窝在出租屋时的轻提醒：不催你打架，只提醒你出去看一眼城市，或者至少把今天的计划说人话。',
    eventNotebook: {
      reason: '不出门轻提醒',
      entry: '刘胖子的消息弹出来：你要是今天不出门，也行，但别把“修炼”修成刷手机。',
      beats: [
        '他没有给你约对手，也没有把你推去硬拼。',
        '只是让你选一个很小的动作：看路线、买水、观察一会儿。',
        '提醒很烦，但烦得有点实际。'
      ],
      actionLabel: '回他一句',
      actionText: '先把今天要做的小事说清楚，不需要立刻接战斗。',
      outcome: '你没有被惩罚，只是被从摆烂边上轻轻拽了一下。'
    },
    npc: 'fatty',
    kind: 'dialog',
    base: 52,
    tags: ['刘胖子提醒', '防摆烂'],
    when: { minDay: 2, maxDay: 7, requiresHomeIdle: true },
    weights: { homeIdle: 6, earlyDay: 4, lowFame: 0.6 }
  },
  {
    id: 'home_idle_phone_plan',
    title: '手机日程弹出一个小计划',
    loc: 'home',
    desc: '防摆烂轻提醒：手机没有催你决斗，只把“复盘录像、便利店补给、地铁站观察”排成三个很小的选项。',
    eventNotebook: {
      reason: '手机轻计划',
      entry: '手机日程提醒震了一下。不是广告，也不是挑战书，只是一条你昨晚随手写下的备忘：别把一天耗成一团。',
      beats: [
        '复盘十分钟，出门买水，或者去地铁站看一圈。',
        '每个选项都很小，小到没有理由把它包装成大事。',
        '这正好也是它们有用的地方。'
      ],
      actionLabel: '整理小计划',
      actionText: '选一个低压动作，不把今天直接跳到战斗。',
      outcome: '手机没有替你训练，但它把摆烂拆成了能处理的小格子。'
    },
    kind: 'dialog',
    base: 49,
    tags: ['手机提醒', '防摆烂'],
    when: { minDay: 2, maxDay: 7, requiresHomeIdle: true },
    weights: { homeIdle: 5.5, earlyDay: 3.6, fatigue: -0.3 }
  },
  {
    id: 'home_idle_neighbor_noise',
    title: '邻居敲墙提醒你别原地发霉',
    loc: 'home',
    desc: '轻量生活提醒：邻居嫌你在屋里来回踱步太久。没有惩罚，没有战斗，只是提醒今天该有一个具体动作。',
    eventNotebook: {
      reason: '邻居生活提醒',
      entry: '隔壁敲了两下墙，不重，但很准。你才发现自己在屋里来回走了半小时，像一场没有开场铃的内耗。',
      beats: [
        '邻居没有讲武德，只讲隔音。',
        '你把脚步停住，给今天写下一个很小的目的地。',
        '有时出门不是为了赢，是为了别把脑子困在同一块地板上。'
      ],
      actionLabel: '停下内耗',
      actionText: '把今天拆成一个低压目标，先不要找架打。',
      outcome: '你没有受到惩罚，只是把原地打转停住了。'
    },
    kind: 'dialog',
    base: 43,
    tags: ['邻居提醒', '防摆烂'],
    when: { minDay: 2, maxDay: 7, requiresHomeIdle: true },
    weights: { homeIdle: 5, earlyDay: 2.8, lowAuth: 0.5 }
  },
  {
    id: 'store_rumor',
    title: '刘胖子捡到一条旧城闲话',
    loc: 'store',
    desc: '聊天能获得旧城线索，也可能让热度继续往上拱。消息像便宜饮料，解渴，也可能上头。',
    eventNotebook: {
      reason: '旧城线索冒头',
      entry: '便利店冰柜嗡嗡响，刘胖子把一瓶饮料推到你面前，表情像是刚从城市缝里捡到一张纸条。',
      beats: [
        '你没有把消息当挑战书，先问来源、问时间、问谁在场。',
        '旧城闲话可以指路，也可以把人带进没灯的巷子。',
        '线索留下了，热度也跟着有了气味。'
      ],
      actionLabel: '听他说完',
      actionText: '别急着接成挑战，先把来源、地点和风险问清楚。',
      outcome: '你开始明白，消息不是免费的，它只是先不收钱。'
    },
    npc: 'fatty',
    kind: 'dialog',
    base: 34,
    tags: ['旧城线索', '热度发酵'],
    weights: { heat: 1.4, fame: 0.8, riskWins: 2.5, combatMemory: 0.8 }
  },
  {
    id: 'xiaoman_customer',
    title: '小满被麻烦客人缠上',
    loc: 'store',
    desc: '可以降温、保护或找监控，不一定要打。热度越高越容易被卷进来，别把便利店门口打成决赛现场。',
    eventNotebook: {
      reason: '便利店风波',
      entry: '收银台前的声音开始发硬。小满没有退后，只是把扫码器放慢了一拍，你能看见她指节在柜台边压白。',
      beats: [
        '你先站到能看见出口的位置，没有急着插话。',
        '你观察对方手里有没有东西、身后有没有同伴、门口有没有退路。',
        '便利店不是擂台，货架后面也没有裁判。'
      ],
      actionLabel: '先稳住现场',
      actionText: '降温、保护、找监控都需要冷静；别把门口打成没人想收拾的现场。',
      outcome: '你越能把事情压小，小满越能看见你不是只会把问题打响。'
    },
    npc: 'xiaoman',
    kind: 'dialog',
    base: 34,
    tags: ['降温处理', '便利店风波'],
    weights: { heat: 1.2, riskWins: 4, fatigue: -0.4, injuries: 0.8 }
  },
  {
    id: 'wuguan_observe',
    title: '武馆今天允许旁观真东西',
    loc: 'wuguan',
    desc: '看传统动作压力测试，把好看的东西拆成能重复的细节。招式可以有来历，落地必须有证据。',
    eventNotebook: {
      reason: '传统拆解窗口',
      entry: '武馆地板擦得发亮，脚步声落上去很清楚。周青山没有讲招名，只让你看一个动作在被推、被撞、被打断时还剩多少。',
      beats: [
        '你站在旁边记重心、肩胯和回收，忍住了问“这招叫什么”。',
        '名字可以晚点知道，能不能复现要先看见。',
        '传统动作不再像一张老照片，而像一件需要重新校准的工具。'
      ],
      actionLabel: '旁观拆招',
      actionText: '先看动作在压力下还剩什么，再决定它能不能写回拳谱。',
      outcome: '好看不是罪，不能用才是问题。'
    },
    npc: 'master',
    kind: 'dialog',
    base: 35,
    tags: ['传统拆解', '真实性校准'],
    weights: { auth: 1.1, lowAuth: 0.8, fame: 0.5, fatigue: -0.2 }
  },
  {
    id: 'boxing_bag_combo_hint',
    title: '拳馆 · 沙包连击',
    loc: 'home',
    desc: 'Day 5 后的低压提示：如果刚输过，或者还没有学会刺拳，先把拳馆沙包连击记进待办。目标是补基础，不是逼你马上开打。',
    eventNotebook: {
      reason: '刺拳基础提醒',
      entry: '手机收藏夹里多了一条拳馆短课：沙包连击。标题不花，内容也不花，第一句就是“先用刺拳找到距离”。',
      beats: [
        '输过以后，最容易想找一招翻盘；没学刺拳时，最容易把距离交给运气。',
        '这张卡没有把你推进战斗，只把基础训练放到更显眼的位置。',
        '沙包不会嘲笑你，它只会把每一次回收算得很清楚。'
      ],
      actionLabel: '记下沙包连击',
      actionText: '把刺拳、回收和连击顺序写进待办，等拳馆开放后再去补基础。',
      outcome: '你没有获得新招，也没有被惩罚，只是知道下一步该补哪里。'
    },
    npc: 'coach',
    kind: 'dialog',
    base: 57,
    tags: ['拳馆', '沙包连击', '刺拳提示'],
    when: { minDay: 6, any: [{ lastResult: 'loss' }, { missingSkill: 'jab' }] },
    weights: { losses: 4, lowAuth: 1.2, earlyDay: 2.5, homeIdle: 1.4, jabNeed: 12 }
  },
  {
    id: 'mma_open_mat',
    title: 'MMA垫子空出一块地板',
    loc: 'mma',
    desc: '晚间开放垫子，适合练防摔、抱摔和地面脱身。地板很公平，它对每个人都一样硬。',
    eventNotebook: {
      reason: '地面短板暴露',
      entry: 'MMA馆的垫子边缘翘了一点，汗水和消毒水混在一起。有人摔上去，声音不大，但你膝盖先替他紧了一下。',
      beats: [
        '你从防摔和脱身开始，不急着证明自己能摔人。',
        '下巴收住，髋往后，手先找框架。',
        '地面课把面子压得很扁，被压住时，慌张会帮对方加体重。'
      ],
      actionLabel: '上垫处理',
      actionText: '先补防摔和脱身；疲劳或伤病高时，地板会比教练更不留情。',
      outcome: '你学到一件实际的事：倒地不是剧情结束，慌张才是。'
    },
    enemy: 'E06',
    kind: 'battle',
    base: 35,
    tags: ['防摔', '地面求生'],
    weights: { fame: 0.9, fights: 1.2, lowFatigue: 0.9, injuries: -2.5 }
  },
  {
    id: 'sanda_first_slice',
    title: '散打馆今天开放体验轮',
    loc: 'sanda_gym',
    desc: '罗教练安排拳腿摔三段体验。这里不问你会不会喊招名，只看鞭腿之后还能不能接住下一步。疲劳太高时别硬上，擂台边不收英雄税。',
    eventNotebook: {
      reason: '拳腿摔衔接机会',
      entry: '散打馆的靶声一下一下砸在空气里。罗教练只看了你两眼，就把你放到拳、腿、摔的衔接线上。',
      beats: [
        '你先用刺拳逼反应，再接鞭腿，最后练对方前压时的接腿和换位。',
        '每一下都要给下一下留路。',
        '散打不散，乱的是人的脑子。'
      ],
      actionLabel: '进体验轮',
      actionText: '把拳、腿、摔连成一句话；体力不足就别硬交英雄税。',
      outcome: '你开始把“出招”理解成一段完整动作，而不是一堆漂亮词。'
    },
    enemy: 'E19',
    kind: 'battle',
    base: 34,
    tags: ['散打', '拳腿摔衔接'],
    weights: { auth: 0.9, fame: 0.7, fights: 1.0, lowFatigue: 0.8, injuries: -2.2 }
  },
  {
    id: 'karate_dojo_line',
    title: '空手道道场在做组手线',
    loc: 'karate_dojo',
    desc: '严前辈把新人的距离线画得很清楚：前蹴管门，逆突管账。适合练中线和收招，也适合发现自己哪里太急。',
    eventNotebook: {
      reason: '中线和收招校准',
      entry: '道场里没有太多声音，只有脚掌擦过地板的轻响。严前辈把线画得很直，直到你不好意思绕开。',
      beats: [
        '你按要求从站距、前蹴和逆突开始，打完必须收回来。',
        '急了就停，歪了就重来。',
        '规矩不是把人变慢，而是让你在压力里少犯一些便宜错误。'
      ],
      actionLabel: '站上线',
      actionText: '在规矩里找时机，别把急躁包装成积极。',
      outcome: '你开始明白，“收住”也是能力。'
    },
    enemy: 'E20',
    kind: 'battle',
    base: 32,
    tags: ['空手道', '中线控制'],
    weights: { auth: 1.0, lowAuth: 0.4, fame: 0.5, lowFatigue: 0.9, injuries: -2.0 }
  },
  {
    id: 'taekwondo_distance_check',
    title: '跆拳道社约了一场距离课',
    loc: 'taekwondo_club',
    desc: '闵教练让你看清腿法的距离和回收。横踢能抢节奏，后踢能罚追击；问题是每次转身都得交判断作业。',
    eventNotebook: {
      reason: '腿法距离作业',
      entry: '跆拳道社的护具挂成一排，脚靶被踢出闷响。闵教练让你先站远一点，再告诉你这不是安全，是距离作业。',
      beats: [
        '你练横踢进出、后踢抓追击，每次转身都要先确认对方在哪。',
        '腿出去之后，回来才算动作结束。',
        '漂亮的腿法一旦失距，就会把后背送得很认真。'
      ],
      actionLabel: '测腿法距离',
      actionText: '先确认距离和回收，再谈好不好看。',
      outcome: '高不高只是观众关心，回不回得来才是你关心。'
    },
    enemy: 'E21',
    kind: 'battle',
    base: 32,
    tags: ['跆拳道', '腿法距离'],
    weights: { fame: 0.7, fights: 0.9, lowFatigue: 0.8, fatigue: -0.2, injuries: -2.0 }
  },
  {
    id: 'oldtown_video_clue',
    title: '旧城区刷出一条可疑视频',
    loc: 'street',
    desc: '可能找到流量大师学徒的破绽。热度越高，线索越多，风险也越近，像一群不请自来的观众。',
    eventNotebook: {
      reason: '旧城视频线索',
      entry: '旧城区的路灯有一盏坏了，短视频里的背景却刚好拍到这条街。画面糊，声音乱，但破绽不一定藏得很深。',
      beats: [
        '你把视频反复停在出手前一帧，看脚下、看同伴位置、看拍摄的人为什么没退。',
        '你找的不是热闹，是现场结构。',
        '线索变清楚了，风险也靠近了。'
      ],
      actionLabel: '追这条线索',
      actionText: '先看出口、围观和对方站位，再决定要不要走进视频背后的现场。',
      outcome: '你知道自己不是在解谜，而是在走进别人已经点过名的地方。'
    },
    enemy: 'E03',
    kind: 'battle',
    base: 32,
    tags: ['旧城线索', '流量破绽'],
    weights: { heat: 2, fame: 0.8, lowAuth: 1.1, fatigue: -0.6, injuries: -1.4 }
  },
  {
    id: 'heat_challenger',
    title: '热度把挑战者钓上来了',
    loc: 'park',
    desc: '网上有人约轻切，名声机会变多，但别让疲劳拖垮身体。观众爱看加赛，膝盖不爱。',
    eventNotebook: {
      reason: '热度引来挑战',
      entry: '公园栏杆边多了几个看手机的人。有人叫你名字，语气不凶，却像把你推到一块临时画出来的圈里。',
      beats: [
        '你没有立刻接招，先看对手体型、护具、周围距离。',
        '也看自己今天的腿还听不听话。',
        '热度带来的机会不干净，但也不是全没价值。'
      ],
      actionLabel: '判断要不要接',
      actionText: '接挑战能涨经验和名声，状态不好时硬接，观众不会替你恢复。',
      outcome: '你开始分辨：哪些挑战是在练胆，哪些只是在消耗你。'
    },
    enemy: 'E04',
    kind: 'battle',
    base: 44,
    tags: ['热度上桌', '挑战邀约'],
    when: { minHeat: 16 },
    weights: { heat: 2.4, fame: 1.0, fatigue: -1.0, injuries: -3.0 }
  },
  {
    id: 'oldtown_called_out',
    title: '旧城有人公开点你的名',
    loc: 'street',
    desc: '热度太高，旧城那边开始拿你当话题。风险高，收益也高，像一张没有小字条款的危险合同。',
    eventNotebook: {
      reason: '旧城高热度回流',
      entry: '旧城街口有人直接喊你的名字，旁边手机屏幕已经亮起来。路不宽，退路却有好几条，只是每条都不太体面。',
      beats: [
        '你把手放低，没有摆架子吓人。',
        '先确认出口、同伴、可能的武器，再决定今天是说话、撤离还是接下压力。',
        '被点名不等于必须上桌。'
      ],
      actionLabel: '处理点名',
      actionText: '硬接可能换来名声，也可能换来伤；退一步会丢面子，但能保住选择权。',
      outcome: '你越晚被情绪牵走，越像真的学过东西。'
    },
    enemy: 'E09',
    kind: 'battle',
    base: 50,
    tags: ['高风险', '旧城点名'],
    when: { minHeat: 30 },
    weights: { heat: 3.0, fame: 1.5, combatMemory: 1.2, fatigue: -0.8, injuries: -2.0 }
  },
  {
    id: 'last_fight_review',
    title: '上一战录像开始公开处刑',
    loc: 'home',
    desc: '针对上一位对手的问题做一次短复盘。镜头不会安慰你，但会告诉你下一场该读哪里。',
    eventNotebook: {
      reason: '战斗记忆触发复盘',
      entry: '出租屋桌上摆着半瓶水，手机里循环播放上一战。每次你想快进，画面都刚好停在最该看的地方。',
      beats: [
        '你按下暂停，把被打中的前因写出来：站距、回收、视线、体力。',
        '不是为了骂自己，是为了别让同一拳再来一次。',
        '复盘没有让失败变好看，但让它变得有用。'
      ],
      actionLabel: '做短复盘',
      actionText: '把上一战最难看的地方停住，拆成下一场该看的提示。',
      outcome: '你开始接受一件事：挨打也能成为教材，前提是别把它剪掉。'
    },
    npc: 'coach',
    kind: 'dialog',
    base: 58,
    tags: ['录像复盘', '战斗记忆'],
    when: { requiresLastEnemy: true },
    weights: { combatMemory: 3.2, losses: 4.5, auth: 0.5, fatigue: 0.2 }
  },
  {
    id: 'risk_handled_spread',
    title: '你没硬拼这事传开了',
    loc: 'store',
    desc: '你没有把冲突打成硬拼，小满和刘胖子会给出新的线索。有时候最像高手的操作，是让事情没升级。',
    eventNotebook: {
      reason: '风险处理后的回声',
      entry: '便利店门口今天安静得有点刻意。小满把零钱盒推回去，刘胖子在货架边假装整理薯片，耳朵却朝你这边。',
      beats: [
        '你没有把上次的事讲成战绩，只把当时怎么站位、怎么让人撤出去说了一遍。',
        '事情没升级，本身就是结果。',
        '小满看你的眼神松了一点，刘胖子也少开了半句玩笑。'
      ],
      actionLabel: '听后续线索',
      actionText: '别把降温吹成战绩，先听他们怎么说这件事的后账。',
      outcome: '你发现“不打起来”这件事，原来也会被人记住。'
    },
    npc: 'xiaoman',
    kind: 'dialog',
    base: 56,
    tags: ['风险处理', '关系线索'],
    when: { minRiskWins: 1 },
    weights: { riskWins: 8, fame: 0.8, heat: 0.6, combatMemory: 1.5 }
  },
  {
    id: 'physio_warning',
    title: '身体向你递交投诉书',
    loc: 'physio',
    desc: '疲劳和伤病已经影响训练质量。今天不处理，明天身体会用更贵的方式提醒你。',
    eventNotebook: {
      reason: '疲劳或伤病预警',
      entry: '理疗店的灯白得很诚实。师傅按到你肩后那一块时，你差点把“还行”咬碎在牙缝里。',
      beats: [
        '你把今天训练计划放低，听师傅讲哪里紧、哪里代偿。',
        '哪里再硬练会把小伤拖成麻烦。',
        '身体不是剧情道具，它会记账，也会催款。'
      ],
      actionLabel: '处理身体警告',
      actionText: '花一点钱和时间，换明天还能继续动的资格。',
      outcome: '恢复会耽误训练节奏，不恢复会让后面的选择一起变窄。'
    },
    kind: 'recovery',
    base: 18,
    tags: ['恢复', '伤病预警'],
    weights: { fatigue: 5, injuries: 8, combatMemory: 0.5, heat: -0.3 }
  },
  {
    id: 'worksite_day_labor_lead',
    title: '工地日结正在招能喘气的人',
    loc: 'store',
    desc: '刘胖子转来一条日结活：不体面，但现金和体能沉淀都是真的。砖不会问梦想，只问你搬不搬。',
    eventNotebook: {
      reason: '现金和体能压力',
      entry: '刘胖子转来的地址在工地边。太阳还没完全落下，砖堆已经把“梦想”两个字晒得很现实。',
      beats: [
        '你戴上手套，从最笨的搬运开始。',
        '动作不光彩，但重心、呼吸和腰背都会在重复里给你反馈。',
        '现金进账不浪漫，手臂发胀也不浪漫。'
      ],
      actionLabel: '接这趟日结',
      actionText: '用时间和疲劳换现金，也顺手让身体记住现实重量。',
      outcome: '你知道这一天没有白过，身体和钱包都被现实敲了一下。'
    },
    action: 'worksite_day_labor',
    kind: 'work',
    base: 30,
    tags: ['日结赚钱', '体能沉淀'],
    weights: { lowFame: 1.2, lowFatigue: 0.8, injuries: -4, heat: -0.2 }
  }
]);

function injuryLoad(injuries) {
  if (!Array.isArray(injuries) || !injuries.length) return 0;
  const turnLoad = injuries.reduce((sum, injury) => sum + clamp(injury?.turn || 0, 0, 10), 0) / 6;
  return injuries.length + turnLoad;
}

function factorsFor(state = {}) {
  const player = playerOf(state);
  const memory = combatMemoryOf(state, player);
  const day = clamp(state.day || 1, 1, 99);
  const dailyActions = clamp(state.daily?.actions, 0, 99);
  const heat = clamp(player.heat, 0, 100);
  const fame = clamp(player.fame, 0, 400);
  const auth = clamp(player.auth, 0, 100);
  const fatigue = clamp(player.fatigue, 0, 100);
  const injuries = injuryLoad(player.injuries);
  const fights = clamp(memory.fights, 0, 99);
  const wins = clamp(memory.wins, 0, 99);
  const losses = clamp(memory.losses, 0, 99);
  const riskWins = clamp(memory.riskWins, 0, 99);
  const maw = state.maw || player.maw || {};
  const recentCount = Array.isArray(memory.recent) ? memory.recent.length : 0;
  const remembered = fights + riskWins * 2 + (memory.lastEnemy ? 2 : 0) + recentCount * 0.5;

  return {
    player,
    memory,
    maw,
    state,
    day,
    dailyActions,
    heat: heat / 10,
    fame: fame / 40,
    lowFame: clamp((160 - fame) / 40, 0, 4),
    auth: auth / 20,
    lowAuth: (100 - auth) / 20,
    fatigue: fatigue / 20,
    lowFatigue: (100 - fatigue) / 20,
    injuries,
    fights,
    wins,
    losses,
    riskWins,
    combatMemory: clamp(remembered, 0, 20),
    mawMisread: clamp(maw.misread, 0, 100) / 10,
    fatherMemory: clamp(maw.fatherMemory, 0, 100) / 10,
    mawReforge: clamp(maw.reforge, 0, 100) / 10,
    earlyDay: day <= 7 ? (8 - day) / 2 : 0,
    homeIdle: state.loc === 'home' && (dailyActions <= 0 || number(state.daily?.idleSleepStreak) > 0) ? 1 : 0,
    jabNeed: day >= 6 && !hasSkill(state, 'jab') ? 1 : 0
  };
}

function passesRule(rule, factors) {
  const when = rule.when || {};
  const state = factors.state || {};
  const player = factors.player || {};
  const memory = factors.memory || {};
  const maw = factors.maw || {};
  const heat = number(player.heat);
  const fame = number(player.fame);
  const fatigue = number(player.fatigue);

  if (when.any?.length) {
    return when.any.some((branch) => passesRule({ ...rule, when: { ...when, any: undefined, ...branch } }, factors));
  }
  if (when.minDay != null && number(factors.day, 1) < when.minDay) return false;
  if (when.maxDay != null && number(factors.day, 1) > when.maxDay) return false;
  if (when.mawChapter && maw.chapter !== when.mawChapter) return false;
  if (when.minMawMisread != null && number(maw.misread) < when.minMawMisread) return false;
  if (when.maxMawMisread != null && number(maw.misread) > when.maxMawMisread) return false;
  if (when.minFatherMemory != null && number(maw.fatherMemory) < when.minFatherMemory) return false;
  if (when.minMawReforge != null && number(maw.reforge) < when.minMawReforge) return false;
  if (when.minHeat != null && heat < when.minHeat) return false;
  if (when.maxHeat != null && heat > when.maxHeat) return false;
  if (when.minFame != null && fame < when.minFame) return false;
  if (when.maxFame != null && fame > when.maxFame) return false;
  if (when.minFatigue != null && fatigue < when.minFatigue) return false;
  if (when.maxFatigue != null && fatigue > when.maxFatigue) return false;
  if (when.minInjuries != null && factors.injuries < when.minInjuries) return false;
  if (when.requiresLastEnemy && !memory.lastEnemy) return false;
  if (when.minRiskWins != null && number(memory.riskWins) < when.minRiskWins) return false;
  if (when.lastResult && memory.lastResult !== when.lastResult) return false;
  if (when.missingSkill && hasSkill(state, when.missingSkill)) return false;
  if (when.requiresHomeIdle && !factors.homeIdle) return false;
  return true;
}

function hashText(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableJitter(rule, state = {}, factors) {
  const seed = state.seed ?? state.daily?.sideSeed ?? 0;
  const key = `${state.day || 0}:${seed}:${rule.id}:${factors.memory?.fights || 0}:${factors.player?.heat || 0}`;
  return (hashText(key) % 100) / 100;
}

function scoreRule(rule, factors, state) {
  const breakdown = {};
  let score = number(rule.base, 0);
  Object.entries(rule.weights || {}).forEach(([key, weight]) => {
    const contribution = number(factors[key]) * number(weight);
    if (!contribution) return;
    breakdown[key] = Number(contribution.toFixed(2));
    score += contribution;
  });
  if (state.loc && state.loc === rule.loc) {
    breakdown.currentLoc = 3;
    score += 3;
  }
  Object.entries(contextualBreakdown(rule, factors)).forEach(([key, value]) => {
    if (!value) return;
    breakdown[key] = Number(value.toFixed(2));
    score += value;
  });
  score += stableJitter(rule, state, factors);
  return { score: Number(score.toFixed(2)), breakdown };
}

function eventRiskRaw(rule = {}) {
  return rule.risk ?? ENEMIES[rule.enemy]?.risk ?? (rule.enemy ? '中' : '低');
}

function riskNumber(value, fallback = 1) {
  if (typeof value === 'string' && RISK_LABEL_TO_LEVEL[value]) return RISK_LABEL_TO_LEVEL[value];
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function eventRiskLevel(rule = {}) {
  return clamp(riskNumber(eventRiskRaw(rule), rule.enemy ? 2 : 1), 1, 5);
}

function eventRiskLabel(rule = {}) {
  const raw = eventRiskRaw(rule);
  if (typeof raw === 'string') return raw;
  const level = riskNumber(raw, 1);
  if (level >= 4) return '高';
  if (level >= 2) return '中';
  return '低';
}

function contextualBreakdown(rule, factors) {
  const player = factors.player || {};
  const fatigue = clamp(player.fatigue, 0, 100);
  const heat = clamp(player.heat, 0, 100);
  const injuries = clamp(factors.injuries, 0, 10);
  const risk = eventRiskLevel(rule);
  const isBattle = Boolean(rule.enemy);
  const out = {};

  if (rule.kind === 'recovery' && (fatigue >= 45 || injuries > 0)) {
    out.recoveryNeed = clamp((fatigue - 35) / 8 + injuries * 3, 0, 24);
  }

  if (isBattle && risk >= 3) {
    const bodyPressure = clamp((fatigue - 55) / 10, 0, 8) + injuries * 1.35;
    if (bodyPressure > 0) out.hardFightStress = -bodyPressure * (risk - 1) * 0.9;
  }

  if (isBattle && heat >= 18 && risk >= 2) {
    out.highHeatChallenge = clamp((heat - 14) / 10, 0, 7) * Math.min(risk, 4) * 0.45;
  }

  if (factors.homeIdle && factors.day <= 7) {
    if (isBattle) out.homeIdle = -10;
    else if (rule.kind === 'dialog' || rule.kind === 'shop') out.homeIdle = 4;
  }

  return out;
}

function readableReason(key, value) {
  const positive = value >= 0;
  const map = {
    heat: positive ? '热度把事情推上来' : '热度被压住',
    fame: positive ? '名声带来机会' : '名声不足',
    lowFame: '名声还低',
    auth: positive ? '真实训练在起效' : '真实性不足',
    lowAuth: '动作真实性不足',
    fatigue: positive ? '疲劳偏高' : '疲劳压低强度',
    lowFatigue: positive ? '身体余量够' : '身体余量不足',
    injuries: positive ? '伤病牵动风险' : '伤病压低硬战',
    fights: '实战次数在累积',
    wins: '胜场带来机会',
    losses: '失败复盘在提醒',
    riskWins: '上次降温有回声',
    combatMemory: '上一战还在发酵',
    mawMisread: '误判还没消化',
    fatherMemory: '父亲记忆在提醒',
    mawReforge: '茂拳重铸推进',
    recoveryNeed: '身体需要恢复',
    hardFightStress: '身体状态不适合硬战',
    highHeatChallenge: '热度引来挑战',
    earlyDay: '早期适合低压安排',
    homeIdle: positive ? '今天还没出门，适合轻提醒' : '不优先推硬战',
    jabNeed: '刺拳还没补上'
  };
  return map[key] || `${FACTOR_LABELS[key] || key}${positive ? '上升' : '下降'}`;
}

function reasonFromBreakdown(breakdown) {
  const entries = Object.entries(breakdown)
    .filter(([key]) => key !== 'currentLoc')
    .filter(([key, value]) => value > 0 || key === 'hardFightStress')
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 2)
    .map(([key, value]) => readableReason(key, value));
  if (!entries.length && breakdown.currentLoc) entries.push('就在当前地点');
  return entries.join(' / ');
}

function opportunityCooldownKey(rule = {}) {
  if (rule.cooldownKey) return rule.cooldownKey;
  if (rule.when?.requiresHomeIdle || rule.tags?.includes('防摆烂')) return 'home_idle_reminder';
  if (rule.tags?.includes('低压推荐')) return 'early_soft_guide';
  if (rule.tags?.includes('沙包连击') || rule.tags?.includes('刺拳提示')) return 'jab_bag_hint';
  if (rule.kind === 'battle') return `battle_${rule.loc || 'any'}`;
  if (rule.kind === 'shop') return `shop_${rule.loc || 'any'}`;
  if (rule.kind === 'recovery') return 'recovery';
  return `${rule.kind || 'event'}_${rule.loc || 'any'}`;
}

function publicCard(rule, score, breakdown) {
  const { base, weights, when, ...card } = rule;
  return {
    ...card,
    cooldownKey: opportunityCooldownKey(rule),
    score,
    riskLevel: eventRiskLevel(rule),
    riskLabel: eventRiskLabel(rule),
    weightBreakdown: breakdown,
    reason: reasonFromBreakdown(breakdown)
  };
}

export function buildOpportunities(state = {}) {
  const factors = factorsFor(state);
  const count = clamp(Math.floor(number(state.opportunityCount, 3)), 1, 3);
  const cooldowns = state.daily?.opportunityCooldowns || {};
  const usedKeys = new Set();
  return EVENT_RULES
    .filter((rule) => passesRule(rule, factors))
    .map((rule) => {
      const { score, breakdown } = scoreRule(rule, factors, state);
      return publicCard(rule, score, breakdown);
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .filter((card) => {
      if (cooldowns[card.cooldownKey]) return false;
      if (usedKeys.has(card.cooldownKey)) return false;
      usedKeys.add(card.cooldownKey);
      return true;
    })
    .slice(0, count);
}

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(siteRoot, "..");
const sourceDataPath = path.join(projectRoot, "data", "processed", "knowledge-base.json");
const enrichmentDataPath = path.join(projectRoot, "data", "processed", "spot-enrichment.json");
const generatedDataPath = path.join(siteRoot, "src", "data", "generated", "site-data.json");
const generatedEnrichmentPath = path.join(siteRoot, "src", "data", "generated", "spot-enrichment.json");
const stylesPath = path.join(siteRoot, "src", "styles", "site.css");
const scriptDir = path.join(siteRoot, "src", "scripts");
const publicDir = path.join(siteRoot, "public");
const publicSpotDir = path.join(publicDir, "images", "spots");
const publicRealSpotDir = path.join(publicSpotDir, "real");
const publicIconDir = path.join(publicDir, "icons");
const distDir = path.join(siteRoot, "dist");
const distScriptDir = path.join(distDir, "scripts");
const distStyleDir = path.join(distDir, "styles");
const distDataDir = path.join(distDir, "data");

const buildDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai"
}).format(new Date());

const modeMeta = {
  shore: {
    slug: "shore",
    label: "海岸钓",
    pageTitle: "海岸钓",
    subtitle: "从防波堤、港池、入海口与闸口点位里，优先看鱼更多、稳定性更强的岸边核心点。",
    shortIntro: "优先推荐海鲈、黑头和鲅鱼表现更强的岸边点位。",
    helper: "默认按推荐强度排序",
    homeImage: "/images/spots/mode-shore-home.png",
    homeCardLead: "优先看防波堤、港池、入海口与闸口里的强点。",
    tideNote: "优先看涨二分、落八分与大潮窗口。",
    pageKey: "shore-list",
    detailBackLabel: "返回海岸钓"
  },
  boat: {
    slug: "boat",
    label: "出海钓",
    pageTitle: "出海钓",
    subtitle: "从海洋牧场、人工鱼礁与沉船礁区里，优先看实测表现更强的出海点。",
    shortIntro: "优先推荐海洋牧场、人工鱼礁与沉船礁区的核心海域。",
    helper: "默认按推荐强度排序",
    homeImage: "/images/spots/mode-boat-home.png",
    homeCardLead: "优先看海洋牧场、人工鱼礁与沉船礁区里的强点。",
    tideNote: "优先看清晨、傍晚与潮汐转换窗口。",
    pageKey: "boat-list",
    detailBackLabel: "返回出海钓"
  }
};

const tierMeta = {
  T1: "第一梯队",
  T2: "第二梯队",
  T3: "第三梯队"
};

const newbieMeta = {
  high: {
    label: "高",
    copy: "适合作为入门或低门槛尝试点。",
    badge: "新手友好"
  },
  medium: {
    label: "中",
    copy: "更适合有基础、愿意按天气与潮汐做准备的钓友。",
    badge: "需做准备"
  },
  low: {
    label: "低",
    copy: "更适合有经验钓友，优先结伴并做好装备与撤离预案。",
    badge: "进阶点位"
  }
};

const verificationMeta = {
  verified: {
    label: "已核验",
    tone: "stable"
  },
  partially_verified: {
    label: "部分核验",
    tone: "warm"
  },
  pending_review: {
    label: "待复核",
    tone: "muted"
  }
};

const dangerMeta = {
  deep_water_no_guardrail: {
    label: "深水无护栏",
    detail: "部分堤岸临深水且无护栏，站位空间有限，失足后存在直接落水风险。"
  },
  slippery_tetrapods: {
    label: "消波块极滑",
    detail: "消波块与乱石结构在打湿后附着力很差，踩空或打滑后容易坠落或被卡住。"
  },
  slippery_breakwater: {
    label: "防波堤湿滑",
    detail: "堤面与边缘结构在海风、潮水和青苔影响下易湿滑，靠边站位需格外谨慎。"
  },
  tide_cutoff_risk: {
    label: "涨潮易被困",
    detail: "潮位上涨后退路可能变窄或消失，深入堤头前必须判断撤离窗口。"
  },
  night_fall_risk: {
    label: "夜间坠落风险",
    detail: "夜钓照明不足且救援难度更高，失足后自救概率明显下降。"
  },
  strong_wave_impact: {
    label: "浪涌冲击强",
    detail: "浪涌拍岸与回流冲击较强，靠边与跨结构走位存在被带翻风险。"
  }
};

const speciesAliases = {
  海鲈: ["海鲈", "花鲈"],
  许氏平鲉: ["许氏平鲉", "黑头", "渤海石斑"],
  鲅鱼: ["鲅鱼", "蓝点马鲛"],
  梭鱼: ["梭鱼", "鲻鱼"],
  海鲶鱼: ["海鲶鱼"],
  比目鱼: ["比目鱼", "牙鲆", "半滑舌鳎"],
  黄姑鱼: ["黄姑鱼"]
};

const imageTypeMeta = {
  official_scene: {
    label: "官方实景图",
    purpose: "用于快速识别现场环境与海域气质。"
  },
  official_report: {
    label: "官方报道图",
    purpose: "用于承接官方公开报道中的区域环境信息。"
  },
  public_environment: {
    label: "公开环境图",
    purpose: "用于识别区域氛围、岸线结构和周边场景。"
  },
  map_annotated: {
    label: "地图标注图",
    purpose: "用于理解点位相对位置、结构关系与常用钓段。"
  },
  placeholder_structure: {
    label: "结构占位图",
    purpose: "当前仍以结构示意为主，等待后续替换成更贴近现场的公开图。"
  }
};

const imageReadinessMeta = {
  real_asset: {
    label: "已接入站内图片"
  },
  remote_asset: {
    label: "已接入公开图片"
  },
  candidate_ready: {
    label: "已挂接公开来源"
  },
  placeholder_only: {
    label: "仍在占位阶段"
  }
};

const imagePrecisionMeta = {
  exact_spot: "现场实图",
  nearby_environment: "近邻环境图",
  regional_environment: "区域环境图",
  annotated_map: "地图标注图",
  placeholder: "结构占位图"
};

const verificationBreakdownMeta = {
  verified: "已核到",
  pending_review: "待复核",
  not_applicable: "不适用",
  supported: "已支持",
  regional_supported: "大区域已支持",
  local_alias: "按本地叫法保留",
  dynamic_review_required: "需出发前复核",
  general_review_required: "需出发前复核",
  life_threat_only: "仅生命危险前置"
};

const imageReplaceTodoMeta = {
  replace_now: "优先替换",
  replace_when_found: "找到更合适真图后替换",
  replace_list_first: "优先替换列表图",
  replace_hero_first: "优先替换详情图",
  map_ok_for_now: "当前地图图可继续使用",
  placeholder_ok_for_now: "当前占位图可暂时使用",
  maintain_current: "当前方案可继续沿用"
};

const filterGroups = {
  shore: [
    { key: "region", label: "区域", values: ["曹妃甸", "乐亭", "京唐港", "丰南", "滦南"] },
    { key: "species", label: "目标鱼", values: ["海鲈", "许氏平鲉", "鲅鱼", "梭鱼"] },
    { key: "structure", label: "结构类型", values: ["防波堤", "港池", "入海口", "渔港", "盐场闸口"] },
    { key: "newbie", label: "新手友好", values: ["high", "medium", "low"] }
  ],
  boat: [
    { key: "region", label: "区域", values: ["曹妃甸", "乐亭", "丰南", "京唐港", "滦南"] },
    { key: "species", label: "目标鱼", values: ["鲅鱼", "海鲈", "许氏平鲉"] },
    { key: "structure", label: "海域类型", values: ["国家级海洋牧场", "人工鱼礁区", "沉船礁区", "外海", "渔港"] },
    { key: "newbie", label: "新手友好", values: ["high", "medium", "low"] }
  ]
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function slugText(value) {
  return String(value).trim().toLowerCase();
}

function tierOrder(tier) {
  return { T1: 1, T2: 2, T3: 3 }[tier] || 99;
}

function defaultImageSource(type) {
  if (type === "map_annotated") {
    return "公开地图标注整理";
  }
  if (type === "placeholder_structure") {
    return "待替换占位结构图";
  }
  if (type === "official_scene" || type === "official_report") {
    return "官方公开资料";
  }
  return "公开环境图占位";
}

function defaultEnrichmentOverride(spot) {
  return {
    assetPriority: "normal",
    dangerFlags: [],
    dangerLevel: "none",
    verificationStatus: "pending_review",
    imageType: {
      list: spot.mode === "boat" ? "public_environment" : "map_annotated",
      hero: spot.mode === "boat" ? "map_annotated" : "placeholder_structure"
    },
    imageSourceTitle: {
      list: null,
      hero: null
    },
    imagePrecision: {
      list: "placeholder",
      hero: "placeholder"
    },
    imageAssetUrl: {
      list: null,
      hero: null
    },
    verificationRefs: [],
    verificationCheckedAt: buildDate,
    verificationWindowDays: inferVerificationWindowDays(spot),
    verificationBreakdown: inferVerificationBreakdown(spot, "pending_review"),
    replacementPriority: inferReplacementPriority("normal"),
    imageReplaceTodo: inferImageReplaceTodo({
      list: spot.mode === "boat" ? "public_environment" : "map_annotated",
      hero: spot.mode === "boat" ? "map_annotated" : "placeholder_structure"
    }, "normal"),
    verificationNotes: "当前点位先按用户资料与结构逻辑入库，公开核验仍在持续补强。"
  };
}

function inferVerificationWindowDays(spot) {
  if (spot.spotTypes.some((type) => /防波堤|港池|渔港/.test(type))) {
    return 30;
  }
  return 180;
}

function inferReplacementPriority(assetPriority) {
  return assetPriority === "high" ? "p0" : "p2";
}

function inferVerificationBreakdown(spot, verificationStatus) {
  const verified = verificationStatus === "verified";
  const partial = verificationStatus === "partially_verified";
  return {
    identity: verified ? "supported" : partial ? "regional_supported" : "pending",
    spot_name: verified ? "supported" : partial ? "local_alias" : "pending",
    access_control: spot.spotTypes.some((type) => /防波堤|港池|渔港/.test(type)) ? "dynamic_review_required" : "general_review_required",
    danger_front_badge: "life_threat_only"
  };
}

function inferImageReplaceTodo(imageType, assetPriority) {
  if (assetPriority === "high" && imageType.list !== "official_scene" && imageType.list !== "official_report") {
    return "replace_list_first";
  }
  if (assetPriority === "high" && imageType.hero === "placeholder_structure") {
    return "replace_hero_first";
  }
  if (imageType.hero === "map_annotated") {
    return "map_ok_wait_real_photo";
  }
  return "maintain_current";
}

function imageReadiness(type, sourceUrl, localAsset, remoteAssetUrl) {
  if (localAsset) {
    return "real_asset";
  }
  if (remoteAssetUrl) {
    return "remote_asset";
  }
  if (sourceUrl || type === "official_scene" || type === "official_report" || type === "public_environment" || type === "map_annotated") {
    return "candidate_ready";
  }
  return "placeholder_only";
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findLocalRealImage(spotId, variant) {
  const extensions = ["webp", "jpg", "jpeg", "png", "avif"];

  for (const extension of extensions) {
    const filename = `${spotId}-${variant}.${extension}`;
    const absolutePath = path.join(publicRealSpotDir, filename);
    if (await fileExists(absolutePath)) {
      return {
        src: `/images/spots/real/${filename}`,
        absolutePath
      };
    }
  }

  return null;
}

async function buildSpotImage(spot, variant, override) {
  const type = override.imageType?.[variant] || defaultEnrichmentOverride(spot).imageType[variant];
  const localAsset = await findLocalRealImage(spot.id, variant);
  const remoteAssetUrl = override.imageAssetUrl?.[variant] || null;
  const source = localAsset
    ? "站内已接入公开图片资源"
    : remoteAssetUrl
      ? "已接入公开远程图片资源"
    : override.imageSource?.[variant] || defaultImageSource(type);
  const sourceUrl = override.imageSourceUrl?.[variant] || null;
  const readiness = imageReadiness(type, sourceUrl, localAsset, remoteAssetUrl);
  const meta = imageTypeMeta[type] || imageTypeMeta.placeholder_structure;

  return {
    src: localAsset?.src || remoteAssetUrl || `/images/spots/${spot.id}-${variant}.png`,
    alt: variant === "list" ? `${spot.name} 环境识别图` : `${spot.name} 结构理解图`,
    type,
    label: meta.label,
    purpose: meta.purpose,
    source,
    sourceUrl,
    sourceTitle: override.imageSourceTitle?.[variant] || null,
    precision: override.imagePrecision?.[variant] || "placeholder",
    readiness,
    readinessLabel: imageReadinessMeta[readiness].label
  };
}

async function loadEnrichmentOverrides() {
  if (!(await fileExists(enrichmentDataPath))) {
    return {};
  }

  return JSON.parse(await fs.readFile(enrichmentDataPath, "utf8"));
}

function firstSpeciesGearReference(modeGuide, species) {
  const aliases = speciesAliases[species] || [species];
  return modeGuide.filter((line) => aliases.some((alias) => line.includes(alias))).slice(0, 2);
}

function summarizeSeasons(seasons) {
  return seasons.slice(0, 2).map(compactSeasonLine).join(" · ");
}

function compactSeasonLine(text) {
  const [label, rawRest] = text.includes("：") ? text.split("：") : [null, text];
  const rest = (rawRest || text)
    .replace(/月上旬|月中旬|月下旬/g, "月")
    .replace(/；/g, " / ")
    .replace(/全年 \/ 旺季/g, "全年，旺季")
    .replace(/\s+/g, " ")
    .trim();

  return label ? `${label}：${rest}` : rest;
}

function detailWindowTail(mode) {
  if (mode === "shore") {
    return "优先看涨二分、落八分以及大潮窗口，清晨和傍晚通常更稳定。";
  }
  return "优先看清晨、傍晚与潮汐转换窗口，出海前先核对 72 小时海况。";
}

function buildWhoShouldGo(spot) {
  const newbie = newbieMeta[spot.newbieLevel];
  const access = spot.costAndAccess || "";

  return unique([
    newbie?.copy,
    access
  ]);
}

function classifyRiskNotes(spot, enrichment) {
  const safetyKeywords = /(无护栏|防滑|湿滑|深水|坠|落水|涨潮|被困|风力|大雾|暴雨|夜钓|浪|救生|单独|钉鞋|寒潮)/;
  const personSafety = [];
  const accessRules = [];

  for (const flag of enrichment.dangerFlags) {
    if (dangerMeta[flag]) {
      personSafety.push(dangerMeta[flag].detail);
    }
  }

  for (const note of spot.safetyAndRules) {
    if (safetyKeywords.test(note)) {
      personSafety.push(note);
    } else {
      accessRules.push(note);
    }
  }

  if (enrichment.verificationStatus !== "verified") {
    accessRules.push("点位名称、进入边界与动态管理信息，出发前仍建议再次复核。");
  }

  return {
    safety: unique(personSafety),
    access: unique(accessRules)
  };
}

function buildSummary(spot) {
  const lead = spot.highlights[0] || spot.catchProfile.stability;
  return `${lead} · 旺季参考 ${spot.catchProfile.peakAvgPerPerson}`;
}

function buildRelatedGroups(spot, spots, rankings) {
  const sameMode = spots
    .filter((candidate) => candidate.mode === spot.mode && candidate.id !== spot.id)
    .sort((a, b) => tierOrder(a.tier) - tierOrder(b.tier) || a.rank - b.rank);
  const sameRegion = sameMode.filter((candidate) => candidate.region === spot.region);
  const primarySpecies = spot.targetSpecies[0];
  const rankedIds = rankings?.[spot.mode]?.[primarySpecies] || [];
  const sameTarget = rankedIds
    .filter((id) => id !== spot.id)
    .map((id) => spots.find((candidate) => candidate.id === id))
    .filter(Boolean);

  const groups = {
    sameRegion: sameRegion.slice(0, 2).map((item) => item.id),
    sameMode: sameMode.slice(0, 2).map((item) => item.id),
    sameTarget: sameTarget.slice(0, 2).map((item) => item.id)
  };

  groups.all = unique([
    ...groups.sameRegion,
    ...groups.sameMode,
    ...groups.sameTarget
  ]);

  return groups;
}

async function buildEnrichedSpot(spot, kb, enrichmentOverrides) {
  const override = enrichmentOverrides[spot.id] || defaultEnrichmentOverride(spot);
  const listImage = await buildSpotImage(spot, "list", override);
  const heroImage = await buildSpotImage(spot, "hero", override);

  const relatedGroups = buildRelatedGroups(spot, kb.spots, kb.rankings);
  const riskNotes = classifyRiskNotes(spot, override);
  const guideReference = kb.globalGuides[spot.mode];
  const detailTackle = unique([
    ...spot.methodSummary,
    ...spot.targetSpecies.flatMap((species) => firstSpeciesGearReference(guideReference.gearReference, species))
  ]);
  const detailWindows = unique([
    ...spot.seasonWindows,
    detailWindowTail(spot.mode)
  ]);

  return {
    ...spot,
    modeLabel: modeMeta[spot.mode].label,
    tierLabel: tierMeta[spot.tier] || spot.tier,
    rankLabel: `第 ${spot.rank} 推荐`,
    copySummary: buildSummary(spot),
    listSeasonSummary: summarizeSeasons(spot.seasonWindows),
    bestWindowSummary: compactSeasonLine(spot.seasonWindows[0] || "窗口信息待补"),
    listImage,
    heroImage,
    imageType: override.imageType,
    imageSource: {
      list: listImage.source,
      hero: heroImage.source
    },
    imageSourceTitle: {
      list: listImage.sourceTitle,
      hero: heroImage.sourceTitle
    },
    imageSourceUrl: {
      list: listImage.sourceUrl,
      hero: heroImage.sourceUrl
    },
    imagePrecision: {
      list: listImage.precision,
      hero: heroImage.precision
    },
    imageReadiness: {
      list: listImage.readiness,
      hero: heroImage.readiness
    },
    dangerFlags: override.dangerFlags,
    dangerLevel: override.dangerLevel,
    assetPriority: override.assetPriority || "normal",
    verificationStatus: override.verificationStatus,
    verificationNotes: override.verificationNotes,
    verificationRefs: override.verificationRefs || [],
    verificationCheckedAt: override.verificationCheckedAt || buildDate,
    verificationWindowDays: override.verificationWindowDays || inferVerificationWindowDays(spot),
    verificationBreakdown: override.verificationBreakdown || inferVerificationBreakdown(spot, override.verificationStatus),
    replacementPriority: override.replacementPriority || inferReplacementPriority(override.assetPriority || "normal"),
    imageReplaceTodo: override.imageReplaceTodo || inferImageReplaceTodo(override.imageType || defaultEnrichmentOverride(spot).imageType, override.assetPriority || "normal"),
    lastVerifiedAt: override.verificationCheckedAt || buildDate,
    relatedSpotIds: relatedGroups.all,
    relatedGroups,
    detailWindows,
    detailTackle,
    detailWhoShouldGo: buildWhoShouldGo(spot),
    riskNotes,
    sourceDocumentTitle: kb.sourceDocuments.find((item) => item.id === spot.sourceDocumentId)?.title || spot.sourceDocumentId
  };
}

function wrapText(text, maxChars) {
  const words = [...text];
  const lines = [];
  let current = "";

  for (const char of words) {
    current += char;
    if (current.length >= maxChars) {
      lines.push(current);
      current = "";
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 3);
}

function spotVisualMeta(spot) {
  const isShore = spot.mode === "shore";
  const primaryType = spot.spotTypes[0];
  const palette = isShore
    ? ["#0a2031", "#1d4360", "#df8e58", "#edf4f7"]
    : ["#071521", "#1f5c73", "#d7bb8f", "#f4f7f8"];
  const accent = palette[2];

  let structurePath = `<path d="M0 520 C180 420 320 430 520 480 C720 530 980 500 1400 380 L1400 900 L0 900 Z" fill="rgba(237,244,247,0.08)"/>`;
  let overlay = `<path d="M880 180 L1140 240 L1100 480 L840 440 Z" fill="rgba(223,142,88,0.18)" stroke="rgba(223,142,88,0.4)" stroke-width="3"/>`;

  if (primaryType.includes("防波堤")) {
    structurePath = `
      <path d="M0 900 L0 560 L460 460 L980 480 L1400 400 L1400 900 Z" fill="rgba(237,244,247,0.08)"/>
      <path d="M190 450 L560 520 L520 600 L140 530 Z" fill="rgba(223,142,88,0.6)"/>
      <path d="M560 520 L720 560 L690 632 L520 600 Z" fill="rgba(223,142,88,0.45)"/>
      <path d="M720 560 L880 600 L848 672 L690 632 Z" fill="rgba(223,142,88,0.32)"/>
    `;
    overlay = `<circle cx="1110" cy="250" r="108" fill="rgba(223,142,88,0.18)" stroke="rgba(223,142,88,0.5)" stroke-width="4"/>`;
  } else if (primaryType.includes("港池") || primaryType.includes("渔港")) {
    structurePath = `
      <rect x="120" y="320" width="1160" height="360" rx="56" fill="rgba(237,244,247,0.08)"/>
      <rect x="220" y="380" width="860" height="240" rx="32" fill="rgba(7,21,33,0.34)" stroke="rgba(237,244,247,0.16)" stroke-width="4"/>
      <path d="M0 900 L0 680 C220 620 420 610 640 650 C820 682 1080 672 1400 620 L1400 900 Z" fill="rgba(223,142,88,0.18)"/>
    `;
    overlay = `<path d="M1000 220 L1180 220 L1180 360 L1000 360 Z" fill="rgba(223,142,88,0.16)" stroke="rgba(223,142,88,0.42)" stroke-width="4"/>`;
  } else if (primaryType.includes("入海口") || primaryType.includes("咸淡水交汇区") || primaryType.includes("盐场闸口")) {
    structurePath = `
      <path d="M0 900 L0 420 C230 390 420 420 630 520 C812 606 1080 650 1400 600 L1400 900 Z" fill="rgba(237,244,247,0.08)"/>
      <path d="M420 0 L630 900" stroke="rgba(223,142,88,0.24)" stroke-width="90"/>
      <path d="M760 0 L920 900" stroke="rgba(223,142,88,0.18)" stroke-width="70"/>
    `;
    overlay = `<path d="M1080 180 L1160 180 L1160 420 L1080 420 Z" fill="rgba(223,142,88,0.16)" stroke="rgba(223,142,88,0.42)" stroke-width="4"/>`;
  } else if (primaryType.includes("海洋牧场") || primaryType.includes("人工鱼礁区")) {
    structurePath = `
      <path d="M0 900 L0 610 C260 500 420 460 640 500 C840 534 1090 480 1400 330 L1400 900 Z" fill="rgba(237,244,247,0.08)"/>
      <path d="M360 550 L460 450 L560 550 L460 650 Z" fill="rgba(223,142,88,0.22)" stroke="rgba(223,142,88,0.38)" stroke-width="4"/>
      <path d="M590 510 L690 410 L790 510 L690 610 Z" fill="rgba(223,142,88,0.18)" stroke="rgba(223,142,88,0.34)" stroke-width="4"/>
      <path d="M820 470 L920 370 L1020 470 L920 570 Z" fill="rgba(223,142,88,0.14)" stroke="rgba(223,142,88,0.3)" stroke-width="4"/>
    `;
    overlay = `<circle cx="1080" cy="250" r="118" fill="rgba(223,142,88,0.14)" stroke="rgba(223,142,88,0.42)" stroke-width="4"/>`;
  }

  return {
    palette,
    accent,
    structurePath,
    overlay
  };
}

function renderSpotSvg(spot, variant) {
  const width = variant === "list" ? 1200 : 1400;
  const height = variant === "list" ? 900 : 1000;
  const { palette, structurePath, overlay } = spotVisualMeta(spot);
  const lines = wrapText(spot.name, variant === "list" ? 15 : 18);
  const titleY = variant === "list" ? 626 : 694;
  const typeLabel = spot.spotTypes.slice(0, 2).join(" · ");
  const warning = spot.dangerFlags[0] ? `生命危险：${dangerMeta[spot.dangerFlags[0]].label}` : "当前使用结构占位图";
  const labelBg = spot.dangerFlags[0] ? "rgba(255,125,94,0.2)" : "rgba(237,244,247,0.12)";
  const labelStroke = spot.dangerFlags[0] ? "rgba(255,125,94,0.55)" : "rgba(237,244,247,0.18)";
  const titleLines = lines.map((line, index) => {
    const y = titleY + index * (variant === "list" ? 66 : 74);
    return `<text x="92" y="${y}" fill="#edf4f7" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="${variant === "list" ? 52 : 58}" font-weight="700">${escapeHtml(line)}</text>`;
  }).join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg-${spot.id}-${variant}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette[0]}"/>
          <stop offset="58%" stop-color="${palette[1]}"/>
          <stop offset="100%" stop-color="#10283a"/>
        </linearGradient>
        <pattern id="grid-${spot.id}-${variant}" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(237,244,247,0.05)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg-${spot.id}-${variant})"/>
      <rect width="${width}" height="${height}" fill="url(#grid-${spot.id}-${variant})"/>
      <circle cx="${variant === "list" ? 1040 : 1120}" cy="${variant === "list" ? 124 : 160}" r="${variant === "list" ? 144 : 180}" fill="rgba(223,142,88,0.1)"/>
      <circle cx="${variant === "list" ? 160 : 220}" cy="${variant === "list" ? 220 : 250}" r="${variant === "list" ? 88 : 120}" fill="rgba(237,244,247,0.08)"/>
      <g>${structurePath}</g>
      <g>${overlay}</g>
      <path d="M0 ${height - 210} C 260 ${height - 270}, 460 ${height - 180}, ${width} ${height - 320} L ${width} ${height} L 0 ${height} Z" fill="rgba(7,21,33,0.44)"/>
      <rect x="92" y="84" rx="24" ry="24" width="${variant === "list" ? 194 : 208}" height="54" fill="rgba(7,21,33,0.42)" stroke="rgba(237,244,247,0.18)" stroke-width="2"/>
      <text x="122" y="120" fill="#edf4f7" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="24" font-weight="600">${spot.modeLabel}</text>
      <rect x="302" y="84" rx="24" ry="24" width="${variant === "list" ? 204 : 248}" height="54" fill="rgba(7,21,33,0.26)" stroke="rgba(223,142,88,0.24)" stroke-width="2"/>
      <text x="332" y="120" fill="${palette[2]}" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="24" font-weight="600">${escapeHtml(spot.region)}</text>
      <rect x="92" y="162" rx="20" ry="20" width="${variant === "list" ? 336 : 392}" height="48" fill="rgba(237,244,247,0.1)"/>
      <text x="120" y="194" fill="#edf4f7" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="22">${escapeHtml(typeLabel)}</text>
      ${titleLines}
      <text x="92" y="${variant === "list" ? 802 : 890}" fill="rgba(237,244,247,0.82)" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="${variant === "list" ? 24 : 26}">${escapeHtml(spot.coreZone)}</text>
      <rect x="${variant === "list" ? 92 : 104}" y="${variant === "list" ? 824 : 912}" rx="24" ry="24" width="${variant === "list" ? 420 : 474}" height="${variant === "list" ? 52 : 56}" fill="${labelBg}" stroke="${labelStroke}" stroke-width="2"/>
      <text x="${variant === "list" ? 122 : 136}" y="${variant === "list" ? 858 : 948}" fill="#edf4f7" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="${variant === "list" ? 22 : 24}" font-weight="600">${escapeHtml(warning)}</text>
    </svg>
  `;
}

function renderModeSvg(mode) {
  const meta = modeMeta[mode];
  const palette = mode === "shore"
    ? ["#0b2132", "#1d4963", "#ec9962", "#f2f6f8"]
    : ["#071521", "#215d74", "#d9b588", "#f3f6f7"];

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="mode-${mode}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette[0]}"/>
          <stop offset="100%" stop-color="${palette[1]}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#mode-${mode})"/>
      <circle cx="980" cy="160" r="140" fill="rgba(236,153,98,0.18)"/>
      <path d="M0 900 L0 560 C240 440 420 430 620 500 C830 574 1010 518 1200 420 L1200 900 Z" fill="rgba(242,246,248,0.08)"/>
      <path d="M110 520 C220 470 340 480 470 560 C590 634 716 650 860 594" fill="none" stroke="rgba(236,153,98,0.5)" stroke-width="24" stroke-linecap="round"/>
      <path d="M130 610 C230 570 350 586 494 656 C616 716 734 716 850 682" fill="none" stroke="rgba(236,153,98,0.28)" stroke-width="18" stroke-linecap="round"/>
      ${mode === "boat"
        ? `<path d="M688 360 L772 360 L756 406 L704 406 Z" fill="rgba(242,246,248,0.9)"/><path d="M722 254 L722 360" stroke="rgba(242,246,248,0.9)" stroke-width="6"/><path d="M722 268 L780 320 L722 320 Z" fill="rgba(236,153,98,0.7)"/>`
        : `<path d="M716 246 L734 246 L734 476 L716 476 Z" fill="rgba(242,246,248,0.92)"/><path d="M674 316 L776 316" stroke="rgba(242,246,248,0.92)" stroke-width="8"/><circle cx="725" cy="214" r="38" fill="rgba(236,153,98,0.62)"/>`}
      <text x="88" y="120" fill="#f2f6f8" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="34" font-weight="600">唐山海钓指南</text>
      <text x="88" y="686" fill="#f2f6f8" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="82" font-weight="700">${meta.label}</text>
      <text x="88" y="756" fill="rgba(242,246,248,0.78)" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="30">${meta.shortIntro}</text>
    </svg>
  `;
}

function renderIconSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="icon-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#071521"/>
          <stop offset="100%" stop-color="#1d4963"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="228" fill="url(#icon-bg)"/>
      <circle cx="760" cy="216" r="128" fill="rgba(239,139,94,0.18)"/>
      <path d="M164 734 C264 676 380 670 504 726 C626 782 756 790 880 746" fill="none" stroke="rgba(239,139,94,0.7)" stroke-width="28" stroke-linecap="round"/>
      <path d="M164 820 C268 764 384 758 508 810 C620 858 744 866 860 834" fill="none" stroke="rgba(239,139,94,0.36)" stroke-width="20" stroke-linecap="round"/>
      <path d="M514 224 L542 224 L542 634 L514 634 Z" fill="#eef4f7"/>
      <path d="M428 360 L628 360" stroke="#eef4f7" stroke-width="30" stroke-linecap="round"/>
      <path d="M530 230 L650 330 L530 330 Z" fill="rgba(239,139,94,0.92)"/>
      <text x="168" y="636" fill="#eef4f7" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="116" font-weight="700">海钓</text>
      <text x="172" y="716" fill="rgba(238,244,247,0.74)" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="46">TANGSHAN FISHING GUIDE</text>
    </svg>
  `;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function emptyDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await ensureDir(dirPath);
}

async function copyDir(sourceDir, targetDir) {
  await ensureDir(targetDir);
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

async function writePngFromSvg(svg, filePath, width, height) {
  await ensureDir(path.dirname(filePath));
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toFile(filePath);
}

function renderSpeciesTags(tags) {
  return tags.slice(0, 3).map((tag) => `<li class="tag">${escapeHtml(tag)}</li>`).join("");
}

function renderSupportPills(spot) {
  const pills = [
    newbieMeta[spot.newbieLevel]?.badge,
    verificationMeta[spot.verificationStatus]?.label
  ].filter(Boolean);

  return pills.map((pill) => `<span class="support-pill">${escapeHtml(pill)}</span>`).join("");
}

function formatPrecision(value) {
  return imagePrecisionMeta[value] || value;
}

function formatBreakdownValue(value) {
  return verificationBreakdownMeta[value] || value;
}

function formatReplaceTodo(value) {
  return imageReplaceTodoMeta[value] || value;
}

function renderChipGroup(group) {
  const chips = group.values.map((value) => {
    const label = group.key === "newbie"
      ? `新手${newbieMeta[value].label}`
      : value;

    return `
      <button
        type="button"
        class="chip"
        data-filter-chip
        data-group="${escapeHtml(group.key)}"
        data-value="${escapeHtml(slugText(value))}"
        aria-pressed="false"
        data-selected="false"
      >${escapeHtml(label)}</button>
    `;
  }).join("");

  return `
    <section class="chip-group" aria-label="${escapeHtml(group.label)}">
      <p class="chip-group__label">${escapeHtml(group.label)}</p>
      <div class="chip-row">${chips}</div>
    </section>
  `;
}

function renderRelatedCard(spot, label) {
  return `
    <a class="related-card" href="/spots/${escapeHtml(spot.id)}/" data-related-spot-id="${escapeHtml(spot.id)}" data-related-mode="${escapeHtml(spot.mode)}">
      <span class="related-card__eyebrow">${escapeHtml(label)}</span>
      <strong class="related-card__title">${escapeHtml(spot.name)}</strong>
      <span class="related-card__meta">${escapeHtml(spot.modeLabel)} · ${escapeHtml(spot.rankLabel)}</span>
    </a>
  `;
}

function pickRelatedCards(spot, spotMap) {
  const used = new Set([spot.id]);
  const slotConfigs = [
    {
      label: "同区域推荐",
      pool: [...spot.relatedGroups.sameRegion, ...spot.relatedGroups.sameMode, ...spot.relatedGroups.all]
    },
    {
      label: "同模式推荐",
      pool: [...spot.relatedGroups.sameMode, ...spot.relatedGroups.all]
    },
    {
      label: `同目标鱼：${spot.targetSpecies[0]}`,
      pool: [...spot.relatedGroups.sameTarget, ...spot.relatedGroups.all]
    }
  ];

  return slotConfigs
    .map((slot) => {
      const id = slot.pool.find((candidateId) => candidateId && !used.has(candidateId));
      if (!id) {
        return null;
      }
      used.add(id);
      return renderRelatedCard(spotMap.get(id), slot.label);
    })
    .filter(Boolean)
    .join("");
}

function relativePrefix(pathDepth) {
  if (pathDepth <= 0) {
    return ".";
  }

  return Array.from({ length: pathDepth }, () => "..").join("/");
}

function relativizeInternalUrl(url, pathDepth) {
  if (!url || !url.startsWith("/")) {
    return url;
  }

  const prefix = relativePrefix(pathDepth);

  if (url === "/") {
    return `${prefix}/index.html`;
  }

  const trimmed = url.slice(1);

  if (trimmed.endsWith("/")) {
    return `${prefix}/${trimmed}index.html`;
  }

  return `${prefix}/${trimmed}`;
}

function localizeInternalUrls(html, pathDepth) {
  return html.replace(/(href|src|data-share-url)="(\/[^"]*)"/g, (_match, attr, value) => {
    return `${attr}="${escapeHtml(relativizeInternalUrl(value, pathDepth))}"`;
  });
}

function pageTemplate({
  title,
  description,
  page,
  pageKey = "",
  modePageKey = "",
  content,
  scripts = [],
  pathDepth = 0
}) {
  const bodyAttrs = [
    `data-generated-at="${escapeHtml(buildDate)}"`,
    `data-page="${escapeHtml(page)}"`
  ];

  if (pageKey) {
    bodyAttrs.push(`data-page-key="${escapeHtml(pageKey)}"`);
  }

  if (modePageKey) {
    bodyAttrs.push(`data-mode-page-key="${escapeHtml(modePageKey)}"`);
  }

  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#071521" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="description" content="${escapeHtml(description)}" />
    <title>${escapeHtml(title)}</title>
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <link rel="stylesheet" href="/styles/site.css" />
  </head>
  <body ${bodyAttrs.join(" ")}>
    <div class="page-backdrop" aria-hidden="true"></div>
    ${content}
    <button type="button" class="back-to-top" hidden data-back-top>回到顶部</button>
    <script type="module" src="/scripts/app.js"></script>
    ${scripts.map((script) => `<script type="module" src="/scripts/${escapeHtml(script)}"></script>`).join("\n    ")}
  </body>
</html>`;

  return localizeInternalUrls(html, pathDepth);
}

function renderHomePage(data) {
  const shoreTop = data.spots.find((spot) => spot.mode === "shore" && spot.rank === 1);
  const boatTop = data.spots.find((spot) => spot.mode === "boat" && spot.rank === 1);

  return pageTemplate({
    title: "唐山海钓指南",
    description: "iPhone 竖屏优先的唐山海钓指南，围绕海岸钓与出海钓的核心点位推荐展开。",
    page: "home",
    pathDepth: 0,
    content: `
      <main class="app-shell home-shell">
        <section class="home-hero">
          <p class="eyebrow">按出行方式，直达强点</p>
          <h1 class="page-title home-title">唐山海钓指南</h1>
          <p class="page-subtitle">按鱼多、稳定、值得去排序，帮你更快决定今天去哪里下杆。</p>
          <div class="home-stat-row">
            <span class="stat-pill">17 个实测点位</span>
            <span class="stat-pill">海岸钓 / 出海钓</span>
            <span class="stat-pill">持续核验中</span>
          </div>
        </section>

        <section class="mode-grid" aria-label="模式选择">
          <a class="mode-card" href="/shore/">
            <img class="mode-card__media" src="${escapeHtml(modeMeta.shore.homeImage)}" alt="海岸钓模式背景图" />
            <div class="mode-card__body">
              <p class="mode-card__eyebrow">海岸钓首推</p>
              <p class="mode-card__spot">${escapeHtml(shoreTop.name)}</p>
              <h2 class="mode-card__title">海岸钓</h2>
              <p class="mode-card__lead">${escapeHtml(modeMeta.shore.homeCardLead)}</p>
              <div class="mode-card__meta">
                <span>核心鱼种：${escapeHtml(shoreTop.targetSpecies.slice(0, 2).join(" / "))}</span>
                <span>最佳窗口：${escapeHtml(shoreTop.bestWindowSummary)}</span>
              </div>
              <span class="button button--primary">进入海岸钓</span>
            </div>
          </a>

          <a class="mode-card" href="/boat/">
            <img class="mode-card__media" src="${escapeHtml(modeMeta.boat.homeImage)}" alt="出海钓模式背景图" />
            <div class="mode-card__body">
              <p class="mode-card__eyebrow">出海钓首推</p>
              <p class="mode-card__spot">${escapeHtml(boatTop.name)}</p>
              <h2 class="mode-card__title">出海钓</h2>
              <p class="mode-card__lead">${escapeHtml(modeMeta.boat.homeCardLead)}</p>
              <div class="mode-card__meta">
                <span>核心鱼种：${escapeHtml(boatTop.targetSpecies.slice(0, 2).join(" / "))}</span>
                <span>最佳窗口：${escapeHtml(boatTop.bestWindowSummary)}</span>
              </div>
              <span class="button button--primary">进入出海钓</span>
            </div>
          </a>
        </section>

        <section class="home-meta">
          <a class="meta-link" href="/about-ranking/">排名说明</a>
          <a class="meta-link" href="/compliance/">合规说明</a>
          <a class="meta-link" href="/updates/">最近更新</a>
          <button type="button" class="button button--ghost button--small" hidden data-install-trigger>安装到主屏幕</button>
        </section>

        <section class="home-footer-note">
          <p>最新整理时间：<span data-generated-at></span></p>
          <p>普通管控信息写在详情页风险区；只有生命危险型威胁会在列表前置提示。</p>
        </section>
      </main>
    `
  });
}

function renderListPage(mode, spots) {
  const meta = modeMeta[mode];
  const groups = filterGroups[mode];
  const cardList = spots.map((spot) => {
    const danger = spot.dangerFlags[0]
      ? `<span class="spot-danger-badge">生命危险：${escapeHtml(dangerMeta[spot.dangerFlags[0]].label)}</span>`
      : "";
    const searchText = [
      spot.name,
      spot.region,
      spot.launchOrAccessPoint,
      spot.coreZone,
      ...spot.targetSpecies,
      ...spot.spotTypes
    ].join(" | ");

    return `
      <article
        class="spot-card"
        data-spot-card
        data-spot-id="${escapeHtml(spot.id)}"
        data-search="${escapeHtml(searchText)}"
        data-filter-region="${escapeHtml(slugText(spot.region))}"
        data-filter-species="${escapeHtml(spot.targetSpecies.map((item) => slugText(item)).join("|"))}"
        data-filter-structure="${escapeHtml(spot.spotTypes.map((item) => slugText(item)).join("|"))}"
        data-filter-newbie="${escapeHtml(spot.newbieLevel)}"
      >
        <div class="spot-card__media">
          <img src="${escapeHtml(spot.listImage.src)}" alt="${escapeHtml(spot.listImage.alt)}" loading="lazy" />
          <div class="spot-card__badges">
            <span class="spot-rank-badge">${escapeHtml(spot.rankLabel)}</span>
            <span class="spot-mode-badge">${escapeHtml(spot.modeLabel)}</span>
          </div>
          ${danger}
        </div>
        <div class="spot-card__body">
          <h2 class="spot-card__title">${escapeHtml(spot.name)}</h2>
          <p class="spot-card__summary">${escapeHtml(spot.copySummary)}</p>
          <ul class="spot-species-tags">${renderSpeciesTags(spot.targetSpecies)}</ul>
          <div class="spot-card__support">${renderSupportPills(spot)}</div>
          <p class="spot-season-text">最佳窗口：${escapeHtml(spot.bestWindowSummary)}</p>
          <p class="spot-meta-line">${escapeHtml(spot.region)} · 导航“${escapeHtml(spot.launchOrAccessPoint)}”</p>
          <p class="spot-zone-text">${escapeHtml(spot.coreZone)}</p>
          <div class="spot-card__footer">
            <a class="button button--primary" data-detail-link href="/spots/${escapeHtml(spot.id)}/">查看详细</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  return pageTemplate({
    title: `${meta.pageTitle} · 唐山海钓指南`,
    description: `${meta.label}模式下的全部钓点，默认按推荐强度排序，提供搜索、筛选与风险前置提示。`,
    page: "list",
    pageKey: meta.pageKey,
    pathDepth: 1,
    content: `
      <main class="app-shell page-shell">
        <header class="page-topbar">
          <a class="icon-link" href="/">返回首页</a>
          <div class="page-topbar__titles">
            <p class="eyebrow">第二层级</p>
            <h1 class="page-title">${escapeHtml(meta.pageTitle)}</h1>
            <p class="page-subtitle">${escapeHtml(meta.helper)}</p>
          </div>
          <a class="text-link" href="/about-ranking/">排名说明</a>
        </header>

        <section class="list-toolbar">
          <label class="search-field">
            <span class="search-field__label">搜索钓点、区域、目标鱼</span>
            <input
              type="search"
              placeholder="搜索钓点、区域、目标鱼"
              autocomplete="off"
              data-search-input
            />
          </label>

          <div class="toolbar-meta">
            <p class="page-copy">${escapeHtml(meta.subtitle)}</p>
            <div class="toolbar-meta__row">
              <span class="count-pill" data-result-count>${spots.length} 个钓点</span>
              <div class="toolbar-actions">
                <button type="button" class="text-link text-link--button" data-reset-filters hidden>清空筛选</button>
                <a class="text-link" href="/compliance/">查看合规</a>
              </div>
            </div>
          </div>

          ${groups.map(renderChipGroup).join("")}
        </section>

        <section class="spot-list" data-list-shell>
          ${cardList}
        </section>

        <section class="empty-state" data-empty-state hidden>
          <h2 class="detail-section__title">没有匹配结果</h2>
          <p>先清空搜索词或筛选条件，再回到默认推荐顺序看更强的点位。</p>
        </section>
      </main>
    `,
    scripts: ["list.js"]
  });
}

function renderDetailPage(spot, spotMap) {
  const meta = modeMeta[spot.mode];
  const nextPool = [...spotMap.values()]
    .filter((candidate) => candidate.mode === spot.mode)
    .sort((a, b) => tierOrder(a.tier) - tierOrder(b.tier) || a.rank - b.rank);
  const currentIndex = nextPool.findIndex((candidate) => candidate.id === spot.id);
  const nextSpot = nextPool[(currentIndex + 1) % nextPool.length];
  const relatedBlocks = pickRelatedCards(spot, spotMap);
  const verificationLabel = verificationMeta[spot.verificationStatus].label;
  const verificationTone = verificationMeta[spot.verificationStatus].tone;
  const sourceDoc = spot.sourceDocumentTitle;
  const dangerLead = spot.dangerFlags[0]
    ? `<span class="spot-danger-badge">生命危险：${escapeHtml(dangerMeta[spot.dangerFlags[0]].label)}</span>`
    : "";
  const verificationRefItems = spot.verificationRefs
    .map((item) => `<li>${item.url ? `<a class="text-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</li>`)
    .join("");

  return pageTemplate({
    title: `${spot.name} · ${spot.modeLabel} · 唐山海钓指南`,
    description: `${spot.name}的单点详情页，包含基础信息、玩法、饵料、风险、相关推荐与来源说明。`,
    page: "detail",
    modePageKey: meta.pageKey,
    pathDepth: 2,
    content: `
      <main class="app-shell detail-shell">
        <header class="page-topbar page-topbar--detail">
          <a class="icon-link" href="/${escapeHtml(meta.slug)}/">${escapeHtml(meta.detailBackLabel)}</a>
          <div class="page-topbar__actions">
            <button type="button" class="icon-button" data-favorite-id="${escapeHtml(spot.id)}">
              <span data-favorite-label>收藏</span>
            </button>
            <button type="button" class="icon-button" data-share-url="/spots/${escapeHtml(spot.id)}/" data-share-title="${escapeHtml(spot.name)}">
              <span data-share-label>分享</span>
            </button>
          </div>
        </header>

        <section class="detail-hero">
          <img src="${escapeHtml(spot.heroImage.src)}" alt="${escapeHtml(spot.heroImage.alt)}" />
          <div class="detail-hero__overlay">
            <span class="spot-rank-badge">${escapeHtml(spot.rankLabel)}</span>
            <span class="spot-mode-badge">${escapeHtml(spot.modeLabel)}</span>
            ${dangerLead}
          </div>
          <div class="detail-hero__caption">当前主图：${escapeHtml(spot.heroImage.label)} · ${escapeHtml(spot.heroImage.readinessLabel)}</div>
        </section>

        <section class="detail-title-block">
          <p class="eyebrow">${escapeHtml(spot.tierLabel)}</p>
          <h1 class="page-title">${escapeHtml(spot.name)}</h1>
          <p class="page-subtitle">${escapeHtml(spot.copySummary)}</p>
          <div class="detail-title-meta">
            <span class="detail-title-meta__item">${escapeHtml(spot.region)}</span>
            <span class="detail-title-meta__item">导航“${escapeHtml(spot.launchOrAccessPoint)}”</span>
            <span class="detail-title-meta__item">最佳窗口：${escapeHtml(spot.bestWindowSummary)}</span>
          </div>
          <div class="detail-status-row">
            <span class="status-pill status-pill--${escapeHtml(verificationTone)}">${escapeHtml(verificationLabel)}</span>
            <span class="status-pill">${escapeHtml(spot.heroImage.label)}</span>
            <span class="status-pill">${escapeHtml(imageReadinessMeta[spot.heroImage.readiness].label)}</span>
            ${spot.assetPriority === "high" ? '<span class="status-pill status-pill--accent">高优先级补图</span>' : ""}
          </div>
        </section>

        <section class="detail-summary-card">
          <article class="summary-item">
            <span class="summary-item__label">区域与导航</span>
            <strong>${escapeHtml(spot.region)}</strong>
            <span>${escapeHtml(spot.launchOrAccessPoint)}</span>
          </article>
          <article class="summary-item">
            <span class="summary-item__label">主打鱼种</span>
            <strong>${escapeHtml(spot.targetSpecies.join(" / "))}</strong>
            <span>${escapeHtml(spot.commonSpecies.slice(0, 2).join(" / ") || "补充鱼种待补")}</span>
          </article>
          <article class="summary-item">
            <span class="summary-item__label">核心汛期</span>
            <strong>${escapeHtml(spot.bestWindowSummary)}</strong>
            <span>${escapeHtml(meta.tideNote)}</span>
          </article>
          <article class="summary-item">
            <span class="summary-item__label">新手友好度</span>
            <strong>${escapeHtml(newbieMeta[spot.newbieLevel].badge)}</strong>
            <span>${escapeHtml(newbieMeta[spot.newbieLevel].copy)}</span>
          </article>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">核心钓段</h2>
          <p class="detail-section__body">${escapeHtml(spot.coreZone)}</p>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">核心汛期与黄金窗口</h2>
          <ul class="detail-list">
            ${spot.detailWindows.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">推荐钓法与线组</h2>
          <ul class="detail-list">
            ${spot.detailTackle.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">推荐饵料</h2>
          <ul class="detail-tag-list">
            ${spot.baitSummary.map((item) => `<li class="tag">${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">适合谁去</h2>
          <ul class="detail-list">
            ${spot.detailWhoShouldGo.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">风险与注意事项</h2>
          <div class="risk-columns">
            <article class="risk-card">
              <h3>人身安全</h3>
              <ul class="detail-list">
                ${spot.riskNotes.safety.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>
            <article class="risk-card">
              <h3>进入与规则</h3>
              <ul class="detail-list">
                ${spot.riskNotes.access.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">相关推荐</h2>
          <div class="related-grid">
            ${relatedBlocks}
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">信息来源与更新时间</h2>
          <div class="source-card">
            <p><strong>来源文档：</strong>${escapeHtml(sourceDoc)}</p>
            <p><strong>列表图：</strong>${escapeHtml(spot.listImage.label)} · ${escapeHtml(spot.listImage.readinessLabel)}</p>
            <p><strong>详情图：</strong>${escapeHtml(spot.heroImage.label)} · ${escapeHtml(spot.heroImage.readinessLabel)}</p>
            <p><strong>最近整理：</strong><span data-generated-at></span></p>
            <p><strong>核验状态：</strong>${escapeHtml(verificationLabel)}</p>
            <p><strong>复核周期：</strong>${escapeHtml(String(spot.verificationWindowDays))} 天</p>
          </div>
        </section>

        <section class="detail-section detail-section--verify">
          <button type="button" class="button button--ghost button--small" data-toggle-verify aria-expanded="false">查看核验与图片说明</button>
          <div class="verify-panel" data-verify-panel hidden>
            <p>${escapeHtml(spot.verificationNotes)}</p>
            <p>最近核验时间：${escapeHtml(spot.lastVerifiedAt)}</p>
            <p>图片替换优先级：${escapeHtml(String(spot.replacementPriority).toUpperCase())} · 当前动作：${escapeHtml(formatReplaceTodo(spot.imageReplaceTodo))}</p>
            <p>列表图精度：${escapeHtml(formatPrecision(spot.imagePrecision.list))}</p>
            <p>详情图精度：${escapeHtml(formatPrecision(spot.imagePrecision.hero))}</p>
            <p>列表图说明：${escapeHtml(spot.listImage.purpose)}</p>
            <p>详情图说明：${escapeHtml(spot.heroImage.purpose)}</p>
            <p>列表图来源：${spot.listImage.sourceTitle ? `${escapeHtml(spot.listImage.sourceTitle)} · ` : ""}${escapeHtml(spot.listImage.source)}${spot.listImage.sourceUrl ? ` · <a class="text-link" href="${escapeHtml(spot.listImage.sourceUrl)}" target="_blank" rel="noreferrer noopener">查看出处</a>` : ""}</p>
            <p>详情图来源：${spot.heroImage.sourceTitle ? `${escapeHtml(spot.heroImage.sourceTitle)} · ` : ""}${escapeHtml(spot.heroImage.source)}${spot.heroImage.sourceUrl ? ` · <a class="text-link" href="${escapeHtml(spot.heroImage.sourceUrl)}" target="_blank" rel="noreferrer noopener">查看出处</a>` : ""}</p>
            <p><strong>核验拆解：</strong></p>
            <ul class="detail-list detail-list--compact">
              <li>点位身份：${escapeHtml(formatBreakdownValue(spot.verificationBreakdown.identity))}</li>
              <li>点位名称：${escapeHtml(formatBreakdownValue(spot.verificationBreakdown.spot_name))}</li>
              <li>进入与管控：${escapeHtml(formatBreakdownValue(spot.verificationBreakdown.access_control))}</li>
              <li>前置危险提示：${escapeHtml(formatBreakdownValue(spot.verificationBreakdown.danger_front_badge))}</li>
            </ul>
            ${verificationRefItems ? `<p><strong>核验参考：</strong></p><ul class="detail-list detail-list--compact">${verificationRefItems}</ul>` : ""}
          </div>
        </section>
      </main>

      <nav class="detail-bottom-actions">
        <a class="button button--ghost" href="/${escapeHtml(meta.slug)}/">${escapeHtml(meta.detailBackLabel)}</a>
        <a class="button button--primary" data-next-link href="/spots/${escapeHtml(nextSpot.id)}/">查看下一个推荐点</a>
      </nav>
    `,
    scripts: ["detail.js"]
  });
}

function renderAboutRanking() {
  return pageTemplate({
    title: "排名说明 · 唐山海钓指南",
    description: "说明站内的推荐强度、生命危险提示规则与核验状态表达方式。",
    page: "info",
    pathDepth: 1,
    content: `
      <main class="app-shell info-shell">
        <header class="page-topbar">
          <a class="icon-link" href="/">返回首页</a>
          <div class="page-topbar__titles">
            <p class="eyebrow">辅助页面</p>
            <h1 class="page-title">排名说明</h1>
            <p class="page-subtitle">先告诉你哪里最值得去，再补玩法、风险和来源。</p>
          </div>
        </header>

        <section class="detail-section">
          <h2 class="detail-section__title">推荐强度怎么排</h2>
          <ul class="detail-list">
            <li>默认先按梯队排序，再按每个模式内的推荐位次排序。</li>
            <li>第一梯队优先展示“鱼更多、稳定性更强、窗口更明确”的点位。</li>
            <li>筛选和搜索后，仍尽量保持原始推荐逻辑，不把强点打散成普通信息流。</li>
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">为什么只有少数点位会前置危险提示</h2>
          <ul class="detail-list">
            <li>第二层级只前置生命危险型威胁，例如深水无护栏、消波块极滑、涨潮易被困。</li>
            <li>普通管控、作业区边界、停车限制、补给不足，只写进第三层级风险区。</li>
            <li>这样可以在保留推荐逻辑的同时，不掩盖真实的人身安全风险。</li>
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">核验状态怎么读</h2>
          <div class="detail-tag-list">
            <span class="tag">已核验：点位大区域和关键属性有较强支撑</span>
            <span class="tag">部分核验：大区域成立，细节仍按本地常用叫法保留</span>
            <span class="tag">待复核：点位名称或边界仍在持续补强</span>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">图片状态怎么读</h2>
          <ul class="detail-list">
            <li>已接入站内图片：站内已经有可直接展示的公开图片资源。</li>
            <li>已挂接公开来源：当前有明确公开来源，后续可替换为更贴近现场的真图。</li>
            <li>仍在占位阶段：当前先用结构示意图承接信息，后续继续补图。</li>
          </ul>
        </section>
      </main>
    `
  });
}

function renderCompliancePage(kb) {
  return pageTemplate({
    title: "合规说明 · 唐山海钓指南",
    description: "站内展示的合规、安全与潮汐提示，正式出发前仍需结合最新动态信息复核。",
    page: "info",
    pathDepth: 1,
    content: `
      <main class="app-shell info-shell">
        <header class="page-topbar">
          <a class="icon-link" href="/">返回首页</a>
          <div class="page-topbar__titles">
            <p class="eyebrow">辅助页面</p>
            <h1 class="page-title">合规说明</h1>
            <p class="page-subtitle">动态限制会变化，站内信息用于指导决策，不代替出发前复核。</p>
          </div>
        </header>

        <section class="detail-section">
          <h2 class="detail-section__title">出海钓通用提醒</h2>
          <ul class="detail-list">
            ${kb.globalGuides.boat.compliance.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            ${kb.globalGuides.boat.safety.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">海岸钓通用提醒</h2>
          <ul class="detail-list">
            ${kb.globalGuides.shore.compliance.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            ${kb.globalGuides.shore.safety.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">潮汐判断</h2>
          <ul class="detail-list">
            ${kb.globalGuides.shore.tideRules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
      </main>
    `
  });
}

function renderUpdatesPage(data) {
  return pageTemplate({
    title: "最近更新 · 唐山海钓指南",
    description: "第一版已交付的页面范围、图片策略与后续补强方向说明。",
    page: "info",
    pathDepth: 1,
    content: `
      <main class="app-shell info-shell">
        <header class="page-topbar">
          <a class="icon-link" href="/">返回首页</a>
          <div class="page-topbar__titles">
            <p class="eyebrow">辅助页面</p>
            <h1 class="page-title">最近更新</h1>
            <p class="page-subtitle">第一版已完成三层结构、17 个点位详情和 PWA 首版交付。</p>
          </div>
        </header>

        <section class="detail-section">
          <h2 class="detail-section__title">第一版已交付内容</h2>
          <ul class="detail-list">
            <li>共生成 ${data.spots.length} 个钓点详情页。</li>
            <li>首页只保留海岸钓与出海钓两个主入口。</li>
            <li>第二层级完成搜索、筛选、状态恢复与危险提示规则。</li>
            <li>第三层级承接玩法、饵料、风险、相关推荐、来源与核验说明。</li>
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">当前图片与核验状态</h2>
          <ul class="detail-list">
            <li>当前已同时使用官方公开图、公开环境图、地图标注图和结构占位图，保证每个点位都有稳定视觉入口。</li>
            <li>高优先级点位已持续补强来源、核验状态和图片替换优先级。</li>
            <li>补图工作默认优先维护 <code>spot-enrichment.json</code> 与 <code>site/public/images/spots/real/</code>，尽量不再直接改页面模板。</li>
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">第一版后继续推进</h2>
          <ul class="detail-list">
            <li>继续替换 P0 点位的真实公开图片。</li>
            <li>继续提升高优先级点位的核验等级。</li>
            <li>环境允许后补跑浏览器侧 E2E 回归。</li>
          </ul>
        </section>

        <section class="detail-section">
          <h2 class="detail-section__title">整理时间</h2>
          <p class="detail-section__body"><span data-generated-at></span></p>
        </section>
      </main>
    `
  });
}

async function collectFiles(dirPath, rootPath = dirPath) {
  const results = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(fullPath, rootPath)));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

async function writeServiceWorker(routeUrls) {
  const assetUrls = (await collectFiles(distDir))
    .map((filePath) => `/${path.relative(distDir, filePath).replaceAll(path.sep, "/")}`)
    .filter((url) => !url.endsWith("/sw.js"));
  const cacheUrls = unique([
    ...routeUrls,
    ...assetUrls
  ]);

  const serviceWorker = `const CACHE_NAME = "tangshan-fishing-guide-${buildDate}";
const PRECACHE_URLS = ${JSON.stringify(cacheUrls, null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const request = event.request;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          return caches.match(request) || caches.match("/") || Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});`;

  await writeText(path.join(distDir, "sw.js"), serviceWorker);
}

async function main() {
  const kb = JSON.parse(await fs.readFile(sourceDataPath, "utf8"));
  const enrichmentOverrides = await loadEnrichmentOverrides();
  const enrichedSpots = await Promise.all(
    kb.spots
      .slice()
      .sort((a, b) => tierOrder(a.tier) - tierOrder(b.tier) || a.rank - b.rank)
      .map((spot) => buildEnrichedSpot(spot, kb, enrichmentOverrides))
  );
  const spotMap = new Map(enrichedSpots.map((spot) => [spot.id, spot]));
  const siteData = {
    project: "唐山海钓指南",
    version: "site-v1",
    generatedAt: buildDate,
    sourceGeneratedAt: kb.generatedAt,
    spots: enrichedSpots,
    rankings: kb.rankings,
    globalGuides: kb.globalGuides,
    modes: {
      shore: modeMeta.shore,
      boat: modeMeta.boat
    }
  };

  await ensureDir(publicSpotDir);
  await ensureDir(publicRealSpotDir);
  await ensureDir(publicIconDir);

  for (const mode of ["shore", "boat"]) {
    const svg = renderModeSvg(mode);
    await writeText(path.join(publicSpotDir, `mode-${mode}-home.svg`), svg);
    await writePngFromSvg(svg, path.join(publicSpotDir, `mode-${mode}-home.png`), 1200, 900);
  }

  for (const spot of enrichedSpots) {
    const listSvg = renderSpotSvg(spot, "list");
    const heroSvg = renderSpotSvg(spot, "hero");
    await writeText(path.join(publicSpotDir, `${spot.id}-list.svg`), listSvg);
    await writeText(path.join(publicSpotDir, `${spot.id}-hero.svg`), heroSvg);
    await writePngFromSvg(listSvg, path.join(publicSpotDir, `${spot.id}-list.png`), 1200, 900);
    await writePngFromSvg(heroSvg, path.join(publicSpotDir, `${spot.id}-hero.png`), 1400, 1000);
  }

  const iconSvg = renderIconSvg();
  await writeText(path.join(publicIconDir, "favicon.svg"), iconSvg);
  await writeText(path.join(publicIconDir, "icon.svg"), iconSvg);
  await writePngFromSvg(iconSvg, path.join(publicIconDir, "icon-192.png"), 192, 192);
  await writePngFromSvg(iconSvg, path.join(publicIconDir, "icon-512.png"), 512, 512);
  await writePngFromSvg(iconSvg, path.join(publicIconDir, "apple-touch-icon.png"), 180, 180);

  await writeText(
    path.join(publicDir, "manifest.webmanifest"),
    JSON.stringify({
      name: "唐山海钓指南",
      short_name: "唐山海钓",
      description: "围绕海岸钓与出海钓核心点位的 App 型海钓指南。",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#071521",
      theme_color: "#071521",
      icons: [
        {
          src: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    }, null, 2)
  );

  await writeText(generatedDataPath, JSON.stringify(siteData, null, 2));
  await writeText(generatedEnrichmentPath, JSON.stringify(enrichmentOverrides, null, 2));

  await emptyDir(distDir);
  await copyDir(publicDir, distDir);
  await ensureDir(distScriptDir);
  await ensureDir(distStyleDir);
  await ensureDir(distDataDir);

  await fs.copyFile(path.join(scriptDir, "app.js"), path.join(distScriptDir, "app.js"));
  await fs.copyFile(path.join(scriptDir, "list.js"), path.join(distScriptDir, "list.js"));
  await fs.copyFile(path.join(scriptDir, "detail.js"), path.join(distScriptDir, "detail.js"));
  await fs.copyFile(stylesPath, path.join(distStyleDir, "site.css"));
  await writeText(path.join(distDataDir, "site-data.json"), JSON.stringify(siteData, null, 2));
  await writeText(path.join(distDataDir, "spot-enrichment.json"), JSON.stringify(enrichmentOverrides, null, 2));

  const routeUrls = ["/", "/shore/", "/boat/", "/about-ranking/", "/compliance/", "/updates/"];

  await writeText(path.join(distDir, "index.html"), renderHomePage(siteData));
  await writeText(path.join(distDir, "shore", "index.html"), renderListPage("shore", enrichedSpots.filter((spot) => spot.mode === "shore")));
  await writeText(path.join(distDir, "boat", "index.html"), renderListPage("boat", enrichedSpots.filter((spot) => spot.mode === "boat")));
  await writeText(path.join(distDir, "about-ranking", "index.html"), renderAboutRanking());
  await writeText(path.join(distDir, "compliance", "index.html"), renderCompliancePage(kb));
  await writeText(path.join(distDir, "updates", "index.html"), renderUpdatesPage(siteData));

  for (const spot of enrichedSpots) {
    routeUrls.push(`/spots/${spot.id}/`);
    await writeText(
      path.join(distDir, "spots", spot.id, "index.html"),
      renderDetailPage(spot, spotMap)
    );
  }

  await writeServiceWorker(routeUrls);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const distDir = path.join(siteRoot, "dist");

async function read(relativePath) {
  return fs.readFile(path.join(distDir, relativePath), "utf8");
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(distDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

function extractDangerTexts(html) {
  return [...html.matchAll(/class="spot-danger-badge">([^<]+)</g)].map((match) => match[1]);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSpotCardHtml(html, spotId) {
  const regex = new RegExp(
    `<article[^>]*class="spot-card"[^>]*data-spot-id="${escapeRegExp(spotId)}"[\\s\\S]*?<\\/article>`,
    "i"
  );

  return html.match(regex)?.[0] || "";
}

function extractRelatedLinks(html) {
  return [...html.matchAll(/class="related-card" href="([^"]+)"/g)].map((match) => match[1]);
}

function extractRelatedTargetIds(html) {
  return [...html.matchAll(/data-related-spot-id="([^"]+)"/g)].map((match) => match[1]);
}

function extractImageTags(html) {
  return [...html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g)].map((match) => ({
    src: match[1],
    alt: match[2]
  }));
}

function extractAbsoluteInternalAttrs(html) {
  return [...html.matchAll(/\b(?:href|src|data-share-url)="(\/[^"]*)"/g)].map((match) => match[1]);
}

function assertOrder(html, orderedNames, messagePrefix) {
  const indices = orderedNames.map((name) => html.indexOf(name));
  indices.forEach((index, i) => {
    assert.ok(index >= 0, `${messagePrefix} 缺少排序项: ${orderedNames[i]}`);
  });
  for (let i = 1; i < indices.length; i += 1) {
    assert.ok(indices[i - 1] < indices[i], `${messagePrefix} 顺序错误: ${orderedNames.join(" -> ")}`);
  }
}

function assertNotContainsDangerMisclassification(html) {
  const texts = extractDangerTexts(html);
  for (const text of texts) {
    assert.ok(!/管控|停车|作业|补给|封闭|权限/.test(text), `危险标签误分类: ${text}`);
  }
}

async function main() {
  const siteData = JSON.parse(await read("data/site-data.json"));
  const enrichmentData = JSON.parse(await read("data/spot-enrichment.json"));
  const homeHtml = await read("index.html");
  const shoreHtml = await read("shore/index.html");
  const boatHtml = await read("boat/index.html");
  const sampleDetail = await read("spots/shore-cfd-18plus-west-breakwater/index.html");
  const swText = await read("sw.js");

  assert.ok(homeHtml.includes("唐山海钓指南"), "首页缺少主标题");
  assert.ok(!homeHtml.includes("<base href="), "首页仍残留动态 base 注入");
  assert.equal((homeHtml.match(/进入海岸钓/g) || []).length, 1, "首页海岸钓入口数量不正确");
  assert.equal((homeHtml.match(/进入出海钓/g) || []).length, 1, "首页出海钓入口数量不正确");
  assert.equal((homeHtml.match(/class="mode-card"/g) || []).length, 2, "首页模式卡片数量不正确");

  assert.ok(shoreHtml.includes("海岸钓"), "海岸钓列表页缺少标题");
  assert.ok(!shoreHtml.includes("<base href="), "海岸钓列表页仍残留动态 base 注入");
  assert.ok(!shoreHtml.includes("进入海岸钓"), "海岸钓列表页仍然出现首页入口");
  assert.ok(!shoreHtml.includes("进入出海钓"), "海岸钓列表页仍然出现首页入口");
  assert.ok(shoreHtml.includes("清空筛选"), "海岸钓列表页缺少清空筛选操作");
  assert.ok(boatHtml.includes("出海钓"), "出海钓列表页缺少标题");
  assert.ok(!boatHtml.includes("<base href="), "出海钓列表页仍残留动态 base 注入");
  assert.ok(!boatHtml.includes("进入海岸钓"), "出海钓列表页仍然出现首页入口");
  assert.ok(!boatHtml.includes("进入出海钓"), "出海钓列表页仍然出现首页入口");
  assert.ok(boatHtml.includes("清空筛选"), "出海钓列表页缺少清空筛选操作");

  assert.ok(sampleDetail.includes("风险与注意事项"), "详情页缺少风险区");
  assert.ok(!sampleDetail.includes("<base href="), "详情页仍残留动态 base 注入");
  assert.ok(sampleDetail.includes("信息来源与更新时间"), "详情页缺少来源与更新时间");
  assert.ok(sampleDetail.includes("查看核验与图片说明"), "详情页缺少核验与图片说明入口");
  assert.ok(sampleDetail.includes("当前主图："), "详情页缺少当前主图说明");
  assert.ok(!sampleDetail.includes("data-list-shell"), "详情页错误残留列表壳子");
  assert.ok(!sampleDetail.includes("data-filter-chip"), "详情页错误残留筛选条");
  assert.ok(!swText.includes("/../../"), "Service worker 仍包含脏预缓存路径");
  assert.ok(!swText.includes("PRECACHE_URLS"), "Service worker 仍在做整站预缓存");
  assert.ok(!swText.includes("CACHE_NAME"), "Service worker 仍在使用旧缓存壳");
  assert.ok(swText.includes("self.registration.unregister()"), "Service worker 未实现自注销清理");
  assert.equal(extractAbsoluteInternalAttrs(homeHtml).length, 0, "首页仍包含根路径资源，无法直接本地浏览");
  assert.equal(extractAbsoluteInternalAttrs(shoreHtml).length, 0, "海岸钓列表仍包含根路径资源，无法直接本地浏览");
  assert.equal(extractAbsoluteInternalAttrs(boatHtml).length, 0, "出海钓列表仍包含根路径资源，无法直接本地浏览");
  assert.equal(extractAbsoluteInternalAttrs(sampleDetail).length, 0, "详情页仍包含根路径资源，无法直接本地浏览");

  const shoreNames = siteData.spots.filter((spot) => spot.mode === "shore").map((spot) => spot.name);
  const boatNames = siteData.spots.filter((spot) => spot.mode === "boat").map((spot) => spot.name);
  const shoreDangerCount = siteData.spots.filter((spot) => spot.mode === "shore" && spot.dangerFlags.length > 0).length;
  const boatDangerCount = siteData.spots.filter((spot) => spot.mode === "boat" && spot.dangerFlags.length > 0).length;

  assert.ok(Object.keys(enrichmentData).length >= siteData.spots.length, "补强数据导出数量异常");

  for (const name of shoreNames) {
    assert.ok(shoreHtml.includes(name), `海岸钓列表页缺少点位: ${name}`);
    assert.ok(!boatHtml.includes(name), `出海钓列表页错误混入岸钓点位: ${name}`);
  }

  for (const name of boatNames) {
    assert.ok(boatHtml.includes(name), `出海钓列表页缺少点位: ${name}`);
    assert.ok(!shoreHtml.includes(name), `海岸钓列表页错误混入出海钓点位: ${name}`);
  }

  assertNotContainsDangerMisclassification(shoreHtml);
  assertNotContainsDangerMisclassification(boatHtml);
  assert.equal(extractDangerTexts(shoreHtml).length, shoreDangerCount, "海岸钓列表危险提示数量不正确");
  assert.equal(extractDangerTexts(boatHtml).length, boatDangerCount, "出海钓列表危险提示数量不正确");
  assertOrder(shoreHtml, shoreNames, "海岸钓列表");
  assertOrder(boatHtml, boatNames, "出海钓列表");
  assert.ok(!shoreHtml.includes("undefined"), "海岸钓列表页出现 undefined");
  assert.ok(!boatHtml.includes("undefined"), "出海钓列表页出现 undefined");

  for (const spot of siteData.spots) {
    assert.ok(spot.assetPriority, `点位缺少图片优先级: ${spot.id}`);
    assert.ok(spot.imageReadiness?.list, `点位缺少列表图状态: ${spot.id}`);
    assert.ok(spot.imageReadiness?.hero, `点位缺少详情图状态: ${spot.id}`);
    assert.ok(spot.listImage?.label, `点位缺少列表图标签: ${spot.id}`);
    assert.ok(spot.heroImage?.label, `点位缺少详情图标签: ${spot.id}`);
    assert.ok(spot.replacementPriority, `点位缺少图片替换优先级: ${spot.id}`);
    assert.ok(spot.imageReplaceTodo, `点位缺少图片替换动作: ${spot.id}`);
    assert.ok(spot.verificationWindowDays, `点位缺少复核周期: ${spot.id}`);
    assert.ok(spot.verificationBreakdown?.identity, `点位缺少核验拆解: ${spot.id}`);

    const detailPath = `spots/${spot.id}/index.html`;
    assert.ok(await exists(detailPath), `缺少详情页: ${detailPath}`);
    const detailHtml = await read(detailPath);
    const listHtml = spot.mode === "shore" ? shoreHtml : boatHtml;
    const cardHtml = extractSpotCardHtml(listHtml, spot.id);
    const cardImages = extractImageTags(cardHtml);
    assert.ok(cardHtml, `列表页缺少点位卡片: ${spot.id}`);
    assert.equal(cardImages.length, 1, `列表卡图片数量异常: ${spot.id}`);
    assert.ok(cardImages[0].src, `列表卡图片 src 为空: ${spot.id}`);
    assert.ok(cardImages[0].alt, `列表卡图片 alt 为空: ${spot.id}`);

    assert.ok(detailHtml.includes(`data-page="detail"`), `详情页未标记 detail 页面: ${spot.id}`);
    assert.ok(detailHtml.includes("风险与注意事项"), `详情页缺少风险区: ${spot.id}`);
    assert.ok(detailHtml.includes("信息来源与更新时间"), `详情页缺少来源区: ${spot.id}`);
    assert.ok(detailHtml.includes("查看下一个推荐点"), `详情页缺少下一推荐按钮: ${spot.id}`);
    assert.ok(detailHtml.includes("查看核验与图片说明"), `详情页缺少核验与图片说明入口: ${spot.id}`);
    assert.ok(detailHtml.includes("当前主图："), `详情页缺少主图状态说明: ${spot.id}`);
    assert.ok(detailHtml.includes("复核周期"), `详情页缺少复核周期: ${spot.id}`);
    assert.ok(detailHtml.includes("核验拆解"), `详情页缺少核验拆解: ${spot.id}`);
    assert.ok(!detailHtml.includes("进入海岸钓"), `详情页错误出现首页入口: ${spot.id}`);
    assert.ok(!detailHtml.includes("进入出海钓"), `详情页错误出现首页入口: ${spot.id}`);
    assert.ok(!detailHtml.includes("返回首页"), `详情页错误出现首页返回: ${spot.id}`);
    assert.ok(!detailHtml.includes("data-list-shell"), `详情页错误残留列表壳子: ${spot.id}`);
    assert.ok(!detailHtml.includes("data-filter-chip"), `详情页错误残留筛选条: ${spot.id}`);
    assert.ok(
      detailHtml.includes(`/images/spots/${spot.id}-hero.png`) ||
      detailHtml.includes(`/images/spots/real/${spot.id}-hero`) ||
      /^https?:\/\//.test(String(spot.heroImage?.src || "")),
      `详情页缺少主图: ${spot.id}`
    );
    assert.ok(spot.heroImage?.alt, `详情页主图 alt 为空: ${spot.id}`);
    if (spot.dangerFlags.length > 0) {
      assert.ok(cardHtml.includes("spot-danger-badge"), `危险点位未在列表前置提示: ${spot.id}`);
      assert.ok(detailHtml.includes("生命危险："), `危险点位详情页缺少危险提示: ${spot.id}`);
    } else {
      assert.ok(!cardHtml.includes("spot-danger-badge"), `非危险点位错误出现列表危险提示: ${spot.id}`);
      assert.ok(!detailHtml.includes("生命危险："), `非危险点位错误出现详情危险提示: ${spot.id}`);
    }
    if (spot.listImage?.readiness === "remote_asset") {
      assert.ok(/^https:\/\//.test(String(spot.listImage?.src || "")), `列表远程图片 src 不正确: ${spot.id}`);
    }
    if (spot.heroImage?.readiness === "remote_asset") {
      assert.ok(/^https:\/\//.test(String(spot.heroImage?.src || "")), `详情远程图片 src 不正确: ${spot.id}`);
      assert.ok(detailHtml.includes(spot.heroImage.readinessLabel), `详情远程图片状态未展示: ${spot.id}`);
    }
    assert.ok(!detailHtml.includes("undefined"), `详情页出现 undefined: ${spot.id}`);
    assert.ok(!detailHtml.includes("source-boat-2026-user"), `详情页仍显示内部来源 ID: ${spot.id}`);
    assert.ok(!detailHtml.includes("source-shore-2026-user"), `详情页仍显示内部来源 ID: ${spot.id}`);

    const relatedLinks = extractRelatedLinks(detailHtml);
    const relatedIds = extractRelatedTargetIds(detailHtml);
    assert.equal(relatedLinks.length, new Set(relatedLinks).size, `相关推荐重复: ${spot.id}`);
    assert.ok(relatedLinks.length <= 3, `相关推荐数量超出限制: ${spot.id}`);
    for (const relatedId of relatedIds) {
      assert.notEqual(relatedId, spot.id, `相关推荐错误指向自己: ${spot.id}`);
      const relatedSpot = siteData.spots.find((item) => item.id === relatedId);
      assert.ok(relatedSpot, `相关推荐缺少目标点位: ${spot.id} -> ${relatedId}`);
      assert.equal(relatedSpot.mode, spot.mode, `相关推荐跨模式串线: ${spot.id} -> ${relatedId}`);
    }
  }

  const shoreCardCount = (shoreHtml.match(/class="spot-card"/g) || []).length;
  const boatCardCount = (boatHtml.match(/class="spot-card"/g) || []).length;
  assert.equal(shoreCardCount, siteData.spots.filter((spot) => spot.mode === "shore").length, "海岸钓列表卡片数量不匹配");
  assert.equal(boatCardCount, siteData.spots.filter((spot) => spot.mode === "boat").length, "出海钓列表卡片数量不匹配");

  console.log("Static smoke checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

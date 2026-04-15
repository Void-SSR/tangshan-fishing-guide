import playwrightTest from "../../../node_modules/@playwright/test/index.js";

const { expect, test } = playwrightTest;

test("home only shows the two primary mode entries", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "唐山海钓指南" })).toBeVisible();
  await expect(page.getByRole("link", { name: /进入海岸钓/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /进入出海钓/ })).toBeVisible();
});

test("shore list hides home entry cards and links to a standalone detail page", async ({ page }) => {
  await page.goto("/shore/");

  await expect(page.getByRole("heading", { name: "海岸钓" })).toBeVisible();
  await expect(page.getByRole("link", { name: "进入海岸钓" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "进入出海钓" })).toHaveCount(0);

  const detailLink = page.getByRole("link", { name: /查看详细/ }).first();
  await detailLink.click();

  await expect(page).toHaveURL(/\/spots\/.+\/$/);
  await expect(page.locator("[data-page='detail']")).toBeVisible();
  await expect(page.locator("[data-list-shell]")).toHaveCount(0);
});

test("detail page keeps risk section and omits list filters", async ({ page }) => {
  await page.goto("/spots/shore-cfd-18plus-west-breakwater/");

  await expect(page.getByRole("heading", { name: "曹妃甸18+西防波堤" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "风险与注意事项" })).toBeVisible();
  await expect(page.getByText(/当前主图：/)).toBeVisible();
  await expect(page.getByRole("button", { name: /查看核验与图片说明/ })).toBeVisible();
  await expect(page.locator("[data-filter-chip]")).toHaveCount(0);
});

test("detail verify panel expands and shows image/source state", async ({ page }) => {
  await page.goto("/spots/shore-cfd-xincheng-left-bank/");

  await expect(page.getByText(/当前主图：/)).toBeVisible();
  const verifyButton = page.getByRole("button", { name: /查看核验与图片说明/ });
  await verifyButton.click();

  await expect(page.getByText(/最近核验时间：/)).toBeVisible();
  await expect(page.getByText(/详情图来源：/)).toBeVisible();
  await expect(page.getByText(/查看出处/)).toBeVisible();
});

test("list page can clear filters and search together", async ({ page }) => {
  await page.goto("/shore/");

  const search = page.getByPlaceholder("搜索钓点、区域、目标鱼");
  await search.fill("曹妃甸");
  await page.getByRole("button", { name: "京唐港" }).click();

  const reset = page.getByRole("button", { name: "清空筛选" });
  await expect(reset).toBeVisible();
  await reset.click();

  await expect(search).toHaveValue("");
  await expect(reset).toBeHidden();
});

test("detail back navigation restores shore list state", async ({ page }) => {
  await page.goto("/shore/");

  const search = page.getByPlaceholder("搜索钓点、区域、目标鱼");
  await search.fill("曹妃甸");
  const newbieChip = page.getByRole("button", { name: "新手高" });
  await newbieChip.click();

  const firstDetailLink = page.locator("[data-detail-link]").first();
  await firstDetailLink.click();

  await expect(page).toHaveURL(/\/spots\/.+\/$/);
  await page.goBack();

  await expect(page).toHaveURL(/\/shore\/$/);
  await expect(search).toHaveValue("曹妃甸");
  await expect(newbieChip).toHaveAttribute("data-selected", "true");
});

test("shore and boat list states stay isolated", async ({ page }) => {
  await page.goto("/shore/");

  const shoreSearch = page.getByPlaceholder("搜索钓点、区域、目标鱼");
  await shoreSearch.fill("曹妃甸");
  await page.getByRole("button", { name: "京唐港" }).click();

  await page.goto("/boat/");

  const boatSearch = page.getByPlaceholder("搜索钓点、区域、目标鱼");
  await expect(boatSearch).toHaveValue("");
  await expect(page.getByRole("button", { name: "清空筛选" })).toBeHidden();
});

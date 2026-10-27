// 展示姓名集中在此修改；同时修改 index.html 可兼容禁用 JavaScript 的浏览器。
const PROFILE = { name: "崔暄奇" };
document.querySelectorAll("[data-name]").forEach(element => { element.textContent = PROFILE.name; });
document.title = `${PROFILE.name} | 个人主页`;
document.getElementById("year").textContent = new Date().getFullYear();
const links = [...document.querySelectorAll("nav a")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    links.forEach(link => {
      const active = link.hash === `#${visible[0].target.id}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-5% 0px -35% 0px" });
  document.querySelectorAll("main section").forEach(section => observer.observe(section));
}


// 中文为源文案；只替换文本节点，保留链接、日期标签和现有页面结构。
const japanese = {
  "基本情况": "基本情報",
  "学历学位": "学歴・学位",
  "爱好": "趣味",
  "所属": "所属",
  "学习方向": "専攻分野",
  "家乡": "出身地",
  "电话": "電話",
  "邮箱": "メール",
  "京都情报大学院大学（KCGI）": "京都情報大学院大学（KCGI）",
  "京都情报大学院大学": "京都情報大学院大学",
  "人工智能": "人工知能",
  "辽宁省辽阳市": "中国・遼寧省遼陽市",
  "— 至今": "— 現在",
  "人工智能 · 硕士在读": "人工知能 · 修士課程在学中",
  "尾道市立大学": "尾道市立大学",
  "经济信息学部 · 情报专攻": "経済情報学部 · 情報専攻",
  "大连外国语大学": "大連外国語大学",
  "软件学院 网络工程": "ソフトウェア学院 ネットワーク工学",
  "滑雪": "スキー",
  "双板滑雪，持有 CSIA Level 1、SAJ 2级资格。": "CSIA Level 1・SAJ 2級取得。",
  "· 个人主页": "· プロフィール"
};
const translatedNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (node.parentElement.closest("script, style, .language-switch")) continue;
  const key = node.nodeValue.trim();
  if (Object.prototype.hasOwnProperty.call(japanese, key)) {
    translatedNodes.push({ node, original: node.nodeValue, key });
  }
}
function setLanguage(language) {
  const isJapanese = language === "ja";
  translatedNodes.forEach(({ node, original, key }) => {
    node.nodeValue = isJapanese ? original.replace(key, japanese[key]) : original;
  });
  document.documentElement.lang = isJapanese ? "ja" : "zh-CN";
  document.title = `${PROFILE.name} | ${isJapanese ? "プロフィール" : "个人主页"}`;
  document.querySelector('meta[name="description"]').content = isJapanese
    ? `${PROFILE.name}の基本情報・学歴・趣味` : `${PROFILE.name}的基本情况、学历学位与个人爱好`;
  document.querySelector(".profile-header").setAttribute("aria-label", isJapanese ? "プロフィール" : "个人简介");
  document.querySelector("nav").setAttribute("aria-label", isJapanese ? "ページナビゲーション" : "页面导航");
  document.querySelectorAll("[data-lang]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === language));
  });
  try { localStorage.setItem("profile-language", language); } catch (_) { /* 本地文件禁用存储时仍可切换。 */ }
}
document.querySelectorAll("[data-lang]").forEach(button => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});
let savedLanguage = "zh";
try { if (localStorage.getItem("profile-language") === "ja") savedLanguage = "ja"; } catch (_) {}
setLanguage(savedLanguage);


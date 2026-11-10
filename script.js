// Site settings: edit these in one place.
const SITE = {
  // Archie's Rare Village donation page. Every Donate button links here.
  // While empty, Donate buttons just scroll to the Donate section.
  donateUrl: "",

  // Fundraising numbers (plain numbers, no $ or commas), e.g. goal: 250000.
  // The stats, progress bar and goal amounts stay hidden until ALL THREE are set.
  goal: null,
  raised: null,
  supporters: null,

  // Shows the "Contact Us" card when set, e.g. "family@example.com".
  contactEmail: "family@archiesarmor.com",

  // Family Journal: the Google Sheet's "Publish to web" CSV link
  // (File → Share → Publish to web → choose the sheet → "Comma-separated values (.csv)").
  // Columns: Date | Category | Title | Summary | Full update | Show
  updatesCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5RwyK5KhsUI01QID50X2IgGAEns9kwpPrDH2X863QbQrRCCBHzrlAemunXYzlGkmLikkZqwVRqMAh/pub?gid=0&single=true&output=csv",

  // How many updates to show before the "View all updates" button.
  updatesToShow: 3,
};

// Donate buttons → Rare Village
if (SITE.donateUrl) {
  document.querySelectorAll("[data-donate]").forEach((link) => {
    link.href = SITE.donateUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

// Fundraising stats and progress bar
if (SITE.goal && SITE.raised != null && SITE.supporters != null) {
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const percent = Math.min(100, Math.round((SITE.raised / SITE.goal) * 100));
  const values = {
    goal: money(SITE.goal),
    raised: money(SITE.raised),
    supporters: SITE.supporters.toLocaleString("en-US"),
    percent: percent + "%",
  };
  document.querySelectorAll("[data-stat]").forEach((el) => {
    el.textContent = values[el.dataset.stat];
  });
  document.querySelectorAll("[data-progress]").forEach((el) => {
    el.style.width = percent + "%";
  });
  document.querySelectorAll("[data-fund-only]").forEach((el) => (el.hidden = false));
}

// Contact card
if (SITE.contactEmail) {
  document.querySelector("[data-contact-link]").href = "mailto:" + SITE.contactEmail;
  document.querySelector("[data-contact]").hidden = false;
}

// Mobile menu
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  })
);

// Family Journal: load updates from the Google Sheet

// Turns CSV text into rows of cells (handles quotes, commas and line breaks inside cells).
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// Accepts "11/8/2026", "2026-11-08", "November 8, 2026", etc.
function parseDate(text) {
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const d = iso ? new Date(+iso[1], iso[2] - 1, +iso[3]) : new Date(text);
  return isNaN(d) ? null : d;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderUpdate(u) {
  const card = el("article", "card update");

  const meta = el("div", "update-meta");
  if (u.category) meta.append(el("span", "tag", u.category));
  if (u.category && u.dateText) meta.append(" • ");
  if (u.dateText) {
    const time = el("time", "", u.date
      ? u.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : u.dateText);
    if (u.date) time.dateTime = u.date.toISOString().slice(0, 10);
    meta.append(time);
  }
  card.append(meta, el("h3", "", u.title));
  if (u.summary) card.append(el("p", "", u.summary));

  if (u.full) {
    const details = el("details");
    const summary = el("summary", "", "Read Full Journal ");
    summary.append(el("i", "fa-solid fa-chevron-right"));
    details.append(summary);
    // Blank lines in the cell become separate paragraphs.
    u.full.split(/\n\s*\n/).forEach((para) => details.append(el("p", "", para.trim())));
    card.append(details);
  }
  return card;
}

async function loadUpdates() {
  const list = document.getElementById("updates-list");
  const moreWrap = document.querySelector(".updates-more");
  const moreBtn = document.getElementById("updates-more-btn");
  const showMessage = (msg) => list.replaceChildren(el("p", "updates-empty", msg));

  if (!SITE.updatesCsvUrl) return showMessage("Updates coming soon. Check back for news on Archie’s journey.");

  try {
    const res = await fetch(SITE.updatesCsvUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const [header, ...rows] = parseCsv(await res.text());

    // Find columns by header name, so column order in the sheet doesn't matter.
    const key = (h) => h.toLowerCase().replace(/[^a-z]/g, "");
    const col = Object.fromEntries(header.map((h, i) => [key(h), i]));
    const get = (row, name) => (row[col[name]] ?? "").trim();

    const updates = rows
      .map((r) => ({
        dateText: get(r, "date"),
        date: parseDate(get(r, "date")),
        category: get(r, "category"),
        title: get(r, "title"),
        summary: get(r, "summary"),
        full: get(r, "fullupdate"),
        show: get(r, "show").toLowerCase(),
      }))
      // A row appears when it has a title and Show is Yes (blank Show also counts as yes).
      .filter((u) => u.title && !["no", "n", "false", "hide"].includes(u.show))
      .sort((a, b) => (b.date || 0) - (a.date || 0)); // newest first

    if (!updates.length) return showMessage("Updates coming soon. Check back for news on Archie’s journey.");

    const firstFew = updates.slice(0, SITE.updatesToShow);
    list.replaceChildren(...firstFew.map(renderUpdate));

    if (updates.length > firstFew.length) {
      moreBtn.textContent = `View all updates (${updates.length})`;
      moreWrap.hidden = false;
      moreBtn.onclick = () => {
        list.replaceChildren(...updates.map(renderUpdate));
        moreWrap.hidden = true;
      };
    }
  } catch (err) {
    console.error("Could not load updates:", err);
    showMessage("Updates are temporarily unavailable. Please check back soon.");
  }
}
loadUpdates();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Share button: native share sheet on phones, copy link on desktop.
const shareStatus = document.getElementById("share-status");
document.getElementById("share-button").addEventListener("click", async () => {
  const shareData = {
    title: "Archie's Armor",
    text: "Help fund personalized genetic medicine for Archie's rare CACNA1A variant.",
    url: window.location.href.split("#")[0],
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      shareStatus.textContent = "Link copied!";
      setTimeout(() => (shareStatus.textContent = ""), 2500);
    }
  } catch {
    // User closed the share sheet; nothing to do.
  }
});

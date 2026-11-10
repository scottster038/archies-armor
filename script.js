// ─────────────────────────────────────────────────────────────
// Site settings: edit these in one place.
// ─────────────────────────────────────────────────────────────
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
  contactEmail: "",
};
// ─────────────────────────────────────────────────────────────

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

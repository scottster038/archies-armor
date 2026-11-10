// ─────────────────────────────────────────────────────────────
// Site settings — edit these in one place.
// ─────────────────────────────────────────────────────────────

// TODO: paste Archie's Rare Village donation page URL here.
// Every element with a `data-donate` attribute will link to it.
// While this is empty, Donate buttons just scroll to the Donate section.
const DONATE_URL = "";

// ─────────────────────────────────────────────────────────────

// Point every Donate button at Rare Village (once the URL is set).
if (DONATE_URL) {
  document.querySelectorAll("[data-donate]").forEach((link) => {
    link.href = DONATE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Share button: native share sheet on phones, copy link on desktop.
const shareButton = document.getElementById("share-button");
const shareStatus = document.getElementById("share-status");

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "Archie's Armor",
    text: "Help us build Archie's armor — read his story with CACNA1A.",
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

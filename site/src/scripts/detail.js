const nextLink = document.querySelector("[data-next-link]");
const verificationToggle = document.querySelector("[data-toggle-verify]");
const verificationPanel = document.querySelector("[data-verify-panel]");

if (verificationToggle && verificationPanel) {
  verificationToggle.addEventListener("click", () => {
    const expanded = verificationToggle.getAttribute("aria-expanded") === "true";
    verificationToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
    verificationPanel.hidden = expanded;
  });
}

if (nextLink) {
  nextLink.addEventListener("click", () => {
    sessionStorage.removeItem(`${document.body.getAttribute("data-mode-page-key")}:scroll`);
  });
}

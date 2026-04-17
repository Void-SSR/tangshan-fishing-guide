const pageKey = document.body.getAttribute("data-page-key");
const searchInput = document.querySelector("[data-search-input]");
const cards = [...document.querySelectorAll("[data-spot-card]")];
const resultCounter = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");
const resetButton = document.querySelector("[data-reset-filters]");

const groupSelections = new Map();

function storageKey(suffix) {
  return `${pageKey}:${suffix}`;
}

function normalize(value) {
  return (value || "").trim().toLowerCase();
}

function tokenize(value) {
  return normalize(value).split("|").filter(Boolean);
}

function readState() {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey("filters")) || "{}");
  } catch {
    return {};
  }
}

function writeState(state) {
  sessionStorage.setItem(storageKey("filters"), JSON.stringify(state));
}

function writeScrollPosition() {
  sessionStorage.setItem(storageKey("scroll"), String(window.scrollY));
}

function readScrollPosition() {
  return Number(sessionStorage.getItem(storageKey("scroll")) || 0);
}

function applyChipSelection(button, selected) {
  button.setAttribute("data-selected", selected ? "true" : "false");
  button.setAttribute("aria-pressed", selected ? "true" : "false");
}

function activeFilters() {
  const filters = {};
  groupSelections.forEach((value, key) => {
    if (value) {
      filters[key] = value;
    }
  });
  return filters;
}

function filterCard(card, searchTerm, filters) {
  const haystack = normalize(card.getAttribute("data-search"));
  const searchMatches = !searchTerm || haystack.includes(searchTerm);

  if (!searchMatches) {
    return false;
  }

  return Object.entries(filters).every(([key, value]) => {
    const raw = card.getAttribute(`data-filter-${key}`) || "";
    return tokenize(raw).includes(normalize(value));
  });
}

function refreshList() {
  const searchTerm = normalize(searchInput?.value || "");
  const filters = activeFilters();
  const hasActiveState = Boolean(searchTerm || Object.keys(filters).length);

  let visibleCount = 0;

  cards.forEach((card) => {
    const visible = filterCard(card, searchTerm, filters);
    card.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  if (resultCounter) {
    resultCounter.textContent = `${visibleCount} 个钓点`;
  }

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }

  if (resetButton) {
    resetButton.hidden = !hasActiveState;
  }

  writeState({
    search: searchInput?.value || "",
    filters
  });
}

function resetAllFilters() {
  if (searchInput) {
    searchInput.value = "";
  }

  groupSelections.clear();
  document.querySelectorAll("[data-filter-chip]").forEach((chip) => {
    applyChipSelection(chip, false);
  });

  refreshList();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindChips() {
  document.querySelectorAll("[data-filter-chip]").forEach((button) => {
    const group = button.getAttribute("data-group");
    const value = button.getAttribute("data-value");

    button.addEventListener("click", () => {
      const current = groupSelections.get(group);
      const next = current === value ? "" : value;
      if (next) {
        groupSelections.set(group, next);
      } else {
        groupSelections.delete(group);
      }

      document
        .querySelectorAll(`[data-filter-chip][data-group="${group}"]`)
        .forEach((chip) => {
          applyChipSelection(chip, chip.getAttribute("data-value") === next);
        });

      refreshList();
    });
  });
}

function restoreState() {
  const state = readState();

  if (searchInput && state.search) {
    searchInput.value = state.search;
  }

  if (state.filters) {
    Object.entries(state.filters).forEach(([key, value]) => {
      groupSelections.set(key, value);
      document
        .querySelectorAll(`[data-filter-chip][data-group="${key}"]`)
        .forEach((chip) => {
          applyChipSelection(chip, chip.getAttribute("data-value") === value);
        });
    });
  }

  document.querySelectorAll(".chip-group").forEach((group) => {
    const anySelected = group.querySelector('[data-filter-chip][data-selected="true"]');
    if (!anySelected) {
      const allChip = group.querySelector('[data-filter-chip][data-value=""]');
      if (allChip) {
        applyChipSelection(allChip, true);
      }
    }
  });

  refreshList();

  const scrollTarget = readScrollPosition();
  if (scrollTarget > 0) {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollTarget, behavior: "auto" });
    });
  }
}

function bindSearch() {
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", refreshList);
}

function bindDetailLinks() {
  document.querySelectorAll("[data-detail-link]").forEach((link) => {
    link.addEventListener("click", writeScrollPosition);
  });
}

function bindResetButton() {
  if (!resetButton) {
    return;
  }

  resetButton.addEventListener("click", resetAllFilters);
}

window.addEventListener("pagehide", writeScrollPosition);

bindChips();
bindSearch();
bindDetailLinks();
bindResetButton();
restoreState();

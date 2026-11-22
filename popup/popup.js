const input = document.querySelector("#zoom-value");
const factorOutput = document.querySelector("#zoom-factor");
const status = document.querySelector("#status");
const applyButton = document.querySelector("#apply");
const resetButton = document.querySelector("#reset");

// A signed level is converted exponentially: +100 doubles, -100 halves.
// The exponent is bounded only at the rendering edge so every finite input
// remains valid without allowing the page to become numerically unusable.
function getScale(value) {
  const exponent = Math.max(-20, Math.min(20, value / 100));
  return 2 ** exponent;
}

function formatScale(scale) {
  const percent = scale * 100;
  if (percent >= 10000 || percent < 0.01) return percent.toExponential(2) + "%";
  return percent.toFixed(percent < 0.1 ? 3 : 1).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1") + "%";
}

function updatePreview() {
  const value = input.valueAsNumber;
  if (!Number.isFinite(value)) {
    factorOutput.textContent = "—";
    return;
  }
  factorOutput.textContent = formatScale(getScale(value));
}

async function applyZoom(value) {
  if (!Number.isFinite(value)) {
    status.textContent = "Enter a valid number first.";
    input.focus();
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    status.textContent = "No active tab found.";
    return;
  }

  const scale = getScale(value);
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (zoomScale) => {
        const root = document.documentElement;
        // CSS zoom changes layout dimensions as well as visual size. This
        // helps infinite-scroll and lazy-loading pages load more content.
        if (CSS.supports("zoom", "1")) {
          root.style.zoom = String(zoomScale);
          root.style.removeProperty("transform");
          root.style.removeProperty("transform-origin");
          root.style.removeProperty("width");
          root.dataset.infinitePageZoomMode = "css-zoom";
        } else {
          // Compatibility fallback for browsers without CSS zoom support.
          root.style.zoom = "";
          root.style.transform = `scale(${zoomScale})`;
          root.style.transformOrigin = "top left";
          root.style.width = `${100 / zoomScale}%`;
          root.dataset.infinitePageZoomMode = "transform";
        }
        root.dataset.infinitePageZoom = "true";
      },
      args: [scale]
    });
    status.textContent = value === 0
      ? "Page returned to 100%."
      : `Applied ${formatScale(scale)} page zoom.`;
  } catch (error) {
    status.textContent = "This page does not allow extensions to change its zoom.";
  }
}

input.addEventListener("input", updatePreview);
applyButton.addEventListener("click", () => applyZoom(input.valueAsNumber));
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyZoom(input.valueAsNumber);
});
resetButton.addEventListener("click", () => {
  input.value = "0";
  updatePreview();
  applyZoom(0);
});

updatePreview();

# Infinite Page Zoom

A lightweight Manifest V3 browser extension that applies a signed numeric zoom level to the active tab.

## Use

1. Load this folder as an unpacked extension from `chrome://extensions` (or the equivalent extensions page in your browser).
2. Open a normal website and click the extension icon.
3. Enter a number and click **Apply zoom** (or press Enter).
4. Click **100% reset** or enter `0` to restore normal size.

## Zoom scale

- `0` = 100% (normal size)
- `100` = 200% (twice as large)
- `-100` = 50% (half size)
- `200` = 400%
- `-200` = 25%
- Approximately `-1329` = 0.01%

Every finite positive or negative number is accepted. The conversion is exponential, so the zoom factor is always positive. For browser rendering stability, the resulting scale is bounded between `2^-20` and `2^20`; this is a rendering limit, not an input-value limit.

The extension applies CSS `zoom` to `document.documentElement`. Unlike `transform: scale()`, CSS zoom changes the page's layout size as well as its visual size, which can help infinite-scroll and lazy-loading pages discover and load more content when zoomed far out. Browsers without CSS zoom support use a transform-based compatibility fallback.

The extension uses the `activeTab` and `scripting` permissions only. It applies zoom to the currently active page when you explicitly click Apply, and does not request access to every website.

Some protected browser pages (such as the extension store or internal browser settings) cannot be modified by extensions.

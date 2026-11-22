# Infinite Page Zoom

A lightweight Manifest V3 browser extension that applies a signed numeric zoom level to the active tab.

## Use

1. Load this folder as an unpacked extension from `chrome://extensions` (or the equivalent extensions page in your browser).
2. Open a normal website and click the extension icon.
3. Enter a number and click **Apply zoom** (or press Enter).
4. Use **Reset** or enter `0` to restore normal size.

## Zoom scale

- `0` = 100% (normal size)
- `100` = 200% (twice as large)
- `-100` = 50% (half size)
- `200` = 400%
- `-200` = 25%

Every finite positive or negative number is accepted. The conversion is exponential, so the zoom factor is always positive. For browser rendering stability, the resulting CSS zoom is bounded between approximately 1e-6 and 1e6; this is a rendering limit, not an input-value limit.

The extension uses the `activeTab` and `scripting` permissions only. It applies CSS zoom to the currently active page when you explicitly click Apply, and does not request access to every website.

Some protected browser pages (such as the extension store or internal browser settings) cannot be modified by extensions.

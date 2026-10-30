# MIGLICK constructor

The user authorized renaming MiniBrick to MIGLICK and redesigning its interface to match the MIGLIK landing palette, with intuitive mobile and desktop flows. Preserve existing real assets, prices, VK contact, rendering, drag positions, drafts and export. Original v7 backup: ../outputs/MiniBrick-v7-before-MIGLICK-2026-10-28.zip.

Architecture: index.html is the semantic shell; engine.js contains retained composition/catalog/export logic with stability fixes; renderer-legacy.css retains asset positioning styles; studio.css owns the new interface and responsive layouts; studio.js owns navigation guidance, accessibility and modal focus. Fonts are local. Do not claim order submission: current flow exports/copies the design and links to the existing VK contact.

Use the cream #F8F7F2, ink #26263A, violet #6654F4, lavender #F1EAF1 palette. No blocking introduction or decorative studio scene. Keep the figure visible at a stable scale. Desktop uses people / preview / editor; mobile uses preview / person strip / details with persistent next/back buttons. No touch hover effects or animated keyboard actions.

Do not publish over the existing GitHub app until local checks and UI validation pass. Preserve old version archive.

Mobile hair controls must anchor inside viewer at its right edge with explicit top:auto, width:auto and static label, without overlapping figure or people strip. User screenshot is source of reported issue.

User requested a branded entry loading screen. loader.css/loader.js own a cream/violet typographic loading state with actual catalog/font/visible-image readiness, bounded waits, reduced motion and retry if app startup fails. No onboarding questions. Original archive remains untouched.

Loading follow-up: user explicitly wants to wait for all assets. Loader preloads all 64 valid shipped images and four local font subsets with six concurrent requests and real completed/total progress. Do not reveal on a short timeout. Failure keeps loader with retry; a cached visit still has a 1.8-second minimum. Static images/fonts use the versioned scoped cache to avoid downloading them again on selection.

User requested a left-to-right sheen on MIGLICK while loading. Use a clipped light band over stationary text, respect reduced motion. Red background filenames use red.jpg aliases to avoid GitHub Unicode URL mismatches; keep existing catalog ids for saved drafts.

## Completion redesign — 2026-10-29
Follow the user completion brief: real cropped frame render on #EEE9F5; dynamic specs and frame/figure/options breakdown sourced from existing pricing; main Continue opens the existing payment/copy/VK workflow, never fake submission. Share-card generation remains unchanged, lazy and secondary; keep 10% VK terms, never apply automatically. completion.js/css own the new dialog. Preserve drafts and original exporter/calculation bodies. Defer closing only while the original snapshot exporter temporarily owns renderer state, then restore focus. Support 320/375/390/430 px, sticky footer, Escape, preview retry and reduced motion.

## Default editor — 2026-10-29
User authorized integrating the continued redesign. Editorial shell is now the local default; ?ux=legacy retains the previous shell for rollback. Preserve original asset hashes, pricing and checkout transport. Do not delete a cart frame while it is being edited or switch to another cart edit before saving/cancelling. Browser revalidation of this default activation remains pending because the browser connection became unavailable; do not claim deployment or completed visual QA.

## Mobile clarity — 2026-10-29
User found both website and constructor confusing on mobile and authorized redesign plus immediate publication after checks. Supersedes earlier mobile side-by-side hero preference: show the real heroine prominently first, then compact readable headline and one CTA. Mobile outfit selection is manual to avoid surprises while scrolling. Constructor has a sticky large preview, compact six existing categories, one primary action; final step saves to multi-frame cart before existing checkout. Keep all original catalog/options/calculator/export and VK integration. Test actual DOM flows and responsive geometry, and explicitly distinguish browser viewport testing from physical iPhone Safari.

## Selected full redesign — 2026-10-30
Latest user brief docs/redesign-2026-10-30/user-brief.md and selected concept 01 supersede earlier violet / six-step shell directions. Runtime: fonts.css, renderer-core.css, guided.css/js, guided-model.js, media-store.js, boot.js. Preserve all 77 original assets and actual pricing/export. Original layer geometry remains; thumbnails and whole-frame previews include prints. Five stages and separate active-hero zoom. Photo blobs stay in IndexedDB. Keep homepage miglik/ unchanged. See README and design-qa.md for actual tests and limitations.

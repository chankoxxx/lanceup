# Design QA

- Source visual truth: `C:\Users\H830_\AppData\Local\Temp\codex-clipboard-c2d84cb1-c659-4e96-9d18-6ae1d671224f.png`
- Implementation: `http://localhost:3001/` (CUA in-app browser capture; the browser API did not expose a filesystem screenshot path)
- Viewport: 1920 × 900 CSS px, device scale factor 1
- Source pixels: 1912 × 937
- Implementation capture: 1920 × 900 CSS px, normalized by matching the desktop viewport width
- State: landing page, top of page, desktop fixed inquiry panel visible

## Full-view comparison evidence

The source showed the hero heading extending behind the fixed 40vw inquiry panel and being clipped at the left-column boundary. In the revised capture, the two heading lines fit inside the 1145px content region and remain visually centered. The inquiry panel stays fixed at 760px and the page has no horizontal overflow (`scrollWidth: 1905`, `clientWidth: 1905`).

## Focused region comparison evidence

The hero/title region was checked at 1500, 1600, 1920, and 2560px. At 1920px, the title occupies x=47.8–935.6 while the inquiry panel begins at x=1144.7, leaving clear separation. At 1500px, the title occupies x=28.4–801.7 while the panel begins at x=884.7. No additional focused region was needed because the change only affects desktop hero typography.

## Findings

- Earlier P1: desktop hero heading overflowed beneath the fixed inquiry panel and lost text.
  - Fix: constrained desktop hero type to `clamp(3.15rem, 3.25vw, 4rem)` when the fixed panel is active and reduced desktop inline padding.
  - Post-fix evidence: heading bounds stay within the content column at every tested desktop breakpoint; no page-level horizontal overflow.
- Fonts and typography: hierarchy, weight, line-height, and intended two-line title wrapping are preserved; only the oversized desktop scale was corrected.
- Spacing and layout rhythm: left content and 40vw inquiry panel no longer collide; existing header, hero, CTA, illustration, and form alignment are preserved.
- Colors and visual tokens: unchanged from the source implementation.
- Image quality and asset fidelity: the existing supplied hero illustration is unchanged and remains fully visible.
- Copy and content: unchanged; the complete headline is now visible.

## Comparison history

1. Source: P1 clipping at the desktop split boundary.
2. Revision: responsive desktop font sizing and padding constraint added.
3. Post-fix capture: complete heading visible with clear space before the inquiry panel at 1500–2560px.

## Follow-up polish

No actionable P0/P1/P2 findings remain for this regression.

final result: passed

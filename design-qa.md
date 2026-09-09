# Design QA

- Source visual truth: `C:/Users/H830_/AppData/Local/Temp/codex-clipboard-42d636b5-f041-47a1-b559-2930def5dd74.png`
- Implementation: `http://localhost:3001/` (Codex in-app browser capture)
- Viewports: desktop 1440 × 1000 CSS px; mobile 390 × 844 CSS px
- Density: browser CSS-pixel comparison; source was used as a layout reference rather than a pixel-identical target
- State: LP initial view and right-panel Step 1; right-panel handoff to `/check` also tested

## Full-view comparison evidence

The reference establishes a persistent right-hand application form beside the scrolling content. The implementation now follows that composition at desktop widths with a 400px fixed form rail, while retaining the existing navy/orange brand and the project’s four-step funnel. The Hero was intentionally strengthened beyond the pale reference background so the approved main message remains the dominant element.

## Focused region evidence

- Hero: two-line desktop title at 970px width, orange emphasis and underline on “フリーランスとして”, high-contrast navy/teal background.
- Fixed form: full-height 400px rail, actual experience/technology inputs, progress, validation and working handoff to `/check` with answers preserved.
- Mobile: fixed rail becomes a bottom CTA; the title is split into four meaningful lines without breaking Japanese words.

## Findings and iteration history

1. P1 — the first implementation used a small link card rather than an input form. Fixed by replacing it with a functional fixed form rail.
2. P1 — the Hero message lacked contrast and scale. Fixed with a dark brand field, larger type and orange emphasis.
3. P2 — the existing Hero information card became too narrow beside the fixed form. Fixed by removing that redundant card at desktop widths and giving the headline the full content column.
4. P2 — the mobile headline broke “通用” across lines. Fixed with phrase-level wrapping rules.
5. P1 — the first sidebar step navigated away from the LP. Fixed by embedding the complete four-step form in the fixed rail; browser verification confirmed Step 1 → Step 2 with the URL unchanged.
6. P2 — desktop side margins varied too strongly with viewport size. Fixed with a 90% fluid content width inside the main column and a stable 425px form rail.

## Final checks

- Typography: desktop headline is intentionally oversized; body and card copy were increased globally.
- Spacing: desktop content and fixed rail do not overlap; measured body width equals client width.
- Colors: navy, orange, teal, violet and gold remain available and are used across the LP.
- Images: the supplied screenshot did not require recreating its faint decorative imagery; no misleading stock-person imagery was added.
- Copy: approved Japanese message and service claims are preserved.
- Interaction: all four steps remain inside the fixed right panel until successful submission; no browser console warnings or errors.

final result: passed

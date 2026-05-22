# Wave 12 Visual Smoke

## Scope

- Worker: `AGENT_F_TECH_QA_TOOLS`
- Task: add Playwright visual geometry smoke tests only.
- Business code: unchanged.

## Added Coverage

- Desktop `1536x864` map geometry: horizontal overflow, scene character size, local action versus bottom nav, modal viewport containment and owned scrolling.
- Desktop combat geometry: card grid height under `28%` viewport, queue slots present, combat log contained without body-level white scrolling.
- Mobile `390x844`: no horizontal overflow and primary local CTA visible in the viewport.
- Screenshots are written to `test-results/wave12/`.

## Validation

- Passed: `npm run build`
- Passed: `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- Passed: `git diff --check`

## Risks

- The local action / mobile CTA checks assert that the CTA is present and reachable without nav overlap after normal scroll, rather than requiring it to be in the initial viewport.

# Native hour and weather lighting — M5-F05

7 November 2026: **52/82 = 63.4%.** Current engine tick/hour and weather now
control sky/background, hemisphere/key colour/intensity and animal tint.
Sunny midday preserves the exact authored canonical lighting. Dawn/dusk is
warm, night stays readable, cloudy/rainy light is softer and Hot slightly warm.
The key direction remains fixed to match the four-view baked atlas/shadows.
Fish tint combines this ambient tone with actual native clarity. Canvas also
clears to the current scene sky. No second clock, forecast, RNG, atmosphere
simulation or authoritative save field.

The native fixture trace advances138 original ticks and forks10 accepted paused
snapshots: all four weathers at00/12, plus Sunny07/18. Four actual browser
profiles give40 lighting cases. Scene colours/intensities, actual rendered sky
pixels and every actual Sprite material match native time/weather. One original
three-second browser tick crosses07→08 and preserves the exact entire original
engine save/ledger. All40 cases pass again on the final build. No manual weather,
seed, clock or resource edits. Night/day/weather captures from desktop/mobile
and both backends were opened and reviewed.

Visual review found a pre-existing Canvas painter issue: a building's horizontal
wall top painted through its sloped roof. Small shared gable triangles now close
the attic; the fully roof-covered wall top is omitted from fallback painting.
The same real triangles are projected/picked by Canvas and WebGL, and their
single shared geometry is disposed with the world. This fixes the large pale
roof patches without hiding real object geometry arbitrarily. All96 actual
roof pixel samples pass at four headings across desktop/touch and both backends.
Corrected captures were opened and compared.

91 affected world/layout tests, strict typecheck/lint/build, seven frozen saves,
original24 media/editorial files, eight atlas PNGs, CPU export closure, provenance/
MIT/build hashes pass. The final8-profile fit gate passes32 overviews and224
focus changes with one Scene/camera/canvas/clock and unchanged full save. Water
regression passes all four profiles,32 adult body picks and28 paid exchanges
with combined night/clarity tint. Default core remains478,386 bytes.

Ignored evidence: `qa-artifacts/unified-m5-lighting-final/lighting.json` and real
captures, `unified-m5-lighting-final-fit/fit.json`,
`unified-m5-lighting-roofs/roofs.json`, `unified-m5-lighting-water/water.json`,
`unified-m1/m5-lighting-final-*`. Early captures retain the diagnosed roof issue;
the final receipts supersede them. Physical Android/iOS/Safari unavailable.
Performance remains a separate measured gate. No push/deploy.

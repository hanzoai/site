# Request: stacked PinScenes keep a 60px offset on phones (from the /billing owner, 7 Nov)

In `components/v2/x-hamilton/Launch.css`, `.l2-pin-stick` keeps `top: 60px` when the pin is stacked (not sticky) on
phones, so each stacked chapter is pushed 60px down and the last one slides under the next section.
Asked: `.l2-pin.stack .l2-pin-stick { top: 0 }`. /billing patches it page-locally under `.bl2`.

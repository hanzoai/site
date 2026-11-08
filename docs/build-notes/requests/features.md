# /features (8 Nov)

Resolved on the page: hanzo.ai/features wraps its whole shell (header, page, footer) in an outer <main>, so copycheck counts its 28 footer lines as page copy. /features now moves the shared footer into its own <main> while mounted (useFooterInMain in Features.jsx) and puts it back on unmount; copycheck reads missing 0 of 53. No shared change needed.

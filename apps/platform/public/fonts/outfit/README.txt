Place Outfit font files here:
Self-hosted Outfit font files
================================

Place the following woff2 files (case sensitive) in this folder:

	Outfit-Regular.woff2   Regular
	Outfit-Medium.woff2    Medium
	Outfit-SemiBold.woff2   SemiBold
	Outfit-Bold.woff2      Bold

Recommended source: https://fonts.google.com/specimen/Outfit
Download the family, extract the woff2 files (latin subset if possible to reduce size) and rename to the pattern above.

Referenced paths in globals.css @font-face declarations:
	/fonts/outfit/Outfit-Regular.woff2
	/fonts/outfit/Outfit-Medium.woff2
	/fonts/outfit/Outfit-SemiBold.woff2
	/fonts/outfit/Outfit-Bold.woff2

Add more weights by duplicating an @font-face rule and adjusting font-weight + filename.

You can get them from Google Fonts or the official repository and convert to .woff2 if needed.

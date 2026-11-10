# archies-armor
Source code for Archie's donation website, hosted on GitHub Pages.

No build step: plain HTML/CSS/JS. Open `index.html` in a browser to preview.

## Where to edit
| What | File |
|---|---|
| Story, timeline, CACNA1A text, "how your gift helps" cards | `index.html` (look for `TODO` and `[bracketed]` placeholders) |
| Rare Village donation link (updates every Donate button) | `DONATE_URL` at the top of `script.js` |
| Colors and fonts | variables at the top of `styles.css` |
| Logo (vector) | `assets/archies-armor-logo.svg` (also inlined in the hero of `index.html`) |
| Browser tab icon | `assets/favicon.svg` |
| Photos | put them in an `images/` folder and swap out the `.photo-placeholder` div |

## Custom domain
When you buy a domain, add it under **Settings → Pages → Custom domain** (GitHub creates a `CNAME` file),
then update the `og:url` / `og:image` URLs in `index.html`.
